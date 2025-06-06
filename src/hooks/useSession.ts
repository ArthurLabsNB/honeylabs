import { useEffect, useState } from 'react'
import { jsonOrNull } from '@lib/http'
import type { Usuario } from '@/types/usuario'

let cachedUser: Usuario | null | undefined

export function clearSessionCache() {
  cachedUser = undefined
}

async function fetchSession(): Promise<Usuario | null> {
  try {
    const res = await fetch('/api/login', { credentials: 'include' })
    const data = await jsonOrNull(res)
    return data?.success && data.usuario ? data.usuario : null
  } catch {
    return null
  }
}

export default function useSession() {
  const [usuario, setUsuario] = useState<Usuario | null | undefined>(cachedUser)
  const [loading, setLoading] = useState(cachedUser === undefined)

  useEffect(() => {
    if (cachedUser !== undefined) return
    fetchSession()
      .then((u) => {
        cachedUser = u
        setUsuario(u)
      })
      .finally(() => setLoading(false))
  }, [])

  return { usuario: usuario ?? null, loading }
}
