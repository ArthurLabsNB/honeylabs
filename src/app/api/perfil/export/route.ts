export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Instancia Prisma singleton-safe para dev y prod
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const JWT_SECRET = process.env.JWT_SECRET ?? 'mi_clave_de_emergencia';
const COOKIE_NAME = 'hl_session';

// Set de secciones permitidas para exportar
const SECCIONES_VALIDAS = new Set([
  'perfil',
  'almacenes',
  'bitacora',
  // agregar más secciones si se implementan
]);

export async function GET(req: NextRequest) {
  try {
    // ======= 1. Autenticación =======
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Sesión inválida o expirada.' }, { status: 401 });
    }

    const usuarioId = payload?.id;
    if (!usuarioId) {
      return NextResponse.json({ error: 'Token inválido, falta ID de usuario.' }, { status: 401 });
    }

    // ======= 2. Parámetro de secciones =======
    let url: URL;
    try {
      url = new URL(req.url);
    } catch {
      url = new URL(req.url, 'http://localhost');
    }

    // Obtiene y valida secciones de query params
    let seccionesRaw = (url.searchParams.get('secciones') || 'perfil')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    // Filtra solo secciones permitidas
    const secciones = seccionesRaw.filter(s => SECCIONES_VALIDAS.has(s));
    if (secciones.length === 0) secciones.push('perfil');

    const resultado: Record<string, any> = {};

    // ======= 3. Perfil básico =======
    if (secciones.includes('perfil')) {
      const perfil = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: {
          id: true,
          nombre: true,
          apellidos: true,
          correo: true,
          tipoCuenta: true,
          entidadId: true,
          estado: true,
          fechaRegistro: true,
          fotoPerfilNombre: true,
          preferencias: true,
        }
      });
      if (!perfil) throw new Error('Perfil no encontrado');
      resultado.perfil = perfil;
    }

    // ======= 4. Almacenes creados por el usuario (no colaborador) =======
    if (secciones.includes('almacenes')) {
      const almacenes = await prisma.almacen.findMany({
        where: { usuarios: { some: { usuarioId, rolEnAlmacen: 'creador' } } },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          imagenUrl: true,
          fechaCreacion: true,
          entidadId: true,
          codigoUnico: true,
        }
      });
      resultado.almacenesCreados = almacenes ?? [];
    }

    // ======= 5. Bitácora de cambios de perfil =======
    if (secciones.includes('bitacora')) {
      const bitacora = await prisma.bitacoraCambioPerfil.findMany({
        where: { usuarioId },
        select: {
          fecha: true,
          cambios: true,
        },
        orderBy: {
          fecha: 'desc',
        }
      });
      resultado.bitacora = bitacora ?? [];
    }

    // ======= 6. Devuelve archivo JSON descargable =======
    const archivoBuffer = Buffer.from(JSON.stringify(resultado, null, 2));
    return new NextResponse(archivoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="honeylabs_perfil_export.json"',
        'Cache-Control': 'no-store',
      }
    });

  } catch (error: any) {
    console.error('[ERROR_EXPORTAR_PERFIL]', error);
    return NextResponse.json({
      error: 'No se pudo exportar tu perfil.',
      detalle: error.message ?? String(error),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}
