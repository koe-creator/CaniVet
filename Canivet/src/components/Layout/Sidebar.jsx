import { useAuth } from '../../context/AuthContext'
import { useAppConfig } from '../../context/AppConfigContext'
import { getInitials } from '../../utils/formatters'

const ICON = (cp) => String.fromCodePoint(cp)
const CROSS = String.fromCodePoint(0x00D7)

const NAV_ITEMS = [
  { section: 'Principal', items: [
    { id: 'dashboard',    label: 'Dashboard',    icon: ICON(0x1F4CA) },
  ]},
  { section: 'Gestion', items: [
    { id: 'clients',      label: 'Clientes',      icon: ICON(0x1F465) },
    { id: 'pets',         label: 'Mascotas',      icon: ICON(0x1F43E) },
    { id: 'appointments', label: 'Citas',         icon: ICON(0x1F4C5) },
  ]},
  { section: 'Operaciones', items: [
    { id: 'services',      label: 'Servicios',      icon: ICON(0x1F527) },
    { id: 'payments',      label: 'Pagos',           icon: ICON(0x1F4B3) },
    { id: 'inventory',     label: 'Inventario',      icon: ICON(0x1F4E6) },
    { id: 'subscriptions', label: 'Suscripciones',   icon: ICON(0x1F504) },
  ]},
  { section: 'Servicios', items: [
    { id: 'daycare',       label: 'Guarderia',        icon: ICON(0x1F3E0) },
    { id: 'walks',         label: 'Paseos',           icon: ICON(0x1F43E) },
  ]},
  { section: 'Analisis', items: [
    { id: 'reports',       label: 'Reportes',         icon: ICON(0x1F4C8) },
    { id: 'audit',         label: 'Auditoria',        icon: ICON(0x1F4CB) },
  ]},
  { section: 'Sistema', items: [
    { id: 'settings',      label: 'Configuracion',    icon: ICON(0x2699) },
  ]},
]

const css = `
.sidebar {
  width: var(--sidebar-width); background: var(--sidebar-bg);
  position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
  display: flex; flex-direction: column;
}
.sb-logo {
  padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,.06);
  display: flex; align-items: center; gap: 12px;
}
.sb-logo-ic {
  width: 34px; height: 34px; background: var(--primary);
  border-radius: 9px; display: flex; align-items: center;
  justify-content: center; font-size: 16px; flex-shrink: 0;
}
.sb-logo strong { display: block; font-size: 16px; font-weight: 800; color: #fff; }
.sb-logo span   { font-size: 10px; color: var(--sidebar-text); }
.sb-nav { flex: 1; overflow-y: auto; padding: 14px 10px; }
.sb-sec { margin-bottom: 20px; }
.sb-sec-lbl {
  font-size: 9px; font-weight: 700; letter-spacing: 1.2px;
  text-transform: uppercase; color: rgba(148,163,184,.4);
  padding: 0 10px; margin-bottom: 5px;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: 7px; cursor: pointer;
  color: var(--sidebar-text); font-size: 13px; font-weight: 500;
  transition: all .12s; border: none; background: none;
  width: 100%; text-align: left;
}
.nav-item:hover  { background: var(--sidebar-hover); color: #fff; }
.nav-item.active { background: var(--sidebar-active); color: #fff; }
.nav-icon { font-size: 15px; flex-shrink: 0; }
.sb-foot { padding: 14px 10px; border-top: 1px solid rgba(255,255,255,.06); }
.sb-user {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 10px; background: rgba(255,255,255,.04); border-radius: 7px;
}
.sb-user-av {
  width: 30px; height: 30px; border-radius: 8px; background: var(--primary);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 11px; flex-shrink: 0;
}
.sb-user-info strong { display: block; font-size: 12px; color: #fff; font-weight: 600; }
.sb-user-info span   { font-size: 10px; color: var(--sidebar-text); }
.sb-logout {
  background: none; border: none; cursor: pointer;
  color: var(--sidebar-text); margin-left: auto;
  font-size: 16px; padding: 2px; display: flex; transition: color .15s;
}
.sb-logout:hover { color: var(--danger); }
`

export const Sidebar = ({ active, onNavigate, isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const { canAccess, currentRoleLabel, activeBranchId, getBranchName, notifications } = useAppConfig()
  const email = user?.email || ''
  const name  = email.split('@')[0]
  const pendingNotifications = notifications.filter(n => n.status !== 'leida').length
  const activeBranchLabel = activeBranchId === 'all' ? 'Todas las sucursales' : getBranchName(activeBranchId)

  const handleNav = (id) => {
    onNavigate(id)
    onClose?.()
  }

  return (
    <>
      <style>{css}</style>
      <aside className={`sidebar${isOpen ? ' sb-open' : ''}`}>
        <div className="sb-logo">
          <div className="sb-logo-ic">{ICON(0x1F43E)}</div>
          <div style={{ flex: 1 }}>
            <strong>CaniVet</strong>
            <span>Plataforma Veterinaria</span>
          </div>
          {/* Botón cerrar — solo visible en móvil */}
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--sidebar-text)', fontSize: 22, padding: '0 2px',
              display: 'flex', alignItems: 'center',
            }}
            aria-label="Cerrar menú"
          >{CROSS}</button>
        </div>

        <nav className="sb-nav">
          {NAV_ITEMS.map(section => (
            <div className="sb-sec" key={section.section}>
              {section.items.some(item => canAccess(item.id)) && (
                <div className="sb-sec-lbl">{section.section}</div>
              )}
              {section.items.filter(item => canAccess(item.id)).map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${active === item.id ? 'active' : ''}`}
                  onClick={() => handleNav(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sb-foot">
          <div className="sb-user">
            <div className="sb-user-av">{getInitials(name)}</div>
            <div className="sb-user-info">
              <strong>{name}</strong>
              <span>{currentRoleLabel}</span>
            </div>
            <button className="sb-logout" onClick={logout} title="Cerrar sesion">{CROSS}</button>
          </div>
          <div style={{ marginTop: 10, padding: '0 10px', fontSize: 11, color: 'var(--sidebar-text)' }}>
            <div>Sucursal: {activeBranchLabel}</div>
            {pendingNotifications > 0 && (
              <div style={{ color: '#f87171', marginTop: 2 }}>
                {pendingNotifications} notif. sin leer
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
