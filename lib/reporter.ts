import { NextRequest } from 'next/server'
import * as logger from './logger'
import { apiPath } from './api'

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
      res = await fetch(new URL(apiPath('/api/auditorias'), req.url), {
        method: 'POST',
        headers: { cookie: req.headers.get('cookie') ?? '' },
        body: form,
      })
    } catch (err) {
      logger.error(req, 'Error de red al crear auditoría', err)
      return { error: 'Error de red al crear auditoría' }
    }
    const data = await res
      .json()
      .catch(() => ({ error: 'No se pudo crear auditoría' }))
    if (!res.ok) {
      const msg = data?.error || 'No se pudo crear auditoría'
      logger.error(req, 'Fallo al crear auditoría', msg)
      return { error: msg }
    }
    const { auditoria } = data as any
    return { auditoria }
  } catch (err) {
    logger.error(req, 'Error inesperado en registrarAuditoria', err)
    return { error: 'Error inesperado' }
  }
}
