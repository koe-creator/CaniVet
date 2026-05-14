import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../services/supabase'
import { useAppConfig } from '../../context/AppConfigContext'
import { fmtMoney, getInitials } from '../../utils/formatters'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, ArcElement, Title, Tooltip, Legend)

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

const css = `
.dash-alerts { border-radius:14px; padding:16px 20px; margin-bottom:20px; }
.dash-alerts.danger  { background:#fef2f2; border:1px solid #fecaca; }
.dash-alerts.warning { background:#fff7ed; border:1px solid #fed7aa; }
.dash-alerts.info    { background:#eff6ff; border:1px solid #bfdbfe; }
.dash-alerts h3 { font-size:14px; font-weight:700; margin:0 0 10px; display:flex; align-items:center; gap:8px; }
.dash-alerts.danger h3  { color:#dc2626; }
.dash-alerts.warning h3 { color:#d97706; }
.dash-alerts.info h3    { color:#1d4ed8; }
.alert-pills { display:flex; flex-wrap:wrap; gap:8px; }
.alert-pill  { border-radius:20px; padding:4px 12px; font-size:12px; font-weight:600; }
.alert-pill.danger  { background:#fee2e2; color:#dc2626; }
.alert-pill.warning { background:#fef3c7; color:#b45309; }
.alert-pill.info    { background:#dbeafe; color:#1d4ed8; }
.dash-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:16px; }
.dash-kpi-row2 { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
@media(max-width:1100px){ .dash-kpi-row,.dash-kpi-row2 { grid-template-columns:repeat(2,1fr) } }
.dash-kpi { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:18px; }
.dash-kpi-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:12px; }
.dash-kpi-val { font-size:26px; font-weight:800; color:#0f172a; margin-bottom:4px; line-height:1; }
.dash-kpi-lbl { font-size:12px; color:#64748b; font-weight:500; }
.dash-kpi-sub { font-size:11px; color:#94a3b8; margin-top:4px; }
.dash-g2  { display:grid; grid-template-columns:3fr 2fr; gap:16px; margin-bottom:16px; }
.dash-g2b { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
@media(max-width:1100px){ .dash-g2,.dash-g2b { grid-template-columns:1fr } }
.chart-legend { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:10px; }
.leg { display:flex; align-items:center; gap:5px; font-size:12px; color:#64748b; }
.leg-sq { width:10px; height:10px; border-radius:2px; flex-shrink:0; }
.dash-ri { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid #f1f5f9; }
.dash-ri:last-child { border-bottom:none; }
.dash-ri-av { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:11px; font-weight:700; flex-shrink:0; }
.dash-ri-meta { flex:1; min-width:0; }
.dash-ri-meta strong { display:block; font-size:13px; font-weight:600; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.dash-ri-meta span { font-size:12px; color:#64748b; }
.dash-ri-val { font-size:13px; font-weight:700; flex-shrink:0; }
.dash-empty { text-align:center; color:#94a3b8; padding:24px 0; font-size:13px; }
.quick-actions { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; }
.qa-btn { display:flex; align-items:center; gap:8px; background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:10px 16px; font-size:13px; font-weight:600; color:#334155; cursor:pointer; transition:all .12s; }
.qa-btn:hover { border-color:#3b82f6; color:#1d4ed8; background:#eff6ff; }
.qa-btn span { font-size:18px; }
.dash-section-title { font-size:14px; font-weight:700; color:#0f172a; margin-bottom:12px; }
`

const formatMonthKey = (dateStr) => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const todayStr = () => new Date().toISOString().slice(0, 10)

const in7Days = () => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 10)
}

const paymentDate = (payment) => payment.fecha || payment.created_at || ''

