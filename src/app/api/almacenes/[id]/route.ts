import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const almacen = await prisma.almacen.findUnique({
      where: { id },
      select: { id: true, nombre: true, descripcion: true },
    });
    if (!almacen) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json({ almacen });
  } catch (err) {
    console.error("Error en /api/almacenes/[id]", err);
    return NextResponse.json({ error: "Error al obtener almacén" }, { status: 500 });
  }
}
