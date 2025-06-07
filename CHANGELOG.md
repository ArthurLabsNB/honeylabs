# Changelog
## 0.2.29

- Se añadieron placeholders para inventario, operaciones, reportes, archivos, configuracion y ayuda.

## 0.2.30

- Sidebar de almacenes simplificado con las nuevas categorías principales.

## 0.2.28

- Eliminada la pizarra y sus controles.
- Removido el modo de pantalla completa y la barra lateral asociada.
- Ajustes de estilo en las vistas de almacén para evitar desalineaciones.

## 0.2.27

- NAVBAR_HEIGHT se exporta y aplica en todos los layouts del dashboard para mantener una altura consistente.

## 0.2.26

- Páginas del dashboard ahora consultan la sesión con `useSession`.
- Se eliminaron estados innecesarios de carga y error.

## 0.2.25

- Componentes de almacenes ahora usan `useSession` para obtener al usuario.
- Se eliminó la lógica duplicada de carga en dichos componentes.
- Removed local honeylabs dependency from package.json.
- Contenido de la pizarra guardado como JSON para evitar inyección.
- Carga de datos compatible con entradas antiguas en HTML.
- Corrección en Sidebar para marcar solo la ruta actual como activa.
- El middleware ahora detecta la cookie de sesión usando `SESSION_COOKIE`.
- `JWT_SECRET` es obligatorio en la ruta `/api/novedades`.

## 0.2.24

- Sidebar global ahora puede ocultarse desde el navbar.
- Navbar muestra "HoneyLabs" y el plan activo.
- UserMenu usa avatar redondo como en la página de inicio.

## 0.2.23

- Ajustes en permisos para permitir crear almacenes a cuentas no vinculadas.
- El endpoint `/api/almacenes` ahora crea una entidad por defecto si falta.
- `getUsuarioFromSession` retorna plan y roles para validar permisos.

## 0.2.15

- Nuevas rutas para generar y validar codigos de acceso.
- Hook `usePermisos` para combinar permisos en frontend.
- Endpoint `/api/admin/usuarios` para listar usuarios.

## 0.2.16

- Campos de permisos ahora usan tipo JSON en la base de datos.
- Migración `20250606010000_json_permisos_update` aplicada.

## 0.2.17

- Limpieza automática de datos legacy en el login.

## 0.2.14

- Se añadió el campo `esSuperAdmin` en el modelo `Usuario`.
- Actualización de valores legacy `estandar` a `individual` en todo el código.
- Nueva migración `20250606000000_tipo_cuenta_update` para ajustar datos existentes.
