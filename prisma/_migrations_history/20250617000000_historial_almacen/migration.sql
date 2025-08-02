-- CreateTable
CREATE TABLE "HistorialAlmacen" (
    "id" SERIAL NOT NULL,
    "almacenId" INTEGER NOT NULL,
    "descripcion" TEXT,
    "estado" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    CONSTRAINT "HistorialAlmacen_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistorialAlmacen" ADD CONSTRAINT "HistorialAlmacen_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HistorialAlmacen" ADD CONSTRAINT "HistorialAlmacen_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
