import { useCallback, useMemo, useState } from 'react'
import { useSupabaseCRUD } from '../../hooks/useSupabaseCRUD'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { useAppConfig } from '../../context/AppConfigContext'
import { fmtAge, fmtDate } from '../../utils/formatters'
import { validatePetForm } from '../../utils/validators'
import { supabase } from '../../services/supabase'
import { backend } from '../../services/backend'

const EMPTY = { nombre: '', tipo: 'Perro', raza: '', edad: '', cliente_id: '', branch_id: '' }
const EMPTY_VACCINE = { id: null, name: '', appliedAt: '', nextDoseAt: '', veterinarian: '', notes: '' }
const EMPTY_CLINICAL = {
  id: null,
  consultationDate: '',
  reason: '',
  symptoms: '',
  diagnosis: '',
  treatment: '',
  observations: '',
  weight: '',
  veterinarian: '',
}
const TIPOS = ['Perro', 'Gato', 'Ave', 'Reptil', 'Otro']
const TIPO_TAG = { Perro: 'tag-blue', Gato: 'tag-green', Ave: 'tag-amber', Reptil: 'tag-purple', Otro: '' }
const VACCINE_OPTIONS = ['Rabia', 'Quintuple canina', 'Parvovirus', 'Moquillo', 'Bordetella', 'Desparasitacion', 'Refuerzo general']
const ALERT_WINDOW_DAYS = 30

const css = `
.pet-health-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:18px; }
@media(max-width:900px){.pet-health-grid{grid-template-columns:1fr}}
.pet-health-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:16px; }
.pet-health-card strong { display:block; font-size:24px; margin-bottom:4px; color:#0f172a; }
.pet-health-card span { font-size:13px; color:#64748b; }
.pet-alerts { background:#fff7ed; border:1px solid #fdba74; border-radius:14px; padding:16px; margin-bottom:18px; }
.pet-alerts h3 { margin:0 0 10px; font-size:15px; color:#9a3412; }
.pet-alerts ul { margin:0; padding-left:18px; color:#7c2d12; }
.pet-alerts li { margin-bottom:6px; }
.pet-panel-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
.pet-card-list { display:grid; gap:10px; margin-top:16px; }
.pet-card-item { border:1px solid #e2e8f0; border-radius:12px; padding:12px; background:#f8fafc; }
.pet-card-item strong { display:block; margin-bottom:4px; color:#0f172a; }
.pet-card-item p { margin:0 0 8px; color:#64748b; font-size:13px; line-height:1.5; }
.pet-card-actions { display:flex; gap:8px; flex-wrap:wrap; }
`

