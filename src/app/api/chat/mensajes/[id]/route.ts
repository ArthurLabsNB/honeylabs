export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { getUsuarioFromSession } from "@lib/auth";
import { hasManagePerms } from "@lib/permisos";
import * as logger from "@lib/logger";

function getMensajeId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split("/");
  const idx = parts.findIndex((p) => p === "mensajes");
  const id =
    idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null;
  return id && !Number.isNaN(id) ? id : null;
}

export async function GET(req: NextRequest) {
  try {
    const id = getMensajeId(req);
    if (!id)
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    const mensaje = await prisma.chatMensaje.findUnique({
      where: { id },
      select: {
        id: true,
        texto: true,
        archivo: true,
        anclado: true,
        fecha: true,
        usuario: { select: { id: true, nombre: true } },
      },
    });
    if (!mensaje)
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json({ mensaje });
  } catch (err) {
    logger.error("GET /api/chat/mensajes/[id]", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    const id = getMensajeId(req);
    if (!id)
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    const orig = await prisma.chatMensaje.findUnique({
      where: { id },
      select: { usuarioId: true },
    });
    if (!orig)
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    if (orig.usuarioId !== usuario.id && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }
    const { anclado } = await req.json();
    const mensaje = await prisma.chatMensaje.update({
      where: { id },
      data: { anclado: Boolean(anclado) },
      select: { id: true, anclado: true },
    });
    return NextResponse.json({ mensaje });
  } catch (err) {
    logger.error("PUT /api/chat/mensajes/[id]", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
