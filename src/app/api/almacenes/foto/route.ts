import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { createHash } from 'crypto'
import * as logger from '@lib/logger'

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const nombre = url.searchParams.get('nombre')
    const idParam = url.searchParams.get('id')

    let almacen: { imagen: Buffer | Uint8Array | null; imagenNombre: string | null } | null = null

    if (nombre) {
      almacen = await prisma.almacen.findFirst({
        where: { imagenNombre: { equals: nombre, mode: 'insensitive' } },
        select: { imagen: true, imagenNombre: true },
      })
    } else if (idParam) {
      const id = Number(idParam)
      almacen = await prisma.almacen.findUnique({
        where: { id },
        select: { imagen: true, imagenNombre: true },
      })
    } else {
      return NextResponse.json({ error: 'Parámetros requeridos' }, { status: 400 })
    }

    if (!almacen || !almacen.imagen || !almacen.imagenNombre) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
    }

    const ext = almacen.imagenNombre.split('.').pop()?.toLowerCase() ?? ''
    if (!(ext in MIME_BY_EXT)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }

    const buffer = Buffer.isBuffer(almacen.imagen) ? almacen.imagen : Buffer.from(almacen.imagen)
    const hash = createHash('sha1').update(buffer).digest('hex')
    if (req.headers.get('if-none-match') === hash) {
      return new NextResponse(null, { status: 304 })
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': MIME_BY_EXT[ext],
        'Cache-Control': 'public, max-age=0, must-revalidate',
        ETag: hash,
      },
    })
  } catch (err) {
    logger.error('[ALMACEN_FOTO]', err)
    return NextResponse.json({ error: 'No se pudo recuperar la imagen.' }, { status: 500 })
  }
}
