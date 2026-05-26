import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ROLES, isConfiguredAdminEmail, isStaffRole, normalizeRole } from '../constants/access'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const applySession = (nextSession) => {
      if (!mounted) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setProfile(nextSession?.profile ?? nextSession?.user?.profile ?? null)
      setLoading(false)
    }

    authService.getSession()
      .then(({ data: { session: currentSession } }) => {
        applySession(currentSession)
      })
      .catch(() => {
        applySession(null)
      })

    const { data: { subscription } } = authService.onAuthChange(async (event, nextSession) => {
      if (!nextSession && event !== 'SIGNED_OUT') {
        try {
          const { data: { session: recoveredSession } } = await authService.getSession()
          applySession(recoveredSession)
          return
        } catch {
          // If recovery fails, fall through and clear the session.
        }
      }

      applySession(nextSession)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => {
    const explicitRole = normalizeRole(
      profile?.rol || user?.role || user?.app_metadata?.role || user?.user_metadata?.role,
      null,
    )
    const role = explicitRole || (isConfiguredAdminEmail(profile?.email || user?.email) ? ROLES.ADMIN : ROLES.CLIENTE)
    const nombreUsuario = profile?.nombre || user?.email?.split('@')[0] || 'Usuario'

    return {
      session,
      user,
      profile,
      loading,
      login: authService.login,
      register: authService.register,
      logout: authService.logout,
      forgotPassword: authService.forgotPassword,
      updatePassword: authService.updatePassword,
      refreshProfile: async () => {
        const nextProfile = await authService.refreshProfile(user?.id)
        setProfile(nextProfile)
        return nextProfile
      },
      getToken: () => authService.getToken(),
      isAuthenticated: Boolean(user),
      isAdmin: role === ROLES.ADMIN,
      isStaff: isStaffRole(role),
      rol: role,
      sucursal: profile?.sucursal_ids?.[0] || null,
      nombreUsuario,
    }
  }, [loading, profile, session, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
