"use client";
import AuditoriasPanel from '../../[id]/AuditoriasPanel'
import { useBoard } from '../../board/BoardProvider'
import { useTabHelpers } from '@/hooks/useTabHelpers'

export default function AuditoriasTab() {
  const { materiales, selectedId, setAuditoriaSel } = useBoard()
  const material = materiales.find(m => m.id === selectedId) || null
  const { ensureTab } = useTabHelpers()

  const openAuditoria = (entry: any) => {
    if (!entry?.id) return
    setAuditoriaSel(entry.id)
    ensureTab('form-auditoria', 'Auditoría', 'left')
  }

  return (
    <AuditoriasPanel material={material} almacenId={0} onSelectHistorial={openAuditoria} />
  )
}
