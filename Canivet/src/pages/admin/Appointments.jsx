import { useEffect, useState } from 'react'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { Pagination } from '../../components/ui/Pagination'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { useAppConfig } from '../../context/AppConfigContext'
import { useAuth } from '../../context/AuthContext'
import { fmtMoney } from '../../utils/formatters'
import { validateAppointmentForm } from '../../utils/validators'
import { supabase } from '../../services/supabase'
import { backend } from '../../services/backend'
import { sendCitaConfirmada } from '../../services/emailService'

const EMPTY = { fecha: '', hora: '', cliente_id: '', mascota_id: '', servicio_id: '', notas: '', branch_id: '', status: 'pendiente' }
const STATUS_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente', tag: 'tag-amber' },
  { value: 'confirmada', label: 'Confirmada', tag: 'tag-blue' },
  { value: 'en_proceso', label: 'En proceso', tag: 'tag-purple' },
  { value: 'completada', label: 'Completada', tag: 'tag-green' },
  { value: 'cancelada', label: 'Cancelada', tag: 'tag-red' },
]
const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS.map((option) => [option.value, option.label]))
const ONLINE_STATUS_LABELS = {
  enviado: 'Link enviado',
  pagado: 'Pagado',
  fallido: 'Fallido',
  vencido: 'Vencido',
  cancelado: 'Cancelado',
}
const PHOTO_ALLOWED_STATUSES = new Set(['en_proceso', 'completada'])

