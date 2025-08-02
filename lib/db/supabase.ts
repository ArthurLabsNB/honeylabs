import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { DbClient, DbTransaction } from './index'

let client: SupabaseClient | undefined

function getClient() {
  if (client) return client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase no configurado')
  }
  client = createClient(url, key, { auth: { persistSession: false } })
  return client
}

async function runTransaction<T>(fn: (tx: SupabaseClient) => Promise<T>): Promise<T> {
  const db = getClient()
  try {
    await db.rpc('tx_begin')
  } catch {
    /* transacciones no soportadas; continuar sin BEGIN */
  }
  try {
    const res = await fn(db)
    try {
      await db.rpc('tx_commit')
    } catch {
      /* ignore commit error when rpc missing */
    }
    return res
  } catch (err) {
    try {
      await db.rpc('tx_rollback')
    } catch {
      /* ignore rollback error */
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
