import emailjs from '@emailjs/browser'

const PUBLIC_KEY       = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
const SERVICE_ID       = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const ADMIN_EMAIL      = import.meta.env.VITE_EMAILJS_ADMIN_EMAIL || ''

const TPL_RESERVA_CLIENTE   = import.meta.env.VITE_EMAILJS_TEMPLATE_RESERVA_CLIENTE   || 'template_reserva_cliente'
const TPL_RESERVA_ADMIN     = import.meta.env.VITE_EMAILJS_TEMPLATE_RESERVA_ADMIN     || 'template_reserva_admin'
const TPL_CITA_CONFIRMADA   = import.meta.env.VITE_EMAILJS_TEMPLATE_CITA_CONFIRMADA   || 'template_cita_confirmada'

// Inicializar EmailJS una sola vez
let initialized = false
const init = () => {
  if (!initialized && PUBLIC_KEY && PUBLIC_KEY !== 'reemplaza_con_tu_public_key') {
    emailjs.init({ publicKey: PUBLIC_KEY })
    initialized = true
  }
}

const configured = () => {
  init()
  return Boolean(SERVICE_ID && PUBLIC_KEY && PUBLIC_KEY !== 'reemplaza_con_tu_public_key')
}

const send = async (templateId, params) => {
  if (!configured()) {
    console.warn('[emailService] EmailJS no configurado — verifica las variables VITE_EMAILJS_* en .env')
    return { success: false, reason: 'not_configured' }
  }
  try {
    await emailjs.send(SERVICE_ID, templateId, params)
    return { success: true }
  } catch (err) {
    console.error('[emailService] Error enviando email:', err)
    return { success: false, reason: err?.text || String(err) }
  }
}

// ── Emails de reserva online ──────────────────────────────────────────────────

/**
 * Email de confirmación al cliente que hizo la reserva.
 */
export const sendReservaConfirmacion = (reserva) =>
  send(TPL_RESERVA_CLIENTE, {
    to_email:   reserva.email || '',
    nombre:     reserva.nombre || 'Cliente',
    servicio:   reserva.servicio_nombre || 'el servicio solicitado',
    mascota:    reserva.mascota_nombre || 'su mascota',
    fecha:      reserva.fecha || 'la fecha indicada',
    hora:       reserva.hora || '',
    referencia: String(reserva.id || '').slice(0, 8).toUpperCase(),
    reply_to:   ADMIN_EMAIL,
  })

/**
 * Email de alerta al admin cuando llega una reserva nueva.
 */
export const sendReservaAdmin = (reserva) =>
  send(TPL_RESERVA_ADMIN, {
    to_email:      ADMIN_EMAIL,
    nombre:        reserva.nombre || 'Desconocido',
    email_cliente: reserva.email || '—',
    telefono:      reserva.telefono || '—',
    mascota:       reserva.mascota_nombre || '—',
    servicio:      reserva.servicio_nombre || '—',
    fecha:         reserva.fecha || '—',
    hora:          reserva.hora || '',
    notas:         reserva.notas || 'Sin notas',
    referencia:    String(reserva.id || '').slice(0, 8).toUpperCase(),
  })

/**
 * Envía ambos emails de reserva (cliente + admin) en paralelo.
 */
export const sendReservaEmails = async (reserva) => {
  const [clienteRes, adminRes] = await Promise.allSettled([
    reserva.email ? sendReservaConfirmacion(reserva) : Promise.resolve({ success: true, reason: 'no_email' }),
    sendReservaAdmin(reserva),
  ])
  return {
    cliente: clienteRes.status === 'fulfilled' ? clienteRes.value : { success: false },
    admin:   adminRes.status === 'fulfilled'   ? adminRes.value   : { success: false },
  }
}

// ── Email de cita confirmada ──────────────────────────────────────────────────

/**
 * Email al cliente cuando el admin confirma su reserva.
 */
export const sendCitaConfirmada = (params) =>
  send(TPL_CITA_CONFIRMADA, {
    to_email:  params.clientEmail || '',
    nombre:    params.clientName  || 'Cliente',
    mascota:   params.petName     || 'su mascota',
    servicio:  params.serviceName || 'el servicio',
    fecha:     params.fecha       || '',
    hora:      params.hora        || '',
    sucursal:  params.branchName  || 'CaniVet',
    reply_to:  ADMIN_EMAIL,
  })

// ── Estado de configuración (útil para Settings) ─────────────────────────────
export const emailConfigured = () => configured()
