/*
  Warnings:

  - You are about to alter the column `rolAsignado` on the `CodigoAlmacen` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `rolEnAlmacen` on the `UsuarioAlmacen` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "CodigoAlmacen" ALTER COLUMN "rolAsignado" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "archivoBuffer" BYTEA,
ADD COLUMN     "archivoNombre" TEXT,
ADD COLUMN     "codigoUsado" TEXT;

-- AlterTable
ALTER TABLE "UsuarioAlmacen" ALTER COLUMN "rolEnAlmacen" SET DATA TYPE VARCHAR(50);
