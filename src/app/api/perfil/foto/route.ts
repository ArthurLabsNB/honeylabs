// src/app/api/perfil/foto/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const nombre = url.searchParams.get('nombre');
    if (!nombre) {
      return NextResponse.json({ error: 'Nombre de archivo requerido.' }, { status: 400 });
    }

    const usuario = await prisma.usuario.findFirst({
      where: { fotoPerfilNombre: nombre },
      select: { fotoPerfil: true, fotoPerfilNombre: true }
    });

    if (!usuario || !usuario.fotoPerfil) {
      return NextResponse.json({ error: 'Imagen no encontrada.' }, { status: 404 });
    }

    // Determina el tipo de archivo
    const ext = nombre.split('.').pop()?.toLowerCase();
    let type = 'application/octet-stream';
    if (ext === 'png') type = 'image/png';
    else if (ext === 'jpg' || ext === 'jpeg') type = 'image/jpeg';
    else if (ext === 'gif') type = 'image/gif';
    else if (ext === 'webp') type = 'image/webp';

    return new NextResponse(usuario.fotoPerfil as Buffer, {
      status: 200,
      headers: {
        'Content-Type': type,
        'Content-Disposition': `inline; filename="${nombre}"`,
        'Cache-Control': 'public, max-age=604800', // 1 semana
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'No se pudo recuperar la imagen.' }, { status: 500 });
  }
}
