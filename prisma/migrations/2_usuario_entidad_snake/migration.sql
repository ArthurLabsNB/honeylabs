-- Renombra columna entidadId a entidad_id y asegura la clave foránea
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'entidadId'
  ) THEN
    ALTER TABLE "usuario" DROP CONSTRAINT IF EXISTS "Usuario_entidadId_fkey";
    ALTER TABLE "usuario" DROP CONSTRAINT IF EXISTS "usuario_entidad_fk";
    ALTER TABLE "usuario" RENAME COLUMN "entidadId" TO entidad_id;
  END IF;
END $$;

ALTER TABLE "usuario"
  ADD CONSTRAINT "usuario_entidad_fk"
  FOREIGN KEY ("entidad_id") REFERENCES "entidad"("id")
  ON DELETE SET NULL ON UPDATE NO ACTION;

CREATE INDEX IF NOT EXISTS "idx_usuario_entidad_id" ON "usuario"("entidad_id");
