// Forzar entorno Node.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getDb } from '@lib/db';
import type { SupabaseClient } from '@supabase/supabase-js';
import * as logger from '@lib/logger'

export async function GET() {
  try {
    // Consulta de prueba para validar conexión
    const db = getDb().client as SupabaseClient;
    await db.from('usuario').select('id').limit(1);

    return NextResponse.json({ ok: true, mensaje: '✅ Conexión a la base de datos exitosa.' }, { status: 200 });
  } catch (error: any) {
    logger.error('[ERROR_PING_DB]', error);
    return NextResponse.json({ ok: false, error: '❌ Error al conectar con la base de datos.', detalle: String(error) }, { status: 500 });
  }
}
