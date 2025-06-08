export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { getUsuarioFromSession } from '@lib/auth';
import { hasManagePerms } from '@lib/permisos';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const id = Number(params.id);
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: id },
      select: { id: true },
    });
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
    const { tipo, cantidad, descripcion } = await req.json();
    if (tipo !== 'entrada' && tipo !== 'salida') {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }
    const n = Number(cantidad);
    if (!n || n <= 0) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
    }

    await prisma.movimiento.create({
      data: {
        tipo,
        cantidad: n,
        descripcion: descripcion || undefined,
        almacenId: id,
        usuarioId: usuario.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/almacenes/[id]/movimientos', err);
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 });
  }
}
