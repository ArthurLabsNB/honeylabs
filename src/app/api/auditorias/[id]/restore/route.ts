export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getDb } from '@lib/db'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'
import { registrarAuditoria } from '@lib/reporter'

function getAuditoriaId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'auditorias')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getAuditoriaId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const db = getDb().client as SupabaseClient
    const { data: auditoria, error } = await db
      .from('Auditoria')
      .select('id, tipo, observaciones')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    if (!auditoria) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

    const datos = auditoria.observaciones ? JSON.parse(auditoria.observaciones) : {}
    let creado: any

    if (auditoria.tipo === 'almacen') {
      const { data: nuevo, error: e } = await db
        .from('Almacen')
        .insert(datos)
        .select('id')
        .single()
      if (e) throw e
      creado = nuevo
    } else if (auditoria.tipo === 'material') {
      const { data: nuevo, error: e } = await db
        .from('Material')
        .insert(datos)
        .select('id')
        .single()
      if (e) throw e
      creado = nuevo
    } else if (auditoria.tipo === 'unidad') {
      const { data: nuevo, error: e } = await db
        .from('MaterialUnidad')
        .insert(datos)
        .select('id')
        .single()
      if (e) throw e
      creado = nuevo
    } else {
      return NextResponse.json({ error: 'Tipo desconocido' }, { status: 400 })
    }

    const { auditoria: nuevaAuditoria, error: auditError } = await registrarAuditoria(
      req,
      auditoria.tipo as any,
      creado.id,
      'restauracion',
      datos,
    )

    return NextResponse.json({ success: true, auditoria: nuevaAuditoria, auditError })
  } catch (err) {
    logger.error('POST /api/auditorias/[id]/restore', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
