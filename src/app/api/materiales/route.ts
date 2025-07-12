export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'

const MATERIAL_SELECT = {
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
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const take = Number(req.nextUrl.searchParams.get('take') || '20')
    if (Number.isNaN(take)) {
      return NextResponse.json({ error: 'Límite inválido' }, { status: 400 })
    }
    if (take < 1 || take > 1000) // Previene ataques DoS o abusos
      return NextResponse.json({ error: 'Límite fuera de rango' }, { status: 400 })

    const search = req.nextUrl.searchParams.get('q')?.toLowerCase() || ''
    const almacenParam = req.nextUrl.searchParams.get('almacenId')
    const almacenId = almacenParam ? Number(almacenParam) : null
    if (almacenParam && Number.isNaN(almacenId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    let where: any = {}

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (almacenId !== null) {
      const pertenece = await prisma.usuarioAlmacen.findFirst({
        where: { usuarioId: usuario.id, almacenId },
        select: { id: true },
      })
      if (!pertenece && !hasManagePerms(usuario)) {
        return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
      }
      where.almacenId = almacenId
    } else if (!hasManagePerms(usuario)) {
      const almacenes = await prisma.usuarioAlmacen.findMany({
        where: { usuarioId: usuario.id },
        select: { almacenId: true },
      })
      const ids = almacenes.map((a) => a.almacenId)
      if (ids.length === 0) return NextResponse.json({ materiales: [] })
      where.almacenId = { in: ids }
    }

    const materiales = await prisma.material.findMany({
      where,
      take,
      orderBy: { id: 'desc' },
      select: MATERIAL_SELECT,
    })

    return NextResponse.json({ materiales })
  } catch (err) {
    logger.error('GET /api/materiales', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
