import * as logger from '@lib/logger'
import { getDb } from '@lib/db'

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

export async function logAudit(
  usuarioId: number | null,
  accion: string,
  entidad: string,
  payload?: any,
): Promise<void> {
  try {
    const db = getDb().client as AuditDb
    if (db.auditLog?.create) {
      await db.auditLog.create({
        data: { usuarioId, accion, entidad, payload },
      })
    } else if (db.$executeRawUnsafe) {
      await db.$executeRawUnsafe(
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
