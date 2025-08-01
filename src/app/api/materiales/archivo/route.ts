import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
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
    if (!nombre) return NextResponse.json({ error: 'Parámetro faltante' }, { status: 400 })
    const material = await prisma.material.findFirst({
      where: { miniaturaNombre: { equals: nombre, mode: 'insensitive' } },
      select: { miniatura: true, miniaturaNombre: true },
    })
    if (!material || !material.miniatura || !material.miniaturaNombre) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    const ext = material.miniaturaNombre.split('.').pop()?.toLowerCase() ?? ''
    if (!(ext in MIME_BY_EXT)) {
      return NextResponse.json({ error: 'Tipo no permitido' }, { status: 400 })
    }
    const buffer = Buffer.isBuffer(material.miniatura) ? material.miniatura : Buffer.from(material.miniatura)
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
    logger.error('[MATERIAL_ARCHIVO]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
