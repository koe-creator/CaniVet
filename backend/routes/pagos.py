from flask import Blueprint, jsonify, request

from core.auth import require_auth
from core.services import SupabaseEntityService
from core.validators import PAYMENT_VALIDATOR

pagos_bp = Blueprint("pagos", __name__)
service = SupabaseEntityService("pagos", "created_at", searchable_fields=["metodo", "estado"])


@pagos_bp.route("/", methods=["GET"])
@require_auth
def get_pagos():
    try:
        records = service.list_records(search=request.args.get("search"), descending=True)
        return jsonify({"success": True, "data": records}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@pagos_bp.route("/", methods=["POST"])
@require_auth
def create_pago():
    payload, errors = PAYMENT_VALIDATOR.validate(request.get_json(silent=True) or {})
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        return jsonify({"success": True, "data": service.create_record(payload)}), 201
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@pagos_bp.route("/<id>", methods=["PUT"])
@require_auth
def update_pago(id):
    payload, errors = PAYMENT_VALIDATOR.validate(request.get_json(silent=True) or {}, partial=True)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    try:
        return jsonify({"success": True, "data": service.update_record(id, payload)}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400


@pagos_bp.route("/<id>", methods=["DELETE"])
@require_auth
def delete_pago(id):
    try:
        service.delete_record(id)
        return jsonify({"success": True, "message": "Pago eliminado"}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
