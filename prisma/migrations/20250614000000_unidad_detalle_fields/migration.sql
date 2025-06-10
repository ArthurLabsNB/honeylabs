-- Add columns to MaterialUnidad
ALTER TABLE "MaterialUnidad" ADD COLUMN "internoId" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "serie" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "codigoBarra" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "lote" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "qrGenerado" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "unidadMedida" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "peso" DOUBLE PRECISION;
ALTER TABLE "MaterialUnidad" ADD COLUMN "volumen" DOUBLE PRECISION;
ALTER TABLE "MaterialUnidad" ADD COLUMN "alto" DOUBLE PRECISION;
ALTER TABLE "MaterialUnidad" ADD COLUMN "largo" DOUBLE PRECISION;
ALTER TABLE "MaterialUnidad" ADD COLUMN "ancho" DOUBLE PRECISION;
ALTER TABLE "MaterialUnidad" ADD COLUMN "color" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "temperatura" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "estado" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "ubicacionExacta" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "area" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "subcategoria" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "riesgo" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "disponible" BOOLEAN;
ALTER TABLE "MaterialUnidad" ADD COLUMN "asignadoA" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "fechaIngreso" TIMESTAMP(3);
ALTER TABLE "MaterialUnidad" ADD COLUMN "fechaModificacion" TIMESTAMP(3);
ALTER TABLE "MaterialUnidad" ADD COLUMN "fechaCaducidad" TIMESTAMP(3);
ALTER TABLE "MaterialUnidad" ADD COLUMN "fechaInspeccion" TIMESTAMP(3);
ALTER TABLE "MaterialUnidad" ADD COLUMN "fechaBaja" TIMESTAMP(3);
ALTER TABLE "MaterialUnidad" ADD COLUMN "responsableIngreso" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "modificadoPor" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "proyecto" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "observaciones" TEXT;
ALTER TABLE "MaterialUnidad" ADD COLUMN "imagen" BYTEA;
ALTER TABLE "MaterialUnidad" ADD COLUMN "imagenNombre" TEXT;

-- Create ArchivoUnidad table
CREATE TABLE "ArchivoUnidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "archivo" BYTEA,
    "archivoNombre" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unidadId" INTEGER NOT NULL,
    "subidoPorId" INTEGER,
    CONSTRAINT "ArchivoUnidad_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ArchivoUnidad" ADD CONSTRAINT "ArchivoUnidad_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "MaterialUnidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArchivoUnidad" ADD CONSTRAINT "ArchivoUnidad_subidoPorId_fkey" FOREIGN KEY ("subidoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
