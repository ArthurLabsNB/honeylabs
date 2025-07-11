export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { Prisma } from '@prisma/client'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'
import { logAudit } from '@/lib/audit'

async function snapshot(unidadId: number, usuarioId: number, descripcion: string) {
  const unidad = await prisma.materialUnidad.findUnique({
    where: { id: unidadId },
    include: { archivos: { select: { nombre: true, archivoNombre: true, archivo: true } } },
  })
  const estado = unidad
    ? {
        ...unidad,
        imagen: unidad.imagen ? Buffer.from(unidad.imagen as Buffer).toString('base64') : null,
        archivos: unidad.archivos.map(a => ({
          nombre: a.nombre,
          archivoNombre: a.archivoNombre,
          archivo: a.archivo ? Buffer.from(a.archivo as Buffer).toString('base64') : null,
        })),
      }
    : null
  // @ts-ignore
  await prisma.historialUnidad.create({
    data: { unidadId, usuarioId, descripcion, estado },
  })
}

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
    if (process.env.NODE_ENV === 'development') console.error(err)
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
          if (imagenBuffer.toString('base64') !== body.imagen.replace(/\s/g, '')) throw new Error('invalid')
        } catch {
          return NextResponse.json({ error: 'Imagen inválida' }, { status: 400 })
        }
      } else if (body.imagen === null) {
        imagenBuffer = null
      }
    }
    if (!nombre) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
    const num = (v: any) => (v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v))
    const fecha = (v: any) => {
      if (!v) return null
      const d = new Date(v)
      return Number.isNaN(d.getTime()) ? null : d
    }
    const str = (v: any) => (v === undefined || v === null ? null : String(v).trim() || null)
    const data: any = {
      nombre,
      internoId: str(body.internoId),
      serie: str(body.serie),
      codigoBarra: str(body.codigoBarra),
      lote: str(body.lote),
      qrGenerado: str(body.qrGenerado),
      codigoQR: str(body.codigoQR) ?? undefined,
      unidadMedida: str(body.unidadMedida),
      peso: num(body.peso),
      volumen: num(body.volumen),
      alto: num(body.alto),
      largo: num(body.largo),
      ancho: num(body.ancho),
      color: str(body.color),
      temperatura: str(body.temperatura),
      estado: str(body.estado),
      ubicacionExacta: str(body.ubicacionExacta),
      area: str(body.area),
      subcategoria: str(body.subcategoria),
      riesgo: str(body.riesgo),
      disponible: typeof body.disponible === 'boolean' ? body.disponible : null,
      asignadoA: str(body.asignadoA),
      fechaIngreso: fecha(body.fechaIngreso),
      fechaModificacion: fecha(body.fechaModificacion),
      fechaCaducidad: fecha(body.fechaCaducidad),
      fechaInspeccion: fecha(body.fechaInspeccion),
      fechaBaja: fecha(body.fechaBaja),
      responsableIngreso: str(body.responsableIngreso),
      modificadoPor: str(body.modificadoPor),
      proyecto: str(body.proyecto),
      observaciones: str(body.observaciones),
      imagenNombre: str(body.imagenNombre),
      materialId,
    }
    if (data.codigoQR == null) delete data.codigoQR
    if (imagenBuffer !== undefined) data.imagen = imagenBuffer
    try {
      const creado = await prisma.materialUnidad.create({
        data,
        select: { id: true, nombre: true, codigoQR: true },
      })
      await snapshot(creado.id, usuario.id, 'Creación')
      await logAudit(usuario.id, 'creacion_unidad', 'material', { materialId, unidadId: creado.id })
      return NextResponse.json({ unidad: creado })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        return NextResponse.json(
          { error: 'Unidad ya existente' },
          { status: 409 },
        )
      }
      throw e
    }
  } catch (err) {
    logger.error('POST /api/materiales/[id]/unidades', err)
    if (process.env.NODE_ENV === 'development') console.error(err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
