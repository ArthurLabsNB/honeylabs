import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma'; // Asegúrate que el alias es correcto
import * as logger from '@lib/logger'

// Función auxiliar para obtener usuario desde JWT (por implementar)
async function getUsuarioFromRequest(req: NextRequest) {
  // Lógica para extraer usuario de cookie JWT (si necesario)
  // Por ahora devuelve null
  return null;
}

export async function GET(req: NextRequest) {
  try {
    // Puedes descomentar para filtrar según usuario o entidad
    // const usuario = await getUsuarioFromRequest(req);

    // Conteos globales o con filtros según entidad/usuario
    const [entradas, salidas, usuarios, almacenes] = await Promise.all([
      prisma.movimiento.count({ where: { tipo: 'entrada' } }),
      prisma.movimiento.count({ where: { tipo: 'salida' } }),
      prisma.usuario.count(),
      prisma.almacen.count(),
    ]);

    return NextResponse.json({
      entradas,
      salidas,
      usuarios,
      almacenes,
      // advertencia: 'Límite alcanzado', // puedes añadir si quieres
    });
  } catch (error) {
    logger.error('[ERROR_METRICAS]', error);
    return NextResponse.json(
      { error: 'No se pudieron recuperar las métricas', details: String(error) },
      { status: 500 }
    );
  }
}
