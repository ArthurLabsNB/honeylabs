export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

function getNotaId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'notas')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function PUT(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getNotaId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const { contenido } = await req.json()
    if (typeof contenido !== 'string') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
    const db = getDb().client as SupabaseClient
    const { data, error } = await db
      .from('nota')
      .update({ contenido })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ nota: data })
  } catch (err) {
    logger.error('PUT /api/notas/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getNotaId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const db = getDb().client as SupabaseClient
    const { error } = await db.from('nota').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('DELETE /api/notas/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
