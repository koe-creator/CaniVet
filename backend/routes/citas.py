from datetime import date

from flask import Blueprint, jsonify, request

from core.auth import require_auth
from core.email_service import email_service
from core.services import SupabaseEntityService
from core.validators import APPOINTMENT_VALIDATOR

citas_bp = Blueprint("citas", __name__)
service = SupabaseEntityService("citas", "fecha", searchable_fields=["fecha", "hora", "estado"])
mascotas_service = SupabaseEntityService("mascotas", "nombre")


def _enrich_citas(records):
    if not records:
        return records

    mascota_ids = list({record.get("mascota_id") for record in records if record.get("mascota_id")})
    if not mascota_ids:
        return records

    mascotas = (
        mascotas_service.client
        .table("mascotas")
        .select("id,cliente_id")
        .in_("id", mascota_ids)
        .execute()
        .data
        or []
    )
    client_by_pet = {row.get("id"): row.get("cliente_id") for row in mascotas}

    enriched = []
    for record in records:
        current = dict(record)
        current["cliente_id"] = client_by_pet.get(record.get("mascota_id"))
        enriched.append(current)
    return enriched


def _prepare_cita_payload(payload, partial=False):
    cleaned, errors = APPOINTMENT_VALIDATOR.validate(payload, partial=partial)
    if errors:
        return None, errors

    mascota_id = cleaned.get("mascota_id")
    cliente_id = cleaned.get("cliente_id")

    if mascota_id and cliente_id:
        mascota = mascotas_service.get_record(mascota_id)
        if str(mascota.get("cliente_id")) != str(cliente_id):
            return None, {"mascota_id": "La mascota seleccionada no pertenece al cliente indicado."}

    db_payload = {}
    for key in ("fecha", "hora", "mascota_id", "servicio_id", "notas", "estado"):
        if key in cleaned:
            db_payload[key] = cleaned[key]

    return db_payload, {}


@citas_bp.route("/", methods=["GET"])
@require_auth
def get_citas():
    try:
        records = _enrich_citas(service.list_records(search=request.args.get("search")))
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@citas_bp.route("/hoy", methods=["GET"])
@require_auth
def get_hoy():
    try:
        records = _enrich_citas(service.list_records(filters={"fecha": date.today().isoformat()}))
        records.sort(key=lambda item: str(item.get("hora", "")))
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@citas_bp.route("/", methods=["POST"])
@require_auth
def create_cita():
    payload, errors = _prepare_cita_payload(request.get_json(silent=True) or {})
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        created = service.create_record(payload)
        return jsonify({"success": True, "data": _enrich_citas(created)}), 201
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@citas_bp.route("/<id>", methods=["PUT"])
@require_auth
def update_cita(id):
    payload, errors = _prepare_cita_payload(request.get_json(silent=True) or {}, partial=True)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        updated = service.update_record(id, payload)
        return jsonify({"success": True, "data": _enrich_citas(updated)}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@citas_bp.route("/<id>", methods=["DELETE"])
@require_auth
def delete_cita(id):
    try:
        service.delete_record(id)
        return jsonify({"success": True, "message": "Cita eliminada"}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@citas_bp.route("/notify-confirmation", methods=["POST"])
@require_auth
def notify_confirmation():
    payload = request.get_json(silent=True) or {}

    required = {
        "client_email": "El email del cliente es requerido.",
        "client_name": "El nombre del cliente es requerido.",
        "pet_name": "El nombre de la mascota es requerido.",
        "service_name": "El servicio es requerido.",
        "fecha": "La fecha es requerida.",
        "hora": "La hora es requerida.",
    }
    errors = {key: message for key, message in required.items() if not payload.get(key)}
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    if not email_service.configured:
        return jsonify({"success": False, "error": "SMTP no esta configurado en el backend."}), 503

    if not email_service.send_appointment_confirmation(payload):
        return jsonify({"success": False, "error": "No se pudo enviar el correo de confirmacion."}), 503

    return jsonify({"success": True, "message": "Correo de confirmacion enviado."}), 200
