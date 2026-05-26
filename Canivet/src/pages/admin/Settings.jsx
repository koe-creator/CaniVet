import { useEffect, useMemo, useState } from 'react'
import { ROLES, ROLE_LABELS } from '../../constants/access'
import { useAppConfig } from '../../context/AppConfigContext'
import { useAuth } from '../../context/AuthContext'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { backend } from '../../services/backend'

const BRANCH_EMPTY = { id: null, name: '', city: '', status: 'Activa' }
const USER_EMPTY = { id: null, nombre: '', email: '', password: '', rol: ROLES.RECEPCIONISTA, estado: 'activo', sucursal_ids: [] }
const NOTICE_EMPTY = { client_id: '', title: '', message: '', channel: 'email' }

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'users', label: 'Usuarios' },
  { id: 'branches', label: 'Sucursales' },
  { id: 'notifications', label: 'Notificaciones' },
]

const css = `
.cfg-tabs { display:flex; gap:4px; margin-bottom:24px; background:#f1f5f9; border-radius:12px; padding:4px; }
.cfg-tab { flex:1; padding:10px 8px; border:none; background:none; border-radius:9px; cursor:pointer; font-size:13px; font-weight:600; color:#64748b; }
.cfg-tab.active { background:#fff; color:#0f172a; box-shadow:0 1px 3px rgba(0,0,0,.08); }
.cfg-section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.cfg-empty { text-align:center; color:#94a3b8; padding:32px 0; font-size:13px; }
.branch-card,.user-card { display:flex; align-items:center; gap:14px; padding:14px 16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:8px; }
.branch-info,.user-info { flex:1; }
.branch-info strong,.user-info strong { display:block; font-size:14px; color:#0f172a; }
.branch-info span,.user-info span { font-size:12px; color:#64748b; }
.branch-actions,.user-actions { display:flex; gap:8px; }
.badge { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:700; }
.badge.admin { background:#fee2e2; color:#dc2626; }
.badge.empleado { background:#ecfeff; color:#0f766e; }
.badge.recepcionista { background:#eff6ff; color:#1d4ed8; }
.user-branches { margin-top:4px; display:flex; flex-wrap:wrap; gap:6px; }
.pill { font-size:11px; padding:2px 8px; border-radius:999px; background:#e2e8f0; color:#334155; }
.notif-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #f1f5f9; }
`

