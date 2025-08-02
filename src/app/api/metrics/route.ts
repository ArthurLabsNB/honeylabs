import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import * as logger from '@lib/logger'

// Función auxiliar para obtener usuario desde JWT (por implementar)
async function getUsuarioFromRequest(req: NextRequest) {
  // Lógica para extraer usuario de cookie JWT (si necesario)
  // Por ahora devuelve null
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const db = getDb().client as SupabaseClient

    const [entradasRes, salidasRes, usuariosRes, almacenesRes] = await Promise.all([
      db.from('movimiento').select('id', { count: 'exact', head: true }).eq('tipo', 'entrada'),
      db.from('movimiento').select('id', { count: 'exact', head: true }).eq('tipo', 'salida'),
      db.from('usuario').select('id', { count: 'exact', head: true }),
      db.from('almacen').select('id', { count: 'exact', head: true }),
    ])

    const errors = [entradasRes.error, salidasRes.error, usuariosRes.error, almacenesRes.error].filter(Boolean)
    if (errors.length) throw new Error(errors.map(e => e.message).join('; '))

    return NextResponse.json({
      entradas: entradasRes.count ?? 0,
      salidas: salidasRes.count ?? 0,
      usuarios: usuariosRes.count ?? 0,
      almacenes: almacenesRes.count ?? 0,
    })
  } catch (error) {
    logger.error('[ERROR_METRICAS]', error)
    return NextResponse.json(
      { error: 'No se pudieron recuperar las métricas', details: String(error) },
      { status: 500 },
    )
  }
}