export const DashboardPage = () => {
  const {
    activeBranchId,
    getBranchName,
    filterRecords,
    notifications,
    onlinePayments,
    subscriptions,
    daycareAttendance,
    petWalks,
    getPetVaccines,
  } = useAppConfig()

  const [clients, setClients] = useState([])
  const [pets, setPets] = useState([])
  const [appointments, setAppointments] = useState([])
  const [payments, setPayments] = useState([])
  const [services, setServices] = useState([])
  const [inventory, setInventory] = useState([])
  const [dismissedAlerts, setDismissedAlerts] = useState({})
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const loadData = useCallback(async () => {
    const [
      { data: clientsData },
      { data: petsData },
      { data: appointmentsData },
      { data: paymentsData },
      { data: servicesData },
      { data: inventoryData },
    ] = await Promise.all([
      supabase.from('clientes').select('*').order('nombre'),
      supabase.from('mascotas').select('*').order('nombre'),
      supabase.from('citas').select('*').order('fecha'),
      supabase.from('pagos').select('*').order('created_at', { ascending: false }),
      supabase.from('servicios').select('*').order('nombre'),
      supabase.from('inventario').select('*').order('producto'),
    ])
    setClients(clientsData || [])
    setPets(petsData || [])
    setAppointments((appointmentsData || []).map((item) => ({
      ...item,
      clientes: (clientsData || []).find((client) => String(client.id) === String(item.cliente_id)) || null,
      mascotas: (petsData || []).find((pet) => String(pet.id) === String(item.mascota_id)) || null,
      servicios: (servicesData || []).find((service) => String(service.id) === String(item.servicio_id)) || null,
    })))
    setPayments(paymentsData || [])
    setServices(servicesData || [])
    setInventory((inventoryData || []).map((item) => ({ ...item, nombre: item.nombre || item.producto || '' })))
    setLastRefresh(new Date())
  }, [])

  useEffect(() => {
    loadData()
    // Auto-refresh cada 60 segundos
    const interval = setInterval(loadData, 60_000)
    return () => clearInterval(interval)
  }, [loadData])

  const today = todayStr()
  const next7 = in7Days()

  const filteredClients = filterRecords('clients', clients)
  const filteredPets = filterRecords('pets', pets)
  const filteredAppointments = filterRecords('appointments', appointments)
  const filteredPayments = filterRecords('payments', payments)
  const filteredInventory = filterRecords('inventory', inventory)
  const clientsById = useMemo(() => Object.fromEntries(filteredClients.map((item) => [String(item.id), item])), [filteredClients])
  const petsById = useMemo(() => Object.fromEntries(filteredPets.map((item) => [String(item.id), item])), [filteredPets])
  const servicesById = useMemo(() => Object.fromEntries(services.map((item) => [String(item.id), item])), [services])

  // ── Alertas ──────────────────────────────────────────────────────────────────
  const vaccineAlerts = useMemo(() => {
    const overdue = []
    const upcoming = []
    filteredPets.forEach(pet => {
      const vaccines = getPetVaccines(pet.id)
      vaccines.forEach(v => {
        if (!v.nextDoseAt) return
        if (v.nextDoseAt < today) overdue.push({ pet: pet.nombre, vaccine: v.name, date: v.nextDoseAt })
        else if (v.nextDoseAt <= next7) upcoming.push({ pet: pet.nombre, vaccine: v.name, date: v.nextDoseAt })
      })
    })
    return { overdue, upcoming }
  }, [filteredPets, getPetVaccines, today, next7])

  const criticalStock = useMemo(() =>
    filteredInventory.filter(i => Number(i.cantidad || 0) < 10),
    [filteredInventory],
  )

  const subAlerts = useMemo(() =>
    subscriptions.filter(s => s.status === 'activa' && s.nextBillingDate && s.nextBillingDate <= next7),
    [subscriptions, next7],
  )

  // ── KPIs ─────────────────────────────────────────────────────────────────────
  const todayAppointments = filteredAppointments.filter(a => a.fecha === today)
  const totalIngresos = filteredPayments.reduce((sum, p) => sum + Number(p.monto || 0), 0)
  const activeSubs = subscriptions.filter(s => s.status === 'activa')
  const monthlySubRevenue = activeSubs.reduce((sum, s) => {
    const factor = s.plan === 'trimestral' ? 1 / 3 : s.plan === 'anual' ? 1 / 12 : 1
    return sum + s.amount * factor
  }, 0)
  const presentDaycare = daycareAttendance.filter(r => r.date === today && r.checkIn && !r.checkOut)
  const activeWalks = petWalks.filter(w => w.status === 'en_curso')
  const pendingNotifs = notifications.filter(n => n.status !== 'leida').length

  // ── Gráficos ──────────────────────────────────────────────────────────────────
  const ingresosData = useMemo(() => {
    const monthTotals = new Map()
    const now = new Date()
    const monthKeys = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })
    filteredPayments.forEach(p => {
      const key = formatMonthKey(paymentDate(p))
      if (key) monthTotals.set(key, (monthTotals.get(key) || 0) + Number(p.monto || 0))
    })
    return {
      labels: monthKeys.map(k => MONTHS[Number(k.slice(5)) - 1]),
      datasets: [{ label: 'Ingresos', data: monthKeys.map(k => monthTotals.get(k) || 0), backgroundColor: '#3b82f6', borderRadius: 6, borderSkipped: false }],
    }
  }, [filteredPayments])

  const servicesData = useMemo(() => {
    const counts = filteredAppointments.reduce((acc, a) => {
      const n = servicesById[String(a.servicio_id)]?.nombre || 'Sin servicio'
      acc[n] = (acc[n] || 0) + 1
      return acc
    }, {})
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    if (!top.length) return { labels: ['Sin datos'], datasets: [{ data: [1], backgroundColor: ['#cbd5e1'], borderWidth: 0 }] }
    return {
      labels: top.map(([l]) => l),
      datasets: [{ data: top.map(([, v]) => v), backgroundColor: COLORS, borderWidth: 0, hoverOffset: 6 }],
    }
  }, [filteredAppointments, servicesById])

  const topClients = useMemo(() => {
    const totals = filteredPayments.reduce((acc, p) => {
      acc[p.cliente_id] = (acc[p.cliente_id] || 0) + Number(p.monto || 0)
      return acc
    }, {})
    return Object.entries(totals)
      .map(([id, total]) => ({ name: filteredClients.find(c => String(c.id) === String(id))?.nombre || 'Cliente', total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [filteredClients, filteredPayments])

  const branchLabel = activeBranchId === 'all' ? 'Todas las sucursales' : getBranchName(activeBranchId)
  const dismiss = (key) => setDismissedAlerts(p => ({ ...p, [key]: true }))

  const baseOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false }, ticks: { font: { size: 11 } } }, y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } } },
  }

  return (
    <>
      <style>{css}</style>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">{branchLabel} · {new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            Actualizado {lastRefresh.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button
            onClick={loadData}
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px', fontSize: 13, cursor: 'pointer', color: '#475569' }}
            title="Actualizar datos"
          >⟳ Actualizar</button>
          {pendingNotifs > 0 && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '7px 12px', fontSize: 12, color: '#dc2626', fontWeight: 700 }}>
              {pendingNotifs} notif. sin leer
            </div>
          )}
        </div>
      </div>

      {/* Alertas críticas */}
      {vaccineAlerts.overdue.length > 0 && !dismissedAlerts.overdue && (
        <div className="dash-alerts danger">
          <h3>
            ⚠ {vaccineAlerts.overdue.length} vacuna{vaccineAlerts.overdue.length !== 1 ? 's' : ''} vencida{vaccineAlerts.overdue.length !== 1 ? 's' : ''}
            <button onClick={() => dismiss('overdue')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 18 }}>×</button>
          </h3>
          <div className="alert-pills">
            {vaccineAlerts.overdue.slice(0, 8).map((a, i) => (
              <span key={i} className="alert-pill danger">{a.pet} · {a.vaccine} · {a.date}</span>
            ))}
            {vaccineAlerts.overdue.length > 8 && <span className="alert-pill danger">+{vaccineAlerts.overdue.length - 8} más</span>}
          </div>
        </div>
      )}

      {criticalStock.length > 0 && !dismissedAlerts.stock && (
        <div className="dash-alerts danger">
          <h3>
            📦 {criticalStock.length} producto{criticalStock.length !== 1 ? 's' : ''} con stock critico (menos de 10)
            <button onClick={() => dismiss('stock')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 18 }}>×</button>
          </h3>
          <div className="alert-pills">
            {criticalStock.map(i => (
              <span key={i.id} className="alert-pill danger">{i.nombre} · {i.cantidad} unid.</span>
            ))}
          </div>
        </div>
      )}

      {vaccineAlerts.upcoming.length > 0 && !dismissedAlerts.upcoming && (
        <div className="dash-alerts warning">
          <h3>
            💉 {vaccineAlerts.upcoming.length} vacuna{vaccineAlerts.upcoming.length !== 1 ? 's' : ''} en los proximos 7 dias
            <button onClick={() => dismiss('upcoming')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#d97706', fontSize: 18 }}>×</button>
          </h3>
          <div className="alert-pills">
            {vaccineAlerts.upcoming.slice(0, 6).map((a, i) => (
              <span key={i} className="alert-pill warning">{a.pet} · {a.vaccine} · {a.date}</span>
            ))}
          </div>
        </div>
      )}

      {subAlerts.length > 0 && !dismissedAlerts.subs && (
        <div className="dash-alerts info">
          <h3>
            🔄 {subAlerts.length} suscripcion{subAlerts.length !== 1 ? 'es' : ''} con cobro en los proximos 7 dias
            <button onClick={() => dismiss('subs')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#1d4ed8', fontSize: 18 }}>×</button>
          </h3>
          <div className="alert-pills">
            {subAlerts.map(s => (
              <span key={s.id} className="alert-pill info">{s.clientName} · {s.serviceName} · {fmtMoney(s.amount)}</span>
            ))}
          </div>
        </div>
      )}

      {/* KPIs fila 1 — datos de supabase */}
      <div className="dash-kpi-row">
        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: '#eff6ff' }}>👥</div>
          <div className="dash-kpi-val">{filteredClients.length}</div>
          <div className="dash-kpi-lbl">Clientes</div>
          <div className="dash-kpi-sub">{filteredPets.length} mascotas registradas</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: '#fffbeb' }}>📅</div>
          <div className="dash-kpi-val" style={{ color: todayAppointments.length > 0 ? '#d97706' : undefined }}>{todayAppointments.length}</div>
          <div className="dash-kpi-lbl">Citas hoy</div>
          <div className="dash-kpi-sub">{filteredAppointments.length} total registradas</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: '#f0fdf4' }}>💰</div>
          <div className="dash-kpi-val">{fmtMoney(totalIngresos)}</div>
          <div className="dash-kpi-lbl">Ingresos totales</div>
          <div className="dash-kpi-sub">{filteredPayments.length} pagos procesados</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: '#fdf4ff' }}>📦</div>
          <div className="dash-kpi-val" style={{ color: criticalStock.length > 0 ? '#dc2626' : undefined }}>{filteredInventory.length}</div>
          <div className="dash-kpi-lbl">Productos en inventario</div>
          <div className="dash-kpi-sub" style={{ color: criticalStock.length > 0 ? '#dc2626' : undefined }}>
            {criticalStock.length > 0 ? `${criticalStock.length} con stock critico` : 'Stock en buen estado'}
          </div>
        </div>
      </div>

      {/* KPIs fila 2 — nuevos módulos */}
      <div className="dash-kpi-row2">
        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: '#f0fdfa' }}>🔄</div>
          <div className="dash-kpi-val" style={{ color: '#0d9488' }}>{activeSubs.length}</div>
          <div className="dash-kpi-lbl">Suscripciones activas</div>
          <div className="dash-kpi-sub">{fmtMoney(monthlySubRevenue)}/mes estimado</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: '#f0f9ff' }}>🏠</div>
          <div className="dash-kpi-val" style={{ color: presentDaycare.length > 0 ? '#0284c7' : undefined }}>{presentDaycare.length}</div>
          <div className="dash-kpi-lbl">En guarderia ahora</div>
          <div className="dash-kpi-sub">{daycareAttendance.filter(r => r.date === today).length} asistencias hoy</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: '#fff7ed' }}>🐕</div>
          <div className="dash-kpi-val" style={{ color: activeWalks.length > 0 ? '#ea580c' : undefined }}>{activeWalks.length}</div>
          <div className="dash-kpi-lbl">Paseos en curso</div>
          <div className="dash-kpi-sub">{petWalks.filter(w => w.date === today).length} paseos hoy</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: '#fef2f2' }}>💉</div>
          <div className="dash-kpi-val" style={{ color: vaccineAlerts.overdue.length > 0 ? '#dc2626' : '#16a34a' }}>
            {vaccineAlerts.overdue.length > 0 ? vaccineAlerts.overdue.length : vaccineAlerts.upcoming.length}
          </div>
          <div className="dash-kpi-lbl" style={{ color: vaccineAlerts.overdue.length > 0 ? '#dc2626' : undefined }}>
            {vaccineAlerts.overdue.length > 0 ? 'Vacunas vencidas' : 'Vacunas proximas (7d)'}
          </div>
          <div className="dash-kpi-sub">
            {vaccineAlerts.overdue.length === 0 && vaccineAlerts.upcoming.length === 0 ? 'Todas al dia ✓' : 'Revisar modulo mascotas'}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="dash-g2">
        <div className="card">
          <div className="dash-section-title">Ingresos por mes (ultimos 6)</div>
          <div style={{ position: 'relative', height: 220 }}>
            <Bar data={ingresosData} options={{
              ...baseOpts,
              scales: { ...baseOpts.scales, y: { ...baseOpts.scales.y, ticks: { ...baseOpts.scales.y.ticks, callback: v => `$${Math.round(v / 1000)}K` } } },
            }} />
          </div>
        </div>
        <div className="card">
          <div className="dash-section-title">Servicios mas solicitados</div>
          <div className="chart-legend">
            {servicesData.labels.map((label, i) => (
              <div className="leg" key={label}>
                <div className="leg-sq" style={{ background: servicesData.datasets[0].backgroundColor[i] || '#cbd5e1' }} />
                {label}
              </div>
            ))}
          </div>
          <div style={{ position: 'relative', height: 180 }}>
            <Doughnut data={servicesData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '62%' }} />
          </div>
        </div>
      </div>

      {/* Listas: citas hoy + top clientes */}
      <div className="dash-g2b">
        <div className="card">
          <div className="dash-section-title">Citas de hoy ({todayAppointments.length})</div>
          {todayAppointments.length === 0
            ? <p className="dash-empty">Sin citas para hoy</p>
            : todayAppointments.slice(0, 7).map(a => (
              <div className="dash-ri" key={a.id}>
                <div className="dash-ri-av" style={{ background: '#3b82f6' }}>{getInitials(clientsById[String(a.cliente_id)]?.nombre || '')}</div>
                <div className="dash-ri-meta">
                  <strong>{clientsById[String(a.cliente_id)]?.nombre || '-'}</strong>
                  <span>{a.mascotas?.nombre || '-'} · {a.servicios?.nombre || 'Servicio'}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>{a.hora}</span>
              </div>
            ))
          }
          {todayAppointments.length > 7 && (
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
              +{todayAppointments.length - 7} citas más
            </p>
          )}
        </div>

        <div className="card">
          <div className="dash-section-title">Top clientes por facturacion</div>
          {topClients.length === 0
            ? <p className="dash-empty">Sin datos de pagos aun</p>
            : topClients.map((c, i) => (
              <div className="dash-ri" key={c.name}>
                <div className="dash-ri-av" style={{ background: COLORS[i % COLORS.length] }}>{getInitials(c.name)}</div>
                <div className="dash-ri-meta">
                  <strong>{c.name}</strong>
                  <span>Cliente recurrente</span>
                </div>
                <div className="dash-ri-val" style={{ color: '#10b981' }}>{fmtMoney(c.total)}</div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Guardería + Paseos activos */}
      {(presentDaycare.length > 0 || activeWalks.length > 0) && (
        <div className="dash-g2b">
          {presentDaycare.length > 0 && (
            <div className="card">
              <div className="dash-section-title">En guarderia ahora ({presentDaycare.length})</div>
              {presentDaycare.slice(0, 5).map(r => (
                <div className="dash-ri" key={r.id}>
                  <div className="dash-ri-av" style={{ background: '#0284c7' }}>🏠</div>
                  <div className="dash-ri-meta">
                    <strong>{r.petName}</strong>
                    <span>{r.clientName} · Check-in {r.checkIn}</span>
                  </div>
                  <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '2px 9px', fontWeight: 700 }}>Presente</span>
                </div>
              ))}
            </div>
          )}
          {activeWalks.length > 0 && (
            <div className="card">
              <div className="dash-section-title">Paseos en curso ({activeWalks.length})</div>
              {activeWalks.slice(0, 5).map(w => (
                <div className="dash-ri" key={w.id}>
                  <div className="dash-ri-av" style={{ background: '#ea580c' }}>🐕</div>
                  <div className="dash-ri-meta">
                    <strong>{w.petName}</strong>
                    <span>{w.clientName} · {w.walker || 'Sin paseador'}</span>
                  </div>
                  <span style={{ fontSize: 11, background: '#fef3c7', color: '#b45309', borderRadius: 20, padding: '2px 9px', fontWeight: 700 }}>En curso</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notificaciones recientes */}
      {notifications.length > 0 && (
        <div className="card">
          <div className="dash-section-title">Notificaciones recientes</div>
          <div style={{ display: 'grid', gap: 0 }}>
            {notifications.slice(0, 5).map(n => (
              <div className="dash-ri" key={n.id}>
                <div className="dash-ri-av" style={{ background: n.status === 'leida' ? '#94a3b8' : '#0f172a' }}>N</div>
                <div className="dash-ri-meta">
                  <strong>{n.title}</strong>
                  <span>{n.clientName || n.recipient} · {n.channel}</span>
                </div>
                <span style={{ fontSize: 11, color: n.status === 'leida' ? '#94a3b8' : '#1d4ed8', fontWeight: 600 }}>
                  {n.status === 'leida' ? 'Leida' : 'Nueva'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
