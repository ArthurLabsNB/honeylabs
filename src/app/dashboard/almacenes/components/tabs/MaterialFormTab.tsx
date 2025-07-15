"use client";
import MaterialForm from '../MaterialForm'
import { useBoard } from '../../board/BoardProvider'
import { useTabStore } from '@/hooks/useTabs'
import { useCallback, useEffect, useState } from 'react'
import { generarUUID } from '@/lib/uuid'
import { useToast } from '@/components/Toast'

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
    if (!draft?.dbId) return
    const ok = confirm('¿Eliminar material?')
    if (!ok) return
    await eliminar(draft.dbId)
    mutate()
    setSelectedId(null)
    close(tabId)
  }, [draft, eliminar, mutate, setSelectedId, close, tabId])

  if (!draft) return null

  const guardar = useCallback(async () => {
    if (!draft) return
    const res = draft.dbId
      ? await actualizar(draft as any)
      : await crear({ ...draft, id: generarUUID() } as any)
    if (res?.error) {
      toast.show(res.error, 'error')
      return
    }
    toast.show('Material guardado', 'success')
    mutate()
    setSelectedId(null)
    close(tabId)
  }, [draft, actualizar, crear, mutate, setSelectedId, close, tabId, toast])

  const duplicar = useCallback(async () => {
    if (!draft) return
    const { dbId, ...rest } = draft
    await crear({ ...rest, id: generarUUID() } as any)
    mutate()
  }, [draft, crear, mutate])

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
