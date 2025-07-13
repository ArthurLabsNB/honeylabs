"use client";
import MaterialForm from '../MaterialForm'
import { useBoard } from '../../board/BoardProvider'
import { useTabStore } from '@/hooks/useTabs'
import { useCallback } from 'react'

export default function MaterialFormTab({ tabId }: { tabId: string }) {
  const { selectedId, materiales, setSelectedId, eliminar, mutate } = useBoard()
  const material = materiales.find(m => m.id === selectedId) || null
  const { close } = useTabStore()

  const onEliminar = useCallback(async () => {
    if (!material?.dbId) return
    const ok = confirm('¿Eliminar material?')
    if (!ok) return
    await eliminar(material.dbId)
    mutate()
    setSelectedId(null)
    close(tabId)
  }, [material, eliminar, mutate, setSelectedId, close, tabId])

  if (!material) return null

  return (
    <MaterialForm
      material={material}
      onChange={() => {}}
      onGuardar={() => {}}
      onCancelar={() => {
        setSelectedId(null)
        close(tabId)
      }}
      onDuplicar={() => {}}
      onEliminar={onEliminar}
    />
  )
}
