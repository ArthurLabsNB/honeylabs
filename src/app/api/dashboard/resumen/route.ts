export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import * as logger from '@lib/logger';

export async function GET() {
  try {
    const [almacenes, materiales, unidades, movimientos] = await Promise.all([
      prisma.almacen.count(),
      prisma.material.count(),
      prisma.materialUnidad.count(),
      prisma.movimiento.count(),
    ]);
    return NextResponse.json({ almacenes, materiales, unidades, movimientos });
  } catch (err) {
    logger.error('GET /api/dashboard/resumen', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
