"""
CaniVet — Blueprint de emails
Todos los endpoints de este módulo envían emails reales via SMTP.
No requieren autenticación (se llaman desde el frontend después de
guardar datos en Supabase), pero validan que el contenido sea mínimamente correcto.
"""
from flask import Blueprint, jsonify, request
from core.email_service import email_service

email_bp = Blueprint("email", __name__)


def _ok(detail="Email enviado"):
    return jsonify({"success": True, "detail": detail}), 200


def _err(msg, status=400):
    return jsonify({"success": False, "error": msg}), status


# ── Test ──────────────────────────────────────────────────────────────────────

@email_bp.route("/test", methods=["POST"])
def test_email():
    """Envía un email de prueba al admin para verificar que SMTP funciona."""
    to = email_service.admin_email
    if not to:
        return _err("ADMIN_EMAILS no configurado en .env", 500)

    ok = email_service.send_email(
        to_email=to,
        subject="✅ CaniVet — Email de prueba",
        body_text="Si recibes este mensaje, el sistema de emails está configurado correctamente.",
        body_html="""
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:32px auto;
                    background:#fff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;">
          <div style="background:#0f172a;padding:24px 28px;">
            <span style="font-size:28px;">🐾</span>
            <span style="color:#fff;font-size:18px;font-weight:800;margin-left:8px;">CaniVet</span>
          </div>
          <div style="padding:28px;">
            <h2 style="color:#16a34a;font-size:18px;margin:0 0 12px;">✅ Email configurado correctamente</h2>
            <p style="color:#475569;font-size:14px;line-height:1.7;margin:0">
              El sistema de emails de CaniVet está funcionando. Los emails de
              reservas, confirmaciones y notificaciones se enviarán a esta dirección.
            </p>
          </div>
          <div style="background:#f8fafc;padding:14px 28px;text-align:center;">
            <p style="color:#94a3b8;font-size:12px;margin:0">© 2026 CaniVet</p>
          </div>
        </div>
        """,
    )

    if ok:
        return _ok(f"Email de prueba enviado a {to}")
    return _err(f"Error SMTP: {email_service.last_error}", 500)


# ── Reserva online ─────────────────────────────────────────────────────────────

@email_bp.route("/reserva", methods=["POST"])
def reserva_emails():
    """
    Envía dos emails cuando un cliente hace una reserva online:
    1. Confirmación al cliente (si tiene email)
    2. Alerta al admin
    """
    data = request.get_json(silent=True) or {}

    nombre   = (data.get("nombre") or "").strip()
    email_c  = (data.get("email") or "").strip()
    telefono = (data.get("telefono") or "—")
    mascota  = data.get("mascota_nombre") or "—"
    servicio = data.get("servicio_nombre") or "—"
    fecha    = data.get("fecha") or "—"
    hora     = data.get("hora") or ""
    notas    = data.get("notas") or "Sin notas"
    ref      = str(data.get("id") or "").replace("-", "")[:8].upper()

    if not nombre:
        return _err("nombre es requerido")

    hora_str = f" a las {hora}" if hora else ""
    resultados = {}

    # 1. Email al cliente
    if email_c:
        ok = email_service.send_booking_confirmation({
            "email": email_c, "nombre": nombre, "servicio_nombre": servicio,
            "mascota_nombre": mascota, "fecha": fecha, "hora": hora, "id": ref,
        })
        resultados["cliente"] = "enviado" if ok else f"falló: {email_service.last_error}"

    # 2. Alerta al admin
    ok_admin = email_service.send_admin_booking_alert({
        "nombre": nombre, "email": email_c, "telefono": telefono,
        "mascota_nombre": mascota, "servicio_nombre": servicio,
        "fecha": fecha, "hora": hora, "notas": notas, "id": ref,
    })
    resultados["admin"] = "enviado" if ok_admin else f"falló: {email_service.last_error}"

    return jsonify({"success": True, "resultados": resultados}), 200


# ── Cita confirmada ─────────────────────────────────────────────────────────────

