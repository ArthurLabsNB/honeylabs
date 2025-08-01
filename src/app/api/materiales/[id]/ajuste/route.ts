export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'
import { registrarAuditoria } from '@lib/reporter'

function getMaterialId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'materiales')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function PATCH(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getMaterialId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const body = await req.json()
    const cantidad = Number(body.cantidad)
    if (Number.isNaN(cantidad)) return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 })
    const material = await prisma.material.findUnique({ where: { id }, select: { almacenId: true, nombre: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({ where: { usuarioId: usuario.id, almacenId: material.almacenId }, select: { id: true } })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    await prisma.material.update({ where: { id }, data: { cantidad } })
    await prisma.movimientoMaterial.create({
      data: {
        tipo: 'ajuste',
        cantidad,
        descripcion: 'Ajuste post escaneo',
        materialId: id,
        usuarioId: usuario.id
      }
    })
    await prisma.reporte.create({
      data: {
        tipo: 'material',
        categoria: 'ajuste',
        materialId: id,
        observaciones: `Ajuste a ${cantidad}`,
        usuarioId: usuario.id
      }
    })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'material',
      id,
      'ajuste',
      { cantidad },
    )
    if (cantidad <= 0) {
      await prisma.alerta.create({
        data: {
          titulo: 'Rotura de stock',
          mensaje: `${material.nombre} sin existencias`,
          prioridad: 'ALTA',
          tipo: 'rotura_stock',
          almacenId: material.almacenId
        }
      })
    }
    return NextResponse.json({ success: true, auditoria, auditError })
  } catch (err) {
    logger.error('PATCH /api/materiales/[id]/ajuste', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
