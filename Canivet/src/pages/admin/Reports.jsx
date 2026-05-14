import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../services/supabase'
import { useAppConfig } from '../../context/AppConfigContext'
import { fmtMoney } from '../../utils/formatters'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const css = `
.rep-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px; }
@media(max-width:900px){.rep-grid{grid-template-columns:1fr 1fr}}
.rep-card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; cursor:pointer; transition:border-color .15s; }
.rep-card:hover,.rep-card.active { border-color:#3b82f6; }
.rep-icon { width:44px; height:44px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:10px; }
.rep-card h4 { font-size:13px; font-weight:700; margin-bottom:4px; }
.rep-card p  { font-size:12px; color:#64748b; line-height:1.5; }
.export-bar { display:flex; flex-wrap:wrap; gap:8px; margin-top:16px; padding-top:14px; border-top:1px solid #e2e8f0; }
.btn-csv { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; border-radius:8px; padding:8px 14px; font-size:12px; font-weight:600; cursor:pointer; }
.btn-pdf { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; border-radius:8px; padding:8px 14px; font-size:12px; font-weight:600; cursor:pointer; }
.btn-json { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; border-radius:8px; padding:8px 14px; font-size:12px; font-weight:600; cursor:pointer; }
.rep-summary { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:18px; }
@media(max-width:900px){.rep-summary{grid-template-columns:1fr}}
.rep-kpi { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px; }
.rep-kpi strong { display:block; font-size:20px; margin-bottom:4px; }
.rep-kpi span { font-size:12px; color:#64748b; }
`

const REPORT_DEFS = [
  { id: 'ingresos', icon: '$', bg: '#f0fdf4', title: 'Resumen financiero', desc: 'Ingresos, ticket promedio y flujo mensual' },
  { id: 'methods', icon: 'P', bg: '#eff6ff', title: 'Métodos de pago', desc: 'Distribución por canal de cobro' },
  { id: 'services', icon: 'S', bg: '#fffbeb', title: 'Servicios rentables', desc: 'Ingresos estimados por servicio' },
  { id: 'clients', icon: 'C', bg: '#fdf4ff', title: 'Clientes', desc: 'Top clientes y recurrencia' },
  { id: 'pets', icon: '🐾', bg: '#f0f9ff', title: 'Por mascota', desc: 'Servicios, citas y gastos por mascota' },
  { id: 'inventory', icon: 'I', bg: '#fef2f2', title: 'Inventario', desc: 'Valor total y productos críticos' },
  { id: 'branches', icon: 'B', bg: '#f0fdfa', title: 'Sucursales', desc: 'Comparativo operativo por sucursal' },
]

