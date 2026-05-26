import os
from functools import wraps

import jwt
import requests
from dotenv import load_dotenv
from flask import jsonify, request

load_dotenv()

ROLE_ADMIN = "admin"
ROLE_EMPLEADO = "empleado"
ROLE_RECEPCIONISTA = "recepcionista"
ROLE_CLIENTE = "cliente"
STAFF_ROLES = {ROLE_ADMIN, ROLE_EMPLEADO, ROLE_RECEPCIONISTA}


class AuthService:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        self.default_role = os.getenv("DEFAULT_ROLE", ROLE_CLIENTE)
        self.admin_role = os.getenv("ADMIN_ROLE", ROLE_ADMIN)
        self.admin_emails = os.getenv("ADMIN_EMAILS", "")
        self.jwks_url = f"{self.supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json" if self.supabase_url else None
        self._jwks_cache = []

    def get_bearer_token(self):
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            return auth_header.split(" ", 1)[1].strip()

        if request.is_json:
            payload = request.get_json(silent=True) or {}
            token = payload.get("access_token")
            if token:
                return token

        return None

    def _get_jwk_for_kid(self, kid):
        if not self.jwks_url:
            return None

        if not self._jwks_cache:
            response = requests.get(self.jwks_url, timeout=10)
            response.raise_for_status()
            self._jwks_cache = response.json().get("keys", [])

        for key in self._jwks_cache:
            if key.get("kid") == kid:
                return key

        response = requests.get(self.jwks_url, timeout=10)
        response.raise_for_status()
        self._jwks_cache = response.json().get("keys", [])

        for key in self._jwks_cache:
            if key.get("kid") == kid:
                return key

        return None

    def decode_jwt(self, token):
        header = jwt.get_unverified_header(token)
        algorithm = header.get("alg")

        if algorithm == "ES256":
            jwk = self._get_jwk_for_kid(header.get("kid"))
            if not jwk:
                raise ValueError("jwks_key_not_found")
            key = jwt.algorithms.ECAlgorithm.from_jwk(jwk)
            return jwt.decode(token, key=key, algorithms=["ES256"], options={"verify_aud": False})

        return jwt.decode(
            token,
            self.jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )

    def _extract_role(self, payload):
        app_meta = payload.get("app_metadata") or {}
        user_meta = payload.get("user_metadata") or {}
        return app_meta.get("role") or user_meta.get("role") or payload.get("role") or self.default_role

    def _is_admin_email(self, email):
        if not email:
            return False

        allowed = [item.strip().lower() for item in self.admin_emails.split(",") if item.strip()]
        return email.strip().lower() in allowed

    def _load_profile_role(self, user_id):
        if not self.supabase_url or not self.service_role_key or not user_id:
            return None

        response = requests.get(
            f"{self.supabase_url.rstrip('/')}/rest/v1/perfiles",
            params={"select": "rol,estado", "id": f"eq.{user_id}", "limit": "1"},
            headers={
                "apikey": self.service_role_key,
                "Authorization": f"Bearer {self.service_role_key}",
            },
            timeout=10,
        )
        if not response.ok:
            return None

        rows = response.json() or []
        if not rows:
            return None

        profile = rows[0]
        role = str(profile.get("rol") or "").strip().lower()
        if role not in {ROLE_ADMIN, ROLE_EMPLEADO, ROLE_RECEPCIONISTA, ROLE_CLIENTE}:
            return None
        return role

    def resolve_role(self, payload):
        profile_role = self._load_profile_role(payload.get("sub"))
        if profile_role:
            return profile_role
        if self._is_admin_email(payload.get("email")):
            return self.admin_role
        return self._extract_role(payload)

    def authenticate_request(self):
        token = self.get_bearer_token()
        if not token:
            return None, (jsonify({"error": "missing_token"}), 401)

        try:
            payload = self.decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return None, (jsonify({"error": "token_expired"}), 401)
        except Exception as exc:
            return None, (jsonify({"error": "invalid_token", "detail": str(exc)}), 401)

        auth_user = {
            "user_id": payload.get("sub"),
            "email": payload.get("email"),
            "role": self.resolve_role(payload),
            "payload": payload,
        }
        return auth_user, None


auth_service = AuthService()


def require_auth(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        auth_user, error = auth_service.authenticate_request()
        if error:
            return error
        request.auth_user = auth_user
        return view(*args, **kwargs)

    return wrapped


def require_admin(view):
    @wraps(view)
    @require_auth
    def wrapped(*args, **kwargs):
        if getattr(request, "auth_user", {}).get("role") != auth_service.admin_role:
            return jsonify({"error": "forbidden"}), 403
        return view(*args, **kwargs)

    return wrapped


def require_roles(*allowed_roles):
    allowed = {role for role in allowed_roles if role}

    def decorator(view):
        @wraps(view)
        @require_auth
        def wrapped(*args, **kwargs):
            auth_user = getattr(request, "auth_user", {})
            if auth_user.get("role") not in allowed:
                return jsonify({"error": "forbidden", "allowed_roles": sorted(allowed)}), 403
            return view(*args, **kwargs)

        return wrapped

    return decorator
