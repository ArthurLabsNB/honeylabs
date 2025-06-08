import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { getUsuarioFromSession } from "@lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const almacen = await prisma.almacen.findUnique({
      where: { id },
      select: { id: true, nombre: true, descripcion: true, imagenUrl: true },
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const id = Number(params.id);
    await prisma.almacen.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/almacenes/[id]', err);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const id = Number(params.id);
    const { nombre, descripcion, imagenUrl } = await req.json();
    const almacen = await prisma.almacen.update({
      where: { id },
      data: { nombre, descripcion, imagenUrl },
      select: { id: true, nombre: true, descripcion: true, imagenUrl: true },
    });
    return NextResponse.json({ almacen });
  } catch (err) {
    console.error('PUT /api/almacenes/[id]', err);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}
