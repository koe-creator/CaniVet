import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isStaffRole } from '../../constants/access'
import { useAuth } from '../../context/AuthContext'
import { sanitizeAppRedirect } from '../../utils/navigation'

const css = `
.reg-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 20px; }
.reg-box { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 40px; width: 100%; max-width: 460px; }
.reg-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
.reg-logo-ic { width: 36px; height: 36px; background: var(--primary); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.reg-logo strong { font-size: 18px; font-weight: 800; }
.reg-box h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
.reg-box p { color: #64748b; font-size: 14px; margin-bottom: 24px; }
.reg-btn {
  width: 100%; padding: 12px; background: var(--primary); color: #fff;
  border: none; border-radius: 9px; font-size: 14px; font-weight: 600;
  cursor: pointer; margin-top: 4px; display:flex; align-items:center; justify-content:center; gap:8px;
}
.reg-btn:hover { background: var(--primary-dark); }
.reg-btn-label { display:inline-flex; align-items:center; gap:8px; }
.reg-spinner {
  width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff; border-radius: 50%;
  animation: reg-spin .7s linear infinite;
}
.reg-spinner.hidden { visibility:hidden; width:0; border-width:0; }
.reg-btn:disabled { opacity:.6; cursor:not-allowed; }
@keyframes reg-spin { to { transform: rotate(360deg); } }
.reg-footer { margin-top: 20px; text-align: center; font-size: 13px; color: #64748b; }
.reg-footer button { color: var(--primary); font-weight: 600; cursor: pointer; background: none; border: none; padding: 0; font: inherit; }
.reg-msg { border-radius: 10px; padding: 12px 14px; font-size: 13px; margin-bottom: 16px; }
.reg-msg.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
.reg-msg.ok { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
`

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return sanitizeAppRedirect(params.get('next'), '/servicios')
  }, [location.search])

  const validate = () => {
    const nextErrors = {}
    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es requerido'
    if (!form.email) nextErrors.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Email invalido'
    if (!form.password) nextErrors.password = 'La contrasena es requerida'
    else if (form.password.length < 6) nextErrors.password = 'Minimo 6 caracteres'
    if (form.password !== form.confirm) nextErrors.confirm = 'Las contrasenas no coinciden'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' })
    if (!validate()) return

    setLoading(true)
    const { data: { session, pendingConfirmation }, error } = await register(form.email, form.password, {
      nombre: form.nombre,
      role: 'cliente',
    })
    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message || 'No se pudo crear la cuenta.' })
      return
    }

    if (session?.user) {
      const role = session?.profile?.rol || session?.user?.role || 'cliente'
      setMessage({ type: 'ok', text: 'Cuenta creada correctamente. Redirigiendo...' })
      setTimeout(() => navigate(isStaffRole(role) ? '/admin' : redirectTo, { replace: true }), 700)
      return
    }

    setMessage({
      type: 'ok',
      text: pendingConfirmation
        ? 'Cuenta creada. Revisa tu correo y confirma el email antes de iniciar sesion.'
        : 'Cuenta creada. Redirigiendo al inicio...',
    })
    setTimeout(() => navigate('/', { replace: true }), 1200)
  }

  return (
    <>
      <style>{css}</style>
      <div className="reg-wrap">
        <div className="reg-box">
          <div className="reg-logo">
            <div className="reg-logo-ic">CV</div>
            <strong>CaniVet</strong>
          </div>
          <h2>Crear cuenta</h2>
          <p>Necesitas una cuenta para realizar reservas y dar seguimiento a tus solicitudes.</p>
          {message.text && <div className={`reg-msg ${message.type === 'error' ? 'error' : 'ok'}`}>{message.text}</div>}
          {[
            { label: 'Nombre completo', key: 'nombre', type: 'text' },
            { label: 'Correo electronico', key: 'email', type: 'email' },
            { label: 'Contrasena', key: 'password', type: 'password' },
            { label: 'Confirmar contrasena', key: 'confirm', type: 'password' },
          ].map((field) => (
            <div className="form-group" key={field.key}>
              <label className="form-label">{field.label}</label>
              <input className="form-input" type={field.type} value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} />
              {errors[field.key] && <p className="form-error">{errors[field.key]}</p>}
            </div>
          ))}
          <button className="reg-btn notranslate" translate="no" onClick={handleSubmit} disabled={loading}>
            <span className="reg-btn-label">
              <div className={`reg-spinner ${loading ? '' : 'hidden'}`} />
              <span>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</span>
            </span>
          </button>
          <div className="reg-footer">
            Ya tienes cuenta. <button type="button" onClick={() => navigate(`/login?next=${encodeURIComponent(redirectTo)}`)}>Inicia sesion</button>
          </div>
        </div>
      </div>
    </>
  )
}
