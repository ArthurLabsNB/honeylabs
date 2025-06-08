import useSWR, { mutate } from 'swr'
import { jsonOrNull } from '@lib/http'
import type { Usuario } from '@/types/usuario'

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(jsonOrNull)

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
