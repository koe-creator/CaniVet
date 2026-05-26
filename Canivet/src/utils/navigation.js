export const sanitizeAppRedirect = (value, fallback = '/servicios') => {
  const raw = String(value || '').trim()
  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback

  try {
    const normalized = new URL(raw, window.location.origin)
    if (normalized.origin !== window.location.origin) return fallback
    return `${normalized.pathname}${normalized.search}${normalized.hash}` || fallback
  } catch {
    return fallback
  }
}
