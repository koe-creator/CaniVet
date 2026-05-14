import { supabase } from './supabase'

export const serviceService = {
  getAll: () =>
    supabase.from('servicios').select('*').order('nombre'),

  create: (data) =>
    supabase.from('servicios').insert([data]),

  update: (id, data) =>
    supabase.from('servicios').update(data).eq('id', id),

  remove: (id) =>
    supabase.from('servicios').delete().eq('id', id),
}
