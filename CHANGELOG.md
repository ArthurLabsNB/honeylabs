# Changelog
## 0.2.87
- Creamos la vista de inventario con doble panel para gestionar materiales.
- Reutilizamos el formulario de detalle para editar materiales seleccionados.
- Agregamos filtros, ordenamiento y acciones rápidas en la lista.
- Incluimos botones de guardar, cancelar y duplicar en el editor.
## 0.2.86

- Actualizamos la vista de almacenes para que las imágenes usen `w-24` y `h-24` con `object-cover`, adaptándose mejor a pantallas pequeñas.
- Añadí `sizes` en todas las imágenes para optimizar la carg
- Reemplazamos medidas fijas por variables CSS en el dashboard.
- Definimos valores con `clamp()` para adaptar el la

## 0.2.85
- Implementé redirección automática al login cuando no hay sesión.
- Ajusté el layout para validar la autenticación en todas las vistas.
## 0.2.86
- Mejoré el responsive agregando breakpoints de 768px y 1024px.
- Ajusté los paddings de navbar y sidebars para tablets y pantallas amplias.
## 0.2.84
- Mostramos un estado con badge en las tarjetas de almacenes.
- Añadimos opción para marcar favoritos y guardamos la preferencia.
## 0.2.83
- Añadí controles de subir y bajar en las tarjetas para ordenar almacenes.
## 0.2.82
- Ajusté las rutas de perfil para resolver el alias de `http`.
## 0.2.81
- Mejoré los logs del backend y unifiqué las respuestas de error.
- Ajusté `/api/perfil` y la ruta de foto para mayor estabilidad.
- Corregí la carga de la imagen de perfil en el menú de usuario.
## 0.2.80
- Añadimos pruebas de login y registro con mocks de Prisma.
- Documentamos cómo ejecutar las pruebas.
## 0.2.78
- Registramos el proceso de alta con el nuevo logger y unificamos los mensajes de error.
## 0.2.77
- Añadimos un sistema de logging configurable con `LOG_LEVEL`.
## 0.2.76
- Corregimos un 404 al consultar `/api/perfil`.

## 0.2.75
- Añadimos `vitest.config.ts` para resolver alias en las pruebas.
## 0.2.73
- Permitimos scripts de analytics de Vercel en la CSP.
## 0.2.72
- Ordenamos los almacenes por ID para evitar fallos al consultar la lista.
## 0.2.71
- Evitamos un error 500 en `/api/almacenes` cuando el usuario no tiene almacenes.
## 0.2.70
- Guardamos el orden de los almacenes por usuario.
- Se creó el endpoint `/api/almacenes/orden` para actualizarlo.
## 0.2.69
- Reemplazamos el emoji de notificaciones por una etiqueta con conteo.
- El listado de almacenes indica cuántas alertas no se han leído.
## 0.2.68
- Añadimos animaciones al arrastrar almacenes para mejor feedback visual.
## 0.2.67
- Ajustamos las clases `md` y `xl` en los grids principales para mejor distribucion en pantallas medianas y grandes.
## 0.2.66
- Movemos almacenes con las flechas del teclado y enter abre el seleccionado.
## 0.2.63
- Unificamos la carga de almacenes con un hook que refresca cada diez segundos.
## 0.2.64
- Extraemos la lógica de la página de almacenes a un nuevo hook de utilidad.
## 0.2.65
- Reorganizamos los renderizadores de almacenes en componentes separados y añadimos un botón flotante reutilizable.
## 0.2.62
- Mostramos un estado vacío con opciones para crear o conectar almacenes.
## 0.2.61
- Incluimos un nuevo componente de carga y lo usamos en diversas vistas.
## 0.2.60
- Reemplazamos alertas por notificaciones emergentes reutilizables.
- Las eliminaciones ahora solicitan confirmación en pantalla.
- Añadimos avisos de éxito y error en las operaciones.
## 0.2.59
- Sincronizamos el avatar del usuario en tiempo real.
- Almacenes guardan sus imágenes en la base de datos.
- Servimos imágenes con cabeceras ETag para mejor caché.
## 0.2.58
- Guardamos imágenes en base64 cuando no es posible escribir archivos.
## 0.2.57
- Permitimos eliminar almacenes junto con sus registros relacionados.
- Las imágenes editadas ahora reemplazan correctamente la anterior.
- Añadimos un formulario de operaciones para entradas y salidas.
- El listado de almacenes se actualiza cada diez segundos.
- Mostramos el inventario con un estilo más destacado.
## 0.2.56
- Muestra el correo del creador en las tarjetas de almacenes.
- Añadimos la fecha de última actualización en la vista de un almacén.
- Subir una nueva imagen al editar almacenes ya no arroja error.
- Reordenar almacenes ahora tiene animación suave.
- Botones de editar y borrar renovados con íconos.
## 0.2.55

- Corregimos la página de almacenes moviendo los hooks antes de los retornos
  condicionales.
## 0.2.54

- Evitamos errores de Next Image usando `<img>` para los avatares dinámicos.
## 0.2.53

- Habilitamos carga de archivos para las imágenes de los almacenes.
- Incrementamos ligeramente el tamaño visual de las tarjetas.
## 0.2.52

- Imágenes actualizadas a `<Image>` de Next.js para un mejor rendimiento.
- Manejadores de arrastre y eventos memoizados con `useCallback`.
## 0.2.51

- Reimplementación de arrastre sin dependencias externas para evitar errores de compilación.
## 0.2.50

- Vista de almacenes rediseñada en forma de tarjetas con imagen destacada.
- Campos de imagen añadidos al crear y editar almacenes.
- Ordenamiento de la lista ahora se realiza mediante arrastrar y soltar.
## 0.2.49

- Nuevo archivo `README_ARCHIVOS.md` con análisis detallado del proyecto.

## 0.2.48

- Corrección para que el menú de **Herramientas** se cierre sin reabrirse al volver a pulsar el botón.
- Ancho del sidebar de herramientas reducido ligeramente.
- Eliminado el espacio superior del buscador y fondo con transparencia y blur.

## 0.2.47

- El botón de **Herramientas** ahora cierra el menú al pulsarlo nuevamente.

## 0.2.46

- Colores y estilo del sidebar de herramientas ahora coinciden con el dashboard.
- Se agregó separación entre ambos sidebars para un efecto flotante.
- Botones del sidebar principal reducidos y alineados al texto.

## 0.2.45

- Ajustados los tamaños de iconos y botones en ambos sidebars.
- Nuevo diseño flotante claro para el sidebar de herramientas.
- El botón de Dashboard solo se resalta en su ruta.
- El contenido ahora se desplaza cuando el sidebar de herramientas está abierto.

## 0.2.44

- Botones de Almacenes integrados en el menú de herramientas.
- Eliminado el sidebar de almacenes.
- Sidebar principal usa el estilo de almacenes.
- Botón de herramientas renombrado.
- Sidebar de herramientas flota y se cierra al hacer clic fuera.

## 0.2.43

- Nuevo botón **Herramientas e Integraciones** con buscador y submenú para alertas, plantillas, network, app center y billing.

## 0.2.42

- Corrección de importación para `SIDEBAR_ALMACENES_WIDTH` en `AlmacenSidebar`.

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