@email_bp.route("/cita-confirmada", methods=["POST"])
def cita_confirmada():
    """Email al cliente cuando el admin confirma su reserva/cita."""
    data = request.get_json(silent=True) or {}
    email_c  = (data.get("email") or "").strip()
    nombre   = data.get("nombre") or "Cliente"
    mascota  = data.get("mascota") or "su mascota"
    servicio = data.get("servicio") or "el servicio"
    fecha    = data.get("fecha") or "—"
    hora     = data.get("hora") or ""
    sucursal = data.get("sucursal") or "CaniVet"

    if not email_c:
        return _err("email del cliente requerido")

    hora_str = f" a las {hora}" if hora else ""
    subject  = f"✅ Cita confirmada — {servicio} | CaniVet"
    text = (
        f"Hola {nombre},\n\n"
        f"Tu cita ha sido confirmada.\n\n"
        f"Servicio:  {servicio}\n"
        f"Mascota:   {mascota}\n"
        f"Fecha:     {fecha}{hora_str}\n"
        f"Sucursal:  {sucursal}\n\n"
        f"Te esperamos. Cualquier duda contáctanos.\n\nCaniVet 🐾"
    )
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:32px auto;
                background:#fff;border-radius:16px;overflow:hidden;
                box-shadow:0 4px 24px rgba(0,0,0,.07);">
      <div style="background:linear-gradient(135deg,#0f172a,#1d4ed8);padding:28px 32px;text-align:center;">
        <div style="font-size:36px;margin-bottom:6px;">🐾</div>
        <h1 style="color:#fff;font-size:20px;margin:0;font-weight:800;">CaniVet</h1>
      </div>
      <div style="padding:28px 32px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;
                    padding:14px;margin-bottom:20px;text-align:center;">
          <p style="color:#15803d;font-weight:700;font-size:16px;margin:0;">✅ Cita confirmada</p>
        </div>
        <p style="color:#334155;font-size:15px;margin-bottom:20px;">Hola <strong>{nombre}</strong>,</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:7px 0;color:#64748b;">Servicio</td>
                <td style="padding:7px 0;color:#0f172a;font-weight:600;text-align:right;">{servicio}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Mascota</td>
                <td style="padding:7px 0;color:#0f172a;font-weight:600;text-align:right;">{mascota}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Fecha</td>
                <td style="padding:7px 0;color:#0f172a;font-weight:600;text-align:right;">{fecha}{hora_str}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Sucursal</td>
                <td style="padding:7px 0;color:#0f172a;font-weight:600;text-align:right;">{sucursal}</td></tr>
          </table>
        </div>
        <p style="color:#64748b;font-size:13px;margin-top:20px;text-align:center;">
          ¿Necesitas reagendar? Contáctanos con anticipación.
        </p>
      </div>
      <div style="background:#f1f5f9;padding:14px 32px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 CaniVet — República Dominicana</p>
      </div>
    </div>
    """

    ok = email_service.send_email(email_c, subject, text, html)
    if ok:
        return _ok(f"Confirmación enviada a {email_c}")
    return _err(f"Error SMTP: {email_service.last_error}", 500)


# ── Recibo de pago ─────────────────────────────────────────────────────────────

@email_bp.route("/reserva-rechazada", methods=["POST"])
def reserva_rechazada():
    """Email al cliente cuando la reserva no puede ser confirmada."""
    data = request.get_json(silent=True) or {}
    email_c = (data.get("email") or "").strip()

    if not email_c:
        return _err("email del cliente requerido")

    ok = email_service.send_booking_rejection({
        "email": email_c,
        "nombre": data.get("nombre") or "Cliente",
        "mascota": data.get("mascota") or "su mascota",
        "servicio": data.get("servicio") or "el servicio solicitado",
        "fecha": data.get("fecha") or "—",
        "hora": data.get("hora") or "",
        "motivo": data.get("motivo") or "",
    })
    if ok:
        return _ok(f"Notificación de rechazo enviada a {email_c}")
    return _err(f"Error SMTP: {email_service.last_error}", 500)


@email_bp.route("/recibo-pago", methods=["POST"])
def recibo_pago():
    """Envía recibo de pago al cliente."""
    data = request.get_json(silent=True) or {}
    email_c  = (data.get("email") or "").strip()
    nombre   = data.get("nombre") or "Cliente"
    monto    = data.get("monto") or "0"
    metodo   = data.get("metodo") or "efectivo"
    concepto = data.get("concepto") or "Servicio veterinario"
    factura  = data.get("factura") or ""
    fecha    = data.get("fecha") or "—"

    if not email_c:
        return _err("email del cliente requerido")

    subject = f"🧾 Recibo de pago — {concepto} | CaniVet"
    text = (
        f"Hola {nombre},\n\n"
        f"Confirmamos el siguiente pago:\n\n"
        f"Concepto:  {concepto}\n"
        f"Monto:     RD$ {monto}\n"
        f"Método:    {metodo}\n"
        f"Fecha:     {fecha}\n"
        + (f"Factura:   {factura}\n" if factura else "") +
        f"\nGracias por tu preferencia.\n\nCaniVet 🐾"
    )
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:32px auto;
                background:#fff;border-radius:16px;overflow:hidden;
                box-shadow:0 4px 24px rgba(0,0,0,.07);">
      <div style="background:#0f172a;padding:28px 32px;text-align:center;">
        <div style="font-size:36px;margin-bottom:6px;">🧾</div>
        <h1 style="color:#fff;font-size:20px;margin:0;font-weight:800;">Recibo de Pago</h1>
        <p style="color:rgba(255,255,255,.6);font-size:13px;margin:4px 0 0;">CaniVet</p>
      </div>
      <div style="padding:28px 32px;">
        <p style="color:#334155;font-size:15px;margin-bottom:20px;">Hola <strong>{nombre}</strong>,</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;margin-bottom:20px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:7px 0;color:#64748b;">Concepto</td>
                <td style="padding:7px 0;color:#0f172a;font-weight:600;text-align:right;">{concepto}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Método</td>
                <td style="padding:7px 0;color:#0f172a;text-align:right;">{metodo.capitalize()}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Fecha</td>
                <td style="padding:7px 0;color:#0f172a;text-align:right;">{fecha}</td></tr>
            {f'<tr><td style="padding:7px 0;color:#64748b;">Factura</td><td style="padding:7px 0;color:#1d4ed8;font-weight:700;text-align:right;">{factura}</td></tr>' if factura else ''}
          </table>
        </div>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;text-align:center;">
          <p style="color:#64748b;font-size:13px;margin:0 0 4px;">Total pagado</p>
          <p style="color:#15803d;font-size:26px;font-weight:800;margin:0;">RD$ {monto}</p>
        </div>
      </div>
      <div style="background:#f1f5f9;padding:14px 32px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 CaniVet — República Dominicana</p>
      </div>
    </div>
    """

    ok = email_service.send_email(email_c, subject, text, html)
    if ok:
        return _ok(f"Recibo enviado a {email_c}")
    return _err(f"Error SMTP: {email_service.last_error}", 500)


