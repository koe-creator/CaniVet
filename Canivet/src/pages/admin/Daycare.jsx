import { useMemo, useState } from 'react'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { useAppConfig } from '../../context/AppConfigContext'
import { fmtDate } from '../../utils/formatters'

const today = () => new Date().toISOString().slice(0, 10)
const nowTime = () => new Date().toTimeString().slice(0, 5)

const EMPTY = {
  id: null,
  petId: '',
  clientId: '',
  date: today(),
  checkIn: '',
  checkOut: '',
  notes: '',
  branch_id: '',
}

const css = `
.dc-kpi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:18px; }
@media(max-width:900px){.dc-kpi-grid{grid-template-columns:1fr}}
.dc-kpi { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; }
.dc-kpi strong { display:block; font-size:22px; margin-bottom:4px; }
.dc-kpi span { color:#64748b; font-size:12px; }
.dc-date-bar { display:flex; gap:10px; align-items:center; margin-bottom:14px; flex-wrap:wrap; }
.dc-table { width:100%; border-collapse:collapse; }
.dc-table th { text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#64748b; padding:10px 14px; border-bottom:2px solid #e2e8f0; }
.dc-table td { padding:12px 14px; border-bottom:1px solid #f1f5f9; font-size:13px; vertical-align:middle; }
.dc-table tr:last-child td { border-bottom:none; }
.dc-table tr:hover td { background:#f8fafc; }
.dc-actions { display:flex; gap:8px; flex-wrap:wrap; }
.dc-badge-in  { background:#dcfce7; color:#15803d; border-radius:20px; padding:3px 10px; font-size:11px; font-weight:700; }
.dc-badge-out { background:#fef9c3; color:#a16207; border-radius:20px; padding:3px 10px; font-size:11px; font-weight:700; }
`

