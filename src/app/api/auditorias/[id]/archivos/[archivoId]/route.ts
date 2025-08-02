export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getDb } from '@lib/db'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

function getArchivoId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'archivos')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return new NextResponse('No autenticado', { status: 401 })
    const archivoId = getArchivoId(req)
    if (!archivoId) return new NextResponse('ID inválido', { status: 400 })
    const db = getDb().client as SupabaseClient
    const { data, error } = await db
      .from('ArchivoAuditoria')
      .select('archivo, archivoNombre')
      .eq('id', archivoId)
      .maybeSingle()
    if (error) throw error
    if (!data || !data.archivo) return new NextResponse('No encontrado', { status: 404 })
    const ext = data.archivoNombre?.split('.').pop()?.toLowerCase() ?? ''
    const mime = MIME_BY_EXT[ext] || 'application/octet-stream'
    const buffer = Buffer.isBuffer(data.archivo) ? data.archivo : Buffer.from(data.archivo)
    return new NextResponse(buffer, { status: 200, headers: { 'Content-Type': mime } })
  } catch (err) {
    logger.error('GET /api/auditorias/[id]/archivos/[archivoId]', err)
    return new NextResponse('Error', { status: 500 })
  }
}
