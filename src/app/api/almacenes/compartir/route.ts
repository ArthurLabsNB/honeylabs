export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getDb } from '@lib/db'
import { getUsuarioFromSession } from '@lib/auth'
import { emitEvent } from '@/lib/events'
import * as logger from '@lib/logger'
import { enviarInvitacionAlmacen } from '@/lib/email/enviarInvitacionAlmacen'

export async function POST(req: NextRequest) {
  logger.debug(req, 'POST /api/almacenes/compartir')
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { codigo, correos } = await req.json()
    if (!codigo) return NextResponse.json({ error: 'Código requerido' }, { status: 400 })

    const db = getDb().client as SupabaseClient
    const { data: cod, error } = await db
      .from('codigo_almacen')
      .select('*')
      .eq('codigo', codigo)
      .maybeSingle()
    if (error) throw error
    if (!cod || !cod.activo) return NextResponse.json({ error: 'Código inválido' }, { status: 404 })
    if (Array.isArray(correos) && correos.length > 0) {
      const base = `${req.nextUrl.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}`
      const enlace = `${base}/api/almacenes/compartir?codigo=${codigo}`
      const envio = await enviarInvitacionAlmacen({ correos, enlace })
      return NextResponse.json({ enviado: envio.enviado })
    }
    if (cod.fechaExpiracion && cod.fechaExpiracion < new Date()) {
      return NextResponse.json({ error: 'Código expirado' }, { status: 410 })
    }
    if (cod.usosDisponibles !== null && cod.usosDisponibles <= 0) {
      return NextResponse.json({ error: 'Código sin usos' }, { status: 410 })
    }

    await db
      .from('usuario_almacen')
      .upsert(
        {
          usuarioId: usuario.id,
          almacenId: cod.almacenId,
          rolEnAlmacen: cod.rolAsignado,
          permisosExtra: cod.permisos,
        },
        { onConflict: 'usuarioId,almacenId' },
      )

    emitEvent({ type: 'usuarios_update', payload: { almacenId: cod.almacenId } })

    if (cod.usosDisponibles !== null) {
      await db
        .from('codigo_almacen')
        .update({ usosDisponibles: (cod.usosDisponibles ?? 0) - 1 })
        .eq('id', cod.id)
    }

    return NextResponse.json({ success: true, almacenId: cod.almacenId })
  } catch (err) {
    logger.error('POST /api/almacenes/compartir', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
