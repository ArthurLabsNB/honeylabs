import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma'; // Asegúrate que tu tsconfig tiene "@lib/*": ["./lib/*"]

export async function GET() {
  try {
    // Conteo real de movimientos de inventario
    const [entradas, salidas, usuarios, almacenes] = await Promise.all([
      prisma.movimiento.count({ where: { tipo: 'entrada' } }),
      prisma.movimiento.count({ where: { tipo: 'salida'  } }),
      prisma.usuario.count(),
      prisma.almacen.count(),
    ]);

    return NextResponse.json({
      entradas,
      salidas,
      usuarios,
      almacenes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'No se pudieron recuperar las métricas', details: String(error) },
      { status: 500 }
    );
  }
}
