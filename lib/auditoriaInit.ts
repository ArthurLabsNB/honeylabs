import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import * as logger from './logger'

let checked = false

export async function ensureAuditoriaTables() {
  if (checked) return
  try {
    const db = getDb().client as SupabaseClient
    const { error } = await db.rpc('ensure_auditoria_tables')
    if (error) {
      if ((error as any).code === 'PGRST202') {
        logger.warn('RPC ensure_auditoria_tables no encontrada, se omite')
      } else {
        throw error
      }
    }
    checked = true
  } catch (err) {
    logger.error('ensureAuditoriaTables', err)
    throw err
  }
}
