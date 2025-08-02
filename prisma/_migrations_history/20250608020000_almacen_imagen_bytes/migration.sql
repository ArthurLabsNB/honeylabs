-- Añade columnas para almacenar imagen en la tabla Almacen
ALTER TABLE "Almacen" ADD COLUMN "imagen" BYTEA;
ALTER TABLE "Almacen" ADD COLUMN "imagenNombre" VARCHAR(255);
