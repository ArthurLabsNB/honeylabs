export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import crypto from 'node:crypto'
import * as logger from '@lib/logger'

function getAlmacenIdFromRequest(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex((p) => p === 'almacenes')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  logger.debug(req, 'GET /api/almacenes/[id]/materiales')
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const almacenId = getAlmacenIdFromRequest(req)
    if (!almacenId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const materiales = await prisma.material.findMany({
      where: { almacenId },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        miniaturaNombre: true,
        cantidad: true,
        unidad: true,
        lote: true,
        fechaCaducidad: true,
        ubicacion: true,
        proveedor: true,
        estado: true,
        observaciones: true,
        codigoBarra: true,
        codigoQR: true,
        minimo: true,
        maximo: true,
        fechaRegistro: true,
        fechaActualizacion: true,
      },
    })

    const res = NextResponse.json({ materiales })
    logger.info(req, `Listados ${materiales.length} materiales`)
    return res
  } catch (err) {
    logger.error('GET /api/almacenes/[id]/materiales', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  logger.debug(req, 'POST /api/almacenes/[id]/materiales')
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const almacenId = getAlmacenIdFromRequest(req)
    if (!almacenId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    let nombre = ''
    let descripcion = ''
    let miniaturaNombre: string | null = null
    let miniaturaBuffer: Buffer | null = null
    let unidad: string | null = null
    let cantidad = 0
    let lote: string | null = null
    let fechaCaducidad: Date | null = null
    let ubicacion: string | null = null
    let proveedor: string | null = null
    let estado: string | null = null
    let observaciones: string | null = null
    let minimo: number | null = null
    let maximo: number | null = null
    let codigoBarra: string | null = null
    let codigoQR: string | null = null

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await req.formData()
      nombre = String(formData.get('nombre') ?? '').trim()
      descripcion = String(formData.get('descripcion') ?? '').trim()
      unidad = String(formData.get('unidad') ?? '').trim() || null
      cantidad = Number(formData.get('cantidad') ?? '0')
      lote = String(formData.get('lote') ?? '').trim() || null
      fechaCaducidad = formData.get('fechaCaducidad') ? new Date(String(formData.get('fechaCaducidad'))) : null
      ubicacion = String(formData.get('ubicacion') ?? '').trim() || null
      proveedor = String(formData.get('proveedor') ?? '').trim() || null
      estado = String(formData.get('estado') ?? '').trim() || null
      observaciones = String(formData.get('observaciones') ?? '').trim() || null
      minimo = formData.get('minimo') ? Number(formData.get('minimo')) : null
      maximo = formData.get('maximo') ? Number(formData.get('maximo')) : null
      codigoBarra = String(formData.get('codigoBarra') ?? '').trim() || null
      codigoQR = String(formData.get('codigoQR') ?? '').trim() || null
      const archivo = formData.get('miniatura') as File | null
      if (archivo) {
        const buffer = Buffer.from(await archivo.arrayBuffer())
        const nombreArchivo = `${crypto.randomUUID()}_${archivo.name}`
        miniaturaNombre = nombreArchivo
        miniaturaBuffer = buffer
      }
    } else {
      const body = await req.json()
      nombre = body.nombre
      descripcion = body.descripcion
      unidad = body.unidad || null
      cantidad = Number(body.cantidad)
      lote = body.lote || null
      fechaCaducidad = body.fechaCaducidad ? new Date(body.fechaCaducidad) : null
      ubicacion = body.ubicacion || null
      proveedor = body.proveedor || null
      estado = body.estado || null
      observaciones = body.observaciones || null
      minimo = body.minimo ?? null
      maximo = body.maximo ?? null
      codigoBarra = body.codigoBarra || null
      codigoQR = body.codigoQR || null
      miniaturaNombre = body.miniaturaNombre ?? null
    }

    if (!nombre) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })

    const material = await prisma.material.create({
      data: {
        nombre,
        descripcion,
        miniatura: miniaturaBuffer as any,
        miniaturaNombre,
        cantidad,
        unidad,
        lote,
        fechaCaducidad,
        ubicacion,
        proveedor,
        estado,
        observaciones,
        codigoBarra,
        codigoQR,
        minimo,
        maximo,
        almacen: { connect: { id: almacenId } },
        usuario: { connect: { id: usuario.id } },
      },
      select: {
        id: true,
        nombre: true,
        miniaturaNombre: true,
      },
    })

    const res = NextResponse.json({ material })
    logger.info(req, `Material ${material.id} creado`)
    return res
  } catch (err) {
    logger.error('POST /api/almacenes/[id]/materiales', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

