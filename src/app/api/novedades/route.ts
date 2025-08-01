import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import jwt from 'jsonwebtoken'
import { SESSION_COOKIE } from '@lib/constants'
import * as logger from '@lib/logger'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido en el entorno')
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    let payload: any
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }
    const usuarioId = Number(payload.id)
    const rel = await prisma.usuarioAlmacen.findMany({ where: { usuarioId }, select: { almacenId: true } })
    const almacenIds = rel.map(r => r.almacenId)
    const novedades = await prisma.novedadAlmacen.findMany({
      where: { almacenId: { in: almacenIds } },
      orderBy: { fecha: 'desc' },
      take: 5,
      select: { id: true, titulo: true, fecha: true }
    })
    return NextResponse.json({ novedades })
  } catch (error) {
    logger.error('Error en /api/novedades:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
