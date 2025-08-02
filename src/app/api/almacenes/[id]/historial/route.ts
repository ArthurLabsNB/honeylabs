export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getDb } from '@lib/db'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'
import { snapshotAlmacen } from '@/lib/snapshot'

function getAlmacenId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'almacenes')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getAlmacenId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const db = getDb().client as SupabaseClient
    const { data: pertenece } = await db
      .from('usuario_almacen')
      .select('id')
      .eq('usuario_id', usuario.id)
      .eq('almacen_id', id)
      .maybeSingle()
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const { data: historial, error } = await db
      .from('historial_almacen')
      .select('id,descripcion,fecha,estado,usuario:usuario(nombre)')
      .eq('almacenId', id)
      .order('fecha', { ascending: false })
    if (error) throw error
    return NextResponse.json({ historial })
  } catch (err) {
    logger.error('GET /api/almacenes/[id]/historial', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}


export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getAlmacenId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const db = getDb().client as SupabaseClient
    const { data: pertenece } = await db
      .from('usuario_almacen')
      .select('id')
      .eq('usuario_id', usuario.id)
      .eq('almacen_id', id)
      .maybeSingle()
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const body = await req.json()
    await snapshotAlmacen(db, id, usuario.id, body.descripcion || 'Modificación')
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('POST /api/almacenes/[id]/historial', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

