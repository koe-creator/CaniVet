import base64
import json
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"), override=True)

from datetime import datetime, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from werkzeug.exceptions import HTTPException
from core.auth import auth_service

app = Flask(__name__)
app.url_map.strict_slashes = False  # evita redirect 308 que bloquea CORS preflight

_cors_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173")
_cors_origins = [o.strip() for o in _cors_raw.split(",") if o.strip()]
CORS(app, resources={r"/*": {"origins": _cors_origins}}, supports_credentials=False)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_JWKS_URL = f"{SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json" if SUPABASE_URL else None
ADMIN_ROLE = os.getenv("ADMIN_ROLE", "admin")
ADMIN_PATH = os.getenv("ADMIN_PATH", "/admin")
USER_PATH  = os.getenv("USER_PATH", "/")

_jwks_cache = {"keys": [], "fetched_at": None}

@app.errorhandler(Exception)
def handle_error(err):
    if isinstance(err, HTTPException):
        return jsonify({"error": err.name, "detail": err.description}), err.code
    return jsonify({"error": "server_error", "detail": str(err)}), 500


@app.route("/auth/login", methods=["OPTIONS"])
@app.route("/auth/register", methods=["OPTIONS"])
@app.route("/auth/redirect", methods=["OPTIONS"])
@app.route("/auth/me", methods=["OPTIONS"])
def auth_options():
    return ("", 204)

def _now_iso():
    return datetime.now(timezone.utc).isoformat()

def _get_bearer_token():
    return auth_service.get_bearer_token()

def _get_jwk_for_kid(kid):
    if not SUPABASE_JWKS_URL:
        return None
    # basic cache; Supabase keys rotate infrequently
    if not _jwks_cache["keys"]:
        res = requests.get(SUPABASE_JWKS_URL, timeout=10)
        res.raise_for_status()
        _jwks_cache["keys"] = res.json().get("keys", [])
    for k in _jwks_cache["keys"]:
        if k.get("kid") == kid:
            return k
    # refetch once in case of rotation
    res = requests.get(SUPABASE_JWKS_URL, timeout=10)
    res.raise_for_status()
    _jwks_cache["keys"] = res.json().get("keys", [])
    for k in _jwks_cache["keys"]:
        if k.get("kid") == kid:
            return k
    return None

def _decode_jwt(token):
    return auth_service.decode_jwt(token)

def _decode_unverified(token):
    try:
        if "." in token:
            header_part = token.split(".")[0]
            header = json.loads(base64.urlsafe_b64decode(header_part + "=" * (-len(header_part) % 4)).decode("utf-8"))
        else:
            header = {}
    except Exception:
        header = {}
    try:
        if token.count(".") >= 2:
            payload_part = token.split(".")[1]
            payload = json.loads(base64.urlsafe_b64decode(payload_part + "=" * (-len(payload_part) % 4)).decode("utf-8"))
        else:
            payload = {}
    except Exception:
        payload = {}
    return header, payload

def _extract_role(payload):
    return auth_service._extract_role(payload)

def _is_admin_email(email):
    return auth_service._is_admin_email(email)

def _resolve_role(payload):
    return auth_service.resolve_role(payload)

def _supabase_headers():
    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }

def _supabase_post(path, payload):
    url = f"{SUPABASE_URL.rstrip('/')}{path}"
    res = requests.post(url, json=payload, headers=_supabase_headers(), timeout=20)
    data = res.json() if res.content else {}
    if not res.ok:
        msg = data.get("error_description") or data.get("msg") or data.get("error") or "Supabase error"
        return None, msg, res.status_code, data
    return data, None, res.status_code, data

# ── HEALTH ──────────────────────────────────────────
@app.get("/health")
def health():
    return jsonify({"ok": True, "time": _now_iso()})

