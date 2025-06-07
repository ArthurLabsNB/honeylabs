# Changelog
## 0.2.41

- Ajustes de layout para que el contenido ocupe el ancho disponible entre los sidebars.

## 0.2.40

- Eliminado el navbar de almacenes.
- Sidebar de almacenes alineado a la misma altura que el del dashboard.
- Se muestra el plan de la cuenta al inicio del sidebar.

## 0.2.39

- Posicionamiento del navbar de almacenes alineado con el sidebar y altura expuesta como variable CSS.

## 0.2.38

- Navbar de almacenes simplificado con botón de creación y conexión.

## 0.2.37

- Corrección de la posición del navbar de almacenes para que quede debajo del dashboard y alineado con los sidebars.

## 0.2.36

- Navbar de almacenes permanece fijo debajo del navbar principal.
- CSP actualizada para permitir imágenes `blob:`.

## 0.2.35

- Navbar de almacenes se oculta al ver un almacén.
- Solo se muestra la barra del almacén con botón de retorno.

## 0.2.34

- Los navbars y sidebars del dashboard y de almacenes se ocultan al entrar a un almacén.
- Se muestra una barra superior del almacén con opción para volver.

## 0.2.33

- Unificado el sidebar de almacenes eliminando el modo "detalle".

## 0.2.32

- Eliminado el sidebar duplicado en las páginas de detalle de almacenes.

## 0.2.31

- Rediseño del sidebar de almacenes y corrección de la navegación para mantener visibles los navbars y sidebars.

## 0.2.30

- Sidebar de almacenes simplificado con las nuevas categorías principales.

## 0.2.29

- Se añadieron placeholders para inventario, operaciones, reportes, archivos, configuracion y ayuda.

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