export const ConfiguracionPage = () => {
  const { records: clients, error: clientsError, load: loadClients } = useSupabaseCRUD('clientes', 'nombre')
  const { getToken } = useAuth()
  const { toast, show } = useToast()
  const {
    clinic,
    allBranches,
    notifications,
    userDirectory,
    roleLabels,
    saveClinic,
    saveBranch,
    removeBranch,
    reloadUserDirectory,
    createNotification,
    updateNotificationStatus,
  } = useAppConfig()

  const [tab, setTab] = useState('general')
  const [branchModal, setBranchModal] = useState(false)
  const [branchForm, setBranchForm] = useState(BRANCH_EMPTY)
  const [userModal, setUserModal] = useState(false)
  const [userForm, setUserForm] = useState(USER_EMPTY)
  const [noticeForm, setNoticeForm] = useState(NOTICE_EMPTY)
  const sortedNotifications = useMemo(() => [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 15), [notifications])

  useEffect(() => {
    if (tab === 'notifications') loadClients()
  }, [loadClients, tab])

  const openBranchModal = (branch = null) => {
    setBranchForm(branch ? { id: branch.id, name: branch.name, city: branch.city, status: branch.status } : BRANCH_EMPTY)
    setBranchModal(true)
  }

  const openUserModal = (user = null) => {
    setUserForm(user ? {
      id: user.id,
      nombre: user.name,
      email: user.email,
      password: '',
      rol: user.role,
      estado: user.status,
      sucursal_ids: user.branchIds || [],
    } : USER_EMPTY)
    setUserModal(true)
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

  const handleUserSave = async () => {
    const token = getToken()
    if (!token) {
      show('La sesion expiro. Vuelve a iniciar sesion.', false)
      return
    }
    if (!userForm.nombre.trim() || !userForm.email.trim()) {
      show('Nombre y email son obligatorios', false)
      return
    }

    try {
      if (userForm.id) {
        await backend.updateUser(token, userForm.id, {
          nombre: userForm.nombre,
          email: userForm.email,
          rol: userForm.rol,
          estado: userForm.estado,
          sucursal_ids: userForm.sucursal_ids,
        })
      } else {
        if (!userForm.password.trim()) {
          show('La contrasena es obligatoria para crear el usuario', false)
          return
        }
        await backend.createUser(token, {
          nombre: userForm.nombre,
          email: userForm.email,
          password: userForm.password,
          rol: userForm.rol,
          estado: userForm.estado,
          sucursal_ids: userForm.sucursal_ids,
        })
      }
      await reloadUserDirectory()
      setUserModal(false)
      show(userForm.id ? 'Usuario actualizado' : 'Usuario creado')
    } catch (error) {
      show(error.message || 'No se pudo guardar el usuario', false)
    }
  }

  const handleManualNotification = async () => {
    const client = clients.find(c => String(c.id) === String(noticeForm.client_id))
    if (!client || !noticeForm.title.trim() || !noticeForm.message.trim()) {
      show('Selecciona cliente, titulo y mensaje', false)
      return
    }
    try {
      await backend.emailManualNotification({
        email: client.email,
        nombre: client.nombre,
        titulo: noticeForm.title,
        mensaje: noticeForm.message,
      })
      await createNotification({
        type: 'manual',
        title: noticeForm.title,
        message: noticeForm.message,
        channel: 'email',
        status: 'enviada',
        recipient: client.email || client.nombre,
        clientId: client.id,
        clientName: client.nombre,
      })
      setNoticeForm(NOTICE_EMPTY)
      show('Notificacion enviada')
    } catch (error) {
      show(`Error: ${error.message}`, false)
    }
  }

  return (
    <>
      <style>{css}</style>
      <Toast toast={toast} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Configuracion</h1>
          <p className="page-sub">Sistema, usuarios, roles y notificaciones</p>
        </div>
      </div>
      <ErrorBanner message={clientsError ? `Error cargando clientes: ${clientsError.message}` : ''} onRetry={loadClients} />
      <div className="cfg-tabs">
        {TABS.map(item => (
          <button key={item.id} className={`cfg-tab ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>{item.label}</button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Perfil del sistema</h3>
          {[
            { label: 'Nombre de la clinica', key: 'nombre', type: 'text' },
            { label: 'Email de contacto', key: 'email', type: 'email' },
            { label: 'Zona horaria', key: 'timezone', type: 'text' },
          ].map(field => (
            <div className="form-group" key={field.key}>
              <label className="form-label">{field.label}</label>
              <input className="form-input" type={field.type} value={clinic[field.key]} onChange={(event) => saveClinic({ [field.key]: event.target.value })} />
            </div>
          ))}
          <button className="btn-primary" onClick={() => show('Configuracion guardada')}>Guardar cambios</button>
        </div>
      )}

      {tab === 'users' && (
        <div className="card">
          <div className="cfg-section-header">
            <div>
              <h3>Usuarios y roles</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{userDirectory.length} usuario(s) registrado(s)</p>
            </div>
            <button className="btn-primary" onClick={() => openUserModal()}>+ Nuevo usuario</button>
          </div>
          {userDirectory.length === 0 ? (
            <p className="cfg-empty">No hay usuarios cargados</p>
          ) : userDirectory.map(user => (
            <div className="user-card" key={user.id}>
              <div className="user-info">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <div className="user-branches">
                  {(user.branchIds || []).map(branchId => {
                    const branch = allBranches.find(item => item.id === branchId)
                    return <span className="pill" key={branchId}>{branch?.name || branchId}</span>
                  })}
                </div>
              </div>
              <span className={`badge ${user.role}`}>{roleLabels[user.role] || ROLE_LABELS[user.role] || user.role}</span>
              <span className={`tag ${user.status === 'activo' ? 'tag-green' : 'tag-red'}`}>{user.status}</span>
              <div className="user-actions">
                <button className="btn-edit" onClick={() => openUserModal(user)}>Editar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'branches' && (
        <div className="card">
          <div className="cfg-section-header">
            <div>
              <h3>Sucursales</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{allBranches.length} sucursal(es)</p>
            </div>
            <button className="btn-primary" onClick={() => openBranchModal()}>+ Nueva sucursal</button>
          </div>
          {allBranches.length === 0 ? (
            <p className="cfg-empty">No hay sucursales registradas</p>
          ) : allBranches.map(branch => (
            <div className="branch-card" key={branch.id}>
              <div className="branch-info">
                <strong>{branch.name}</strong>
                <span>{branch.city}</span>
              </div>
              <span className={`tag ${branch.status === 'Activa' ? 'tag-green' : branch.status === 'Pausa' ? 'tag-amber' : 'tag-red'}`}>{branch.status}</span>
              <div className="branch-actions">
                <button className="btn-edit" onClick={() => openBranchModal(branch)}>Editar</button>
                {!branch.isDefault && <button className="btn-del" onClick={() => {
                  const result = removeBranch(branch.id)
                  result.error ? show(result.error, false) : show('Sucursal eliminada')
                }}>Eliminar</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'notifications' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Enviar notificacion manual</h3>
            <div className="form-group">
              <label className="form-label">Cliente</label>
              <select className="form-select" value={noticeForm.client_id} onChange={(event) => setNoticeForm({ ...noticeForm, client_id: event.target.value })}>
                <option value="">Seleccionar cliente...</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Titulo</label>
              <input className="form-input" value={noticeForm.title} onChange={(event) => setNoticeForm({ ...noticeForm, title: event.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Mensaje</label>
              <textarea className="form-input" rows={4} value={noticeForm.message} onChange={(event) => setNoticeForm({ ...noticeForm, message: event.target.value })} />
            </div>
            <button className="btn-primary" onClick={handleManualNotification}>Enviar</button>
          </div>

          <div className="card">
            <div className="cfg-section-header">
              <h3>Actividad reciente</h3>
              <span className="badge-count">{sortedNotifications.filter(item => item.status !== 'leida').length} sin leer</span>
            </div>
            {sortedNotifications.length === 0 ? (
              <p className="cfg-empty">Sin notificaciones aun</p>
            ) : sortedNotifications.map(item => (
              <div className="notif-item" key={item.id}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.status === 'leida' ? '#cbd5e1' : '#3b82f6', marginTop: 4 }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: 13, color: '#0f172a' }}>{item.title}</strong>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{item.clientName || item.recipient}</span>
                </div>
                {item.status !== 'leida' && <button className="btn-edit" onClick={() => updateNotificationStatus(item.id, 'leida')}>Marcar leida</button>}
              </div>
            ))}
          </div>
        </div>
      )}

      {branchModal && (
        <Modal title={branchForm.id ? 'Editar sucursal' : 'Nueva sucursal'} onClose={() => setBranchModal(false)} onSave={handleBranchSave} saveLabel={branchForm.id ? 'Guardar cambios' : 'Crear sucursal'}>
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" value={branchForm.name} onChange={(event) => setBranchForm({ ...branchForm, name: event.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Ciudad *</label>
            <input className="form-input" value={branchForm.city} onChange={(event) => setBranchForm({ ...branchForm, city: event.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select className="form-select" value={branchForm.status} onChange={(event) => setBranchForm({ ...branchForm, status: event.target.value })}>
              <option value="Activa">Activa</option>
              <option value="Pausa">En pausa</option>
              <option value="Archivada">Archivada</option>
            </select>
          </div>
        </Modal>
      )}

      {userModal && (
        <Modal title={userForm.id ? 'Editar usuario' : 'Nuevo usuario'} onClose={() => setUserModal(false)} onSave={handleUserSave} saveLabel={userForm.id ? 'Guardar cambios' : 'Crear usuario'}>
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" value={userForm.nombre} onChange={(event) => setUserForm({ ...userForm, nombre: event.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} />
          </div>
          {!userForm.id && (
            <div className="form-group">
              <label className="form-label">Contrasena *</label>
              <input className="form-input" type="password" value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Rol</label>
            <select className="form-select" value={userForm.rol} onChange={(event) => setUserForm({ ...userForm, rol: event.target.value })}>
              <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</option>
              <option value={ROLES.EMPLEADO}>{ROLE_LABELS[ROLES.EMPLEADO]}</option>
              <option value={ROLES.RECEPCIONISTA}>{ROLE_LABELS[ROLES.RECEPCIONISTA]}</option>
              <option value={ROLES.CLIENTE}>{ROLE_LABELS[ROLES.CLIENTE]}</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select className="form-select" value={userForm.estado} onChange={(event) => setUserForm({ ...userForm, estado: event.target.value })}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          {userForm.rol !== ROLES.ADMIN && (
            <div className="form-group">
              <label className="form-label">Sucursales</label>
              <div style={{ display: 'grid', gap: 8 }}>
                {allBranches.map(branch => (
                  <label key={branch.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={userForm.sucursal_ids.includes(branch.id)}
                      onChange={(event) => setUserForm({
                        ...userForm,
                        sucursal_ids: event.target.checked
                          ? [...userForm.sucursal_ids, branch.id]
                          : userForm.sucursal_ids.filter(id => id !== branch.id),
                      })}
                    />
                    {branch.name} - {branch.city}
                  </label>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
