export async function logAudit(
  usuarioId: number | null,
  accion: string,
  entidad: string,
  payload?: any,
) {
  try {
    const prisma = (await import('@lib/prisma')).default
    await prisma.$executeRawUnsafe(
      `INSERT INTO audit_log (usuario_id, accion, entidad, payload, fecha)
       VALUES ($1,$2,$3,$4,NOW())`,
      usuarioId,
      accion,
      entidad,
      payload ? JSON.stringify(payload) : null,
    )
  } catch (err) {
    console.error('audit log error:', err)
  }
}
