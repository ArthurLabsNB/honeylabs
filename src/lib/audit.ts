import * as logger from '@lib/logger'

export async function logAudit(
  usuarioId: number | null,
  accion: string,
  entidad: string,
  payload?: any,
) {
  try {
    const prisma = (await import('@lib/prisma')).default
    await prisma.$executeRawUnsafe(
      `INSERT INTO "AuditLog" ("usuarioId", accion, entidad, payload, fecha)
       VALUES ($1,$2,$3,$4,NOW())`,
      usuarioId,
      accion,
      entidad,
      payload ? JSON.stringify(payload) : null,
    )
  } catch (err) {
    logger.error('audit log error:', err)
  }
}
