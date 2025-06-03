
import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const usuarioId = req.nextUrl.searchParams.get("usuarioId");
    const almacenes = await prisma.almacen.findMany({
      take: 20,
      where: usuarioId ? { usuarios: { some: { usuarioId: Number(usuarioId) } } } : {},
      select: { id: true, nombre: true, descripcion: true },
    });
    return NextResponse.json({ almacenes });
  } catch (err) {
    console.error("Error en /api/almacenes:", err);
    return NextResponse.json(
      { error: "Error al obtener almacenes" },
      { status: 500 },
    );
  }
}
