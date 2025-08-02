-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "codigo2FASecret" TEXT,
ADD COLUMN     "fotoPerfil" BYTEA,
ADD COLUMN     "fotoPerfilNombre" TEXT,
ADD COLUMN     "metodo2_fa" TEXT,
ADD COLUMN     "preferencias" TEXT,
ADD COLUMN     "tiene2_fa" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "BitacoraCambioPerfil" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "cambios" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BitacoraCambioPerfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SesionUsuario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaUltima" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SesionUsuario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BitacoraCambioPerfil" ADD CONSTRAINT "BitacoraCambioPerfil_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SesionUsuario" ADD CONSTRAINT "SesionUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
