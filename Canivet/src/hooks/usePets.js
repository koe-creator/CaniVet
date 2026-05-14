import { useSupabaseCRUD } from './useSupabaseCRUD'

export const usePets = () => useSupabaseCRUD('mascotas', 'nombre')
