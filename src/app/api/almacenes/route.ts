
import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import crypto from "node:crypto";
import { getUsuarioFromSession } from "@lib/auth";

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

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { nombre, descripcion } = await req.json();
    if (!nombre) {
      return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });
    }

    if (!usuario.entidadId) {
      return NextResponse.json({ error: 'Usuario sin entidad' }, { status: 400 });
    }

    const codigoUnico = crypto.randomUUID().split('-')[0];

    const almacen = await prisma.almacen.create({
      data: {
        nombre,
        descripcion,
        codigoUnico,
        entidadId: usuario.entidadId,
        usuarios: {
          create: { usuarioId: usuario.id, rolEnAlmacen: 'propietario' },
        },
      },
      select: { id: true, nombre: true, descripcion: true },
    });

    return NextResponse.json({ almacen });
  } catch (err) {
    console.error('POST /api/almacenes', err);
    return NextResponse.json(
      { error: 'Error al crear almacén' },
      { status: 500 },
    );
  }
}
