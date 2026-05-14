const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const request = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const fieldErrors = data?.errors && typeof data.errors === 'object'
      ? Object.values(data.errors).filter(Boolean).join(' ')
      : ''
    const err = new Error(fieldErrors || data.error || data.detail || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

const authHeader = (token) => ({ Authorization: `Bearer ${token}` })

export const backend = {
  // Auth
  getRedirect: (token) =>
    request('/auth/redirect', { method: 'POST', headers: authHeader(token) }),

  // Reservas online (endpoint público — sin token)
  getAppointments: (token) =>
    request('/api/citas/', { method: 'GET', headers: authHeader(token) }),

  createAppointment: (token, payload) =>
    request('/api/citas/', {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify(payload),
    }),

  updateAppointment: (token, id, payload) =>
    request(`/api/citas/${id}`, {
      method: 'PUT',
      headers: authHeader(token),
      body: JSON.stringify(payload),
    }),

  deleteAppointment: (token, id) =>
    request(`/api/citas/${id}`, {
      method: 'DELETE',
      headers: authHeader(token),
    }),

  sendAppointmentConfirmation: (token, payload) =>
    request('/api/citas/notify-confirmation', {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify(payload),
    }),

  createReserva: (payload) =>
    request('/api/reservas', { method: 'POST', body: JSON.stringify(payload) }),

  // ── Emails (no requieren token — se llaman después de guardar en Supabase) ──
  emailTestAdmin: () =>
    request('/api/email/test', { method: 'POST' }),

  emailReserva: (payload) =>
    request('/api/email/reserva', { method: 'POST', body: JSON.stringify(payload) }),

  emailCitaConfirmada: (payload) =>
    request('/api/email/cita-confirmada', { method: 'POST', body: JSON.stringify(payload) }),

  emailReservaRechazada: (payload) =>
    request('/api/email/reserva-rechazada', { method: 'POST', body: JSON.stringify(payload) }),

  emailReciboPago: (payload) =>
    request('/api/email/recibo-pago', { method: 'POST', body: JSON.stringify(payload) }),

  emailAlertaVacuna: (payload) =>
    request('/api/email/alerta-vacuna', { method: 'POST', body: JSON.stringify(payload) }),

  emailRecordatorioCita: (payload) =>
    request('/api/email/recordatorio-cita', { method: 'POST', body: JSON.stringify(payload) }),

  emailLinkPago: (payload) =>
    request('/api/email/link-pago', { method: 'POST', body: JSON.stringify(payload) }),

  emailManualNotification: (payload) =>
    request('/api/email/manual-notification', { method: 'POST', body: JSON.stringify(payload) }),

  emailClientWelcome: (payload) =>
    request('/api/email/client-welcome', { method: 'POST', body: JSON.stringify(payload) }),

  // Stripe (requiere token)
  createStripeCheckout: (token, payload) =>
    request('/api/stripe/checkout', {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify(payload),
    }),
}
