export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getDb } from '@lib/db'

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
    const { data, error } = await db
      .from('Auditoria')
      .select(
        `id, tipo, categoria, fecha, observaciones,
        usuario:usuario ( nombre, correo ),
        almacen:Almacen ( nombre ),
        material:Material ( nombre ),
        unidad:MaterialUnidad ( nombre ),
        archivos:ArchivoAuditoria ( id, nombre, archivoNombre )`
      )
      .eq('id', id)
      .maybeSingle()

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
    await db.from('ArchivoAuditoria').delete().eq('auditoriaId', id)
    await db.from('Auditoria').delete().eq('id', id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('DELETE /api/auditorias/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
