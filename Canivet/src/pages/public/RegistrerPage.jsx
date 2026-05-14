import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const css = `
.reg-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 20px; }
.reg-box  { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 40px; width: 100%; max-width: 440px; }
.reg-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
.reg-logo-ic { width: 36px; height: 36px; background: var(--primary); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.reg-logo strong { font-size: 18px; font-weight: 800; }
.reg-box h2  { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
.reg-box p   { color: #64748b; font-size: 14px; margin-bottom: 24px; }
.reg-btn {
  width: 100%; padding: 12px; background: var(--primary); color: #fff;
  border: none; border-radius: 9px; font-size: 14px; font-weight: 600;
  cursor: pointer; margin-top: 4px;
}
.reg-btn:hover { background: var(--primary-dark); }
.reg-footer { margin-top: 20px; text-align: center; font-size: 13px; color: #64748b; }
.reg-footer a { color: var(--primary); font-weight: 600; cursor: pointer; }
.reg-success { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; text-align: center; }
.reg-success h3 { font-size: 16px; font-weight: 700; color: #15803d; margin-bottom: 6px; }
.reg-success p  { font-size: 13px; color: #166534; }
`

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [authErr, setAuthErr] = useState('')

  const validate = () => {
    const nextErrors = {}
    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es requerido'
    if (!form.email) nextErrors.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Email inválido'
    if (!form.password) nextErrors.password = 'La contraseña es requerida'
    else if (form.password.length < 6) nextErrors.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirm) nextErrors.confirm = 'Las contraseñas no coinciden'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    setAuthErr('')
    if (!validate()) return
    setLoading(true)
    const { error } = await register(form.email, form.password, {
      nombre: form.nombre,
      role: 'user',
    })
    setLoading(false)
    if (error) {
      setAuthErr(error.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <>
        <style>{css}</style>
        <div className="reg-wrap">
          <div className="reg-box">
            <div className="reg-success">
              <h3>Cuenta creada</h3>
              <p>Revisa tu email para confirmar tu cuenta y luego inicia sesión.</p>
            </div>
            <div className="reg-footer" style={{ marginTop: 16 }}>
              <a onClick={() => navigate('/login')}>Ir al inicio de sesión</a>
            </div>
          </div>
        </div>
      </>
    )
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
          <p>Completa el formulario para registrarte</p>
          {authErr && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
              Error: {authErr}
            </div>
          )}
          {[
            { label: 'Nombre completo', key: 'nombre', type: 'text', ph: 'Juan Perez' },
            { label: 'Correo electrónico', key: 'email', type: 'email', ph: 'tu@email.com' },
            { label: 'Contraseña', key: 'password', type: 'password', ph: '********' },
            { label: 'Confirmar contraseña', key: 'confirm', type: 'password', ph: '********' },
          ].map((field) => (
            <div className="form-group" key={field.key}>
              <label className="form-label">{field.label}</label>
              <input
                className="form-input"
                type={field.type}
                placeholder={field.ph}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              />
              {errors[field.key] && <p className="form-error">{errors[field.key]}</p>}
            </div>
          ))}
          <button className="reg-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
          <div className="reg-footer">
            ¿Ya tienes cuenta? <a onClick={() => navigate('/login')}>Inicia sesión</a>
          </div>
        </div>
      </div>
    </>
  )
}
