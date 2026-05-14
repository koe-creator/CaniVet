import { useState, useCallback } from 'react'

export const useToast = () => {
  const [toast, setToast] = useState(null)
  const show = useCallback((msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 2500)
  }, [])
  return { toast, show }
}