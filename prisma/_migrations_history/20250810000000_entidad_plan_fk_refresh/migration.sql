-- Normalize entidad.plan_id and refresh FK
ALTER TABLE IF EXISTS "Entidad" RENAME TO entidad;

ALTER TABLE entidad
  RENAME COLUMN IF EXISTS "planId" TO plan_id;

ALTER TABLE entidad
  DROP CONSTRAINT IF EXISTS "Entidad_planId_fkey",
  DROP CONSTRAINT IF EXISTS entidad_plan_fk,
  DROP CONSTRAINT IF EXISTS entidad_plan_id_fkey;

ALTER TABLE entidad
  ADD CONSTRAINT entidad_plan_fk
  FOREIGN KEY (plan_id)
  REFERENCES plan(id) ON DELETE SET NULL;
