"use client";
import UnidadesPanel from '../../[id]/UnidadesPanel'
import { useBoard } from '../../board/BoardProvider'
import { useTabHelpers } from '@/hooks/useTabHelpers'
import useUnidades from '@/hooks/useUnidades'
import { useCallback } from 'react'

export default function UnidadesTab() {
  const { materiales, selectedId, setUnidadSel } = useBoard()
  const selected = materiales.find(m => m.id === selectedId) || null
  const { obtener } = useUnidades(selected?.dbId)
  const { openForm } = useTabHelpers()

  const openUnidad = useCallback(
    async (u: any) => {
      if (!u?.id) return
      const info = await obtener(u.id)
      if (!info) return
      setUnidadSel({ nombreMaterial: u.nombre, ...info })
      openForm('form-unidad', 'Unidad')
    },
    [obtener, setUnidadSel, openForm]
  )

  return (
    <UnidadesPanel material={selected} onChange={() => {}} onSelect={openUnidad} />
  )
}