const getMonthKey = (dateStr) => {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const paymentDate = (payment) => payment.fecha || payment.created_at || ''

export const ReportesPage = () => {
  const { activeBranchId, allBranches, filterRecords, getBranchName, getRecordBranchId, getPetVaccines, getPetClinicalHistory, getInvoiceByPaymentId } = useAppConfig()
  const [active, setActive] = useState('ingresos')
  const [clients, setClients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [payments, setPayments] = useState([])
  const [services, setServices] = useState([])
  const [inventory, setInventory] = useState([])
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoadError('')
      const [
        clientsResult,
        appointmentsResult,
        paymentsResult,
        servicesResult,
        inventoryResult,
      ] = await Promise.all([
        supabase.from('clientes').select('*').order('nombre'),
        supabase.from('citas').select('*').order('fecha'),
        supabase.from('pagos').select('*').order('created_at', { ascending: false }),
        supabase.from('servicios').select('*').order('nombre'),
        supabase.from('inventario').select('*').order('producto'),
      ])

      const firstError = clientsResult.error || appointmentsResult.error || paymentsResult.error || servicesResult.error || inventoryResult.error
      if (firstError) {
        setLoadError(firstError.message || 'No se pudieron cargar los reportes')
      }

      setClients(clientsResult.data || [])
      setAppointments(appointmentsResult.data || [])
      setPayments(paymentsResult.data || [])
      setServices(servicesResult.data || [])
      setInventory(inventoryResult.data || [])
    }

    load()
  }, [])

  const visibleClients = filterRecords('clients', clients)
  const visibleAppointments = filterRecords('appointments', appointments)
  const visiblePayments = filterRecords('payments', payments)
  const visibleServices = filterRecords('services', services)
  const visibleInventory = filterRecords('inventory', inventory)

  const paymentsByMonth = useMemo(() => {
    const totals = new Map()
    const now = new Date()
    const monthKeys = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    })

    visiblePayments.forEach((payment) => {
      const invoiceDate = getInvoiceByPaymentId(payment.id)?.date
      const key = getMonthKey(invoiceDate || paymentDate(payment))
      if (!key) return
      totals.set(key, (totals.get(key) || 0) + Number(payment.monto || 0))
    })

    return {
      labels: monthKeys.map((key) => MONTHS[Number(key.slice(5)) - 1]),
      values: monthKeys.map((key) => totals.get(key) || 0),
    }
  }, [getInvoiceByPaymentId, visiblePayments])

  const servicesRevenue = useMemo(() => {
    const servicesById = Object.fromEntries(visibleServices.map((service) => [String(service.id), service]))
    const counts = visibleAppointments.reduce((acc, appointment) => {
      const serviceId = String(appointment.servicio_id || '')
      acc[serviceId] = (acc[serviceId] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([serviceId, count]) => {
        const service = servicesById[serviceId]
        const price = Number(service?.precio || 0)
        return { name: service?.nombre || 'Servicio', requests: count, price, total: count * price }
      })
      .sort((a, b) => b.total - a.total)
  }, [visibleAppointments, visibleServices])

  const clientsTotals = useMemo(() => {
    const totals = visiblePayments.reduce((acc, payment) => {
      acc[payment.cliente_id] = (acc[payment.cliente_id] || 0) + Number(payment.monto || 0)
      return acc
    }, {})

    return Object.entries(totals)
      .map(([clientId, total]) => ({
        name: visibleClients.find((client) => String(client.id) === String(clientId))?.nombre || 'Cliente',
        total,
        visits: visibleAppointments.filter((appointment) => String(appointment.cliente_id) === String(clientId)).length,
      }))
      .sort((a, b) => b.total - a.total)
  }, [visibleAppointments, visibleClients, visiblePayments])

  const branchSummary = useMemo(() => (
    allBranches.map((branch) => {
      const branchAppointments = appointments.filter((appointment) => getRecordBranchId('appointments', appointment.id) === branch.id)
      const branchPayments = payments.filter((payment) => getRecordBranchId('payments', payment.id) === branch.id)
      return {
        name: branch.name,
        city: branch.city,
        status: branch.status,
        appointments: branchAppointments.length,
        revenue: branchPayments.reduce((sum, payment) => sum + Number(payment.monto || 0), 0),
      }
    })
  ), [allBranches, appointments, getRecordBranchId, payments])

  const inventorySummary = useMemo(() => (
    visibleInventory.map((item) => ({
      name: item.nombre || item.producto || 'Producto',
      stock: Number(item.cantidad || 0),
      price: Number(item.precio || 0),
      total: Number(item.cantidad || 0) * Number(item.precio || 0),
      status: Number(item.cantidad || 0) < 10 ? 'Crítico' : Number(item.cantidad || 0) < 25 ? 'Bajo' : 'Normal',
    }))
  ), [visibleInventory])

  const petsSummary = useMemo(() => (
    visibleClients.flatMap(client => {
      const clientPets = appointments
        .filter(a => String(a.cliente_id) === String(client.id))
        .reduce((map, a) => {
          const pId = String(a.mascota_id || '')
          if (!map[pId]) map[pId] = { petId: pId, visits: 0 }
          map[pId].visits++
          return map
        }, {})

      return Object.values(clientPets).map(({ petId, visits }) => {
        const petPayments = payments.filter(p => String(p.cliente_id) === String(client.id))
        const total = petPayments.reduce((sum, p) => sum + Number(p.monto || 0), 0) / Math.max(Object.keys(clientPets).length, 1)
        const vaccines = getPetVaccines(petId)
        const history = getPetClinicalHistory(petId)
        const petAppts = visibleAppointments.filter(a => String(a.mascota_id) === petId)
        const petName = petAppts[0] ? null : null
        return {
          petId,
          clientName: client.nombre,
          visits: petAppts.length,
          totalEstimado: Math.round(total),
          vacunas: vaccines.length,
          consultas: history.length,
        }
      })
    }).sort((a, b) => b.visits - a.visits)
  ), [appointments, getPetClinicalHistory, getPetVaccines, payments, visibleAppointments, visibleClients])

  const totalRevenue = visiblePayments.reduce((sum, payment) => sum + Number(payment.monto || 0), 0)
  const averageTicket = visiblePayments.length ? totalRevenue / visiblePayments.length : 0
  const inventoryValue = inventorySummary.reduce((sum, item) => sum + item.total, 0)

  const activeReport = useMemo(() => {
    if (active === 'ingresos') {
      return {
        title: 'resumen-financiero',
        headers: ['Mes', 'Ingresos'],
        rows: paymentsByMonth.labels.map((label, index) => [label, fmtMoney(paymentsByMonth.values[index])]),
      }
    }

    if (active === 'methods') {
      const methodTotals = visiblePayments.reduce((acc, payment) => {
        const key = payment.metodo || 'sin método'
        acc[key] = (acc[key] || 0) + Number(payment.monto || 0)
        return acc
      }, {})

      return {
        title: 'metodos-de-pago',
        headers: ['Método', 'Monto'],
        rows: Object.entries(methodTotals).map(([method, total]) => [method, fmtMoney(total)]),
      }
    }

    if (active === 'services') {
      return {
        title: 'rentabilidad-servicios',
        headers: ['Servicio', 'Solicitudes', 'Precio', 'Ingresos estimados'],
        rows: servicesRevenue.map((service) => [service.name, service.requests, fmtMoney(service.price), fmtMoney(service.total)]),
      }
    }

    if (active === 'clients') {
      return {
        title: 'clientes-top',
        headers: ['Cliente', 'Visitas', 'Total pagado'],
        rows: clientsTotals.slice(0, 10).map((client) => [client.name, client.visits, fmtMoney(client.total)]),
      }
    }

    if (active === 'pets') {
      return {
        title: 'reporte-por-mascota',
        headers: ['ID Mascota', 'Dueño', 'Citas', 'Vacunas', 'Consultas', 'Total estimado'],
        rows: petsSummary.map(p => [p.petId.slice(-6), p.clientName, p.visits, p.vacunas, p.consultas, fmtMoney(p.totalEstimado)]),
      }
    }

    if (active === 'inventory') {
      return {
        title: 'inventario',
        headers: ['Producto', 'Stock', 'Precio', 'Valor total', 'Estado'],
        rows: inventorySummary.map((item) => [item.name, item.stock, fmtMoney(item.price), fmtMoney(item.total), item.status]),
      }
    }

    return {
      title: 'sucursales',
      headers: ['Sucursal', 'Ciudad', 'Estado', 'Citas', 'Ingresos'],
      rows: branchSummary.map((branch) => [branch.name, branch.city, branch.status, branch.appointments, fmtMoney(branch.revenue)]),
    }
  }, [active, branchSummary, clientsTotals, inventorySummary, paymentsByMonth.labels, paymentsByMonth.values, petsSummary, servicesRevenue, visiblePayments])

  const exportBlob = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const csv = [activeReport.headers, ...activeReport.rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    exportBlob(csv, `${activeReport.title}.csv`, 'text/csv;charset=utf-8;')
  }

  const exportJSON = () => {
    const content = JSON.stringify(
      activeReport.rows.map((row) => Object.fromEntries(activeReport.headers.map((header, index) => [header, row[index]]))),
      null,
      2,
    )
    exportBlob(content, `${activeReport.title}.json`, 'application/json;charset=utf-8;')
  }

  const exportPDF = () => {
    const popup = window.open('', '_blank')
    if (!popup) return

    const rowsHtml = activeReport.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')
    popup.document.write(`
      <html>
        <head>
          <title>${activeReport.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { font-size: 18px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>${activeReport.title}</h1>
          <table>
            <thead><tr>${activeReport.headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>
    `)
    popup.document.close()
    popup.focus()
    setTimeout(() => popup.print(), 300)
  }

  const chartContent = () => {
    if (active === 'ingresos') {
      return (
        <Bar
          data={{
            labels: paymentsByMonth.labels,
            datasets: [{ label: 'Ingresos', data: paymentsByMonth.values, backgroundColor: '#3b82f6', borderRadius: 4 }],
          }}
          options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
        />
      )
    }

    if (active === 'methods') {
      const methodRows = activeReport.rows
      return (
        <Doughnut
          data={{
            labels: methodRows.map((row) => row[0]),
            datasets: [{ data: methodRows.map((row) => Number(String(row[1]).replace(/[^\d.-]/g, ''))), backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'], borderWidth: 0 }],
          }}
          options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '65%' }}
        />
      )
    }

    if (active === 'services') {
      return (
        <Bar
          data={{
            labels: servicesRevenue.slice(0, 5).map((service) => service.name),
            datasets: [{ label: 'Ingresos', data: servicesRevenue.slice(0, 5).map((service) => service.total), backgroundColor: '#8b5cf6', borderRadius: 4 }],
          }}
          options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
        />
      )
    }

    if (active === 'branches') {
      return (
        <Bar
          data={{
            labels: branchSummary.map((branch) => branch.name),
            datasets: [{ label: 'Ingresos', data: branchSummary.map((branch) => branch.revenue), backgroundColor: '#10b981', borderRadius: 4 }],
          }}
          options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
        />
      )
    }

    return (
      <Bar
        data={{
          labels: activeReport.rows.slice(0, 5).map((row) => row[0]),
          datasets: [{ label: 'Valor', data: activeReport.rows.slice(0, 5).map((row) => Number(row[1]) || Number(String(row[2] || row[3] || 0).replace(/[^\d.-]/g, ''))), backgroundColor: '#3b82f6', borderRadius: 4 }],
        }}
        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
      />
    )
  }

  const branchLabel = activeBranchId === 'all' ? 'Todas las sucursales' : getBranchName(activeBranchId)

  return (
    <>
      <style>{css}</style>
      <div className="page-header">
        <div>
          <h1>Reportes</h1>
          <p>{branchLabel} - análisis financiero y exportaciones reales</p>
        </div>
      </div>
      <ErrorBanner message={loadError} />

      <div className="rep-summary">
        <div className="rep-kpi"><strong>{fmtMoney(totalRevenue)}</strong><span>Ingresos acumulados</span></div>
        <div className="rep-kpi"><strong>{fmtMoney(averageTicket)}</strong><span>Ticket promedio</span></div>
        <div className="rep-kpi"><strong>{fmtMoney(inventoryValue)}</strong><span>Valor de inventario</span></div>
      </div>

      <div className="rep-grid">
        {REPORT_DEFS.map((report) => (
          <div className={`rep-card ${active === report.id ? 'active' : ''}`} key={report.id} onClick={() => setActive(report.id)}>
            <div className="rep-icon" style={{ background: report.bg }}>{report.icon}</div>
            <h4>{report.title}</h4>
            <p>{report.desc}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ position: 'relative', height: 220, marginBottom: 18 }}>
          {chartContent()}
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>{activeReport.headers.map((header) => <th key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {activeReport.rows.length === 0 ? (
                <tr><td colSpan={activeReport.headers.length} className="empty-state">Sin datos disponibles</td></tr>
              ) : activeReport.rows.map((row, index) => (
                <tr key={`${activeReport.title}-${index}`}>
                  {row.map((value, cellIndex) => <td key={cellIndex}>{value}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="export-bar">
          <button className="btn-csv" onClick={exportCSV}>Exportar CSV</button>
          <button className="btn-json" onClick={exportJSON}>Exportar JSON</button>
          <button className="btn-pdf" onClick={exportPDF}>Exportar PDF</button>
        </div>
      </div>
    </>
  )
}
