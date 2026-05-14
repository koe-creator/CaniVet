import { useSupabaseCRUD } from './useSupabaseCRUD'

export const useClients = () => useSupabaseCRUD('clientes', 'nombre')
