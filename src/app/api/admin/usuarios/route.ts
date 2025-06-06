export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const take = Number(req.nextUrl.searchParams.get("take") || 20);
    const search = req.nextUrl.searchParams.get("q")?.toLowerCase() || "";
    const usuarios = await prisma.usuario.findMany({
      where: search
        ? {
            OR: [
              { nombre: { contains: search, mode: "insensitive" } },
              { correo: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      take,
      orderBy: { id: "desc" },
      select: {
        id: true,
        nombre: true,
        correo: true,
        tipoCuenta: true,
        estado: true,
      },
    });
    return NextResponse.json({ usuarios });
  } catch (err: any) {
    console.error("[ADMIN_USUARIOS]", err);
    return NextResponse.json({ error: "Error listando usuarios" }, { status: 500 });
  }
}
