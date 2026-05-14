import { useState } from 'react'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { useAppConfig } from '../../context/AppConfigContext'
import { fmtMoney } from '../../utils/formatters'

const EMPTY = { nombre: '', descripcion: '', precio: '', branch_id: '' }

export const ServiciosPage = () => {
  const { records, loading, error, load, create, update, remove } = useSupabaseCRUD('servicios', 'nombre')
  const { branches, preferredBranchId, filterRecords, assignRecordBranch, getRecordBranchId, getBranchName } = useAppConfig()
  const { toast, show } = useToast()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [errors, setErrors] = useState({})

  const visibleRecords = filterRecords('services', records)
  const totalPrices = visibleRecords.reduce((sum, record) => sum + Number(record.precio || 0), 0)

  const validate = () => {
    const nextErrors = {}
    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es requerido'
    if (!form.precio || isNaN(form.precio)) nextErrors.precio = 'Precio inválido'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const openCreate = () => {
    setForm({ ...EMPTY, branch_id: preferredBranchId })
    setEditing(null)
    setErrors({})
    setModal(true)
  }

  const openEdit = (service) => {
    setForm({
      nombre: service.nombre,
      descripcion: service.descripcion || '',
      precio: service.precio,
      branch_id: getRecordBranchId('services', service.id),
    })
    setEditing(service.id)
    setErrors({})
    setModal(true)
  }

  const handleSave = async () => {
    if (!validate()) return
    const payload = { nombre: form.nombre, descripcion: form.descripcion, precio: parseFloat(form.precio) }
    const { data, error: saveError } = editing ? await update(editing, payload) : await create(payload)
    if (saveError) {
      show(`Error: ${saveError.message}`, false)
      return
    }
    assignRecordBranch('services', editing || data?.[0]?.id, form.branch_id)
    show(editing ? 'Servicio actualizado' : 'Servicio creado')
    setModal(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return
    const { error: removeError } = await remove(id)
    removeError ? show('Error al eliminar', false) : show('Servicio eliminado')
  }

  return (
    <>
      <Toast toast={toast} />
      <div className="page-header">
        <div><h1>Servicios</h1><p>{visibleRecords.length} servicios activos</p></div>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo servicio</button>
      </div>
      <ErrorBanner
        message={error ? `No se pudieron cargar los servicios: ${error.message}` : ''}
        onRetry={load}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }}>
        {[['Total servicios', visibleRecords.length], ['Suma de precios', fmtMoney(totalPrices)], ['Precio promedio', fmtMoney(Math.round(totalPrices / Math.max(visibleRecords.length, 1)))]].map(([label, value]) => (
          <div className="card" key={label} style={{ padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, color: '#64748b' }}>{label}</div>
          </div>
        ))}
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Sucursal</th><th>Acciones</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="empty-state">Cargando...</td></tr>
              : visibleRecords.length === 0 ? <tr><td colSpan={5} className="empty-state">Sin servicios</td></tr>
                : visibleRecords.map((service) => (
                  <tr key={service.id}>
                    <td><strong>{service.nombre}</strong></td>
                    <td style={{ color: '#64748b' }}>{service.descripcion || '-'}</td>
                    <td><strong style={{ color: '#15803d' }}>{fmtMoney(service.precio)}</strong></td>
                    <td><span className="tag tag-blue">{getBranchName(getRecordBranchId('services', service.id))}</span></td>
                    <td><div className="act-btns">
                      <button className="btn-edit" onClick={() => openEdit(service)}>Editar</button>
                      <button className="btn-del" onClick={() => handleDelete(service.id)}>Eliminar</button>
                    </div></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title={editing ? 'Editar servicio' : 'Nuevo servicio'} onClose={() => setModal(false)} onSave={handleSave} saveLabel={editing ? 'Guardar cambios' : 'Crear servicio'}>
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" value={form.nombre} placeholder="Ej: Consulta general" onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            {errors.nombre && <p className="form-error">{errors.nombre}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input className="form-input" value={form.descripcion} placeholder="Descripción breve" onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Precio (RD$) *</label>
            <input className="form-input" type="number" min="0" step="0.01" value={form.precio} placeholder="0.00" onChange={(e) => setForm({ ...form, precio: e.target.value })} />
            {errors.precio && <p className="form-error">{errors.precio}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Sucursal *</label>
            <select className="form-select" value={form.branch_id} onChange={(e) => setForm({ ...form, branch_id: e.target.value })}>
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} - {branch.city}</option>)}
            </select>
          </div>
        </Modal>
      )}
    </>
  )
}
