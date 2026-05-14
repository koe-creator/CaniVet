import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../services/supabase'

const DEFAULT_PAGE_SIZE = 100

export const useSupabaseCRUD = (table, defaultOrder = 'created_at', options = {}) => {
  const { pageSize = DEFAULT_PAGE_SIZE } = options

  const [records, setRecords]       = useState([])
  const [loading, setLoading]       = useState(false)
  const [error,   setError]         = useState(null)
  const [page,    setPage]          = useState(0)
  const [total,   setTotal]         = useState(null)

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const load = useCallback(async (targetPage = 0) => {
    if (!mountedRef.current) return
    setLoading(true)
    setError(null)

    const from = targetPage * pageSize
    const to   = from + pageSize - 1

    const { data, error: nextError, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .order(defaultOrder)
      .range(from, to)

    if (!mountedRef.current) return

    if (nextError) {
      setError(nextError)
    } else {
      setRecords(data || [])
      if (count !== null) setTotal(count)
      setPage(targetPage)
    }

    setLoading(false)
    return nextError
  }, [table, defaultOrder, pageSize])

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) load(0)
    })
    return () => { cancelled = true }
  }, [load])

  const nextPage = useCallback(() => {
    const maxPage = total !== null ? Math.ceil(total / pageSize) - 1 : Infinity
    if (page < maxPage) load(page + 1)
  }, [load, page, pageSize, total])

  const prevPage = useCallback(() => {
    if (page > 0) load(page - 1)
  }, [load, page])

  const hasMore  = total !== null ? (page + 1) * pageSize < total : false
  const hasPrev  = page > 0

  const create = async (payload) => {
    setError(null)
    const { data, error: nextError } = await supabase.from(table).insert([payload]).select()
    if (nextError) { setError(nextError); return { data, error: nextError } }
    await load(page)
    return { data, error: null }
  }

  const update = async (id, payload) => {
    setError(null)
    const { data, error: nextError } = await supabase.from(table).update(payload).eq('id', id).select()
    if (nextError) { setError(nextError); return { data, error: nextError } }
    await load(page)
    return { data, error: null }
  }

  const remove = async (id) => {
    setError(null)
    const { error: nextError } = await supabase.from(table).delete().eq('id', id)
    if (nextError) { setError(nextError); return { error: nextError } }
    await load(page)
    return { error: null }
  }

  return {
    records, loading, error,
    load: () => load(page),
    create, update, remove,
    // Paginación
    page, total, pageSize, hasMore, hasPrev,
    nextPage, prevPage,
    totalPages: total !== null ? Math.ceil(total / pageSize) : null,
  }
}
