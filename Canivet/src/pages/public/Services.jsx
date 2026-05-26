import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../../components/Layout/Navbar'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'
import { backend } from '../../services/backend'
import { sendReservaEmails } from '../../services/emailService'

const FALLBACK_SERVICES = [
  { id: null, emoji: '\u{1FA7A}', nombre: 'Consulta General', descripcion: 'Revision medica completa con diagnostico y recomendaciones.', precio: 800 },
  { id: null, emoji: '\u{1F489}', nombre: 'Vacunacion', descripcion: 'Plan de vacunas completo para mantener a tu mascota protegida.', precio: 1200 },
  { id: null, emoji: '\u{1F6C1}', nombre: 'Bano y Corte', descripcion: 'Servicio de grooming completo con bano, secado y arreglo.', precio: 600 },
]

const todayStr = () => new Date().toISOString().slice(0, 10)
const fmtPrice = (price) => price ? `RD$ ${Number(price).toLocaleString('es-DO')}` : 'Consultar precio'
const normalizeServiceName = (value = '') => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const resolveServiceEmoji = (service) => {
  if (service?.emoji) return service.emoji
  const name = normalizeServiceName(service?.nombre)
  if (name.includes('consulta')) return '\u{1FA7A}'
  if (name.includes('vacun')) return '\u{1F489}'
  if (name.includes('bano') || name.includes('groom')) return '\u{1F6C1}'
  if (name.includes('cirug')) return '\u{1F3E5}'
  if (name.includes('pelu')) return '\u2702\uFE0F'
  if (name.includes('desparasit')) return '\u{1F9A0}'
  if (name.includes('laboratorio')) return '\u{1F9EA}'
  if (name.includes('emergencia')) return '\u{1F691}'
  return '\u{1F43E}'
}

const EMPTY_FORM = {
  nombre: '',
  email: '',
  mascota_nombre: '',
  fecha: '',
  hora: '',
  notas: '',
}

const css = `
.svcs-wrap { padding-top: 64px; min-height: 100vh; background: #f8fafc; }
.svcs-hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%); padding: 72px 40px 80px; text-align: center; }
.svcs-hero h1 { font-size: 42px; font-weight: 800; color: #fff; margin-bottom: 12px; }
.svcs-hero p { font-size: 16px; color: rgba(255,255,255,.72); max-width: 560px; margin: 0 auto 28px; line-height: 1.7; }
.svcs-body { padding: 60px 40px; max-width: 1080px; margin: 0 auto; }
.svcs-intro { text-align: center; margin-bottom: 40px; }
.svcs-intro h2 { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
.svcs-intro p { font-size: 15px; color: #64748b; }
.svcs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; }
@media(max-width:900px){ .svcs-grid { grid-template-columns: repeat(2,1fr) } }
@media(max-width:600px){ .svcs-grid { grid-template-columns: 1fr } }
.svc-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 26px; display: flex; flex-direction: column; }
.svc-icon {
  width: 54px; height: 54px; border-radius: 16px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 16px;
}
.svc-card h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
.svc-card p { font-size: 13px; color: #64748b; line-height: 1.65; margin-bottom: 20px; flex: 1; }
.svc-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.svc-price { font-size: 20px; font-weight: 800; color: #1d4ed8; }
.btn-reservar { padding: 10px 18px; background: #1d4ed8; color: #fff; border: none; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; }
.svcs-footer { background: #0f172a; padding: 40px; text-align: center; margin-top: 60px; color: rgba(255,255,255,.4); }
.bk-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 20px; }
.bk-modal { background: #fff; border-radius: 18px; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; padding: 32px; box-shadow: 0 24px 48px rgba(0,0,0,.2); }
.bk-modal h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
.bk-note { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 14px; color: #1d4ed8; font-size: 13px; margin-bottom: 16px; }
.bk-error { background: #fef2f2; border: 1px solid #fecaca; border-radius: 9px; padding: 10px 14px; color: #dc2626; font-size: 13px; margin-bottom: 12px; }
.bk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media(max-width:480px){ .bk-grid { grid-template-columns: 1fr } }
.bk-group { display: flex; flex-direction: column; gap: 5px; }
.bk-group.full { grid-column: 1/-1; }
.bk-label { font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .4px; }
.bk-input { padding: 11px 13px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 14px; color: #0f172a; }
.bk-footer { display: flex; gap: 10px; margin-top: 22px; }
.bk-cancel, .bk-submit { padding: 12px; border: none; border-radius: 9px; font-size: 14px; font-weight: 700; cursor: pointer; }
.bk-cancel { flex: 1; background: #f1f5f9; color: #475569; }
.bk-submit { flex: 2; background: #1d4ed8; color: #fff; }
.bk-submit:disabled { background: #93c5fd; cursor: not-allowed; }
.bk-success { text-align: center; padding: 20px 0; }
.bk-success h3 { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
.bk-success-detail { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: left; font-size: 13px; color: #475569; line-height: 1.8; }
`

