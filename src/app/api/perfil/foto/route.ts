import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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

    // Búsqueda exacta, case-insensitive
    const usuario = await prisma.usuario.findFirst({
      where: { fotoPerfilNombre: { equals: nombre, mode: 'insensitive' } },
      select: { fotoPerfil: true, fotoPerfilNombre: true }
    });

    if (!usuario || !usuario.fotoPerfil) {
      return NextResponse.json({ error: 'Imagen no encontrada.' }, { status: 404 });
    }

    // Seguridad extra: Solo permitir imágenes conocidas
    const ext = nombre.split('.').pop()?.toLowerCase() ?? '';
    const mime = MIME_BY_EXT[ext] || 'application/octet-stream';

    // Prisma puede devolver Uint8Array, convierte seguro a Buffer
    const buffer = Buffer.isBuffer(usuario.fotoPerfil)
      ? usuario.fotoPerfil
      : Buffer.from(usuario.fotoPerfil);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Disposition': `inline; filename="${encodeURIComponent(nombre)}"`,
        'Cache-Control': 'public, max-age=604800', // 1 semana
        'Content-Length': buffer.length.toString()
      }
    });
  } catch (err: any) {
    console.error('[ERROR_FOTO_PERFIL]', err);
    return NextResponse.json({ error: 'No se pudo recuperar la imagen.' }, { status: 500 });
  }
}
