import { NextRequest } from 'next/server'

export async function registrarAuditoria(
  req: NextRequest,
  tipo: 'almacen' | 'material' | 'unidad',
  objetoId: number,
  categoria: string,
  datos: any,
  archivos: File[] = [],
) {
  try {
    const form = new FormData()
    form.set('tipo', tipo)
    form.set('objetoId', String(objetoId))
    form.set('categoria', categoria)
    form.set('observaciones', JSON.stringify(datos ?? {}))
    for (const a of archivos) form.append('archivos', a)
    const url = new URL('/api/reportes', req.url)
    const res = await fetch(url, {
      method: 'POST',
      headers: { cookie: req.headers.get('cookie') ?? '' },
      body: form,
    })
    if (!res.ok) return null
    const { reporte } = await res.json()
    const res2 = await fetch(new URL('/api/auditorias', req.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') ?? '',
      },
      body: JSON.stringify({ reporteId: reporte.id }),
    })
    if (!res2.ok) return null
    const { auditoria } = await res2.json()
    return auditoria
  } catch {
    return null
  }
}