# ── Recordatorio de vacuna ─────────────────────────────────────────────────────

@email_bp.route("/alerta-vacuna", methods=["POST"])
def alerta_vacuna():
    """Notifica al dueño que una vacuna está próxima a vencer o vencida."""
    data = request.get_json(silent=True) or {}
    email_c    = (data.get("email") or "").strip()
    nombre_d   = data.get("nombre_dueno") or "Dueño"
    nombre_m   = data.get("nombre_mascota") or "su mascota"
    vacuna     = data.get("vacuna") or "una vacuna"
    vence      = data.get("fecha_vencimiento") or "—"
    vencida    = data.get("vencida", False)

    if not email_c:
        return _err("email del dueño requerido")

    estado  = "ya venció" if vencida else "vence pronto"
    color   = "#dc2626" if vencida else "#d97706"
    emoji   = "🚨" if vencida else "⚠️"
    subject = f"{emoji} Vacuna {estado} — {nombre_m} | CaniVet"

    text = (
        f"Hola {nombre_d},\n\n"
        f"Te recordamos que la vacuna {vacuna} de {nombre_m} {estado}.\n"
        f"Fecha de vencimiento: {vence}\n\n"
        f"Agenda una cita para mantener a tu mascota protegida.\n\nCaniVet 🐾"
    )
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:32px auto;
                background:#fff;border-radius:16px;overflow:hidden;
                box-shadow:0 4px 24px rgba(0,0,0,.07);">
      <div style="background:{color};padding:28px 32px;text-align:center;">
        <div style="font-size:36px;margin-bottom:6px;">{emoji}</div>
        <h1 style="color:#fff;font-size:20px;margin:0;font-weight:800;">Alerta de Vacuna</h1>
        <p style="color:rgba(255,255,255,.8);font-size:13px;margin:4px 0 0;">CaniVet</p>
      </div>
      <div style="padding:28px 32px;">
        <p style="color:#334155;font-size:15px;margin-bottom:20px;">Hola <strong>{nombre_d}</strong>,</p>
        <p style="color:#475569;font-size:14px;line-height:1.7;margin-bottom:20px;">
          La vacuna <strong>{vacuna}</strong> de <strong>{nombre_m}</strong>
          {' <span style="color:#dc2626;font-weight:700;">ya venció</span>' if vencida else
           ' <span style="color:#d97706;font-weight:700;">vence pronto</span>'}.
        </p>
        <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:16px;text-align:center;">
          <p style="color:#92400e;font-size:13px;margin:0 0 4px;">Fecha de vencimiento</p>
          <p style="color:#92400e;font-size:20px;font-weight:800;margin:0;">{vence}</p>
        </div>
        <p style="color:#64748b;font-size:13px;margin-top:20px;text-align:center;">
          Agenda una cita para mantener a tu mascota protegida.
        </p>
      </div>
      <div style="background:#f1f5f9;padding:14px 32px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 CaniVet — República Dominicana</p>
      </div>
    </div>
    """

    ok = email_service.send_email(email_c, subject, text, html)
    if ok:
        return _ok(f"Alerta enviada a {email_c}")
    return _err(f"Error SMTP: {email_service.last_error}", 500)


# ── Recordatorio de cita ──────────────────────────────────────────────────────

@email_bp.route("/link-pago", methods=["POST"])
def link_pago():
    """Envía al cliente el link de pago con todos los detalles."""
    data = request.get_json(silent=True) or {}
    email_c  = (data.get("email") or "").strip()
    nombre   = data.get("nombre") or "Cliente"
    monto    = data.get("monto") or "0"
    concepto = data.get("concepto") or "Servicio veterinario"
    link     = data.get("link") or ""
    ref      = data.get("referencia") or ""

    if not email_c:
        return _err("email del cliente requerido")
    if not link:
        return _err("link de pago requerido")

    subject = f"💳 Tu link de pago — {concepto} | CaniVet"
    text = (
        f"Hola {nombre},\n\n"
        f"Te enviamos el link para realizar tu pago en CaniVet.\n\n"
        f"Concepto: {concepto}\n"
        f"Monto:    RD$ {monto}\n"
        f"Referencia: {ref}\n\n"
        f"Haz clic aquí para pagar:\n{link}\n\n"
        f"El link es seguro y procesado por Stripe.\n\nGracias — CaniVet 🐾"
    )
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:32px auto;
                background:#fff;border-radius:16px;overflow:hidden;
                box-shadow:0 4px 24px rgba(0,0,0,.07);">
      <div style="background:linear-gradient(135deg,#0f172a,#6d28d9);padding:28px 32px;text-align:center;">
        <div style="font-size:36px;margin-bottom:6px;">💳</div>
        <h1 style="color:#fff;font-size:20px;margin:0;font-weight:800;">Link de Pago</h1>
        <p style="color:rgba(255,255,255,.7);font-size:13px;margin:4px 0 0;">CaniVet</p>
      </div>
      <div style="padding:28px 32px;">
        <p style="color:#334155;font-size:15px;margin-bottom:20px;">Hola <strong>{nombre}</strong>,</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;margin-bottom:20px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:7px 0;color:#64748b;">Concepto</td>
                <td style="padding:7px 0;color:#0f172a;font-weight:600;text-align:right;">{concepto}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Monto a pagar</td>
                <td style="padding:7px 0;color:#6d28d9;font-weight:800;font-size:16px;text-align:right;">RD$ {monto}</td></tr>
            {f'<tr><td style="padding:7px 0;color:#64748b;">Referencia</td><td style="padding:7px 0;color:#0f172a;text-align:right;">{ref}</td></tr>' if ref else ''}
          </table>
        </div>
        <a href="{link}"
           style="display:block;text-align:center;background:#6d28d9;color:#fff;
                  padding:16px;border-radius:12px;text-decoration:none;
                  font-weight:700;font-size:15px;letter-spacing:.2px;">
          💳 Pagar ahora →
        </a>
        <p style="color:#94a3b8;font-size:12px;margin-top:16px;text-align:center;">
          Pago seguro procesado por Stripe. El link expira en 48 horas.
        </p>
      </div>
      <div style="background:#f1f5f9;padding:14px 32px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 CaniVet — República Dominicana</p>
      </div>
    </div>
    """

    ok = email_service.send_email(email_c, subject, text, html)
    if ok:
        return _ok(f"Link de pago enviado a {email_c}")
    return _err(f"Error SMTP: {email_service.last_error}", 500)


