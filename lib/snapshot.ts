import prisma from './prisma'

export async function createMaterialSnapshot(id: number, usuarioId?: number) {
  const material = await prisma.material.findUnique({
    where: { id },
    include: {
      archivos: { select: { id: true, nombre: true, archivoNombre: true } },
      unidades: { select: { id: true, nombre: true, codigoQR: true } },
    },
  })
  if (!material) return
  await prisma.snapshotMaterial.create({
    data: { materialId: id, usuarioId, data: material as any },
  })
}

export async function createUnidadSnapshot(id: number, usuarioId?: number) {
  const unidad = await prisma.materialUnidad.findUnique({
    where: { id },
    include: {
      archivos: { select: { id: true, nombre: true, archivoNombre: true } },
      material: { select: { id: true, nombre: true } },
    },
  })
  if (!unidad) return
  await prisma.snapshotUnidad.create({
    data: { unidadId: id, usuarioId, data: unidad as any },
  })
}
