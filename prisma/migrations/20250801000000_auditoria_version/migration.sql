-- Agrega columna version para auditorias
ALTER TABLE "Auditoria" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;
