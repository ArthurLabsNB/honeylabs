import prisma from '../lib/prisma'
import { emitEvent } from '../src/lib/events'

async function run() {
  await prisma.$connect()
  const materiales = await prisma.material.findMany({
    where: { reorderLevel: { not: null } },
    select: { id: true, nombre: true, almacenId: true, cantidad: true, reorderLevel: true },
  })
  for (const m of materiales) {
    if (m.reorderLevel === null || m.cantidad >= (m.reorderLevel ?? 0)) continue
    await prisma.alerta.upsert({
      where: { materialId: m.id },
      update: { activa: true },
      create: {
        materialId: m.id,
        almacenId: m.almacenId,
        mensaje: `Reordenar ${m.nombre}`,
        activa: true,
      },
    })
    emitEvent({ type: 'reorder', payload: { materialId: m.id } })
  }
  await prisma.$disconnect()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
