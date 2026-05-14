import { supabase } from './supabase'

export const appointmentService = {
  getAll: () =>
    supabase.from('citas')
      .select('*')
      .order('fecha'),

  getToday: () => {
    const today = new Date().toISOString().split('T')[0]
    return supabase.from('citas')
      .select('*')
      .eq('fecha', today)
      .order('hora')
  },

  create: (data) =>
    supabase.from('citas').insert([data]),

  update: (id, data) =>
    supabase.from('citas').update(data).eq('id', id),

  remove: (id) =>
    supabase.from('citas').delete().eq('id', id),
}
