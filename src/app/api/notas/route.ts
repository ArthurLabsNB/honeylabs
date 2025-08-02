export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const tabId = req.nextUrl.searchParams.get('tabId')
    if (!tabId) return NextResponse.json({ error: 'tabId requerido' }, { status: 400 })
    const db = getDb().client as SupabaseClient
    const { data, error } = await db
      .from('nota')
      .select('*')
      .eq('tabId', tabId)
      .order('id', { ascending: true })
    if (error) throw error
    return NextResponse.json({ notas: data })
  } catch (err) {
    logger.error('GET /api/notas', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    let tabId: string | null = null
    let tipo: string | null = null
    let contenido: string | null = null

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const form = await req.formData()
      tabId = form.get('tabId') as string | null
      tipo = form.get('tipo') as string | null
      const file = form.get('archivo') as File | null
      if (file) {
        const buf = Buffer.from(await file.arrayBuffer())
        contenido = buf.toString('base64')
      }
    } else {
      const body = await req.json()
      tabId = body.tabId
      tipo = body.tipo
      contenido = body.contenido
    }

    if (!tabId || !tipo || contenido == null) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const db = getDb().client as SupabaseClient
    const { data, error } = await db
      .from('nota')
      .insert({ tabId, tipo, contenido })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ nota: data }, { status: 201 })
  } catch (err) {
    logger.error('POST /api/notas', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
