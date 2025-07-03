-- CreateTable
CREATE TABLE "HistorialUnidad" (
    "id" SERIAL NOT NULL,
    "unidadId" INTEGER NOT NULL,
    "descripcion" TEXT,
    "estado" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    CONSTRAINT "HistorialUnidad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistorialUnidad" ADD CONSTRAINT "HistorialUnidad_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "MaterialUnidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HistorialUnidad" ADD CONSTRAINT "HistorialUnidad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
