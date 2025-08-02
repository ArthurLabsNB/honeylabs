import useSWR from 'swr'
import { apiFetch } from '@lib/api'
import { jsonOrNull } from '@lib/http'

export interface Preferences {
  theme?: string
  favoritosAlmacenes?: number[]
  [key: string]: unknown
}

export default function usePreferences(usuarioId?: number | null) {
  const { data, error, isLoading, mutate } = useSWR<Preferences>(
    usuarioId ? '/api/preferences' : null,
    async (url) => {
      const res = await apiFetch(url)
      return (await jsonOrNull(res)) ?? {}
    },
  )

  return { prefs: data, loading: isLoading, error, mutate }
}
