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

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getMaterialId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const material = await prisma.material.findUnique({ where: { id }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const { tipo, cantidad, descripcion, contexto } = await req.json()
    if (tipo !== 'entrada' && tipo !== 'salida') {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }
    const n = Number(cantidad)
    if (!n || n <= 0) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 })
    }
    await prisma.movimientoMaterial.create({
      data: {
        tipo,
        cantidad: n,
        descripcion: descripcion || undefined,
        contexto: contexto ?? undefined,
        materialId: id,
        usuarioId: usuario.id,
      },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('POST /api/materiales/[id]/movimientos', err)
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getMaterialId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const material = await prisma.material.findUnique({ where: { id }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const movimientos = await prisma.movimientoMaterial.findMany({
      where: { materialId: id },
      orderBy: { fecha: 'desc' },
      take: 20,
      select: {
        id: true,
        tipo: true,
        cantidad: true,
        fecha: true,
        descripcion: true,
        usuario: { select: { nombre: true } },
        material: { select: { nombre: true } },
      },
    })
    return NextResponse.json({ movimientos })
  } catch (err) {
    logger.error('GET /api/materiales/[id]/movimientos', err)
    return NextResponse.json({ error: 'Error al obtener movimientos' }, { status: 500 })
  }
}
