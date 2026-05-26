import os

import requests
from flask import Blueprint, jsonify, request

from core.auth import (
    ROLE_ADMIN,
    ROLE_CLIENTE,
    ROLE_EMPLEADO,
    ROLE_RECEPCIONISTA,
    require_admin,
)
from core.services import SupabaseEntityService

auth_users_bp = Blueprint("auth_users", __name__)

profiles_service = SupabaseEntityService("perfiles", "created_at", searchable_fields=["nombre", "email", "rol"])

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
ALLOWED_ROLES = {ROLE_ADMIN, ROLE_EMPLEADO, ROLE_RECEPCIONISTA, ROLE_CLIENTE}


def _headers():
    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }


def _normalize_role(value, default=ROLE_CLIENTE):
    role = str(value or "").strip().lower()
    return role if role in ALLOWED_ROLES else default


def _normalize_status(value):
    return "inactivo" if str(value or "").strip().lower() == "inactivo" else "activo"


def _normalize_branch_ids(value):
    if not isinstance(value, list):
        return []
    return [str(item).strip() for item in value if str(item).strip()]


def _profile_payload(data, *, existing=None):
    existing = existing or {}
    role = _normalize_role(data.get("rol") or data.get("role"), existing.get("rol") or ROLE_CLIENTE)
    status = _normalize_status(data.get("estado") or data.get("status") or existing.get("estado"))
    branch_ids = _normalize_branch_ids(data.get("sucursal_ids") or data.get("branch_ids"))
    if role == ROLE_ADMIN:
        branch_ids = []

    return {
        "id": data.get("id") or existing.get("id"),
        "nombre": (data.get("nombre") or data.get("name") or existing.get("nombre") or "").strip(),
        "email": (data.get("email") or existing.get("email") or "").strip().lower(),
        "rol": role,
        "estado": status,
        "sucursal_ids": branch_ids,
    }


@auth_users_bp.route("/", methods=["GET"])
@require_admin
def list_users():
    try:
        records = profiles_service.list_records(search=request.args.get("search"), descending=True)
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@auth_users_bp.route("/", methods=["POST"])
@require_admin
def create_user():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()
    nombre = (data.get("nombre") or data.get("name") or "").strip()

    if not email or not password or not nombre:
        return jsonify({"success": False, "error": "nombre, email y password son requeridos"}), 400
    if len(password) < 6:
        return jsonify({"success": False, "error": "La contrasena debe tener al menos 6 caracteres"}), 400

    profile = _profile_payload(
        {**data, "email": email, "nombre": nombre},
        existing={"rol": ROLE_CLIENTE, "estado": "activo"},
    )

    try:
        auth_res = requests.post(
            f"{SUPABASE_URL}/auth/v1/admin/users",
            json={
                "email": email,
                "password": password,
                "email_confirm": True,
                "user_metadata": {"nombre": nombre, "role": profile["rol"]},
                "app_metadata": {"role": profile["rol"]},
            },
            headers=_headers(),
            timeout=20,
        )
        auth_data = auth_res.json() if auth_res.content else {}
        if not auth_res.ok:
            return jsonify({"success": False, "error": auth_data.get("msg") or auth_data.get("error_description") or auth_data.get("error") or "No se pudo crear el usuario", "detail": auth_data}), auth_res.status_code

        user_id = auth_data.get("id") or auth_data.get("user", {}).get("id")
        row = {
            "id": user_id,
            "nombre": profile["nombre"],
            "email": profile["email"],
            "rol": profile["rol"],
            "estado": profile["estado"],
            "sucursal_ids": profile["sucursal_ids"],
        }
        created = profiles_service.create_record(row)
        return jsonify({"success": True, "data": created[0] if isinstance(created, list) else created}), 201
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@auth_users_bp.route("/<user_id>", methods=["PUT"])
@require_admin
def update_user(user_id):
    data = request.get_json(silent=True) or {}

    try:
        existing = profiles_service.get_record(user_id)
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 404

    profile = _profile_payload(data, existing=existing)
    if not profile["nombre"] or not profile["email"]:
        return jsonify({"success": False, "error": "nombre y email son requeridos"}), 400

    try:
        auth_res = requests.put(
            f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}",
            json={
                "email": profile["email"],
                "user_metadata": {"nombre": profile["nombre"], "role": profile["rol"]},
                "app_metadata": {"role": profile["rol"]},
                "ban_duration": "none" if profile["estado"] == "activo" else "876000h",
            },
            headers=_headers(),
            timeout=20,
        )
        auth_data = auth_res.json() if auth_res.content else {}
        if not auth_res.ok:
            return jsonify({"success": False, "error": auth_data.get("msg") or auth_data.get("error_description") or auth_data.get("error") or "No se pudo actualizar el usuario", "detail": auth_data}), auth_res.status_code

        updated = profiles_service.update_record(user_id, {
            "nombre": profile["nombre"],
            "email": profile["email"],
            "rol": profile["rol"],
            "estado": profile["estado"],
            "sucursal_ids": profile["sucursal_ids"],
        })
        return jsonify({"success": True, "data": updated[0] if isinstance(updated, list) else updated}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
