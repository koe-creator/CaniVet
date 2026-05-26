from flask import Blueprint, jsonify, request

from core.auth import ROLE_ADMIN, ROLE_EMPLEADO, require_roles
from core.services import SupabaseEntityService
from core.validators import SERVICE_VALIDATOR

servicios_bp = Blueprint("servicios", __name__)
service = SupabaseEntityService("servicios", "nombre", searchable_fields=["nombre", "descripcion"])


@servicios_bp.route("/", methods=["GET"])
@require_roles(ROLE_ADMIN, ROLE_EMPLEADO)
def get_servicios():
    try:
        records = service.list_records(search=request.args.get("search"))
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@servicios_bp.route("/", methods=["POST"])
@require_roles(ROLE_ADMIN)
def create_servicio():
    payload, errors = SERVICE_VALIDATOR.validate(request.get_json(silent=True) or {})
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        return jsonify({"success": True, "data": service.create_record(payload)}), 201
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@servicios_bp.route("/<id>", methods=["PUT"])
@require_roles(ROLE_ADMIN)
def update_servicio(id):
    payload, errors = SERVICE_VALIDATOR.validate(request.get_json(silent=True) or {}, partial=True)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        return jsonify({"success": True, "data": service.update_record(id, payload)}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@servicios_bp.route("/<id>", methods=["DELETE"])
@require_roles(ROLE_ADMIN)
def delete_servicio(id):
    try:
        service.delete_record(id)
        return jsonify({"success": True, "message": "Servicio eliminado"}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
