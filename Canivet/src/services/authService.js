import { ROLES, normalizeRole } from '../constants/access'
import { supabase } from './supabase'

const TOKEN_KEY = 'canivet_access_token'
let memoryToken = null

const normalizeEmail = (value = '') => String(value).trim().toLowerCase()
const configuredAdminEmails = Array.from(new Set(
  [
    import.meta.env.VITE_ADMIN_EMAIL,
    import.meta.env.VITE_ADMIN_EMAILS,
  ]
    .flatMap(value => String(value || '').split(','))
    .map(normalizeEmail)
    .filter(Boolean),
))

const safeStorage = (storage) => ({
  get: () => {
    try { return storage.getItem(TOKEN_KEY) } catch { return null }
  },
  set: (token) => {
    try { storage.setItem(TOKEN_KEY, token) } catch { /* ignore */ }
  },
  remove: () => {
    try { storage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
  },
})

const safeLocal = safeStorage(localStorage)
const safeSession = safeStorage(sessionStorage)

const saveToken = (token) => {
  memoryToken = token || null
  if (token) {
    safeLocal.set(token)
    safeSession.set(token)
    return
  }
  safeLocal.remove()
  safeSession.remove()
}

const isConfiguredAdminEmail = (email) => configuredAdminEmails.includes(normalizeEmail(email))

const resolveStoredRole = (profile, user, fallback = ROLES.CLIENTE) => {
  const explicitRole = normalizeRole(
    profile?.rol || user?.app_metadata?.role || user?.user_metadata?.role,
    null,
  )
  if (explicitRole) return explicitRole
  if (isConfiguredAdminEmail(profile?.email || user?.email)) return ROLES.ADMIN
  return fallback
}

const normalizeProfile = (profile, user) => {
  if (!profile && !user) return null
  return {
    id: profile?.id || user?.id || null,
    nombre: profile?.nombre || user?.user_metadata?.nombre || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario',
    email: profile?.email || user?.email || null,
    rol: resolveStoredRole(profile, user),
    estado: profile?.estado || 'activo',
    sucursal_ids: Array.isArray(profile?.sucursal_ids) ? profile.sucursal_ids : [],
  }
}

const normalizeSession = (session, profile = null) => {
  if (!session?.access_token) return null
  const role = resolveStoredRole(profile, session.user)
  const nextProfile = normalizeProfile(profile, session.user)

  return {
    ...session,
    user: {
      ...session.user,
      role,
      profile: nextProfile,
    },
    profile: nextProfile,
  }
}

const syncTokenFromSession = (session) => {
  saveToken(session?.access_token || null)
  return session
}

const loadProfile = async (userId) => {
  if (!userId) return null
  const { data, error } = await supabase.from('perfiles').select('*').eq('id', userId).maybeSingle()
  if (error) return null
  return data || null
}

const buildProfilePayload = (user, profile = null) => {
  if (!user?.id) return null
  const resolvedRole = resolveStoredRole(profile, user)
  const payload = {
    id: user.id,
    nombre: profile?.nombre || user.user_metadata?.nombre || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
    email: user.email,
    rol: resolvedRole,
    estado: profile?.estado || 'activo',
    sucursal_ids: resolvedRole === ROLES.ADMIN
      ? []
      : (Array.isArray(profile?.sucursal_ids) ? profile.sucursal_ids : []),
  }
  return payload
}

const ensureProfile = async (user, profile = null) => {
  const payload = buildProfilePayload(user, profile)
  if (!payload) return profile

  const hasSameRole = normalizeRole(profile?.rol, null) === payload.rol
  const hasSameEmail = normalizeEmail(profile?.email) === normalizeEmail(payload.email)
  const hasSameName = String(profile?.nombre || '').trim() === String(payload.nombre || '').trim()
  const hasValidStatus = ['activo', 'inactivo'].includes(String(profile?.estado || '').trim().toLowerCase())
  const hasBranches = Array.isArray(profile?.sucursal_ids)

  if (profile && hasSameRole && hasSameEmail && hasSameName && hasValidStatus && hasBranches) {
    return profile
  }

  const { data, error } = await supabase.from('perfiles').upsert(payload).select('*').maybeSingle()
  if (error) return profile
  return data || payload
}

export const authService = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { data: { session: null }, error }

    let profile = await loadProfile(data.session?.user?.id)
    profile = await ensureProfile(data.session?.user, profile)
    const session = syncTokenFromSession(normalizeSession(data.session, profile))
    return { data: { session }, error: null }
  },

  register: async (email, password, metadata = {}) => {
    const requestedRole = normalizeRole(metadata.role, null)
    const role = requestedRole || (isConfiguredAdminEmail(email) ? ROLES.ADMIN : ROLES.CLIENTE)
    const options = {
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        nombre: metadata.nombre || metadata.name || '',
        role,
      },
    }
    const { data: sbData, error } = await supabase.auth.signUp({ email, password, options })
    if (error) return { data: { session: null }, error }

    // When email confirmation is enabled, Supabase may create the user without issuing
    // a session yet. In that state the anon client cannot safely upsert `perfiles`.
    if (!sbData.session?.access_token) {
      return {
        data: {
          session: null,
          pendingConfirmation: true,
          user: sbData.user || null,
        },
        error: null,
      }
    }

    let profile = await loadProfile(sbData.user?.id)
    profile = await ensureProfile(sbData.user, profile)
    const session = syncTokenFromSession(normalizeSession(sbData.session, profile))
    return { data: { session, pendingConfirmation: false, user: sbData.user || null }, error: null }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut()
    saveToken(null)
    return { error }
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) return { data: { session: null }, error }

    let profile = await loadProfile(data.session?.user?.id)
    profile = await ensureProfile(data.session?.user, profile)
    const session = syncTokenFromSession(normalizeSession(data.session, profile))
    return { data: { session }, error: null }
  },

  refreshProfile: async (userId) => {
    const profile = await loadProfile(userId)
    return normalizeProfile(profile, null)
  },

  forgotPassword: async (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    }),

  updatePassword: async (password) =>
    supabase.auth.updateUser({ password }),

  getToken: () => memoryToken || safeLocal.get() || safeSession.get(),

  onAuthChange: (callback) => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      queueMicrotask(async () => {
        let profile = await loadProfile(session?.user?.id)
        profile = await ensureProfile(session?.user, profile)
        callback(event, syncTokenFromSession(normalizeSession(session, profile)))
      })
    })
    return { data }
  },
}
