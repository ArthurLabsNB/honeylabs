export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'

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
    if (!nombre) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
    const actualizado = await prisma.materialUnidad.update({
      where: { id: unidadId },
      data: {
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
        imagen: body.imagen ?? null,
        imagenNombre: body.imagenNombre ?? null,
      },
      select: { id: true, nombre: true, codigoQR: true },
    })
    return NextResponse.json({ unidad: actualizado })
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
    await prisma.materialUnidad.delete({ where: { id: unidadId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('DELETE /api/materiales/[id]/unidades/[unidadId]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
