export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getDb } from '@lib/db';
import type { SupabaseClient } from '@supabase/supabase-js';
import * as logger from '@lib/logger';

export async function GET() {
  try {
    const db = getDb().client as SupabaseClient;
    const [
      almacenesRes,
      materialesRes,
      unidadesRes,
      auditoriasRes,
      panelesRes,
      inventarioRes,
    ] = await Promise.all([
      db.from('almacen').select('id', { count: 'exact', head: true }),
      db.from('material').select('id', { count: 'exact', head: true }),
      db.from('material_unidad').select('id', { count: 'exact', head: true }),
      db.from('auditoria').select('id', { count: 'exact', head: true }),
      db.from('panel').select('id', { count: 'exact', head: true }),
      db.from('movimiento').select('id', { count: 'exact', head: true }),
    ]);

    const errors = [
      almacenesRes.error,
      materialesRes.error,
      unidadesRes.error,
      auditoriasRes.error,
      panelesRes.error,
      inventarioRes.error,
    ].filter(Boolean);
    if (errors.length) throw new Error(errors.map((e) => e!.message).join('; '));

    return NextResponse.json({
      almacenes: almacenesRes.count ?? 0,
      materiales: materialesRes.count ?? 0,
      unidades: unidadesRes.count ?? 0,
      auditorias: auditoriasRes.count ?? 0,
      paneles: panelesRes.count ?? 0,
      inventario: inventarioRes.count ?? 0,
    });
  } catch (err) {
    logger.error('GET /api/dashboard/resumen', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
