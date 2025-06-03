import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Prisma singleton-safe
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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
    if (!nombre) {
      return NextResponse.json({ error: 'Nombre de archivo requerido.' }, { status: 400 });
    }

    // Validar extensión
    const ext = nombre.split('.').pop()?.toLowerCase() ?? '';
    if (!(ext in MIME_BY_EXT)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido.' }, { status: 400 });
    }

    // Buscar usuario con esa imagen (case-insensitive)
    const usuario = await prisma.usuario.findFirst({
      where: { fotoPerfilNombre: { equals: nombre, mode: 'insensitive' } },
      select: { fotoPerfil: true, fotoPerfilNombre: true }
    });

    if (!usuario || !usuario.fotoPerfil) {
      return NextResponse.json({ error: 'Imagen no encontrada.' }, { status: 404 });
    }

    // Convertir a Buffer si no es ya
    const buffer = Buffer.isBuffer(usuario.fotoPerfil)
      ? usuario.fotoPerfil
      : Buffer.from(usuario.fotoPerfil);

    // Responder con el contenido binario de la imagen
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': MIME_BY_EXT[ext],
        'Content-Disposition': `inline; filename="${encodeURIComponent(nombre)}"`,
        'Cache-Control': 'public, max-age=604800', // Cache 1 semana
        'Content-Length': buffer.length.toString()
      }
    });

  } catch (err: any) {
    console.error('[ERROR_FOTO_PERFIL]', err);
    return NextResponse.json({ error: 'No se pudo recuperar la imagen.' }, { status: 500 });
  }
}
