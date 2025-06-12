export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function GET(req: NextRequest) {
  try {
    const canalId = req.nextUrl.searchParams.get('canalId')
    if (!canalId) {
      const canales = await prisma.chatCanal.findMany({
        orderBy: { nombre: 'asc' },
        select: { id: true, nombre: true }
      })
      return NextResponse.json({ canales })
    }

    const mensajes = await prisma.chatMensaje.findMany({
      where: { canalId: Number(canalId) },
      orderBy: { fecha: 'asc' },
      take: 100,
      select: {
        id: true,
        texto: true,
        archivo: true,
        fecha: true,
        usuario: { select: { id: true, nombre: true } }
      }
    })

    return NextResponse.json({ mensajes })
  } catch (err) {
    logger.error('GET /api/chat', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const form = await req.formData()
    const canalIdStr = form.get('canalId') as string | null
    const texto = (form.get('texto') as string | null) || ''
    if (!canalIdStr) return NextResponse.json({ error: 'Falta canalId' }, { status: 400 })

    let archivoBase64: string | null = null
    const archivo = form.get('archivo') as File | null
    if (archivo) {
      const buffer = Buffer.from(await archivo.arrayBuffer())
      archivoBase64 = buffer.toString('base64')
    }

    const mensaje = await prisma.chatMensaje.create({
      data: {
        canalId: Number(canalIdStr),
        usuarioId: usuario.id,
        texto,
        archivo: archivoBase64
      },
      select: {
        id: true,
        texto: true,
        archivo: true,
        fecha: true,
        usuario: { select: { id: true, nombre: true } }
      }
    })

    return NextResponse.json({ mensaje })
  } catch (err) {
    logger.error('POST /api/chat', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
