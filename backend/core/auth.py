import os
from functools import wraps

import jwt
import requests
from dotenv import load_dotenv
from flask import jsonify, request

load_dotenv()


class AuthService:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        self.default_role = os.getenv("DEFAULT_ROLE", "user")
        self.admin_role = os.getenv("ADMIN_ROLE", "admin")
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

    def resolve_role(self, payload):
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
