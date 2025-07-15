"use client";
import { useState, useCallback } from 'react'
import MaterialList from '../MaterialList'
import type { Material } from '../MaterialRow'
import { useBoard } from '../../board/BoardProvider'
import { useTabHelpers } from '@/hooks/useTabHelpers'
import { generarUUID } from '@/lib/uuid'
import { openMaterial as doOpenMaterial } from '../../utils/openMaterial'

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
    (id: string | null) =>
      doOpenMaterial(id, {
        setSelectedId,
        setUnidadSel,
        ensureTab,
        openForm,
      }),
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
