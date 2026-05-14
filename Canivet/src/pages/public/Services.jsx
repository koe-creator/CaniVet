import { useEffect, useState } from 'react'
import { Navbar } from '../../components/Layout/Navbar'
import { supabase } from '../../services/supabase'
import { backend } from '../../services/backend'
import { sendReservaEmails } from '../../services/emailService'

const FALLBACK_SERVICES = [
  { id: null, icon: '🩺', nombre: 'Consulta General',       descripcion: 'Revisión médica completa con diagnóstico y recomendaciones del veterinario.',               precio: 800  },
  { id: null, icon: '💉', nombre: 'Vacunación',              descripcion: 'Plan de vacunas completo para mantener a tu mascota protegida todo el año.',                precio: 1200 },
  { id: null, icon: '🛁', nombre: 'Baño y Corte',            descripcion: 'Servicio de grooming completo con baño, secado, corte de pelo y arreglo de uñas.',         precio: 600  },
  { id: null, icon: '🦠', nombre: 'Desparasitación',         descripcion: 'Tratamiento interno y externo contra parásitos para una mascota completamente saludable.', precio: 500  },
  { id: null, icon: '🔬', nombre: 'Exámenes de Laboratorio', descripcion: 'Análisis de sangre, orina y otros exámenes clínicos especializados.',                     precio: 1500 },
  { id: null, icon: '🏥', nombre: 'Cirugía Menor',           descripcion: 'Procedimientos quirúrgicos menores realizados por veterinarios certificados.',             precio: 3500 },
]

const SERVICE_ICONS = ['🩺','💉','🛁','🦠','🔬','🏥','🐾','🦷','💊','🌡️']

const todayStr = () => new Date().toISOString().slice(0, 10)

const fmtPrice = (price) => {
  if (!price) return 'Consultar precio'
  return `RD$ ${Number(price).toLocaleString('es-DO')}`
}

const EMPTY_FORM = {
  nombre: '',
  email: '',
  telefono: '',
  mascota_nombre: '',
  fecha: '',
  hora: '',
  notas: '',
}

const css = `
.svcs-wrap { padding-top: 64px; min-height: 100vh; background: #f8fafc; }

.svcs-hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%);
  padding: 72px 40px 80px; text-align: center;
}
.svcs-hero h1 { font-size: 42px; font-weight: 800; color: #fff; margin-bottom: 12px; letter-spacing: -1.5px; }
.svcs-hero p  { font-size: 16px; color: rgba(255,255,255,.6); max-width: 520px; margin: 0 auto 28px; line-height: 1.7; }
.svcs-hero-badge {
  display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px;
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2);
  border-radius: 100px; color: rgba(255,255,255,.85); font-size: 13px; font-weight: 600; margin-bottom: 20px;
}

.svcs-body { padding: 60px 40px; max-width: 1080px; margin: 0 auto; }
.svcs-intro { text-align:center; margin-bottom:40px; }
.svcs-intro h2 { font-size:28px; font-weight:800; color:#0f172a; margin-bottom:8px; }
.svcs-intro p  { font-size:15px; color:#64748b; }

.svcs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; }
@media(max-width:900px){ .svcs-grid { grid-template-columns: repeat(2,1fr) } }
@media(max-width:600px){ .svcs-grid { grid-template-columns: 1fr } }

.svc-card {
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 16px; padding: 26px; transition: all .18s;
  display: flex; flex-direction: column;
}
.svc-card:hover { border-color: #3b82f6; box-shadow: 0 8px 24px rgba(59,130,246,.12); transform: translateY(-2px); }
.svc-icon  { font-size: 32px; margin-bottom: 14px; }
.svc-card h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
.svc-card p  { font-size: 13px; color: #64748b; line-height: 1.65; margin-bottom: 20px; flex: 1; }
.svc-footer  { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.svc-price   { font-size: 20px; font-weight: 800; color: #1d4ed8; }
.svc-price span { font-size: 11px; color: #94a3b8; font-weight: 500; }
.btn-reservar {
  padding: 10px 18px; background: #1d4ed8; color: #fff; border: none;
  border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s;
  white-space: nowrap;
}
.btn-reservar:hover { background: #1e40af; }

.svcs-loading { text-align:center; padding:60px; color:#94a3b8; font-size:14px; }

/* Overlay modal */
.bk-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 999;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.bk-modal {
  background: #fff; border-radius: 18px; width: 100%; max-width: 540px;
  max-height: 90vh; overflow-y: auto; padding: 32px;
  box-shadow: 0 24px 48px rgba(0,0,0,.2);
}
.bk-modal h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.bk-service-pill {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px;
  background: #eff6ff; color: #1d4ed8; border-radius: 100px;
  font-size: 13px; font-weight: 700; margin-bottom: 20px;
}
.bk-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(max-width:480px){ .bk-grid{grid-template-columns:1fr} }
.bk-group { display:flex; flex-direction:column; gap:5px; }
.bk-group.full { grid-column:1/-1; }
.bk-label { font-size:12px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:.4px; }
.bk-input {
  padding: 11px 13px; border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-size: 14px; color: #0f172a; outline: none; transition: border-color .15s;
  font-family: inherit;
}
.bk-input:focus { border-color: #3b82f6; }
.bk-footer { display:flex; gap:10px; margin-top:22px; }
.bk-cancel {
  flex:1; padding:12px; background:#f1f5f9; color:#475569; border:none;
  border-radius:9px; font-size:14px; font-weight:600; cursor:pointer;
}
.bk-submit {
  flex:2; padding:12px; background:#1d4ed8; color:#fff; border:none;
  border-radius:9px; font-size:14px; font-weight:700; cursor:pointer; transition:background .15s;
}
.bk-submit:hover:not(:disabled) { background:#1e40af; }
.bk-submit:disabled { background:#93c5fd; cursor:not-allowed; }
.bk-error { grid-column:1/-1; background:#fef2f2; border:1px solid #fecaca; border-radius:9px; padding:10px 14px; color:#dc2626; font-size:13px; }

/* Success screen */
.bk-success {
  text-align: center; padding: 20px 0;
}
.bk-success-icon { font-size: 56px; margin-bottom: 16px; }
.bk-success h3 { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
.bk-success p { font-size: 14px; color: #64748b; line-height: 1.7; margin-bottom: 24px; }
.bk-success-detail {
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;
  padding: 16px; margin-bottom: 24px; text-align: left; font-size: 13px; color: #475569; line-height: 1.8;
}
.bk-success-detail strong { color: #0f172a; }

/* Footer */
.svcs-footer { background: #0f172a; padding: 40px; text-align: center; margin-top: 60px; }
.svcs-footer-brand { display:flex; align-items:center; gap:8px; justify-content:center; margin-bottom:8px; }
.svcs-footer-ic { width:28px; height:28px; background:#3b82f6; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:14px; }
.svcs-footer strong { color:#fff; font-size:15px; font-weight:700; }
.svcs-footer p { color:rgba(255,255,255,.35); font-size:12px; margin-top:4px; }
`

