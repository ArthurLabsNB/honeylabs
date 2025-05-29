import { NextResponse } from 'next/server';
import { prisma } from '/lib/prisma'; // Ajusta si tu path es diferente

export async function GET() {
  try {
    // Entradas/Salidas: Puedes cambiarlos si tienes tabla "Movimiento" real,
    // pero de momento contamos todas las conexiones usuario-almacén como movimiento ejemplo.
    // Si tienes tabla de movimientos, reemplaza abajo por el count real de entradas/salidas.
    // Si en el futuro agregas tabla Movimiento, haz:
    // const entradas = await prisma.movimiento.count({ where: { tipo: 'entrada' } });
    // const salidas  = await prisma.movimiento.count({ where: { tipo: 'salida'  } });

    // Temporalmente, simulamos usando conexiones a almacén:
    const usuarios = await prisma.usuario.count();
    const almacenes = await prisma.almacen.count();

    // Entradas/Salidas (cambia esto si agregas tabla de movimientos)
    // Ejemplo simulado:
    const entradas = 23872;
    const salidas = 23041;

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
