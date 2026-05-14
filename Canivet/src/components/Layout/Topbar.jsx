import { useAuth } from '../../context/AuthContext'
import { useAppConfig } from '../../context/AppConfigContext'
import { getInitials } from '../../utils/formatters'

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  clients:      'Clientes',
  pets:         'Mascotas',
  appointments: 'Citas',
  services:     'Servicios',
  payments:     'Pagos',
  inventory:    'Inventario',
  reports:      'Reportes',
  settings:     'Configuración',
  subscriptions:'Suscripciones',
  daycare:      'Guardería',
  walks:        'Paseos',
  audit:        'Auditoría',
}

const css = `
.topbar {
  position: fixed; top: 0; left: var(--sidebar-width); right: 0;
  height: var(--header-height); background: var(--card);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 28px; gap: 14px; z-index: 90;
}
.tb-title { font-size: 15px; font-weight: 700; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tb-date  {
  font-size: 12px; color: var(--text-muted); background: var(--bg);
  padding: 5px 12px; border-radius: 7px; border: 1px solid var(--border);
  white-space: nowrap;
}
.tb-user  {
  display: flex; align-items: center; gap: 9px;
  padding: 5px 10px; background: var(--bg); border-radius: 8px;
}
.tb-av {
  width: 28px; height: 28px; border-radius: 7px; background: var(--primary);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 11px; flex-shrink: 0;
}
.tb-name { font-size: 12px; font-weight: 600; }
.tb-role {
  font-size: 11px; font-weight: 700; color: var(--primary);
  background: var(--primary-light); border-radius: 999px; padding: 4px 8px;
  white-space: nowrap;
}
.tb-branch {
  min-width: 180px; max-width: 220px; padding: 7px 10px; border: 1px solid var(--border);
  border-radius: 8px; background: #fff; color: var(--text); font-size: 12px;
}

/* Hamburger — solo visible en móvil */
.tb-hamburger {
  display: none;
  background: none; border: none; cursor: pointer;
  padding: 6px; border-radius: 8px; color: var(--text);
  flex-direction: column; gap: 4px; flex-shrink: 0;
}
.tb-hamburger span {
  display: block; width: 20px; height: 2px;
  background: currentColor; border-radius: 2px;
  transition: all .2s;
}

@media (max-width: 768px) {
  .topbar { left: 0; padding: 0 14px; gap: 10px; }
  .tb-hamburger { display: flex; }
  .tb-date, .tb-branch { display: none; }
  .tb-name { display: none; }
  .tb-role { display: none; }
}
`

export const Topbar = ({ page, onMenuClick }) => {
  const { user } = useAuth()
  const { branches, activeBranchId, setActiveBranch, currentRole, currentRoleLabel } = useAppConfig()
  const email = user?.email || ''
  const name  = email.split('@')[0]
  const today = new Date().toLocaleDateString('es-DO', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <>
      <style>{css}</style>
      <header className="topbar">
        {/* Botón hamburguesa — solo en móvil */}
        <button className="tb-hamburger" onClick={onMenuClick} aria-label="Abrir menú">
          <span /><span /><span />
        </button>

        <div className="tb-title">{PAGE_TITLES[page] || 'CaniVet'}</div>

        <select
          className="tb-branch"
          value={activeBranchId}
          onChange={e => setActiveBranch(e.target.value)}
        >
          {currentRole === 'admin' && <option value="all">Todas las sucursales</option>}
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>{branch.name}</option>
          ))}
        </select>

        <span className="tb-date">{today}</span>
        <span className="tb-role">{currentRoleLabel}</span>

        <div className="tb-user">
          <div className="tb-av">{getInitials(name)}</div>
          <span className="tb-name">{name}</span>
        </div>
      </header>
    </>
  )
}
