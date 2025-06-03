import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'mi_clave_de_emergencia'
const COOKIE_NAME = 'hl_session'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    let payload: any
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }
    const usuarioId = Number(payload.id)
    const relaciones = await prisma.usuarioAlmacen.findMany({
      where: { usuarioId },
      include: { almacen: { select: { id: true, nombre: true } } }
    })
    const almacenes = relaciones.map(r => r.almacen)
    return NextResponse.json({ almacenes })
  } catch (error) {
    console.error('Error en /api/almacenes:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
