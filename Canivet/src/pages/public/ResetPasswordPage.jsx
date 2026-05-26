import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const css = `
.reset-wrap { min-height: 100vh; display: grid; place-items: center; background: #f8fafc; padding: 24px; }
.reset-card { width: 100%; max-width: 440px; background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 32px; }
.reset-card h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
.reset-card p { color: #64748b; font-size: 14px; margin-bottom: 20px; }
.reset-note { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; border-radius: 10px; padding: 12px 14px; font-size: 13px; margin-bottom: 18px; }
.reset-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 10px; padding: 12px 14px; font-size: 13px; margin-bottom: 18px; }
.reset-ok { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; border-radius: 10px; padding: 12px 14px; font-size: 13px; margin-bottom: 18px; }
.reset-btn { width: 100%; padding: 12px; background: #1d4ed8; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
.reset-btn:disabled { opacity: .65; cursor: not-allowed; }
`

export const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!password || password.length < 6) {
      setError('La nueva contrasena debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contrasenas no coinciden.')
      return
    }

    setLoading(true)
    const { error: updateError } = await updatePassword(password)
    setLoading(false)

    if (updateError) {
      setError(updateError.message || 'No se pudo actualizar la contrasena.')
      return
    }

    setSuccess('Contrasena actualizada. Ya puedes iniciar sesion con la nueva clave.')
    setTimeout(() => navigate('/login'), 1000)
  }

  return (
    <>
      <style>{css}</style>
      <div className="reset-wrap">
        <div className="reset-card">
          <h1>Nueva contrasena</h1>
          <p>Define una nueva clave para tu cuenta de CaniVet.</p>
          <div className="reset-note">Abre esta pagina desde el enlace que llega por correo para completar la recuperacion.</div>
          {error && <div className="reset-error">{error}</div>}
          {success && <div className="reset-ok">{success}</div>}
          <div className="form-group">
            <label className="form-label">Nueva contrasena</label>
            <input className="form-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmar contrasena</label>
            <input className="form-input" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
          </div>
          <button className="reset-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Actualizando...' : 'Guardar nueva contrasena'}
          </button>
        </div>
      </div>
    </>
  )
}
