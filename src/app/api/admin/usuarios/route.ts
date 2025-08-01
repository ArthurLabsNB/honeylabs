export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@lib/db/prisma';
import * as logger from '@lib/logger'

export async function GET(req: NextRequest) {
  try {
    const take = Number(req.nextUrl.searchParams.get("take") || 20);
    if (Number.isNaN(take)) {
      return NextResponse.json({ error: 'Límite inválido' }, { status: 400 });
    }
    if (take < 1 || take > 1000) // Previene ataques DoS o abusos
      return NextResponse.json({ error: 'Límite fuera de rango' }, { status: 400 });

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
    logger.error("[ADMIN_USUARIOS]", err);
    return NextResponse.json({ error: "Error listando usuarios" }, { status: 500 });
  }
}
