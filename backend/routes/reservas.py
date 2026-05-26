import threading

from flask import Blueprint, jsonify, request

from core.auth import ROLE_ADMIN, ROLE_CLIENTE, ROLE_EMPLEADO, ROLE_RECEPCIONISTA, require_roles
from core.email_service import email_service
from core.services import SupabaseEntityService

reservas_bp = Blueprint("reservas", __name__)
service = SupabaseEntityService(
    "reservas_online",
    "created_at",
    searchable_fields=["nombre", "email", "servicio_nombre", "estado"],
)


def _send_emails_async(reserva: dict):
    def _run():
        email_service.send_booking_confirmation(reserva)
        email_service.send_admin_booking_alert(reserva)

    threading.Thread(target=_run, daemon=True).start()


@reservas_bp.route("/", methods=["POST"])
@require_roles(ROLE_ADMIN, ROLE_EMPLEADO, ROLE_RECEPCIONISTA, ROLE_CLIENTE)
def create_reserva():
    data = request.get_json(silent=True) or {}
    auth_user = getattr(request, "auth_user", {})

    fallback_name = (auth_user.get("email") or "").split("@")[0].strip() if auth_user.get("email") else ""
    nombre = (data.get("nombre") or data.get("email") or fallback_name or "").strip()
    if not nombre:
        return jsonify({"success": False, "error": "El nombre es requerido"}), 400

    email = (data.get("email") or "").strip() or auth_user.get("email") or None
    telefono = (data.get("telefono") or "").strip() or None
    if not email and not telefono:
        return jsonify({"success": False, "error": "Se requiere email o telefono"}), 400

    payload = {
        "usuario_id": auth_user.get("user_id"),
        "nombre": nombre,
        "email": email,
        "telefono": telefono,
        "mascota_nombre": (data.get("mascota_nombre") or "").strip() or None,
        "servicio_id": data.get("servicio_id") or None,
        "servicio_nombre": (data.get("servicio_nombre") or "").strip() or None,
        "fecha": data.get("fecha") or None,
        "hora": data.get("hora") or None,
        "notas": (data.get("notas") or "").strip() or None,
        "estado": "pendiente",
    }

    try:
        result = service.create_record(payload)
        reserva = result[0] if isinstance(result, list) else result
        _send_emails_async(reserva)
        return jsonify({"success": True, "data": reserva}), 201
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@reservas_bp.route("/", methods=["GET"])
@require_roles(ROLE_ADMIN, ROLE_RECEPCIONISTA)
def list_reservas():
    try:
        estado = request.args.get("estado")
        filters = {"estado": estado} if estado else None
        records = service.list_records(
            search=request.args.get("search"),
            descending=True,
            filters=filters,
        )
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@reservas_bp.route("/<id>", methods=["PUT"])
@require_roles(ROLE_ADMIN, ROLE_RECEPCIONISTA)
def update_reserva(id):
    data = request.get_json(silent=True) or {}
    allowed = {"estado", "cita_id"}
    payload = {k: v for k, v in data.items() if k in allowed}

    if not payload:
        return jsonify({"success": False, "error": "Nada que actualizar"}), 400

    try:
        result = service.update_record(id, payload)
        return jsonify({"success": True, "data": result}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
