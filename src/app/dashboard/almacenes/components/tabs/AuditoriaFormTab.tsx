"use client";
import AuditoriaForm from '../AuditoriaForm'
import { useBoard } from '../../board/BoardProvider'
import { useTabStore } from '@/hooks/useTabs'

export default function AuditoriaFormTab({ tabId }: { tabId: string }) {
  const { auditoriaSel, setAuditoriaSel } = useBoard()
  const { close } = useTabStore()

  const onClose = () => {
    setAuditoriaSel(null)
    close(tabId)
  }

  return <AuditoriaForm auditoriaId={auditoriaSel} onClose={onClose} />
}
