import { supabase } from './supabase'

export const paymentService = {
  getAll: () =>
    supabase.from('pagos').select('*').order('created_at', { ascending: false }),

  create: (data) =>
    supabase.from('pagos').insert([data]),

  update: (id, data) =>
    supabase.from('pagos').update(data).eq('id', id),

  remove: (id) =>
    supabase.from('pagos').delete().eq('id', id),
}
