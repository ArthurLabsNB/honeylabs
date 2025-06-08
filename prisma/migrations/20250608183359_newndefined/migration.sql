-- AlterTable
ALTER TABLE "Almacen" ALTER COLUMN "imagenNombre" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "esSuperAdmin" DROP NOT NULL;
