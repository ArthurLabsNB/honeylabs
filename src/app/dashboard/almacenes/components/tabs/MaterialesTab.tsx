"use client";
import { useState, useCallback, useEffect, useRef } from 'react'
import MaterialList from '../MaterialList'
import type { Material } from '../MaterialRow'
import { useBoard } from '../../board/BoardProvider'
import { generarUUID } from '@/lib/uuid'
import { openMaterial as doOpenMaterial } from '../../utils/openMaterial'
import { useToast } from '@/components/Toast'
import { parseId } from '@/lib/parseId'

export default function MaterialesTab() {
  const {
    materiales,
    selectedId,
    setSelectedId,
    setUnidadSel,
    crear,
    duplicar,
    eliminar,
    mutate,
  } = useBoard()
  const toast = useToast()
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState<'nombre' | 'cantidad'>('nombre')
  const nameCounter = useRef(0)

  const removeMaterial = useCallback(
    async (id: number) => {
      const valid = parseId(id)
      if (!valid) {
        toast.show('ID inválido', 'error')
        return
      }
      const ok = await toast.confirm('¿Eliminar material?')
      if (!ok) return
      const res = await eliminar(valid)
      if (res?.error) toast.show(res.error, 'error')
      else toast.show('Material eliminado', 'success')
      mutate()
      setSelectedId(null)
    },
    [eliminar, mutate, setSelectedId, toast],
  )

  useEffect(() => {
    const max = materiales.reduce((acc, m) => {
      const match = /Material New (\d+)/.exec(m.nombre)
      if (match) {
        const n = Number(match[1])
        return n > acc ? n : acc
      }
      return acc
    }, 0)
    if (max > nameCounter.current) nameCounter.current = max
  }, [materiales])

  const openMaterial = useCallback(
    (id: string | null) =>
      doOpenMaterial(id, {
        setSelectedId,
        setUnidadSel,
      }),
    [setSelectedId, setUnidadSel]
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
        const nombre = `Material New ${nameCounter.current + 1}`
        const nuevo = {
          id: generarUUID(),
          nombre,
          cantidad: 0,
          lote: '',
        } as Material
        const res = await crear(nuevo)
        nameCounter.current += 1
        const mid = res?.material?.id
        if (mid) openMaterial(String(mid))
        return res
      }}
      onDuplicar={async (mid) => {
        const id = parseId(mid)
        if (!id) {
          toast.show('ID inválido', 'error')
          return
        }
        const res = await duplicar(id)
        if (res?.material?.id) {
          toast.show('Material duplicado', 'success')
          openMaterial(String(res.material.id))
        } else {
          toast.show(res?.error || 'Error al duplicar', 'error')
        }
      }}
      onEliminar={removeMaterial}
    />
  )
}