export const CitasPage = () => {
  const { records, loading, error, load, create, update, remove, page, totalPages, total, pageSize, hasPrev, hasMore, nextPage, prevPage } = useSupabaseCRUD('citas', 'fecha')
  const { records: clientes, error: clientsError, load: loadClients } = useSupabaseCRUD('clientes', 'nombre')
  const { records: mascotas, error: petsError, load: loadPets } = useSupabaseCRUD('mascotas', 'nombre')
  const { records: servicios, error: servicesError, load: loadServices } = useSupabaseCRUD('servicios', 'nombre')
  const {
    branches,
    preferredBranchId,
    preferences,
    filterRecords,
    assignRecordBranch,
    getRecordBranchId,
    getBranchName,
    getAppointmentStatus,
    setAppointmentStatus,
    getOnlinePaymentByAppointmentId,
    createOnlinePayment,
    updateOnlinePayment,
    createNotification,
    getServicePhotos,
    saveServicePhoto,
    removeServicePhoto,
  } = useAppConfig()
  const { getToken } = useAuth()
  const { toast, show } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todas')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [errors, setErrors] = useState({})
  const [photoModal, setPhotoModal] = useState(false)
  const [photoAppt, setPhotoAppt] = useState(null)
  const [photoCaption, setPhotoCaption] = useState('')
  const [photoType, setPhotoType] = useState('antes')
  const [activeTab, setActiveTab] = useState('citas')
  const [reservas, setReservas] = useState([])
  const [reservasLoading, setReservasLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [confirmReserva, setConfirmReserva] = useState(null)

  useEffect(() => {
    if (activeTab !== 'reservas') return
    setReservasLoading(true)
    supabase.from('reservas_online').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setReservas(data || [])
      setReservasLoading(false)
    })
  }, [activeTab])

  const pendingReservas = reservas.filter(r => r.estado === 'pendiente').length

  const refreshReservas = async () => {
    const { data } = await supabase.from('reservas_online').select('*').order('created_at', { ascending: false })
    setReservas(data || [])
  }

  const handleRejectReserva = async (reserva) => {
    if (!window.confirm(`Rechazar la reserva de ${reserva.nombre}?`)) return
    await supabase.from('reservas_online').update({ estado: 'rechazada' }).eq('id', reserva.id)
    await refreshReservas()
    if (reserva.email) {
      backend.emailReservaRechazada({
        email: reserva.email,
        nombre: reserva.nombre,
        mascota: reserva.mascota_nombre,
        servicio: reserva.servicio_nombre,
        fecha: reserva.fecha,
        hora: reserva.hora,
      }).catch(() => {})
    }
    show(reserva.email ? 'Reserva rechazada y cliente notificado' : 'Reserva rechazada')
  }

  const openConfirmModal = (reserva) => {
    setConfirmReserva(reserva)
    setForm({
      fecha: reserva.fecha || '',
      hora: reserva.hora || '',
      cliente_id: '',
      mascota_id: '',
      servicio_id: reserva.servicio_id || '',
      notas: `Reserva online de ${reserva.nombre} (${reserva.email || reserva.telefono || 'sin contacto'}). Mascota: ${reserva.mascota_nombre || 'no indicada'}.${reserva.notas ? ` Nota: ${reserva.notas}` : ''}`,
      branch_id: preferredBranchId,
      status: 'confirmada',
    })
    setEditing(null)
    setErrors({})
    setConfirmModal(true)
    loadClients()
    loadPets()
    loadServices()
  }

  const handleConfirmReserva = async () => {
    const nextErrors = validateAppointmentForm(form)
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    const payload = { fecha: form.fecha, hora: form.hora, cliente_id: form.cliente_id, mascota_id: form.mascota_id, servicio_id: form.servicio_id, notas: form.notas }
    const { data, error: saveError } = await create(payload)
    if (saveError) { show(`Error: ${saveError.message}`, false); return }
    const apptId = data?.[0]?.id
    assignRecordBranch('appointments', apptId, form.branch_id)
    setAppointmentStatus(apptId, 'confirmada')
    await supabase.from('reservas_online').update({ estado: 'confirmada', cita_id: apptId }).eq('id', confirmReserva.id)
    await refreshReservas()

    // Email de confirmación al cliente — backend SMTP, fallback EmailJS
    if (confirmReserva.email) {
      const service = servicios.find(s => String(s.id) === String(form.servicio_id))
      const emailData = {
        email:    confirmReserva.email,
        nombre:   confirmReserva.nombre,
        mascota:  confirmReserva.mascota_nombre,
        servicio: service?.nombre || confirmReserva.servicio_nombre,
        fecha:    form.fecha,
        hora:     form.hora,
        sucursal: getBranchName(form.branch_id),
      }
      backend.emailCitaConfirmada(emailData).catch(() => {
        sendCitaConfirmada({
          clientEmail: emailData.email,   clientName:  emailData.nombre,
          petName:     emailData.mascota, serviceName: emailData.servicio,
          fecha:       emailData.fecha,   hora:        emailData.hora,
          branchName:  emailData.sucursal,
        })
      })
    }

    setConfirmModal(false)
    setConfirmReserva(null)
    show('Reserva confirmada y cita creada')
  }

  const clientesVisibles = filterRecords('clients', clientes)
  const mascotasVisibles = filterRecords('pets', mascotas)
  const serviciosVisibles = filterRecords('services', servicios)
  const visibleRecords = filterRecords('appointments', records)
  const loadError = error || clientsError || petsError || servicesError

  const clientName = (id) => clientes.find((client) => client.id === id)?.nombre || '-'
  const petName = (id) => mascotas.find((pet) => pet.id === id)?.nombre || '-'
  const serviceName = (id) => servicios.find((service) => service.id === id)?.nombre || '-'
  const servicePrice = (id) => Number(servicios.find((service) => service.id === id)?.precio || 0)
  const statusOf = (appointmentId) => getAppointmentStatus(appointmentId)

  const filtered = visibleRecords.filter((appointment) => (
    (
      clientName(appointment.cliente_id).toLowerCase().includes(search.toLowerCase()) ||
      petName(appointment.mascota_id).toLowerCase().includes(search.toLowerCase()) ||
      STATUS_LABELS[statusOf(appointment.id)].toLowerCase().includes(search.toLowerCase())
    ) &&
    (statusFilter === 'todas' || statusOf(appointment.id) === statusFilter)
  ))
  const counts = STATUS_OPTIONS.reduce((acc, option) => {
    acc[option.value] = visibleRecords.filter((appointment) => statusOf(appointment.id) === option.value).length
    return acc
  }, {})

  const notifyAppointment = (payload) => {
    if (!preferences.emailNotifications && !preferences.reminderNotifications) return

    const client = clientes.find((item) => String(item.id) === String(payload.cliente_id))
    const pet = mascotas.find((item) => String(item.id) === String(payload.mascota_id))
    const service = servicios.find((item) => String(item.id) === String(payload.servicio_id))
    const statusLabel = STATUS_LABELS[payload.status] || 'Pendiente'

    createNotification({
      type: 'cita',
      title: payload.title || `Cita ${statusLabel.toLowerCase()}`,
      message: `${client?.nombre || 'Cliente'} fue notificado: cita ${statusLabel.toLowerCase()} para ${pet?.nombre || 'su mascota'} el ${payload.fecha} a las ${payload.hora} por ${service?.nombre || 'el servicio seleccionado'}.`,
      recipient: client?.email || client?.telefono || client?.nombre || 'Cliente sin contacto',
      clientId: client?.id,
      clientName: client?.nombre || '',
      branchId: payload.branch_id,
      channel: preferences.emailNotifications ? 'email' : 'interna',
    })
  }

  const handleGenerateOnlinePayment = async (appointment) => {
    const client = clientes.find((item) => String(item.id) === String(appointment.cliente_id))
    const pet = mascotas.find((item) => String(item.id) === String(appointment.mascota_id))
    const service = servicios.find((item) => String(item.id) === String(appointment.servicio_id))
    const amount = servicePrice(appointment.servicio_id)
    const existingLink = getOnlinePaymentByAppointmentId(appointment.id)

    if (existingLink && existingLink.status !== 'pagado') {
      setActiveTab('citas')
      show(`La cita ya tiene un cobro online activo: ${existingLink.paymentReference}`)
      return
    }

    if (!amount) {
      show('El servicio de esta cita no tiene precio configurado', false)
      return
    }

    const customUrlInput = window.prompt(
      'Pega aquí el Payment Link que quieres enviar al cliente. Si lo dejas vacío, CaniVet intentará generar el cobro automáticamente.',
      '',
    )
    if (customUrlInput === null) return
    const customUrl = customUrlInput.trim()

    let onlinePayment
    try {
      onlinePayment = await createOnlinePayment({
        appointmentId: appointment.id,
        clientId: appointment.cliente_id,
        clientName: client?.nombre || 'Cliente',
        clientContact: client?.email || client?.telefono || '',
        petName: pet?.nombre || '',
        serviceName: service?.nombre || 'Servicio veterinario',
        amount,
        branchId: getRecordBranchId('appointments', appointment.id),
        branchName: getBranchName(getRecordBranchId('appointments', appointment.id)),
        notes: `Cobro online generado desde la cita del ${appointment.fecha} a las ${appointment.hora}.`,
        source: customUrl ? 'payment_link' : 'appointment',
        status: 'enviado',
        paymentUrl: customUrl || undefined,
      })
    } catch (error) {
      show(`No se pudo generar el cobro online: ${error.message}`, false)
      return
    }

    if (customUrl) {
      try {
        onlinePayment = await updateOnlinePayment(onlinePayment.id, {
          paymentUrl: customUrl,
          source: 'stripe_payment_link',
          lastEvent: 'payment_link_configurado_desde_cita',
        })
      } catch (error) {
        show(`No se pudo guardar el Payment Link: ${error.message}`, false)
        return
      }
    } else {
      const token = getToken()
      if (token) {
        try {
          const stripeRes = await backend.createStripeCheckout(token, {
            amount: Math.round(Number(amount) * 100),
            currency: preferences.moneda?.toLowerCase() || 'dop',
            description: `${service?.nombre || 'Servicio veterinario'} — ${client?.nombre || 'Cliente'}`,
            customer_email: client?.email || null,
            online_payment_id: onlinePayment.id,
            appointment_id: appointment.id,
          })
          onlinePayment = await updateOnlinePayment(onlinePayment.id, {
            stripeSessionId: stripeRes.session_id,
            paymentUrl: stripeRes.url,
            source: 'stripe_checkout',
            lastEvent: 'checkout_creado_desde_cita',
          })
        } catch {
          onlinePayment = await updateOnlinePayment(onlinePayment.id, {
            source: 'simulado',
            lastEvent: 'checkout_simulado_desde_cita',
          })
        }
      } else {
        onlinePayment = await updateOnlinePayment(onlinePayment.id, {
          source: 'simulado',
          lastEvent: 'checkout_simulado_sin_token_desde_cita',
        })
      }
    }

    const payUrl = onlinePayment?.paymentUrl || ''
    if (client?.email && payUrl && !payUrl.includes('stripe.local')) {
      backend.emailLinkPago({
        email: client.email,
        nombre: client.nombre,
        monto: amount,
        concepto: service?.nombre || 'Servicio veterinario',
        link: payUrl,
        referencia: onlinePayment.paymentReference || '',
      }).catch(() => {})
    }

    createNotification({
      type: 'pago_online',
      title: 'Cobro online generado',
      message: `${client?.nombre || 'Cliente'} recibio el enlace ${onlinePayment.paymentReference} por ${fmtMoney(amount)} para ${service?.nombre || 'el servicio agendado'}.${client?.email && payUrl && !payUrl.includes('stripe.local') ? ' El link fue enviado por correo.' : ' Revisa el modulo de Pagos para finalizar o compartir el enlace.'}`,
      recipient: client?.email || client?.telefono || client?.nombre || 'Cliente sin contacto',
      clientId: client?.id,
      clientName: client?.nombre || '',
      branchId: getRecordBranchId('appointments', appointment.id),
      channel: preferences.emailNotifications ? 'email' : 'interna',
    })

    show(client?.email && payUrl && !payUrl.includes('stripe.local')
      ? `Cobro online enviado a ${client.email}`
      : `Cobro online generado: ${onlinePayment.paymentReference}`)
  }

  const openCreate = () => {
    setForm({ ...EMPTY, branch_id: preferredBranchId, status: 'pendiente' })
    setEditing(null)
    setErrors({})
    setModal(true)
  }

  const openEdit = (appointment) => {
    setForm({
      fecha: appointment.fecha,
      hora: appointment.hora,
      cliente_id: appointment.cliente_id,
      mascota_id: appointment.mascota_id,
      servicio_id: appointment.servicio_id,
      notas: appointment.notas || '',
      branch_id: getRecordBranchId('appointments', appointment.id),
      status: statusOf(appointment.id),
    })
    setEditing(appointment.id)
    setErrors({})
    setModal(true)
  }

  const handleSave = async () => {
    const nextErrors = validateAppointmentForm(form)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const payload = {
      fecha: form.fecha,
      hora: form.hora,
      cliente_id: form.cliente_id,
      mascota_id: form.mascota_id,
      servicio_id: form.servicio_id,
      notas: form.notas,
    }

    const { data, error: saveError } = editing
      ? await update(editing, payload)
      : await create(payload)

    if (saveError) {
      show(`Error: ${saveError.message}`, false)
      return
    }

    const appointmentId = editing || data?.[0]?.id
    assignRecordBranch('appointments', appointmentId, form.branch_id)
    setAppointmentStatus(appointmentId, form.status)
    notifyAppointment({
      ...form,
      title: editing ? 'Cita actualizada' : 'Cita creada',
    })
    show(editing ? 'Cita actualizada' : 'Cita agendada')
    setModal(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar esta cita?')) return
    const { error: removeError } = await remove(id)
    removeError ? show('Error al eliminar', false) : show('Cita eliminada')
  }

  const handleQuickStatusChange = (appointment, nextStatus) => {
    setAppointmentStatus(appointment.id, nextStatus)
    notifyAppointment({
      fecha: appointment.fecha,
      hora: appointment.hora,
      cliente_id: appointment.cliente_id,
      mascota_id: appointment.mascota_id,
      servicio_id: appointment.servicio_id,
      branch_id: getRecordBranchId('appointments', appointment.id),
      status: nextStatus,
      title: `Estado de cita: ${STATUS_LABELS[nextStatus]}`,
    })
    show(`Estado cambiado a ${STATUS_LABELS[nextStatus]}`)
  }

  const mascotasFiltradas = mascotasVisibles.filter((pet) => !form.cliente_id || String(pet.cliente_id) === String(form.cliente_id))

  // ── Recordatorios de cita ────────────────────────────────────────────────
  const [sendingReminders, setSendingReminders] = useState(false)

  const handleSendReminders = async () => {
    const tomorrow = (() => {
      const d = new Date(); d.setDate(d.getDate() + 1)
      return d.toISOString().slice(0, 10)
    })()

    const tomorrowAppts = records.filter(a => a.fecha === tomorrow)
    if (!tomorrowAppts.length) { show('No hay citas para mañana', false); return }

    const appsWithEmail = tomorrowAppts.filter(a => {
      const client = clientes.find(c => String(c.id) === String(a.cliente_id))
      return client?.email
    })

    if (!appsWithEmail.length) {
      show(`Hay ${tomorrowAppts.length} cita${tomorrowAppts.length !== 1 ? 's' : ''} mañana, pero ningún cliente tiene email registrado`, false)
      return
    }

    setSendingReminders(true)
    let sent = 0; let failed = 0

    for (const appt of appsWithEmail) {
      const client  = clientes.find(c => String(c.id) === String(appt.cliente_id))
      const pet     = mascotas.find(p => String(p.id) === String(appt.mascota_id))
      const service = servicios.find(s => String(s.id) === String(appt.servicio_id))
      try {
        await backend.emailRecordatorioCita({
          email:    client.email,
          nombre:   client.nombre,
          mascota:  pet?.nombre || 'su mascota',
          servicio: service?.nombre || 'la cita',
          fecha:    appt.fecha,
          hora:     appt.hora || '',
          sucursal: getBranchName(getRecordBranchId('appointments', appt.id)),
        })
        sent++
      } catch { failed++ }
    }

    setSendingReminders(false)
    show(
      `${sent} recordatorio${sent !== 1 ? 's' : ''} enviado${sent !== 1 ? 's' : ''}` +
      (failed > 0 ? ` · ${failed} fallaron` : '') +
      ` (${tomorrowAppts.length - appsWithEmail.length} sin email)`,
      failed === 0
    )
  }

  const compressImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 800
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX }
          else { width = Math.round(width * MAX / height); height = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const openPhotoModal = (appointment) => {
    if (!PHOTO_ALLOWED_STATUSES.has(statusOf(appointment.id))) {
      show('Las fotos del servicio se habilitan cuando la cita está en proceso o completada', false)
      return
    }
    setPhotoAppt(appointment)
    setPhotoCaption('')
    setPhotoType('antes')
    setPhotoModal(true)
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !photoAppt) return
    if (!file.type.startsWith('image/')) { show('Solo se permiten imagenes', false); return }
    try {
      const dataUrl = await compressImage(file)
      await saveServicePhoto(photoAppt.id, { type: photoType, dataUrl, caption: photoCaption })
      setPhotoCaption('')
      e.target.value = ''
      show('Foto guardada')
    } catch (error) {
      show(error?.message ? `Error guardando la foto: ${error.message}` : 'Error al procesar la imagen', false)
    }
  }

  const handleRemovePhoto = async (photoId) => {
    if (!photoAppt || !window.confirm('Eliminar esta foto?')) return
    try {
      await removeServicePhoto(photoAppt.id, photoId)
      show('Foto eliminada')
    } catch (error) {
      show(`Error eliminando foto: ${error.message}`, false)
    }
  }

  return (
    <>
      <Toast toast={toast} />
      <div className="page-header">
        <div>
          <h1>Citas</h1>
          <p>{visibleRecords.length} citas registradas{pendingReservas > 0 ? ` · ${pendingReservas} reserva${pendingReservas !== 1 ? 's' : ''} online pendiente${pendingReservas !== 1 ? 's' : ''}` : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 4, gap: 4 }}>
            <button
              onClick={() => setActiveTab('citas')}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, background: activeTab === 'citas' ? '#fff' : 'none', color: activeTab === 'citas' ? '#0f172a' : '#64748b', boxShadow: activeTab === 'citas' ? '0 1px 3px rgba(0,0,0,.08)' : 'none' }}
            >Citas</button>
            <button
              onClick={() => setActiveTab('reservas')}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, background: activeTab === 'reservas' ? '#fff' : 'none', color: activeTab === 'reservas' ? '#0f172a' : '#64748b', boxShadow: activeTab === 'reservas' ? '0 1px 3px rgba(0,0,0,.08)' : 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              Reservas online
              {pendingReservas > 0 && <span style={{ background: '#dc2626', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{pendingReservas}</span>}
            </button>
          </div>
          {activeTab === 'citas' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn-edit"
                style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 700 }}
                onClick={handleSendReminders}
                disabled={sendingReminders}
                title="Enviar recordatorio por email a todos los clientes con cita mañana"
              >
                {sendingReminders ? 'Enviando...' : '📧 Recordatorios mañana'}
              </button>
              <button className="btn-primary" onClick={openCreate}>+ Nueva cita</button>
            </div>
          )}
        </div>
      </div>
      <ErrorBanner
        message={loadError ? `No se pudieron cargar las citas: ${loadError.message}` : ''}
        onRetry={() => { load(); loadClients(); loadPets(); loadServices() }}
      />

      {/* ── Tab: Reservas online ───────────────────────────── */}
      {activeTab === 'reservas' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <strong style={{ fontSize: 15 }}>Reservas recibidas desde la web</strong>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Confirma para crear la cita formal, o rechaza si no aplica.</p>
            </div>
            <button className="btn-sm" onClick={refreshReservas}>Actualizar</button>
          </div>
          {reservasLoading ? (
            <p className="empty-state">Cargando reservas...</p>
          ) : reservas.length === 0 ? (
            <p className="empty-state">No hay reservas online aún</p>
          ) : (
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Solicitante</th>
                    <th>Mascota</th>
                    <th>Servicio</th>
                    <th>Fecha / Hora</th>
                    <th>Contacto</th>
                    <th>Notas</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.nombre}</strong><div style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(r.created_at).toLocaleDateString('es-DO')}</div></td>
                      <td>{r.mascota_nombre || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                      <td><span className="tag tag-blue">{r.servicio_nombre || '—'}</span></td>
                      <td>{r.fecha || '—'}{r.hora ? ` ${r.hora}` : ''}</td>
                      <td style={{ fontSize: 12 }}>{r.email && <div>{r.email}</div>}{r.telefono && <div>{r.telefono}</div>}</td>
                      <td style={{ fontSize: 12, color: '#64748b', maxWidth: 160 }}>{r.notas || '—'}</td>
                      <td>
                        <span className={`tag ${r.estado === 'pendiente' ? 'tag-amber' : r.estado === 'confirmada' ? 'tag-green' : 'tag-red'}`}>
                          {r.estado}
                        </span>
                      </td>
                      <td>
                        <div className="act-btns">
                          {r.estado === 'pendiente' && (
                            <>
                              <button className="btn-edit" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }} onClick={() => openConfirmModal(r)}>
                                Confirmar
                              </button>
                              <button className="btn-del" onClick={() => handleRejectReserva(r)}>Rechazar</button>
                            </>
                          )}
                          {r.estado !== 'pendiente' && <span style={{ fontSize: 12, color: '#94a3b8' }}>Procesada</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Citas ─────────────────────────────────────── */}
      {activeTab === 'citas' && <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 18 }}>
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`card ${statusFilter === option.value ? 'active-status-card' : ''}`}
            style={{
              padding: 16,
              textAlign: 'left',
              borderColor: statusFilter === option.value ? '#3b82f6' : 'var(--border)',
              background: statusFilter === option.value ? '#eff6ff' : '#fff',
            }}
            onClick={() => setStatusFilter((current) => current === option.value ? 'todas' : option.value)}
          >
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{counts[option.value] || 0}</div>
            <div className={`tag ${option.tag}`}>{option.label}</div>
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 12 }}>
        <div className="form-row">
          <input className="form-input" placeholder="Buscar por cliente, mascota o estado..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="todas">Todos los estados</option>
            {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Fecha</th><th>Hora</th><th>Cliente</th><th>Mascota</th><th>Servicio</th><th>Estado</th><th>Cobro online</th><th>Sucursal</th><th>Acciones</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={9} className="empty-state">Cargando...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={9} className="empty-state">Sin citas</td></tr>
                : filtered.map((appointment) => {
                  const onlinePayment = getOnlinePaymentByAppointmentId(appointment.id)
                  const canManagePhotos = PHOTO_ALLOWED_STATUSES.has(statusOf(appointment.id))
                  return (
                    <tr key={appointment.id}>
                      <td>{appointment.fecha}</td>
                      <td><strong style={{ color: '#3b82f6' }}>{appointment.hora}</strong></td>
                      <td>{clientName(appointment.cliente_id)}</td>
                      <td>{petName(appointment.mascota_id)}</td>
                      <td><span className="tag tag-blue">{serviceName(appointment.servicio_id)}</span></td>
                      <td>
                        <select className="form-select" style={{ minWidth: 132 }} value={statusOf(appointment.id)} onChange={(e) => handleQuickStatusChange(appointment, e.target.value)}>
                          {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </td>
                      <td>
                        {onlinePayment ? (
                          <div>
                            <span className={`tag ${onlinePayment.status === 'pagado' ? 'tag-green' : onlinePayment.status === 'enviado' ? 'tag-blue' : 'tag-amber'}`}>
                              {ONLINE_STATUS_LABELS[onlinePayment.status] || onlinePayment.status}
                            </span>
                            <div style={{ marginTop: 6 }}>
                              <button className="btn-edit" onClick={() => handleGenerateOnlinePayment(appointment)}>
                                {onlinePayment.status === 'pagado' ? 'Regenerar' : 'Revisar'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button className="btn-edit" onClick={() => handleGenerateOnlinePayment(appointment)}>Cobro online</button>
                        )}
                      </td>
                      <td><span className="tag tag-purple">{getBranchName(getRecordBranchId('appointments', appointment.id))}</span></td>
                      <td><div className="act-btns">
                        <button className="btn-edit" onClick={() => openEdit(appointment)}>Editar</button>
                        <button className="btn-edit" onClick={() => openPhotoModal(appointment)} title={canManagePhotos ? 'Fotos antes/despues' : 'Disponible cuando la cita este en proceso o completada'} disabled={!canManagePhotos} style={!canManagePhotos ? { opacity: 0.55, cursor: 'not-allowed' } : {}}>
                          {'📸'} {getServicePhotos(appointment.id).length > 0 ? `(${getServicePhotos(appointment.id).length})` : ''}
                        </button>
                        <button className="btn-del" onClick={() => handleDelete(appointment.id)}>Eliminar</button>
                      </div></td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} hasPrev={hasPrev} hasMore={hasMore} onPrev={prevPage} onNext={nextPage} />
      </>}

      {modal && (
        <Modal title={editing ? 'Editar cita' : 'Nueva cita'} onClose={() => setModal(false)} onSave={handleSave} saveLabel={editing ? 'Guardar cambios' : 'Agendar cita'}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input className="form-input" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
              {errors.fecha && <p className="form-error">{errors.fecha}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Hora *</label>
              <input className="form-input" type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} />
              {errors.hora && <p className="form-error">{errors.hora}</p>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cliente *</label>
            <select className="form-select" value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value, mascota_id: '' })}>
              <option value="">Seleccionar cliente...</option>
              {clientesVisibles.map((client) => <option key={client.id} value={client.id}>{client.nombre}</option>)}
            </select>
            {errors.cliente_id && <p className="form-error">{errors.cliente_id}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Mascota *</label>
            <select className="form-select" value={form.mascota_id} onChange={(e) => setForm({ ...form, mascota_id: e.target.value })}>
              <option value="">Seleccionar mascota...</option>
              {mascotasFiltradas.map((pet) => <option key={pet.id} value={pet.id}>{pet.nombre}</option>)}
            </select>
            {errors.mascota_id && <p className="form-error">{errors.mascota_id}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Servicio *</label>
            <select className="form-select" value={form.servicio_id} onChange={(e) => setForm({ ...form, servicio_id: e.target.value })}>
              <option value="">Seleccionar servicio...</option>
              {serviciosVisibles.map((service) => <option key={service.id} value={service.id}>{service.nombre} - {fmtMoney(service.precio)}</option>)}
            </select>
            {errors.servicio_id && <p className="form-error">{errors.servicio_id}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Notas</label>
            <textarea className="form-input" rows={2} value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} placeholder="Observaciones opcionales..." />
          </div>
          <div className="form-group">
            <label className="form-label">Estado de la cita *</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sucursal *</label>
            <select className="form-select" value={form.branch_id} onChange={(e) => setForm({ ...form, branch_id: e.target.value })}>
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} - {branch.city}</option>)}
            </select>
          </div>
        </Modal>
      )}
      {confirmModal && confirmReserva && (
        <Modal title={`Confirmar reserva — ${confirmReserva.nombre}`} onClose={() => { setConfirmModal(false); setConfirmReserva(null) }} onSave={handleConfirmReserva} saveLabel="Crear cita">
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#15803d' }}>
            Selecciona el cliente y mascota existentes (o créalos primero). Los demás campos vienen pre-llenados de la reserva.
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input className="form-input" type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} />
              {errors.fecha && <p className="form-error">{errors.fecha}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Hora *</label>
              <input className="form-input" type="time" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
              {errors.hora && <p className="form-error">{errors.hora}</p>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cliente * <span style={{ fontWeight: 400, color: '#94a3b8' }}>(reservó: {confirmReserva.nombre})</span></label>
            <select className="form-select" value={form.cliente_id} onChange={e => setForm({ ...form, cliente_id: e.target.value, mascota_id: '' })}>
              <option value="">Seleccionar cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            {errors.cliente_id && <p className="form-error">{errors.cliente_id}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Mascota * <span style={{ fontWeight: 400, color: '#94a3b8' }}>(indicó: {confirmReserva.mascota_nombre || '—'})</span></label>
            <select className="form-select" value={form.mascota_id} onChange={e => setForm({ ...form, mascota_id: e.target.value })}>
              <option value="">Seleccionar mascota...</option>
              {mascotas.filter(m => !form.cliente_id || String(m.cliente_id) === String(form.cliente_id)).map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            {errors.mascota_id && <p className="form-error">{errors.mascota_id}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Servicio *</label>
            <select className="form-select" value={form.servicio_id} onChange={e => setForm({ ...form, servicio_id: e.target.value })}>
              <option value="">Seleccionar servicio...</option>
              {servicios.map(s => <option key={s.id} value={s.id}>{s.nombre} — {fmtMoney(s.precio)}</option>)}
            </select>
            {errors.servicio_id && <p className="form-error">{errors.servicio_id}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Notas</label>
            <textarea className="form-input" rows={3} value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} />
          </div>
        </Modal>
      )}

      {photoModal && photoAppt && (() => {
        const photos = getServicePhotos(photoAppt.id)
        const antes = photos.filter(p => p.type === 'antes')
        const despues = photos.filter(p => p.type === 'despues')
        return (
          <Modal title={`Fotos — ${petName(photoAppt.mascota_id)}`} onClose={() => setPhotoModal(false)} hideDefaultFooter>
            {/* Área de subida */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>
                La foto se guarda automáticamente al seleccionarla.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <select className="form-select" style={{ width: 130 }} value={photoType} onChange={e => setPhotoType(e.target.value)}>
                  <option value="antes">📷 Antes</option>
                  <option value="despues">✨ Después</option>
                </select>
                <input className="form-input" placeholder="Descripción (opcional)" value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} style={{ flex: 1 }} />
                <label style={{ background: '#1d4ed8', color: '#fff', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  📂 Seleccionar foto
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>
            {photos.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>Sin fotos registradas aún</p>}
            {antes.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>ANTES ({antes.length})</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {antes.map(p => (
                    <div key={p.id} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={p.dataUrl} alt={p.caption || 'Antes'} style={{ width: 140, height: 110, objectFit: 'cover', display: 'block' }} />
                      {p.caption && <div style={{ fontSize: 11, padding: '4px 8px', background: 'rgba(0,0,0,.5)', color: '#fff', position: 'absolute', bottom: 0, width: '100%' }}>{p.caption}</div>}
                      <button onClick={() => handleRemovePhoto(p.id)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(220,38,38,.85)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {despues.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>DESPUES ({despues.length})</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {despues.map(p => (
                    <div key={p.id} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={p.dataUrl} alt={p.caption || 'Despues'} style={{ width: 140, height: 110, objectFit: 'cover', display: 'block' }} />
                      {p.caption && <div style={{ fontSize: 11, padding: '4px 8px', background: 'rgba(0,0,0,.5)', color: '#fff', position: 'absolute', bottom: 0, width: '100%' }}>{p.caption}</div>}
                      <button onClick={() => handleRemovePhoto(p.id)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(220,38,38,.85)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{photos.length} foto{photos.length !== 1 ? 's' : ''} guardada{photos.length !== 1 ? 's' : ''}</span>
              <button className="btn-primary" onClick={() => setPhotoModal(false)}>Listo</button>
            </div>
          </Modal>
        )
      })()}
    </>
  )
}
