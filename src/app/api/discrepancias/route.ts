export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { tipo, objetoId, campo, actual, escaneado } = await req.json()
    if (!tipo || !objetoId || !campo) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }
    await prisma.logDiscrepancia.create({
      data: {
        tipo,
        objetoId: Number(objetoId),
        campo,
        valorActual: String(actual),
        valorEscaneado: String(escaneado),
        usuarioId: usuario.id,
      },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('POST /api/discrepancias', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
