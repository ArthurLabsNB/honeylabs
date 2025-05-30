// src/app/api/pacman/ranking.ts

import { NextResponse } from 'next/server'
// Usa import relativo, no alias:
import { prisma } from '@lib/prisma';

export async function GET() {
  // Top 10 por puntaje más alto
  const top = await prisma.puntajePacman.findMany({
    take: 10,
    orderBy: { puntaje: 'desc' },
    include: { usuario: { select: { nombre: true } } }
  })
  return NextResponse.json({ top })
}
