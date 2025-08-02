export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js'
import { getDb } from '@lib/db'
import { getUsuarioFromSession } from '@lib/auth';
import { hasManagePerms } from '@lib/permisos';
import { registrarAuditoria } from '@lib/reporter';
import crypto from 'node:crypto';
import * as logger from '@lib/logger';

function getId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/');
  const idx = parts.findIndex(p => p === 'almacenes');
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null;
  return id && !Number.isNaN(id) ? id : null;
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    if (!hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
    const id = getId(req);
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const db = getDb().client as SupabaseClient
    const { data: almacen, error } = await db
      .from('almacen')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    if (!almacen) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    const codigoUnico = crypto.randomUUID().split('-')[0];

    const { data: nuevo, error: createErr } = await db
      .from('almacen')
      .insert({
        nombre: `${almacen.nombre} copia`,
        descripcion: almacen.descripcion,
        funciones: almacen.funciones,
        permisosPredeterminados: almacen.permisosPredeterminados,
        imagenUrl: almacen.imagenUrl,
        imagenNombre: almacen.imagenNombre,
        imagen: almacen.imagen as any,
        codigoUnico,
        entidadId: almacen.entidadId,
      })
      .select('id,nombre')
      .single()
    if (createErr) throw createErr
    await db
      .from('usuario_almacen')
      .insert({ usuario_id: usuario.id, almacen_id: nuevo.id, rolEnAlmacen: 'propietario' })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'almacen',
      id,
      'duplicacion',
      nuevo,
    );

    return NextResponse.json({ almacen: nuevo, auditoria, auditError });
  } catch (err) {
    logger.error('POST /api/almacenes/[id]/duplicar', err);
    return NextResponse.json({ error: 'Error al duplicar' }, { status: 500 });
  }
}
