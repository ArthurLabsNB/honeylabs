-- CreateTable
CREATE TABLE "Entidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "correoContacto" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "googleId" TEXT,
    "tipoCuenta" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entidadId" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "permisos" TEXT NOT NULL,
    "entidadId" INTEGER,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Almacen" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagenUrl" TEXT,
    "codigoUnico" TEXT NOT NULL,
    "funciones" TEXT,
    "permisosPredeterminados" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entidadId" INTEGER NOT NULL,

    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioAlmacen" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "almacenId" INTEGER NOT NULL,
    "rolEnAlmacen" TEXT NOT NULL,
    "permisosExtra" TEXT,

    CONSTRAINT "UsuarioAlmacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodigoAlmacen" (
    "id" SERIAL NOT NULL,
    "almacenId" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "rolAsignado" TEXT NOT NULL,
    "permisos" TEXT,
    "usosDisponibles" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaExpiracion" TIMESTAMP(3),
    "creadoPorId" INTEGER,

    CONSTRAINT "CodigoAlmacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RolToUsuario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RolToUsuario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Almacen_codigoUnico_key" ON "Almacen"("codigoUnico");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioAlmacen_usuarioId_almacenId_key" ON "UsuarioAlmacen"("usuarioId", "almacenId");

-- CreateIndex
CREATE UNIQUE INDEX "CodigoAlmacen_codigo_key" ON "CodigoAlmacen"("codigo");

-- CreateIndex
CREATE INDEX "_RolToUsuario_B_index" ON "_RolToUsuario"("B");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "Entidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rol" ADD CONSTRAINT "Rol_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "Entidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Almacen" ADD CONSTRAINT "Almacen_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "Entidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioAlmacen" ADD CONSTRAINT "UsuarioAlmacen_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioAlmacen" ADD CONSTRAINT "UsuarioAlmacen_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodigoAlmacen" ADD CONSTRAINT "CodigoAlmacen_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolToUsuario" ADD CONSTRAINT "_RolToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolToUsuario" ADD CONSTRAINT "_RolToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
