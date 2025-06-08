import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function GET() {
  try {
    const usuario = await getUsuarioFromSession()
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const prefs = usuario.preferencias ? JSON.parse(usuario.preferencias) : {}
    const orden = Array.isArray(prefs.ordenAlmacenes) ? prefs.ordenAlmacenes : []
    return NextResponse.json({ orden })
  } catch (err) {
    logger.error('GET /api/almacenes/orden', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession()
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { ids } = await req.json()
    if (!Array.isArray(ids) || !ids.every((n) => typeof n === 'number')) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
    const prefs = usuario.preferencias ? JSON.parse(usuario.preferencias) : {}
    prefs.ordenAlmacenes = ids
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { preferencias: JSON.stringify(prefs) },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('POST /api/almacenes/orden', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
