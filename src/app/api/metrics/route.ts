import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma'; // Asegúrate que tu tsconfig tiene "@lib/*": ["./lib/*"]

// Obtiene usuario desde JWT si lo necesitas en el futuro
async function getUsuarioFromRequest(req: NextRequest) {
  // Aquí iría lógica para extraer el usuario desde la cookie/JWT si tu endpoint lo requiere
  // Por ahora, retorna null para métricas globales
  return null;
}

export async function GET(req: NextRequest) {
  try {
    // Si quieres que las métricas dependan del usuario, puedes descomentar esto:
    // const usuario = await getUsuarioFromRequest(req);

    // Ejemplo de métricas globales (admin) o filtradas por entidad/usuario
    // Si quieres filtrar por entidad, añade el filtro a los count()

    const [entradas, salidas, usuarios, almacenes] = await Promise.all([
      prisma.movimiento.count({ where: { tipo: 'entrada' } }),
      prisma.movimiento.count({ where: { tipo: 'salida'  } }),
      prisma.usuario.count(),
      prisma.almacen.count(),
    ]);

    // Aquí puedes luego agregar límites permitidos por plan y devolver advertencias
    // Ejemplo:
    // const limiteAlmacenes = usuario?.plan?.limites?.almacenes ?? 2;
    // const advertencia = almacenes >= limiteAlmacenes ? 'Has alcanzado el límite de almacenes' : null;

    return NextResponse.json({
      entradas,
      salidas,
      usuarios,
      almacenes,
      // advertencia
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'No se pudieron recuperar las métricas', details: String(error) },
      { status: 500 }
    );
  }
}
