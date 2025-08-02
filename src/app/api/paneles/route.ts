export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@lib/db';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getUsuarioFromSession } from '@lib/auth';
import { randomUUID } from 'crypto';
import * as logger from '@lib/logger';

/* Utils */
function safeParse<T = any>(v: unknown, fallback: T = {} as T): T {
  try {
    return typeof v === 'string' ? JSON.parse(v) : ((v ?? fallback) as T);
  } catch {
    return fallback;
  }
}

/* GET /api/paneles */
export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req); // ✅ evita reentrada
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const prefs = safeParse<Record<string, any>>(usuario.preferencias, {});
    const paneles = Array.isArray(prefs.paneles) ? prefs.paneles : [];
    return NextResponse.json({ paneles });
  } catch (err) {
    logger.error('GET /api/paneles', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

/* POST /api/paneles */
export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const nombre = (body?.nombre ?? 'Sin título').toString();

    const prefs = safeParse<Record<string, any>>(usuario.preferencias, {});
    const paneles: any[] = Array.isArray(prefs.paneles) ? prefs.paneles : [];

    const id = randomUUID();
    paneles.push({
      id,
      nombre,
      widgets: [],
      layout: [],
      fechaMod: new Date().toISOString(),
    });
    prefs.paneles = paneles;

    const db = getDb().client as SupabaseClient;
    const { error } = await db
      .from('usuario')
      .update({ preferencias: JSON.stringify(prefs) })
      .eq('id', usuario.id);
    if (error) throw error;

    return NextResponse.json({ id });
  } catch (err) {
    logger.error('POST /api/paneles', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
