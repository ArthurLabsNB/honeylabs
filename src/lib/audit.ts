import * as logger from '@lib/logger'
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'

interface AuditDb {
  auditLog?: {
    create(args: {
      data: {
        usuarioId: number | null
        accion: string
        entidad: string
        payload?: any
      }
    }): Promise<void>
  }
  $executeRawUnsafe?: (query: string, ...params: any[]) => Promise<void>
}

function isSupabase(db: any): db is SupabaseClient {
  return typeof db?.from === 'function'
}

export async function logAudit(
  usuarioId: number | null,
  accion: string,
  entidad: string,
  payload?: any,
): Promise<void> {
  try {
    const db = getDb().client as AuditDb | SupabaseClient
    if (isSupabase(db)) {
      await db.from('audit_log').insert({ usuarioId, accion, entidad, payload })
    } else if ((db as AuditDb).auditLog?.create) {
      await (db as AuditDb).auditLog!.create({
        data: { usuarioId, accion, entidad, payload },
      })
    } else if ((db as AuditDb).$executeRawUnsafe) {
      await (db as AuditDb).$executeRawUnsafe(
        `INSERT INTO "AuditLog" ("usuarioId", accion, entidad, payload, fecha)
         VALUES ($1,$2,$3,$4,NOW())`,
        usuarioId,
        accion,
        entidad,
        payload ? JSON.stringify(payload) : null,
      )
    }
  } catch (err) {
    logger.error('audit log error:', err)
  }
}
