import { useState, useCallback } from 'react'
import useSession from '@/hooks/useSession'
import { apiFetch } from '@lib/api'
import { jsonOrNull } from '@lib/http'

export interface Alerta {
  id: number
  titulo: string
  mensaje: string
  prioridad: string
  fecha: string
  almacen: { nombre: string }
}

export async function exportCSV(tipo: 'material' | 'almacen' | 'unidad') {
  const res = await apiFetch(`/api/archivos/export?tipo=${tipo}&formato=csv`)
  if (!res.ok) return
  const blob = await res.blob()
  if (typeof document !== 'undefined') {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tipo}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
}

export async function bulkUpdateStocks(updates: { id: number; cantidad: number }[]) {
  return Promise.all(
    updates.map(u =>
      apiFetch(`/api/materiales/${u.id}/ajuste`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: u.cantidad }),
      }).then(jsonOrNull),
    ),
  )
}

export async function generateQRBatch(almacenId: number, cantidad: number) {
  const codigos: string[] = []
  for (let i = 0; i < cantidad; i++) {
    const res = await apiFetch('/api/codigos/generar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ almacenId, rolAsignado: 'lectura' }),
    })
    const data = await jsonOrNull(res)
    if (res.ok && data?.codigo) codigos.push(data.codigo as string)
  }
  return codigos
}

export default function useInventoryTools() {
  const { usuario } = useSession()
  const [alertas, setAlertas] = useState<Alerta[]>([])

  const loadAlertas = useCallback(async () => {
    if (!usuario) return
    const res = await apiFetch(`/api/alertas?usuarioId=${usuario.id}`)
    const data = await jsonOrNull(res)
    if (res.ok && data?.alertas) setAlertas(data.alertas as Alerta[])
  }, [usuario])

  const exportarCSV = useCallback(exportCSV, [])

  const bulkUpdate = useCallback(bulkUpdateStocks, [])

  const generarQR = useCallback(generateQRBatch, [])

  return { alertas, loadAlertas, exportarCSV, bulkUpdate, generarQR }
}
