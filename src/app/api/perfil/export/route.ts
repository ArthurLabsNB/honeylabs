export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? 'mi_clave_de_emergencia';
const COOKIE_NAME = 'hl_session';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    let payload: any;
    try { payload = jwt.verify(token, JWT_SECRET); }
    catch { return NextResponse.json({ error: 'Sesión inválida o expirada.' }, { status: 401 }); }
    const usuarioId = payload.id;

    // Selección de secciones por query: perfil, almacenes, bitacora, etc.
    const url = new URL(req.url);
    const secciones = (url.searchParams.get('secciones') || 'perfil').split(',').map(x => x.trim().toLowerCase());

    const resultado: Record<string, any> = {};

    // Perfil básico
    if (secciones.includes('perfil')) {
      const perfil = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: {
          id: true, nombre: true, apellidos: true, correo: true, tipoCuenta: true,
          entidadId: true, estado: true, fechaRegistro: true, fotoPerfilNombre: true,
          preferencias: true
        }
      });
      resultado.perfil = perfil;
    }

    // Almacenes creados por el usuario (no colaborador)
    if (secciones.includes('almacenes')) {
      const almacenes = await prisma.almacen.findMany({
        where: { usuarios: { some: { usuarioId, rolEnAlmacen: 'creador' } } },
        select: {
          id: true, nombre: true, descripcion: true, imagenUrl: true, fechaCreacion: true,
          entidadId: true, codigoUnico: true,
        }
      });
      resultado.almacenesCreados = almacenes;
    }

    // Bitácora de cambios de perfil
    if (secciones.includes('bitacora')) {
      const bitacora = await prisma.bitacoraCambioPerfil.findMany({
        where: { usuarioId },
        select: { fecha: true, cambios: true }
      });
      resultado.bitacora = bitacora;
    }

    // Puedes agregar más secciones aquí

    // Entrega como archivo descargable JSON
    const archivo = Buffer.from(JSON.stringify(resultado, null, 2));
    return new NextResponse(archivo, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="honeylabs_perfil_export.json"`
      }
    });
  } catch (error: any) {
    console.error('[ERROR_EXPORTAR_PERFIL]', error);
    return NextResponse.json({ error: 'No se pudo exportar tu perfil.', detalle: error.message }, { status: 500 });
  }
}
