"use client"

import { apiFetch } from '@lib/api'

export const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const fetchAuditoriaExport = async (
  id: string | number,
  formato: 'pdf' | 'excel' | 'csv' | 'json'
) => {
  const res = await apiFetch(`/api/auditorias/${id}/export?format=${formato}`)
  if (!res.ok) throw new Error('Export failed')
  const blob = await res.blob()
  const ext = formato === 'excel' ? 'xlsx' : formato
  triggerDownload(blob, `auditoria_${id}.${ext}`)
}
