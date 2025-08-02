import useSWR, { mutate } from 'swr'
import { jsonOrNull } from '@lib/http'
import { apiFetch } from '@lib/api'
import type { Usuario } from '@/types/usuario'

export async function sessionFetcher(url: string) {
  const res = await apiFetch(url)
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

  const raw = data?.success ? (data.usuario as any) : null
  const usuario: Usuario | null = raw
    ? {
        ...raw,
        // Normaliza nombre/correo cuando la sesión usa campos en inglés
        nombre: raw.nombre || raw.name,
        correo: raw.correo || raw.email,
        email: raw.email || raw.correo,
      }
    : null

  return { usuario, loading: isLoading }
}
