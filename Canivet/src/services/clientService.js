import { supabase } from './supabase'

export const clientService = {
  getAll: () =>
    supabase.from('clientes').select('*').order('nombre'),

  getById: (id) =>
    supabase.from('clientes').select('*').eq('id', id).single(),

  create: (data) =>
    supabase.from('clientes').insert([data]),

  update: (id, data) =>
    supabase.from('clientes').update(data).eq('id', id),

  remove: (id) =>
    supabase.from('clientes').delete().eq('id', id),
}
