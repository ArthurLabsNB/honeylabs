
import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import crypto from "node:crypto";
import { getUsuarioFromSession } from "@lib/auth";

export async function GET(req: NextRequest) {
  try {
    const usuarioId = req.nextUrl.searchParams.get("usuarioId");
    const where = usuarioId
      ? { usuarios: { some: { usuarioId: Number(usuarioId) } } }
      : {};

    const data = await prisma.almacen.findMany({
      take: 20,
      where,
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        imagenUrl: true,
        usuarios: {
          take: 1,
          select: { usuario: { select: { nombre: true } } },
        },
        movimientos: {
          orderBy: { fecha: "desc" },
          take: 1,
          select: { fecha: true },
        },
        notificaciones: {
          where: { leida: false },
          take: 1,
          select: { id: true },
        },
      },
    });

    const ids = data.map((a) => a.id);
    const movs = await prisma.movimiento.groupBy({
      by: ["almacenId", "tipo"],
      _sum: { cantidad: true },
      where: { almacenId: { in: ids } },
    });

    const counts: Record<number, { entradas: number; salidas: number }> = {};
    ids.forEach((id) => (counts[id] = { entradas: 0, salidas: 0 }));
    for (const m of movs) {
      if (m.tipo === "entrada") counts[m.almacenId].entradas = m._sum.cantidad ?? 0;
      if (m.tipo === "salida") counts[m.almacenId].salidas = m._sum.cantidad ?? 0;
    }

    const almacenes = data.map((a) => ({
      id: a.id,
      nombre: a.nombre,
      descripcion: a.descripcion,
      imagenUrl: a.imagenUrl,
      encargado: a.usuarios[0]?.usuario.nombre ?? null,
      ultimaActualizacion: a.movimientos[0]?.fecha ?? null,
      notificaciones: a.notificaciones.length > 0,
      entradas: counts[a.id].entradas,
      salidas: counts[a.id].salidas,
      inventario: counts[a.id].entradas - counts[a.id].salidas,
    }));

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
