export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import crypto from "crypto";
export async function POST(req: NextRequest) {
  try {
    const { almacenId, rolAsignado, permisos, usosDisponibles, fechaExpiracion } = await req.json();
    if (!almacenId || !rolAsignado) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    const codigo = crypto.randomBytes(5).toString("hex");
    const nuevo = await prisma.codigoAlmacen.create({
      data: {
        almacenId: Number(almacenId),
        codigo,
        rolAsignado,
        permisos: permisos ?? null,
        usosDisponibles: usosDisponibles ? Number(usosDisponibles) : null,
        fechaExpiracion: fechaExpiracion ? new Date(fechaExpiracion) : null,
      },
    });
    return NextResponse.json({ codigo: nuevo.codigo }, { status: 201 });
  } catch (err: any) {
    console.error("[CODIGO_GENERAR]", err);
    return NextResponse.json({ error: "Error generando código" }, { status: 500 });
  }
}