export const GuarderiaPage = () => {
  const { records: clientes, error: clientsError, load: loadClients } = useSupabaseCRUD('clientes', 'nombre')
  const { records: mascotas, error: petsError, load: loadPets } = useSupabaseCRUD('mascotas', 'nombre')
  const {
    branches,
    preferredBranchId,
    daycareAttendance,
    saveDaycareRecord,
    removeDaycareRecord,
    addAuditEntry,
    currentRole,
  } = useAppConfig()
  const { toast, show } = useToast()

  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [dateFilter, setDateFilter] = useState(today())
  const [search, setSearch] = useState('')

  const clientName = (id) => clientes.find(c => c.id === id)?.nombre || ''
  const petName = (id) => mascotas.find(p => p.id === id)?.nombre || ''

  const filtered = useMemo(() => {
    return daycareAttendance.filter(r => {
      const matchDate = !dateFilter || r.date === dateFilter
      const matchSearch = !search ||
        r.petName.toLowerCase().includes(search.toLowerCase()) ||
        r.clientName.toLowerCase().includes(search.toLowerCase())
      return matchDate && matchSearch
    })
  }, [daycareAttendance, dateFilter, search])

  const kpi = useMemo(() => {
    const todayRecords = daycareAttendance.filter(r => r.date === today())
    const presente = todayRecords.filter(r => r.checkIn && !r.checkOut)
    return {
      hoy: todayRecords.length,
      presente: presente.length,
      totalMes: daycareAttendance.filter(r => r.date?.slice(0, 7) === today().slice(0, 7)).length,
    }
  }, [daycareAttendance])

  const openNew = () => {
    setForm({ ...EMPTY, date: dateFilter || today() })
    setModal(true)
    loadClients()
    loadPets()
  }

  const openEdit = (record) => {
    setForm({
      id: record.id,
      petId: record.petId,
      clientId: record.clientId,
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      notes: record.notes,
      branch_id: record.branchId,
    })
    setModal(true)
    loadClients()
    loadPets()
  }

  const handleSave = async () => {
    if (!form.petId || !form.date) {
      show('Selecciona mascota y fecha', false)
      return
    }
    const cName = clientName(form.clientId)
    const pName = petName(form.petId)
    try {
      const entry = await saveDaycareRecord({
        id: form.id,
        petId: form.petId,
        petName: pName,
        clientId: form.clientId,
        clientName: cName,
        date: form.date,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        notes: form.notes,
        branchId: form.branch_id || preferredBranchId,
      })
      await addAuditEntry({
        action: form.id ? 'actualizar' : 'crear',
        entity: 'daycare',
        entityId: entry?.id || '',
        description: `Asistencia guarderia ${form.id ? 'actualizada' : 'registrada'}: ${pName} - ${form.date}`,
      })
      setModal(false)
      show(form.id ? 'Registro actualizado' : 'Asistencia registrada')
    } catch (error) {
      show(`Error guardando asistencia: ${error.message}`, false)
    }
  }

  const handleCheckOut = async (record) => {
    try {
      await saveDaycareRecord({ ...record, checkOut: nowTime() })
      await addAuditEntry({ action: 'actualizar', entity: 'daycare', entityId: record.id, description: `Check-out registrado: ${record.petName}` })
      show('Check-out registrado')
    } catch (error) {
      show(`Error registrando check-out: ${error.message}`, false)
    }
  }

  const handleDelete = async (record) => {
    if (!window.confirm(`Eliminar registro de ${record.petName}?`)) return
    try {
      await removeDaycareRecord(record.id)
      await addAuditEntry({ action: 'eliminar', entity: 'daycare', entityId: record.id, description: `Asistencia eliminada: ${record.petName}` })
      show('Registro eliminado')
    } catch (error) {
      show(`Error eliminando asistencia: ${error.message}`, false)
    }
  }

  return (
    <>
      <style>{css}</style>
      {toast && <Toast message={toast.message} success={toast.success} />}
      <div className="page-header">
        <div>
          <h1 className="page-title">Guarderia</h1>
          <p className="page-sub">Control de asistencias y check-in / check-out</p>
        </div>
        <button className="btn-primary" onClick={openNew}>+ Registrar asistencia</button>
      </div>

      {(clientsError || petsError) && <ErrorBanner message={clientsError || petsError} />}

      <div className="dc-kpi-grid">
        <div className="dc-kpi">
          <strong style={{ color: '#1d4ed8' }}>{kpi.hoy}</strong>
          <span>Asistencias hoy</span>
        </div>
        <div className="dc-kpi">
          <strong style={{ color: '#16a34a' }}>{kpi.presente}</strong>
          <span>Presentes ahora</span>
        </div>
        <div className="dc-kpi">
          <strong>{kpi.totalMes}</strong>
          <span>Total este mes</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="dc-date-bar">
            <label style={{ fontSize: 13, fontWeight: 600 }}>Fecha:</label>
            <input
              className="input"
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{ width: 160 }}
            />
            <button className="btn-sm" onClick={() => setDateFilter(today())}>Hoy</button>
            <button className="btn-sm" onClick={() => setDateFilter('')}>Todas</button>
            <input
              className="search-input"
              placeholder="Buscar mascota o cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="badge-count">{filtered.length} registros</span>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No hay asistencias para la fecha seleccionada</p>
        ) : (
          <div className="table-wrap">
            <table className="dc-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Estado</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.petName || '-'}</strong></td>
                    <td>{r.clientName || '-'}</td>
                    <td>{fmtDate(r.date)}</td>
                    <td>{r.checkIn || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                    <td>{r.checkOut || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                    <td>
                      {r.checkIn && !r.checkOut
                        ? <span className="dc-badge-in">Presente</span>
                        : r.checkOut
                          ? <span className="dc-badge-out">Salio</span>
                          : <span style={{ color: '#94a3b8', fontSize: 12 }}>Pendiente</span>
                      }
                    </td>
                    <td style={{ color: '#64748b', maxWidth: 160 }}>{r.notes || '-'}</td>
                    <td>
                      <div className="dc-actions">
                        {r.checkIn && !r.checkOut && (
                          <button className="btn-sm btn-success" onClick={() => handleCheckOut(r)}>Check-out</button>
                        )}
                        <button className="btn-sm" onClick={() => openEdit(r)}>Editar</button>
                        {currentRole === 'admin' && (
                          <button className="btn-sm btn-danger" onClick={() => handleDelete(r)}>Eliminar</button>
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
        <Modal title={form.id ? 'Editar asistencia' : 'Nueva asistencia'} onClose={() => setModal(false)}>
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
              <label className="form-label">Check-in</label>
              <input className="input" type="time" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Check-out</label>
              <input className="input" type="time" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} />
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
