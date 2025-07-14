export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function POST(req: NextRequest) {
  logger.debug(req, 'POST /api/almacenes/compartir')
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { codigo } = await req.json()
    if (!codigo) return NextResponse.json({ error: 'Código requerido' }, { status: 400 })

    const cod = await prisma.codigoAlmacen.findUnique({ where: { codigo } })
    if (!cod || !cod.activo) return NextResponse.json({ error: 'Código inválido' }, { status: 404 })
    if (cod.fechaExpiracion && cod.fechaExpiracion < new Date()) {
      return NextResponse.json({ error: 'Código expirado' }, { status: 410 })
    }
    if (cod.usosDisponibles !== null && cod.usosDisponibles <= 0) {
      return NextResponse.json({ error: 'Código sin usos' }, { status: 410 })
    }

    await prisma.usuarioAlmacen.upsert({
      where: { usuarioId_almacenId: { usuarioId: usuario.id, almacenId: cod.almacenId } },
      create: {
        usuarioId: usuario.id,
        almacenId: cod.almacenId,
        rolEnAlmacen: cod.rolAsignado,
        permisosExtra: cod.permisos,
      },
      update: {},
    })

    if (cod.usosDisponibles !== null) {
      await prisma.codigoAlmacen.update({
        where: { id: cod.id },
        data: { usosDisponibles: { decrement: 1 } },
      })
    }

    return NextResponse.json({ success: true, almacenId: cod.almacenId })
  } catch (err) {
    logger.error('POST /api/almacenes/compartir', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
