export const fmtMoney = (n) =>
  '$' + Number(n).toLocaleString('es-DO', { minimumFractionDigits: 0 })

export const fmtDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-DO', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export const fmtTime = (timeStr) => {
  if (!timeStr) return '-'
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

export const getInitials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

export const fmtAge = (age) =>
  age ? `${age} año${age !== 1 ? 's' : ''}` : '-'
