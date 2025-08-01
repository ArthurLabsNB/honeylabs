export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import { Prisma } from '@prisma/client'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'
import { logAudit } from '@/lib/audit'
import { registrarAuditoria } from '@lib/reporter'
import { snapshotUnidad } from '@/lib/snapshot'

function getIds(req: NextRequest): { materialId: number | null; unidadId: number | null } {
  const parts = req.nextUrl.pathname.split('/')
  const idxM = parts.findIndex(p => p === 'materiales')
  const idxU = parts.findIndex(p => p === 'unidades')
  const materialId = idxM !== -1 && parts.length > idxM + 1 ? Number(parts[idxM + 1]) : null
  const unidadId = idxU !== -1 && parts.length > idxU + 1 ? Number(parts[idxU + 1]) : null
  return {
    materialId: materialId && !Number.isNaN(materialId) ? materialId : null,
    unidadId: unidadId && !Number.isNaN(unidadId) ? unidadId : null,
  }
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { materialId, unidadId } = getIds(req)
    if (!materialId || !unidadId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const material = await prisma.material.findUnique({ where: { id: materialId }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const unidadDb = await prisma.materialUnidad.findUnique({
      where: { id: unidadId },
      include: {
        archivos: {
          select: { id: true, nombre: true, archivoNombre: true, archivo: true, fecha: true },
        },
      },
    })
    if (!unidadDb) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

    const unidad = {
      ...unidadDb,
      imagen: unidadDb.imagen
        ? Buffer.from(unidadDb.imagen as Buffer).toString('base64')
        : null,
      archivos: unidadDb.archivos.map(a => ({
        id: a.id,
        nombre: a.nombre,
        archivoNombre: a.archivoNombre,
        fecha: a.fecha,
        archivo: a.archivo ? Buffer.from(a.archivo as Buffer).toString('base64') : null,
      })),
    }
    return NextResponse.json({ unidad })
  } catch (err) {
    logger.error('GET /api/materiales/[id]/unidades/[unidadId]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { materialId, unidadId } = getIds(req)
    if (!materialId || !unidadId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
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
      codigoQR: str(body.codigoQR) ?? undefined,
    }
    if (data.codigoQR == null) delete data.codigoQR
    if (imagenBuffer !== undefined) data.imagen = imagenBuffer
    try {
      const actualizado = await prisma.materialUnidad.update({
        where: { id: unidadId },
        data,
        select: { id: true, nombre: true, codigoQR: true },
      })
      await snapshotUnidad(prisma, actualizado.id, usuario.id, 'Modificación')
      await logAudit(usuario.id, 'modificacion_unidad', 'material', { materialId, unidadId })

      const { auditoria, error: auditError } = await registrarAuditoria(
        req,
        'unidad',
        unidadId,
        'modificacion',
        data,
      )

      return NextResponse.json({ unidad: actualizado, auditoria, auditError })
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
    logger.error('PUT /api/materiales/[id]/unidades/[unidadId]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { materialId, unidadId } = getIds(req)
    if (!materialId || !unidadId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const material = await prisma.material.findUnique({ where: { id: materialId }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    let motivo = ''
    try {
      const body = await req.json()
      motivo = String(body?.motivo ?? '').trim()
    } catch {}
    await snapshotUnidad(prisma, unidadId, usuario.id, 'Eliminación')
    await prisma.materialUnidad.delete({ where: { id: unidadId } })
    await logAudit(usuario.id, 'eliminacion_unidad', 'material', { materialId, unidadId })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'unidad',
      unidadId,
      'eliminacion',
      { motivo },
    )

    return NextResponse.json({ success: true, auditoria, auditError })
  } catch (err) {
    logger.error('DELETE /api/materiales/[id]/unidades/[unidadId]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
