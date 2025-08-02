-- CreateIndex
CREATE UNIQUE INDEX "Auditoria_tipo_almacenId_materialId_unidadId_version_key" ON "Auditoria"("tipo", "almacenId", "materialId", "unidadId", "version");
