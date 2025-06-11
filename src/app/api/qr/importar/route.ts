export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function POST(req: NextRequest) {
  logger.debug(req, 'POST /api/qr/importar')
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { codigo } = await req.json()
    if (!codigo) return NextResponse.json({ error: 'Código requerido' }, { status: 400 })

    const unidad = await prisma.materialUnidad.findUnique({
      where: { codigoQR: codigo },
      include: { material: true, archivos: { select: { nombre: true, archivoNombre: true } } },
    })
    if (unidad) return NextResponse.json({ tipo: 'unidad', unidad })

    const material = await prisma.material.findFirst({
      where: { codigoQR: codigo },
      include: {
        unidades: { include: { archivos: { select: { nombre: true, archivoNombre: true } } } },
        archivos: { select: { nombre: true, archivoNombre: true } },
      },
    })
    if (material) return NextResponse.json({ tipo: 'material', material })

    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  } catch (err) {
    logger.error('POST /api/qr/importar', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