# ── AUTH ────────────────────────────────────────────
@app.post("/auth/login")
def auth_login():
    if not request.is_json:
        return jsonify({"error": "invalid_body"}), 400
    email    = request.json.get("email")
    password = request.json.get("password")
    if not email or not password:
        return jsonify({"error": "missing_credentials"}), 400
    resp, err, status, raw = _supabase_post(
        "/auth/v1/token?grant_type=password",
        {"email": email, "password": password},
    )
    if err:
        return jsonify({"error": err, "detail": raw}), status
    return jsonify(resp)

@app.post("/auth/register")
def auth_register():
    if not request.is_json:
        return jsonify({"error": "invalid_body"}), 400
    email    = request.json.get("email")
    password = request.json.get("password")
    if not email or not password:
        return jsonify({"error": "missing_credentials"}), 400
    resp, err, status, raw = _supabase_post(
        "/auth/v1/signup",
        {"email": email, "password": password},
    )
    if err:
        return jsonify({"error": err, "detail": raw}), status
    return jsonify(resp)

@app.post("/auth/me")
def auth_me():
    token = _get_bearer_token()
    app.logger.info("AUTH_ME token_present=%s auth_header_len=%s",
                    bool(token),
                    len(request.headers.get("Authorization", "")))
    if not token:
        return jsonify({"error": "missing_token"}), 401
    try:
        payload = _decode_jwt(token)
    except Exception as e:
        if e.__class__.__name__ == "ExpiredSignatureError":
            return jsonify({"error": "token_expired"}), 401
        hdr, payload = _decode_unverified(token)
        app.logger.info("AUTH_ME invalid_token error=%s header=%s payload=%s", str(e), hdr, payload)
        return jsonify({"error": "invalid_token", "detail": str(e)}), 401
    role = _resolve_role(payload)
    return jsonify({
        "user_id": payload.get("sub"),
        "email":   payload.get("email"),
        "role":    role,
    })

@app.post("/auth/redirect")
def auth_redirect():
    token = _get_bearer_token()
    app.logger.info("AUTH_REDIRECT token_present=%s auth_header_len=%s",
                    bool(token),
                    len(request.headers.get("Authorization", "")))
    if not token:
        return jsonify({"error": "missing_token"}), 401
    try:
        payload = _decode_jwt(token)
    except Exception as e:
        if e.__class__.__name__ == "ExpiredSignatureError":
            return jsonify({"error": "token_expired"}), 401
        hdr, payload = _decode_unverified(token)
        app.logger.info("AUTH_REDIRECT invalid_token error=%s header=%s payload=%s", str(e), hdr, payload)
        return jsonify({"error": "invalid_token", "detail": str(e)}), 401
    role        = _resolve_role(payload)
    redirect_to = ADMIN_PATH if role == ADMIN_ROLE else USER_PATH
    return jsonify({"role": role, "redirect_to": redirect_to})

# ── BLUEPRINTS ───────────────────────────────────────
from routes.clientes        import clientes_bp
from routes.mascotas        import mascotas_bp
from routes.citas           import citas_bp
from routes.servicios       import servicios_bp
from routes.pagos           import pagos_bp
from routes.inventario      import inventario_bp
from routes.contact         import contact_bp
from routes.reservas        import reservas_bp
from routes.stripe_payments import stripe_bp
from routes.email_bp        import email_bp

app.register_blueprint(clientes_bp,   url_prefix='/api/clientes')
app.register_blueprint(mascotas_bp,   url_prefix='/api/mascotas')
app.register_blueprint(citas_bp,      url_prefix='/api/citas')
app.register_blueprint(servicios_bp,  url_prefix='/api/servicios')
app.register_blueprint(pagos_bp,      url_prefix='/api/pagos')
app.register_blueprint(inventario_bp, url_prefix='/api/inventario')
app.register_blueprint(contact_bp,    url_prefix='/api/contacto')
app.register_blueprint(reservas_bp,   url_prefix='/api/reservas')
app.register_blueprint(stripe_bp,     url_prefix='/api/stripe')
app.register_blueprint(email_bp,      url_prefix='/api/email')

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
