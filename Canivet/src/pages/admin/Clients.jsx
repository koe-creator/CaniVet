import { useState } from 'react'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { Pagination } from '../../components/ui/Pagination'
import { useAppConfig } from '../../context/AppConfigContext'
import { getInitials } from '../../utils/formatters'
import { validateClientForm } from '../../utils/validators'
import { backend } from '../../services/backend'

const EMPTY = { nombre: '', email: '', branch_id: '' }
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316']

export const ClientesPage = () => {
  const { records, loading, error, load, create, update, remove, page, totalPages, total, pageSize, hasPrev, hasMore, nextPage, prevPage } = useSupabaseCRUD('clientes', 'nombre')
  const { branches, preferredBranchId, filterRecords, assignRecordBranch, getRecordBranchId, getBranchName, createNotification } = useAppConfig()
  const { toast, show } = useToast()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [errors, setErrors] = useState({})

  const visibleRecords = filterRecords('clients', records)
  const filtered = visibleRecords.filter((client) =>
    client.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (client.email || '').toLowerCase().includes(search.toLowerCase()),
  )

  const openCreate = () => {
    setForm({ ...EMPTY, branch_id: preferredBranchId })
    setEditing(null)
    setErrors({})
    setModal(true)
  }

  const openEdit = (client) => {
    setForm({
      nombre: client.nombre,
      email: client.email || '',
      branch_id: getRecordBranchId('clients', client.id),
    })
    setEditing(client.id)
    setErrors({})
    setModal(true)
  }

  const handleSave = async () => {
    const nextErrors = validateClientForm(form)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const payload = { nombre: form.nombre, email: form.email }
    const { data, error: saveError } = editing ? await update(editing, payload) : await create(payload)

    if (saveError) {
      show(`Error: ${saveError.message}`, false)
      return
    }

    assignRecordBranch('clients', editing || data?.[0]?.id, form.branch_id)

    if (!editing) {
      const branchName = getBranchName(form.branch_id)

      createNotification({
        type: 'client_registered',
        title: 'Cliente registrado',
        message: `${form.nombre} fue agregado al sistema${branchName ? ` en ${branchName}` : ''}.`,
        channel: 'interna',
        recipient: form.email || form.nombre,
        clientId: data?.[0]?.id || null,
        clientName: form.nombre,
        status: 'leida',
        branchId: form.branch_id,
      })

      if (form.email) {
        try {
          await backend.emailClientWelcome({
            email: form.email,
            nombre: form.nombre,
            sucursal: branchName,
          })
        } catch (notifyError) {
          show(`Cliente creado, pero el email no se pudo enviar: ${notifyError.message}`, false)
          setModal(false)
          return
        }
      }
    }

    show(editing ? 'Cliente actualizado' : 'Cliente creado')
    setModal(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar este cliente?')) return
    const { error: removeError } = await remove(id)
    removeError ? show('Error al eliminar', false) : show('Cliente eliminado')
  }

  return (
    <>
      <Toast toast={toast} />
      <div className="page-header">
        <div><h1>Clientes</h1><p>{visibleRecords.length} registros en total</p></div>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo cliente</button>
      </div>
      <ErrorBanner
        message={error ? `No se pudieron cargar los clientes: ${error.message}` : ''}
        onRetry={load}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }}>
        {[['Total clientes', visibleRecords.length], ['Resultados', filtered.length], ['Con email', visibleRecords.filter((client) => client.email).length]].map(([label, value]) => (
          <div className="card" key={label} style={{ padding: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, color: '#64748b' }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 12 }}>
        <input className="form-input" placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Email</th><th>Sucursal</th><th>Acciones</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="empty-state">Cargando...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={4} className="empty-state">Sin clientes registrados</td></tr>
                : filtered.map((client, index) => (
                  <tr key={client.id}>
                    <td><div className="name-cell"><div className="avatar" style={{ background: COLORS[index % COLORS.length] }}>{getInitials(client.nombre)}</div>{client.nombre}</div></td>
                    <td>{client.email || '-'}</td>
                    <td><span className="tag tag-blue">{getBranchName(getRecordBranchId('clients', client.id))}</span></td>
                    <td><div className="act-btns">
                      <button className="btn-edit" onClick={() => openEdit(client)}>Editar</button>
                      <button className="btn-del" onClick={() => handleDelete(client.id)}>Eliminar</button>
                    </div></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} hasPrev={hasPrev} hasMore={hasMore} onPrev={prevPage} onNext={nextPage} />
      {modal && (
        <Modal title={editing ? 'Editar cliente' : 'Nuevo cliente'} onClose={() => setModal(false)} onSave={handleSave} saveLabel={editing ? 'Guardar cambios' : 'Crear cliente'}>
          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input className="form-input" value={form.nombre} placeholder="Ej: Juan Perez" onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            {errors.nombre && <p className="form-error">{errors.nombre}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} placeholder="correo@email.com" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="form-error">{errors.email}</p>}
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
