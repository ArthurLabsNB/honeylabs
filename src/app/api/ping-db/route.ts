// Forzar entorno Node.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET() {
  try {
    // Consulta de prueba para validar conexión
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({ ok: true, mensaje: '✅ Conexión a la base de datos exitosa.' }, { status: 200 });
  } catch (error: any) {
    console.error('[ERROR_PING_DB]', error);
    return NextResponse.json({ ok: false, error: '❌ Error al conectar con la base de datos.', detalle: String(error) }, { status: 500 });
  }
}
