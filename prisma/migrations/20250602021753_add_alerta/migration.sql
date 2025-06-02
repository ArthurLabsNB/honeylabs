-- CreateEnum
CREATE TYPE "PrioridadAlerta" AS ENUM ('ALTA', 'MEDIA', 'BAJA');

-- CreateTable
CREATE TABLE "Alerta" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prioridad" "PrioridadAlerta" NOT NULL DEFAULT 'MEDIA',
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "tipo" TEXT,
    "almacenId" INTEGER NOT NULL,

    CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
