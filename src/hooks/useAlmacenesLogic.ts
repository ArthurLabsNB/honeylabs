import { useEffect, useState, useCallback } from 'react'
import { jsonOrNull } from '@lib/http'
import { useToast } from '@/components/Toast'
import useSession from '@/hooks/useSession'
import useAlmacenes, { Almacen } from '@/hooks/useAlmacenes'
import { getMainRole, normalizeTipoCuenta } from '@lib/permisos'
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

  const [almacenes, setAlmacenes] = useState<Almacen[]>([])
  const [error, setError] = useState('')
  const [dragId, setDragId] = useState<number | null>(null)
  const [favoritos, setFavoritos] = useState<number[]>([])

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
    const rol = getMainRole(usuario)?.toLowerCase()
    const tipo = normalizeTipoCuenta(usuario.tipoCuenta)
    if (rol !== 'admin' && rol !== 'administrador' && !allowed.includes(tipo)) {
      setError('No autorizado')
      return
    }
    setError('')
  }, [usuario, loadingUsuario])

  const crearAlmacen = async (nombre: string, descripcion: string) => {
    try {
      const res = await fetch('/api/almacenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion }),
      })
      const data = await jsonOrNull(res)
      if (res.ok && data.almacen) {
        mutate()
        toast.show('Almacén creado', 'success')
      } else {
        toast.show(data.error || 'Error al crear', 'error')
      }
    } catch {
      toast.show('Error de red', 'error')
    }
  }

  useEffect(() => {
    registerCreate(crearAlmacen)
  }, [registerCreate])

  useEffect(() => {
    setAlmacenes(fetchedAlmacenes)
  }, [fetchedAlmacenes])

  useEffect(() => {
    if (fetchError) setError('Error al cargar datos')
  }, [fetchError])

  useEffect(() => {
    if (!usuario) return
    fetch('/api/preferences', { credentials: 'include' })
      .then(jsonOrNull)
      .then((prefs) => {
        if (prefs && Array.isArray(prefs.favoritosAlmacenes)) {
          setFavoritos(prefs.favoritosAlmacenes)
        }
      })
      .catch(() => {})
  }, [usuario])

  const eliminar = useCallback(
    async (id: number) => {
      const ok = await toast.confirm('¿Eliminar almacén?')
      if (!ok) return
      const res = await fetch(`/api/almacenes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        mutate()
        toast.show('Almacén eliminado', 'success')
      } else {
        toast.show('Error al eliminar', 'error')
      }
    },
    [toast],
  )

  const handleDragStart = useCallback((id: number) => {
    setDragId(id)
  }, [])

  const handleDragEnter = useCallback(
    (id: number) => {
      if (dragId === null || dragId === id) return
      const oldIndex = almacenes.findIndex((a) => a.id === dragId)
      const newIndex = almacenes.findIndex((a) => a.id === id)
      setAlmacenes((items) => arrayMove(items, oldIndex, newIndex))
      setDragId(id)
    },
    [dragId, almacenes],
  )

  const handleDragEnd = useCallback(async () => {
    setDragId(null)
    try {
      await fetch('/api/almacenes/orden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: almacenes.map((a) => a.id) }),
      })
    } catch {
      // no-op
    }
  }, [almacenes])

  const moveItem = useCallback(
    (id: number, dir: -1 | 1) => {
      const index = almacenes.findIndex((a) => a.id === id)
      const newIndex = index + dir
      if (index === -1 || newIndex < 0 || newIndex >= almacenes.length) return
      setAlmacenes((items) => arrayMove(items, index, newIndex))
    },
    [almacenes],
  )

  const toggleFavorito = useCallback((id: number) => {
    setFavoritos((prev) => {
      const exists = prev.includes(id)
      const updated = exists ? prev.filter((f) => f !== id) : [...prev, id]
      fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
    handleDragEnter,
    handleDragEnd,
    moveItem,
    eliminar,
    toggleFavorito,
  }
}
