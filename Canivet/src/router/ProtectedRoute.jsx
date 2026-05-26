import { Navigate } from 'react-router-dom'
import { useAuth }  from '../context/AuthContext'
import { isConfiguredAdminEmail } from '../constants/access'

export const ProtectedRoute = ({ children, allowedRoles = null, redirectTo = '/login' }) => {
  const { user, rol, loading } = useAuth()
  const canBypassRoleCheck = isConfiguredAdminEmail(user?.email)

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

  if (!user) return <Navigate to={redirectTo} replace />
  if (Array.isArray(allowedRoles) && allowedRoles.length && !allowedRoles.includes(rol) && !canBypassRoleCheck) {
    return <Navigate to="/servicios" replace />
  }

  return children
}
