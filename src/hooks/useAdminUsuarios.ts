import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface AdminUsuario {
  id: number
  nombre: string
  correo: string
  tipoCuenta: string
  estado: string
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

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
