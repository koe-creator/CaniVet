from flask import Blueprint, jsonify, request

from core.auth import ROLE_ADMIN, ROLE_EMPLEADO, require_roles
from core.services import SupabaseEntityService
from core.validators import INVENTORY_VALIDATOR

inventario_bp = Blueprint("inventario", __name__)
service = SupabaseEntityService("inventario", "nombre", searchable_fields=["nombre", "descripcion", "categoria"])


@inventario_bp.route("/", methods=["GET"])
@require_roles(ROLE_ADMIN, ROLE_EMPLEADO)
def get_inventario():
    try:
        records = service.list_records(search=request.args.get("search"))
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@inventario_bp.route("/bajo-stock", methods=["GET"])
@require_roles(ROLE_ADMIN, ROLE_EMPLEADO)
def get_bajo_stock():
    try:
        records = [item for item in service.list_records() if int(item.get("cantidad") or 0) < 20]
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@inventario_bp.route("/", methods=["POST"])
@require_roles(ROLE_ADMIN, ROLE_EMPLEADO)
def create_producto():
    payload, errors = INVENTORY_VALIDATOR.validate(request.get_json(silent=True) or {})
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        return jsonify({"success": True, "data": service.create_record(payload)}), 201
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@inventario_bp.route("/<id>", methods=["PUT"])
@require_roles(ROLE_ADMIN, ROLE_EMPLEADO)
def update_producto(id):
    payload, errors = INVENTORY_VALIDATOR.validate(request.get_json(silent=True) or {}, partial=True)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        return jsonify({"success": True, "data": service.update_record(id, payload)}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@inventario_bp.route("/<id>", methods=["DELETE"])
@require_roles(ROLE_ADMIN)
def delete_producto(id):
    try:
        service.delete_record(id)
        return jsonify({"success": True, "message": "Producto eliminado"}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
