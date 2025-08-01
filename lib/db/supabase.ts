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
  client = createClient(url, key)
  return client
}

export const SupabaseAdapter: DbClient = {
  get client() {
    return getClient()
  },
  transaction: async (fn) => fn(getClient() as DbTransaction),
}
