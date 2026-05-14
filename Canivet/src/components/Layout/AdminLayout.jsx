import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sidebar }            from './Sidebar'
import { Topbar }             from './Topbar'
import { DashboardPage }       from '../../pages/admin/Dashboard'
import { ClientesPage }        from '../../pages/admin/Clients'
import { MascotasPage }        from '../../pages/admin/Pets'
import { CitasPage }           from '../../pages/admin/Appointments'
import { ServiciosPage }       from '../../pages/admin/Services'
import { PagosPage }           from '../../pages/admin/Payments'
import { InventarioPage }      from '../../pages/admin/Inventory'
import { ReportesPage }        from '../../pages/admin/Reports'
import { ConfiguracionPage }   from '../../pages/admin/Settings'
import { SuscripcionesPage }   from '../../pages/admin/Subscriptions'
import { GuarderiaPage }       from '../../pages/admin/Daycare'
import { PaseosPage }          from '../../pages/admin/Walks'
import { AuditoriaPage }       from '../../pages/admin/Audit'
import { useAppConfig }        from '../../context/AppConfigContext'

const PAGES = {
  dashboard:     DashboardPage,
  clients:       ClientesPage,
  pets:          MascotasPage,
  appointments:  CitasPage,
  services:      ServiciosPage,
  payments:      PagosPage,
  inventory:     InventarioPage,
  reports:       ReportesPage,
  settings:      ConfiguracionPage,
  subscriptions: SuscripcionesPage,
  daycare:       GuarderiaPage,
  walks:         PaseosPage,
  audit:         AuditoriaPage,
}

const overlayStyle = {
  display: 'none',
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.5)',
  zIndex: 299,
}

export const AdminLayout = () => {
  const { accessiblePages, canAccess } = useAppConfig()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const urlPage = location.pathname.replace(/^\/admin\/?/, '') || 'dashboard'

  // Cierra el sidebar al cambiar de página en móvil
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Cierra al redimensionar a desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setSidebarOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const firstAccessiblePage = useMemo(
    () => accessiblePages.find(pageId => PAGES[pageId]) || 'dashboard',
    [accessiblePages],
  )

  const page = PAGES[urlPage] && canAccess(urlPage) ? urlPage : firstAccessiblePage
  const PageComponent = PAGES[page] || DashboardPage

  const handleNavigate = (pageId) => {
    navigate(pageId === 'dashboard' ? '/admin' : `/admin/${pageId}`)
  }

  return (
    <div className="admin-shell">
      {/* Overlay oscuro en móvil cuando el sidebar está abierto */}
      <div
        className="sb-overlay"
        style={{ ...overlayStyle, display: sidebarOpen ? 'block' : 'none' }}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        active={page}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Topbar
        page={page}
        onMenuClick={() => setSidebarOpen(prev => !prev)}
      />

      <main className="main-content">
        <PageComponent />
      </main>
    </div>
  )
}
