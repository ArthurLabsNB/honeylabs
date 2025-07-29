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
  formato: 'pdf' | 'excel' | 'csv' | 'json',
  incluirArchivos = false,
) => {
  const url = `/api/auditorias/${id}/export?format=${formato}${incluirArchivos ? '&files=1' : ''}`
  const res = await apiFetch(url)
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Export failed')
    throw new Error(msg)
  }
  const blob = await res.blob()
  const contentType = res.headers.get('Content-Type') || ''
  const ext = contentType.includes('zip') ? 'zip' : formato === 'excel' ? 'xlsx' : formato
  triggerDownload(blob, `auditoria_${id}.${ext}`)
}
