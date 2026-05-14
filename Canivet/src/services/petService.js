import { supabase } from './supabase'

export const petService = {
  getAll: () =>
    supabase.from('mascotas').select('*').order('nombre'),

  getByClient: (clienteId) =>
    supabase.from('mascotas').select('*').eq('cliente_id', clienteId),

  create: (data) =>
    supabase.from('mascotas').insert([data]),

  update: (id, data) =>
    supabase.from('mascotas').update(data).eq('id', id),

  remove: (id) =>
    supabase.from('mascotas').delete().eq('id', id),
}
