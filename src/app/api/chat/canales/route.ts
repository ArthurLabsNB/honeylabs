export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function GET() {
  try {
    const canales = await prisma.chatCanal.findMany({
      orderBy: { nombre: 'asc' },
      select: { id: true, nombre: true }
    })
    return NextResponse.json({ canales })
  } catch (err) {
    logger.error('GET /api/chat/canales', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { nombre } = await req.json()
    if (!nombre) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })

    const canal = await prisma.chatCanal.create({ data: { nombre } })
    return NextResponse.json({ canal })
  } catch (err) {
    logger.error('POST /api/chat/canales', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
