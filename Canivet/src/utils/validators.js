export const validateEmail = (email) =>
  /\S+@\S+\.\S+/.test(email)

export const validateRequired = (value) =>
  value !== null && value !== undefined && String(value).trim() !== ''

export const validatePhone = (phone) =>
  /^[\d\s+()-]{7,15}$/.test(phone)

export const validatePrice = (price) =>
  !isNaN(price) && Number(price) >= 0

export const validateClientForm = (form) => {
  const errors = {}
  if (!validateRequired(form.nombre)) errors.nombre = 'El nombre es requerido'
  if (form.email && !validateEmail(form.email)) errors.email = 'Email inválido'
  return errors
}

export const validatePetForm = (form) => {
  const errors = {}
  if (!validateRequired(form.nombre)) errors.nombre = 'El nombre es requerido'
  if (!validateRequired(form.cliente_id)) errors.cliente_id = 'Selecciona un dueño'
  return errors
}

export const validateAppointmentForm = (form) => {
  const errors = {}
  if (!validateRequired(form.fecha)) errors.fecha = 'La fecha es requerida'
  if (!validateRequired(form.hora)) errors.hora = 'La hora es requerida'
  if (!validateRequired(form.cliente_id)) errors.cliente_id = 'Selecciona un cliente'
  if (!validateRequired(form.mascota_id)) errors.mascota_id = 'Selecciona una mascota'
  if (!validateRequired(form.servicio_id)) errors.servicio_id = 'Selecciona un servicio'
  return errors
}

export const validatePaymentForm = (form) => {
  const errors = {}
  if (!validateRequired(form.cliente_id)) errors.cliente_id = 'Selecciona un cliente'
  if (!validatePrice(form.monto)) errors.monto = 'Monto inválido'
  if (!validateRequired(form.fecha)) errors.fecha = 'La fecha es requerida'
  return errors
}
