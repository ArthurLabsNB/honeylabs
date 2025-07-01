import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'

export interface AdminUsuario {
  id: number
  nombre: string
  correo: string
  tipoCuenta: string
  estado: string
}


export default function useAdminUsuarios() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/usuarios', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  return {
    usuarios: (data?.usuarios as AdminUsuario[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
