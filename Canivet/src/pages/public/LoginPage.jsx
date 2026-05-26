import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROLES, isStaffRole } from '../../constants/access'
import { useAuth } from '../../context/AuthContext'
import { sanitizeAppRedirect } from '../../utils/navigation'

const css = `
.login-wrap { min-height: 100vh; display: flex; background: #fff; }
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%);
  display: flex; flex-direction: column; justify-content: center;
  align-items: center; padding: 60px; position: relative; overflow: hidden;
}
.login-brand { text-align: center; color: #fff; }
.login-brand-ic {
  width: 76px; height: 76px; background: rgba(255,255,255,.1);
  border: 2px solid rgba(255,255,255,.18); border-radius: 22px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px; font-size: 32px;
}
.login-brand h1 { font-size: 40px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
.login-brand p { font-size: 15px; color: rgba(255,255,255,.6); }
.login-right {
  width: 460px; display: flex; flex-direction: column;
  justify-content: center; padding: 60px 52px;
}
.login-right h2 { font-size: 26px; font-weight: 800; margin-bottom: 6px; }
.login-sub { color: #64748b; font-size: 14px; margin-bottom: 28px; }
.login-msg {
  border-radius: 9px; padding: 11px 14px; margin-bottom: 18px; font-size: 13px; font-weight: 500;
}
.login-msg.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
.login-msg.ok { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }
.login-actions { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-top: 12px; }
.login-link { background: none; border: none; color: #1d4ed8; cursor: pointer; font-weight: 700; padding: 0; }
.login-btn {
  width: 100%; padding: 13px; background: var(--primary); color: #fff;
  border: none; border-radius: 9px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: background .15s; display: flex;
  align-items: center; justify-content: center; gap: 8px;
}
.login-btn:hover { background: var(--primary-dark); }
.login-btn:disabled { opacity: .6; cursor: not-allowed; }
.login-btn-label { display: inline-flex; align-items: center; gap: 8px; }
.spinner {
  width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff; border-radius: 50%;
  animation: spin .7s linear infinite;
}
.spinner.hidden { visibility: hidden; width: 0; border-width: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 768px) { .login-left { display: none; } .login-right { width: 100%; padding: 40px 28px; } }
`

export const LoginPage = () => {
  const { login, forgotPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return sanitizeAppRedirect(params.get('next'), '/servicios')
  }, [location.search])

  const validate = () => {
    const nextErrors = {}
    if (!email) nextErrors.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(email)) nextErrors.email = 'Email invalido'
    if (!password) nextErrors.password = 'La contrasena es requerida'
    else if (password.length < 6) nextErrors.password = 'Minimo 6 caracteres'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' })
    if (!validate()) return

    setLoading(true)
    const { data: { session }, error } = await login(email, password)
    setLoading(false)

    if (error) {
      const rawMessage = String(error.message || '')
      const friendlyMessage = /invalid login credentials/i.test(rawMessage)
        ? 'No se pudo iniciar sesion. Si acabas de registrarte, confirma tu correo primero si Supabase tiene la confirmacion por email activa.'
        : (error.message || 'No se pudo iniciar sesion.')
      setMessage({ type: 'error', text: friendlyMessage })
      return
    }

    const role = session?.profile?.rol || session?.user?.role || ROLES.CLIENTE
    navigate(isStaffRole(role) ? '/admin' : redirectTo, { replace: true })
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Escribe tu email primero para enviarte el enlace de recuperacion.' })
      return
    }

    const { error } = await forgotPassword(email)
    if (error) {
      setMessage({ type: 'error', text: error.message || 'No se pudo enviar el enlace de recuperacion.' })
      return
    }
    setMessage({ type: 'ok', text: 'Te enviamos un enlace para restablecer la contrasena.' })
  }

  return (
    <>
      <style>{css}</style>
      <div className="login-wrap">
        <div className="login-left">
          <div className="login-brand">
            <div className="login-brand-ic">CV</div>
            <h1>CaniVet</h1>
            <p>Accede para gestionar o reservar servicios de forma segura.</p>
          </div>
        </div>
        <div className="login-right">
          <h2>Iniciar sesion</h2>
          <p className="login-sub">Tu cuenta es obligatoria para reservar y para entrar al panel.</p>
          {message.text && <div className={`login-msg ${message.type === 'error' ? 'error' : 'ok'}`}>{message.text}</div>}
          <div className="form-group">
            <label className="form-label">Correo electronico</label>
            <input className="form-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleSubmit()} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Contrasena</label>
            <input className="form-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleSubmit()} />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <button className="login-btn notranslate" translate="no" onClick={handleSubmit} disabled={loading}>
            <span className="login-btn-label">
              <div className={`spinner ${loading ? '' : 'hidden'}`} />
              <span>{loading ? 'Entrando...' : 'Entrar'}</span>
            </span>
          </button>
          <div className="login-actions">
            <button className="login-link" onClick={handleForgotPassword}>Olvide mi contrasena</button>
            <button className="login-link" onClick={() => navigate(`/registro?next=${encodeURIComponent(redirectTo)}`)}>Crear cuenta</button>
          </div>
        </div>
      </div>
    </>
  )
}
