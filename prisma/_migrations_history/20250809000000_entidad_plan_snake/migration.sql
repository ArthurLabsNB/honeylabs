-- Normalize entidad columns for Supabase
ALTER TABLE "entidad" RENAME COLUMN "planId" TO plan_id;
ALTER TABLE "entidad" RENAME COLUMN "correoContacto" TO correo_contacto;
ALTER TABLE "entidad" RENAME COLUMN "fechaCreacion" TO fecha_creacion;

-- Refresh foreign key
ALTER TABLE "entidad" DROP CONSTRAINT IF EXISTS "Entidad_planId_fkey";
ALTER TABLE "entidad" DROP CONSTRAINT IF EXISTS "entidad_planId_fkey";
ALTER TABLE "entidad"
  ADD CONSTRAINT "entidad_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES "plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
