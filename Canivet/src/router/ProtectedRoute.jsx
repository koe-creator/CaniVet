import { Navigate } from 'react-router-dom'
import { useAuth }  from '../context/AuthContext'

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

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

  return user ? children : <Navigate to="/login" replace />
}
