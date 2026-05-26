import { Navigate, useLocation } from 'react-router-dom'
import { useAuth }  from '../context/AuthContext'
import { sanitizeAppRedirect } from '../utils/navigation'

export const ProtectedRoute = ({ children, allowedRoles = null, redirectTo = '/login' }) => {
  const location = useLocation()
  const { user, rol, loading } = useAuth()
  const nextPath = sanitizeAppRedirect(
    `${location.pathname || ''}${location.search || ''}${location.hash || ''}`,
    '/servicios',
  )
  const loginPath = `${sanitizeAppRedirect(redirectTo, '/login')}?next=${encodeURIComponent(nextPath)}`

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid #e2e8f0',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin .7s linear infinite'
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!user) return <Navigate to={loginPath} replace />
  if (Array.isArray(allowedRoles) && allowedRoles.length && !allowedRoles.includes(rol)) {
    return <Navigate to="/servicios" replace />
  }

  return children
}
