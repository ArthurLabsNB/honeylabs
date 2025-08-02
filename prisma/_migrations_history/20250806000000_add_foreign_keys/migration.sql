-- Añade claves foráneas para relaciones principales
ALTER TABLE "usuario"
  ADD CONSTRAINT "usuario_entidad_id_fkey" FOREIGN KEY ("entidad_id") REFERENCES "entidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "usuario"
  ADD CONSTRAINT "usuario_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "suscripcion"
  ADD CONSTRAINT "suscripcion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "suscripcion"
  ADD CONSTRAINT "suscripcion_entidad_id_fkey" FOREIGN KEY ("entidad_id") REFERENCES "entidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "suscripcion"
  ADD CONSTRAINT "suscripcion_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
