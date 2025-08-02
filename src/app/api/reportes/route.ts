export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getUsuarioFromSession } from '@lib/auth'
import { getMainRole, normalizeRol, normalizeTipoCuenta } from '@lib/permisos'
import * as logger from '@lib/logger'

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const rolMain = getMainRole(usuario)
    const rol = normalizeRol(typeof rolMain === 'string' ? rolMain : rolMain?.nombre)
    const tipoCuenta = normalizeTipoCuenta(usuario.tipoCuenta)
    const allowedRoles = ['admin', 'administrador']
    const allowedTipos = ['institucional', 'empresarial', 'admin']
    if (!allowedRoles.includes(rol) && !allowedTipos.includes(tipoCuenta)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const tipo = req.nextUrl.searchParams.get('tipo') || undefined
    const db = getDb().client as SupabaseClient
    let query = db
      .from('reporte')
      .select('id, tipo, categoria, fecha, observaciones')
      .order('fecha', { ascending: false })
      .limit(20)
    if (tipo && ['almacen', 'material', 'unidad'].includes(tipo)) {
      query = query.eq('tipo', tipo)
    }
    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ reportes: data })
  } catch (err) {
    logger.error('GET /api/reportes', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const rolMain = getMainRole(usuario)
    const rol = normalizeRol(typeof rolMain === 'string' ? rolMain : rolMain?.nombre)
    const tipoCuenta = normalizeTipoCuenta(usuario.tipoCuenta)
    const allowedRoles = ['admin', 'administrador']
    const allowedTipos = ['institucional', 'empresarial', 'admin']
    if (!allowedRoles.includes(rol) && !allowedTipos.includes(tipoCuenta)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    let tipo: string | null = null
    let objetoId: string | null = null
    let observaciones: string | null = null
    let categoria: string | null = null
    let files: File[] = []

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const form = await req.formData()
      tipo = String(form.get('tipo') ?? '')
      objetoId = String(form.get('objetoId') ?? '')
      observaciones = String(form.get('observaciones') ?? '')
      categoria = String(form.get('categoria') ?? '')
      files = form.getAll('archivos') as File[]
    } else {
      const body = await req.json()
      tipo = body.tipo
      objetoId = body.objetoId
      observaciones = body.observaciones
      categoria = body.categoria
    }

    if (!tipo || !objetoId) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const data: any = { tipo, observaciones, categoria, usuario_id: usuario.id }
    if (tipo === 'almacen') data.almacen_id = Number(objetoId)
    if (tipo === 'material') data.material_id = Number(objetoId)
    if (tipo === 'unidad') data.unidad_id = Number(objetoId)

    const db = getDb().client as SupabaseClient
    const { data: rep, error } = await db
      .from('reporte')
      .insert(data)
      .select('id')
      .single()
    if (error) throw error

    if (files.length > 0) {
      await Promise.all(
        files.map(async (f) => {
          const buffer = Buffer.from(await f.arrayBuffer())
          const { error: errArchivo } = await db.from('archivo_reporte').insert({
            nombre: f.name,
            archivo: buffer.toString('base64'),
            reporte_id: rep.id,
            subido_por_id: usuario.id,
          })
          if (errArchivo) throw errArchivo
        }),
      )
    }

    return NextResponse.json({ reporte: rep })
  } catch (err) {
    logger.error('POST /api/reportes', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
