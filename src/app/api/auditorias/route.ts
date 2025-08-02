export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'
import { ensureAuditoriaTables } from '@lib/auditoriaInit'
import { emitEvent } from '@/lib/events'
import { auditoriaSchema } from '@/lib/schemas/auditoria'

export async function POST(req: NextRequest) {
  try {
    await ensureAuditoriaTables()
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    let raw: any
    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const form = await req.formData()
      raw = {
        tipo: form.get('tipo'),
        objetoId: form.get('objetoId'),
        categoria: form.get('categoria'),
        observaciones: form.get('observaciones'),
      }
    } else {
      raw = await req.json()
    }
    const parsed = auditoriaSchema.safeParse(raw)
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ')
      return NextResponse.json({ error: `Datos inválidos: ${msg}` }, { status: 400 })
    }

    const { tipo, objetoId, categoria, observaciones } = parsed.data
    const db = getDb()
    const insert: any = { tipo, categoria, observaciones, usuarioId: usuario.id }
    const where: any = { tipo }
    const obj = Number(objetoId)
    if (tipo === 'almacen') { insert.almacenId = obj; where.almacenId = obj }
    if (tipo === 'material') { insert.materialId = obj; where.materialId = obj }
    if (tipo === 'unidad') { insert.unidadId = obj; where.unidadId = obj }

    const auditoria = await db.transaction(async (tx: SupabaseClient) => {
      const { count, error: cErr } = await tx
        .from('auditoria')
        .select('id', { count: 'exact', head: true })
        .match(where)
      if (cErr) throw cErr
      const version = (count ?? 0) + 1
      const { data, error: iErr } = await tx
        .from('auditoria')
        .insert({ ...insert, version })
        .select('id')
        .single()
      if (iErr) throw iErr
      return data
    })

    emitEvent({ type: 'auditoria_new', payload: { id: auditoria.id } })
    return NextResponse.json({ auditoria })
  } catch (err) {
    logger.error('POST /api/auditorias', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
