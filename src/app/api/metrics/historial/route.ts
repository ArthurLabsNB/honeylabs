export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import * as logger from '@lib/logger'

export async function GET() {
  try {
    const inicio = new Date()
    inicio.setHours(0, 0, 0, 0)

    const [sesiones, usuariosActivos, cambiosSesion] = await Promise.all([
      prisma.sesionUsuario.findMany({ select: { fechaInicio: true, fechaUltima: true } }),
      prisma.sesionUsuario.count({ where: { activa: true } }),
      prisma.bitacoraCambioPerfil.count({ where: { fecha: { gte: inicio } } }),
    ])

    const promedio = sesiones.length
      ? sesiones.reduce((acc, s) => acc + (s.fechaUltima.getTime() - s.fechaInicio.getTime()) / 60000, 0) / sesiones.length
      : 0

    return NextResponse.json({
      tiempoEdicionPromedio: Math.round(promedio),
      usuariosActivos,
      cambiosSesion,
    })
  } catch (err) {
    logger.error('[METRICS_HISTORIAL]', err)
    return NextResponse.json({ error: 'Error obteniendo métricas' }, { status: 500 })
  }
}