@email_bp.route("/recordatorio-cita", methods=["POST"])
def recordatorio_cita():
    """Recordatorio de cita (se llama manualmente o desde un cron job)."""
    data = request.get_json(silent=True) or {}
    email_c  = (data.get("email") or "").strip()
    nombre   = data.get("nombre") or "Cliente"
    mascota  = data.get("mascota") or "su mascota"
    servicio = data.get("servicio") or "su cita"
    fecha    = data.get("fecha") or "—"
    hora     = data.get("hora") or ""
    sucursal = data.get("sucursal") or "CaniVet"

    if not email_c:
        return _err("email del cliente requerido")

    hora_str = f" a las {hora}" if hora else ""
    subject  = f"📅 Recordatorio de cita mañana — {servicio} | CaniVet"
    text = (
        f"Hola {nombre},\n\n"
        f"Te recordamos que mañana tienes una cita en CaniVet.\n\n"
        f"Servicio: {servicio}\n"
        f"Mascota:  {mascota}\n"
        f"Fecha:    {fecha}{hora_str}\n"
        f"Sucursal: {sucursal}\n\n"
        f"¡Te esperamos!\n\nCaniVet 🐾"
    )
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:32px auto;
                background:#fff;border-radius:16px;overflow:hidden;
                box-shadow:0 4px 24px rgba(0,0,0,.07);">
      <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);padding:28px 32px;text-align:center;">
        <div style="font-size:36px;margin-bottom:6px;">📅</div>
        <h1 style="color:#fff;font-size:20px;margin:0;font-weight:800;">Recordatorio de Cita</h1>
        <p style="color:rgba(255,255,255,.7);font-size:13px;margin:4px 0 0;">CaniVet</p>
      </div>
      <div style="padding:28px 32px;">
        <p style="color:#334155;font-size:15px;margin-bottom:20px;">
          Hola <strong>{nombre}</strong>, mañana tienes una cita:
        </p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:7px 0;color:#64748b;">Servicio</td>
                <td style="padding:7px 0;color:#0f172a;font-weight:600;text-align:right;">{servicio}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Mascota</td>
                <td style="padding:7px 0;color:#0f172a;font-weight:600;text-align:right;">{mascota}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Fecha y hora</td>
                <td style="padding:7px 0;color:#1d4ed8;font-weight:700;text-align:right;">{fecha}{hora_str}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Sucursal</td>
                <td style="padding:7px 0;color:#0f172a;text-align:right;">{sucursal}</td></tr>
          </table>
        </div>
      </div>
      <div style="background:#f1f5f9;padding:14px 32px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 CaniVet — República Dominicana</p>
      </div>
    </div>
    """

    ok = email_service.send_email(email_c, subject, text, html)
    if ok:
        return _ok(f"Recordatorio enviado a {email_c}")
    return _err(f"Error SMTP: {email_service.last_error}", 500)


@email_bp.route("/manual-notification", methods=["POST"])
def manual_notification():
    """Envía una notificación manual por email al cliente."""
    data = request.get_json(silent=True) or {}
    email_c = (data.get("email") or "").strip()
    nombre = data.get("nombre") or "Cliente"
    titulo = (data.get("titulo") or "").strip()
    mensaje = (data.get("mensaje") or "").strip()

    if not email_c:
        return _err("email del cliente requerido")
    if not titulo:
        return _err("título requerido")
    if not mensaje:
        return _err("mensaje requerido")

    subject = f"🔔 {titulo} | CaniVet"
    text = (
        f"Hola {nombre},\n\n"
        f"{mensaje}\n\n"
        f"Si necesitas ayuda, responde este correo o contáctanos.\n\n"
        f"CaniVet 🐾"
    )
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:32px auto;
                background:#fff;border-radius:16px;overflow:hidden;
                box-shadow:0 4px 24px rgba(0,0,0,.07);">
      <div style="background:linear-gradient(135deg,#0f172a,#1d4ed8);padding:28px 32px;text-align:center;">
        <div style="font-size:36px;margin-bottom:6px;">🔔</div>
        <h1 style="color:#fff;font-size:20px;margin:0;font-weight:800;">{titulo}</h1>
        <p style="color:rgba(255,255,255,.7);font-size:13px;margin:4px 0 0;">CaniVet</p>
      </div>
      <div style="padding:28px 32px;">
        <p style="color:#334155;font-size:15px;margin-bottom:20px;">Hola <strong>{nombre}</strong>,</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;">
          <p style="color:#475569;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">{mensaje}</p>
        </div>
        <p style="color:#64748b;font-size:13px;margin-top:20px;text-align:center;">
          Si necesitas ayuda, responde este correo o contáctanos.
        </p>
      </div>
      <div style="background:#f1f5f9;padding:14px 32px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 CaniVet - República Dominicana</p>
      </div>
    </div>
    """

    ok = email_service.send_email(email_c, subject, text, html)
    if ok:
        return _ok(f"Notificación enviada a {email_c}")
    return _err(f"Error SMTP: {email_service.last_error}", 500)


