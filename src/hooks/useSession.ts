import useSWR, { mutate } from 'swr'
import { jsonOrNull } from '@lib/http'
import type { Usuario } from '@/types/usuario'

export async function sessionFetcher(url: string) {
  const res = await fetch(url, { credentials: 'include' })
  if (res.status === 401) {
    // 401 indica falta de sesión, no es un error real
    return { success: false }
  }
  return jsonOrNull(res)
}

const fetcher = sessionFetcher

export function clearSessionCache() {
  mutate('/api/login', undefined, { revalidate: false })
}

export default function useSession() {
  const { data, isLoading } = useSWR('/api/login', fetcher, {
    revalidateOnFocus: true,
  })

  const usuario = data?.success ? (data.usuario as Usuario) : null

  return { usuario, loading: isLoading }
}
