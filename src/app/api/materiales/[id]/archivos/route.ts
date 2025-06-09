export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import crypto from 'node:crypto'
import * as logger from '@lib/logger'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const materialId = Number(params.id)
    if (Number.isNaN(materialId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const material = await prisma.material.findUnique({ where: { id: materialId }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const archivos = await prisma.archivoMaterial.findMany({
      where: { materialId },
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        nombre: true,
        archivoNombre: true,
        fecha: true,
        subidoPor: { select: { nombre: true } },
      },
    })
    return NextResponse.json({ archivos })
  } catch (err) {
    logger.error('GET /api/materiales/[id]/archivos', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const materialId = Number(params.id)
    if (Number.isNaN(materialId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const material = await prisma.material.findUnique({ where: { id: materialId }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }
    const form = await req.formData()
    const archivo = form.get('archivo') as File | null
    const nombre = String(form.get('nombre') ?? '').trim()
    if (!archivo || !nombre) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }
    const buffer = Buffer.from(await archivo.arrayBuffer())
    const archivoNombre = `${crypto.randomUUID()}_${archivo.name}`
    const creado = await prisma.archivoMaterial.create({
      data: {
        nombre,
        archivo: buffer as any,
        archivoNombre,
        materialId,
        subidoPorId: usuario.id,
      },
      select: { id: true, nombre: true, archivoNombre: true, fecha: true },
    })
    return NextResponse.json({ archivo: creado })
  } catch (err) {
    logger.error('POST /api/materiales/[id]/archivos', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
