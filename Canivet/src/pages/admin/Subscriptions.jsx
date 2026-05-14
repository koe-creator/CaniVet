import { useMemo, useState } from 'react'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { useAppConfig } from '../../context/AppConfigContext'
import { fmtDate, fmtMoney } from '../../utils/formatters'

const PLAN_OPTIONS = ['mensual', 'trimestral', 'anual']
const STATUS_OPTIONS = ['activa', 'pausada', 'cancelada']

const PLAN_TAG = { mensual: 'tag-blue', trimestral: 'tag-amber', anual: 'tag-purple' }
const STATUS_TAG = { activa: 'tag-green', pausada: 'tag-amber', cancelada: 'tag-red' }

const PLAN_LABELS = { mensual: 'Mensual', trimestral: 'Trimestral', anual: 'Anual' }
const STATUS_LABELS = { activa: 'Activa', pausada: 'Pausada', cancelada: 'Cancelada' }

const EMPTY = {
  id: null,
  clientId: '',
  petId: '',
  serviceName: '',
  plan: 'mensual',
  amount: '',
  startDate: '',
  nextBillingDate: '',
  status: 'activa',
  notes: '',
  branch_id: '',
}

const addMonths = (dateStr, months) => {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  if (isNaN(d)) return ''
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

const css = `
.sub-kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
@media(max-width:1000px){.sub-kpi-grid{grid-template-columns:repeat(2,1fr)}}
.sub-kpi { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; }
.sub-kpi strong { display:block; font-size:22px; margin-bottom:4px; }
.sub-kpi span { color:#64748b; font-size:12px; }
.sub-table { width:100%; border-collapse:collapse; }
.sub-table th { text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#64748b; padding:10px 14px; border-bottom:2px solid #e2e8f0; }
.sub-table td { padding:12px 14px; border-bottom:1px solid #f1f5f9; font-size:13px; vertical-align:middle; }
.sub-table tr:last-child td { border-bottom:none; }
.sub-table tr:hover td { background:#f8fafc; }
.sub-actions { display:flex; gap:8px; flex-wrap:wrap; }
`

export const SuscripcionesPage = () => {
  const { records: clientes, error: clientsError, load: loadClients } = useSupabaseCRUD('clientes', 'nombre')
  const { records: mascotas, error: petsError, load: loadPets } = useSupabaseCRUD('mascotas', 'nombre')
  const {
    branches,
    preferredBranchId,
    subscriptions,
    saveSubscription,
    removeSubscription,
    addAuditEntry,
    currentRole,
  } = useAppConfig()
  const { toast, show } = useToast()

  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todas')

  const clientName = (id) => clientes.find(c => c.id === id)?.nombre || ''
  const petName = (id) => mascotas.find(p => p.id === id)?.nombre || ''
  const filtered = useMemo(() => {
    return subscriptions.filter(s => {
      const matchSearch =
        s.clientName.toLowerCase().includes(search.toLowerCase()) ||
        s.petName.toLowerCase().includes(search.toLowerCase()) ||
        s.serviceName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'todas' || s.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [subscriptions, search, statusFilter])

  const kpi = useMemo(() => {
    const activas = subscriptions.filter(s => s.status === 'activa')
    const totalMensual = activas.reduce((sum, s) => {
      const factor = s.plan === 'trimestral' ? 1 / 3 : s.plan === 'anual' ? 1 / 12 : 1
      return sum + (s.amount * factor)
    }, 0)
    return {
      total: subscriptions.length,
      activas: activas.length,
      pausadas: subscriptions.filter(s => s.status === 'pausada').length,
      totalMensual,
    }
  }, [subscriptions])

  const openNew = () => {
    setForm(EMPTY)
    setModal(true)
    loadClients()
    loadPets()
  }

  const openEdit = (sub) => {
    setForm({
      id: sub.id,
      clientId: sub.clientId,
      petId: sub.petId,
      serviceName: sub.serviceName,
      plan: sub.plan,
      amount: String(sub.amount),
      startDate: sub.startDate,
      nextBillingDate: sub.nextBillingDate,
      status: sub.status,
      notes: sub.notes,
      branch_id: sub.branchId,
    })
    setModal(true)
    loadClients()
    loadPets()
  }

  const handlePlanChange = (plan) => {
    const months = plan === 'mensual' ? 1 : plan === 'trimestral' ? 3 : 12
    const next = form.startDate ? addMonths(form.startDate, months) : ''
    setForm(f => ({ ...f, plan, nextBillingDate: next }))
  }

  const handleStartDateChange = (startDate) => {
    const months = form.plan === 'mensual' ? 1 : form.plan === 'trimestral' ? 3 : 12
    const next = startDate ? addMonths(startDate, months) : ''
    setForm(f => ({ ...f, startDate, nextBillingDate: next }))
  }

  const handleSave = async () => {
    if (!form.clientId || !form.serviceName.trim() || !form.amount || !form.startDate) {
      show('Completa cliente, servicio, monto y fecha de inicio', false)
      return
    }
    const cName = clientName(form.clientId)
    const pName = petName(form.petId)
    try {
      const entry = await saveSubscription({
        id: form.id,
        clientId: form.clientId,
        clientName: cName,
        petId: form.petId,
        petName: pName,
        serviceName: form.serviceName.trim(),
        plan: form.plan,
        amount: Number(form.amount),
        startDate: form.startDate,
        nextBillingDate: form.nextBillingDate,
        status: form.status,
        notes: form.notes,
        branchId: form.branch_id || preferredBranchId,
      })
      await addAuditEntry({
        action: form.id ? 'actualizar' : 'crear',
        entity: 'subscriptions',
        entityId: entry?.id || '',
        description: `Suscripcion ${form.id ? 'actualizada' : 'creada'}: ${cName} - ${form.serviceName}`,
      })
      setModal(false)
      show(form.id ? 'Suscripcion actualizada' : 'Suscripcion creada')
    } catch (error) {
      show(`Error guardando suscripcion: ${error.message}`, false)
    }
  }

  const handleDelete = async (sub) => {
    if (!window.confirm(`Eliminar suscripcion de ${sub.clientName}?`)) return
    try {
      await removeSubscription(sub.id)
      await addAuditEntry({ action: 'eliminar', entity: 'subscriptions', entityId: sub.id, description: `Suscripcion eliminada: ${sub.clientName}` })
      show('Suscripcion eliminada')
    } catch (error) {
      show(`Error eliminando suscripcion: ${error.message}`, false)
    }
  }

  const handleStatusChange = async (sub, newStatus) => {
    try {
      await saveSubscription({ ...sub, status: newStatus })
      await addAuditEntry({ action: 'actualizar', entity: 'subscriptions', entityId: sub.id, description: `Estado cambiado a ${newStatus}: ${sub.clientName}` })
      show(`Suscripcion ${STATUS_LABELS[newStatus].toLowerCase()}`)
    } catch (error) {
      show(`Error actualizando suscripcion: ${error.message}`, false)
    }
  }

  return (
    <>
      <style>{css}</style>
      {toast && <Toast message={toast.message} success={toast.success} />}
      <div className="page-header">
        <div>
          <h1 className="page-title">Suscripciones</h1>
          <p className="page-sub">Planes mensuales, trimestrales y anuales</p>
        </div>
        {currentRole === 'admin' && (
          <button className="btn-primary" onClick={openNew}>+ Nueva suscripcion</button>
        )}
      </div>

      {clientsError && <ErrorBanner message={clientsError} />}

      <div className="sub-kpi-grid">
        <div className="sub-kpi">
          <strong>{kpi.total}</strong>
          <span>Total suscripciones</span>
        </div>
        <div className="sub-kpi">
          <strong style={{ color: '#16a34a' }}>{kpi.activas}</strong>
          <span>Activas</span>
        </div>
        <div className="sub-kpi">
          <strong style={{ color: '#d97706' }}>{kpi.pausadas}</strong>
          <span>Pausadas</span>
        </div>
        <div className="sub-kpi">
          <strong style={{ color: '#1d4ed8' }}>{fmtMoney(kpi.totalMensual)}</strong>
          <span>Ingreso mensual estimado</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              className="search-input"
              placeholder="Buscar por cliente, mascota o servicio..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="select-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="todas">Todos los estados</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <span className="badge-count">{filtered.length} suscripciones</span>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No hay suscripciones registradas</p>
        ) : (
          <div className="table-wrap">
            <table className="sub-table">
              <thead>
                <tr>
                  <th>Cliente / Mascota</th>
                  <th>Servicio</th>
                  <th>Plan</th>
                  <th>Monto</th>
                  <th>Inicio</th>
                  <th>Proximo cobro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => (
                  <tr key={sub.id}>
                    <td>
                      <strong>{sub.clientName || '-'}</strong>
                      {sub.petName && <div style={{ fontSize: 11, color: '#64748b' }}>{sub.petName}</div>}
                    </td>
                    <td>{sub.serviceName}</td>
                    <td><span className={`tag ${PLAN_TAG[sub.plan]}`}>{PLAN_LABELS[sub.plan]}</span></td>
                    <td><strong>{fmtMoney(sub.amount)}</strong></td>
                    <td>{fmtDate(sub.startDate)}</td>
                    <td>{fmtDate(sub.nextBillingDate) || '-'}</td>
                    <td><span className={`tag ${STATUS_TAG[sub.status]}`}>{STATUS_LABELS[sub.status]}</span></td>
                    <td>
                      <div className="sub-actions">
                        {currentRole === 'admin' && (
                          <>
                            <button className="btn-sm" onClick={() => openEdit(sub)}>Editar</button>
                            {sub.status === 'activa' && (
                              <button className="btn-sm btn-warning" onClick={() => handleStatusChange(sub, 'pausada')}>Pausar</button>
                            )}
                            {sub.status === 'pausada' && (
                              <button className="btn-sm btn-success" onClick={() => handleStatusChange(sub, 'activa')}>Activar</button>
                            )}
                            {sub.status !== 'cancelada' && (
                              <button className="btn-sm btn-danger" onClick={() => handleStatusChange(sub, 'cancelada')}>Cancelar</button>
                            )}
                            <button className="btn-sm btn-danger" onClick={() => handleDelete(sub)}>Eliminar</button>
                          </>
                        )}
                        {currentRole !== 'admin' && <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal title={form.id ? 'Editar suscripcion' : 'Nueva suscripcion'} onClose={() => setModal(false)}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <select className="select-input" value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value, petId: '' }))}>
                <option value="">Seleccionar cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mascota</label>
              <select className="select-input" value={form.petId} onChange={e => setForm(f => ({ ...f, petId: e.target.value }))}>
                <option value="">Sin mascota especifica</option>
                {mascotas.filter(m => !form.clientId || m.cliente_id === form.clientId).map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Servicio / Plan *</label>
              <input className="input" placeholder="Ej: Grooming mensual, Guarderia, Baño" value={form.serviceName} onChange={e => setForm(f => ({ ...f, serviceName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Frecuencia</label>
              <select className="select-input" value={form.plan} onChange={e => handlePlanChange(e.target.value)}>
                {PLAN_OPTIONS.map(p => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Monto *</label>
              <input className="input" type="number" min="0" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de inicio *</label>
              <input className="input" type="date" value={form.startDate} onChange={e => handleStartDateChange(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Proximo cobro</label>
              <input className="input" type="date" value={form.nextBillingDate} onChange={e => setForm(f => ({ ...f, nextBillingDate: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="select-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            {branches.length > 1 && (
              <div className="form-group">
                <label className="form-label">Sucursal</label>
                <select className="select-input" value={form.branch_id} onChange={e => setForm(f => ({ ...f, branch_id: e.target.value }))}>
                  <option value="">Sucursal predeterminada</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Notas</label>
              <textarea className="input" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSave}>Guardar</button>
          </div>
        </Modal>
      )}
    </>
  )
}
