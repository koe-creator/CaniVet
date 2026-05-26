import { useMemo, useState } from 'react'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { useAppConfig } from '../../context/AppConfigContext'
import { fmtDate, fmtMoney } from '../../utils/formatters'
import { validatePaymentForm } from '../../utils/validators'
import { backend } from '../../services/backend'

const today = () => new Date().toISOString().slice(0, 10)

const EMPTY = {
  cliente_id: '',
  monto: '',
  fecha: '',
  metodo: 'efectivo',
  branch_id: '',
  concept: 'Consulta general',
  notes: '',
}

const ONLINE_EMPTY = {
  appointment_id: '',
  cliente_id: '',
  pet_name: '',
  service_name: '',
  amount: '',
  branch_id: '',
  date: today(),
  notes: '',
  source: 'manual',
}

const METODOS = ['efectivo', 'tarjeta', 'transferencia', 'stripe']
const METODO_TAG = {
  efectivo: 'tag-green',
  tarjeta: 'tag-blue',
  transferencia: 'tag-amber',
  stripe: 'tag-purple',
}

const ONLINE_STATUS = {
  enviado: 'tag-blue',
  pagado: 'tag-green',
  fallido: 'tag-red',
  vencido: 'tag-amber',
  cancelado: 'tag-red',
}

const getOnlineMode = (payment) => {
  if (!payment) return 'manual'
  if (payment.source === 'stripe_checkout') return 'stripe_checkout'
  if (payment.source === 'stripe_payment_link') return 'stripe_payment_link'
  if (payment.source === 'simulado') return 'simulado'
  if (payment.paymentUrl?.includes('/stripe-demo')) return 'simulado'
  if (payment.paymentUrl?.includes('buy.stripe.com')) return 'stripe_payment_link'
  if (payment.paymentUrl?.includes('checkout.stripe.com')) return 'stripe_checkout'
  if (payment.paymentUrl?.includes('stripe.local')) return 'simulado'
  return payment.source || 'manual'
}

const ONLINE_MODE_LABELS = {
  stripe_checkout: 'Checkout Stripe',
  stripe_payment_link: 'Payment Link',
  simulado: 'Simulado',
  appointment: 'Desde cita',
  manual: 'Manual',
}

const css = `
.pay-switch { display:flex; gap:10px; margin-bottom:18px; }
.pay-switch button { border:1px solid #dbe3ef; background:#fff; border-radius:10px; padding:10px 14px; font-size:13px; font-weight:700; color:#475569; }
.pay-switch button.active { background:#eff6ff; color:#1d4ed8; border-color:#93c5fd; }
.pay-kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
@media(max-width:1000px){.pay-kpi-grid{grid-template-columns:repeat(2,1fr)}}
.pay-kpi { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; }
.pay-kpi strong { display:block; font-size:22px; margin-bottom:4px; }
.pay-kpi span { color:#64748b; font-size:12px; }
.online-callout { background:linear-gradient(135deg,#0f172a,#1d4ed8); color:#fff; border-radius:14px; padding:18px; margin-bottom:18px; }
.online-callout p { color:rgba(255,255,255,.75); margin-top:6px; font-size:13px; }
.inline-note { font-size:12px; color:#64748b; margin-top:6px; }
.sim-grid { display:grid; gap:12px; }
.sim-card { border:1px solid #e2e8f0; border-radius:12px; padding:14px; background:#f8fafc; }
.sim-card strong { display:block; margin-bottom:6px; }
.sim-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
.sim-link { word-break:break-all; color:#1d4ed8; font-size:12px; }
.sim-footer { display:flex; justify-content:space-between; gap:10px; padding:14px 22px; border-top:1px solid #e2e8f0; }
.sim-footer .left, .sim-footer .right { display:flex; gap:8px; flex-wrap:wrap; }
`

