import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../services/supabase'

const AppConfigContext = createContext(null)

const STORAGE_KEY = 'canivet_app_config_v1'
const ENTITY_KEYS = ['clients', 'pets', 'appointments', 'services', 'payments', 'inventory']

const ROLE_LABELS = {
  admin: 'Administrador',
  user: 'Usuario',
}

const PAGE_ACCESS = {
  admin: ['dashboard', 'clients', 'pets', 'appointments', 'services', 'payments', 'inventory', 'reports', 'settings', 'subscriptions', 'daycare', 'walks', 'audit'],
  user:  ['dashboard', 'clients', 'pets', 'appointments', 'services', 'payments', 'inventory', 'subscriptions', 'daycare', 'walks'],
}

const DEFAULT_BRANCHES = [
  { id: 'branch_central', name: 'Sede Central', city: 'Santo Domingo', status: 'Activa', isDefault: true },
  { id: 'branch_norte', name: 'Sucursal Norte', city: 'Santiago', status: 'Activa', isDefault: false },
  { id: 'branch_este', name: 'Sucursal Este', city: 'La Romana', status: 'Pausa', isDefault: false },
]

const DEFAULT_STATE = {
  clinic: { nombre: 'CaniVet', telefono: '809-555-0100', email: 'admin@canivet.com', moneda: 'DOP', timezone: 'America/Santo_Domingo' },
  preferences: { emailNotifications: true, reminderNotifications: true, paymentReceiptNotifications: true, backupDaily: true, weeklyReports: false, multiBranch: true },
  branches: DEFAULT_BRANCHES,
  activeBranchId: 'all',
  userDirectory: [],
  recordBranches: ENTITY_KEYS.reduce((acc, key) => ({ ...acc, [key]: {} }), {}),
  appointmentStatuses: {},
  // Supabase-backed (kept in state as cache)
  invoices: {},
  onlinePayments: {},
  petVaccines: {},
  petClinicalHistory: {},
  notifications: [],
  subscriptions: {},
  daycareAttendance: [],
  petWalks: [],
  servicePhotos: {},
  auditLog: [],
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const normalizeEmail = (value = '') => String(value).trim().toLowerCase()
const generateId = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
const newUUID = () => crypto.randomUUID()

const buildDefaultBranchId = (branches = DEFAULT_BRANCHES) =>
  branches.find(b => b.isDefault)?.id || branches[0]?.id || 'branch_central'

const ensureRecordBranches = (value = {}) =>
  ENTITY_KEYS.reduce((acc, key) => ({ ...acc, [key]: { ...(value[key] || {}) } }), {})

const ensureObjectMap = (value) =>
  value && typeof value === 'object' && !Array.isArray(value) ? value : {}

// ── Config persistida en localStorage (solo clinic, preferences, recordBranches, etc.) ──
const CONFIG_STORAGE_KEY = 'canivet_config_v2'

const ensureBranches = (raw) => {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_BRANCHES
  const mapped = raw.map((b, i) => ({
    id: b.id || `branch_${i}`,
    name: b.name || `Sucursal ${i + 1}`,
    city: b.city || '',
    status: b.status || 'Activa',
    isDefault: Boolean(b.isDefault),
  }))
  if (!mapped.some(b => b.isDefault)) mapped[0] = { ...mapped[0], isDefault: true }
  return mapped
}

const readConfig = () => {
  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        clinic: { ...DEFAULT_STATE.clinic, ...(parsed.clinic || {}) },
        preferences: { ...DEFAULT_STATE.preferences, ...(parsed.preferences || {}) },
        activeBranchId: parsed.activeBranchId || 'all',
        userDirectory: Array.isArray(parsed.userDirectory) ? parsed.userDirectory : [],
        recordBranches: ensureRecordBranches(parsed.recordBranches),
        appointmentStatuses: parsed.appointmentStatuses || {},
        branches: ensureBranches(parsed.branches),
      }
    }
  } catch { /* ignore */ }
  return null
}

