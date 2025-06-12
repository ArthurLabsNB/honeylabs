export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { getUsuarioFromSession } from "@lib/auth";
import * as logger from "@lib/logger";
import { broadcastChatMessage } from "@lib/chatIntegration";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const canalId = req.nextUrl.searchParams.get("canalId");
    if (!canalId) {
      const canales = await prisma.chatCanal.findMany({
        orderBy: { nombre: "asc" },
        select: { id: true, nombre: true },
      });
      return NextResponse.json({ canales });
    }

    const q = req.nextUrl.searchParams.get("q") || undefined;
    const usuarioId = req.nextUrl.searchParams.get("usuarioId") || undefined;
    const desde = req.nextUrl.searchParams.get("desde") || undefined;
    const hasta = req.nextUrl.searchParams.get("hasta") || undefined;
    const tipo = req.nextUrl.searchParams.get("tipo") || undefined;

    const where: Prisma.ChatMensajeWhereInput = {
      canalId: Number(canalId),
    };

    if (q) {
      where.OR = [
        { texto: { contains: q, mode: "insensitive" } },
        { archivo: { contains: q, mode: "insensitive" } },
      ];
    }
    if (usuarioId) where.usuarioId = Number(usuarioId);
    if (desde || hasta) where.fecha = {};
    if (desde) (where.fecha as any).gte = new Date(desde);
    if (hasta) (where.fecha as any).lte = new Date(hasta);
    if (tipo === "texto") where.archivo = null;
    if (tipo === "archivo") where.archivo = { not: null };

    const mensajes = await prisma.chatMensaje.findMany({
      where,
      orderBy: { fecha: "asc" },
      take: 100,
      select: {
        id: true,
        texto: true,
        archivoNombre: true,
        archivoTipo: true,
        anclado: true,
        fecha: true,
        usuario: { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json({ mensajes });
  } catch (err) {
    logger.error("GET /api/chat", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const form = await req.formData();
    const canalIdStr = form.get("canalId") as string | null;
    const texto = (form.get("texto") as string | null) || "";
    if (!canalIdStr)
      return NextResponse.json({ error: "Falta canalId" }, { status: 400 });

    let archivoBase64: string | null = null;
    let archivoNombre: string | null = null;
    let archivoTipo: string | null = null;
    const archivo = form.get("archivo") as File | null;
    if (archivo) {
      const buffer = Buffer.from(await archivo.arrayBuffer());
      archivoBase64 = buffer.toString("base64");
      archivoNombre = archivo.name;
      archivoTipo = archivo.type;
    }

    const mensaje = await prisma.chatMensaje.create({
      data: {
        canalId: Number(canalIdStr),
        usuarioId: usuario.id,
        texto,
        archivo: archivoBase64,
        archivoNombre,
        archivoTipo,
      },
      select: {
        id: true,
        texto: true,
        archivo: true,
        archivoNombre: true,
        archivoTipo: true,
        fecha: true,
        usuario: { select: { id: true, nombre: true } },
      },
    });

    broadcastChatMessage(`${usuario.nombre}: ${texto || "(archivo)"}`);

    return NextResponse.json({ mensaje });
  } catch (err) {
    logger.error("POST /api/chat", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