export const PagosPage = () => {
  const { records, loading, error, load, create, update, remove } = useSupabaseCRUD('pagos', 'created_at')
  const { records: clientes, error: clientsError, load: loadClients } = useSupabaseCRUD('clientes', 'nombre')
  const {
    branches,
    preferredBranchId,
    preferences,
    filterRecords,
    assignRecordBranch,
    getRecordBranchId,
    getBranchName,
    getInvoiceByPaymentId,
    upsertInvoice,
    removeInvoice,
    onlinePayments,
    getOnlinePaymentById,
    createOnlinePayment,
    updateOnlinePayment,
    removeOnlinePayment,
    createNotification,
  } = useAppConfig()

  const { toast, show } = useToast()
  const [activeView, setActiveView] = useState('manual')
  const [modal, setModal] = useState(false)
  const [onlineModal, setOnlineModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [onlineForm, setOnlineForm] = useState(ONLINE_EMPTY)
  const [editing, setEditing] = useState(null)
  const [errors, setErrors] = useState({})
  const [onlineErrors, setOnlineErrors] = useState({})
  const [invoicePreview, setInvoicePreview] = useState(null)
  const [onlinePreview, setOnlinePreview] = useState(null)

  const normalizedRecords = useMemo(() => (
    records.map((payment) => ({
      ...payment,
      fecha: getInvoiceByPaymentId(payment.id)?.date || payment.fecha || payment.created_at?.slice(0, 10) || '',
    }))
  ), [getInvoiceByPaymentId, records])

  const clientesVisibles = filterRecords('clients', clientes)
  const visibleRecords = filterRecords('payments', normalizedRecords)
  const clientName = (id) => clientes.find((client) => client.id === id)?.nombre || '-'
  const totalIngresos = visibleRecords.reduce((sum, payment) => sum + Number(payment.monto || 0), 0)
  const loadError = error || clientsError

  const onlineStats = useMemo(() => {
    const paid = onlinePayments.filter((item) => item.status === 'pagado')
    const pending = onlinePayments.filter((item) => item.status === 'enviado')
    const failed = onlinePayments.filter((item) => item.status === 'fallido')

    return {
      total: onlinePayments.length,
      paidRevenue: paid.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      pendingCount: pending.length,
      failedCount: failed.length,
    }
  }, [onlinePayments])

  const buildInvoice = async (paymentId, paymentPayload) => {
    const client = clientes.find((item) => String(item.id) === String(paymentPayload.cliente_id))
    return await upsertInvoice({
      paymentId,
      clientId: client?.id,
      clientName: client?.nombre || 'Cliente',
      clientContact: client?.email || '',
      branchId: paymentPayload.branch_id,
      branchName: getBranchName(paymentPayload.branch_id),
      date: paymentPayload.fecha,
      method: paymentPayload.metodo,
      subtotal: Number(paymentPayload.monto),
      tax: 0,
      total: Number(paymentPayload.monto),
      concept: paymentPayload.concept,
      notes: paymentPayload.notes,
      items: [{
        description: paymentPayload.concept || 'Servicio veterinario',
        quantity: 1,
        unitPrice: Number(paymentPayload.monto),
        total: Number(paymentPayload.monto),
      }],
    })
  }

  const openCreate = () => {
    setForm({ ...EMPTY, branch_id: preferredBranchId, fecha: today() })
    setEditing(null)
    setErrors({})
    setModal(true)
  }

  const openEdit = (payment) => {
    const invoice = getInvoiceByPaymentId(payment.id)
    setForm({
      cliente_id: payment.cliente_id,
      monto: payment.monto,
      fecha: payment.fecha,
      metodo: payment.metodo,
      branch_id: getRecordBranchId('payments', payment.id),
      concept: invoice?.concept || 'Servicio veterinario',
      notes: invoice?.notes || '',
    })
    setEditing(payment.id)
    setErrors({})
    setModal(true)
  }

  const openInvoicePreview = (paymentId) => {
    const invoice = getInvoiceByPaymentId(paymentId)
    if (!invoice) {
      show('Este pago aun no tiene comprobante generado', false)
      return
    }
    setInvoicePreview(invoice)
  }

  const openOnlineCreate = (prefill = {}) => {
    setOnlineForm({
      ...ONLINE_EMPTY,
      branch_id: prefill.branch_id || preferredBranchId,
      appointment_id: prefill.appointment_id || '',
      cliente_id: prefill.cliente_id || '',
      pet_name: prefill.pet_name || '',
      service_name: prefill.service_name || '',
      amount: prefill.amount || '',
      notes: prefill.notes || '',
      source: prefill.source || 'manual',
      date: prefill.date || today(),
    })
    setOnlineErrors({})
    setOnlineModal(true)
  }

  const openOnlinePreview = (onlinePaymentId) => {
    const payment = getOnlinePaymentById(onlinePaymentId)
    if (!payment) {
      show('No se encontro el link de pago seleccionado', false)
      return
    }
    setOnlinePreview(payment)
  }

  const handleSave = async () => {
    const nextErrors = validatePaymentForm(form)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const payload = { ...form, monto: parseFloat(form.monto) }
    const savePayload = {
      cliente_id: payload.cliente_id,
      monto: payload.monto,
      metodo: payload.metodo,
    }

    const { data, error: saveError } = editing
      ? await update(editing, savePayload)
      : await create(savePayload)

    if (saveError) {
      show(`Error: ${saveError.message}`, false)
      return
    }

    const paymentId = editing || data?.[0]?.id
    const client = clientes.find((item) => String(item.id) === String(form.cliente_id))
    assignRecordBranch('payments', paymentId, form.branch_id)
    let invoice
    try {
      invoice = await buildInvoice(paymentId, payload)
    } catch (error) {
      show(`Error generando comprobante: ${error.message}`, false)
      return
    }

    if (preferences.paymentReceiptNotifications || preferences.emailNotifications) {
      createNotification({
        type: 'pago',
        title: editing ? 'Pago actualizado' : 'Recibo de pago emitido',
        message: `${client?.nombre || 'Cliente'} recibio el comprobante ${invoice?.number || ''} por ${fmtMoney(form.monto)} via ${form.metodo}.`,
        recipient: client?.email || client?.nombre || 'Cliente sin contacto',
        clientId: client?.id,
        clientName: client?.nombre || '',
        branchId: form.branch_id,
      })
    }

    // Email de recibo al cliente (solo pagos nuevos con email)
    if (!editing && client?.email) {
      backend.emailReciboPago({
        email:    client.email,
        nombre:   client.nombre,
        monto:    form.monto,
        metodo:   form.metodo,
        concepto: form.concept || 'Servicio veterinario',
        factura:  invoice?.number || '',
        fecha:    form.fecha,
      }).catch(() => { /* silencioso si backend no disponible */ })
    }

    show(editing ? 'Pago actualizado' : 'Pago registrado')
    setModal(false)
    setInvoicePreview(invoice)
  }

  const handleSaveOnline = async () => {
    const nextErrors = {}
    if (!onlineForm.cliente_id) nextErrors.cliente_id = 'Selecciona un cliente'
    if (!onlineForm.amount || Number(onlineForm.amount) <= 0) nextErrors.amount = 'Monto invalido'
    if (!onlineForm.service_name.trim()) nextErrors.service_name = 'Indica el servicio o concepto'
    if (!onlineForm.branch_id) nextErrors.branch_id = 'Selecciona la sucursal'
    if (Object.keys(nextErrors).length) { setOnlineErrors(nextErrors); return }

    const client = clientes.find((item) => String(item.id) === String(onlineForm.cliente_id))

    let localEntry
    try {
      localEntry = await createOnlinePayment({
        appointmentId: onlineForm.appointment_id || null,
        clientId: onlineForm.cliente_id,
        clientName: client?.nombre || 'Cliente',
        clientContact: client?.email || '',
        petName: onlineForm.pet_name,
        serviceName: onlineForm.service_name,
        amount: Number(onlineForm.amount),
        branchId: onlineForm.branch_id,
        branchName: getBranchName(onlineForm.branch_id),
        notes: onlineForm.notes,
        source: 'simulado',
        status: 'enviado',
        lastEvent: 'checkout_simulado_generado',
      })
    } catch (error) {
      show(`No se pudo crear el link de pago: ${error.message}`, false)
      return
    }

    const finalLink = localEntry

    let emailSent = false

    // Enviar el link por email al cliente si tiene email
    const payUrl = finalLink?.paymentUrl || ''
    if (client?.email && payUrl) {
      try {
        await backend.emailLinkPago({
          email:      client.email,
          nombre:     client.nombre,
          monto:      onlineForm.amount,
          concepto:   onlineForm.service_name,
          link:       payUrl,
          referencia: finalLink?.paymentReference || '',
        })
        emailSent = true
      } catch (error) {
        show(`Se genero el link, pero el correo no se pudo enviar: ${error.message}`, false)
      }
    }

    createNotification({
      type: 'pago_online',
      title: 'Link de pago enviado',
      message: `${client?.nombre || 'Cliente'} ${emailSent ? 'recibio' : 'tiene disponible'} el enlace simulado ${finalLink?.paymentReference} por ${fmtMoney(Number(onlineForm.amount))} para ${onlineForm.service_name}.${client?.email ? (emailSent ? ' El link fue enviado por correo.' : ' El envio por correo fallo; comparte el enlace manualmente.') : ' El cliente no tiene email registrado.'}`,
      recipient: client?.email || client?.nombre || 'Sin contacto',
      clientId: client?.id,
      clientName: client?.nombre || '',
      branchId: onlineForm.branch_id,
      channel: preferences.emailNotifications ? 'email' : 'interna',
    })

    setOnlineModal(false)
    setOnlinePreview(finalLink)
    show(client?.email && emailSent
      ? `Link simulado enviado a ${client.email}`
      : client?.email
        ? `Link simulado generado, pero el correo fallo: ${finalLink.paymentReference}`
        : `Link simulado generado: ${finalLink.paymentReference}`)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar este pago?')) return
    const { error: removeError } = await remove(id)
    if (removeError) {
      show('Error al eliminar', false)
      return
    }
    try {
      await removeInvoice(id)
    } catch (error) {
      show(`Pago eliminado, pero no se pudo borrar la factura: ${error.message}`, false)
      return
    }
    show('Pago eliminado')
  }

  const handleDeleteOnline = async (id) => {
    if (!window.confirm('Eliminar este link de pago?')) return
    try {
      await removeOnlinePayment(id)
      if (onlinePreview?.id === id) {
        setOnlinePreview(null)
      }
      show('Link de pago eliminado')
    } catch (error) {
      show(`Error eliminando link de pago: ${error.message}`, false)
    }
  }

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      show('Enlace copiado al portapapeles')
    } catch {
      show('No se pudo copiar el enlace', false)
    }
  }

  const printInvoice = (invoice) => {
    const popup = window.open('', '_blank')
    if (!popup) return

    const rowsHtml = invoice.items.map((item) => `
      <tr>
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td>${fmtMoney(item.unitPrice)}</td>
        <td>${fmtMoney(item.total)}</td>
      </tr>
    `).join('')

    popup.document.write(`
      <html>
        <head>
          <title>${invoice.number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color:#0f172a; }
            h1 { margin: 0 0 8px; font-size: 20px; }
            .meta { margin-bottom: 18px; font-size: 13px; color:#475569; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background: #f8fafc; }
            .totals { margin-top: 18px; text-align: right; font-size: 14px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${invoice.number}</h1>
          <div class="meta">
            <div>Cliente: ${invoice.clientName}</div>
            <div>Contacto: ${invoice.clientContact || 'No registrado'}</div>
            <div>Sucursal: ${invoice.branchName}</div>
            <div>Fecha: ${invoice.date}</div>
            <div>Metodo: ${invoice.method}</div>
            <div>Concepto: ${invoice.concept}</div>
          </div>
          <table>
            <thead><tr><th>Descripcion</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <div class="totals">Total: ${fmtMoney(invoice.total)}</div>
          <p>${invoice.notes || ''}</p>
        </body>
      </html>
    `)
    popup.document.close()
    popup.focus()
    setTimeout(() => popup.print(), 250)
  }

  const downloadInvoice = (invoice) => {
    const html = `
      <html>
        <head><meta charset="utf-8"><title>${invoice.number}</title></head>
        <body>
          <h1>${invoice.number}</h1>
          <p>Cliente: ${invoice.clientName}</p>
          <p>Contacto: ${invoice.clientContact || 'No registrado'}</p>
          <p>Sucursal: ${invoice.branchName}</p>
          <p>Fecha: ${invoice.date}</p>
          <p>Metodo: ${invoice.method}</p>
          <p>Concepto: ${invoice.concept}</p>
          <p>Total: ${fmtMoney(invoice.total)}</p>
          <p>Notas: ${invoice.notes || '-'}</p>
        </body>
      </html>
    `
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${invoice.number}.html`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  const simulateOnlineOutcome = async (outcome) => {
    if (!onlinePreview) return

    if (outcome === 'pagado') {
      let paymentId = onlinePreview.paymentId

      if (!paymentId) {
        const savePayload = {
          cliente_id: onlinePreview.clientId,
          monto: Number(onlinePreview.amount),
          metodo: 'stripe',
        }

        const { data, error: saveError } = await create(savePayload)
        if (saveError) {
          show(`No se pudo convertir el pago online: ${saveError.message}`, false)
          return
        }

        paymentId = data?.[0]?.id
        assignRecordBranch('payments', paymentId, onlinePreview.branchId)
      }

      let invoice
      try {
        invoice = await buildInvoice(paymentId, {
          cliente_id: onlinePreview.clientId,
          monto: onlinePreview.amount,
          fecha: today(),
          metodo: 'stripe',
          concept: onlinePreview.serviceName,
          notes: `${onlinePreview.notes || ''} Ref. ${onlinePreview.paymentReference}`.trim(),
          branch_id: onlinePreview.branchId,
        })
      } catch (error) {
        show(`No se pudo generar la factura del pago online: ${error.message}`, false)
        return
      }

      let nextEntry
      try {
        nextEntry = await updateOnlinePayment(onlinePreview.id, {
          status: 'pagado',
          paidAt: new Date().toISOString(),
          paymentId,
          lastEvent: 'checkout_pagado',
        })
      } catch (error) {
        show(`No se pudo actualizar el pago online: ${error.message}`, false)
        return
      }

      createNotification({
        type: 'pago_online',
        title: 'Pago online confirmado',
        message: `${onlinePreview.clientName} completo el pago ${onlinePreview.paymentReference} por ${fmtMoney(onlinePreview.amount)} mediante ${ONLINE_MODE_LABELS[getOnlineMode(onlinePreview)] || 'cobro online'}.`,
        recipient: onlinePreview.clientContact || onlinePreview.clientName,
        clientId: onlinePreview.clientId,
        clientName: onlinePreview.clientName,
        branchId: onlinePreview.branchId,
      })

      setOnlinePreview(nextEntry)
      setInvoicePreview(invoice)
      show('Pago online marcado como pagado')
      return
    }

    let nextEntry
    try {
      nextEntry = await updateOnlinePayment(onlinePreview.id, {
        status: outcome,
        lastEvent: `checkout_${outcome}`,
      })
    } catch (error) {
      show(`No se pudo actualizar el estado: ${error.message}`, false)
      return
    }
    setOnlinePreview(nextEntry)
    show(`Estado actualizado a ${outcome}`)
  }

  return (
    <>
      <style>{css}</style>
      <Toast toast={toast} />
      <div className="page-header">
        <div><h1>Pagos</h1><p>{visibleRecords.length} transacciones y {onlinePayments.length} enlaces online</p></div>
        <div className="act-btns">
          <button className="btn-secondary" onClick={() => openOnlineCreate()}>+ Link de pago</button>
          <button className="btn-primary" onClick={openCreate}>+ Registrar pago</button>
        </div>
      </div>
      <ErrorBanner
        message={loadError ? `No se pudieron cargar los pagos: ${loadError.message}` : ''}
        onRetry={() => {
          load()
          loadClients()
        }}
      />

      <div className="pay-switch">
        <button className={activeView === 'manual' ? 'active' : ''} onClick={() => setActiveView('manual')}>Pagos presenciales</button>
        <button className={activeView === 'online' ? 'active' : ''} onClick={() => setActiveView('online')}>Pagos online</button>
      </div>

      {activeView === 'manual' ? (
        <>
          <div className="pay-kpi-grid">
            {[['Total ingresos', fmtMoney(totalIngresos)], ['Transacciones', visibleRecords.length], ['Promedio', fmtMoney(Math.round(totalIngresos / Math.max(visibleRecords.length, 1)))], ['Cobros Stripe', visibleRecords.filter((item) => item.metodo === 'stripe').length]].map(([label, value]) => (
              <div className="pay-kpi" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Cliente</th><th>Monto</th><th>Fecha</th><th>Metodo</th><th>Comprobante</th><th>Sucursal</th><th>Acciones</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={7} className="empty-state">Cargando...</td></tr>
                  : visibleRecords.length === 0 ? <tr><td colSpan={7} className="empty-state">Sin pagos</td></tr>
                    : visibleRecords.map((payment) => (
                      <tr key={payment.id}>
                        <td>{clientName(payment.cliente_id)}</td>
                        <td><strong style={{ color: '#15803d' }}>{fmtMoney(payment.monto)}</strong></td>
                        <td>{payment.fecha}</td>
                        <td><span className={`tag ${METODO_TAG[payment.metodo] || ''}`}>{payment.metodo}</span></td>
                        <td>
                          {getInvoiceByPaymentId(payment.id)
                            ? <button className="btn-edit" onClick={() => openInvoicePreview(payment.id)}>{getInvoiceByPaymentId(payment.id).number}</button>
                            : <span className="tag tag-amber">Pendiente</span>}
                        </td>
                        <td><span className="tag tag-blue">{getBranchName(getRecordBranchId('payments', payment.id))}</span></td>
                        <td><div className="act-btns">
                          <button className="btn-edit" onClick={() => openEdit(payment)}>Editar</button>
                          <button className="btn-del" onClick={() => handleDelete(payment.id)}>Eliminar</button>
                        </div></td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="online-callout">
            <h3>Cobros online</h3>
            <p>Desde aqui generas enlaces simulados con apariencia de Stripe. El cliente recibe el link por correo, pero no se procesa ningun cobro real.</p>
          </div>

          <div className="pay-kpi-grid">
            {[['Links activos', onlineStats.pendingCount], ['Pagos online', onlineStats.total], ['Ingresos online', fmtMoney(onlineStats.paidRevenue)], ['Fallidos', onlineStats.failedCount]].map(([label, value]) => (
              <div className="pay-kpi" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Referencia</th><th>Cliente</th><th>Concepto</th><th>Monto</th><th>Estado</th><th>Origen</th><th>Sucursal</th><th>Acciones</th></tr></thead>
              <tbody>
                {onlinePayments.length === 0 ? (
                  <tr><td colSpan={8} className="empty-state">Aun no hay links de pago online</td></tr>
                ) : onlinePayments.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.paymentReference}</strong><div className="inline-note">{item.stripeSessionId}</div></td>
                    <td>{item.clientName}</td>
                    <td>{item.serviceName}{item.petName ? ` - ${item.petName}` : ''}</td>
                    <td><strong style={{ color: '#15803d' }}>{fmtMoney(item.amount)}</strong></td>
                    <td><span className={`tag ${ONLINE_STATUS[item.status] || 'tag-blue'}`}>{item.status}</span></td>
                    <td><span className="tag tag-purple">{ONLINE_MODE_LABELS[getOnlineMode(item)] || item.source}</span></td>
                    <td><span className="tag tag-blue">{item.branchName || getBranchName(item.branchId)}</span></td>
                    <td>
                      <div className="act-btns">
                        <button className="btn-edit" onClick={() => openOnlinePreview(item.id)}>Ver</button>
                        <button className="btn-edit" onClick={() => copyText(item.paymentUrl)}>Copiar</button>
                        <button className="btn-del" onClick={() => handleDeleteOnline(item.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modal && (
        <Modal title={editing ? 'Editar pago' : 'Registrar pago'} onClose={() => setModal(false)} onSave={handleSave} saveLabel={editing ? 'Guardar cambios' : 'Registrar pago'}>
          <div className="form-group">
            <label className="form-label">Cliente *</label>
            <select className="form-select" value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}>
              <option value="">Seleccionar cliente...</option>
              {clientesVisibles.map((client) => <option key={client.id} value={client.id}>{client.nombre}</option>)}
            </select>
            {errors.cliente_id && <p className="form-error">{errors.cliente_id}</p>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Monto (RD$) *</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.monto} placeholder="0.00" onChange={(e) => setForm({ ...form, monto: e.target.value })} />
              {errors.monto && <p className="form-error">{errors.monto}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input className="form-input" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
              {errors.fecha && <p className="form-error">{errors.fecha}</p>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Metodo de pago</label>
            <select className="form-select" value={form.metodo} onChange={(e) => setForm({ ...form, metodo: e.target.value })}>
              {METODOS.map((method) => <option key={method} value={method}>{method.charAt(0).toUpperCase() + method.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Concepto de factura *</label>
            <input className="form-input" value={form.concept} placeholder="Ej: Consulta general / Grooming / Vacunacion" onChange={(e) => setForm({ ...form, concept: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Notas del recibo</label>
            <textarea className="form-input" rows={3} value={form.notes} placeholder="Observaciones, referencia o detalle adicional" onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Sucursal *</label>
            <select className="form-select" value={form.branch_id} onChange={(e) => setForm({ ...form, branch_id: e.target.value })}>
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} - {branch.city}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {onlineModal && (
        <Modal title="Cobro online" onClose={() => setOnlineModal(false)} onSave={handleSaveOnline} saveLabel="Generar y enviar link">
          {/* Instrucciones */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#475569' }}>
            <strong style={{ display: 'block', marginBottom: 4 }}>¿Cómo funciona?</strong>
            <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Completa los datos del cobro</li>
              <li>El sistema genera un enlace simulado con apariencia de Stripe</li>
              <li>El cliente recibe ese link por email y solo ve la pantalla simulada</li>
            </ol>
          </div>

          <div className="form-group">
            <label className="form-label">Cliente *</label>
            <select className="form-select" value={onlineForm.cliente_id} onChange={(e) => setOnlineForm({ ...onlineForm, cliente_id: e.target.value })}>
              <option value="">Seleccionar cliente...</option>
              {clientesVisibles.map((client) => <option key={client.id} value={client.id}>{client.nombre}</option>)}
            </select>
            {onlineErrors.cliente_id && <p className="form-error">{onlineErrors.cliente_id}</p>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mascota</label>
              <input className="form-input" value={onlineForm.pet_name} placeholder="Nombre de la mascota" onChange={(e) => setOnlineForm({ ...onlineForm, pet_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Concepto / servicio *</label>
              <input className="form-input" value={onlineForm.service_name} placeholder="Grooming, consulta, vacuna..." onChange={(e) => setOnlineForm({ ...onlineForm, service_name: e.target.value })} />
              {onlineErrors.service_name && <p className="form-error">{onlineErrors.service_name}</p>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Monto (RD$) *</label>
              <input className="form-input" type="number" min="0" step="0.01" value={onlineForm.amount} onChange={(e) => setOnlineForm({ ...onlineForm, amount: e.target.value })} />
              {onlineErrors.amount && <p className="form-error">{onlineErrors.amount}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de referencia</label>
              <input className="form-input" type="date" value={onlineForm.date} onChange={(e) => setOnlineForm({ ...onlineForm, date: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Sucursal *</label>
            <select className="form-select" value={onlineForm.branch_id} onChange={(e) => setOnlineForm({ ...onlineForm, branch_id: e.target.value })}>
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} - {branch.city}</option>)}
            </select>
            {onlineErrors.branch_id && <p className="form-error">{onlineErrors.branch_id}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Notas internas</label>
            <textarea className="form-input" rows={2} value={onlineForm.notes} placeholder="Notas que no verá el cliente" onChange={(e) => setOnlineForm({ ...onlineForm, notes: e.target.value })} />
          </div>
        </Modal>
      )}

      {invoicePreview && (
        <Modal title={`Comprobante ${invoicePreview.number}`} onClose={() => setInvoicePreview(null)} onSave={() => printInvoice(invoicePreview)} saveLabel="Imprimir recibo">
          <div style={{ display: 'grid', gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{invoicePreview.number}</strong>
                <span className="tag tag-green">{invoicePreview.status}</span>
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
                <div>Cliente: {invoicePreview.clientName}</div>
                <div>Contacto: {invoicePreview.clientContact || 'No registrado'}</div>
                <div>Sucursal: {invoicePreview.branchName}</div>
                <div>Fecha: {invoicePreview.date}</div>
                <div>Metodo: {invoicePreview.method}</div>
              </div>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Descripcion</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th></tr></thead>
                <tbody>
                  {invoicePreview.items.map((item, index) => (
                    <tr key={`${invoicePreview.id}-${index}`}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{fmtMoney(item.unitPrice)}</td>
                      <td><strong>{fmtMoney(item.total)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ marginBottom: 6 }}>Concepto: <strong>{invoicePreview.concept}</strong></div>
              <div style={{ marginBottom: 6 }}>Subtotal: <strong>{fmtMoney(invoicePreview.subtotal)}</strong></div>
              <div style={{ marginBottom: 6 }}>Impuestos: <strong>{fmtMoney(invoicePreview.tax)}</strong></div>
              <div style={{ fontSize: 16 }}>Total: <strong>{fmtMoney(invoicePreview.total)}</strong></div>
              {invoicePreview.notes && <p style={{ marginTop: 12, color: '#64748b' }}>{invoicePreview.notes}</p>}
            </div>
            <button className="btn-secondary" onClick={() => downloadInvoice(invoicePreview)}>Descargar HTML</button>
          </div>
        </Modal>
      )}

      {onlinePreview && (
        <Modal
          title={`Cobro online ${onlinePreview.paymentReference}`}
          onClose={() => setOnlinePreview(null)}
          onSave={() => copyText(onlinePreview.paymentUrl)}
          saveLabel="Copiar link"
          footer={(
            <>
              <div className="left">
                <button className="btn-secondary" onClick={() => setOnlinePreview(null)}>Cerrar</button>
                <button className="btn-secondary" onClick={() => window.open(onlinePreview.paymentUrl, '_blank')}>Abrir pagina Stripe</button>
              </div>
              <div className="right">
                {onlinePreview.status !== 'pagado' && <button className="btn-secondary" onClick={() => simulateOnlineOutcome('vencido')}>Marcar vencido</button>}
                {onlinePreview.status !== 'pagado' && <button className="btn-del" onClick={() => simulateOnlineOutcome('fallido')}>Marcar fallo</button>}
                {onlinePreview.status !== 'pagado' && <button className="btn-primary" onClick={() => simulateOnlineOutcome('pagado')}>Marcar pagado</button>}
              </div>
            </>
          )}
        >
          <div className="sim-grid">
            <div className="sim-card">
              <strong>{onlinePreview.clientName}</strong>
              <div>Mascota: {onlinePreview.petName || 'No especificada'}</div>
              <div>Concepto: {onlinePreview.serviceName}</div>
              <div>Sucursal: {onlinePreview.branchName || getBranchName(onlinePreview.branchId)}</div>
              <div>Monto: {fmtMoney(onlinePreview.amount)}</div>
              <div>Estado: <span className={`tag ${ONLINE_STATUS[onlinePreview.status] || 'tag-blue'}`}>{onlinePreview.status}</span></div>
            </div>
            <div className="sim-card">
              <strong>Detalle del enlace</strong>
              <div>Session ID: {onlinePreview.stripeSessionId}</div>
              <div>Referencia: {onlinePreview.paymentReference}</div>
              <div>Modo: {ONLINE_MODE_LABELS[getOnlineMode(onlinePreview)] || onlinePreview.source}</div>
              <div>Creado: {fmtDate(onlinePreview.createdAt)}</div>
              <div>Expira: {fmtDate(onlinePreview.expiresAt)}</div>
              {onlinePreview.paidAt ? <div>Pagado: {fmtDate(onlinePreview.paidAt)}</div> : null}
              <div className="sim-link">{onlinePreview.paymentUrl}</div>
            </div>
            {onlinePreview.paymentId ? (
              <div className="sim-card">
                <strong>Conversion interna</strong>
                <div>Pago registrado en sistema: {onlinePreview.paymentId}</div>
                <div>Ultimo evento: {onlinePreview.lastEvent}</div>
                <div className="sim-actions">
                  <button className="btn-edit" onClick={() => openInvoicePreview(onlinePreview.paymentId)}>Ver comprobante</button>
                  <button className="btn-edit" onClick={() => setActiveView('manual')}>Ir a pagos</button>
                </div>
              </div>
            ) : null}
          </div>
        </Modal>
      )}
    </>
  )
}
