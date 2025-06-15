export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const parts = req.nextUrl.pathname.split('/')
    const id = Number(parts.pop())
    const tipo = parts.pop()
    if (!id || Number.isNaN(id) || !tipo) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    let entry: any = null
    if (tipo === 'material') {
      entry = await prisma.historialLote.findUnique({
        where: { id },
        select: { id: true, descripcion: true, fecha: true, estado: true, usuario: { select: { nombre: true } } },
      })
    } else if (tipo === 'unidad') {
      entry = await prisma.historialUnidad.findUnique({
        where: { id },
        select: { id: true, descripcion: true, fecha: true, estado: true, usuario: { select: { nombre: true } } },
      })
    } else if (tipo === 'almacen') {
      entry = await prisma.historialAlmacen.findUnique({
        where: { id },
        select: { id: true, descripcion: true, fecha: true, estado: true, usuario: { select: { nombre: true } } },
      })
    } else {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }
    if (!entry) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ entry })
  } catch (err) {
    logger.error('GET /api/historial/[tipo]/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
