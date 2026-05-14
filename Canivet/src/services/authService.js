import { supabase } from './supabase'

const TOKEN_KEY = 'canivet_access_token'
let memoryToken = null

const safeLocal = {
  get: () => {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  },
  set: (token) => {
    try { localStorage.setItem(TOKEN_KEY, token) } catch { /* ignore */ }
  },
  remove: () => {
    try { localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
  },
}

const safeSession = {
  get: () => {
    try { return sessionStorage.getItem(TOKEN_KEY) } catch { return null }
  },
  set: (token) => {
    try { sessionStorage.setItem(TOKEN_KEY, token) } catch { /* ignore */ }
  },
  remove: () => {
    try { sessionStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
  },
}

const saveToken = (token) => {
  memoryToken = token || null
  if (token) {
    safeLocal.set(token)
    safeSession.set(token)
  } else {
    safeLocal.remove()
    safeSession.remove()
  }
}

const parseJwt = (token) => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

const normalizeSession = (session) => {
  if (!session?.access_token) return null
  const payload = parseJwt(session.access_token)
  const role = payload?.app_metadata?.role || payload?.user_metadata?.role || payload?.role || session.user?.app_metadata?.role || session.user?.user_metadata?.role || null

  return {
    ...session,
    user: {
      ...session.user,
      id: session.user?.id || payload?.sub || null,
      email: session.user?.email || payload?.email || null,
      role,
    },
  }
}

const syncTokenFromSession = (session) => {
  saveToken(session?.access_token || null)
  return session
}

export const authService = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { data: { session: null }, error }

    const session = syncTokenFromSession(normalizeSession(data.session))
    return { data: { session }, error: null }
  },

  register: async (email, password, data = {}) => {
    const { data: sbData, error } = await supabase.auth.signUp({ email, password, options: { data } })
    if (error) return { data: { session: null }, error }

    const session = syncTokenFromSession(normalizeSession(sbData.session))
    return { data: { session }, error: null }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut()
    saveToken(null)
    return { error }
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) return { data: { session: null }, error }

    const session = syncTokenFromSession(normalizeSession(data.session))
    return { data: { session }, error: null }
  },

  getToken: () => memoryToken || safeLocal.get() || safeSession.get(),

  onAuthChange: (callback) => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, syncTokenFromSession(normalizeSession(session)))
    })
    return { data }
  },
}
