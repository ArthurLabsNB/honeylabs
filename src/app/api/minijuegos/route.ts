export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import { getUsuarioFromSession } from '@lib/auth'

export async function GET(req: NextRequest) {
  const usuario = await getUsuarioFromSession(req)
  if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const juegos = await prisma.minijuego.findMany({
    where: { usuarioId: usuario.id },
    orderBy: { id: 'desc' },
    select: { id: true, nombre: true, plataforma: true, archivo: true }
  })
  return NextResponse.json({ juegos })
}
