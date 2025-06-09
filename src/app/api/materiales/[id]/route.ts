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
    const id = Number(params.id)
    if (Number.isNaN(id)) {
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = Number(params.id)
    if (Number.isNaN(id)) {
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
      if (formData.has('nombre')) datos.nombre = String(formData.get('nombre'))
      if (formData.has('descripcion')) datos.descripcion = String(formData.get('descripcion'))
      if (formData.has('unidad')) datos.unidad = String(formData.get('unidad'))
      if (formData.has('cantidad')) datos.cantidad = Number(formData.get('cantidad'))
      if (formData.has('lote')) datos.lote = String(formData.get('lote'))
      if (formData.has('fechaCaducidad')) datos.fechaCaducidad = new Date(String(formData.get('fechaCaducidad')))
      if (formData.has('ubicacion')) datos.ubicacion = String(formData.get('ubicacion'))
      if (formData.has('proveedor')) datos.proveedor = String(formData.get('proveedor'))
      if (formData.has('estado')) datos.estado = String(formData.get('estado'))
      if (formData.has('observaciones')) datos.observaciones = String(formData.get('observaciones'))
      if (formData.has('codigoBarra')) datos.codigoBarra = String(formData.get('codigoBarra'))
      if (formData.has('codigoQR')) datos.codigoQR = String(formData.get('codigoQR'))
      if (formData.has('minimo')) datos.minimo = Number(formData.get('minimo'))
      if (formData.has('maximo')) datos.maximo = Number(formData.get('maximo'))
      const archivo = formData.get('miniatura') as File | null
      if (archivo) {
        const buffer = Buffer.from(await archivo.arrayBuffer())
        datos.miniatura = buffer as any
        datos.miniaturaNombre = `${crypto.randomUUID()}_${archivo.name}`
      }
    } else {
      datos = await req.json()
    }

    const actualizado = await prisma.material.update({
      where: { id },
      data: datos,
      select: { id: true },
    })
    return NextResponse.json({ material: actualizado })
  } catch (err) {
    logger.error('PUT /api/materiales/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = Number(params.id)
    if (Number.isNaN(id)) {
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
    await prisma.archivoMaterial.deleteMany({ where: { materialId: id } })
    await prisma.material.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('DELETE /api/materiales/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
