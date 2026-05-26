export const ROLES = {
  ADMIN: 'admin',
  EMPLEADO: 'empleado',
  RECEPCIONISTA: 'recepcionista',
  CLIENTE: 'cliente',
}

export const STAFF_ROLES = [ROLES.ADMIN, ROLES.EMPLEADO, ROLES.RECEPCIONISTA]

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.EMPLEADO]: 'Empleado',
  [ROLES.RECEPCIONISTA]: 'Recepcionista',
  [ROLES.CLIENTE]: 'Cliente',
}

export const PAGE_ACCESS = {
  [ROLES.ADMIN]: ['dashboard', 'clients', 'pets', 'appointments', 'services', 'payments', 'inventory', 'reports', 'settings', 'subscriptions', 'daycare', 'walks', 'audit'],
  [ROLES.EMPLEADO]: ['dashboard', 'pets', 'appointments', 'services', 'payments', 'inventory', 'subscriptions', 'daycare', 'walks'],
  [ROLES.RECEPCIONISTA]: ['dashboard', 'clients', 'appointments'],
  [ROLES.CLIENTE]: [],
}

export const normalizeRole = (value, fallback = ROLES.CLIENTE) => {
  const role = String(value || '').trim().toLowerCase()
  return Object.values(ROLES).includes(role) ? role : fallback
}

export const isStaffRole = (role) => STAFF_ROLES.includes(normalizeRole(role))

const normalizeEmail = (value = '') => String(value).trim().toLowerCase()

export const ADMIN_EMAILS = Array.from(new Set(
  [
    import.meta.env.VITE_ADMIN_EMAIL,
    import.meta.env.VITE_ADMIN_EMAILS,
  ]
    .flatMap(value => String(value || '').split(','))
    .map(normalizeEmail)
    .filter(Boolean),
))

export const isConfiguredAdminEmail = (email) => ADMIN_EMAILS.includes(normalizeEmail(email))