const parseDate = (value) => {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

const addDays = (date, days) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const getVaccineStatus = (nextDoseAt) => {
  if (!nextDoseAt) {
    return { key: 'sin_fecha', label: 'Sin proxima dosis', tag: 'tag-blue' }
  }

  const dueDate = parseDate(nextDoseAt)
  if (!dueDate) {
    return { key: 'sin_fecha', label: 'Sin proxima dosis', tag: 'tag-blue' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingLimit = addDays(today, ALERT_WINDOW_DAYS)

  if (dueDate < today) {
    return { key: 'vencida', label: 'Vencida', tag: 'tag-red' }
  }

  if (dueDate <= upcomingLimit) {
    return { key: 'proxima', label: 'Proxima', tag: 'tag-amber' }
  }

  return { key: 'al_dia', label: 'Al dia', tag: 'tag-green' }
}

const getPetHealthSummary = (vaccines = []) => {
  const scheduledVaccines = vaccines.filter(vaccine => vaccine.nextDoseAt)

  if (scheduledVaccines.length === 0) {
    return {
      key: 'sin_calendario',
      label: 'Sin calendario',
      tag: 'tag-blue',
      nextDoseAt: '',
      dueCount: 0,
    }
  }

  const withStatus = scheduledVaccines.map(vaccine => ({
    ...vaccine,
    status: getVaccineStatus(vaccine.nextDoseAt),
  }))

  const overdueVaccines = withStatus.filter(vaccine => vaccine.status.key === 'vencida')
  if (overdueVaccines.length) {
    const nextItem = overdueVaccines.sort((a, b) => String(a.nextDoseAt).localeCompare(String(b.nextDoseAt)))[0]
    return {
      key: 'vencida',
      label: 'Vencida',
      tag: 'tag-red',
      nextDoseAt: nextItem.nextDoseAt,
      dueCount: overdueVaccines.length,
    }
  }

  const upcomingVaccines = withStatus.filter(vaccine => vaccine.status.key === 'proxima')
  if (upcomingVaccines.length) {
    const nextItem = upcomingVaccines.sort((a, b) => String(a.nextDoseAt).localeCompare(String(b.nextDoseAt)))[0]
    return {
      key: 'proxima',
      label: 'Proxima',
      tag: 'tag-amber',
      nextDoseAt: nextItem.nextDoseAt,
      dueCount: upcomingVaccines.length,
    }
  }

  const nextFuture = withStatus.sort((a, b) => String(a.nextDoseAt).localeCompare(String(b.nextDoseAt)))[0]
  return {
    key: 'al_dia',
    label: 'Al dia',
    tag: 'tag-green',
    nextDoseAt: nextFuture?.nextDoseAt || '',
    dueCount: 0,
  }
}

const getLatestClinicalSummary = (entries = []) => {
  if (!entries.length) {
    return {
      count: 0,
      lastDate: '',
      diagnosis: 'Sin historial',
      veterinarian: '',
    }
  }

  const latest = [...entries].sort((a, b) => String(b.consultationDate).localeCompare(String(a.consultationDate)))[0]
  return {
    count: entries.length,
    lastDate: latest?.consultationDate || '',
    diagnosis: latest?.diagnosis || latest?.reason || 'Sin diagnostico',
    veterinarian: latest?.veterinarian || '',
  }
}

export const MascotasPage = () => {
  const { records, loading, error, load, create, update, remove } = useSupabaseCRUD('mascotas', 'nombre')
  const { records: clientes, error: clientsError, load: loadClients } = useSupabaseCRUD('clientes', 'nombre')
  const {
    branches,
    preferredBranchId,
    preferences,
    filterRecords,
    assignRecordBranch,
    getRecordBranchId,
    getBranchName,
    getPetVaccines,
    savePetVaccine,
    removePetVaccine,
    clearPetVaccines,
    getPetClinicalHistory,
    savePetClinicalEntry,
    removePetClinicalEntry,
    clearPetClinicalHistory,
    createNotification,
    petWalks,
    daycareAttendance,
    getServicePhotos,
  } = useAppConfig()
  const { toast, show } = useToast()
  const [search, setSearch] = useState('')
  const [healthFilter, setHealthFilter] = useState('todas')
  const [modal, setModal] = useState(false)
  const [vaccineModal, setVaccineModal] = useState(false)
  const [clinicalModal, setClinicalModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [vaccineForm, setVaccineForm] = useState(EMPTY_VACCINE)
  const [clinicalForm, setClinicalForm] = useState(EMPTY_CLINICAL)
  const [editing, setEditing] = useState(null)
  const [selectedPet, setSelectedPet] = useState(null)
  const [errors, setErrors] = useState({})
  const [vaccineErrors, setVaccineErrors] = useState({})
  const [clinicalErrors, setClinicalErrors] = useState({})
  const [profilePet, setProfilePet] = useState(null)
  const [profileTab, setProfileTab] = useState('resumen')
  const [profileAppts, setProfileAppts] = useState([])

  const clientesVisibles = filterRecords('clients', clientes)
  const visibleRecords = filterRecords('pets', records)
  const clientName = useCallback(
    (id) => clientes.find(client => String(client.id) === String(id))?.nombre || '-',
    [clientes],
  )
  const loadError = error || clientsError

  const petHealthMap = useMemo(() => (
    Object.fromEntries(
      visibleRecords.map((pet) => [pet.id, getPetHealthSummary(getPetVaccines(pet.id))]),
    )
  ), [getPetVaccines, visibleRecords])

  const petClinicalMap = useMemo(() => (
    Object.fromEntries(
      visibleRecords.map((pet) => [pet.id, getLatestClinicalSummary(getPetClinicalHistory(pet.id))]),
    )
  ), [getPetClinicalHistory, visibleRecords])

  const filtered = visibleRecords.filter((pet) => {
    const summary = petHealthMap[pet.id] || getPetHealthSummary([])
    const clinical = petClinicalMap[pet.id] || getLatestClinicalSummary([])

    return (
      (
        pet.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (pet.raza || '').toLowerCase().includes(search.toLowerCase()) ||
        clientName(pet.cliente_id).toLowerCase().includes(search.toLowerCase()) ||
        clinical.diagnosis.toLowerCase().includes(search.toLowerCase())
      ) &&
      (healthFilter === 'todas' || summary.key === healthFilter)
    )
  })

  const healthCounts = useMemo(() => (
    visibleRecords.reduce((acc, pet) => {
      const summary = petHealthMap[pet.id] || getPetHealthSummary([])
      acc[summary.key] = (acc[summary.key] || 0) + 1
      return acc
    }, { al_dia: 0, proxima: 0, vencida: 0, sin_calendario: 0 })
  ), [petHealthMap, visibleRecords])

  const vaccineAlerts = useMemo(() => {
    return visibleRecords
      .flatMap((pet) => {
        const ownerName = clientName(pet.cliente_id)
        return getPetVaccines(pet.id)
          .map((vaccine) => {
            const status = getVaccineStatus(vaccine.nextDoseAt)
            if (!['vencida', 'proxima'].includes(status.key)) return null

            return {
              id: `${pet.id}-${vaccine.id}`,
              petName: pet.nombre,
              ownerName,
              vaccineName: vaccine.name,
              nextDoseAt: vaccine.nextDoseAt,
              status,
            }
          })
          .filter(Boolean)
      })
      .sort((a, b) => {
        if (a.status.key !== b.status.key) return a.status.key === 'vencida' ? -1 : 1
        return String(a.nextDoseAt).localeCompare(String(b.nextDoseAt))
      })
  }, [clientName, getPetVaccines, visibleRecords])

  const selectedPetVaccines = useMemo(() => (
    selectedPet ? getPetVaccines(selectedPet.id) : []
  ), [getPetVaccines, selectedPet])

  const selectedPetClinicalHistory = useMemo(() => (
    selectedPet ? getPetClinicalHistory(selectedPet.id) : []
  ), [getPetClinicalHistory, selectedPet])

  const openProfile = async (pet) => {
    setProfilePet(pet)
    setProfileTab('resumen')
    setProfileAppts([])
    const { data } = await supabase
      .from('citas')
      .select('*,servicios(nombre)')
      .eq('mascota_id', pet.id)
      .order('fecha', { ascending: false })
      .limit(20)
    setProfileAppts(data || [])
  }

  const openCreate = () => {
    setForm({ ...EMPTY, branch_id: preferredBranchId })
    setEditing(null)
    setErrors({})
    setModal(true)
  }

  const openEdit = (pet) => {
    setForm({
      nombre: pet.nombre,
      tipo: pet.tipo,
      raza: pet.raza || '',
      edad: pet.edad || '',
      cliente_id: pet.cliente_id,
      branch_id: getRecordBranchId('pets', pet.id),
    })
    setEditing(pet.id)
    setErrors({})
    setModal(true)
  }

  const openVaccines = (pet) => {
    setSelectedPet(pet)
    setVaccineForm(EMPTY_VACCINE)
    setVaccineErrors({})
    setVaccineModal(true)
  }

  const openClinicalHistory = (pet) => {
    setSelectedPet(pet)
    setClinicalForm(EMPTY_CLINICAL)
    setClinicalErrors({})
    setClinicalModal(true)
  }

  const handleSave = async () => {
    const nextErrors = validatePetForm(form)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const payload = {
      nombre: form.nombre,
      tipo: form.tipo,
      raza: form.raza,
      edad: parseInt(form.edad, 10) || 0,
      cliente_id: form.cliente_id,
    }

    const { data, error } = editing ? await update(editing, payload) : await create(payload)
    if (error) {
      show(`Error: ${error.message}`, false)
      return
    }

    assignRecordBranch('pets', editing || data?.[0]?.id, form.branch_id)
    show(editing ? 'Mascota actualizada' : 'Mascota registrada')
    setModal(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta mascota?')) return
    const { error } = await remove(id)
    if (error) {
      show('Error al eliminar', false)
      return
    }

    try {
      await clearPetVaccines(id)
    } catch (cleanupError) {
      show(`Mascota eliminada, pero no se pudieron limpiar las vacunas: ${cleanupError.message}`, false)
      return
    }
    try {
      await clearPetClinicalHistory(id)
    } catch (cleanupError) {
      show(`Mascota eliminada, pero no se pudo limpiar el historial clinico: ${cleanupError.message}`, false)
      return
    }
    show('Mascota eliminada')
  }

  const handleSaveVaccine = async () => {
    if (!selectedPet) return

    const nextErrors = {}
    if (!vaccineForm.name.trim()) nextErrors.name = 'Selecciona una vacuna'
    if (!vaccineForm.appliedAt) nextErrors.appliedAt = 'Indica la fecha aplicada'

    if (Object.keys(nextErrors).length) {
      setVaccineErrors(nextErrors)
      return
    }

    let savedVaccine
    try {
      savedVaccine = await savePetVaccine(selectedPet.id, vaccineForm)
    } catch (error) {
      show(`Error guardando vacuna: ${error.message}`, false)
      return
    }
    const owner = clientes.find(client => String(client.id) === String(selectedPet.cliente_id))
    const vaccineStatus = getVaccineStatus(savedVaccine?.nextDoseAt)

    if (savedVaccine?.nextDoseAt && (preferences.emailNotifications || preferences.reminderNotifications)) {
      createNotification({
        type: 'vacuna',
        title: vaccineStatus.key === 'vencida' ? 'Vacuna vencida' : 'Vacuna programada',
        message: `${savedVaccine.name} para ${selectedPet.nombre} queda ${vaccineStatus.label.toLowerCase()} con proxima dosis el ${savedVaccine.nextDoseAt}.`,
        recipient: owner?.email || owner?.telefono || owner?.nombre || 'Dueño sin contacto',
        clientId: owner?.id,
        clientName: owner?.nombre || '',
        branchId: getRecordBranchId('pets', selectedPet.id),
        channel: preferences.emailNotifications ? 'email' : 'interna',
      })
    }

    show(vaccineForm.id ? 'Vacuna actualizada' : 'Vacuna agregada')
    setVaccineForm(EMPTY_VACCINE)
    setVaccineErrors({})
  }

  const handleEditVaccine = (vaccine) => {
    setVaccineForm({
      id: vaccine.id,
      name: vaccine.name,
      appliedAt: vaccine.appliedAt || '',
      nextDoseAt: vaccine.nextDoseAt || '',
      veterinarian: vaccine.veterinarian || '',
      notes: vaccine.notes || '',
    })
    setVaccineErrors({})
  }

  const handleDeleteVaccine = async (vaccineId) => {
    if (!selectedPet || !window.confirm('¿Eliminar este registro de vacuna?')) return
    try {
      await removePetVaccine(selectedPet.id, vaccineId)
    } catch (error) {
      show(`Error eliminando vacuna: ${error.message}`, false)
      return
    }
    if (vaccineForm.id === vaccineId) {
      setVaccineForm(EMPTY_VACCINE)
    }
    show('Vacuna eliminada')
  }

  // Enviar alerta de vacuna a un dueño específico
  const handleSendVaccineAlert = async (pet, vaccine, ownerEmail, ownerName) => {
    if (!ownerEmail) { show('Este dueño no tiene email registrado', false); return }
    const status = getVaccineStatus(vaccine.nextDoseAt)
    try {
      await backend.emailAlertaVacuna({
        email:             ownerEmail,
        nombre_dueno:      ownerName,
        nombre_mascota:    pet.nombre,
        vacuna:            vaccine.name,
        fecha_vencimiento: vaccine.nextDoseAt || 'No indicada',
        vencida:           status.key === 'vencida',
      })
      show(`Alerta enviada a ${ownerEmail}`)
    } catch {
      show('Error al enviar la alerta', false)
    }
  }

  // Enviar alertas masivas a todos los dueños con vacunas pendientes
  const handleSendAllVaccineAlerts = async () => {
    const alerts = vaccineAlerts.filter(a => a.status.key === 'vencida' || a.status.key === 'proxima')
    if (!alerts.length) { show('No hay alertas sanitarias pendientes'); return }

    let sent = 0; let skipped = 0
    for (const alert of alerts) {
      const pet = records.find(p => p.nombre === alert.petName)
      if (!pet) { skipped++; continue }
      const owner = clientes.find(c => String(c.id) === String(pet.cliente_id))
      if (!owner?.email) { skipped++; continue }
      try {
        await backend.emailAlertaVacuna({
          email: owner.email, nombre_dueno: owner.nombre,
          nombre_mascota: alert.petName, vacuna: alert.vaccineName,
          fecha_vencimiento: alert.nextDoseAt, vencida: alert.status.key === 'vencida',
        })
        sent++
      } catch { skipped++ }
    }
    show(`${sent} alerta${sent !== 1 ? 's' : ''} enviada${sent !== 1 ? 's' : ''}${skipped > 0 ? ` · ${skipped} sin email` : ''}`)
  }

  const handleSaveClinicalEntry = async () => {
    if (!selectedPet) return

    const nextErrors = {}
    if (!clinicalForm.consultationDate) nextErrors.consultationDate = 'Indica la fecha de consulta'
    if (!clinicalForm.reason.trim()) nextErrors.reason = 'Indica el motivo de consulta'

    if (Object.keys(nextErrors).length) {
      setClinicalErrors(nextErrors)
      return
    }

    let savedEntry
    try {
      savedEntry = await savePetClinicalEntry(selectedPet.id, clinicalForm)
    } catch (error) {
      show(`Error guardando consulta: ${error.message}`, false)
      return
    }
    const owner = clientes.find(client => String(client.id) === String(selectedPet.cliente_id))

    if (preferences.emailNotifications || preferences.reminderNotifications) {
      createNotification({
        type: 'historial',
        title: clinicalForm.id ? 'Historial clínico actualizado' : 'Nueva consulta registrada',
        message: `Se actualizó el historial clínico de ${selectedPet.nombre} con consulta del ${savedEntry?.consultationDate}. Diagnóstico: ${savedEntry?.diagnosis || savedEntry?.reason}.`,
        recipient: owner?.email || owner?.telefono || owner?.nombre || 'Dueño sin contacto',
        clientId: owner?.id,
        clientName: owner?.nombre || '',
        branchId: getRecordBranchId('pets', selectedPet.id),
        channel: preferences.emailNotifications ? 'email' : 'interna',
      })
    }

    show(clinicalForm.id ? 'Consulta actualizada' : 'Consulta registrada')
    setClinicalForm(EMPTY_CLINICAL)
    setClinicalErrors({})
  }

  const handleEditClinicalEntry = (entry) => {
    setClinicalForm({
      id: entry.id,
      consultationDate: entry.consultationDate || '',
      reason: entry.reason || '',
      symptoms: entry.symptoms || '',
      diagnosis: entry.diagnosis || '',
      treatment: entry.treatment || '',
      observations: entry.observations || '',
      weight: entry.weight || '',
      veterinarian: entry.veterinarian || '',
    })
    setClinicalErrors({})
  }

  const handleDeleteClinicalEntry = async (entryId) => {
    if (!selectedPet || !window.confirm('¿Eliminar esta consulta del historial?')) return
    try {
      await removePetClinicalEntry(selectedPet.id, entryId)
    } catch (error) {
      show(`Error eliminando consulta: ${error.message}`, false)
      return
    }
    if (clinicalForm.id === entryId) {
      setClinicalForm(EMPTY_CLINICAL)
    }
    show('Consulta eliminada')
  }

  return (
    <>
      <style>{css}</style>
      <Toast toast={toast} />
      <ErrorBanner
        message={loadError ? `No se pudieron cargar las mascotas: ${loadError.message}` : ''}
        onRetry={() => {
          load()
          loadClients()
        }}
      />

      <div className="page-header">
        <div>
          <h1>Mascotas</h1>
          <p>{visibleRecords.length} registros, {vaccineAlerts.length} alertas sanitarias y historial clínico por mascota</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nueva mascota</button>
      </div>

      <div className="pet-health-grid">
        <button
          className="pet-health-card"
          onClick={() => setHealthFilter(current => current === 'al_dia' ? 'todas' : 'al_dia')}
          style={{ borderColor: healthFilter === 'al_dia' ? '#16a34a' : '#e2e8f0' }}
        >
          <strong>{healthCounts.al_dia || 0}</strong>
          <span>Mascotas al día</span>
        </button>
        <button
          className="pet-health-card"
          onClick={() => setHealthFilter(current => current === 'proxima' ? 'todas' : 'proxima')}
          style={{ borderColor: healthFilter === 'proxima' ? '#f59e0b' : '#e2e8f0' }}
        >
          <strong>{healthCounts.proxima || 0}</strong>
          <span>Con vacunas próximas en {ALERT_WINDOW_DAYS} días</span>
        </button>
        <button
          className="pet-health-card"
          onClick={() => setHealthFilter(current => current === 'vencida' ? 'todas' : 'vencida')}
          style={{ borderColor: healthFilter === 'vencida' ? '#dc2626' : '#e2e8f0' }}
        >
          <strong>{healthCounts.vencida || 0}</strong>
          <span>Con esquema vencido</span>
        </button>
      </div>

      {vaccineAlerts.length > 0 && (
        <div className="pet-alerts">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>Alertas sanitarias ({vaccineAlerts.length})</h3>
            <button
              className="btn-edit"
              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: 12 }}
              onClick={handleSendAllVaccineAlerts}
            >
              📧 Enviar alertas a todos
            </button>
          </div>
          <ul>
            {vaccineAlerts.slice(0, 6).map(alert => (
              <li key={alert.id}>
                <strong>{alert.petName}</strong> - {alert.vaccineName} {alert.status.key === 'vencida' ? 'vencida' : 'programada'} para {fmtDate(alert.nextDoseAt)}. Dueño: {alert.ownerName}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <div className="form-row">
          <input
            className="form-input"
            placeholder="Buscar por nombre, raza, dueño o diagnóstico..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select className="form-select" value={healthFilter} onChange={(event) => setHealthFilter(event.target.value)}>
            <option value="todas">Todos los estados sanitarios</option>
            <option value="al_dia">Al día</option>
            <option value="proxima">Próxima</option>
            <option value="vencida">Vencida</option>
            <option value="sin_calendario">Sin calendario</option>
          </select>
        </div>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Raza</th>
              <th>Edad</th>
              <th>Dueño</th>
              <th>Próxima dosis</th>
              <th>Última consulta</th>
              <th>Estado sanitario</th>
              <th>Sucursal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="empty-state">Cargando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={10} className="empty-state">Sin mascotas</td></tr>
            ) : filtered.map((pet) => {
              const summary = petHealthMap[pet.id] || getPetHealthSummary([])
              const clinical = petClinicalMap[pet.id] || getLatestClinicalSummary([])
              return (
                <tr key={pet.id}>
                  <td><strong>{pet.nombre}</strong></td>
                  <td><span className={`tag ${TIPO_TAG[pet.tipo] || ''}`}>{pet.tipo}</span></td>
                  <td>{pet.raza || '-'}</td>
                  <td>{fmtAge(pet.edad)}</td>
                  <td>{clientName(pet.cliente_id)}</td>
                  <td>{summary.nextDoseAt ? fmtDate(summary.nextDoseAt) : 'Sin fecha'}</td>
                  <td>{clinical.lastDate ? fmtDate(clinical.lastDate) : 'Sin historial'}</td>
                  <td>
                    <span className={`tag ${summary.tag}`}>
                      {summary.label}{summary.dueCount > 1 ? ` (${summary.dueCount})` : ''}
                    </span>
                  </td>
                  <td><span className="tag tag-blue">{getBranchName(getRecordBranchId('pets', pet.id))}</span></td>
                  <td>
                    <div className="act-btns">
                      <button className="btn-edit" style={{ background: '#0f172a', color: '#fff' }} onClick={() => openProfile(pet)}>Ficha</button>
                      <button className="btn-edit" onClick={() => openVaccines(pet)}>Vacunas</button>
                      <button className="btn-edit" onClick={() => openClinicalHistory(pet)}>Historial</button>
                      <button className="btn-edit" onClick={() => openEdit(pet)}>Editar</button>
                      <button className="btn-del" onClick={() => handleDelete(pet.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={editing ? 'Editar mascota' : 'Nueva mascota'}
          onClose={() => setModal(false)}
          onSave={handleSave}
          saveLabel={editing ? 'Guardar cambios' : 'Registrar'}
        >
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input className="form-input" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} />
              {errors.nombre && <p className="form-error">{errors.nombre}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select className="form-select" value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value })}>
                {TIPOS.map(tipo => <option key={tipo}>{tipo}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Raza</label>
              <input className="form-input" value={form.raza} placeholder="Ej: Labrador" onChange={(event) => setForm({ ...form, raza: event.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Edad (años)</label>
              <input className="form-input" type="number" min="0" value={form.edad} onChange={(event) => setForm({ ...form, edad: event.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dueño *</label>
            <select className="form-select" value={form.cliente_id} onChange={(event) => setForm({ ...form, cliente_id: event.target.value })}>
              <option value="">Seleccionar dueño...</option>
              {clientesVisibles.map(client => <option key={client.id} value={client.id}>{client.nombre}</option>)}
            </select>
            {errors.cliente_id && <p className="form-error">{errors.cliente_id}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Sucursal *</label>
            <select className="form-select" value={form.branch_id} onChange={(event) => setForm({ ...form, branch_id: event.target.value })}>
              {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name} - {branch.city}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {vaccineModal && selectedPet && (
        <Modal
          title={`Calendario sanitario - ${selectedPet.nombre}`}
          onClose={() => setVaccineModal(false)}
          onSave={handleSaveVaccine}
          saveLabel={vaccineForm.id ? 'Guardar vacuna' : 'Agregar vacuna'}
        >
          <div className="pet-panel-header">
            <div>
              <strong>{selectedPet.nombre}</strong>
              <p style={{ margin: '4px 0 0', color: '#64748b' }}>
                Dueño: {clientName(selectedPet.cliente_id)} - {getBranchName(getRecordBranchId('pets', selectedPet.id))}
              </p>
            </div>
            <span className={`tag ${(petHealthMap[selectedPet.id] || getPetHealthSummary([])).tag}`}>
              {(petHealthMap[selectedPet.id] || getPetHealthSummary([])).label}
            </span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vacuna *</label>
              <select className="form-select" value={vaccineForm.name} onChange={(event) => setVaccineForm({ ...vaccineForm, name: event.target.value })}>
                <option value="">Seleccionar vacuna...</option>
                {VACCINE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              {vaccineErrors.name && <p className="form-error">{vaccineErrors.name}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Fecha aplicada *</label>
              <input className="form-input" type="date" value={vaccineForm.appliedAt} onChange={(event) => setVaccineForm({ ...vaccineForm, appliedAt: event.target.value })} />
              {vaccineErrors.appliedAt && <p className="form-error">{vaccineErrors.appliedAt}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Proxima dosis</label>
              <input className="form-input" type="date" value={vaccineForm.nextDoseAt} onChange={(event) => setVaccineForm({ ...vaccineForm, nextDoseAt: event.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Veterinario responsable</label>
              <input className="form-input" value={vaccineForm.veterinarian} placeholder="Nombre del veterinario" onChange={(event) => setVaccineForm({ ...vaccineForm, veterinarian: event.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notas</label>
            <textarea className="form-input" rows={2} value={vaccineForm.notes} placeholder="Lote, observaciones o recordatorios..." onChange={(event) => setVaccineForm({ ...vaccineForm, notes: event.target.value })} />
          </div>

          <div className="pet-card-list">
            {selectedPetVaccines.length === 0 ? (
              <div className="empty-state">Sin vacunas registradas para esta mascota.</div>
            ) : selectedPetVaccines.map((vaccine) => {
              const status = getVaccineStatus(vaccine.nextDoseAt)
              return (
                <div className="pet-card-item" key={vaccine.id}>
                  <strong>{vaccine.name}</strong>
                  <p>
                    Aplicada: {fmtDate(vaccine.appliedAt)}<br />
                    Próxima dosis: {vaccine.nextDoseAt ? fmtDate(vaccine.nextDoseAt) : 'Sin fecha'}<br />
                    Veterinario: {vaccine.veterinarian || 'No indicado'}
                  </p>
                  <div className="pet-card-actions">
                    <span className={`tag ${status.tag}`}>{status.label}</span>
                    {(status.key === 'vencida' || status.key === 'proxima') && (() => {
                      const owner = clientes.find(c => String(c.id) === String(selectedPet.cliente_id))
                      return (
                        <button
                          className="btn-edit"
                          style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
                          onClick={() => handleSendVaccineAlert(selectedPet, vaccine, owner?.email, owner?.nombre)}
                        >
                          📧 Alertar dueño
                        </button>
                      )
                    })()}
                    <button className="btn-edit" onClick={() => handleEditVaccine(vaccine)}>Editar</button>
                    <button className="btn-del" onClick={() => handleDeleteVaccine(vaccine.id)}>Eliminar</button>
                  </div>
                </div>
              )
            })}
          </div>
        </Modal>
      )}

      {clinicalModal && selectedPet && (
        <Modal
          title={`Historial clínico - ${selectedPet.nombre}`}
          onClose={() => setClinicalModal(false)}
          onSave={handleSaveClinicalEntry}
          saveLabel={clinicalForm.id ? 'Guardar consulta' : 'Agregar consulta'}
        >
          <div className="pet-panel-header">
            <div>
              <strong>{selectedPet.nombre}</strong>
              <p style={{ margin: '4px 0 0', color: '#64748b' }}>
                Dueño: {clientName(selectedPet.cliente_id)} - {getBranchName(getRecordBranchId('pets', selectedPet.id))}
              </p>
            </div>
            <span className="tag tag-purple">
              {selectedPetClinicalHistory.length} consulta{selectedPetClinicalHistory.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha de consulta *</label>
              <input className="form-input" type="date" value={clinicalForm.consultationDate} onChange={(event) => setClinicalForm({ ...clinicalForm, consultationDate: event.target.value })} />
              {clinicalErrors.consultationDate && <p className="form-error">{clinicalErrors.consultationDate}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Peso (kg)</label>
              <input className="form-input" value={clinicalForm.weight} placeholder="Ej: 12.5" onChange={(event) => setClinicalForm({ ...clinicalForm, weight: event.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Motivo de consulta *</label>
              <input className="form-input" value={clinicalForm.reason} placeholder="Ej: control general" onChange={(event) => setClinicalForm({ ...clinicalForm, reason: event.target.value })} />
              {clinicalErrors.reason && <p className="form-error">{clinicalErrors.reason}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Veterinario responsable</label>
              <input className="form-input" value={clinicalForm.veterinarian} placeholder="Nombre del veterinario" onChange={(event) => setClinicalForm({ ...clinicalForm, veterinarian: event.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sintomas</label>
            <textarea className="form-input" rows={2} value={clinicalForm.symptoms} placeholder="Sintomas reportados..." onChange={(event) => setClinicalForm({ ...clinicalForm, symptoms: event.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Diagnostico</label>
            <textarea className="form-input" rows={2} value={clinicalForm.diagnosis} placeholder="Diagnostico o hallazgos..." onChange={(event) => setClinicalForm({ ...clinicalForm, diagnosis: event.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Tratamiento</label>
            <textarea className="form-input" rows={2} value={clinicalForm.treatment} placeholder="Medicacion, indicaciones o procedimiento..." onChange={(event) => setClinicalForm({ ...clinicalForm, treatment: event.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones</label>
            <textarea className="form-input" rows={2} value={clinicalForm.observations} placeholder="Notas de seguimiento..." onChange={(event) => setClinicalForm({ ...clinicalForm, observations: event.target.value })} />
          </div>

          <div className="pet-card-list">
            {selectedPetClinicalHistory.length === 0 ? (
              <div className="empty-state">Sin consultas registradas para esta mascota.</div>
            ) : selectedPetClinicalHistory.map((entry) => (
              <div className="pet-card-item" key={entry.id}>
                <strong>{fmtDate(entry.consultationDate)} - {entry.reason}</strong>
                <p>
                  Diagnostico: {entry.diagnosis || 'No indicado'}<br />
                  Tratamiento: {entry.treatment || 'No indicado'}<br />
                  Peso: {entry.weight ? `${entry.weight} kg` : 'No indicado'}<br />
                  Veterinario: {entry.veterinarian || 'No indicado'}
                </p>
                {entry.observations && <p>Observaciones: {entry.observations}</p>}
                <div className="pet-card-actions">
                  <span className="tag tag-purple">Consulta</span>
                  <button className="btn-edit" onClick={() => handleEditClinicalEntry(entry)}>Editar</button>
                  <button className="btn-del" onClick={() => handleDeleteClinicalEntry(entry.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {profilePet && (() => {
        const vaccines = getPetVaccines(profilePet.id)
        const clinical = getPetClinicalHistory(profilePet.id)
        const health = petHealthMap[profilePet.id] || getPetHealthSummary([])
        const walks = petWalks.filter(w => w.petId === profilePet.id)
        const daycare = daycareAttendance.filter(r => r.petId === profilePet.id)
        const servicePhotoGroups = profileAppts
          .map((appointment) => {
            const photos = getServicePhotos(appointment.id)
            if (!photos.length) return null
            return {
              appointmentId: appointment.id,
              date: appointment.fecha,
              time: appointment.hora,
              serviceName: appointment.servicios?.nombre || 'Servicio',
              photos,
            }
          })
          .filter(Boolean)
        const servicePhotoCount = servicePhotoGroups.reduce((sum, group) => sum + group.photos.length, 0)
        const latestWeight = [...clinical].sort((a,b) => b.consultationDate?.localeCompare(a.consultationDate || '')).find(e => e.weight)
        const tabBtnStyle = (tab) => ({
          background: profileTab === tab ? '#0f172a' : '#f1f5f9',
          color: profileTab === tab ? '#fff' : '#475569',
          border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        })
        return (
          <Modal title="" onClose={() => setProfilePet(null)}>
            {/* Cabecera */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 18, padding: '0 0 16px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                {profilePet.tipo === 'Perro' ? '🐕' : profilePet.tipo === 'Gato' ? '🐈' : profilePet.tipo === 'Ave' ? '🐦' : '🐾'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{profilePet.nombre}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  {profilePet.tipo}{profilePet.raza ? ` · ${profilePet.raza}` : ''} · {fmtAge(profilePet.edad)}
                  {latestWeight ? ` · ${latestWeight.weight} kg` : ''}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  Dueño: {clientName(profilePet.cliente_id)} · {getBranchName(getRecordBranchId('pets', profilePet.id))}
                </div>
              </div>
              <span className={`tag ${health.tag}`} style={{ fontSize: 13, padding: '5px 12px' }}>
                {health.label}{health.dueCount > 0 ? ` (${health.dueCount})` : ''}
              </span>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { id: 'resumen', label: `Resumen` },
                { id: 'vacunas', label: `Vacunas (${vaccines.length})` },
                { id: 'clinica', label: `Historia clínica (${clinical.length})` },
                { id: 'citas', label: `Citas (${profileAppts.length})` },
                { id: 'fotos', label: `Fotos del servicio (${servicePhotoCount})` },
                { id: 'otros', label: `Paseos y guardería` },
              ].map(t => (
                <button key={t.id} style={tabBtnStyle(t.id)} onClick={() => setProfileTab(t.id)}>{t.label}</button>
              ))}
            </div>

            {/* Tab: Resumen */}
            {profileTab === 'resumen' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[
                  { label: 'Vacunas', value: vaccines.length, sub: health.label, color: health.tag === 'tag-red' ? '#dc2626' : health.tag === 'tag-green' ? '#16a34a' : '#d97706' },
                  { label: 'Consultas', value: clinical.length, sub: clinical[0] ? fmtDate(clinical[0].consultationDate) : 'Sin historial', color: '#1d4ed8' },
                  { label: 'Citas', value: profileAppts.length, sub: profileAppts[0]?.fecha ? fmtDate(profileAppts[0].fecha) : 'Sin citas', color: '#7c3aed' },
                  { label: 'Fotos servicio', value: servicePhotoCount, sub: servicePhotoGroups.length ? `${servicePhotoGroups.length} cita${servicePhotoGroups.length !== 1 ? 's' : ''} con evidencia` : 'Sin evidencia visual', color: '#0f766e' },
                  { label: 'Paseos', value: walks.length, sub: walks.filter(w=>w.status==='completado').length + ' completados', color: '#ea580c' },
                  { label: 'Guardería', value: daycare.length, sub: 'asistencias registradas', color: '#0284c7' },
                  { label: 'Último peso', value: latestWeight ? `${latestWeight.weight} kg` : '—', sub: latestWeight ? fmtDate(latestWeight.consultationDate) : 'Sin registro', color: '#0f172a' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#f8fafc', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: k.color, marginBottom: 2 }}>{k.value}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{k.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{k.sub}</div>
                  </div>
                ))}
                {clinical[0] && (
                  <div style={{ gridColumn: '1/-1', background: '#f8fafc', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>ÚLTIMA CONSULTA — {fmtDate(clinical[0].consultationDate)}</div>
                    <div style={{ fontSize: 13, color: '#334155' }}>
                      <strong>Motivo:</strong> {clinical[0].reason}<br />
                      {clinical[0].diagnosis && <><strong>Diagnóstico:</strong> {clinical[0].diagnosis}<br /></>}
                      {clinical[0].treatment && <><strong>Tratamiento:</strong> {clinical[0].treatment}<br /></>}
                      {clinical[0].veterinarian && <><strong>Veterinario:</strong> {clinical[0].veterinarian}</>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Vacunas */}
            {profileTab === 'vacunas' && (
              vaccines.length === 0
                ? <p className="empty-state">Sin vacunas registradas</p>
                : <div style={{ display: 'grid', gap: 8 }}>
                    {vaccines.map(v => {
                      const st = getVaccineStatus(v.nextDoseAt)
                      return (
                        <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', borderRadius: 10, padding: '10px 14px', border: '1px solid #e2e8f0' }}>
                          <span className={`tag ${st.tag}`}>{st.label}</span>
                          <div style={{ flex: 1 }}>
                            <strong style={{ fontSize: 13 }}>{v.name}</strong>
                            <div style={{ fontSize: 12, color: '#64748b' }}>
                              Aplicada: {fmtDate(v.appliedAt)} · Próxima: {v.nextDoseAt ? fmtDate(v.nextDoseAt) : '—'} · {v.veterinarian || 'Sin veterinario'}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
            )}

            {/* Tab: Historia clínica */}
            {profileTab === 'clinica' && (
              clinical.length === 0
                ? <p className="empty-state">Sin consultas registradas</p>
                : <div style={{ display: 'grid', gap: 10 }}>
                    {clinical.map(e => (
                      <div key={e.id} style={{ background: '#f8fafc', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <strong style={{ fontSize: 13 }}>{fmtDate(e.consultationDate)} — {e.reason}</strong>
                          {e.weight && <span style={{ fontSize: 12, background: '#eff6ff', color: '#1d4ed8', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{e.weight} kg</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
                          {e.diagnosis && <div><strong>Diagnóstico:</strong> {e.diagnosis}</div>}
                          {e.treatment && <div><strong>Tratamiento:</strong> {e.treatment}</div>}
                          {e.symptoms && <div><strong>Síntomas:</strong> {e.symptoms}</div>}
                          {e.veterinarian && <div><strong>Veterinario:</strong> {e.veterinarian}</div>}
                          {e.observations && <div><strong>Observaciones:</strong> {e.observations}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
            )}

            {/* Tab: Citas */}
            {profileTab === 'citas' && (
              profileAppts.length === 0
                ? <p className="empty-state">Sin citas registradas</p>
                : <div style={{ display: 'grid', gap: 8 }}>
                    {profileAppts.map(a => (
                      <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#f8fafc', borderRadius: 10, padding: '10px 14px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 20 }}>📅</div>
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: 13 }}>{fmtDate(a.fecha)} — {a.hora}</strong>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{a.servicios?.nombre || 'Servicio'}{a.notas ? ` · ${a.notas}` : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
            )}

            {/* Tab: Paseos y guardería */}
            {profileTab === 'otros' && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>PASEOS ({walks.length})</div>
                {walks.length === 0
                  ? <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>Sin paseos registrados</p>
                  : walks.slice(0, 5).map(w => (
                      <div key={w.id} style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#f8fafc', borderRadius: 10, padding: '9px 13px', border: '1px solid #e2e8f0', marginBottom: 6 }}>
                        <span style={{ fontSize: 18 }}>🐕</span>
                        <div style={{ flex: 1, fontSize: 12, color: '#475569' }}>
                          <strong style={{ color: '#0f172a' }}>{fmtDate(w.date)}</strong>
                          {w.startTime && ` · ${w.startTime}${w.endTime ? ` → ${w.endTime}` : ''}`}
                          {w.duration && ` · ${w.duration}`}
                          {w.walker && ` · ${w.walker}`}
                        </div>
                        <span className={`tag ${w.status === 'completado' ? 'tag-green' : w.status === 'en_curso' ? 'tag-amber' : 'tag-blue'}`} style={{ fontSize: 11 }}>{w.status}</span>
                      </div>
                    ))
                }
                <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', margin: '16px 0 8px' }}>GUARDERÍA ({daycare.length})</div>
                {daycare.length === 0
                  ? <p style={{ color: '#94a3b8', fontSize: 13 }}>Sin asistencias registradas</p>
                  : daycare.slice(0, 5).map(r => (
                      <div key={r.id} style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#f8fafc', borderRadius: 10, padding: '9px 13px', border: '1px solid #e2e8f0', marginBottom: 6 }}>
                        <span style={{ fontSize: 18 }}>🏠</span>
                        <div style={{ flex: 1, fontSize: 12, color: '#475569' }}>
                          <strong style={{ color: '#0f172a' }}>{fmtDate(r.date)}</strong>
                          {r.checkIn && ` · Entrada ${r.checkIn}`}
                          {r.checkOut && ` · Salida ${r.checkOut}`}
                        </div>
                        <span style={{ fontSize: 11, background: r.checkIn && !r.checkOut ? '#dcfce7' : '#f1f5f9', color: r.checkIn && !r.checkOut ? '#15803d' : '#64748b', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>
                          {r.checkIn && !r.checkOut ? 'Presente' : r.checkOut ? 'Completado' : 'Pendiente'}
                        </span>
                      </div>
                    ))
                }
              </div>
            )}

            <div className="modal-footer" style={{ marginTop: 20 }}>
              <button className="btn-secondary" onClick={() => setProfilePet(null)}>Cerrar</button>
              <button className="btn-primary" onClick={() => { setProfilePet(null); openVaccines(profilePet) }}>Gestionar vacunas</button>
              <button className="btn-primary" onClick={() => { setProfilePet(null); openClinicalHistory(profilePet) }}>Agregar consulta</button>
            </div>
          </Modal>
        )
      })()}
    </>
  )
}
