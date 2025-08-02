export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js'
import { getDb } from '@lib/db'
import { getUsuarioFromSession } from '@lib/auth';
import { hasManagePerms, hasPermission } from '@lib/permisos';
import { logAudit } from '@/lib/audit';
import { registrarAuditoria } from '@lib/reporter';
import * as logger from '@lib/logger'

function getAlmacenIdFromRequest(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/');
  const idx = parts.findIndex((p) => p === 'almacenes');
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null;
  return id && !Number.isNaN(id) ? id : null;
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const id = getAlmacenIdFromRequest(req);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const db = getDb().client as SupabaseClient
    const { data: pertenece } = await db
      .from('usuario_almacen')
      .select('id')
      .eq('usuario_id', usuario.id)
      .eq('almacen_id', id)
      .maybeSingle();
    if (
      !pertenece &&
      !hasManagePerms(usuario) &&
      !hasPermission(usuario, 'movimientos')
    ) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
    const { tipo, cantidad, descripcion, contexto } = await req.json();
    if (tipo !== 'entrada' && tipo !== 'salida') {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }
    const n = Number(cantidad);
    if (!n || n <= 0) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
    }

    const { error } = await db.from('movimiento').insert({
      tipo,
      cantidad: n,
      descripcion: descripcion || null,
      contexto: contexto ?? null,
      almacenId: id,
      usuarioId: usuario.id,
    })
    if (error) throw error
    await logAudit(usuario.id, 'movimiento', 'almacen', {
      tipo,
      cantidad: n,
      almacenId: id,
    })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'almacen',
      id,
      'movimiento',
      { tipo, cantidad: n, descripcion, contexto },
    )

    return NextResponse.json({ success: true, auditoria, auditError });
  } catch (err) {
    logger.error('POST /api/almacenes/[id]/movimientos', err);
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const id = getAlmacenIdFromRequest(req);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const db = getDb().client as SupabaseClient
    const { data: pertenece } = await db
      .from('usuario_almacen')
      .select('id')
      .eq('usuario_id', usuario.id)
      .eq('almacen_id', id)
      .maybeSingle();
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
    const { data: movimientos, error } = await db
      .from('movimiento')
      .select('id,tipo,cantidad,fecha,descripcion,usuario:usuario(nombre)')
      .eq('almacenId', id)
      .order('fecha', { ascending: false })
      .limit(20)
    if (error) throw error
    return NextResponse.json({ movimientos });
  } catch (err) {
    logger.error('GET /api/almacenes/[id]/movimientos', err);
    return NextResponse.json(
      { error: 'Error al obtener movimientos' },
      { status: 500 },
    );
  }
}
