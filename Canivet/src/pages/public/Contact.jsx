import { Navbar } from '../../components/Layout/Navbar'
import { useState } from 'react'
import { validateEmail } from '../../utils/validators'
import { sendContactMessage } from '../../services/contactService'

const css = `
.contact-wrap { padding-top: 64px; }
.contact-hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%);
  padding: 60px 40px; text-align: center;
}
.contact-hero h1 { font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 10px; }
.contact-hero p  { font-size: 15px; color: rgba(255,255,255,.55); max-width: 500px; margin: 0 auto; }
.contact-body { padding: 60px 40px; max-width: 900px; margin: 0 auto; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
.contact-info { display: flex; flex-direction: column; gap: 14px; }
.contact-info h3 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
.contact-info p  { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 10px; }
.c-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px; background: #f8fafc;
  border-radius: 10px; border: 1px solid #e2e8f0;
}
.c-ic {
  width: 38px; height: 38px; border-radius: 9px; background: #eff6ff;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.c-text strong { display: block; font-size: 12px; font-weight: 700; margin-bottom: 3px; }
.c-text span   { font-size: 13px; color: #64748b; }
.contact-form {
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 14px; padding: 28px;
}
.contact-form h3 { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
.f-group  { margin-bottom: 14px; }
.f-label  { display: block; font-size: 12px; font-weight: 700; margin-bottom: 5px; }
.f-input  {
  width: 100%; padding: 9px 12px; border: 1.5px solid #e2e8f0;
  border-radius: 8px; font-size: 13px; outline: none;
  font-family: inherit; transition: border .15s;
}
.f-input:focus { border-color: #3b82f6; }
.btn-send {
  width: 100%; padding: 12px; background: #3b82f6; color: #fff;
  border: none; border-radius: 8px; font-size: 13px;
  font-weight: 600; cursor: pointer; transition: background .15s;
}
.btn-send:hover { background: #2563eb; }
.send-ok {
  background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 9px;
  padding: 12px 16px; font-size: 13px; color: #15803d;
  font-weight: 600; text-align: center; margin-top: 12px;
}
.footer { background: #0f172a; padding: 32px; text-align: center; margin-top: 60px; }
.footer-brand { display: flex; align-items: center; gap: 8px; justify-content: center; margin-bottom: 10px; }
.footer-ic { width: 26px; height: 26px; background: #3b82f6; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; }
.footer strong { color: #fff; font-size: 14px; font-weight: 700; }
.footer p { color: rgba(255,255,255,.35); font-size: 12px; }
@media(max-width:768px){ .contact-grid{grid-template-columns:1fr} }
`

const INFO = [
  { icon: '📍', label: 'Dirección', value: 'Av. Winston Churchill, Santo Domingo, RD' },
  { icon: '📞', label: 'Teléfono', value: '809-555-0100' },
  { icon: '✉️', label: 'Email', value: 'info@canivet.com.do' },
  { icon: '🕒', label: 'Horario', value: 'Lun-Vie 8am-6pm · Sáb 9am-2pm' },
]

export const ContactPage = () => {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    setError('')

    if (!form.nombre || !form.email || !form.mensaje) {
      setError('Por favor completa todos los campos obligatorios.')
      return
    }

    if (!validateEmail(form.email)) {
      setError('Ingresa un correo electronico valido.')
      return
    }

    if (form.mensaje.trim().length < 10) {
      setError('El mensaje debe tener al menos 10 caracteres.')
      return
    }

    setLoading(true)
    try {
      await sendContactMessage(form)
      setSent(true)
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{css}</style>
      <Navbar />
      <div className="contact-wrap">
        <div className="contact-hero">
          <h1>Contáctanos</h1>
          <p>Estamos aquí para ayudarte. Escríbenos o llámanos y te responderemos a la brevedad.</p>
        </div>
        <div className="contact-body">
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Información de contacto</h3>
              <p>No dudes en comunicarte con nosotros por cualquiera de estos medios.</p>
              {INFO.map((item) => (
                <div className="c-item" key={item.label}>
                  <div className="c-ic">{item.icon}</div>
                  <div className="c-text">
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="contact-form">
              <h3>Envíanos un mensaje</h3>
              {[
                { label: 'Nombre completo *', key: 'nombre', type: 'text', ph: 'Juan Pérez' },
                { label: 'Correo electrónico *', key: 'email', type: 'email', ph: 'tu@email.com' },
                { label: 'Asunto', key: 'asunto', type: 'text', ph: '¿En qué podemos ayudarte?' },
              ].map((field) => (
                <div className="f-group" key={field.key}>
                  <label className="f-label">{field.label}</label>
                  <input
                    className="f-input"
                    type={field.type}
                    placeholder={field.ph}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="f-group">
                <label className="f-label">Mensaje *</label>
                <textarea
                  className="f-input"
                  rows={4}
                  placeholder="Escribe tu mensaje aquí..."
                  style={{ resize: 'none' }}
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                />
              </div>
              {!sent ? (
                <>
                  <button className="btn-send" onClick={handleSend} disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                  </button>
                  {error ? <div className="send-ok" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c' }}>{error}</div> : null}
                </>
              ) : (
                <div className="send-ok">Mensaje enviado. Te contactaremos pronto.</div>
              )}
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="footer-brand">
            <div className="footer-ic">🐾</div>
            <strong>CaniVet</strong>
          </div>
          <p>© 2026 CaniVet · Sistema de gestión canina. República Dominicana.</p>
        </footer>
      </div>
    </>
  )
}
