-- Normalize usuario.tipoCuenta to snake case
ALTER TABLE "usuario" RENAME COLUMN "tipoCuenta" TO tipo_cuenta;
