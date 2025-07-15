export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import type { Prisma } from '@prisma/client'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import { materialSchema } from '@/lib/validators/material'
import crypto from 'node:crypto'
import * as logger from '@lib/logger'
import { logAudit } from '@/lib/audit'
import { registrarAuditoria } from '@lib/reporter'

async function snapshot(
  db: Prisma.TransactionClient | typeof prisma,
  materialId: number,
  usuarioId: number,
  descripcion: string,
) {
  const material = await db.material.findUnique({
    where: { id: materialId },
    include: {
      archivos: { select: { nombre: true, archivoNombre: true, archivo: true } },
    },
  })
  const estado = material
    ? {
        ...material,
        miniatura: material.miniatura
          ? Buffer.from(material.miniatura as Buffer).toString('base64')
          : null,
        archivos: material.archivos.map((a) => ({
          nombre: a.nombre,
          archivoNombre: a.archivoNombre,
          archivo: a.archivo
            ? Buffer.from(a.archivo as Buffer).toString('base64')
            : null,
        })),
      }
    : null
  await db.historialLote.create({
    data: {
      materialId,
      usuarioId,
      descripcion,
      lote: material?.lote ?? null,
      ubicacion: material?.ubicacion ?? null,
      cantidad: material?.cantidad ?? null,
      estado,
    },
  })
}

function getMaterialId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/');
  const idx = parts.findIndex((p) => p === 'materiales');
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null;
  return id && !Number.isNaN(id) ? id : null;
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getMaterialId(req)
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const material = await prisma.material.findUnique({
      where: { id },
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
        almacenId: true,
        usuario: { select: { nombre: true, correo: true } },
      },
    })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

    return NextResponse.json({ material })
  } catch (err) {
    logger.error('GET /api/materiales/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getMaterialId(req)
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const material = await prisma.material.findUnique({ where: { id }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    let datos: any = {}
    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await req.formData()
      datos = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        unidad: formData.get('unidad'),
        cantidad: formData.get('cantidad'),
        lote: formData.get('lote'),
        fechaCaducidad: formData.get('fechaCaducidad'),
        ubicacion: formData.get('ubicacion'),
        proveedor: formData.get('proveedor'),
        estado: formData.get('estado'),
        observaciones: formData.get('observaciones'),
        codigoBarra: formData.get('codigoBarra'),
        codigoQR: formData.get('codigoQR'),
        minimo: formData.get('minimo'),
        maximo: formData.get('maximo'),
        reorderLevel: formData.get('reorderLevel'),
        miniaturaNombre: undefined,
      }
      const archivo = formData.get('miniatura') as File | null
      if (archivo) {
        const buffer = Buffer.from(await archivo.arrayBuffer())
        datos.miniatura = buffer as any
        datos.miniaturaNombre = `${crypto.randomUUID()}_${archivo.name}`
      }
    } else {
      datos = await req.json()
    }

    const parsed = materialSchema.partial().safeParse(datos)
    if (!parsed.success)
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    datos = parsed.data

    const actualizado = await prisma.$transaction(async (tx) => {
      const upd = await tx.material.update({
        where: { id },
        data: datos,
        select: { id: true },
      })
      await snapshot(tx, id, usuario.id, 'Modificación')
      return upd
    })

    await logAudit(usuario.id, 'modificacion_material', 'material', { materialId: id })
    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'material',
      id,
      'modificacion',
      datos,
    )
    return NextResponse.json({ material: actualizado, auditoria, auditError })
  } catch (err) {
    logger.error('PUT /api/materiales/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getMaterialId(req)
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const material = await prisma.material.findUnique({ where: { id }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    await prisma.$transaction(async (tx) => {
      await snapshot(tx, id, usuario.id, 'Eliminación')
      await tx.materialUnidad.deleteMany({ where: { materialId: id } })
      await tx.archivoMaterial.deleteMany({ where: { materialId: id } })
      await tx.material.delete({ where: { id } })
    })
    await logAudit(usuario.id, 'eliminacion_material', 'material', { materialId: id })
    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'material',
      id,
      'eliminacion',
      {},
    )
    return NextResponse.json({ success: true, auditoria, auditError })
  } catch (err) {
    logger.error('DELETE /api/materiales/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
