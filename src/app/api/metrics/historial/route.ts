export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { getDb } from '@lib/db'
import type { SupabaseClient, PostgrestError } from '@supabase/supabase-js'
import * as logger from '@lib/logger'

export async function GET() {
  try {
    const inicio = new Date()
    inicio.setHours(0, 0, 0, 0)

    const db = getDb().client as SupabaseClient

    const sesionesData = await obtenerSesiones(db)
    const usuariosActivos = sesionesData.filter(s => s.activa).length

    const promedio = sesionesData.length
      ? sesionesData.reduce((acc, s) => acc + (new Date(s.fechaUltima).getTime() - new Date(s.fechaInicio).getTime()) / 60000, 0) / sesionesData.length
      : 0

    const cambiosSesion = await contarBitacora(db, inicio)

    return NextResponse.json({
      tiempoEdicionPromedio: Math.round(promedio),
      usuariosActivos,
      cambiosSesion,
    })
  } catch (err) {
    logger.error('[METRICS_HISTORIAL]', err)
    return NextResponse.json({ error: 'Error obteniendo métricas' }, { status: 500 })
  }
}

interface SesionRow { fechaInicio: string; fechaUltima: string; activa: boolean }

async function obtenerSesiones(db: SupabaseClient): Promise<SesionRow[]> {
  const tablas = ['sesion_usuario', 'SesionUsuario']
  for (const tabla of tablas) {
    const { data, error } = await db.from(tabla).select('fechaInicio, fechaUltima, activa')
    if (!error && data) return data as SesionRow[]
    if (error && !esEsquemaInvalido(error)) throw error
  }
  return []
}

async function contarBitacora(db: SupabaseClient, desde: Date): Promise<number> {
  const tablas = ['bitacora_cambio_perfil', 'BitacoraCambioPerfil']
  for (const tabla of tablas) {
    const { count, error } = await db
      .from(tabla)
      .select('id', { count: 'exact', head: true })
      .gte('fecha', desde.toISOString())
    if (!error) return count ?? 0
    if (error && !esEsquemaInvalido(error)) throw error
  }
  return 0
}

function esEsquemaInvalido(err: PostgrestError) {
  return err.code === 'PGRST204' || err.code === '42P01'
}
