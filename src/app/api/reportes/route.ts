export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function GET(req: NextRequest) {
  try {
    const tipo = req.nextUrl.searchParams.get('tipo') || undefined
    const where: any = tipo && ['almacen', 'material', 'unidad'].includes(tipo) ? { tipo } : {}
    const reportes = await prisma.reporte.findMany({
      take: 20,
      orderBy: { fecha: 'desc' },
      where,
      select: {
        id: true,
        tipo: true,
        categoria: true,
        fecha: true,
        observaciones: true,
      },
    })
    return NextResponse.json({ reportes })
  } catch (err) {
    logger.error('GET /api/reportes', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    let tipo: string | null = null
    let objetoId: string | null = null
    let observaciones: string | null = null
    let categoria: string | null = null
    let files: File[] = []

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const form = await req.formData()
      tipo = String(form.get('tipo') ?? '')
      objetoId = String(form.get('objetoId') ?? '')
      observaciones = String(form.get('observaciones') ?? '')
      categoria = String(form.get('categoria') ?? '')
      files = form.getAll('archivos') as File[]
    } else {
      const body = await req.json()
      tipo = body.tipo
      objetoId = body.objetoId
      observaciones = body.observaciones
      categoria = body.categoria
    }

    if (!tipo || !objetoId) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const data: any = { tipo, observaciones, categoria, usuarioId: usuario.id }
    if (tipo === 'almacen') data.almacenId = Number(objetoId)
    if (tipo === 'material') data.materialId = Number(objetoId)
    if (tipo === 'unidad') data.unidadId = Number(objetoId)

    const reporte = await prisma.reporte.create({ data, select: { id: true } })

    if (files.length > 0) {
      await Promise.all(
        files.map(async (f) => {
          const buffer = Buffer.from(await f.arrayBuffer())
          await prisma.archivoReporte.create({
            data: {
              nombre: f.name,
              archivo: buffer as any,
              reporteId: reporte.id,
            },
          })
        }),
      )
    }

    return NextResponse.json({ reporte })
  } catch (err) {
    logger.error('POST /api/reportes', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
