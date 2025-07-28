import type { Prisma, PrismaClient } from '@prisma/client'

export type DB = Prisma.TransactionClient | PrismaClient

export async function snapshotAlmacen(
  db: DB,
  almacenId: number,
  usuarioId: number,
  descripcion: string,
) {
  const almacen = await db.almacen.findUnique({
    where: { id: almacenId },
    select: {
      nombre: true,
      descripcion: true,
      imagen: true,
      imagenNombre: true,
      imagenUrl: true,
      codigoUnico: true,
    },
  })
  const estado = almacen
    ? {
        ...almacen,
        imagen: almacen.imagen
          ? Buffer.from(almacen.imagen as Buffer).toString('base64')
          : null,
      }
    : null
  await db.historialAlmacen.create({
    data: { almacenId, usuarioId, descripcion, estado },
  })
}

export async function snapshotMaterial(
  db: DB,
  materialId: number,
  usuarioId: number,
  descripcion: string,
  opts?: { cantidad?: number | null },
) {
  const material = await db.material.findUnique({
    where: { id: materialId },
    include: {
      archivos: { select: { nombre: true, archivoNombre: true, archivo: true } },
    },
  })
  const estado = material
    ? {
        ...material,
        miniatura: material.miniatura
          ? Buffer.from(material.miniatura as Buffer).toString('base64')
          : null,
        archivos: material.archivos.map((a) => ({
          nombre: a.nombre,
          archivoNombre: a.archivoNombre,
          archivo: a.archivo
            ? Buffer.from(a.archivo as Buffer).toString('base64')
            : null,
        })),
      }
    : null
  await db.historialLote.create({
    data: {
      materialId,
      usuarioId,
      descripcion,
      lote: material?.lote ?? null,
      ubicacion: material?.ubicacion ?? null,
      cantidad: opts?.cantidad ?? material?.cantidad ?? null,
      estado,
    },
  })
}

export async function snapshotUnidad(
  db: DB,
  unidadId: number,
  usuarioId: number,
  descripcion: string,
) {
  const unidad = await db.materialUnidad.findUnique({
    where: { id: unidadId },
    include: { archivos: { select: { nombre: true, archivoNombre: true, archivo: true } } },
  })
  const estado = unidad
    ? {
        ...unidad,
        imagen: unidad.imagen
          ? Buffer.from(unidad.imagen as Buffer).toString('base64')
          : null,
        archivos: unidad.archivos.map((a) => ({
          nombre: a.nombre,
          archivoNombre: a.archivoNombre,
          archivo: a.archivo
            ? Buffer.from(a.archivo as Buffer).toString('base64')
            : null,
        })),
      }
    : null
  // @ts-ignore
  await db.historialUnidad.create({
    data: { unidadId, usuarioId, descripcion, estado },
  })
}

