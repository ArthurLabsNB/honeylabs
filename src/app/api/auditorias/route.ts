export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getDb } from '@lib/db'

import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'
import { ensureAuditoriaTables } from '@lib/auditoriaInit'
import { emitEvent } from '@/lib/events'
import { auditoriaSchema } from '@/lib/schemas/auditoria'

export async function GET(req: NextRequest) {
  try {
    await ensureAuditoriaTables()
    const tipo = req.nextUrl.searchParams.get('tipo') || undefined
    const categoria = req.nextUrl.searchParams.get('categoria') || undefined
    const almacenId = req.nextUrl.searchParams.get('almacenId') || undefined
    const materialId = req.nextUrl.searchParams.get('materialId') || undefined
    const unidadId = req.nextUrl.searchParams.get('unidadId') || undefined
    const usuarioId = req.nextUrl.searchParams.get('usuarioId') || undefined
    const q = req.nextUrl.searchParams.get('q')?.toLowerCase() || undefined
    const desde = req.nextUrl.searchParams.get('desde') || undefined
    const hasta = req.nextUrl.searchParams.get('hasta') || undefined

    const db = getDb().client as SupabaseClient
    let query = db
      .from('Auditoria')
      .select(
        `id, tipo, categoria, fecha, observaciones,
        usuario:usuario ( nombre ),
        almacen:Almacen ( nombre ),
        material:Material ( nombre ),
        unidad:MaterialUnidad ( nombre )`
      )
      .order('fecha', { ascending: false })
      .limit(50)

    if (tipo && ['almacen','material','unidad'].includes(tipo)) query = query.eq('tipo', tipo)
    if (almacenId) query = query.eq('almacenId', Number(almacenId))
    if (materialId) query = query.eq('materialId', Number(materialId))
    if (unidadId) query = query.eq('unidadId', Number(unidadId))
    if (usuarioId) query = query.eq('usuarioId', Number(usuarioId))
    if (categoria) query = query.eq('categoria', categoria)
    if (q) {
      query = query.or(
        `observaciones.ilike.%${q}%,usuario.nombre.ilike.%${q}%,Almacen.nombre.ilike.%${q}%,Material.nombre.ilike.%${q}%,MaterialUnidad.nombre.ilike.%${q}%`
      )
    }
    if (desde) query = query.gte('fecha', desde)
    if (hasta) query = query.lte('fecha', hasta)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ auditorias: data })
  } catch (err) {
    logger.error('GET /api/auditorias', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureAuditoriaTables()
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    let raw: any
    let files: File[] = []
    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const form = await req.formData()
      raw = {
        tipo: form.get('tipo'),
        objetoId: form.get('objetoId'),
        categoria: form.get('categoria'),
        observaciones: form.get('observaciones'),
      }
      files = form.getAll('files') as File[]
    } else {
      raw = await req.json()
    }
    const parsed = auditoriaSchema.safeParse(raw)
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ')
      return NextResponse.json({ error: `Datos inválidos: ${msg}` }, { status: 400 })
    }

    const { tipo, objetoId, categoria, observaciones } = parsed.data
    const db = getDb().client as SupabaseClient
    const where: Record<string, any> = { tipo }
    const data: Record<string, any> = {
      tipo,
      observaciones,
      categoria,
      usuarioId: usuario.id,
    }
    if (tipo === 'almacen') {
      data.almacenId = objetoId
      where.almacenId = objetoId
    }
    if (tipo === 'material') {
      data.materialId = objetoId
      where.materialId = objetoId
    }
    if (tipo === 'unidad') {
      data.unidadId = objetoId
      where.unidadId = objetoId
    }

    const auditoria = await getDb().transaction(async (tx: SupabaseClient) => {
      const { count, error: countErr } = await tx
        .from('Auditoria')
        .select('id', { head: true, count: 'exact' })
        .match(where)
      if (countErr) throw countErr
      const version = (count ?? 0) + 1
      const { data: created, error: createErr } = await tx
        .from('Auditoria')
        .insert({ ...data, version })
        .select('id')
        .single()
      if (createErr) throw createErr
      return created
    })

    if (files.length > 0) {
      await Promise.all(
        files.map(async (f) => {
          const buffer = Buffer.from(await f.arrayBuffer())
          const { error } = await db
            .from('ArchivoAuditoria')
            .insert({ nombre: f.name, archivo: buffer, auditoriaId: auditoria.id })
          if (error) throw error
        })
      )
    }

    emitEvent({ type: 'auditoria_new', payload: { id: auditoria.id } })
    return NextResponse.json({ auditoria })
  } catch (err) {
    logger.error('POST /api/auditorias', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
