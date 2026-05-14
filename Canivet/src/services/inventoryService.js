import { supabase } from './supabase'

export const inventoryService = {
  getAll: () =>
    supabase.from('inventario').select('*').order('producto'),

  getLowStock: (threshold = 20) =>
    supabase.from('inventario').select('*').lt('cantidad', threshold),

  create: (data) =>
    supabase.from('inventario').insert([data]),

  update: (id, data) =>
    supabase.from('inventario').update(data).eq('id', id),

  remove: (id) =>
    supabase.from('inventario').delete().eq('id', id),
}
