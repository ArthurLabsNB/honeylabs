"use client";
import UnidadForm from '../UnidadForm'
import { useBoard } from '../../board/BoardProvider'
import useUnidades from '@/hooks/useUnidades'
import { useTabStore } from '@/hooks/useTabs'

export default function UnidadFormTab({ tabId }: { tabId: string }) {
  const { unidadSel, setUnidadSel, materiales, selectedId } = useBoard()
  const { actualizar } = useUnidades(materiales.find(m => m.id === selectedId)?.dbId)
  const { close } = useTabStore()

  const guardar = async () => {
    if (!unidadSel) return
    await actualizar(unidadSel as any)
    setUnidadSel(null)
    close(tabId)
  }

  const cancelar = () => {
    setUnidadSel(null)
    close(tabId)
  }

  return (
    <UnidadForm
      unidad={unidadSel}
      onChange={(campo, valor) =>
        setUnidadSel(u => (u ? { ...u, [campo]: valor } : u))
      }
      onGuardar={guardar}
      onCancelar={cancelar}
    />
  )
}
