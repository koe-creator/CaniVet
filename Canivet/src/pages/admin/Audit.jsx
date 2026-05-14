import { useMemo, useState } from 'react'
import { useAppConfig } from '../../context/AppConfigContext'

const ACTION_LABELS = {
  crear: 'Crear',
  actualizar: 'Actualizar',
  eliminar: 'Eliminar',
  login: 'Inicio sesion',
  logout: 'Cierre sesion',
  exportar: 'Exportar',
  accion: 'Accion',
}

const ACTION_TAG = {
  crear: 'tag-green',
  actualizar: 'tag-blue',
  eliminar: 'tag-red',
  login: 'tag-purple',
  logout: 'tag-amber',
  exportar: 'tag-amber',
  accion: 'tag-blue',
}

const ENTITY_LABELS = {
  clients: 'Clientes',
  pets: 'Mascotas',
  appointments: 'Citas',
  services: 'Servicios',
  payments: 'Pagos',
  inventory: 'Inventario',
  subscriptions: 'Suscripciones',
  daycare: 'Guarderia',
  walks: 'Paseos',
  settings: 'Configuracion',
  branches: 'Sucursales',
  users: 'Usuarios',
}

const fmtTimestamp = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d)) return iso
  return d.toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' })
}

const css = `
.audit-kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
@media(max-width:1000px){.audit-kpi-grid{grid-template-columns:repeat(2,1fr)}}
.audit-kpi { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; }
.audit-kpi strong { display:block; font-size:22px; margin-bottom:4px; }
.audit-kpi span { color:#64748b; font-size:12px; }
.audit-table { width:100%; border-collapse:collapse; }
.audit-table th { text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#64748b; padding:10px 14px; border-bottom:2px solid #e2e8f0; }
.audit-table td { padding:10px 14px; border-bottom:1px solid #f1f5f9; font-size:13px; vertical-align:middle; }
.audit-table tr:last-child td { border-bottom:none; }
.audit-table tr:hover td { background:#f8fafc; }
.audit-desc { max-width:320px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#334155; }
.audit-filters { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:12px; }
`

const downloadCSV = (rows) => {
  const headers = ['Fecha', 'Accion', 'Entidad', 'Descripcion', 'Usuario', 'Sucursal']
  const lines = [
    headers.join(','),
    ...rows.map(r => [
      fmtTimestamp(r.timestamp),
      ACTION_LABELS[r.action] || r.action,
      ENTITY_LABELS[r.entity] || r.entity,
      `"${(r.description || '').replace(/"/g, '""')}"`,
      r.userEmail || '',
      r.branchId || '',
    ].join(',')),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const AuditoriaPage = () => {
  const { auditLog, getBranchName } = useAppConfig()

  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('todas')
  const [entityFilter, setEntityFilter] = useState('todas')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    return auditLog.filter(e => {
      const matchSearch = !search ||
        (e.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.userEmail || '').toLowerCase().includes(search.toLowerCase())
      const matchAction = actionFilter === 'todas' || e.action === actionFilter
      const matchEntity = entityFilter === 'todas' || e.entity === entityFilter
      const ts = e.timestamp?.slice(0, 10) || ''
      const matchFrom = !dateFrom || ts >= dateFrom
      const matchTo = !dateTo || ts <= dateTo
      return matchSearch && matchAction && matchEntity && matchFrom && matchTo
    })
  }, [auditLog, search, actionFilter, entityFilter, dateFrom, dateTo])

  const kpi = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return {
      total: auditLog.length,
      hoy: auditLog.filter(e => e.timestamp?.slice(0, 10) === today).length,
      creaciones: auditLog.filter(e => e.action === 'crear').length,
      eliminaciones: auditLog.filter(e => e.action === 'eliminar').length,
    }
  }, [auditLog])

  const uniqueActions = useMemo(() => [...new Set(auditLog.map(e => e.action))], [auditLog])
  const uniqueEntities = useMemo(() => [...new Set(auditLog.map(e => e.entity).filter(Boolean))], [auditLog])

  return (
    <>
      <style>{css}</style>
      <div className="page-header">
        <div>
          <h1 className="page-title">Auditoria</h1>
          <p className="page-sub">Registro de todas las acciones del sistema</p>
        </div>
        <button className="btn-primary" onClick={() => downloadCSV(filtered)}>Exportar CSV</button>
      </div>

      <div className="audit-kpi-grid">
        <div className="audit-kpi">
          <strong>{kpi.total}</strong>
          <span>Total eventos</span>
        </div>
        <div className="audit-kpi">
          <strong style={{ color: '#1d4ed8' }}>{kpi.hoy}</strong>
          <span>Eventos hoy</span>
        </div>
        <div className="audit-kpi">
          <strong style={{ color: '#16a34a' }}>{kpi.creaciones}</strong>
          <span>Creaciones</span>
        </div>
        <div className="audit-kpi">
          <strong style={{ color: '#dc2626' }}>{kpi.eliminaciones}</strong>
          <span>Eliminaciones</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="audit-filters">
            <input
              className="search-input"
              placeholder="Buscar en descripcion o usuario..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="select-input" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
              <option value="todas">Todas las acciones</option>
              {uniqueActions.map(a => <option key={a} value={a}>{ACTION_LABELS[a] || a}</option>)}
            </select>
            <select className="select-input" value={entityFilter} onChange={e => setEntityFilter(e.target.value)}>
              <option value="todas">Todas las entidades</option>
              {uniqueEntities.map(ent => <option key={ent} value={ent}>{ENTITY_LABELS[ent] || ent}</option>)}
            </select>
            <input
              className="input"
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              title="Desde"
              style={{ width: 150 }}
            />
            <input
              className="input"
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              title="Hasta"
              style={{ width: 150 }}
            />
            {(dateFrom || dateTo || actionFilter !== 'todas' || entityFilter !== 'todas') && (
              <button className="btn-sm" onClick={() => { setDateFrom(''); setDateTo(''); setActionFilter('todas'); setEntityFilter('todas') }}>
                Limpiar filtros
              </button>
            )}
          </div>
          <span className="badge-count">{filtered.length} eventos</span>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">
            {auditLog.length === 0
              ? 'El registro de auditoria esta vacio. Las acciones se registraran automaticamente.'
              : 'No hay eventos que coincidan con los filtros'}
          </p>
        ) : (
          <div className="table-wrap">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Accion</th>
                  <th>Entidad</th>
                  <th>Descripcion</th>
                  <th>Usuario</th>
                  <th>Sucursal</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td style={{ whiteSpace: 'nowrap', color: '#64748b', fontSize: 12 }}>{fmtTimestamp(e.timestamp)}</td>
                    <td><span className={`tag ${ACTION_TAG[e.action] || 'tag-blue'}`}>{ACTION_LABELS[e.action] || e.action}</span></td>
                    <td style={{ color: '#64748b' }}>{ENTITY_LABELS[e.entity] || e.entity || '-'}</td>
                    <td><div className="audit-desc" title={e.description}>{e.description || '-'}</div></td>
                    <td style={{ fontSize: 12, color: '#475569' }}>{e.userEmail || '-'}</td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{e.branchId ? getBranchName(e.branchId) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
