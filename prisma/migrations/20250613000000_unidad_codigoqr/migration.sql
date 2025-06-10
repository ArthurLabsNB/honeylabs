ALTER TABLE "MaterialUnidad" ADD COLUMN "codigoQR" TEXT NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX "MaterialUnidad_codigoQR_key" ON "MaterialUnidad"("codigoQR");
