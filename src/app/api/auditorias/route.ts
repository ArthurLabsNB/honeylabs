export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function GET(req: NextRequest) {
  try {
    await prisma.$connect()
    const tipo = req.nextUrl.searchParams.get('tipo') || undefined
    const categoria = req.nextUrl.searchParams.get('categoria') || undefined
    const almacenId = req.nextUrl.searchParams.get('almacenId') || undefined
    const materialId = req.nextUrl.searchParams.get('materialId') || undefined
    const unidadId = req.nextUrl.searchParams.get('unidadId') || undefined
    const q = req.nextUrl.searchParams.get('q')?.toLowerCase() || undefined
    const desde = req.nextUrl.searchParams.get('desde') || undefined
    const hasta = req.nextUrl.searchParams.get('hasta') || undefined
    const where: any = {}
    if (tipo && ['almacen','material','unidad'].includes(tipo)) where.tipo = tipo
    if (almacenId) where.almacenId = Number(almacenId)
    if (materialId) where.materialId = Number(materialId)
    if (unidadId) where.unidadId = Number(unidadId)
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
    if (desde) where.fecha = { gte: new Date(desde) }
    if (hasta) where.fecha = { ...(where.fecha || {}), lte: new Date(hasta) }

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
    await prisma.$connect()
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { reporteId } = await req.json()
    if (!reporteId) return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    const original = await prisma.reporte.findUnique({
      where: { id: Number(reporteId) },
      include: { archivos: true }
    })
    if (!original) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  const { id, archivos, ...data } = original as any
  data.fecha = new Date()
  const copia = await prisma.reporte.create({ data })
    if (archivos && archivos.length) {
      await Promise.all(
        archivos.map(a =>
          prisma.archivoReporte.create({
            data: {
              nombre: a.nombre,
              archivo: a.archivo as any,
              archivoNombre: a.archivoNombre,
              reporteId: copia.id,
              subidoPorId: a.subidoPorId ?? null,
            },
          })
        )
      )
    }
    return NextResponse.json({ auditoria: copia })
  } catch (err) {
    logger.error('POST /api/auditorias', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