export const ServicesPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)     // servicio seleccionado para reservar
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)        // datos de la reserva confirmada

  useEffect(() => {
    supabase.from('servicios').select('*').order('nombre').then(({ data }) => {
      setServices(data?.length ? data : FALLBACK_SERVICES)
      setLoading(false)
    })
  }, [])

  const openModal = (service) => {
    setSelected(service)
    setForm({ ...EMPTY_FORM, fecha: todayStr() })
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
    if (!form.nombre.trim()) { setError('El nombre es requerido.'); return }
    if (!form.email.trim() && !form.telefono.trim()) { setError('Ingresa email o teléfono para confirmarte la cita.'); return }
    if (!form.fecha) { setError('Selecciona una fecha preferida.'); return }

    setSubmitting(true)
    setError('')

    const payload = {
      nombre:          form.nombre.trim(),
      email:           form.email.trim() || null,
      telefono:        form.telefono.trim() || null,
      mascota_nombre:  form.mascota_nombre.trim() || null,
      servicio_id:     selected?.id || null,
      servicio_nombre: selected?.nombre || '',
      fecha:           form.fecha,
      hora:            form.hora || null,
      notas:           form.notas.trim() || null,
      estado:          'pendiente',
    }

    // 1. Guardar en Supabase directo desde el navegador
    const { data, error: sbError } = await supabase
      .from('reservas_online')
      .insert(payload)
      .select()
      .single()

    setSubmitting(false)

    if (sbError) {
      setError('Ocurrió un error al enviar tu reserva. Intenta de nuevo o llámanos directamente.')
      return
    }

    // 2. Enviar emails — backend SMTP primero, EmailJS como fallback
    const emailPayload = { ...payload, id: data.id }
    backend.emailReserva(emailPayload).catch(() => {
      // Backend no disponible → usar EmailJS desde el navegador
      sendReservaEmails(emailPayload)
    })

    setSuccess({
      id:       data.id,
      nombre:   payload.nombre,
      servicio: payload.servicio_nombre,
      fecha:    payload.fecha,
      hora:     payload.hora,
      contacto: payload.email || payload.telefono,
    })
  }

  return (
    <>
      <style>{css}</style>
      <Navbar />

      <div className="svcs-wrap">
        <div className="svcs-hero">
          <div className="svcs-hero-badge">🐾 CaniVet — Veterinaria de confianza</div>
          <h1>Nuestros Servicios</h1>
          <p>Cuidado integral para tu mascota. Agenda tu cita en línea y te confirmamos en menos de 24 horas.</p>
        </div>

        <div className="svcs-body">
          <div className="svcs-intro">
            <h2>¿Qué necesita tu mascota?</h2>
            <p>Selecciona el servicio y completa el formulario. Es rápido y sin necesidad de crear cuenta.</p>
          </div>

          {loading ? (
            <p className="svcs-loading">Cargando servicios...</p>
          ) : (
            <div className="svcs-grid">
              {services.map((s, i) => (
                <div className="svc-card" key={s.id || s.nombre}>
                  <div className="svc-icon">{s.icon || SERVICE_ICONS[i % SERVICE_ICONS.length]}</div>
                  <h3>{s.nombre}</h3>
                  <p>{s.descripcion || s.desc || 'Servicio profesional a cargo de nuestro equipo veterinario.'}</p>
                  <div className="svc-footer">
                    <div className="svc-price">
                      {fmtPrice(s.precio)} <span>/ sesión</span>
                    </div>
                    <button className="btn-reservar" onClick={() => openModal(s)}>
                      Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="svcs-footer">
          <div className="svcs-footer-brand">
            <div className="svcs-footer-ic">🐾</div>
            <strong>CaniVet</strong>
          </div>
          <p>© 2026 CaniVet — Sistema de Gestión Canina. República Dominicana.</p>
        </footer>
      </div>

      {/* Modal de reserva */}
      {selected && (
        <div className="bk-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bk-modal">
            {!success ? (
              <>
                <h2>Reservar cita</h2>
                <div className="bk-service-pill">
                  {selected.icon || '🐾'} {selected.nombre}
                  {selected.precio ? ` — ${fmtPrice(selected.precio)}` : ''}
                </div>

                <div className="bk-grid">
                  {error && <div className="bk-error">{error}</div>}

                  <div className="bk-group">
                    <label className="bk-label">Tu nombre *</label>
                    <input className="bk-input" placeholder="Ej: Juan Pérez" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
                  </div>
                  <div className="bk-group">
                    <label className="bk-label">Nombre de tu mascota</label>
                    <input className="bk-input" placeholder="Ej: Max" value={form.mascota_nombre} onChange={e => set('mascota_nombre', e.target.value)} />
                  </div>
                  <div className="bk-group">
                    <label className="bk-label">Email</label>
                    <input className="bk-input" type="email" placeholder="tu@correo.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div className="bk-group">
                    <label className="bk-label">Teléfono / WhatsApp</label>
                    <input className="bk-input" placeholder="809-000-0000" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
                  </div>
                  <div className="bk-group">
                    <label className="bk-label">Fecha preferida *</label>
                    <input className="bk-input" type="date" min={todayStr()} value={form.fecha} onChange={e => set('fecha', e.target.value)} />
                  </div>
                  <div className="bk-group">
                    <label className="bk-label">Hora preferida</label>
                    <input className="bk-input" type="time" value={form.hora} onChange={e => set('hora', e.target.value)} />
                  </div>
                  <div className="bk-group full">
                    <label className="bk-label">Notas adicionales</label>
                    <textarea className="bk-input" rows={3} placeholder="Cuéntanos más sobre lo que necesita tu mascota..." value={form.notas} onChange={e => set('notas', e.target.value)} style={{ resize: 'vertical' }} />
                  </div>
                </div>

                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 14, lineHeight: 1.6 }}>
                  Al enviar, un miembro de nuestro equipo te contactará en menos de 24 horas para confirmar la cita.
                </p>

                <div className="bk-footer">
                  <button className="bk-cancel" onClick={closeModal}>Cancelar</button>
                  <button className="bk-submit" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                </div>
              </>
            ) : (
              <div className="bk-success">
                <div className="bk-success-icon">✅</div>
                <h3>¡Solicitud recibida!</h3>
                <p>
                  Gracias <strong>{success.nombre}</strong>. Te contactaremos pronto al <strong>{success.contacto}</strong> para confirmar tu cita.
                </p>
                <div className="bk-success-detail">
                  <div><strong>Servicio:</strong> {success.servicio}</div>
                  <div><strong>Fecha solicitada:</strong> {success.fecha}{success.hora ? ` a las ${success.hora}` : ''}</div>
                  <div><strong>Referencia:</strong> {String(success.id).slice(0, 8).toUpperCase()}</div>
                </div>
                <button className="bk-submit" style={{ width: '100%' }} onClick={closeModal}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
