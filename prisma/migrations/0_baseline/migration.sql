-- CreateEnum
CREATE TYPE "PrioridadAlerta" AS ENUM ('ALTA', 'MEDIA', 'BAJA');

-- CreateEnum
CREATE TYPE "NotaTipo" AS ENUM ('imagen', 'url', 'doc', 'sticky');

-- CreateTable
CREATE TABLE "plan" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION,
    "periodicidad" TEXT,
    "limites" TEXT,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suscripcion" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "entidad_id" INTEGER,
    "plan_id" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Suscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "correoContacto" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plan_id" INTEGER,

    CONSTRAINT "Entidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "googleId" TEXT,
    "tipo_cuenta" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entidad_id" INTEGER,
    "archivoBuffer" BYTEA,
    "archivoNombre" TEXT,
    "codigoUsado" TEXT,
    "plan_id" INTEGER,
    "codigo2FASecret" TEXT,
    "fotoPerfil" BYTEA,
    "fotoPerfilNombre" TEXT,
    "metodo2_fa" TEXT,
    "preferencias" TEXT,
    "tiene2_fa" BOOLEAN DEFAULT false,
    "esSuperAdmin" BOOLEAN DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BitacoraCambioPerfil" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "cambios" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BitacoraCambioPerfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesion_usuario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaUltima" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SesionUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "permisos" JSONB NOT NULL,
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
    "permisosPredeterminados" JSONB,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entidadId" INTEGER NOT NULL,
    "imagen" BYTEA,
    "imagenNombre" TEXT,

    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodigoAlmacen" (
    "id" SERIAL NOT NULL,
    "almacenId" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "rolAsignado" VARCHAR(50) NOT NULL,
    "permisos" JSONB,
    "usosDisponibles" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaExpiracion" TIMESTAMP(3),
    "creadoPorId" INTEGER,

    CONSTRAINT "CodigoAlmacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimiento" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT,
    "almacenId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "contexto" JSONB,

    CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialAlmacen" (
    "id" SERIAL NOT NULL,
    "almacenId" INTEGER NOT NULL,
    "descripcion" TEXT,
    "estado" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,

    CONSTRAINT "HistorialAlmacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoAlmacen" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "tipo" TEXT,
    "archivoUrl" TEXT,
    "almacenId" INTEGER NOT NULL,
    "creadoPorId" INTEGER NOT NULL,

    CONSTRAINT "EventoAlmacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NovedadAlmacen" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "almacenId" INTEGER NOT NULL,
    "creadoPorId" INTEGER NOT NULL,

    CONSTRAINT "NovedadAlmacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "tipo" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "almacenId" INTEGER,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentoAlmacen" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT,
    "almacenId" INTEGER NOT NULL,
    "subidoPorId" INTEGER NOT NULL,

    CONSTRAINT "DocumentoAlmacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incidencia" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'abierta',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "almacenId" INTEGER NOT NULL,
    "creadaPorId" INTEGER NOT NULL,
    "resueltaPorId" INTEGER,
    "fechaResuelta" TIMESTAMP(3),

    CONSTRAINT "Incidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prioridad" "PrioridadAlerta" NOT NULL DEFAULT 'MEDIA',
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "tipo" TEXT,
    "almacenId" INTEGER NOT NULL,

    CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "miniatura" BYTEA,
    "miniaturaNombre" TEXT,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "unidad" TEXT,
    "lote" TEXT,
    "fechaCaducidad" TIMESTAMP(3),
    "ubicacion" TEXT,
    "proveedor" TEXT,
    "estado" TEXT,
    "observaciones" TEXT,
    "minimo" DOUBLE PRECISION,
    "maximo" DOUBLE PRECISION,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "almacenId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "codigoBarra" TEXT,
    "codigoQR" TEXT,
    "reorderLevel" INTEGER,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoMaterial" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "archivo" BYTEA,
    "archivoNombre" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "materialId" INTEGER NOT NULL,
    "subidoPorId" INTEGER,

    CONSTRAINT "ArchivoMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoUnidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "archivo" BYTEA,
    "archivoNombre" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unidadId" INTEGER NOT NULL,
    "subidoPorId" INTEGER,

    CONSTRAINT "ArchivoUnidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialLote" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "lote" TEXT,
    "descripcion" TEXT,
    "ubicacion" TEXT,
    "cantidad" DOUBLE PRECISION,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    "estado" JSONB,

    CONSTRAINT "HistorialLote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialUnidad" (
    "id" SERIAL NOT NULL,
    "unidadId" INTEGER NOT NULL,
    "descripcion" TEXT,
    "estado" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,

    CONSTRAINT "HistorialUnidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialUnidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "materialId" INTEGER NOT NULL,
    "codigoQR" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "internoId" TEXT,
    "serie" TEXT,
    "codigoBarra" TEXT,
    "lote" TEXT,
    "qrGenerado" TEXT,
    "unidadMedida" TEXT,
    "peso" DOUBLE PRECISION,
    "volumen" DOUBLE PRECISION,
    "alto" DOUBLE PRECISION,
    "largo" DOUBLE PRECISION,
    "ancho" DOUBLE PRECISION,
    "color" TEXT,
    "temperatura" TEXT,
    "estado" TEXT,
    "ubicacionExacta" TEXT,
    "area" TEXT,
    "subcategoria" TEXT,
    "riesgo" TEXT,
    "disponible" BOOLEAN,
    "asignadoA" TEXT,
    "fechaIngreso" TIMESTAMP(3),
    "fechaModificacion" TIMESTAMP(3),
    "fechaCaducidad" TIMESTAMP(3),
    "fechaInspeccion" TIMESTAMP(3),
    "fechaBaja" TIMESTAMP(3),
    "responsableIngreso" TEXT,
    "modificadoPor" TEXT,
    "proyecto" TEXT,
    "observaciones" TEXT,
    "imagen" BYTEA,
    "imagenNombre" TEXT,

    CONSTRAINT "MaterialUnidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoMaterial" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT,
    "materialId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "contexto" JSONB,

    CONSTRAINT "MovimientoMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatCanal" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatCanal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMensaje" (
    "id" SERIAL NOT NULL,
    "canalId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "texto" TEXT,
    "archivo" TEXT,
    "archivoNombre" TEXT,
    "archivoTipo" TEXT,
    "anclado" BOOLEAN NOT NULL DEFAULT false,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMensaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeBreakout" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeBreakout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeFlappyBee" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "distancia" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeFlappyBee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeMario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeMario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajePacman" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajePacman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajePingPong" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "rondas" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajePingPong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeSnake" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "longitud" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeSnake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeSpaceShooter" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "enemigos" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeSpaceShooter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeTetris" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "lineas" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeTetris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "payload" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" SERIAL NOT NULL,
    "tabId" TEXT NOT NULL,
    "tipo" "NotaTipo" NOT NULL,
    "contenido" TEXT NOT NULL,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" SERIAL NOT NULL,
    "folio" TEXT NOT NULL,
    "clienteId" INTEGER,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'MXN',
    "pdf" BYTEA,
    "xml" BYTEA,
    "ublJson" JSONB,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacturaItem" (
    "id" SERIAL NOT NULL,
    "facturaId" INTEGER NOT NULL,
    "materialId" INTEGER,
    "unidadId" INTEGER,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FacturaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaccion" (
    "id" SERIAL NOT NULL,
    "facturaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodo" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "referencia" TEXT,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "facturaId" INTEGER,
    "usuarioId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detalle" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "almacenId" INTEGER,
    "materialId" INTEGER,
    "unidadId" INTEGER,
    "observaciones" TEXT,
    "categoria" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoReporte" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "archivo" BYTEA,
    "archivoNombre" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporteId" INTEGER NOT NULL,
    "subidoPorId" INTEGER,

    CONSTRAINT "ArchivoReporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "almacenId" INTEGER,
    "materialId" INTEGER,
    "unidadId" INTEGER,
    "observaciones" TEXT,
    "categoria" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoAuditoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "archivo" BYTEA,
    "archivoNombre" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auditoriaId" INTEGER NOT NULL,
    "subidoPorId" INTEGER,

    CONSTRAINT "ArchivoAuditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "rol_usuario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RolToUsuario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "usuario_almacen" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "almacenId" INTEGER NOT NULL,
    "rolEnAlmacen" VARCHAR(50) NOT NULL,
    "permisosExtra" JSONB,

    CONSTRAINT "UsuarioAlmacen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_entidad_plan_id" ON "entidad"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE INDEX "idx_usuario_entidad_id" ON "usuario"("entidad_id");

-- CreateIndex
CREATE UNIQUE INDEX "Almacen_codigoUnico_key" ON "Almacen"("codigoUnico");

-- CreateIndex
CREATE UNIQUE INDEX "CodigoAlmacen_codigo_key" ON "CodigoAlmacen"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialUnidad_codigoQR_key" ON "MaterialUnidad"("codigoQR");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialUnidad_materialId_nombre_key" ON "MaterialUnidad"("materialId", "nombre");

-- CreateIndex
CREATE INDEX "ChatMensaje_canalId_idx" ON "ChatMensaje"("canalId");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_folio_key" ON "Factura"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "Auditoria_tipo_almacenId_materialId_unidadId_version_key" ON "Auditoria"("tipo", "almacenId", "materialId", "unidadId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "_RolToUsuario_B_index" ON "rol_usuario"("B");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioAlmacen_usuarioId_almacenId_key" ON "usuario_almacen"("usuarioId", "almacenId");

-- AddForeignKey
ALTER TABLE "suscripcion" ADD CONSTRAINT "Suscripcion_entidadId_fkey" FOREIGN KEY ("entidad_id") REFERENCES "entidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripcion" ADD CONSTRAINT "Suscripcion_planId_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripcion" ADD CONSTRAINT "Suscripcion_usuarioId_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entidad" ADD CONSTRAINT "entidad_plan_fk" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_entidad_fk" FOREIGN KEY ("entidad_id") REFERENCES "entidad"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_plan_fk" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "BitacoraCambioPerfil" ADD CONSTRAINT "BitacoraCambioPerfil_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesion_usuario" ADD CONSTRAINT "SesionUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rol" ADD CONSTRAINT "Rol_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "entidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Almacen" ADD CONSTRAINT "Almacen_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "entidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodigoAlmacen" ADD CONSTRAINT "CodigoAlmacen_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialAlmacen" ADD CONSTRAINT "HistorialAlmacen_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialAlmacen" ADD CONSTRAINT "HistorialAlmacen_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoAlmacen" ADD CONSTRAINT "EventoAlmacen_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoAlmacen" ADD CONSTRAINT "EventoAlmacen_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NovedadAlmacen" ADD CONSTRAINT "NovedadAlmacen_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NovedadAlmacen" ADD CONSTRAINT "NovedadAlmacen_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoAlmacen" ADD CONSTRAINT "DocumentoAlmacen_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoAlmacen" ADD CONSTRAINT "DocumentoAlmacen_subidoPorId_fkey" FOREIGN KEY ("subidoPorId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_creadaPorId_fkey" FOREIGN KEY ("creadaPorId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_resueltaPorId_fkey" FOREIGN KEY ("resueltaPorId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoMaterial" ADD CONSTRAINT "ArchivoMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoMaterial" ADD CONSTRAINT "ArchivoMaterial_subidoPorId_fkey" FOREIGN KEY ("subidoPorId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoUnidad" ADD CONSTRAINT "ArchivoUnidad_subidoPorId_fkey" FOREIGN KEY ("subidoPorId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoUnidad" ADD CONSTRAINT "ArchivoUnidad_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "MaterialUnidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialLote" ADD CONSTRAINT "HistorialLote_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialLote" ADD CONSTRAINT "HistorialLote_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialUnidad" ADD CONSTRAINT "HistorialUnidad_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "MaterialUnidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialUnidad" ADD CONSTRAINT "HistorialUnidad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialUnidad" ADD CONSTRAINT "MaterialUnidad_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoMaterial" ADD CONSTRAINT "MovimientoMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoMaterial" ADD CONSTRAINT "MovimientoMaterial_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMensaje" ADD CONSTRAINT "ChatMensaje_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "ChatCanal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMensaje" ADD CONSTRAINT "ChatMensaje_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeBreakout" ADD CONSTRAINT "PuntajeBreakout_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeFlappyBee" ADD CONSTRAINT "PuntajeFlappyBee_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeMario" ADD CONSTRAINT "PuntajeMario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajePacman" ADD CONSTRAINT "PuntajePacman_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajePingPong" ADD CONSTRAINT "PuntajePingPong_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeSnake" ADD CONSTRAINT "PuntajeSnake_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeSpaceShooter" ADD CONSTRAINT "PuntajeSpaceShooter_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeTetris" ADD CONSTRAINT "PuntajeTetris_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaItem" ADD CONSTRAINT "FacturaItem_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaItem" ADD CONSTRAINT "FacturaItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaItem" ADD CONSTRAINT "FacturaItem_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "MaterialUnidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "MaterialUnidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoReporte" ADD CONSTRAINT "ArchivoReporte_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoReporte" ADD CONSTRAINT "ArchivoReporte_subidoPorId_fkey" FOREIGN KEY ("subidoPorId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "MaterialUnidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoAuditoria" ADD CONSTRAINT "ArchivoAuditoria_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "Auditoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoAuditoria" ADD CONSTRAINT "ArchivoAuditoria_subidoPorId_fkey" FOREIGN KEY ("subidoPorId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_usuario" ADD CONSTRAINT "_RolToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_usuario" ADD CONSTRAINT "_RolToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_almacen" ADD CONSTRAINT "UsuarioAlmacen_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_almacen" ADD CONSTRAINT "UsuarioAlmacen_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

