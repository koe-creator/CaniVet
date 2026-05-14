import { useSupabaseCRUD } from './useSupabaseCRUD'

export const useAppointments = () => useSupabaseCRUD('citas', 'fecha')
