-- CreateTable
CREATE TABLE "Reporte" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "almacenId" INTEGER,
    "materialId" INTEGER,
    "unidadId" INTEGER,
    "observaciones" TEXT,
    "categoria" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoReporte" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "archivo" BYTEA,
    "archivoNombre" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporteId" INTEGER NOT NULL,
    "subidoPorId" INTEGER,
    CONSTRAINT "ArchivoReporte_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "MaterialUnidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ArchivoReporte" ADD CONSTRAINT "ArchivoReporte_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArchivoReporte" ADD CONSTRAINT "ArchivoReporte_subidoPorId_fkey" FOREIGN KEY ("subidoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
