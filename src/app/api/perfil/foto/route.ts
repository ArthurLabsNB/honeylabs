export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import { createHash } from 'crypto'
import * as logger from '@lib/logger'
import { respuestaError } from '@lib/http'

// Mime types permitidos para evitar servir archivos no deseados
const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp'
};

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const nombre = url.searchParams.get('nombre');
    const correo = url.searchParams.get('correo');

    let usuario;

    if (correo) {
      usuario = await prisma.usuario.findFirst({
        where: { correo: { equals: correo, mode: 'insensitive' } },
        select: { fotoPerfil: true, fotoPerfilNombre: true }
      });
    } else if (nombre) {
      usuario = await prisma.usuario.findFirst({
        where: { fotoPerfilNombre: { equals: nombre, mode: 'insensitive' } },
        select: { fotoPerfil: true, fotoPerfilNombre: true }
      });
    } else {
      return respuestaError('Nombre o correo requerido.', '', 400)
    }

    if (!usuario || !usuario.fotoPerfil || !usuario.fotoPerfilNombre) {
      return respuestaError('Imagen no encontrada.', '', 404)
    }

    const ext = usuario.fotoPerfilNombre.split('.').pop()?.toLowerCase() ?? ''
    if (!(ext in MIME_BY_EXT)) {
      return respuestaError('Tipo de archivo no permitido.', ext, 400)
    }
    const buffer = Buffer.isBuffer(usuario.fotoPerfil)
      ? usuario.fotoPerfil
      : Buffer.from(usuario.fotoPerfil);

    const hash = createHash('sha1').update(buffer).digest('hex');
    const etag = `"${hash}"`;
    if (req.headers.get('if-none-match') === etag) {
      return new NextResponse(null, { status: 304 });
    }

    const fileName = nombre ?? usuario.fotoPerfilNombre;
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': MIME_BY_EXT[ext],
        'Content-Disposition': `inline; filename="${encodeURIComponent(fileName)}"`,
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Content-Length': buffer.length.toString(),
        ETag: etag,
      }
    });

  } catch (err: any) {
    logger.error(req, '[ERROR_FOTO_PERFIL]', err)
    return respuestaError('No se pudo recuperar la imagen.', err.message, 500)
  }
}
