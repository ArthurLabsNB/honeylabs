import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

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
    const url = new URL(req.url);
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
      return NextResponse.json(
        { error: 'Nombre o correo requerido.' },
        { status: 400 }
      );
    }

    if (!usuario || !usuario.fotoPerfil || !usuario.fotoPerfilNombre) {
      return NextResponse.json({ error: 'Imagen no encontrada.' }, { status: 404 });
    }

    const ext = usuario.fotoPerfilNombre.split('.').pop()?.toLowerCase() ?? '';
    if (!(ext in MIME_BY_EXT)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido.' }, { status: 400 });
    }
    const buffer = Buffer.isBuffer(usuario.fotoPerfil)
      ? usuario.fotoPerfil
      : Buffer.from(usuario.fotoPerfil);

    // Responder con el contenido binario de la imagen
    const fileName = nombre ?? usuario.fotoPerfilNombre;
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': MIME_BY_EXT[ext],
        'Content-Disposition': `inline; filename="${encodeURIComponent(fileName)}"`,
        'Cache-Control': 'public, max-age=604800', // Cache 1 semana
        'Content-Length': buffer.length.toString()
      }
    });

  } catch (err: any) {
    console.error('[ERROR_FOTO_PERFIL]', err);
    return NextResponse.json({ error: 'No se pudo recuperar la imagen.' }, { status: 500 });
  }
}
