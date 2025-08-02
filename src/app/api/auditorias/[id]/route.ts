export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

function getAuditoriaId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'auditorias')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getAuditoriaId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const db = getDb().client as SupabaseClient
    const { data, error } = await db.from('auditoria').select('*').eq('id', id).single()
    if (error) throw error
    if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ auditoria: data })
  } catch (err) {
    logger.error('GET /api/auditorias/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getAuditoriaId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const db = getDb().client as SupabaseClient
    const { error: err1 } = await db.from('archivoAuditoria').delete().eq('auditoriaId', id)
    if (err1) throw err1
    const { error: err2 } = await db.from('auditoria').delete().eq('id', id)
    if (err2) throw err2
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('DELETE /api/auditorias/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