export const ServicesPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, profile, user, nombreUsuario, getToken } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const resolvedName = profile?.nombre || user?.user_metadata?.nombre || user?.user_metadata?.name || nombreUsuario || ''
  const resolvedEmail = profile?.email || user?.email || ''

  useEffect(() => {
    supabase.from('servicios').select('*').order('nombre').then(({ data }) => {
      setServices(data?.length ? data : FALLBACK_SERVICES)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    setForm(prev => ({
      ...prev,
      nombre: prev.nombre || resolvedName,
      email: prev.email || resolvedEmail,
    }))
  }, [isAuthenticated, resolvedEmail, resolvedName])

  const openModal = (service) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true)
      return
    }
    setSelected(service)
    setForm(prev => ({
      ...EMPTY_FORM,
      nombre: resolvedName || prev.nombre || '',
      email: resolvedEmail || prev.email || '',
      fecha: todayStr(),
    }))
    setError('')
    setSuccess(null)
  }

  const closeModal = () => {
    setSelected(null)
    setSuccess(null)
    setError('')
  }

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    const effectiveName = form.nombre.trim() || resolvedName.trim()
    const effectiveEmail = form.email.trim() || resolvedEmail.trim()

    if (!effectiveName) { setError('El nombre es requerido.'); return }
    if (!effectiveEmail) { setError('El email es requerido para confirmar la cita.'); return }
    if (!form.fecha) { setError('Selecciona una fecha preferida.'); return }

    setSubmitting(true)
    setError('')

    const payload = {
      nombre: effectiveName,
      email: effectiveEmail,
      mascota_nombre: form.mascota_nombre.trim() || null,
      servicio_id: selected?.id || null,
      servicio_nombre: selected?.nombre || '',
      fecha: form.fecha,
      hora: form.hora || null,
      notas: form.notas.trim() || null,
    }

    try {
      const token = getToken()
      const response = await backend.createReserva(token, payload)
      const reserva = response?.data || response
      const emailPayload = { ...payload, id: reserva?.id }
      backend.emailReserva(emailPayload).catch(() => sendReservaEmails(emailPayload))

      setSuccess({
        id: reserva?.id,
        nombre: payload.nombre,
        servicio: payload.servicio_nombre,
        fecha: payload.fecha,
        hora: payload.hora,
        contacto: payload.email,
      })
    } catch (nextError) {
      setError(nextError.message || 'Ocurrio un error al enviar tu reserva.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <style>{css}</style>
      <Navbar />
      <div className="svcs-wrap">
        <div className="svcs-hero">
          <h1>Nuestros Servicios</h1>
          <p>Para reservar necesitas iniciar sesion o registrarte. Asi tu solicitud queda asociada correctamente a tu cuenta.</p>
        </div>
        <div className="svcs-body">
          <div className="svcs-intro">
            <h2>Reserva protegida</h2>
            <p>{isAuthenticated ? 'Ya puedes reservar normalmente.' : 'Debes iniciar sesion o registrarte para realizar una reserva.'}</p>
          </div>
          {loading ? (
            <p>Cargando servicios...</p>
          ) : (
            <div className="svcs-grid">
              {services.map((service) => (
                <div className="svc-card" key={service.id || service.nombre}>
                  <div className="svc-icon" aria-hidden="true">{resolveServiceEmoji(service)}</div>
                  <h3>{service.nombre}</h3>
                  <p>{service.descripcion || 'Servicio profesional a cargo de nuestro equipo veterinario.'}</p>
                  <div className="svc-footer">
                    <div className="svc-price">{fmtPrice(service.precio)}</div>
                    <button className="btn-reservar" onClick={() => openModal(service)}>Reservar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <footer className="svcs-footer">{'\u00A9'} 2026 CaniVet</footer>
      </div>

      {showAuthPrompt && (
        <div className="bk-overlay" onClick={(event) => event.target === event.currentTarget && setShowAuthPrompt(false)}>
          <div className="bk-modal">
            <h2>Acceso requerido</h2>
            <div className="bk-note">Debes iniciar sesion o registrarte para realizar una reserva.</div>
            <div className="bk-footer">
              <button className="bk-cancel" onClick={() => setShowAuthPrompt(false)}>Cancelar</button>
              <button className="bk-submit" onClick={() => navigate('/login?next=/servicios')}>Ir al login</button>
            </div>
            <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13 }}>
              <button className="login-link" style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/registro?next=/servicios')}>
                Crear cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="bk-overlay" onClick={(event) => event.target === event.currentTarget && closeModal()}>
          <div className="bk-modal">
            {!success ? (
              <>
                <h2>Reservar cita</h2>
                <div className="bk-note">La reserva se asociara a tu cuenta autenticada.</div>
                {error && <div className="bk-error">{error}</div>}
                <div className="bk-grid">
                  <div className="bk-group">
                    <label className="bk-label">Tu nombre *</label>
                    <input className="bk-input" value={form.nombre} placeholder={resolvedName || 'Tu nombre'} onChange={(event) => set('nombre', event.target.value)} />
                  </div>
                  <div className="bk-group">
                    <label className="bk-label">Nombre de tu mascota</label>
                    <input className="bk-input" value={form.mascota_nombre} onChange={(event) => set('mascota_nombre', event.target.value)} />
                  </div>
                  <div className="bk-group">
                    <label className="bk-label">Email</label>
                    <input className="bk-input" type="email" value={form.email} placeholder={resolvedEmail || 'tu@email.com'} onChange={(event) => set('email', event.target.value)} />
                  </div>
                  <div className="bk-group">
                    <label className="bk-label">Fecha preferida *</label>
                    <input className="bk-input" type="date" min={todayStr()} value={form.fecha} onChange={(event) => set('fecha', event.target.value)} />
                  </div>
                  <div className="bk-group">
                    <label className="bk-label">Hora preferida</label>
                    <input className="bk-input" type="time" value={form.hora} onChange={(event) => set('hora', event.target.value)} />
                  </div>
                  <div className="bk-group full">
                    <label className="bk-label">Notas</label>
                    <textarea className="bk-input" rows={3} value={form.notas} onChange={(event) => set('notas', event.target.value)} />
                  </div>
                </div>
                <div className="bk-footer">
                  <button className="bk-cancel" onClick={closeModal}>Cancelar</button>
                  <button className="bk-submit" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar solicitud'}</button>
                </div>
              </>
            ) : (
              <div className="bk-success">
                <h3>Solicitud recibida</h3>
                <p>Tu reserva quedo asociada a tu cuenta y sera revisada por el equipo.</p>
                <div className="bk-success-detail">
                  <div><strong>Servicio:</strong> {success.servicio}</div>
                  <div><strong>Fecha:</strong> {success.fecha}{success.hora ? ` ${success.hora}` : ''}</div>
                  <div><strong>Contacto:</strong> {success.contacto}</div>
                  <div><strong>Referencia:</strong> {String(success.id || '').slice(0, 8).toUpperCase()}</div>
                </div>
                <button className="bk-submit" style={{ width: '100%' }} onClick={closeModal}>Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
