import { NextRequest } from 'next/server'
import * as logger from './logger'

export interface RegistrarAuditoriaResult {
  auditoria?: any
  error?: string
}

export async function registrarAuditoria(
  req: NextRequest,
  tipo: 'almacen' | 'material' | 'unidad',
  objetoId: number,
  categoria: string,
  datos: any,
  archivos: File[] = [],
): Promise<RegistrarAuditoriaResult> {
  try {
    const form = new FormData()
    form.set('tipo', tipo)
    form.set('objetoId', String(objetoId))
    form.set('categoria', categoria)
    form.set('observaciones', JSON.stringify(datos ?? {}))
    for (const a of archivos) form.append('archivos', a)

    let res: Response
    try {
      res = await fetch(new URL('/api/reportes', req.url), {
        method: 'POST',
        headers: { cookie: req.headers.get('cookie') ?? '' },
        body: form,
      })
    } catch (err) {
      logger.error(req, 'Error de red al crear reporte', err)
      return { error: 'Error de red al crear reporte' }
    }
    if (!res.ok) {
      logger.error(req, 'Fallo al crear reporte', res.status)
      return { error: 'No se pudo crear reporte' }
    }
    const { reporte } = await res.json()

    let res2: Response
    try {
      res2 = await fetch(new URL('/api/auditorias', req.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: req.headers.get('cookie') ?? '',
        },
        body: JSON.stringify({ reporteId: reporte.id }),
      })
    } catch (err) {
      logger.error(req, 'Error de red al crear auditoría', err)
      return { error: 'Error de red al crear auditoría' }
    }
    if (!res2.ok) {
      logger.error(req, 'Fallo al crear auditoría', res2.status)
      return { error: 'No se pudo crear auditoría' }
    }
    const { auditoria } = await res2.json()
    return { auditoria }
  } catch (err) {
    logger.error(req, 'Error inesperado en registrarAuditoria', err)
    return { error: 'Error inesperado' }
  }
}
