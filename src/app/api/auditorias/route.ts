export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { Prisma } from '@prisma/client'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'
import { ensureAuditoriaTables } from '@lib/auditoriaInit'
import { emitEvent } from '@/lib/events'

export async function GET(req: NextRequest) {
  try {
    await ensureAuditoriaTables()
    const tipo = req.nextUrl.searchParams.get('tipo') || undefined
    const categoria = req.nextUrl.searchParams.get('categoria') || undefined
    const almacenId = req.nextUrl.searchParams.get('almacenId') || undefined
    const materialId = req.nextUrl.searchParams.get('materialId') || undefined
    const unidadId = req.nextUrl.searchParams.get('unidadId') || undefined
    const usuarioId = req.nextUrl.searchParams.get('usuarioId') || undefined
    const q = req.nextUrl.searchParams.get('q')?.toLowerCase() || undefined
    const desde = req.nextUrl.searchParams.get('desde') || undefined
    const hasta = req.nextUrl.searchParams.get('hasta') || undefined
    const where: any = {}
    if (tipo && ['almacen','material','unidad'].includes(tipo)) where.tipo = tipo
    if (almacenId) where.almacenId = Number(almacenId)
    if (materialId) where.materialId = Number(materialId)
    if (unidadId) where.unidadId = Number(unidadId)
    if (usuarioId) where.usuarioId = Number(usuarioId)
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

    const auditorias = await prisma.auditoria.findMany({
      take: 50,
      orderBy: { fecha: 'desc' },
      where,
      // "version" se excluye para compatibilidad con clientes antiguos
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
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2021'
    ) {
      logger.error('GET /api/auditorias', err)
      return NextResponse.json(
        { error: 'Base de datos no inicializada.' },
        { status: 500 },
      )
    }
    logger.error('GET /api/auditorias', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureAuditoriaTables()
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

    const data: Prisma.AuditoriaCreateInput = {
      tipo,
      observaciones,
      categoria,
      usuario: { connect: { id: usuario.id } },
    }

    const where: Prisma.AuditoriaWhereInput = { tipo }
    const objId = Number(objetoId)
    if (tipo === 'almacen') {
      data.almacen = { connect: { id: objId } }
      where.almacenId = objId
    }
    if (tipo === 'material') {
      data.material = { connect: { id: objId } }
      where.materialId = objId
    }
    if (tipo === 'unidad') {
      data.unidad = { connect: { id: objId } }
      where.unidadId = objId
    }
    const auditoria = await prisma.$transaction(async (tx) => {
      const count = await tx.auditoria.count({ where })
      return tx.auditoria.create({
        data: { ...data, version: count + 1 },
        select: { id: true },
      })
    })

    if (files.length > 0) {
      await Promise.all(
        files.map(async (f) => {
          const buffer = Buffer.from(await f.arrayBuffer())
          await prisma.archivoAuditoria.create({
            data: {
              nombre: f.name,
              archivo: buffer as any,
              auditoriaId: auditoria.id,
            },
          })
        })
      )
    }
    emitEvent({ type: 'auditoria_new', payload: { id: auditoria.id } })

    return NextResponse.json({ auditoria })
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2021'
    ) {
      logger.error('POST /api/auditorias', err)
      return NextResponse.json(
        { error: 'Base de datos no inicializada.' },
        { status: 500 },
      )
    }
    logger.error('POST /api/auditorias', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
