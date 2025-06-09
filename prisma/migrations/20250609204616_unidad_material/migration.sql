-- DropForeignKey
ALTER TABLE "MaterialUnidad" DROP CONSTRAINT "MaterialUnidad_materialId_fkey";

-- AddForeignKey
ALTER TABLE "MaterialUnidad" ADD CONSTRAINT "MaterialUnidad_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
