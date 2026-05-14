import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppConfig } from '../../context/AppConfigContext'

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
.login-brand p  { font-size: 15px; color: rgba(255,255,255,.55); }
.login-pills { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 32px; }
.login-pill {
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
  border-radius: 100px; padding: 6px 14px; color: rgba(255,255,255,.65);
  font-size: 12px; display: flex; align-items: center; gap: 6px;
}
.login-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; }
.login-right {
  width: 460px; display: flex; flex-direction: column;
  justify-content: center; padding: 60px 52px;
}
.login-right h2  { font-size: 26px; font-weight: 800; margin-bottom: 6px; }
.login-sub  { color: #64748b; font-size: 14px; margin-bottom: 28px; }
.login-err  {
  background: #fef2f2; border: 1px solid #fecaca; border-radius: 9px;
  padding: 11px 14px; margin-bottom: 18px; font-size: 13px; color: #dc2626; font-weight: 500;
}
.login-btn {
  width: 100%; padding: 13px; background: var(--primary); color: #fff;
  border: none; border-radius: 9px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: background .15s; display: flex;
  align-items: center; justify-content: center; gap: 8px;
}
.login-btn:hover   { background: var(--primary-dark); }
.login-btn:disabled { opacity: .6; cursor: not-allowed; }
.pw-wrap { position: relative; }
.pw-toggle {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 14px;
}
.spinner {
  width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff; border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 768px) { .login-left { display: none; } .login-right { width: 100%; padding: 40px 28px; } }
`

export const LoginPage = () => {
  const { login } = useAuth()
  const { resolveRoleForEmail } = useAppConfig()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [authErr, setAuthErr] = useState('')
  const [storageWarn, setStorageWarn] = useState('')

  const validate = () => {
    const nextErrors = {}
    if (!email) nextErrors.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(email)) nextErrors.email = 'Email invalido'
    if (!password) nextErrors.password = 'La contrasena es requerida'
    else if (password.length < 6) nextErrors.password = 'Minimo 6 caracteres'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const getRoleFromSession = (session) => {
    const user = session?.user
    return user?.role || user?.user_metadata?.role || user?.app_metadata?.role || null
  }

  const getLoginErrorMessage = (error) => {
    const detail = error?.data?.detail
    const apiError = error?.data?.error

    if (detail?.error_description) return detail.error_description
    if (detail?.msg) return detail.msg
    if (typeof apiError === 'string' && apiError.trim()) return apiError
    if (typeof error?.message === 'string' && error.message.trim()) return error.message
    return 'No se pudo iniciar sesion.'
  }

  const handleSubmit = async () => {
    setAuthErr('')
    if (!validate()) return
    setLoading(true)
    const { data: { session }, error } = await login(email, password)
    setLoading(false)
    if (error) {
      setAuthErr(getLoginErrorMessage(error))
      return
    }

    try {
      const key = '__canivet_storage_test__'
      localStorage.setItem(key, '1')
      localStorage.removeItem(key)
      sessionStorage.setItem(key, '1')
      sessionStorage.removeItem(key)
      setStorageWarn('')
    } catch {
      setStorageWarn('Tu navegador bloquea el almacenamiento. La sesion funcionara solo en esta pestana.')
    }

    const role = resolveRoleForEmail(email, getRoleFromSession(session) || 'user')
    if (role === 'admin' || role === 'user') {
      navigate('/admin')
      return
    }
    navigate('/admin')
  }

  return (
    <>
      <style>{css}</style>
      <div className="login-wrap">
        <div className="login-left">
          <div className="login-brand">
            <div className="login-brand-ic">CV</div>
            <h1>CaniVet</h1>
            <p>Plataforma de gestion veterinaria</p>
            <div className="login-pills">
              {['Clientes', 'Mascotas', 'Citas', 'Inventario', 'Reportes'].map((item) => (
                <div className="login-pill" key={item}><div className="login-pill-dot" />{item}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="login-right">
          <h2>Bienvenido de vuelta</h2>
          <p className="login-sub">Inicia sesion en tu panel veterinario</p>
          {authErr && <div className="login-err">Error: {authErr}</div>}
          {storageWarn && <div className="login-err">Aviso: {storageWarn}</div>}
          <div className="form-group">
            <label className="form-label">Correo electronico</label>
            <input
              className="form-input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Contrasena</label>
            <div className="pw-wrap">
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                style={{ paddingRight: 44 }}
              />
              <button className="pw-toggle" onClick={() => setShowPw((value) => !value)}>
                {showPw ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <button className="login-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <><div className="spinner" />Verificando...</> : 'Ingresar al sistema'}
          </button>
        </div>
      </div>
    </>
  )
}
