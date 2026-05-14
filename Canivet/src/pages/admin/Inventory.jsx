import { useMemo, useState } from 'react'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { useAppConfig } from '../../context/AppConfigContext'
import { fmtMoney } from '../../utils/formatters'

const EMPTY = { nombre: '', cantidad: '', precio: '', branch_id: '' }

const css = `
.inv-kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
@media(max-width:1000px){.inv-kpi-grid{grid-template-columns:repeat(2,1fr)}}
.inv-kpi { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; }
.inv-kpi strong { display:block; font-size:22px; margin-bottom:4px; }
.inv-kpi span { color:#64748b; font-size:12px; }
.adj-btns { display:flex; gap:6px; align-items:center; }
.adj-btn { width:28px; height:28px; border-radius:8px; border:1px solid #e2e8f0; background:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:700; }
.adj-btn:hover { background:#f1f5f9; }
.adj-btn.plus { color:#16a34a; border-color:#bbf7d0; background:#f0fdf4; }
.adj-btn.minus { color:#dc2626; border-color:#fecaca; background:#fef2f2; }
`

export const InventarioPage = () => {
  const { records, loading, error, load, create, update, remove } = useSupabaseCRUD('inventario', 'producto')
  const { branches, preferredBranchId, filterRecords, assignRecordBranch, getRecordBranchId, getBranchName, addAuditEntry } = useAppConfig()
  const { toast, show } = useToast()
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('todos')
  const [modal, setModal] = useState(false)
  const [adjModal, setAdjModal] = useState(false)
  const [adjProduct, setAdjProduct] = useState(null)
  const [adjQty, setAdjQty] = useState('')
  const [adjType, setAdjType] = useState('entrada')
  const [adjReason, setAdjReason] = useState('')
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [errors, setErrors] = useState({})

  const normalizedRecords = useMemo(() => (
    records.map((record) => ({
      ...record,
      nombre: record.nombre || record.producto || '',
    }))
  ), [records])

  const visibleRecords = filterRecords('inventory', normalizedRecords)

  const filtered = useMemo(() => {
    return visibleRecords.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (p.descripcion || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.categoria || '').toLowerCase().includes(search.toLowerCase())
      const qty = Number(p.cantidad || 0)
      const matchStock = stockFilter === 'todos' ||
        (stockFilter === 'critico' && qty < 10) ||
        (stockFilter === 'bajo' && qty >= 10 && qty < 25) ||
        (stockFilter === 'normal' && qty >= 25)
      return matchSearch && matchStock
    })
  }, [visibleRecords, search, stockFilter])

  const kpi = useMemo(() => {
    const total = visibleRecords.reduce((s, p) => s + Number(p.cantidad || 0) * Number(p.precio || 0), 0)
    const critico = visibleRecords.filter(p => Number(p.cantidad || 0) < 10).length
    const bajo = visibleRecords.filter(p => Number(p.cantidad || 0) >= 10 && Number(p.cantidad || 0) < 25).length
    return { total, critico, bajo, productos: visibleRecords.length }
  }, [visibleRecords])

  const validate = () => {
    const nextErrors = {}
    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es requerido'
    if (isNaN(form.cantidad) || form.cantidad === '') nextErrors.cantidad = 'Cantidad inválida'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const openAdjust = (product) => {
    setAdjProduct(product)
    setAdjQty('')
    setAdjType('entrada')
    setAdjReason('')
    setAdjModal(true)
  }

  const handleAdjust = async () => {
    if (!adjProduct || !adjQty || isNaN(adjQty) || Number(adjQty) <= 0) {
      show('Ingresa una cantidad válida', false)
      return
    }
    const delta = adjType === 'entrada' ? Number(adjQty) : -Number(adjQty)
    const newQty = Math.max(0, Number(adjProduct.cantidad || 0) + delta)
    const { error: saveError } = await update(adjProduct.id, { producto: adjProduct.nombre, cantidad: newQty, precio: adjProduct.precio })
    if (saveError) { show('Error al ajustar', false); return }
    addAuditEntry({ action: 'actualizar', entity: 'inventory', entityId: adjProduct.id, description: `Ajuste de stock ${adjType}: ${adjProduct.nombre} ${adjType === 'entrada' ? '+' : '-'}${adjQty} u. (${adjReason || 'sin motivo'})` })
    setAdjModal(false)
    show(`Stock ${adjType === 'entrada' ? 'aumentado' : 'reducido'}: ${adjProduct.nombre} → ${newQty} unidades`)
  }

  const openCreate = () => {
    setForm({ ...EMPTY, branch_id: preferredBranchId })
    setEditing(null)
    setErrors({})
    setModal(true)
  }

  const openEdit = (product) => {
    setForm({
      nombre: product.nombre,
      cantidad: product.cantidad,
      precio: product.precio,
      branch_id: getRecordBranchId('inventory', product.id),
    })
    setEditing(product.id)
    setErrors({})
    setModal(true)
  }

  const handleSave = async () => {
    if (!validate()) return
    const payload = { producto: form.nombre, cantidad: parseInt(form.cantidad, 10), precio: parseFloat(form.precio) || 0 }
    const { data, error: saveError } = editing ? await update(editing, payload) : await create(payload)
    if (saveError) {
      show(`Error: ${saveError.message}`, false)
      return
    }
    assignRecordBranch('inventory', editing || data?.[0]?.id, form.branch_id)
    show(editing ? 'Producto actualizado' : 'Producto agregado')
    setModal(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    const { error: removeError } = await remove(id)
    removeError ? show('Error al eliminar', false) : show('Producto eliminado')
  }

  return (
    <>
      <style>{css}</style>
      <Toast toast={toast} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventario</h1>
          <p className="page-sub">{visibleRecords.length} productos · {kpi.critico > 0 ? `${kpi.critico} en stock crítico` : 'Stock en buen estado'}</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo producto</button>
      </div>
      <ErrorBanner message={error ? `No se pudo cargar el inventario: ${error.message}` : ''} onRetry={load} />

      <div className="inv-kpi-grid">
        <div className="inv-kpi">
          <strong>{fmtMoney(kpi.total)}</strong>
          <span>Valor total inventario</span>
        </div>
        <div className="inv-kpi">
          <strong>{kpi.productos}</strong>
          <span>Productos registrados</span>
        </div>
        <div className="inv-kpi">
          <strong style={{ color: kpi.critico > 0 ? '#dc2626' : '#64748b' }}>{kpi.critico}</strong>
          <span>Stock critico (menos de 10)</span>
        </div>
        <div className="inv-kpi">
          <strong style={{ color: kpi.bajo > 0 ? '#d97706' : '#64748b' }}>{kpi.bajo}</strong>
          <span>Stock bajo (10 a 24)</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="search-input" placeholder="Buscar producto, categoria..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="select-input" value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
              <option value="todos">Todo el stock</option>
              <option value="critico">Critico (&lt;10)</option>
              <option value="bajo">Bajo (10-24)</option>
              <option value="normal">Normal (25+)</option>
            </select>
          </div>
          <span className="badge-count">{filtered.length} productos</span>
        </div>
        <div className="table-wrap">
          <table className="sub-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock</th>
                <th>Precio unitario</th>
                <th>Valor total</th>
                <th>Sucursal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={7} className="empty-state">Cargando...</td></tr>
                : filtered.length === 0
                  ? <tr><td colSpan={7} className="empty-state">Sin productos</td></tr>
                  : filtered.map(product => {
                    const qty = Number(product.cantidad || 0)
                    const stockTag = qty < 10 ? 'tag-red' : qty < 25 ? 'tag-amber' : 'tag-green'
                    return (
                      <tr key={product.id}>
                                        <td><strong>{product.nombre}</strong></td>
                        <td>
                          <div className="adj-btns">
                            <button className="adj-btn minus" onClick={() => openAdjust(product)} title="Ajustar stock">±</button>
                            <span className={`tag ${stockTag}`}>{qty} uds</span>
                          </div>
                        </td>
                        <td>{fmtMoney(product.precio)}</td>
                        <td><strong style={{ color: '#15803d' }}>{fmtMoney(qty * Number(product.precio || 0))}</strong></td>
                        <td><span className="tag tag-blue">{getBranchName(getRecordBranchId('inventory', product.id))}</span></td>
                        <td>
                          <div className="act-btns">
                            <button className="btn-edit" onClick={() => openAdjust(product)}>Ajustar</button>
                            <button className="btn-edit" onClick={() => openEdit(product)}>Editar</button>
                            <button className="btn-del" onClick={() => handleDelete(product.id)}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
      </div>

      {adjModal && adjProduct && (
        <Modal title={`Ajustar stock — ${adjProduct.nombre}`} onClose={() => setAdjModal(false)}>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>Stock actual</span>
            <strong style={{ fontSize: 18 }}>{adjProduct.cantidad} unidades</strong>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Tipo de movimiento</label>
              <select className="select-input" value={adjType} onChange={e => setAdjType(e.target.value)}>
                <option value="entrada">Entrada (restock / compra)</option>
                <option value="salida">Salida (uso / merma)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cantidad a ajustar *</label>
              <input
                className="input"
                type="number"
                min="1"
                placeholder="Ej: 10"
                value={adjQty}
                onChange={e => setAdjQty(e.target.value)}
                autoFocus
              />
              {adjQty && Number(adjQty) > 0 && (
                <div style={{ fontSize: 12, marginTop: 4, color: adjType === 'entrada' ? '#16a34a' : '#dc2626' }}>
                  Stock resultante: <strong>{Math.max(0, Number(adjProduct.cantidad || 0) + (adjType === 'entrada' ? Number(adjQty) : -Number(adjQty)))} unidades</strong>
                </div>
              )}
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Motivo</label>
              <input className="input" placeholder="Ej: Compra a proveedor, uso en servicio..." value={adjReason} onChange={e => setAdjReason(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setAdjModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={handleAdjust}>Confirmar ajuste</button>
          </div>
        </Modal>
      )}

      {modal && (
        <Modal title={editing ? 'Editar producto' : 'Nuevo producto'} onClose={() => setModal(false)} onSave={handleSave} saveLabel={editing ? 'Guardar cambios' : 'Agregar'}>
          <div className="form-group">
            <label className="form-label">Nombre del producto *</label>
            <input className="form-input" value={form.nombre} placeholder="Ej: Shampoo antipulgas" onChange={e => setForm({ ...form, nombre: e.target.value })} />
            {errors.nombre && <p className="form-error">{errors.nombre}</p>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cantidad *</label>
              <input className="form-input" type="number" min="0" value={form.cantidad} placeholder="0" onChange={e => setForm({ ...form, cantidad: e.target.value })} />
              {errors.cantidad && <p className="form-error">{errors.cantidad}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Precio unitario (RD$)</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.precio} placeholder="0.00" onChange={e => setForm({ ...form, precio: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Sucursal *</label>
            <select className="form-select" value={form.branch_id} onChange={e => setForm({ ...form, branch_id: e.target.value })}>
              {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name} - {branch.city}</option>)}
            </select>
          </div>
        </Modal>
      )}
    </>
  )
}
