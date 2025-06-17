import { useEffect, useState, useRef } from 'react'
import type { Usuario } from '@/types/usuario'

interface Presencia {
  id: string | number
  nombre?: string
  avatar?: string | null
}

export default function usePanelPresence(panelId?: string | null, usuario?: Usuario | null) {
  const [usuarios, setUsuarios] = useState<Presencia[]>([])
  const infoRef = useRef<{ id: string | number; nombre: string; avatar: string | null }>()

  useEffect(() => {
    if (!panelId || !usuario || typeof window === 'undefined') return

    const id = usuario.id ?? usuario.email ?? usuario.correo ?? Math.random().toString(36)
    const nombre = usuario.nombre ?? usuario.email ?? 'Usuario'
    const avatar = usuario.avatarUrl ?? usuario.imagen ?? null

    if (infoRef.current?.id === id) return
    infoRef.current = { id, nombre, avatar }

    const channel = new BroadcastChannel(`panel-presence-${panelId}`)

    const handle = (e: MessageEvent<Presencia & { type: string }>) => {
      const msg = e.data
      if (msg.type === 'join' || msg.type === 'ping') {
        setUsuarios((prev) => {
          const exists = prev.find((u) => u.id === msg.id)
          if (exists) return prev.map((u) => (u.id === msg.id ? { ...u, ...msg } : u))
          return [...prev, { id: msg.id, nombre: msg.nombre, avatar: msg.avatar }]
        })
      } else if (msg.type === 'leave') {
        setUsuarios((prev) => prev.filter((u) => u.id !== msg.id))
      }
    }

    channel.addEventListener('message', handle)
    channel.postMessage({ type: 'join', id, nombre, avatar })

    const interval = setInterval(() => {
      channel.postMessage({ type: 'ping', id, nombre, avatar })
    }, 2000)

    setUsuarios([{ id, nombre, avatar }])

    return () => {
      channel.postMessage({ type: 'leave', id })
      clearInterval(interval)
      channel.removeEventListener('message', handle)
      channel.close()
    }
  }, [panelId, usuario?.id])

  return usuarios
}