@email_bp.route("/client-welcome", methods=["POST"])
def client_welcome():
    """Envía un correo de bienvenida cuando se registra un cliente nuevo."""
    data = request.get_json(silent=True) or {}
    email_c = (data.get("email") or "").strip()
    nombre = data.get("nombre") or "Cliente"
    telefono = data.get("telefono") or ""
    sucursal = data.get("sucursal") or "CaniVet"

    if not email_c:
        return _err("email del cliente requerido")

    subject = f"🐾 Bienvenido a CaniVet, {nombre}"
    text = (
        f"Hola {nombre},\n\n"
        f"Tu registro en CaniVet fue creado correctamente.\n"
        f"Ya puedes recibir recordatorios, confirmaciones y avisos importantes de tu mascota.\n\n"
        f"Sucursal: {sucursal}\n"
        + (f"Teléfono registrado: {telefono}\n" if telefono else "")
        + "\nGracias por confiar en nosotros.\n\nCaniVet 🐾"
    )
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:32px auto;
                background:#fff;border-radius:16px;overflow:hidden;
                box-shadow:0 4px 24px rgba(0,0,0,.07);">
      <div style="background:linear-gradient(135deg,#0f172a,#1d4ed8);padding:28px 32px;text-align:center;">
        <div style="font-size:36px;margin-bottom:6px;">🐾</div>
        <h1 style="color:#fff;font-size:20px;margin:0;font-weight:800;">Bienvenido a CaniVet</h1>
        <p style="color:rgba(255,255,255,.7);font-size:13px;margin:4px 0 0;">Tu perfil fue registrado correctamente</p>
      </div>
      <div style="padding:28px 32px;">
        <p style="color:#334155;font-size:15px;margin-bottom:20px;">Hola <strong>{nombre}</strong>,</p>
        <p style="color:#475569;font-size:14px;line-height:1.7;margin-bottom:20px;">
          Ya formas parte de <strong>CaniVet</strong>. Desde ahora podrás recibir por este correo
          recordatorios, confirmaciones de citas y avisos importantes relacionados con tus mascotas.
        </p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:7px 0;color:#64748b;">Sucursal</td>
                <td style="padding:7px 0;color:#0f172a;font-weight:600;text-align:right;">{sucursal}</td></tr>
            {f'<tr><td style="padding:7px 0;color:#64748b;">Teléfono</td><td style="padding:7px 0;color:#0f172a;text-align:right;">{telefono}</td></tr>' if telefono else ''}
          </table>
        </div>
        <p style="color:#64748b;font-size:13px;margin-top:20px;text-align:center;">
          Gracias por confiar en nosotros para el cuidado de tus mascotas.
        </p>
      </div>
      <div style="background:#f1f5f9;padding:14px 32px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 CaniVet - República Dominicana</p>
      </div>
    </div>
    """

    ok = email_service.send_email(email_c, subject, text, html)
    if ok:
        return _ok(f"Bienvenida enviada a {email_c}")
    return _err(f"Error SMTP: {email_service.last_error}", 500)
