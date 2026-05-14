const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const sendContactMessage = async (payload) => {
  const response = await fetch(`${API_URL}/api/contacto/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      data?.errors
        ? Object.values(data.errors)[0]
        : data?.error || 'No se pudo enviar el mensaje.'
    throw new Error(message)
  }

  return data
}
