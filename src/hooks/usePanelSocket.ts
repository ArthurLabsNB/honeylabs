"use client"
import { useEffect, useRef } from 'react'
import type { PanelUpdate } from '@/types/panel'

export default function usePanelSocket(panelId?: string | null, onUpdate?: (data: PanelUpdate) => void) {
  const socketRef = useRef<WebSocket | null>(null)
  const updateRef = useRef(onUpdate)

  useEffect(() => {
    updateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (!panelId) return
    const url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'
    const socket = new WebSocket(url)
    socketRef.current = socket

    const handleMessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data)
        if (data.panelId === panelId && updateRef.current) updateRef.current(data)
      } catch {}
    }

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ action: 'join', panelId }))
    })
    socket.addEventListener('message', handleMessage)

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: 'leave', panelId }))
      }
      socket.removeEventListener('message', handleMessage)
      socket.close()
      socketRef.current = null
    }
  }, [panelId])

  const sendUpdate = (data: PanelUpdate) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ ...data, action: 'update' }))
    }
  }

  return { sendUpdate }
}
