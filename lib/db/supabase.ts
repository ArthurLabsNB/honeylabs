import { createClient, SupabaseClient } from '@supabase/supabase-js'
import * as logger from '@lib/logger'
import type { DbClient, DbTransaction } from './index'

let client: SupabaseClient | undefined
// Garantiza un único log de configuración
let logged = false

function getClient() {
  if (client) return client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase no configurado')
  }
  if (!logged) {
    logger.info('[DB] service url', url.slice(0, 30))
    logger.info('[DB] service key prefix', key.slice(0, 5))
    logged = true
  }
  client = createClient(url, key, { auth: { persistSession: false } })
  return client
}

// Se verifica una vez si Supabase expone RPCs de transacción; si no,
// las operaciones se ejecutan secuencialmente y los rollbacks son manuales.
let supportsTxRpc: boolean | undefined

async function runTransaction<T>(fn: (tx: SupabaseClient) => Promise<T>): Promise<T> {
  const db = getClient()
  if (supportsTxRpc !== false) {
    try {
      await db.rpc('tx_begin')
      supportsTxRpc = true
    } catch {
      supportsTxRpc = false
      logger.warn('tx_* RPC no disponibles; operaciones secuenciales')
    }
  }
  try {
    const res = await fn(db)
    if (supportsTxRpc) {
      try {
        await db.rpc('tx_commit')
      } catch {
        /* ignora fallos de commit */
      }
    }
    return res
  } catch (err) {
    if (supportsTxRpc) {
      try {
        await db.rpc('tx_rollback')
      } catch {
        /* ignora fallos de rollback */
      }
    }
    throw err
  }
}

export const SupabaseAdapter: DbClient = {
  get client() {
    return getClient()
  },
  transaction: runTransaction as unknown as DbClient['transaction'],
}
