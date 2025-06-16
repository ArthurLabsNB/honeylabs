export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function GET(req: NextRequest) {
  try {
    const tipo = req.nextUrl.searchParams.get('tipo') || undefined
    const categoria = req.nextUrl.searchParams.get('categoria') || undefined
    const q = req.nextUrl.searchParams.get('q')?.toLowerCase() || undefined
    const where: any = {}
    if (tipo && ['almacen','material','unidad'].includes(tipo)) where.tipo = tipo
    if (categoria) where.categoria = categoria
    if (q) {
      where.OR = [
        { observaciones: { contains: q, mode: 'insensitive' } },
        { almacen: { nombre: { contains: q, mode: 'insensitive' } } },
        { material: { nombre: { contains: q, mode: 'insensitive' } } },
        { unidad: { nombre: { contains: q, mode: 'insensitive' } } },
        { usuario: { nombre: { contains: q, mode: 'insensitive' } } },
      ]
    }
    const auditorias = await prisma.reporte.findMany({
      take: 50,
      orderBy: { fecha: 'desc' },
      where,
      select: {
        id: true,
        tipo: true,
        categoria: true,
        fecha: true,
        observaciones: true,
        usuario: { select: { nombre: true } },
        almacen: { select: { nombre: true } },
        material: { select: { nombre: true } },
        unidad: { select: { nombre: true } },
      },
    })
    return NextResponse.json({ auditorias })
  } catch (err) {
    logger.error('GET /api/auditorias', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { reporteId } = await req.json()
    if (!reporteId) return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    await prisma.reporte.update({ where: { id: Number(reporteId) }, data: {} })
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('POST /api/auditorias', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
