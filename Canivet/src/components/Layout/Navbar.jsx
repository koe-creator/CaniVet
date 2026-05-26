import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const css = `
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: #fff; border-bottom: 1px solid var(--border);
  height: 64px; display: flex; align-items: center;
  padding: 0 40px; gap: 32px;
}
.nav-brand {
  display: flex; align-items: center; gap: 10px;
  font-size: 18px; font-weight: 800; color: var(--text); cursor: pointer;
}
.nav-brand-icon {
  width: 32px; height: 32px; background: var(--primary);
  border-radius: 8px; display: flex; align-items: center;
  justify-content: center; font-size: 16px;
}
.nav-links { display: flex; gap: 6px; flex: 1; }
.nav-link {
  padding: 7px 14px; border-radius: 7px; font-size: 14px;
  font-weight: 500; color: var(--text-muted); cursor: pointer;
  border: none; background: none; transition: all .15s;
}
.nav-link:hover { background: var(--bg); color: var(--text); }
.nav-actions { display: flex; gap: 8px; align-items: center; }
.nav-session {
  padding: 7px 12px; border-radius: 999px; background: #eff6ff;
  color: #1d4ed8; font-size: 12px; font-weight: 700;
}
.btn-login, .btn-register {
  padding: 7px 16px; border: 1.5px solid var(--border); border-radius: 8px;
  font-size: 13px; font-weight: 600; background: none; cursor: pointer;
  color: var(--text); transition: all .15s;
}
.btn-register { background: #1d4ed8; border-color: #1d4ed8; color: #fff; }
.btn-login:hover { border-color: var(--primary); color: var(--primary); }
.btn-register:hover { background: #1e40af; border-color: #1e40af; }
`

export const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isStaff, nombreUsuario, logout } = useAuth()

  return (
    <>
      <style>{css}</style>
      <header className="navbar">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <div className="nav-brand-icon">CV</div>
          CaniVet
        </div>
        <nav className="nav-links">
          <button className="nav-link" onClick={() => navigate('/')}>Inicio</button>
          <button className="nav-link" onClick={() => navigate('/servicios')}>Servicios</button>
          <button className="nav-link" onClick={() => navigate('/contacto')}>Contacto</button>
        </nav>
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="nav-session">{nombreUsuario}</span>
              {isStaff && <button className="btn-login" onClick={() => navigate('/admin')}>Panel</button>}
              <button className="btn-login" onClick={() => logout()}>Cerrar sesion</button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate('/login')}>Iniciar sesion</button>
              <button className="btn-register" onClick={() => navigate('/registro')}>Registrarte</button>
            </>
          )}
        </div>
      </header>
    </>
  )
}
