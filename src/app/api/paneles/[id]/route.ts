export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@lib/db';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getUsuarioFromSession } from '@lib/auth';
import * as logger from '@lib/logger';

const supabase = getDb().client as SupabaseClient;

function safeParse<T = any>(v: unknown, fallback: T = {} as T): T {
  try {
    return typeof v === 'string' ? JSON.parse(v) : ((v ?? fallback) as T);
  } catch {
    return fallback;
  }
}

function getId(req: NextRequest): string | null {
  const parts = req.nextUrl.pathname.split('/');
  const idx = parts.findIndex((p) => p === 'paneles');
  const id = idx !== -1 && parts.length > idx + 1 ? parts[idx + 1] : null;
  return id || null;
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const id = getId(req);
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    const prefs = safeParse<Record<string, any>>(usuario.preferencias, {});
    const panel = Array.isArray(prefs.paneles) ? prefs.paneles.find((p: any) => p.id === id) : null;
    if (!panel) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json({ panel });
  } catch (err) {
    logger.error('GET /api/paneles/[id]', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const id = getId(req);
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    const data = await req.json();
    const prefs = safeParse<Record<string, any>>(usuario.preferencias, {});
    let paneles = Array.isArray(prefs.paneles) ? prefs.paneles : [];
    const idx = paneles.findIndex((p: any) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    const actual = paneles[idx];
    const historial = Array.isArray(actual.historial) ? actual.historial : [];
    historial.push({
      fecha: new Date().toISOString(),
      estado: {
        nombre: actual.nombre,
        widgets: actual.widgets,
        layout: actual.layout,
      },
    });
    paneles[idx] = { ...actual, ...data, fechaMod: new Date().toISOString(), historial };
    prefs.paneles = paneles;
    const { error } = await supabase
      .from('usuario')
      .update({ preferencias: JSON.stringify(prefs) })
      .eq('id', usuario.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error('PUT /api/paneles/[id]', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const id = getId(req);
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    const prefs = safeParse<Record<string, any>>(usuario.preferencias, {});
    const paneles = Array.isArray(prefs.paneles) ? prefs.paneles.filter((p: any) => p.id !== id) : [];
    prefs.paneles = paneles;
    const { error } = await supabase
      .from('usuario')
      .update({ preferencias: JSON.stringify(prefs) })
      .eq('id', usuario.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error('DELETE /api/paneles/[id]', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
