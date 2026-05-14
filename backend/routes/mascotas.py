from flask import Blueprint, jsonify, request

from core.auth import require_auth
from core.services import SupabaseEntityService
from core.validators import PET_VALIDATOR

mascotas_bp = Blueprint("mascotas", __name__)
service = SupabaseEntityService("mascotas", "nombre", searchable_fields=["nombre", "especie", "raza"])


@mascotas_bp.route("/", methods=["GET"])
@require_auth
def get_mascotas():
    try:
        records = service.list_records(search=request.args.get("search"))
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@mascotas_bp.route("/cliente/<cliente_id>", methods=["GET"])
@require_auth
def get_by_cliente(cliente_id):
    try:
        records = service.list_records(filters={"cliente_id": cliente_id})
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@mascotas_bp.route("/", methods=["POST"])
@require_auth
def create_mascota():
    payload, errors = PET_VALIDATOR.validate(request.get_json(silent=True) or {})
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        return jsonify({"success": True, "data": service.create_record(payload)}), 201
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@mascotas_bp.route("/<id>", methods=["PUT"])
@require_auth
def update_mascota(id):
    payload, errors = PET_VALIDATOR.validate(request.get_json(silent=True) or {}, partial=True)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        return jsonify({"success": True, "data": service.update_record(id, payload)}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@mascotas_bp.route("/<id>", methods=["DELETE"])
@require_auth
def delete_mascota(id):
    try:
        service.delete_record(id)
        return jsonify({"success": True, "message": "Mascota eliminada"}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
