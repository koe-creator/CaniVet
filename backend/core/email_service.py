import os
import smtplib
from email.message import EmailMessage
from flask import current_app

from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"), override=True)


class EmailService:
    def __init__(self):
        # Soporte para SMTP_USER o SMTP_USERNAME (ambos formatos)
        self.host     = os.getenv("SMTP_HOST", "")
        self.port     = int(os.getenv("SMTP_PORT", "587"))
        self.username = os.getenv("SMTP_USER") or os.getenv("SMTP_USERNAME", "")
        self.password = os.getenv("SMTP_PASS") or os.getenv("SMTP_PASSWORD", "")
        self.use_tls  = os.getenv("SMTP_USE_TLS", "true").lower() != "false"
        self.use_ssl  = os.getenv("SMTP_USE_SSL", "").lower() == "true" or self.port == 465
        self.mail_from = os.getenv("SMTP_FROM") or os.getenv("MAIL_FROM") or self.username
        self.admin_email = (
            os.getenv("ADMIN_EMAILS") or
            os.getenv("CONTACT_RECIPIENT") or
            self.mail_from
        )
        self.last_error = ""

    @property
    def configured(self):
        return bool(self.host and self.username and self.password and self.mail_from)

    def send_email(self, to_email, subject, body_text, body_html=None, reply_to=None):
        if not self.configured:
            self.last_error = "SMTP no configurado."
            return False

        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"]    = self.mail_from
        msg["To"]      = to_email
        if reply_to:
            msg["Reply-To"] = reply_to
        msg.set_content(body_text)
        if body_html:
            msg.add_alternative(body_html, subtype="html")

        try:
            smtp_client = smtplib.SMTP_SSL if self.use_ssl else smtplib.SMTP
            with smtp_client(self.host, self.port, timeout=20) as smtp:
                if self.use_tls and not self.use_ssl:
                    smtp.starttls()
                if self.username and self.password:
                    smtp.login(self.username, self.password)
                smtp.send_message(msg)
            self.last_error = ""
            return True
        except Exception as exc:
            self.last_error = str(exc)
            try:
                current_app.logger.exception("SMTP send failed: %s", exc)
            except Exception:
                pass
            return False

    # ── Emails de reservas online ──────────────────────────────────────────

    def send_booking_confirmation(self, reserva: dict) -> bool:
        """Email de confirmación al cliente que hizo la reserva."""
        to = reserva.get("email")
        if not to:
            return False

        nombre   = reserva.get("nombre", "Cliente")
        servicio = reserva.get("servicio_nombre", "el servicio solicitado")
        fecha    = reserva.get("fecha", "la fecha indicada")
        hora     = reserva.get("hora", "")
        ref      = str(reserva.get("id", ""))[:8].upper()
        mascota  = reserva.get("mascota_nombre") or "tu mascota"

        hora_str = f" a las {hora}" if hora else ""
        subject  = f"✅ Reserva recibida — {servicio} | CaniVet"

        text = (
            f"Hola {nombre},\n\n"
            f"Recibimos tu solicitud de reserva en CaniVet.\n\n"
            f"Servicio: {servicio}\n"
            f"Mascota:  {mascota}\n"
            f"Fecha:    {fecha}{hora_str}\n"
            f"Referencia: {ref}\n\n"
            f"Nuestro equipo te contactará en menos de 24 horas para confirmar la cita.\n\n"
            f"Gracias por confiar en CaniVet 🐾\n"
        )

        html = f"""
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
          <div style="max-width:540px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.07);">
            <div style="background:linear-gradient(135deg,#0f172a,#1d4ed8);padding:32px 36px;text-align:center;">
              <div style="font-size:36px;margin-bottom:8px;">🐾</div>
              <h1 style="color:#fff;font-size:22px;margin:0;font-weight:800;">CaniVet</h1>
              <p style="color:rgba(255,255,255,.7);font-size:13px;margin:4px 0 0;">Plataforma de Gestión Veterinaria</p>
            </div>
            <div style="padding:32px 36px;">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin-bottom:24px;text-align:center;">
                <p style="color:#15803d;font-weight:700;font-size:15px;margin:0;">✅ Solicitud de reserva recibida</p>
              </div>
              <p style="color:#334155;font-size:15px;margin-bottom:20px;">Hola <strong>{nombre}</strong>,</p>
              <p style="color:#64748b;font-size:14px;line-height:1.7;margin-bottom:24px;">
                Recibimos tu solicitud de reserva. Nuestro equipo te contactará en <strong>menos de 24 horas</strong> para confirmar la cita.
              </p>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;">
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr><td style="padding:6px 0;color:#64748b;">Servicio</td><td style="padding:6px 0;color:#0f172a;font-weight:600;text-align:right;">{servicio}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;">Mascota</td><td style="padding:6px 0;color:#0f172a;font-weight:600;text-align:right;">{mascota}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;">Fecha solicitada</td><td style="padding:6px 0;color:#0f172a;font-weight:600;text-align:right;">{fecha}{hora_str}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;">Referencia</td><td style="padding:6px 0;color:#1d4ed8;font-weight:800;text-align:right;">{ref}</td></tr>
                </table>
              </div>
              <p style="color:#94a3b8;font-size:12px;margin-top:24px;text-align:center;">
                Guarda tu número de referencia: <strong>{ref}</strong>
              </p>
            </div>
            <div style="background:#f1f5f9;padding:16px 36px;text-align:center;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 CaniVet — República Dominicana</p>
            </div>
          </div>
        </body>
        </html>
        """

        return self.send_email(to, subject, text, html)

    def send_admin_booking_alert(self, reserva: dict) -> bool:
        """Notificación al admin cuando llega una reserva nueva."""
        to = self.admin_email
        if not to:
            return False

        nombre   = reserva.get("nombre", "Desconocido")
        servicio = reserva.get("servicio_nombre", "—")
        fecha    = reserva.get("fecha", "—")
        hora     = reserva.get("hora", "")
        email    = reserva.get("email", "—")
        telefono = reserva.get("telefono", "—")
        mascota  = reserva.get("mascota_nombre") or "—"
        notas    = reserva.get("notas") or "Sin notas"
        ref      = str(reserva.get("id", ""))[:8].upper()

        hora_str = f" a las {hora}" if hora else ""
        subject  = f"🔔 Nueva reserva online — {nombre} ({servicio})"

        text = (
            f"Nueva reserva en CaniVet\n\n"
            f"Cliente:  {nombre}\n"
            f"Email:    {email}\n"
            f"Teléfono: {telefono}\n"
            f"Mascota:  {mascota}\n"
            f"Servicio: {servicio}\n"
            f"Fecha:    {fecha}{hora_str}\n"
            f"Notas:    {notas}\n"
            f"Ref:      {ref}\n\n"
            f"Entra al panel admin → Citas → Reservas online para confirmarla."
        )

        html = f"""
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
          <div style="max-width:540px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.07);">
            <div style="background:#0f172a;padding:24px 36px;display:flex;align-items:center;gap:12px;">
              <span style="font-size:24px;">🔔</span>
              <div>
                <h1 style="color:#fff;font-size:18px;margin:0;font-weight:800;">Nueva reserva online</h1>
                <p style="color:rgba(255,255,255,.5);font-size:12px;margin:2px 0 0;">CaniVet — Panel Admin</p>
              </div>
            </div>
            <div style="padding:28px 36px;">
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:12px 16px;margin-bottom:20px;">
                <p style="color:#92400e;font-weight:700;font-size:14px;margin:0;">⚡ Requiere confirmación en el panel admin</p>
              </div>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;margin-bottom:20px;">
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr><td style="padding:7px 0;color:#64748b;width:40%;">Cliente</td><td style="padding:7px 0;color:#0f172a;font-weight:600;">{nombre}</td></tr>
                  <tr><td style="padding:7px 0;color:#64748b;">Email</td><td style="padding:7px 0;color:#0f172a;">{email}</td></tr>
                  <tr><td style="padding:7px 0;color:#64748b;">Teléfono</td><td style="padding:7px 0;color:#0f172a;">{telefono}</td></tr>
                  <tr><td style="padding:7px 0;color:#64748b;">Mascota</td><td style="padding:7px 0;color:#0f172a;">{mascota}</td></tr>
                  <tr><td style="padding:7px 0;color:#64748b;">Servicio</td><td style="padding:7px 0;color:#1d4ed8;font-weight:700;">{servicio}</td></tr>
                  <tr><td style="padding:7px 0;color:#64748b;">Fecha</td><td style="padding:7px 0;color:#0f172a;font-weight:600;">{fecha}{hora_str}</td></tr>
                  <tr><td style="padding:7px 0;color:#64748b;">Notas</td><td style="padding:7px 0;color:#64748b;font-style:italic;">{notas}</td></tr>
                  <tr><td style="padding:7px 0;color:#64748b;">Referencia</td><td style="padding:7px 0;color:#1d4ed8;font-weight:800;">{ref}</td></tr>
                </table>
              </div>
              <a href="http://localhost:5173/admin/appointments" style="display:block;text-align:center;background:#1d4ed8;color:#fff;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
                Ver en el panel admin →
              </a>
            </div>
          </div>
        </body>
        </html>
        """

        return self.send_email(to, subject, text, html)

    def send_contact_message(self, payload: dict) -> bool:
        subject = payload.get("asunto") or "Nuevo mensaje desde contacto CaniVet"
        body = (
            f"Nombre: {payload['nombre']}\n"
            f"Correo: {payload['email']}\n\n"
            f"Mensaje:\n{payload['mensaje']}\n"
        )
        return self.send_email(
            to_email=self.admin_email,
            subject=subject,
            body_text=body,
            reply_to=payload["email"],
        )

    def send_appointment_confirmation(self, payload: dict) -> bool:
        to = payload.get("client_email")
        if not to:
            return False

        nombre = payload.get("client_name", "Cliente")
        mascota = payload.get("pet_name", "tu mascota")
        servicio = payload.get("service_name", "el servicio")
        fecha = payload.get("fecha", "")
        hora = payload.get("hora", "")
        sucursal = payload.get("branch_name", "CaniVet")
        hora_str = f" a las {hora}" if hora else ""

        subject = f"Cita confirmada | {servicio} | CaniVet"
        text = (
            f"Hola {nombre},\n\n"
            f"Tu cita ha sido confirmada en CaniVet.\n\n"
            f"Mascota: {mascota}\n"
            f"Servicio: {servicio}\n"
            f"Fecha: {fecha}{hora_str}\n"
            f"Sucursal: {sucursal}\n\n"
            f"Te esperamos.\n"
        )

        html = f"""
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
          <div style="max-width:540px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
            <div style="background:linear-gradient(135deg,#0f172a,#1d4ed8);padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;">CaniVet</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,.75);font-size:13px;">Confirmacion de cita</p>
            </div>
            <div style="padding:28px 32px;">
              <p style="font-size:15px;color:#334155;">Hola <strong>{nombre}</strong>,</p>
              <p style="font-size:14px;color:#64748b;line-height:1.7;">Tu cita fue confirmada exitosamente. Aqui tienes los detalles:</p>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;">
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr><td style="padding:6px 0;color:#64748b;">Mascota</td><td style="padding:6px 0;text-align:right;color:#0f172a;font-weight:600;">{mascota}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;">Servicio</td><td style="padding:6px 0;text-align:right;color:#0f172a;font-weight:600;">{servicio}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;">Fecha</td><td style="padding:6px 0;text-align:right;color:#0f172a;font-weight:600;">{fecha}{hora_str}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;">Sucursal</td><td style="padding:6px 0;text-align:right;color:#0f172a;font-weight:600;">{sucursal}</td></tr>
                </table>
              </div>
            </div>
          </div>
        </body>
        </html>
        """

        return self.send_email(to, subject, text, html)

    def send_booking_rejection(self, payload: dict) -> bool:
        to = payload.get("email")
        if not to:
            return False

        nombre = payload.get("nombre", "Cliente")
        mascota = payload.get("mascota", "tu mascota")
        servicio = payload.get("servicio", "el servicio solicitado")
        fecha = payload.get("fecha", "")
        hora = payload.get("hora", "")
        motivo = payload.get("motivo", "")
        hora_str = f" a las {hora}" if hora else ""

        subject = f"Actualizacion de tu reserva | {servicio} | CaniVet"
        text = (
            f"Hola {nombre},\n\n"
            f"Te informamos que no pudimos confirmar tu reserva en CaniVet.\n\n"
            f"Mascota: {mascota}\n"
            f"Servicio: {servicio}\n"
            f"Fecha solicitada: {fecha}{hora_str}\n"
            f"{f'Motivo: {motivo}\\n' if motivo else ''}\n"
            f"Si deseas, puedes contactarnos para reprogramar o elegir otro horario.\n"
        )

        motivo_html = (
            f"""
                  <tr>
                    <td style="padding:6px 0;color:#64748b;">Motivo</td>
                    <td style="padding:6px 0;text-align:right;color:#0f172a;font-weight:600;">{motivo}</td>
                  </tr>
            """
            if motivo else ""
        )

        html = f"""
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
          <div style="max-width:540px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
            <div style="background:linear-gradient(135deg,#7f1d1d,#dc2626);padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;">CaniVet</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,.8);font-size:13px;">Actualizacion de reserva</p>
            </div>
            <div style="padding:28px 32px;">
              <p style="font-size:15px;color:#334155;">Hola <strong>{nombre}</strong>,</p>
              <p style="font-size:14px;color:#64748b;line-height:1.7;">
                En este momento no pudimos confirmar la reserva solicitada. Puedes escribirnos para ayudarte a reprogramarla.
              </p>
              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:18px;">
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr><td style="padding:6px 0;color:#64748b;">Mascota</td><td style="padding:6px 0;text-align:right;color:#0f172a;font-weight:600;">{mascota}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;">Servicio</td><td style="padding:6px 0;text-align:right;color:#0f172a;font-weight:600;">{servicio}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;">Fecha solicitada</td><td style="padding:6px 0;text-align:right;color:#0f172a;font-weight:600;">{fecha}{hora_str}</td></tr>
                  {motivo_html}
                </table>
              </div>
            </div>
          </div>
        </body>
        </html>
        """

        return self.send_email(to, subject, text, html)


email_service = EmailService()
