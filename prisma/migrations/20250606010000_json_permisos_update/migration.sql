-- Convierte campos de permisos a JSON
ALTER TABLE "Rol" ALTER COLUMN "permisos" TYPE JSONB USING "permisos"::jsonb;
ALTER TABLE "Almacen" ALTER COLUMN "permisosPredeterminados" TYPE JSONB USING "permisosPredeterminados"::jsonb;
ALTER TABLE "UsuarioAlmacen" ALTER COLUMN "permisosExtra" TYPE JSONB USING "permisosExtra"::jsonb;
ALTER TABLE "CodigoAlmacen" ALTER COLUMN "permisos" TYPE JSONB USING "permisos"::jsonb;
