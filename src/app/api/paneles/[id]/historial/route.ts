export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

function safeParse<T = any>(v: unknown, fallback: T = {} as T): T {
  try {
    return typeof v === 'string' ? JSON.parse(v) : ((v ?? fallback) as T)
  } catch {
    return fallback
  }
}

function getId(req: NextRequest): string | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex((p) => p === 'paneles')
  const id = idx !== -1 && parts.length > idx + 1 ? parts[idx + 1] : null
  return id || null
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const prefs = safeParse<Record<string, any>>(usuario.preferencias, {})
    const panel = Array.isArray(prefs.paneles) ? prefs.paneles.find((p: any) => p.id === id) : null
    if (!panel) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const historial = Array.isArray(panel.historial) ? panel.historial : []
    return NextResponse.json({ historial })
  } catch (err) {
    logger.error('GET /api/paneles/[id]/historial', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
