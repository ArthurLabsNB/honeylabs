export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@lib/db/prisma';
import * as logger from '@lib/logger'

export async function POST(req: NextRequest) {
  try {
    const { codigo } = await req.json();
    if (!codigo) {
      return NextResponse.json({ error: "Código requerido" }, { status: 400 });
    }
    const existente = await prisma.codigoAlmacen.findUnique({ where: { codigo } });
    if (!existente || !existente.activo) {
      return NextResponse.json({ error: "Código inválido" }, { status: 404 });
    }
    if (existente.fechaExpiracion && existente.fechaExpiracion < new Date()) {
      return NextResponse.json({ error: "Código expirado" }, { status: 410 });
    }
    if (existente.usosDisponibles !== null && existente.usosDisponibles <= 0) {
      return NextResponse.json({ error: "Código sin usos" }, { status: 410 });
    }
    return NextResponse.json({
      almacenId: existente.almacenId,
      rolAsignado: existente.rolAsignado,
      permisos: existente.permisos ?? null,
    });
  } catch (err: any) {
    logger.error("[CODIGO_VALIDAR]", err);
    return NextResponse.json({ error: "Error validando código" }, { status: 500 });
  }
}
