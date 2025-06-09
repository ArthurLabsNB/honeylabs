-- DropForeignKey
ALTER TABLE "ArchivoMaterial" DROP CONSTRAINT "ArchivoMaterial_materialId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialLote" DROP CONSTRAINT "HistorialLote_materialId_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_almacenId_fkey";

-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "fechaActualizacion" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoMaterial" ADD CONSTRAINT "ArchivoMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialLote" ADD CONSTRAINT "HistorialLote_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
