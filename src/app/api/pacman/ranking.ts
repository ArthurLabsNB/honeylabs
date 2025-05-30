import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  // Top 10 por puntaje más alto
  const top = await prisma.puntajePacman.findMany({
    take: 10,
    orderBy: { puntaje: 'desc' },
    include: { usuario: { select: { nombre: true, imagen: true } } }
  })
  return NextResponse.json({ top })
}
