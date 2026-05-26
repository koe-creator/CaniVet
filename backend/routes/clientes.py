from flask import Blueprint, jsonify, request

from core.auth import ROLE_ADMIN, ROLE_EMPLEADO, ROLE_RECEPCIONISTA, require_roles
from core.services import SupabaseEntityService
from core.validators import CLIENT_VALIDATOR

clientes_bp = Blueprint("clientes", __name__)
service = SupabaseEntityService("clientes", "nombre", searchable_fields=["nombre", "email", "telefono"])


@clientes_bp.route("/", methods=["GET"])
@require_roles(ROLE_ADMIN, ROLE_EMPLEADO, ROLE_RECEPCIONISTA)
def get_clientes():
    try:
        records = service.list_records(search=request.args.get("search"))
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@clientes_bp.route("/<id>", methods=["GET"])
@require_roles(ROLE_ADMIN, ROLE_EMPLEADO, ROLE_RECEPCIONISTA)
def get_cliente(id):
    try:
        return jsonify({"success": True, "data": service.get_record(id)}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 404


@clientes_bp.route("/", methods=["POST"])
@require_roles(ROLE_ADMIN, ROLE_EMPLEADO, ROLE_RECEPCIONISTA)
def create_cliente():
    payload, errors = CLIENT_VALIDATOR.validate(request.get_json(silent=True) or {})
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        return jsonify({"success": True, "data": service.create_record(payload)}), 201
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@clientes_bp.route("/<id>", methods=["PUT"])
@require_roles(ROLE_ADMIN, ROLE_EMPLEADO, ROLE_RECEPCIONISTA)
def update_cliente(id):
    payload, errors = CLIENT_VALIDATOR.validate(request.get_json(silent=True) or {}, partial=True)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        return jsonify({"success": True, "data": service.update_record(id, payload)}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@clientes_bp.route("/<id>", methods=["DELETE"])
@require_roles(ROLE_ADMIN)
def delete_cliente(id):
    try:
        service.delete_record(id)
        return jsonify({"success": True, "message": "Cliente eliminado"}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
