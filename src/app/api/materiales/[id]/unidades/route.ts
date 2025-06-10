export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'

function getMaterialId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'materiales')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const materialId = getMaterialId(req)
    if (!materialId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const material = await prisma.material.findUnique({ where: { id: materialId }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const unidades = await prisma.materialUnidad.findMany({
      where: { materialId },
      orderBy: { id: 'asc' },
      select: { id: true, nombre: true, codigoQR: true },
    })
    return NextResponse.json({ unidades })
  } catch (err) {
    logger.error('GET /api/materiales/[id]/unidades', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const materialId = getMaterialId(req)
    if (!materialId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const material = await prisma.material.findUnique({ where: { id: materialId }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const body = await req.json()
    const nombre = String(body.nombre ?? '').trim()
    let imagenBuffer: Buffer | null | undefined
    if (body.imagen !== undefined) {
      if (typeof body.imagen === 'string') {
        try {
          imagenBuffer = Buffer.from(body.imagen, 'base64')
        } catch {
          imagenBuffer = null
        }
      } else if (body.imagen === null) {
        imagenBuffer = null
      }
    }
    if (!nombre) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
    const data: any = {
      nombre,
      internoId: body.internoId ?? null,
      serie: body.serie ?? null,
      codigoBarra: body.codigoBarra ?? null,
      lote: body.lote ?? null,
      qrGenerado: body.qrGenerado ?? null,
        unidadMedida: body.unidadMedida ?? null,
        peso: body.peso !== undefined ? Number(body.peso) : null,
        volumen: body.volumen !== undefined ? Number(body.volumen) : null,
        alto: body.alto !== undefined ? Number(body.alto) : null,
        largo: body.largo !== undefined ? Number(body.largo) : null,
        ancho: body.ancho !== undefined ? Number(body.ancho) : null,
        color: body.color ?? null,
        temperatura: body.temperatura ?? null,
        estado: body.estado ?? null,
        ubicacionExacta: body.ubicacionExacta ?? null,
        area: body.area ?? null,
        subcategoria: body.subcategoria ?? null,
        riesgo: body.riesgo ?? null,
        disponible: typeof body.disponible === 'boolean' ? body.disponible : null,
        asignadoA: body.asignadoA ?? null,
        fechaIngreso: body.fechaIngreso ? new Date(body.fechaIngreso) : null,
        fechaModificacion: body.fechaModificacion ? new Date(body.fechaModificacion) : null,
        fechaCaducidad: body.fechaCaducidad ? new Date(body.fechaCaducidad) : null,
        fechaInspeccion: body.fechaInspeccion ? new Date(body.fechaInspeccion) : null,
        fechaBaja: body.fechaBaja ? new Date(body.fechaBaja) : null,
        responsableIngreso: body.responsableIngreso ?? null,
        modificadoPor: body.modificadoPor ?? null,
        proyecto: body.proyecto ?? null,
      observaciones: body.observaciones ?? null,
      imagenNombre: body.imagenNombre ?? null,
      materialId,
    }
    if (imagenBuffer !== undefined) data.imagen = imagenBuffer
    const creado = await prisma.materialUnidad.create({
      data,
      select: { id: true, nombre: true, codigoQR: true },
    })
    return NextResponse.json({ unidad: creado })
  } catch (err) {
    logger.error('POST /api/materiales/[id]/unidades', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