// ── Mappers Supabase → local ──────────────────────────────────────────────────
const mapVaccine = (row) => ({
  id: row.id,
  name: row.nombre,
  appliedAt: row.aplicada_el || '',
  nextDoseAt: row.proxima_dosis || '',
  veterinarian: row.veterinario || '',
  notes: row.notas || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const mapClinical = (row) => ({
  id: row.id,
  consultationDate: row.fecha_consulta || '',
  reason: row.motivo || '',
  symptoms: row.sintomas || '',
  diagnosis: row.diagnostico || '',
  treatment: row.tratamiento || '',
  observations: row.observaciones || '',
  weight: row.peso != null ? String(row.peso) : '',
  veterinarian: row.veterinario || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const mapSubscription = (row) => ({
  id: row.id,
  clientId: row.cliente_id || '',
  clientName: row.cliente_nombre || '',
  petId: row.mascota_id || '',
  petName: row.mascota_nombre || '',
  serviceName: row.servicio_nombre || '',
  plan: row.plan || 'mensual',
  amount: Number(row.monto || 0),
  startDate: row.fecha_inicio || '',
  nextBillingDate: row.proximo_cobro || '',
  status: row.estado || 'activa',
  notes: row.notas || '',
  branchId: row.sucursal_id || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const mapDaycare = (row) => ({
  id: row.id,
  petId: row.mascota_id || '',
  petName: row.mascota_nombre || '',
  clientId: row.cliente_id || '',
  clientName: row.cliente_nombre || '',
  date: row.fecha || '',
  checkIn: row.check_in || '',
  checkOut: row.check_out || '',
  notes: row.notas || '',
  branchId: row.sucursal_id || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const mapWalk = (row) => ({
  id: row.id,
  petId: row.mascota_id || '',
  petName: row.mascota_nombre || '',
  clientId: row.cliente_id || '',
  clientName: row.cliente_nombre || '',
  date: row.fecha || '',
  startTime: row.hora_inicio || '',
  endTime: row.hora_fin || '',
  duration: row.duracion || '',
  distance: row.distancia != null ? String(row.distancia) : '',
  walker: row.paseador || '',
  route: row.ruta || '',
  status: row.estado || 'programado',
  notes: row.notas || '',
  branchId: row.sucursal_id || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const mapInvoice = (row) => ({
  id: row.id,
  number: row.numero || '',
  status: row.estado || 'pagado',
  issuedAt: row.emitida_el || '',
  paymentId: row.pago_id || '',
  clientId: row.cliente_id || '',
  clientName: row.cliente_nombre || '',
  clientContact: row.cliente_contacto || '',
  branchId: row.sucursal_id || '',
  branchName: row.sucursal_nombre || '',
  date: row.fecha || '',
  method: row.metodo || '',
  subtotal: Number(row.subtotal || 0),
  tax: Number(row.impuesto || 0),
  total: Number(row.total || 0),
  notes: row.notas || '',
  concept: row.concepto || '',
  items: row.items_json || [],
})

const mapOnlinePayment = (row) => ({
  id: row.id,
  stripeSessionId: row.stripe_session_id || '',
  paymentReference: row.referencia || '',
  paymentUrl: row.url_pago || '',
  appointmentId: row.cita_id || null,
  clientId: row.cliente_id || null,
  clientName: row.cliente_nombre || '',
  clientContact: row.cliente_contacto || '',
  petName: row.mascota_nombre || '',
  serviceName: row.servicio_nombre || '',
  amount: Number(row.monto || 0),
  currency: row.moneda || 'DOP',
  status: row.estado || 'enviado',
  branchId: row.sucursal_id || '',
  branchName: row.sucursal_nombre || '',
  source: row.origen || 'manual',
  notes: row.notas || '',
  paymentId: row.pago_id || null,
  createdAt: row.created_at || '',
  expiresAt: row.expira_el || '',
  paidAt: row.pagado_el || '',
  lastEvent: row.ultimo_evento || '',
})

const mapNotification = (row) => ({
  id: row.id,
  type: row.tipo || 'general',
  title: row.titulo || '',
  message: row.mensaje || '',
  channel: row.canal || 'interna',
  status: row.estado || 'enviada',
  recipient: row.destinatario || '',
  clientId: row.cliente_id || null,
  clientName: row.cliente_nombre || '',
  branchId: row.sucursal_id || '',
  createdAt: row.created_at || '',
})

const mapAudit = (row) => ({
  id: row.id,
  action: row.accion || '',
  entity: row.entidad || '',
  entityId: row.entidad_id || '',
  description: row.descripcion || '',
  userEmail: row.usuario_email || '',
  branchId: row.sucursal_id || '',
  timestamp: row.created_at || '',
})

const mapBranch = (row) => ({
  id: row.id,
  name: row.nombre || '',
  city: row.ciudad || '',
  status: row.estado || 'Activa',
  isDefault: Boolean(row.es_default),
})

const mapServicePhoto = (row) => ({
  id: row.id,
  type: row.tipo || 'antes',
  dataUrl: row.data_url || '',
  caption: row.descripcion || '',
  createdAt: row.created_at || '',
})

// Group array by a key into an object map
const groupByKey = (arr, keyField, mapFn) => {
  if (!Array.isArray(arr)) return {}
  return arr.reduce((acc, row) => {
    const key = String(row[keyField] || '')
    if (!acc[key]) acc[key] = []
    acc[key].push(mapFn(row))
    return acc
  }, {})
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppConfig = () => useContext(AppConfigContext)

export const AppConfigProvider = ({ children }) => {
  const { user } = useAuth()

  // ── Config in localStorage ────────────────────────────────────────────────
  const savedConfig = useMemo(() => readConfig(), [])

  const [clinic, setClinicState] = useState(() => savedConfig?.clinic || DEFAULT_STATE.clinic)
  const [preferences, setPrefsState] = useState(() => savedConfig?.preferences || DEFAULT_STATE.preferences)
  const [activeBranchId, setActiveBranchIdState] = useState(() => savedConfig?.activeBranchId || 'all')
  const [userDirectory, setUserDirectory] = useState(() => savedConfig?.userDirectory || [])
  const [recordBranches, setRecordBranches] = useState(() => savedConfig?.recordBranches || DEFAULT_STATE.recordBranches)
  const [appointmentStatuses, setApptStatuses] = useState(() => savedConfig?.appointmentStatuses || {})

  // ── Supabase-backed state (cache) ─────────────────────────────────────────
  const [branches, setBranches] = useState(() => savedConfig?.branches || DEFAULT_BRANCHES)
  const [petVaccines, setPetVaccines] = useState({})
  const [petClinicalHistory, setPetClinicalHistory] = useState({})
  const [subscriptionsMap, setSubscriptionsMap] = useState({})
  const [daycareList, setDaycareList] = useState([])
  const [walksList, setWalksList] = useState([])
  const [invoicesMap, setInvoicesMap] = useState({})
  const [onlinePaymentsMap, setOnlinePaymentsMap] = useState({})
  const [notificationsList, setNotificationsList] = useState([])
  const [auditList, setAuditList] = useState([])
  const [servicePhotosMap, setServicePhotosMap] = useState({})
  const [supabaseReady, setSupabaseReady] = useState(false)

  // ── Persist config to localStorage ───────────────────────────────────────
  useEffect(() => {
    const config = { clinic, preferences, activeBranchId, userDirectory, recordBranches, appointmentStatuses, branches }
    window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
  }, [clinic, preferences, activeBranchId, userDirectory, recordBranches, appointmentStatuses, branches])

  // ── Load all data from Supabase on mount ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const [
        vaccinesRes, clinicalRes, subsRes, daycareRes, walksRes,
        invoicesRes, onlineRes, notifsRes, auditRes, photosRes, usersRes,
      ] = await Promise.allSettled([
        supabase.from('vacunas').select('*'),
        supabase.from('historial_clinico').select('*'),
        supabase.from('suscripciones').select('*').order('created_at', { ascending: false }),
        supabase.from('guarderia').select('*').order('fecha', { ascending: false }),
        supabase.from('paseos').select('*').order('fecha', { ascending: false }),
        supabase.from('facturas').select('*'),
        supabase.from('pagos_online').select('*').order('created_at', { ascending: false }),
        supabase.from('notificaciones').select('*').order('created_at', { ascending: false }).limit(150),
        supabase.from('auditoria').select('*').order('created_at', { ascending: false }).limit(500),
        supabase.from('fotos_servicio').select('*').order('created_at'),
        supabase.from('usuarios_sistema').select('*').order('created_at'),
      ])

      // Vaccines — grouped by mascota_id
      if (vaccinesRes.status === 'fulfilled' && vaccinesRes.value.data) {
        setPetVaccines(groupByKey(vaccinesRes.value.data, 'mascota_id', mapVaccine))
      }

      // Clinical history — grouped by mascota_id
      if (clinicalRes.status === 'fulfilled' && clinicalRes.value.data) {
        setPetClinicalHistory(groupByKey(clinicalRes.value.data, 'mascota_id', mapClinical))
      }

      // Subscriptions
      if (subsRes.status === 'fulfilled' && subsRes.value.data) {
        const map = {}
        subsRes.value.data.forEach(row => { map[row.id] = mapSubscription(row) })
        setSubscriptionsMap(map)
      }

      // Daycare
      if (daycareRes.status === 'fulfilled' && daycareRes.value.data) {
        setDaycareList(daycareRes.value.data.map(mapDaycare))
      }

      // Walks
      if (walksRes.status === 'fulfilled' && walksRes.value.data) {
        setWalksList(walksRes.value.data.map(mapWalk))
      }

      // Invoices — keyed by pago_id
      if (invoicesRes.status === 'fulfilled' && invoicesRes.value.data) {
        const map = {}
        invoicesRes.value.data.forEach(row => { map[row.pago_id] = mapInvoice(row) })
        setInvoicesMap(map)
      }

      // Online payments
      if (onlineRes.status === 'fulfilled' && onlineRes.value.data) {
        const map = {}
        onlineRes.value.data.forEach(row => { map[row.id] = mapOnlinePayment(row) })
        setOnlinePaymentsMap(map)
      }

      // Notifications
      if (notifsRes.status === 'fulfilled' && notifsRes.value.data) {
        setNotificationsList(notifsRes.value.data.map(mapNotification))
      }

      // Audit
      if (auditRes.status === 'fulfilled' && auditRes.value.data) {
        setAuditList(auditRes.value.data.map(mapAudit))
      }

      // Branches are kept in localStorage (sucursales table is available for future use)

      // User directory — from Supabase (takes precedence over localStorage)
      if (usersRes.status === 'fulfilled' && usersRes.value.data?.length) {
        const dbUsers = usersRes.value.data.map(row => ({
          id: row.id,
          email: normalizeEmail(row.email),
          name: row.nombre || row.email?.split('@')[0] || 'Usuario',
          role: row.rol === 'admin' ? 'admin' : 'user',
          status: row.estado === 'inactivo' ? 'inactivo' : 'activo',
          branchIds: Array.isArray(row.sucursal_ids) ? row.sucursal_ids : [],
        }))
        setUserDirectory(dbUsers)
      }

      // Service photos — grouped by cita_id
      if (photosRes.status === 'fulfilled' && photosRes.value.data) {
        const map = {}
        photosRes.value.data.forEach(row => {
          const key = String(row.cita_id || '')
          if (!map[key]) map[key] = []
          map[key].push(mapServicePhoto(row))
        })
        setServicePhotosMap(map)
      }

      setSupabaseReady(true)
    }

    load()
  }, [])

  // ── Derived from config ───────────────────────────────────────────────────
  const currentEmail = normalizeEmail(user?.email)

  const resolveRoleForEmail = useCallback((email, fallbackRole = 'user') => {
    const normalizedEmail = normalizeEmail(email)
    const entry = userDirectory.find(e => e.email === normalizedEmail && e.status !== 'inactivo')
    if (fallbackRole === 'admin') return 'admin'
    if (entry?.role === 'admin') return 'admin'
    return entry?.role || fallbackRole || 'user'
  }, [userDirectory])

  const defaultBranchId = useMemo(() => buildDefaultBranchId(branches), [branches])

  // Auto-register / actualizar usuario logueado
  useEffect(() => {
    if (!currentEmail) return
    let cancelled = false
    queueMicrotask(async () => {
      if (cancelled) return
      let upsertEntry = null

      setUserDirectory(prev => {
        const existing = prev.find(e => e.email === currentEmail)
        const jwtRole  = user?.role === 'admin' ? 'admin' : 'user'
        // Si no hay ningún admin en el sistema, el primer usuario que entra se vuelve admin
        const hasAnyAdmin = prev.some(e => e.role === 'admin' && e.status !== 'inactivo')
        const resolvedRole = jwtRole === 'admin'
          ? 'admin'
          : (!hasAnyAdmin ? 'admin' : (existing?.role || 'user'))

        if (existing) {
          // Si el JWT dice admin pero el directorio dice user, promoverlo
          if (resolvedRole === 'admin' && existing.role !== 'admin') {
            upsertEntry = { ...existing, role: 'admin' }
            return prev.map(e => e.email === currentEmail ? upsertEntry : e)
          }
          return prev  // sin cambio
        }

        // Usuario nuevo — agregarlo
        upsertEntry = {
          id: newUUID(),
          email: currentEmail,
          name: currentEmail.split('@')[0] || 'Usuario',
          role: resolvedRole,
          status: 'activo',
          branchIds: resolvedRole === 'admin' ? [] : [defaultBranchId],
        }
        return [upsertEntry, ...prev]
      })

      if (upsertEntry) {
        supabase.from('usuarios_sistema').upsert({
          id: upsertEntry.id,
          email: upsertEntry.email,
          nombre: upsertEntry.name,
          rol: upsertEntry.role,
          estado: upsertEntry.status,
          sucursal_ids: upsertEntry.branchIds,
        }, { onConflict: 'email' })
      }
    })
    return () => { cancelled = true }
  }, [currentEmail, user?.role, defaultBranchId])

  const currentRole = resolveRoleForEmail(currentEmail, user?.role || 'user')
  const currentRoleLabel = ROLE_LABELS[currentRole] || ROLE_LABELS.user

  const currentDirectoryEntry = useMemo(
    () => userDirectory.find(e => e.email === currentEmail) || null,
    [currentEmail, userDirectory],
  )

  const availableBranches = useMemo(
    () => branches.filter(b => b.status !== 'Archivada'),
    [branches],
  )

  const accessibleBranchIds = useMemo(() => {
    if (currentRole === 'admin') return availableBranches.map(b => b.id)
    if (currentDirectoryEntry?.branchIds?.length) {
      return currentDirectoryEntry.branchIds.filter(id => availableBranches.some(b => b.id === id))
    }
    return [defaultBranchId]
  }, [availableBranches, currentDirectoryEntry?.branchIds, currentRole, defaultBranchId])

  const effectiveActiveBranchId = useMemo(() => {
    if (!preferences.multiBranch) return 'all'
    if (currentRole === 'admin') {
      if (activeBranchId === 'all') return 'all'
      return availableBranches.some(b => b.id === activeBranchId) ? activeBranchId : defaultBranchId
    }
    if (!accessibleBranchIds.includes(activeBranchId)) return accessibleBranchIds[0] || defaultBranchId
    return activeBranchId
  }, [accessibleBranchIds, availableBranches, currentRole, defaultBranchId, activeBranchId, preferences.multiBranch])

  const preferredBranchId = useMemo(() => {
    if (effectiveActiveBranchId !== 'all') return effectiveActiveBranchId
    return accessibleBranchIds[0] || defaultBranchId
  }, [accessibleBranchIds, defaultBranchId, effectiveActiveBranchId])

  const accessiblePages = PAGE_ACCESS[currentRole] || PAGE_ACCESS.user

  const getBranchById = useCallback(
    (id) => branches.find(b => b.id === id) || null,
    [branches],
  )

  const getBranchName = useCallback(
    (id) => getBranchById(id)?.name || 'Sin sucursal',
    [getBranchById],
  )

  const setActiveBranch = useCallback((id) => {
    if (!preferences.multiBranch) return
    if (id === 'all' && currentRole !== 'admin') return
    if (id !== 'all' && !availableBranches.some(b => b.id === id)) return
    if (id !== 'all' && currentRole !== 'admin' && !accessibleBranchIds.includes(id)) return
    setActiveBranchIdState(id)
  }, [accessibleBranchIds, availableBranches, currentRole, preferences.multiBranch])

  const getRecordBranchId = useCallback((entity, recordId) => {
    const mapped = (recordBranches[entity] || {})[String(recordId)]
    return getBranchById(mapped) ? mapped : defaultBranchId
  }, [defaultBranchId, getBranchById, recordBranches])

  const filterRecords = useCallback((entity, records = []) => {
    if (!preferences.multiBranch || effectiveActiveBranchId === 'all') return records
    return records.filter(r => getRecordBranchId(entity, r.id) === effectiveActiveBranchId)
  }, [effectiveActiveBranchId, getRecordBranchId, preferences.multiBranch])

  const assignRecordBranch = useCallback((entity, recordId, branchId) => {
    if (!entity || !recordId) return
    const resolved = getBranchById(branchId) ? branchId : preferredBranchId
    setRecordBranches(prev => ({
      ...prev,
      [entity]: { ...(prev[entity] || {}), [String(recordId)]: resolved },
    }))
  }, [getBranchById, preferredBranchId])

  // ── Appointment statuses ──────────────────────────────────────────────────
  const getAppointmentStatus = useCallback(
    (id) => appointmentStatuses[String(id)] || 'pendiente',
    [appointmentStatuses],
  )

  const setAppointmentStatus = useCallback((id, status) => {
    if (!id || !status) return
    setApptStatuses(prev => ({ ...prev, [String(id)]: status }))
  }, [])

  // ── Invoices (Supabase) ───────────────────────────────────────────────────
  const getInvoiceByPaymentId = useCallback(
    (paymentId) => invoicesMap[String(paymentId)] || null,
    [invoicesMap],
  )

  const upsertInvoice = useCallback(async (payload) => {
    if (!payload?.paymentId) return null
    const paymentKey = String(payload.paymentId)
    const existing = invoicesMap[paymentKey]
    const baseDate = payload.date || new Date().toISOString().slice(0, 10)
    const year = String(baseDate).slice(0, 4) || new Date().getFullYear()
    const sequence = String(Object.keys(invoicesMap).length + (existing ? 0 : 1)).padStart(4, '0')

    const invoice = {
      id: existing?.id || newUUID(),
      number: existing?.number || `FAC-${year}-${sequence}`,
      status: payload.status || 'pagado',
      issuedAt: payload.issuedAt || new Date().toISOString(),
      paymentId: paymentKey,
      clientId: payload.clientId || null,
      clientName: payload.clientName || 'Cliente',
      clientContact: payload.clientContact || '',
      branchId: payload.branchId || preferredBranchId,
      branchName: payload.branchName || '',
      date: baseDate,
      method: payload.method || 'efectivo',
      subtotal: Number(payload.subtotal || payload.total || 0),
      tax: Number(payload.tax || 0),
      total: Number(payload.total || payload.subtotal || 0),
      notes: payload.notes || '',
      concept: payload.concept || 'Servicio veterinario',
      items: Array.isArray(payload.items) && payload.items.length
        ? payload.items
        : [{ description: payload.concept || 'Servicio veterinario', quantity: 1, unitPrice: Number(payload.total || 0), total: Number(payload.total || 0) }],
    }

    const row = {
      id: invoice.id,
      numero: invoice.number,
      estado: invoice.status,
      emitida_el: invoice.issuedAt,
      pago_id: paymentKey,
      cliente_id: invoice.clientId,
      cliente_nombre: invoice.clientName,
      cliente_contacto: invoice.clientContact,
      sucursal_id: invoice.branchId,
      sucursal_nombre: invoice.branchName,
      fecha: invoice.date,
      metodo: invoice.method,
      subtotal: invoice.subtotal,
      impuesto: invoice.tax,
      total: invoice.total,
      notas: invoice.notes,
      concepto: invoice.concept,
      items_json: invoice.items,
    }
    const { error } = existing
      ? await supabase.from('facturas').update(row).eq('id', invoice.id)
      : await supabase.from('facturas').insert(row)
    if (error) throw error

    setInvoicesMap(prev => ({ ...prev, [paymentKey]: invoice }))

    return invoice
  }, [invoicesMap, preferredBranchId])

  const removeInvoice = useCallback(async (paymentId) => {
    if (!paymentId) return
    const paymentKey = String(paymentId)
    const existing = invoicesMap[paymentKey]
    if (existing?.id) {
      const { error } = await supabase.from('facturas').delete().eq('id', existing.id)
      if (error) throw error
    }
    setInvoicesMap(prev => { const n = { ...prev }; delete n[paymentKey]; return n })
  }, [invoicesMap])

  // ── Online payments (Supabase) ────────────────────────────────────────────
  const getOnlinePaymentById = useCallback(
    (id) => onlinePaymentsMap[String(id)] || null,
    [onlinePaymentsMap],
  )

  const getOnlinePaymentByAppointmentId = useCallback((appointmentId) => {
    if (!appointmentId) return null
    return Object.values(onlinePaymentsMap).find(e => String(e.appointmentId || '') === String(appointmentId)) || null
  }, [onlinePaymentsMap])

  const createOnlinePayment = useCallback(async (payload) => {
    const id = payload.id || newUUID()
    const key = String(id)
    const existing = onlinePaymentsMap[key] || null
    const sessionId = payload.stripeSessionId || existing?.stripeSessionId || `cs_test_${Math.random().toString(36).slice(2, 12)}`
    const createdAt = existing?.createdAt || new Date().toISOString()
    const expiresAt = payload.expiresAt || existing?.expiresAt || new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    const year = new Date(createdAt).getFullYear()
    const sequence = String(Object.keys(onlinePaymentsMap).length + (existing ? 0 : 1)).padStart(4, '0')
    const reference = existing?.paymentReference || payload.paymentReference || `STR-${year}-${sequence}`

    const entry = {
      id,
      stripeSessionId: sessionId,
      paymentReference: reference,
      paymentUrl: payload.paymentUrl || existing?.paymentUrl || `https://checkout.stripe.local/session/${sessionId}`,
      appointmentId: payload.appointmentId ?? existing?.appointmentId ?? null,
      clientId: payload.clientId ?? existing?.clientId ?? null,
      clientName: payload.clientName || existing?.clientName || 'Cliente',
      clientContact: payload.clientContact || existing?.clientContact || '',
      petName: payload.petName || existing?.petName || '',
      serviceName: payload.serviceName || existing?.serviceName || 'Servicio veterinario',
      amount: Number(payload.amount ?? existing?.amount ?? 0),
      currency: payload.currency || existing?.currency || 'DOP',
      status: payload.status || existing?.status || 'enviado',
      branchId: payload.branchId || existing?.branchId || preferredBranchId,
      branchName: payload.branchName || existing?.branchName || '',
      source: payload.source || existing?.source || 'manual',
      notes: payload.notes || existing?.notes || '',
      paymentId: payload.paymentId ?? existing?.paymentId ?? null,
      createdAt,
      expiresAt,
      paidAt: payload.paidAt || existing?.paidAt || '',
      lastEvent: payload.lastEvent || existing?.lastEvent || 'link_generado',
    }

    const row = {
      id: entry.id,
      stripe_session_id: entry.stripeSessionId,
      referencia: entry.paymentReference,
      url_pago: entry.paymentUrl,
      cita_id: entry.appointmentId ? String(entry.appointmentId) : null,
      cliente_id: entry.clientId,
      cliente_nombre: entry.clientName,
      cliente_contacto: entry.clientContact,
      mascota_nombre: entry.petName,
      servicio_nombre: entry.serviceName,
      monto: entry.amount,
      moneda: entry.currency,
      estado: entry.status,
      sucursal_id: entry.branchId,
      sucursal_nombre: entry.branchName,
      origen: entry.source,
      notas: entry.notes,
      pago_id: entry.paymentId ? String(entry.paymentId) : null,
      expira_el: entry.expiresAt || null,
      pagado_el: entry.paidAt || null,
      ultimo_evento: entry.lastEvent,
    }
    const { error } = existing
      ? await supabase.from('pagos_online').update(row).eq('id', entry.id)
      : await supabase.from('pagos_online').insert(row)
    if (error) throw error

    setOnlinePaymentsMap(prev => ({ ...prev, [key]: entry }))

    return entry
  }, [onlinePaymentsMap, preferredBranchId])

  const updateOnlinePayment = useCallback(async (id, patch = {}) => {
    if (!id) return null
    const key = String(id)
    const existing = onlinePaymentsMap[key]
    if (!existing) return null
    const updated = { ...existing, ...patch }

    const row = {
      stripe_session_id: updated.stripeSessionId || null,
      referencia: updated.paymentReference,
      url_pago: updated.paymentUrl,
      cita_id: updated.appointmentId ? String(updated.appointmentId) : null,
      cliente_id: updated.clientId || null,
      cliente_nombre: updated.clientName,
      cliente_contacto: updated.clientContact,
      mascota_nombre: updated.petName,
      servicio_nombre: updated.serviceName,
      monto: updated.amount,
      moneda: updated.currency,
      sucursal_id: updated.branchId,
      estado: updated.status,
      sucursal_nombre: updated.branchName,
      origen: updated.source,
      pagado_el: updated.paidAt || null,
      expira_el: updated.expiresAt || null,
      ultimo_evento: updated.lastEvent,
      notas: updated.notes,
      pago_id: updated.paymentId ? String(updated.paymentId) : null,
    }
    const { error } = await supabase.from('pagos_online').update(row).eq('id', key)
    if (error) throw error

    setOnlinePaymentsMap(prev => ({ ...prev, [key]: updated }))
    return updated
  }, [onlinePaymentsMap])

  const removeOnlinePayment = useCallback(async (id) => {
    if (!id) return
    const key = String(id)
    const { error } = await supabase.from('pagos_online').delete().eq('id', key)
    if (error) throw error
    setOnlinePaymentsMap(prev => { const n = { ...prev }; delete n[key]; return n })
  }, [])

  // ── Vaccines (Supabase) ───────────────────────────────────────────────────
  const getPetVaccines = useCallback((petId) => {
    if (!petId) return []
    const entries = petVaccines[String(petId)] || []
    return [...entries].sort((a, b) => {
      const ad = a.nextDoseAt || a.appliedAt || ''
      const bd = b.nextDoseAt || b.appliedAt || ''
      return ad.localeCompare(bd)
    })
  }, [petVaccines])

  const savePetVaccine = useCallback(async (petId, payload) => {
    if (!petId || !payload?.name) return null
    const petKey = String(petId)
    const current = petVaccines[petKey] || []
    const existing = payload.id ? current.find(e => e.id === payload.id) : null

    const entry = {
      id: existing?.id || newUUID(),
      name: payload.name,
      appliedAt: payload.appliedAt || '',
      nextDoseAt: payload.nextDoseAt || '',
      veterinarian: payload.veterinarian || '',
      notes: payload.notes || '',
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const row = {
      id: entry.id,
      mascota_id: petId,
      nombre: entry.name,
      aplicada_el: entry.appliedAt || null,
      proxima_dosis: entry.nextDoseAt || null,
      veterinario: entry.veterinarian || null,
      notas: entry.notes || null,
    }
    const { error } = existing
      ? await supabase.from('vacunas').update(row).eq('id', entry.id)
      : await supabase.from('vacunas').insert(row)
    if (error) throw error

    setPetVaccines(prev => {
      const list = prev[petKey] || []
      return {
        ...prev,
        [petKey]: existing ? list.map(e => e.id === existing.id ? entry : e) : [entry, ...list],
      }
    })

    return entry
  }, [petVaccines])

  const removePetVaccine = useCallback(async (petId, vaccineId) => {
    if (!petId || !vaccineId) return
    const petKey = String(petId)
    const { error } = await supabase.from('vacunas').delete().eq('id', vaccineId)
    if (error) throw error
    setPetVaccines(prev => ({
      ...prev,
      [petKey]: (prev[petKey] || []).filter(e => e.id !== vaccineId),
    }))
  }, [])

  const clearPetVaccines = useCallback(async (petId) => {
    if (!petId) return
    const petKey = String(petId)
    const { error } = await supabase.from('vacunas').delete().eq('mascota_id', petId)
    if (error) throw error
    setPetVaccines(prev => { const n = { ...prev }; delete n[petKey]; return n })
  }, [])

  // ── Clinical history (Supabase) ───────────────────────────────────────────
  const getPetClinicalHistory = useCallback((petId) => {
    if (!petId) return []
    const entries = petClinicalHistory[String(petId)] || []
    return [...entries].sort((a, b) => String(b.consultationDate || '').localeCompare(String(a.consultationDate || '')))
  }, [petClinicalHistory])

  const savePetClinicalEntry = useCallback(async (petId, payload) => {
    if (!petId || !payload?.consultationDate || !payload?.reason) return null
    const petKey = String(petId)
    const current = petClinicalHistory[petKey] || []
    const existing = payload.id ? current.find(e => e.id === payload.id) : null

    const entry = {
      id: existing?.id || newUUID(),
      consultationDate: payload.consultationDate,
      reason: payload.reason,
      symptoms: payload.symptoms || '',
      diagnosis: payload.diagnosis || '',
      treatment: payload.treatment || '',
      observations: payload.observations || '',
      weight: payload.weight || '',
      veterinarian: payload.veterinarian || '',
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const row = {
      id: entry.id,
      mascota_id: petId,
      fecha_consulta: entry.consultationDate,
      motivo: entry.reason,
      sintomas: entry.symptoms || null,
      diagnostico: entry.diagnosis || null,
      tratamiento: entry.treatment || null,
      observaciones: entry.observations || null,
      peso: entry.weight ? Number(entry.weight) : null,
      veterinario: entry.veterinarian || null,
    }
    const { error } = existing
      ? await supabase.from('historial_clinico').update(row).eq('id', entry.id)
      : await supabase.from('historial_clinico').insert(row)
    if (error) throw error

    setPetClinicalHistory(prev => {
      const list = prev[petKey] || []
      return {
        ...prev,
        [petKey]: existing ? list.map(e => e.id === existing.id ? entry : e) : [entry, ...list],
      }
    })

    return entry
  }, [petClinicalHistory])

  const removePetClinicalEntry = useCallback(async (petId, entryId) => {
    if (!petId || !entryId) return
    const petKey = String(petId)
    const { error } = await supabase.from('historial_clinico').delete().eq('id', entryId)
    if (error) throw error
    setPetClinicalHistory(prev => ({
      ...prev,
      [petKey]: (prev[petKey] || []).filter(e => e.id !== entryId),
    }))
  }, [])

  const clearPetClinicalHistory = useCallback(async (petId) => {
    if (!petId) return
    const petKey = String(petId)
    const { error } = await supabase.from('historial_clinico').delete().eq('mascota_id', petId)
    if (error) throw error
    setPetClinicalHistory(prev => { const n = { ...prev }; delete n[petKey]; return n })
  }, [])

  // ── Config methods ────────────────────────────────────────────────────────
  const saveClinic = useCallback((patch) => {
    setClinicState(prev => ({ ...prev, ...patch }))
  }, [])

  const updatePreference = useCallback((key, value) => {
    setPrefsState(prev => ({ ...prev, [key]: value }))
  }, [])

  // ── Branches (Supabase) ───────────────────────────────────────────────────
  const saveBranch = useCallback((payload) => {
    if (payload.id) {
      setBranches(prev => prev.map(b => b.id !== payload.id ? b : { ...b, name: payload.name, city: payload.city, status: payload.status }))
    } else {
      const newId = `branch_${Date.now().toString(36)}`
      const newBranch = { id: newId, name: payload.name, city: payload.city, status: payload.status || 'Activa', isDefault: false }
      setBranches(prev => [...prev, newBranch])
    }
    return { error: null }
  }, [])

  const removeBranch = useCallback((branchId) => {
    if (branchId === defaultBranchId) return { error: 'La sucursal principal no se puede eliminar.' }
    setBranches(prev => prev.filter(b => b.id !== branchId))
    setActiveBranchIdState(prev => prev === branchId ? defaultBranchId : prev)
    setUserDirectory(prev => prev.map(e => ({ ...e, branchIds: e.branchIds.filter(id => id !== branchId) })))
    return { error: null }
  }, [defaultBranchId])

  // ── Users (Supabase + localStorage) ──────────────────────────────────────
  const saveUserAccess = useCallback(async (payload) => {
    const email = normalizeEmail(payload.email)
    let result = { error: null }
    let nextEntry = null
    let previousEntry = null

    setUserDirectory(prev => {
      const existing = prev.find(e => e.email === email)
      previousEntry = existing || null
      nextEntry = {
        id: existing?.id || newUUID(),
        email,
        name: payload.name || email.split('@')[0] || 'Usuario',
        role: payload.role === 'admin' ? 'admin' : 'user',
        status: payload.status === 'inactivo' ? 'inactivo' : 'activo',
        branchIds: payload.role === 'admin' ? [] : (payload.branchIds?.length ? payload.branchIds : [defaultBranchId]),
      }
      const updated = existing
        ? prev.map(e => e.email === email ? nextEntry : e)
        : [nextEntry, ...prev]
      const admins = updated.filter(e => e.role === 'admin' && e.status !== 'inactivo')
      if (!admins.length) { result = { error: 'Debe existir al menos un administrador activo.' }; return prev }
      return updated
    })

    // Sync to Supabase
    if (!result.error && nextEntry) {
      const row = {
        id: nextEntry.id,
        email: nextEntry.email,
        nombre: nextEntry.name,
        rol: nextEntry.role,
        estado: nextEntry.status,
        sucursal_ids: nextEntry.branchIds,
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabase.from('usuarios_sistema').upsert(row, { onConflict: 'email' })
      if (error) {
        setUserDirectory(prev => {
          const hasExisting = prev.some(e => e.id === nextEntry.id)
          if (hasExisting) {
            return previousEntry
              ? prev.map(e => e.id === nextEntry.id ? previousEntry : e)
              : prev.filter(e => e.id !== nextEntry.id)
          }
          return prev.filter(e => e.id !== nextEntry.id)
        })
        return { error: error.message || 'No se pudo guardar el acceso del usuario.' }
      }
    }

    return result
  }, [defaultBranchId])

  // ── Notifications (Supabase) ──────────────────────────────────────────────
  const createNotification = useCallback(async (payload) => {
    const notification = {
      id: newUUID(),
      type: payload.type || 'general',
      title: payload.title || 'Notificacion',
      message: payload.message || '',
      channel: payload.channel || (preferences.emailNotifications ? 'email' : 'interna'),
      status: payload.status || 'enviada',
      recipient: payload.recipient || 'Sin destinatario',
      clientId: payload.clientId || null,
      clientName: payload.clientName || '',
      branchId: payload.branchId || preferredBranchId,
      createdAt: new Date().toISOString(),
    }
    const { error } = await supabase.from('notificaciones').insert({
      id: notification.id,
      tipo: notification.type,
      titulo: notification.title,
      mensaje: notification.message,
      canal: notification.channel,
      estado: notification.status,
      destinatario: notification.recipient,
      cliente_id: notification.clientId,
      cliente_nombre: notification.clientName,
      sucursal_id: notification.branchId,
    })
    if (error) throw error

    setNotificationsList(prev => [notification, ...prev].slice(0, 150))

    return notification
  }, [preferences.emailNotifications, preferredBranchId])

  const updateNotificationStatus = useCallback(async (id, status) => {
    const { error } = await supabase.from('notificaciones').update({ estado: status }).eq('id', id)
    if (error) throw error
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, status } : n))
  }, [])

  // ── Audit (Supabase) ──────────────────────────────────────────────────────
  const addAuditEntry = useCallback(async (payload) => {
    const entry = {
      id: newUUID(),
      action: payload.action || 'accion',
      entity: payload.entity || '',
      entityId: payload.entityId || '',
      description: payload.description || '',
      userEmail: payload.userEmail || currentEmail || '',
      branchId: payload.branchId || preferredBranchId,
      timestamp: new Date().toISOString(),
    }
    const { error } = await supabase.from('auditoria').insert({
      id: entry.id,
      accion: entry.action,
      entidad: entry.entity,
      entidad_id: entry.entityId,
      descripcion: entry.description,
      usuario_email: entry.userEmail,
      sucursal_id: entry.branchId,
    })
    if (error) throw error

    setAuditList(prev => [entry, ...prev].slice(0, 500))

    return entry
  }, [currentEmail, preferredBranchId])

  // ── Subscriptions (Supabase) ──────────────────────────────────────────────
  const saveSubscription = useCallback(async (payload) => {
    const id = payload.id || newUUID()
    const key = String(id)
    const existing = subscriptionsMap[key] || null

    const entry = {
      id,
      clientId: payload.clientId || existing?.clientId || '',
      clientName: payload.clientName || existing?.clientName || '',
      petId: payload.petId || existing?.petId || '',
      petName: payload.petName || existing?.petName || '',
      serviceName: payload.serviceName || existing?.serviceName || '',
      plan: payload.plan || existing?.plan || 'mensual',
      amount: Number(payload.amount ?? existing?.amount ?? 0),
      startDate: payload.startDate || existing?.startDate || '',
      nextBillingDate: payload.nextBillingDate || existing?.nextBillingDate || '',
      status: payload.status || existing?.status || 'activa',
      notes: payload.notes || existing?.notes || '',
      branchId: payload.branchId || existing?.branchId || preferredBranchId,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const row = {
      id: entry.id,
      cliente_id: entry.clientId || null,
      cliente_nombre: entry.clientName,
      mascota_id: entry.petId || null,
      mascota_nombre: entry.petName,
      servicio_nombre: entry.serviceName,
      plan: entry.plan,
      monto: entry.amount,
      fecha_inicio: entry.startDate || null,
      proximo_cobro: entry.nextBillingDate || null,
      estado: entry.status,
      notas: entry.notes || null,
      sucursal_id: entry.branchId,
    }
    const { error } = existing
      ? await supabase.from('suscripciones').update(row).eq('id', entry.id)
      : await supabase.from('suscripciones').insert(row)
    if (error) throw error

    setSubscriptionsMap(prev => ({ ...prev, [key]: entry }))

    return entry
  }, [subscriptionsMap, preferredBranchId])

  const removeSubscription = useCallback(async (id) => {
    if (!id) return
    const key = String(id)
    const { error } = await supabase.from('suscripciones').delete().eq('id', key)
    if (error) throw error
    setSubscriptionsMap(prev => { const n = { ...prev }; delete n[key]; return n })
  }, [])

  // ── Daycare (Supabase) ────────────────────────────────────────────────────
  const saveDaycareRecord = useCallback(async (payload) => {
    const existing = payload.id ? daycareList.find(r => r.id === payload.id) : null
    const entry = {
      id: existing?.id || newUUID(),
      petId: payload.petId || existing?.petId || '',
      petName: payload.petName || existing?.petName || '',
      clientId: payload.clientId || existing?.clientId || '',
      clientName: payload.clientName || existing?.clientName || '',
      date: payload.date || existing?.date || '',
      checkIn: payload.checkIn || existing?.checkIn || '',
      checkOut: payload.checkOut || existing?.checkOut || '',
      notes: payload.notes || existing?.notes || '',
      branchId: payload.branchId || existing?.branchId || preferredBranchId,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const row = {
      id: entry.id,
      mascota_id: entry.petId || null,
      mascota_nombre: entry.petName,
      cliente_id: entry.clientId || null,
      cliente_nombre: entry.clientName,
      fecha: entry.date,
      check_in: entry.checkIn || null,
      check_out: entry.checkOut || null,
      notas: entry.notes || null,
      sucursal_id: entry.branchId,
    }
    const { error } = existing
      ? await supabase.from('guarderia').update(row).eq('id', entry.id)
      : await supabase.from('guarderia').insert(row)
    if (error) throw error

    setDaycareList(prev =>
      existing ? prev.map(r => r.id === existing.id ? entry : r) : [entry, ...prev],
    )

    return entry
  }, [daycareList, preferredBranchId])

  const removeDaycareRecord = useCallback(async (id) => {
    if (!id) return
    const { error } = await supabase.from('guarderia').delete().eq('id', id)
    if (error) throw error
    setDaycareList(prev => prev.filter(r => r.id !== id))
  }, [])

  // ── Walks (Supabase) ──────────────────────────────────────────────────────
  const saveWalk = useCallback(async (payload) => {
    const existing = payload.id ? walksList.find(w => w.id === payload.id) : null
    const entry = {
      id: existing?.id || newUUID(),
      petId: payload.petId || existing?.petId || '',
      petName: payload.petName || existing?.petName || '',
      clientId: payload.clientId || existing?.clientId || '',
      clientName: payload.clientName || existing?.clientName || '',
      date: payload.date || existing?.date || '',
      startTime: payload.startTime || existing?.startTime || '',
      endTime: payload.endTime || existing?.endTime || '',
      duration: payload.duration || existing?.duration || '',
      distance: payload.distance || existing?.distance || '',
      walker: payload.walker || existing?.walker || '',
      route: payload.route || existing?.route || '',
      status: payload.status || existing?.status || 'programado',
      notes: payload.notes || existing?.notes || '',
      branchId: payload.branchId || existing?.branchId || preferredBranchId,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const row = {
      id: entry.id,
      mascota_id: entry.petId || null,
      mascota_nombre: entry.petName,
      cliente_id: entry.clientId || null,
      cliente_nombre: entry.clientName,
      fecha: entry.date || null,
      hora_inicio: entry.startTime || null,
      hora_fin: entry.endTime || null,
      duracion: entry.duration || null,
      distancia: entry.distance ? Number(entry.distance) : null,
      paseador: entry.walker || null,
      ruta: entry.route || null,
      estado: entry.status,
      notas: entry.notes || null,
      sucursal_id: entry.branchId,
    }
    const { error } = existing
      ? await supabase.from('paseos').update(row).eq('id', entry.id)
      : await supabase.from('paseos').insert(row)
    if (error) throw error

    setWalksList(prev =>
      existing ? prev.map(w => w.id === existing.id ? entry : w) : [entry, ...prev],
    )

    return entry
  }, [walksList, preferredBranchId])

  const removeWalk = useCallback(async (id) => {
    if (!id) return
    const { error } = await supabase.from('paseos').delete().eq('id', id)
    if (error) throw error
    setWalksList(prev => prev.filter(w => w.id !== id))
  }, [])

  // ── Service photos (Supabase) ─────────────────────────────────────────────
  const getServicePhotos = useCallback((appointmentId) => {
    if (!appointmentId) return []
    return servicePhotosMap[String(appointmentId)] || []
  }, [servicePhotosMap])

  const saveServicePhoto = useCallback(async (appointmentId, payload) => {
    if (!appointmentId) return null
    const apptKey = String(appointmentId)
    const current = servicePhotosMap[apptKey] || []
    const existing = payload.id ? current.find(p => p.id === payload.id) : null

    const photo = {
      id: existing?.id || newUUID(),
      type: payload.type || 'antes',
      dataUrl: payload.dataUrl || existing?.dataUrl || '',
      caption: payload.caption || existing?.caption || '',
      createdAt: existing?.createdAt || new Date().toISOString(),
    }

    const row = {
      id: photo.id,
      cita_id: apptKey,
      tipo: photo.type,
      data_url: photo.dataUrl,
      descripcion: photo.caption || null,
    }
    const { error } = existing
      ? await supabase.from('fotos_servicio').update(row).eq('id', photo.id)
      : await supabase.from('fotos_servicio').insert(row)
    if (error) throw error

    setServicePhotosMap(prev => {
      const list = prev[apptKey] || []
      return {
        ...prev,
        [apptKey]: existing ? list.map(p => p.id === existing.id ? photo : p) : [...list, photo],
      }
    })

    return photo
  }, [servicePhotosMap])

  const removeServicePhoto = useCallback(async (appointmentId, photoId) => {
    if (!appointmentId || !photoId) return
    const apptKey = String(appointmentId)
    const { error } = await supabase.from('fotos_servicio').delete().eq('id', photoId)
    if (error) throw error
    setServicePhotosMap(prev => ({
      ...prev,
      [apptKey]: (prev[apptKey] || []).filter(p => p.id !== photoId),
    }))
  }, [])

  // ── Derived lists filtered by active branch ───────────────────────────────
  const notifications = useMemo(() => {
    if (effectiveActiveBranchId === 'all') return notificationsList
    return notificationsList.filter(n => !n.branchId || n.branchId === effectiveActiveBranchId)
  }, [effectiveActiveBranchId, notificationsList])

  const subscriptions = useMemo(() => {
    const all = Object.values(subscriptionsMap).sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    )
    if (effectiveActiveBranchId === 'all') return all
    return all.filter(s => !s.branchId || s.branchId === effectiveActiveBranchId)
  }, [effectiveActiveBranchId, subscriptionsMap])

  const daycareAttendance = useMemo(() => {
    const all = [...daycareList].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    if (effectiveActiveBranchId === 'all') return all
    return all.filter(r => !r.branchId || r.branchId === effectiveActiveBranchId)
  }, [effectiveActiveBranchId, daycareList])

  const petWalks = useMemo(() => {
    const all = [...walksList].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    if (effectiveActiveBranchId === 'all') return all
    return all.filter(w => !w.branchId || w.branchId === effectiveActiveBranchId)
  }, [effectiveActiveBranchId, walksList])

  const auditLog = useMemo(() => {
    if (effectiveActiveBranchId === 'all') return auditList
    return auditList.filter(e => !e.branchId || e.branchId === effectiveActiveBranchId)
  }, [effectiveActiveBranchId, auditList])

  const onlinePayments = useMemo(() => {
    const all = Object.values(onlinePaymentsMap).sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    )
    if (effectiveActiveBranchId === 'all') return all
    return all.filter(e => !e.branchId || e.branchId === effectiveActiveBranchId)
  }, [effectiveActiveBranchId, onlinePaymentsMap])

  const branchOptions = useMemo(() => (
    currentRole === 'admin'
      ? availableBranches
      : availableBranches.filter(b => accessibleBranchIds.includes(b.id))
  ), [accessibleBranchIds, availableBranches, currentRole])

  // ── Context value ─────────────────────────────────────────────────────────
  const value = useMemo(() => ({
    // Config
    clinic,
    preferences,
    currentEmail,
    branches: branchOptions,
    allBranches: branches,
    activeBranchId: effectiveActiveBranchId,
    preferredBranchId,
    defaultBranchId,
    currentRole,
    currentRoleLabel,
    roleLabels: ROLE_LABELS,
    accessiblePages,
    userDirectory,
    supabaseReady,
    // Branch helpers
    canAccess: (pageId) => accessiblePages.includes(pageId),
    resolveRoleForEmail,
    setActiveBranch,
    getBranchById,
    getBranchName,
    getRecordBranchId,
    filterRecords,
    assignRecordBranch,
    // Appointment statuses
    getAppointmentStatus,
    setAppointmentStatus,
    // Invoices
    getInvoiceByPaymentId,
    upsertInvoice,
    removeInvoice,
    // Online payments
    onlinePayments,
    getOnlinePaymentById,
    getOnlinePaymentByAppointmentId,
    createOnlinePayment,
    updateOnlinePayment,
    removeOnlinePayment,
    // Vaccines
    getPetVaccines,
    savePetVaccine,
    removePetVaccine,
    clearPetVaccines,
    // Clinical
    getPetClinicalHistory,
    savePetClinicalEntry,
    removePetClinicalEntry,
    clearPetClinicalHistory,
    // Config setters
    saveClinic,
    updatePreference,
    saveBranch,
    removeBranch,
    saveUserAccess,
    // Notifications
    notifications,
    createNotification,
    updateNotificationStatus,
    // Subscriptions
    subscriptions,
    saveSubscription,
    removeSubscription,
    // Daycare
    daycareAttendance,
    saveDaycareRecord,
    removeDaycareRecord,
    // Walks
    petWalks,
    saveWalk,
    removeWalk,
    // Photos
    servicePhotos: servicePhotosMap,
    getServicePhotos,
    saveServicePhoto,
    removeServicePhoto,
    // Audit
    auditLog,
    addAuditEntry,
  }), [
    clinic, preferences, currentEmail, branchOptions, branches, effectiveActiveBranchId,
    preferredBranchId, defaultBranchId, currentRole, currentRoleLabel,
    accessiblePages, userDirectory, supabaseReady,
    resolveRoleForEmail, setActiveBranch, getBranchById, getBranchName,
    getRecordBranchId, filterRecords, assignRecordBranch,
    getAppointmentStatus, setAppointmentStatus,
    getInvoiceByPaymentId, upsertInvoice, removeInvoice,
    onlinePayments, getOnlinePaymentById, getOnlinePaymentByAppointmentId,
    createOnlinePayment, updateOnlinePayment, removeOnlinePayment,
    getPetVaccines, savePetVaccine, removePetVaccine, clearPetVaccines,
    getPetClinicalHistory, savePetClinicalEntry, removePetClinicalEntry, clearPetClinicalHistory,
    saveClinic, updatePreference, saveBranch, removeBranch, saveUserAccess,
    notifications, createNotification, updateNotificationStatus,
    subscriptions, saveSubscription, removeSubscription,
    daycareAttendance, saveDaycareRecord, removeDaycareRecord,
    petWalks, saveWalk, removeWalk,
    servicePhotosMap, getServicePhotos, saveServicePhoto, removeServicePhoto,
    auditLog, addAuditEntry,
  ])

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  )
}
