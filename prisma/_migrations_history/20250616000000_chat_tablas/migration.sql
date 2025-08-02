-- CreateTable
CREATE TABLE "ChatCanal" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatCanal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMensaje" (
    "id" SERIAL NOT NULL,
    "canalId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "texto" TEXT,
    "archivo" TEXT,
    "archivoNombre" TEXT,
    "archivoTipo" TEXT,
    "anclado" BOOLEAN NOT NULL DEFAULT false,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMensaje_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatMensaje_canalId_idx" ON "ChatMensaje"("canalId");

-- AddForeignKey
ALTER TABLE "ChatMensaje" ADD CONSTRAINT "ChatMensaje_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "ChatCanal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMensaje" ADD CONSTRAINT "ChatMensaje_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
