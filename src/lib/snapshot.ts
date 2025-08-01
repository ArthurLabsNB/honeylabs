export interface SnapshotDb {
  almacen: {
    findUnique(args: {
      where: { id: number }
      select: {
        nombre: true
        descripcion: true
        imagen: true
        imagenNombre: true
        imagenUrl: true
        codigoUnico: true
      }
    }): Promise<{
      nombre: string
      descripcion: string | null
      imagen: Buffer | null
      imagenNombre: string | null
      imagenUrl: string | null
      codigoUnico: string | null
    } | null>
  }
  historialAlmacen: {
    create(args: {
      data: {
        almacenId: number
        usuarioId: number
        descripcion: string
        estado: any
      }
    }): Promise<void>
  }
  material: {
    findUnique(args: {
      where: { id: number }
      include: {
        archivos: {
          select: {
            nombre: true
            archivoNombre: true
            archivo: true
          }
        }
      }
    }): Promise<{
      miniatura: Buffer | null
      archivos: {
        nombre: string
        archivoNombre: string
        archivo: Buffer | null
      }[]
      lote: string | null
      ubicacion: string | null
      cantidad: number | null
    } | null>
  }
  historialLote: {
    create(args: {
      data: {
        materialId: number
        usuarioId: number
        descripcion: string
        lote: string | null
        ubicacion: string | null
        cantidad: number | null
        estado: any
      }
    }): Promise<void>
  }
  materialUnidad: {
    findUnique(args: {
      where: { id: number }
      include: {
        archivos: {
          select: {
            nombre: true
            archivoNombre: true
            archivo: true
          }
        }
      }
    }): Promise<{
      imagen: Buffer | null
      archivos: {
        nombre: string
        archivoNombre: string
        archivo: Buffer | null
      }[]
    } | null>
  }
  historialUnidad: {
    create(args: {
      data: {
        unidadId: number
        usuarioId: number
        descripcion: string
        estado: any
      }
    }): Promise<void>
  }
}

export async function snapshotAlmacen(
  db: SnapshotDb,
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
  db: SnapshotDb,
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
  db: SnapshotDb,
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
  await db.historialUnidad.create({
    data: { unidadId, usuarioId, descripcion, estado },
  })
}

