export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import { emitEvent } from '@/lib/events'
import * as logger from '@lib/logger'

function getAlmacenId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex((p) => p === 'almacenes')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  logger.debug(req, 'GET /api/almacenes/[id]/usuarios')
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const almacenId = getAlmacenId(req)
    if (!almacenId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const registros = await prisma.usuarioAlmacen.findMany({
      where: { almacenId },
      select: {
        rolEnAlmacen: true,
        usuario: { select: { correo: true, nombre: true } },
      },
    })
    const usuarios = registros.map((r) => ({
      correo: r.usuario.correo,
      nombre: r.usuario.nombre,
      rol: r.rolEnAlmacen,
    }))
    return NextResponse.json({ usuarios })
  } catch (err) {
    logger.error('GET /api/almacenes/[id]/usuarios', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  logger.debug(req, 'DELETE /api/almacenes/[id]/usuarios')
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const almacenId = getAlmacenId(req)
    if (!almacenId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const correo = req.nextUrl.searchParams.get('correo') || ''
    if (!correo) return NextResponse.json({ error: 'Correo requerido' }, { status: 400 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const u = await prisma.usuario.findUnique({ where: { correo } })
    if (!u) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    await prisma.usuarioAlmacen.delete({
      where: { usuarioId_almacenId: { usuarioId: u.id, almacenId } },
    })
    emitEvent({ type: 'usuarios_update', payload: { almacenId } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('DELETE /api/almacenes/[id]/usuarios', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
