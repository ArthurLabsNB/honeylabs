-- CreateTable
CREATE TABLE "Auditoria" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "almacenId" INTEGER,
    "materialId" INTEGER,
    "unidadId" INTEGER,
    "observaciones" TEXT,
    "categoria" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoAuditoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "archivo" BYTEA,
    "archivoNombre" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auditoriaId" INTEGER NOT NULL,
    "subidoPorId" INTEGER,
    CONSTRAINT "ArchivoAuditoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "MaterialUnidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ArchivoAuditoria" ADD CONSTRAINT "ArchivoAuditoria_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "Auditoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArchivoAuditoria" ADD CONSTRAINT "ArchivoAuditoria_subidoPorId_fkey" FOREIGN KEY ("subidoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
