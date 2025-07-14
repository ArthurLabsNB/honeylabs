"use client";
import { useState, useCallback } from 'react'
import MaterialList from '../MaterialList'
import type { Material } from '../MaterialRow'
import { useBoard } from '../../board/BoardProvider'
import { useTabHelpers } from '@/hooks/useTabHelpers'
import { generarUUID } from '@/lib/uuid'

export default function MaterialesTab() {
  const {
    materiales,
    selectedId,
    setSelectedId,
    setUnidadSel,
    crear,
  } = useBoard()
  const { ensureTab, openForm } = useTabHelpers()
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState<'nombre' | 'cantidad'>('nombre')

  const openMaterial = useCallback(
    (id: string | null) => {
      if (!id) return
      setSelectedId(id)
      setUnidadSel(null)
      ensureTab('unidades', 'Unidades', 'right')
      openForm('form-material', 'Material')
    },
    [ensureTab, openForm, setSelectedId, setUnidadSel]
  )

  return (
    <MaterialList
      materiales={materiales}
      selectedId={selectedId}
      onSeleccion={openMaterial}
      busqueda={busqueda}
      setBusqueda={setBusqueda}
      orden={orden}
      setOrden={setOrden}
      onNuevo={async () => {
        const nuevo = {
          id: generarUUID(),
          nombre: `Material ${Date.now()}`,
          cantidad: 0,
          lote: '',
        } as Material
        const res = await crear(nuevo)
        const mid = res?.material?.id
        if (mid) openMaterial(String(mid))
        return res
      }}
      onDuplicar={() => {}}
    />
  )
}
