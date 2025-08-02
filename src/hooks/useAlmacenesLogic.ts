import { useEffect, useState, useCallback, useRef } from 'react'
import { jsonOrNull } from '@lib/http'
import { apiFetch } from '@lib/api'
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { useToast } from '@/components/Toast'
import { usePrompt } from '@/hooks/usePrompt'
import useSession from '@/hooks/useSession'
import useAlmacenes, { Almacen } from '@/hooks/useAlmacenes'
import { getMainRole, normalizeRol, normalizeTipoCuenta } from '@lib/permisos'
import { useAlmacenesUI } from '@/app/dashboard/almacenes/ui'

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const newArr = arr.slice()
  const [item] = newArr.splice(from, 1)
  newArr.splice(to, 0, item)
  return newArr
}

export default function useAlmacenesLogic() {
  const allowed = ['admin', 'administrador', 'institucional', 'empresarial', 'individual']
  const { usuario, loading: loadingUsuario } = useSession()
  const { filter, registerCreate } = useAlmacenesUI()
  const toast = useToast()
  const prompt = usePrompt()

  const [almacenes, setAlmacenes] = useState<Almacen[]>([])
  const [error, setError] = useState('')
  const [dragId, setDragId] = useState<number | null>(null)
  const [favoritos, setFavoritos] = useState<number[]>([])
  const prevAlmacenes = useRef<Almacen[]>([])

  const {
    almacenes: fetchedAlmacenes,
    loading: loadingAlmacenes,
    error: fetchError,
    mutate,
  } = useAlmacenes(
    usuario ? { usuarioId: usuario.id, favoritos: filter === 'favoritos' } : undefined,
  )

  useEffect(() => {
    if (loadingUsuario) return
    if (!usuario) {
      setError('Debes iniciar sesión')
      return
    }
    const _role = getMainRole(usuario)
    const rol = normalizeRol(
      typeof _role === 'string' ? _role : _role?.nombre,
    )
    const tipo = normalizeTipoCuenta(usuario.tipoCuenta)
    if (rol !== 'admin' && rol !== 'administrador' && !allowed.includes(tipo)) {
      setError('No autorizado')
      return
    }
    setError('')
  }, [usuario, loadingUsuario])

  const crearAlmacen = async (nombre: string, descripcion: string) => {
    try {
      const res = await apiFetch('/api/almacenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion }),
      })
      const data = await jsonOrNull(res)
      const nuevo = data?.almacen ?? data?.data
      if (res.ok && nuevo) {
        mutate()
        toast.show('Almacén creado', 'success')
      } else {
        toast.show(data?.error || 'Error al crear', 'error')
      }
    } catch {
      toast.show('Error de red', 'error')
    }
  }

  useEffect(() => {
    registerCreate(crearAlmacen)
  }, [registerCreate])

  useEffect(() => {
    if (prevAlmacenes.current !== fetchedAlmacenes) {
      prevAlmacenes.current = fetchedAlmacenes
      setAlmacenes(fetchedAlmacenes)
    }
  }, [fetchedAlmacenes])

  useEffect(() => {
    if (fetchError) setError('Error al cargar datos')
  }, [fetchError])

  useEffect(() => {
    if (!usuario) return
    const ctrl = new AbortController()
    apiFetch('/api/preferences', { signal: ctrl.signal })
      .then(jsonOrNull)
      .then((prefs) => {
        if (prefs && Array.isArray(prefs.favoritosAlmacenes)) {
          setFavoritos(prefs.favoritosAlmacenes)
        }
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [usuario])

  const eliminar = useCallback(
    async (id: number) => {
      const motivo = await prompt('Motivo de eliminación')
      if (!motivo) return
      const res = await apiFetch(`/api/almacenes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo }),
      })
      if (res.ok) {
        mutate()
        toast.show('Almacén eliminado', 'success')
      } else {
        toast.show('Error al eliminar', 'error')
      }
    },
    [toast],
  )

  const handleDragStart = useCallback((ev: DragStartEvent) => {
    const id = Number(ev.active.id)
    setDragId(id)
  }, [])

  const handleDragOver = useCallback(
    (ev: DragOverEvent) => {
      const overId = ev.over?.id
      if (overId == null || dragId === null) return
      const over = Number(overId)
      if (dragId === over) return
      const oldIndex = almacenes.findIndex((a) => a.id === dragId)
      const newIndex = almacenes.findIndex((a) => a.id === over)
      setAlmacenes((items) => arrayMove(items, oldIndex, newIndex))
      setDragId(over)
    },
    [dragId, almacenes],
  )

  const handleDragEnd = useCallback(
    async (_ev: DragEndEvent) => {
      setDragId(null)
      try {
        await apiFetch('/api/almacenes/orden', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: almacenes.map((a) => a.id) }),
        })
      } catch {
        // no-op
      }
    },
    [almacenes],
  )

  const moveItem = useCallback(
    (id: number, dir: -1 | 1) => {
      const index = almacenes.findIndex((a) => a.id === id)
      const newIndex = index + dir
      if (index === -1 || newIndex < 0 || newIndex >= almacenes.length) return
      setAlmacenes((items) => arrayMove(items, index, newIndex))
    },
    [almacenes],
  )

  const duplicar = useCallback(
    async (id: number) => {
      try {
        const res = await apiFetch(`/api/almacenes/${id}/duplicar`, { method: 'POST' })
        const data = await jsonOrNull(res)
        const nuevo = data?.almacen ?? data?.data
        if (res.ok && nuevo) {
          mutate()
          toast.show('Almacén duplicado', 'success')
          return nuevo.id as number
        }
        toast.show(data?.error || 'Error al duplicar', 'error')
      } catch {
        toast.show('Error al duplicar', 'error')
      }
      return null
    },
    [mutate, toast],
  )

  const toggleFavorito = useCallback((id: number) => {
    setFavoritos((prev) => {
      const exists = prev.includes(id)
      const updated = exists ? prev.filter((f) => f !== id) : [...prev, id]
      apiFetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favoritosAlmacenes: updated }),
      }).catch(() => {})
      return updated
    })
  }, [])

  const loading = loadingAlmacenes || loadingUsuario

  return {
    usuario,
    almacenes,
    favoritos,
    loading,
    error,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    moveItem,
    eliminar,
    duplicar,
    toggleFavorito,
  }
}
