"use client";
import MaterialForm from '../MaterialForm'
import { useBoard } from '../../board/BoardProvider'
import { useTabStore } from '@/hooks/useTabs'
import { useCallback, useEffect, useState } from 'react'
import { generarUUID } from '@/lib/uuid'
import { useToast } from '@/components/Toast'
import { parseId } from '@/lib/parseId'

export default function MaterialFormTab({ tabId }: { tabId: string }) {
  const { selectedId, materiales, setSelectedId, eliminar, mutate, crear, actualizar } = useBoard()
  const baseMat = materiales.find(m => m.id === selectedId) || null
  const { close } = useTabStore()
  const toast = useToast()
  const [draft, setDraft] = useState(baseMat)

  useEffect(() => {
    setDraft(baseMat)
  }, [baseMat])

  const onEliminar = useCallback(async () => {
    const id = parseId(draft?.dbId)
    if (!id) {
      toast.show('ID inválido', 'error')
      return
    }
    const ok = await toast.confirm('¿Eliminar material?')
    if (!ok) return
    const res = await eliminar(id)
    if (res?.error) toast.show(res.error, 'error')
    else toast.show('Material eliminado', 'success')
    mutate()
    setSelectedId(null)
    close(tabId)
  }, [draft, eliminar, mutate, setSelectedId, close, tabId, toast])

  const guardar = useCallback(async () => {
    if (!draft) return
    if (!draft.nombre || !draft.nombre.trim()) {
      toast.show('Nombre requerido', 'error')
      return
    }
    const cantidad =
      typeof draft.cantidad === 'number' && !Number.isNaN(draft.cantidad)
        ? draft.cantidad
        : 0
    if (cantidad < 0) {
      toast.show('Cantidad inválida', 'error')
      return
    }
    const data = { ...draft, cantidad }
    const res = draft.dbId
      ? await actualizar(data as any)
      : await crear({ ...data, id: generarUUID() } as any)
    if (res?.error) {
      toast.show(res.error, 'error')
      return
    }
    toast.show('Material guardado', 'success')
    mutate()
    if (res?.material?.id) {
      const id = String(res.material.id)
      setDraft(d => d ? { ...d, dbId: res.material.id, id } : d)
      setSelectedId(id)
    }
  }, [draft, actualizar, crear, mutate, setSelectedId, toast])

  const duplicar = useCallback(async () => {
    if (!draft) return
    const { dbId, ...rest } = draft
    await crear({ ...rest, id: generarUUID() } as any)
    mutate()
  }, [draft, crear, mutate])

  if (!draft) {
    return (
      <p className="text-sm text-[var(--dashboard-muted)]">
        Selecciona o crea un material.
      </p>
    )
  }

  const cancelar = () => {
    setSelectedId(null)
    close(tabId)
  }

  return (
    <MaterialForm
      material={draft}
      onChange={(c, v) => setDraft(d => (d ? { ...d, [c]: v } : d))}
      onGuardar={guardar}
      onCancelar={cancelar}
      onDuplicar={duplicar}
      onEliminar={onEliminar}
    />
  )
}
