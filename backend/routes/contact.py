from flask import Blueprint, jsonify, request

from core.email_service import email_service
from core.validators import CONTACT_VALIDATOR

contact_bp = Blueprint("contact", __name__)


@contact_bp.route("/", methods=["POST"])
def send_contact_message():
    payload = request.get_json(silent=True) or {}
    clean_payload, errors = CONTACT_VALIDATOR.validate(payload)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        if not email_service.send_contact_message(clean_payload):
            detail = email_service.last_error or "No se pudo enviar el correo. Verifica la configuracion SMTP."
            return jsonify({"success": False, "error": detail}), 503
        return jsonify({"success": True, "message": "Mensaje enviado correctamente."}), 200
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 503
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500
