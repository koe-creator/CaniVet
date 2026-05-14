import os

import stripe
from flask import Blueprint, jsonify, request

from core.auth import require_auth
from core.services import SupabaseClientFactory

stripe_bp = Blueprint("stripe", __name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_URL   = os.getenv("FRONTEND_URL", "http://localhost:5173")


def _supabase():
    return SupabaseClientFactory().create()


@stripe_bp.route("/checkout", methods=["POST"])
@require_auth
def create_checkout():
    """
    Crea una sesión de pago en Stripe.
    Body: { amount (centavos), currency, description, customer_email,
            appointment_id, client_name, online_payment_id }
    """
    if not stripe.api_key or stripe.api_key.startswith("sk_placeholder"):
        return jsonify({"success": False, "error": "Stripe no está configurado. Agrega STRIPE_SECRET_KEY en el .env del backend."}), 503

    data = request.get_json(silent=True) or {}
    amount       = int(data.get("amount", 0))
    currency     = data.get("currency", "dop").lower()
    description  = data.get("description", "Servicio veterinario CaniVet")
    customer_email = data.get("customer_email")
    online_payment_id = data.get("online_payment_id", "")
    appointment_id    = data.get("appointment_id", "")

    if amount <= 0:
        return jsonify({"success": False, "error": "El monto debe ser mayor a 0"}), 400

    try:
        session_params = {
            "payment_method_types": ["card"],
            "mode": "payment",
            "line_items": [{
                "price_data": {
                    "currency": currency,
                    "unit_amount": amount,
                    "product_data": {
                        "name": description,
                        "description": "Pago por servicio en CaniVet",
                    },
                },
                "quantity": 1,
            }],
            "success_url": f"{FRONTEND_URL}/pago-exitoso?session_id={{CHECKOUT_SESSION_ID}}",
            "cancel_url":  f"{FRONTEND_URL}/servicios",
            "metadata": {
                "online_payment_id": online_payment_id,
                "appointment_id":    appointment_id,
            },
        }

        if customer_email:
            session_params["customer_email"] = customer_email

        session = stripe.checkout.Session.create(**session_params)

        return jsonify({
            "success":    True,
            "session_id": session.id,
            "url":        session.url,
        }), 200

    except stripe.error.StripeError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@stripe_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    """
    Webhook que Stripe llama cuando ocurre un evento (ej: pago completado).
    Configura en Stripe Dashboard → Webhooks → Endpoint URL: /api/stripe/webhook
    Eventos a escuchar: checkout.session.completed
    """
    payload = request.get_data()
    sig_header = request.headers.get("Stripe-Signature", "")

    # Verificar firma si el secret está configurado
    if WEBHOOK_SECRET:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
        except stripe.error.SignatureVerificationError:
            return jsonify({"error": "Invalid signature"}), 400
        except Exception as exc:
            return jsonify({"error": str(exc)}), 400
    else:
        try:
            import json
            event = json.loads(payload)
        except Exception:
            return jsonify({"error": "Invalid JSON"}), 400

    event_type = event.get("type") or event.get("data", {})

    if event_type == "checkout.session.completed":
        session_obj = event["data"]["object"]
        stripe_session_id   = session_obj.get("id")
        payment_intent_id   = session_obj.get("payment_intent")
        customer_email      = session_obj.get("customer_details", {}).get("email")
        metadata            = session_obj.get("metadata", {})
        online_payment_id   = metadata.get("online_payment_id")

        try:
            db = _supabase()
            update_data = {
                "estado":     "pagado",
                "pagado_el":  _now_iso(),
                "ultimo_evento": "checkout.session.completed",
            }

            if online_payment_id:
                db.table("pagos_online").update(update_data).eq("id", online_payment_id).execute()
            elif stripe_session_id:
                db.table("pagos_online").update(update_data).eq("stripe_session_id", stripe_session_id).execute()

        except Exception as exc:
            # Loguear pero no fallar (Stripe reintentará si devolvemos 5xx)
            print(f"[stripe_webhook] Error actualizando Supabase: {exc}")

    return jsonify({"received": True}), 200


def _now_iso():
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat()
