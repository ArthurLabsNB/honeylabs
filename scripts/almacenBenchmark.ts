import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import * as logger from '@lib/logger'

async function run() {
  const limit = Number(process.argv[2] ?? 1000)
  const db = getDb().client as SupabaseClient
  const start = Date.now()
  const { data, error } = await db
    .from('almacen_resumen')
    .select('id')
    .limit(limit)
  if (error) throw error
  const ms = Date.now() - start
  logger.info(`Consulta de resumen: ${data?.length ?? 0} filas en ${ms}ms`)
}

run().catch((e) => {
  logger.error('Benchmark almacenes:', e)
  process.exit(1)
})
