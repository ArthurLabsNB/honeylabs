-- Normalize usuario.entidad_id for PostgREST relations
ALTER TABLE "Usuario" DROP CONSTRAINT IF EXISTS "Usuario_entidadId_fkey";
ALTER TABLE "Usuario" RENAME COLUMN "entidadId" TO entidad_id;
ALTER TABLE "Usuario"
  ADD CONSTRAINT "Usuario_entidad_id_fkey" FOREIGN KEY (entidad_id) REFERENCES "Entidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
