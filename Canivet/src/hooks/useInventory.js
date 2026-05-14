import { useSupabaseCRUD } from './useSupabaseCRUD'

export const useInventory = () => useSupabaseCRUD('inventario', 'producto')
