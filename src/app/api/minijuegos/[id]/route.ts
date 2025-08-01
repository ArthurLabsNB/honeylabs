export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import fs from 'fs/promises'
import path from 'path'

function getId(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/')
  return Number(parts[parts.length - 1])
}

export async function GET(req: NextRequest) {
  const usuario = await getUsuarioFromSession(req)
  if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const id = getId(req)
  const juego = await prisma.minijuego.findFirst({
    where: { id, usuarioId: usuario.id },
    select: { id: true, nombre: true, plataforma: true, archivo: true }
  })
  if (!juego) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ juego })
}

export async function DELETE(req: NextRequest) {
  const usuario = await getUsuarioFromSession(req)
  if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const id = getId(req)
  const juego = await prisma.minijuego.findFirst({ where: { id, usuarioId: usuario.id } })
  if (!juego) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const filePath = path.join(process.cwd(), 'public/roms', juego.archivo)
  await fs.unlink(filePath).catch(() => null)
  await prisma.minijuego.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
