-- CreateTable
CREATE TABLE "MaterialUnidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "materialId" INTEGER NOT NULL,
    CONSTRAINT "MaterialUnidad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaterialUnidad" ADD CONSTRAINT "MaterialUnidad_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "MaterialUnidad_materialId_nombre_key" ON "MaterialUnidad"("materialId", "nombre");
