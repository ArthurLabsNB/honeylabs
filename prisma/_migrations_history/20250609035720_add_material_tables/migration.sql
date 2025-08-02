-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "miniatura" BYTEA,
    "miniaturaNombre" TEXT,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "unidad" TEXT NOT NULL,
    "lote" TEXT,
    "fechaCaducidad" TIMESTAMP(3),
    "ubicacion" TEXT,
    "proveedor" TEXT,
    "estado" TEXT,
    "observaciones" TEXT,
    "minimo" DOUBLE PRECISION,
    "maximo" DOUBLE PRECISION,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "almacenId" INTEGER NOT NULL,
    "usuarioId" INTEGER,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoMaterial" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "archivo" BYTEA,
    "archivoNombre" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "materialId" INTEGER NOT NULL,
    "subidoPorId" INTEGER,

    CONSTRAINT "ArchivoMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialLote" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "lote" TEXT,
    "descripcion" TEXT,
    "ubicacion" TEXT,
    "cantidad" DOUBLE PRECISION,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,

    CONSTRAINT "HistorialLote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoMaterial" ADD CONSTRAINT "ArchivoMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoMaterial" ADD CONSTRAINT "ArchivoMaterial_subidoPorId_fkey" FOREIGN KEY ("subidoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialLote" ADD CONSTRAINT "HistorialLote_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialLote" ADD CONSTRAINT "HistorialLote_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
