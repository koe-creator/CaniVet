import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = authService.onAuthChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const login    = (email, password) => authService.login(email, password)
  const register = (email, password, data = {}) => authService.register(email, password, data)
  const logout   = () => authService.logout()

  const isAdmin       = user?.role === 'admin'
  const rol           = user?.role || null
  const sucursal      = null
  const nombreUsuario = user?.email?.split('@')[0] || 'Usuario'

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, logout,
      isAdmin, rol, sucursal, nombreUsuario,
      getToken: () => authService.getToken(),
    }}>
      {children}
    </AuthContext.Provider>
  )
}
