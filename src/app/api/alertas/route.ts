import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma"; // Ajusta el import si tu alias es diferente

export async function GET(req: NextRequest) {
  try {
    const usuarioId = req.nextUrl.searchParams.get("usuarioId");
    if (!usuarioId) {
      return NextResponse.json({ error: "Falta usuarioId" }, { status: 400 });
    }

    // Busca almacenes a los que pertenece el usuario
    const almacenes = await prisma.usuarioAlmacen.findMany({
      where: { usuarioId: Number(usuarioId) },
      select: { almacenId: true },
    });
    const almacenIds = almacenes.map((a) => a.almacenId);
    if (almacenIds.length === 0) {
      return NextResponse.json({ alertas: [] });
    }

    // Busca alertas activas de esos almacenes
    const alertas = await prisma.alerta.findMany({
      where: {
        almacenId: { in: almacenIds },
        activa: true,
      },
      orderBy: [{ prioridad: "desc" }, { fecha: "desc" }],
      take: 20,
      include: {
        almacen: { select: { nombre: true } },
      },
    });

    return NextResponse.json({ alertas });
  } catch (err) {
    console.error("Error en /api/alertas:", err);
    return NextResponse.json({ error: "Error consultando alertas" }, { status: 500 });
  }
}
