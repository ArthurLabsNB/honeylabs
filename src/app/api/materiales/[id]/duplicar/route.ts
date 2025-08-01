export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import { registrarAuditoria } from '@lib/reporter'
import crypto from 'node:crypto'
import * as logger from '@lib/logger'

function getId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex((p) => p === 'materiales')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    const id = getId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const material = await prisma.material.findUnique({
      where: { id },
      include: { archivos: true },
    })
    if (!material) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const miniOriginal = material.miniaturaNombre
      ? material.miniaturaNombre.split('_').slice(1).join('_')
      : null
    const miniaturaNombre = miniOriginal
      ? `${crypto.randomUUID()}_${miniOriginal}`
      : null

    const nuevo = await prisma.$transaction(async (tx) => {
      const creado = await tx.material.create({
        data: {
          nombre: `${material.nombre} copia`,
          descripcion: material.descripcion,
          miniatura: material.miniatura as any,
          miniaturaNombre,
          cantidad: material.cantidad,
          unidad: material.unidad,
          lote: material.lote,
          fechaCaducidad: material.fechaCaducidad,
          ubicacion: material.ubicacion,
          proveedor: material.proveedor,
          estado: material.estado,
          observaciones: material.observaciones,
          codigoBarra: material.codigoBarra,
          codigoQR: material.codigoQR,
          minimo: material.minimo,
          maximo: material.maximo,
          reorderLevel: material.reorderLevel,
          almacenId: material.almacenId,
          usuarioId: usuario.id,
        },
        select: { id: true, nombre: true },
      })

      for (const a of material.archivos) {
        const orig = a.archivoNombre ? a.archivoNombre.split('_').slice(1).join('_') : null
        const archivoNombre = orig ? `${crypto.randomUUID()}_${orig}` : null
        await tx.archivoMaterial.create({
          data: {
            nombre: a.nombre,
            archivo: a.archivo as any,
            archivoNombre,
            materialId: creado.id,
            subidoPorId: usuario.id,
          },
        })
      }
      return creado
    })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'material',
      id,
      'duplicacion',
      nuevo,
    )

    return NextResponse.json({ material: nuevo, auditoria, auditError })
  } catch (err) {
    logger.error('POST /api/materiales/[id]/duplicar', err)
    return NextResponse.json({ error: 'Error al duplicar' }, { status: 500 })
  }
}
