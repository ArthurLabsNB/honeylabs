"use client";
import UnidadForm from '../UnidadForm'
import { useBoard } from '../../board/BoardProvider'
import useUnidades from '@/hooks/useUnidades'
import { useTabStore } from '@/hooks/useTabs'
import { useToast } from '@/components/Toast'

export default function UnidadFormTab({ tabId }: { tabId: string }) {
  const { unidadSel, setUnidadSel, materiales, selectedId } = useBoard()
  const { actualizar } = useUnidades(materiales.find(m => m.id === selectedId)?.dbId)
  const { close } = useTabStore()
  const toast = useToast()

  const guardar = async () => {
    if (!unidadSel) return
    const res = await actualizar(unidadSel as any)
    if (res?.error) {
      toast.show(res.error, 'error')
      return
    }
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
