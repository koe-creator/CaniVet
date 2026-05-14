import { useMemo, useState } from 'react'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { useAppConfig } from '../../context/AppConfigContext'
import { fmtDate } from '../../utils/formatters'

const today = () => new Date().toISOString().slice(0, 10)

const STATUS_OPTIONS = ['programado', 'en_curso', 'completado', 'cancelado']
const STATUS_TAG = {
  programado: 'tag-blue',
  en_curso: 'tag-amber',
  completado: 'tag-green',
  cancelado: 'tag-red',
}
const STATUS_LABELS = {
  programado: 'Programado',
  en_curso: 'En curso',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

const EMPTY = {
  id: null,
  petId: '',
  clientId: '',
  date: today(),
  startTime: '',
  endTime: '',
  duration: '',
  distance: '',
  walker: '',
  route: '',
  status: 'programado',
  notes: '',
  branch_id: '',
}

const calcDuration = (start, end) => {
  if (!start || !end) return ''
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const mins = (eh * 60 + em) - (sh * 60 + sm)
  if (mins <= 0) return ''
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}min` : `${m}min`
}

const css = `
.walk-kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
@media(max-width:1000px){.walk-kpi-grid{grid-template-columns:repeat(2,1fr)}}
.walk-kpi { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; }
.walk-kpi strong { display:block; font-size:22px; margin-bottom:4px; }
.walk-kpi span { color:#64748b; font-size:12px; }
.walk-table { width:100%; border-collapse:collapse; }
.walk-table th { text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#64748b; padding:10px 14px; border-bottom:2px solid #e2e8f0; }
.walk-table td { padding:12px 14px; border-bottom:1px solid #f1f5f9; font-size:13px; vertical-align:middle; }
.walk-table tr:last-child td { border-bottom:none; }
.walk-table tr:hover td { background:#f8fafc; }
.walk-actions { display:flex; gap:8px; flex-wrap:wrap; }
`

export const PaseosPage = () => {
  const { records: clientes, error: clientsError, load: loadClients } = useSupabaseCRUD('clientes', 'nombre')
  const { records: mascotas, error: petsError, load: loadPets } = useSupabaseCRUD('mascotas', 'nombre')
  const {
    branches,
    preferredBranchId,
    petWalks,
    saveWalk,
    removeWalk,
    addAuditEntry,
    currentRole,
  } = useAppConfig()
  const { toast, show } = useToast()

  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [dateFilter, setDateFilter] = useState('')

  const clientName = (id) => clientes.find(c => c.id === id)?.nombre || ''
  const petName = (id) => mascotas.find(p => p.id === id)?.nombre || ''

  const filtered = useMemo(() => {
    return petWalks.filter(w => {
      const matchSearch = !search ||
        w.petName.toLowerCase().includes(search.toLowerCase()) ||
        w.clientName.toLowerCase().includes(search.toLowerCase()) ||
        (w.walker || '').toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'todos' || w.status === statusFilter
      const matchDate = !dateFilter || w.date === dateFilter
      return matchSearch && matchStatus && matchDate
    })
  }, [petWalks, search, statusFilter, dateFilter])

  const kpi = useMemo(() => {
    const completados = petWalks.filter(w => w.status === 'completado')
    const enCurso = petWalks.filter(w => w.status === 'en_curso')
    const hoy = petWalks.filter(w => w.date === today())
    return {
      total: petWalks.length,
      hoy: hoy.length,
      enCurso: enCurso.length,
      completados: completados.length,
    }
  }, [petWalks])

  const openNew = () => {
    setForm(EMPTY)
    setModal(true)
    loadClients()
    loadPets()
  }

  const openEdit = (walk) => {
    setForm({
      id: walk.id,
      petId: walk.petId,
      clientId: walk.clientId,
      date: walk.date,
      startTime: walk.startTime,
      endTime: walk.endTime,
      duration: walk.duration,
      distance: walk.distance,
      walker: walk.walker,
      route: walk.route,
      status: walk.status,
      notes: walk.notes,
      branch_id: walk.branchId,
    })
    setModal(true)
    loadClients()
    loadPets()
  }

  const handleEndTimeChange = (endTime) => {
    const dur = calcDuration(form.startTime, endTime)
    setForm(f => ({ ...f, endTime, duration: dur }))
  }

  const handleStartTimeChange = (startTime) => {
    const dur = calcDuration(startTime, form.endTime)
    setForm(f => ({ ...f, startTime, duration: dur }))
  }

  const handleSave = async () => {
    if (!form.petId || !form.date) {
      show('Selecciona mascota y fecha', false)
      return
    }
    const cName = clientName(form.clientId)
    const pName = petName(form.petId)
    try {
      const entry = await saveWalk({
        id: form.id,
        petId: form.petId,
        petName: pName,
        clientId: form.clientId,
        clientName: cName,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        duration: form.duration,
        distance: form.distance,
        walker: form.walker,
        route: form.route,
        status: form.status,
        notes: form.notes,
        branchId: form.branch_id || preferredBranchId,
      })
      await addAuditEntry({
        action: form.id ? 'actualizar' : 'crear',
        entity: 'walks',
        entityId: entry?.id || '',
        description: `Paseo ${form.id ? 'actualizado' : 'creado'}: ${pName} - ${form.date}`,
      })
      setModal(false)
      show(form.id ? 'Paseo actualizado' : 'Paseo registrado')
    } catch (error) {
      show(`Error guardando paseo: ${error.message}`, false)
    }
  }

  const handleStatusChange = async (walk, newStatus) => {
    try {
      await saveWalk({ ...walk, status: newStatus })
      await addAuditEntry({ action: 'actualizar', entity: 'walks', entityId: walk.id, description: `Estado de paseo cambiado a ${newStatus}: ${walk.petName}` })
      show(`Paseo ${STATUS_LABELS[newStatus].toLowerCase()}`)
    } catch (error) {
      show(`Error actualizando paseo: ${error.message}`, false)
    }
  }

  const handleDelete = async (walk) => {
    if (!window.confirm(`Eliminar paseo de ${walk.petName}?`)) return
    try {
      await removeWalk(walk.id)
      await addAuditEntry({ action: 'eliminar', entity: 'walks', entityId: walk.id, description: `Paseo eliminado: ${walk.petName}` })
      show('Paseo eliminado')
    } catch (error) {
      show(`Error eliminando paseo: ${error.message}`, false)
    }
  }

  return (
    <>
      <style>{css}</style>
      {toast && <Toast message={toast.message} success={toast.success} />}
      <div className="page-header">
        <div>
          <h1 className="page-title">Paseos</h1>
          <p className="page-sub">Registro y seguimiento de paseos</p>
        </div>
        <button className="btn-primary" onClick={openNew}>+ Nuevo paseo</button>
      </div>

      {(clientsError || petsError) && <ErrorBanner message={clientsError || petsError} />}

      <div className="walk-kpi-grid">
        <div className="walk-kpi">
          <strong>{kpi.total}</strong>
          <span>Total paseos</span>
        </div>
        <div className="walk-kpi">
          <strong style={{ color: '#1d4ed8' }}>{kpi.hoy}</strong>
          <span>Hoy</span>
        </div>
        <div className="walk-kpi">
          <strong style={{ color: '#d97706' }}>{kpi.enCurso}</strong>
          <span>En curso</span>
        </div>
        <div className="walk-kpi">
          <strong style={{ color: '#16a34a' }}>{kpi.completados}</strong>
          <span>Completados</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              className="search-input"
              placeholder="Buscar mascota, cliente o paseador..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <input
              className="input"
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{ width: 160 }}
              title="Filtrar por fecha"
            />
            <select className="select-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="todos">Todos los estados</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            {dateFilter && <button className="btn-sm" onClick={() => setDateFilter('')}>Limpiar fecha</button>}
          </div>
          <span className="badge-count">{filtered.length} paseos</span>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No hay paseos registrados</p>
        ) : (
          <div className="table-wrap">
            <table className="walk-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Horario</th>
                  <th>Duracion</th>
                  <th>Paseador</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(w => (
                  <tr key={w.id}>
                    <td><strong>{w.petName || '-'}</strong></td>
                    <td>{w.clientName || '-'}</td>
                    <td>{fmtDate(w.date)}</td>
                    <td style={{ fontSize: 12 }}>
                      {w.startTime || '—'}
                      {w.startTime && w.endTime && ` → ${w.endTime}`}
                    </td>
                    <td>{w.duration || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                    <td>{w.walker || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                    <td><span className={`tag ${STATUS_TAG[w.status]}`}>{STATUS_LABELS[w.status]}</span></td>
                    <td>
                      <div className="walk-actions">
                        {w.status === 'programado' && (
                          <button className="btn-sm btn-warning" onClick={() => handleStatusChange(w, 'en_curso')}>Iniciar</button>
                        )}
                        {w.status === 'en_curso' && (
                          <button className="btn-sm btn-success" onClick={() => handleStatusChange(w, 'completado')}>Completar</button>
                        )}
                        <button className="btn-sm" onClick={() => openEdit(w)}>Editar</button>
                        {currentRole === 'admin' && (
                          <button className="btn-sm btn-danger" onClick={() => handleDelete(w)}>Eliminar</button>
                        )}
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
        <Modal title={form.id ? 'Editar paseo' : 'Nuevo paseo'} onClose={() => setModal(false)}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Cliente</label>
              <select className="select-input" value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value, petId: '' }))}>
                <option value="">Seleccionar cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mascota *</label>
              <select className="select-input" value={form.petId} onChange={e => setForm(f => ({ ...f, petId: e.target.value }))}>
                <option value="">Seleccionar mascota</option>
                {mascotas.filter(m => !form.clientId || m.cliente_id === form.clientId).map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="select-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Hora inicio</label>
              <input className="input" type="time" value={form.startTime} onChange={e => handleStartTimeChange(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Hora fin</label>
              <input className="input" type="time" value={form.endTime} onChange={e => handleEndTimeChange(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Duracion</label>
              <input className="input" placeholder="Calculada automaticamente" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Distancia (km)</label>
              <input className="input" type="number" min="0" step="0.1" placeholder="0.0" value={form.distance} onChange={e => setForm(f => ({ ...f, distance: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Paseador</label>
              <input className="input" placeholder="Nombre del paseador" value={form.walker} onChange={e => setForm(f => ({ ...f, walker: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Ruta</label>
              <input className="input" placeholder="Descripcion de la ruta" value={form.route} onChange={e => setForm(f => ({ ...f, route: e.target.value }))} />
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
