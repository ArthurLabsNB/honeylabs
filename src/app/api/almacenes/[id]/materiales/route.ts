export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@lib/db'
import type { Prisma } from '@prisma/client'
import { materialSchema } from '@/lib/validators/material'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import crypto from 'node:crypto'
import * as logger from '@lib/logger'
import { logAudit } from '@/lib/audit'
import { registrarAuditoria } from '@lib/reporter'
import { snapshotMaterial } from '@/lib/snapshot'
import { emitEvent } from '@/lib/events'

function getAlmacenIdFromRequest(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex((p) => p === 'almacenes')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  const prisma = getDb().client as any
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
      orderBy: { id: 'desc' },
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
        _count: { select: { unidades: true } },
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
  const prisma = getDb().client as any
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

    let miniaturaNombre: string | null = null
    let miniaturaBuffer: Buffer | null = null
    let datos: any = {}

    let reportFiles: File[] = []

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await req.formData()
      datos = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion') ?? undefined,
        cantidad: formData.get('cantidad'),
        unidad: formData.get('unidad'),
        lote: formData.get('lote'),
        fechaCaducidad: formData.get('fechaCaducidad'),
        ubicacion: formData.get('ubicacion'),
        proveedor: formData.get('proveedor'),
        estado: formData.get('estado'),
        observaciones: formData.get('observaciones'),
        minimo: formData.get('minimo'),
        maximo: formData.get('maximo'),
        codigoBarra: formData.get('codigoBarra'),
        codigoQR: formData.get('codigoQR'),
        reorderLevel: formData.get('reorderLevel'),
        miniaturaNombre: undefined,
      }
      reportFiles = formData.getAll('archivos') as File[]
      const archivo = formData.get('miniatura') as File | null
      if (archivo) {
        const buffer = Buffer.from(await archivo.arrayBuffer())
        const nombreArchivo = `${crypto.randomUUID()}_${archivo.name}`
        miniaturaNombre = nombreArchivo
        miniaturaBuffer = buffer
        datos.miniaturaNombre = nombreArchivo
        reportFiles.push(archivo)
      }
    } else {
      datos = await req.json()
    }
    const parsed = materialSchema.partial().safeParse(datos)
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      const campo = issue?.path?.[0]
      const msg = campo ? `Campo "${campo}" inválido` : 'Datos inválidos'
      return NextResponse.json({ error: msg }, { status: 400 })
    }
    const {
      nombre,
      descripcion,
      cantidad,
      unidad,
      lote,
      fechaCaducidad,
      ubicacion,
      proveedor,
      estado,
      observaciones,
      minimo,
      maximo,
      codigoBarra,
      codigoQR,
      reorderLevel,
    } = parsed.data

    if (
      nombre !== undefined &&
      (!nombre.trim() || nombre.trim().toLowerCase() === 'nuevo')
    ) {
      return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 })
    }

    miniaturaNombre = parsed.data.miniaturaNombre ?? miniaturaNombre

    const material = await prisma.$transaction(async (tx) => {
      const creado = await tx.material.create({
        data: {
          nombre: nombre ?? '',
          descripcion,
          miniatura: miniaturaBuffer as any,
          miniaturaNombre,
          cantidad: cantidad ?? 0,
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
          reorderLevel,
          almacen: { connect: { id: almacenId } },
          usuario: { connect: { id: usuario.id } },
        },
        select: { id: true, nombre: true, miniaturaNombre: true },
      })
      await tx.usuarioAlmacen.upsert({
        where: { usuarioId_almacenId: { usuarioId: usuario.id, almacenId } },
        update: {},
        create: { usuarioId: usuario.id, almacenId, rolEnAlmacen: 'creador' },
      })
      await snapshotMaterial(tx, creado.id, usuario.id, 'Creación')
      return creado
    })

    await logAudit(usuario.id, 'creacion_material', 'almacen', { almacenId, materialId: material.id })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'material',
      material.id,
      'creacion',
      parsed.data,
      reportFiles,
    )

    const res = NextResponse.json({ material, auditoria, auditError })
    logger.info(req, `Material ${material.id} creado`)
    return res
  } catch (err) {
    logger.error('POST /api/almacenes/[id]/materiales', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const almacenId = getAlmacenIdFromRequest(req)
    if (!almacenId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    await prisma.historialLote.deleteMany({ where: { material: { almacenId } } })
    await prisma.materialUnidad.deleteMany({ where: { material: { almacenId } } })
    await prisma.archivoMaterial.deleteMany({ where: { material: { almacenId } } })
    await prisma.material.deleteMany({ where: { almacenId } })
    await logAudit(usuario.id, 'eliminacion_materiales', 'almacen', { almacenId })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'almacen',
      almacenId,
      'eliminacion',
      { accion: 'vaciar_materiales' },
    )

    await prisma.alerta.create({
      data: {
        titulo: 'Eliminación masiva de materiales',
        mensaje: 'Se eliminaron todos los materiales del almacén',
        prioridad: 'ALTA',
        tipo: 'eliminacion_masiva',
        almacenId,
      },
    })
    emitEvent({ type: 'alertas_update', payload: { almacenId } })

    return NextResponse.json({ success: true, auditoria, auditError })
  } catch (err) {
    logger.error('DELETE /api/almacenes/[id]/materiales', err)
    return NextResponse.json({ error: 'Error al vaciar' }, { status: 500 })
  }
}

