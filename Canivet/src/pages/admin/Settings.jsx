import { useMemo, useState } from 'react'
import { useToast } from '../../hooks/useToast'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { useAppConfig } from '../../context/AppConfigContext'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { backend } from '../../services/backend'

const BRANCH_EMPTY = { id: null, name: '', city: '', status: 'Activa' }
const NOTICE_EMPTY = { client_id: '', title: '', message: '', channel: 'email' }

const TABS = [
  { id: 'general',       label: 'General',        icon: '⚙️' },
  { id: 'branches',      label: 'Sucursales',     icon: '🏢' },
  { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
]

const css = `
.cfg-tabs { display:flex; gap:4px; margin-bottom:24px; background:#f1f5f9; border-radius:12px; padding:4px; }
.cfg-tab  { flex:1; padding:10px 8px; border:none; background:none; border-radius:9px; cursor:pointer; font-size:13px; font-weight:600; color:#64748b; transition:all .15s; display:flex; align-items:center; justify-content:center; gap:6px; }
.cfg-tab.active { background:#fff; color:#0f172a; box-shadow:0 1px 3px rgba(0,0,0,.08); }
.cfg-tab:hover:not(.active) { color:#334155; }

.role-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:700; }
.role-badge.admin { background:#fef2f2; color:#dc2626; }
.role-badge.user  { background:#eff6ff; color:#1d4ed8; }

.perm-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; }
.perm-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px; }
.perm-card h4 { font-size:13px; font-weight:700; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
.perm-list { display:flex; flex-wrap:wrap; gap:5px; }
.perm-pill { font-size:11px; padding:2px 8px; border-radius:20px; font-weight:600; }
.perm-pill.admin { background:#fee2e2; color:#dc2626; }
.perm-pill.user  { background:#dbeafe; color:#1d4ed8; }

.branch-card { display:flex; align-items:center; gap:14px; padding:14px 16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:8px; }
.branch-card:last-child { margin-bottom:0; }
.branch-icon { width:42px; height:42px; background:#0f172a; border-radius:11px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; flex-shrink:0; }
.branch-info { flex:1; }
.branch-info strong { display:block; font-size:14px; color:#0f172a; }
.branch-info span   { font-size:12px; color:#64748b; }
.branch-actions { display:flex; gap:8px; }

.user-card { display:flex; align-items:center; gap:14px; padding:14px 16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:8px; }
.user-card:last-child { margin-bottom:0; }
.user-avatar { width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:15px; font-weight:700; flex-shrink:0; }
.user-info { flex:1; min-width:0; }
.user-info strong { display:block; font-size:14px; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.user-info span   { font-size:12px; color:#64748b; }
.user-branches { display:flex; flex-wrap:wrap; gap:4px; margin-top:4px; }

.toggle-row { display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:8px; }
.toggle-row span { font-size:13px; font-weight:600; color:#334155; }
.toggle { width:42px; height:24px; border-radius:100px; cursor:pointer; position:relative; transition:background .2s; border:none; outline:none; padding:0; flex-shrink:0; }
.toggle-thumb { position:absolute; top:3px; width:18px; height:18px; background:#fff; border-radius:50%; transition:left .2s; pointer-events:none; box-shadow:0 1px 3px rgba(0,0,0,.2); }

.cfg-section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.cfg-section-header h3 { font-size:16px; font-weight:700; color:#0f172a; }
.cfg-empty { text-align:center; color:#94a3b8; padding:32px 0; font-size:13px; }

.notif-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #f1f5f9; }
.notif-item:last-child { border-bottom:none; }
.notif-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:4px; }
.notif-body strong { display:block; font-size:13px; color:#0f172a; }
.notif-body span { font-size:12px; color:#64748b; }
`

export const ConfiguracionPage = () => {
  const { records: clients, error: clientsError, load: loadClients } = useSupabaseCRUD('clientes', 'nombre')
  const { toast, show } = useToast()
  const {
    clinic,
    allBranches,
    notifications,
    saveClinic,
    saveBranch,
    removeBranch,
    createNotification,
    updateNotificationStatus,
  } = useAppConfig()

  const [tab, setTab] = useState('general')
  const [branchModal, setBranchModal] = useState(false)
  const [branchForm, setBranchForm] = useState(BRANCH_EMPTY)
  const [noticeForm, setNoticeForm] = useState(NOTICE_EMPTY)

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 15),
    [notifications],
  )

  const openBranchModal = (branch = null) => {
    setBranchForm(branch
      ? { id: branch.id, name: branch.name, city: branch.city, status: branch.status }
      : BRANCH_EMPTY,
    )
    setBranchModal(true)
  }

  const handleBranchSave = () => {
    if (!branchForm.name.trim() || !branchForm.city.trim()) {
      show('Completa nombre y ciudad', false)
      return
    }
    saveBranch(branchForm)
    setBranchModal(false)
    show(branchForm.id ? 'Sucursal actualizada' : 'Sucursal creada')
  }

  const handleBranchDelete = (branchId) => {
    const { error } = removeBranch(branchId)
    error ? show(error, false) : show('Sucursal eliminada')
  }

  const handleManualNotification = async () => {
    const client = clients.find(c => String(c.id) === String(noticeForm.client_id))
    if (!client || !noticeForm.title.trim() || !noticeForm.message.trim()) {
      show('Selecciona cliente, t??tulo y mensaje', false)
      return
    }
    if (noticeForm.channel === 'email' && !client.email) {
      show('El cliente no tiene email registrado', false)
      return
    }
    if (noticeForm.channel === 'sms') {
      show('El canal SMS no est?? configurado todav??a. Usa email o interna.', false)
      return
    }

    let status = 'enviada'
    if (noticeForm.channel === 'email') {
      try {
        await backend.emailManualNotification({
          email: client.email,
          nombre: client.nombre,
          titulo: noticeForm.title,
          mensaje: noticeForm.message,
        })
      } catch (error) {
        show(`Error enviando email: ${error.message}`, false)
        return
      }
    } else {
      status = 'leida'
    }

    createNotification({
      type: 'manual',
      title: noticeForm.title,
      message: noticeForm.message,
      channel: noticeForm.channel,
      status,
      recipient: client.email || client.telefono || client.nombre,
      clientId: client.id,
      clientName: client.nombre,
    })
    setNoticeForm(NOTICE_EMPTY)
    show(noticeForm.channel === 'email' ? 'Notificaci??n enviada por email' : 'Notificaci??n interna registrada')
  }

  return (
    <>
      <style>{css}</style>
      <Toast toast={toast} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Configuración</h1>
          <p className="page-sub">Sistema · Sucursales · Notificaciones</p>
        </div>
      </div>

      <ErrorBanner message={clientsError ? `Error cargando clientes: ${clientsError.message}` : ''} onRetry={loadClients} />

      {/* Tabs */}
      <div className="cfg-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`cfg-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: General ─────────────────────────────────────────── */}
      {tab === 'general' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Perfil del sistema</h3>
            {[
              { label: 'Nombre de la clínica', key: 'nombre', type: 'text' },
              { label: 'Teléfono', key: 'telefono', type: 'tel' },
              { label: 'Email de contacto', key: 'email', type: 'email' },
              { label: 'Zona horaria', key: 'timezone', type: 'text' },
            ].map(f => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" type={f.type} value={clinic[f.key]} onChange={e => saveClinic({ [f.key]: e.target.value })} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Moneda</label>
              <select className="form-select" value={clinic.moneda} onChange={e => saveClinic({ moneda: e.target.value })}>
                <option value="DOP">DOP — Peso dominicano</option>
                <option value="USD">USD — Dólar americano</option>
                <option value="EUR">EUR — Euro</option>
              </select>
            </div>
            <button className="btn-primary" style={{ marginTop: 8 }} onClick={() => show('Configuración guardada')}>
              Guardar cambios
            </button>
          </div>

        </div>
      )}

      {/* ── Tab: Sucursales ──────────────────────────────────────── */}
      {tab === 'branches' && (
        <div className="card">
          <div className="cfg-section-header">
            <div>
              <h3>Sucursales</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {allBranches.length} sucursal{allBranches.length !== 1 ? 'es' : ''} registrada{allBranches.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button className="btn-primary" onClick={() => openBranchModal()}>+ Nueva sucursal</button>
          </div>

          {allBranches.length === 0 ? (
            <p className="cfg-empty">No hay sucursales registradas</p>
          ) : allBranches.map(branch => (
            <div className="branch-card" key={branch.id}>
              <div className="branch-icon">🏢</div>
              <div className="branch-info">
                <strong>{branch.name}</strong>
                <span>{branch.city}</span>
              </div>
              <span className={`tag ${branch.status === 'Activa' ? 'tag-green' : branch.status === 'Pausa' ? 'tag-amber' : 'tag-red'}`}>
                {branch.status}
              </span>
              {branch.isDefault && (
                <span style={{ fontSize: 11, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, padding: '2px 8px', color: '#64748b', fontWeight: 600 }}>
                  Principal
                </span>
              )}
              <div className="branch-actions">
                <button className="btn-edit" onClick={() => openBranchModal(branch)}>Editar</button>
                {!branch.isDefault && (
                  <button className="btn-del" onClick={() => handleBranchDelete(branch.id)}>Eliminar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab: Notificaciones ───────────────────────────────────── */}
      {tab === 'notifications' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Estado de EmailJS */}
          <div style={{ gridColumn: '1/-1' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 22 }}>✅</span>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 13, color: '#15803d' }}>Emails activos (SMTP real)</strong>
                <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
                  El sistema envía emails reales via Gmail SMTP desde el backend. Reservas, confirmaciones, recibos y alertas de vacunas.
                </p>
              </div>
              <button
                className="btn-primary"
                style={{ whiteSpace: 'nowrap', fontSize: 12 }}
                onClick={() => {
                  backend.emailTestAdmin()
                    .then(() => show('Email de prueba enviado — revisa tu bandeja'))
                    .catch(e => show(`Error: ${e.message}`, false))
                }}
              >
                📧 Enviar email de prueba
              </button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Enviar notificación manual</h3>
            <div className="form-group">
              <label className="form-label">Cliente destinatario</label>
              <select className="form-select" value={noticeForm.client_id}
                onChange={e => setNoticeForm({ ...noticeForm, client_id: e.target.value })}>
                <option value="">Seleccionar cliente...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Título</label>
              <input className="form-input" value={noticeForm.title} placeholder="Ej: Recordatorio de vacuna" onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Canal</label>
              <select className="form-select" value={noticeForm.channel} onChange={e => setNoticeForm({ ...noticeForm, channel: e.target.value })}>
                <option value="email">Email</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mensaje</label>
              <textarea className="form-input" rows={4} value={noticeForm.message} placeholder="Escribe el mensaje aquí..." onChange={e => setNoticeForm({ ...noticeForm, message: e.target.value })} />
            </div>
            <button className="btn-primary" onClick={handleManualNotification}>Enviar notificación</button>
          </div>

          <div className="card">
            <div className="cfg-section-header">
              <h3>Actividad reciente</h3>
              <span className="badge-count">{sortedNotifications.filter(n => n.status !== 'leida').length} sin leer</span>
            </div>
            {sortedNotifications.length === 0
              ? <p className="cfg-empty">Sin notificaciones aún</p>
              : sortedNotifications.map(n => (
                  <div className="notif-item" key={n.id}>
                    <div className="notif-dot" style={{ background: n.status === 'leida' ? '#cbd5e1' : '#3b82f6' }} />
                    <div className="notif-body" style={{ flex: 1 }}>
                      <strong>{n.title}</strong>
                      <span>{n.clientName || n.recipient} · {n.channel}</span>
                      {n.message && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{n.message.slice(0, 80)}{n.message.length > 80 ? '…' : ''}</div>}
                    </div>
                    {n.status !== 'leida' && (
                      <button className="btn-edit" style={{ fontSize: 11 }} onClick={() => updateNotificationStatus(n.id, 'leida')}>
                        Marcar leída
                      </button>
                    )}
                  </div>
                ))
            }
          </div>
        </div>
      )}

      {/* ── Modal: Sucursal ───────────────────────────────────────── */}
      {branchModal && (
        <Modal
          title={branchForm.id ? 'Editar sucursal' : 'Nueva sucursal'}
          onClose={() => setBranchModal(false)}
          onSave={handleBranchSave}
          saveLabel={branchForm.id ? 'Guardar cambios' : 'Crear sucursal'}
        >
          <div className="form-group">
            <label className="form-label">Nombre de la sucursal *</label>
            <input className="form-input" placeholder="Ej: Sede Norte" value={branchForm.name} onChange={e => setBranchForm({ ...branchForm, name: e.target.value })} autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Ciudad *</label>
            <input className="form-input" placeholder="Ej: Santiago" value={branchForm.city} onChange={e => setBranchForm({ ...branchForm, city: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select className="form-select" value={branchForm.status} onChange={e => setBranchForm({ ...branchForm, status: e.target.value })}>
              <option value="Activa">Activa</option>
              <option value="Pausa">En pausa</option>
              <option value="Archivada">Archivada</option>
            </select>
          </div>
        </Modal>
      )}

    </>
  )
}
