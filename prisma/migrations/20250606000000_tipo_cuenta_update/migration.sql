-- Actualiza valores legacy y agrega campo esSuperAdmin

ALTER TABLE "Usuario" ADD COLUMN "esSuperAdmin" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Usuario" SET "tipoCuenta" = 'individual' WHERE "tipoCuenta" = 'estandar';
