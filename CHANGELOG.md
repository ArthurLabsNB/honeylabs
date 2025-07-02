## 0.2.243
- Añadimos ReactQueryProvider global y manifest PWA.

## 0.2.242
- Registramos el service worker de PWA solo en producción.

## 0.2.240
- Corregimos el estado de builds fallidos para evitar bucles.

## 0.2.239
- Añadimos API y página para descargar la app móvil.

## 0.2.241
- Añadimos webhook para finalizar builds móviles.
- Normalizamos llamadas API en hooks.

## 0.2.238
- Marcamos cada paso de Analisis.txt con su estado.

## 0.2.236
- Eliminamos la conexion a base de datos en tests.
- Validamos cantidad y fechas al crear materiales.
- Mejoramos la verificacion de codigo en importacion QR.

## 0.2.235
- Corrigimos la URL de imagen al crear y editar almacenes.
- Ajustamos los campos seleccionados en las respuestas de almacenes.

## 0.2.234
- Implementamos deshacer y rehacer ilimitado en las pizarras.

## 0.2.233
- Agregamos navbar independiente en las pizarras y ocultamos el resto del dashboard.
- Mostramos el plan del usuario bajo el logo en la vista de paneles.
- Habilitamos la creación de pizarras solicitando un nombre e invitaciones copian un enlace.
## 0.2.232
- Rediseñamos la vista de paneles con plantillas rápidas y filtros de historial.
## 0.2.231
- Corregimos la ruta de importación de widgets en la vista de paneles.
## 0.2.227
- Ajustamos permisos en menú y sidebar para mostrar Auditorías a todos.
- Al crear una auditoría se registra la fecha actual.
## 0.2.228
- Corregimos enlace en la sección Acerca para usar Link sin anidarlo en un `<a>`.
## 0.2.229
- Añadimos buscador y secciones extra al navbar del dashboard.
- Panel principal ahora permite desplazamiento infinito y widgets superpuestos.
- Las capas y posiciones se guardan en la base de datos.
## 0.2.230
- Panel principal muestra métricas y gráficas del usuario.
- Movimos la zona de widgets a la nueva sección Pizarra con navbar propio.
## 0.2.225
- Añadimos vista general de auditorías con filtros en tiempo real.
- Unificamos nombres de objetos al listar auditorías.
- Mejoramos el estilo de formularios y tarjetas.

## 0.2.226
- Panel de auditorías actualizado con filtros avanzados y botón de retorno.
- Actualizaciones en tiempo real más rápidas para movimientos y reportes.
- Simplificamos la visualización de auditorías por contexto.

## 0.2.224
- Mostramos el historial de unidades en Auditorías.

## 0.2.222
- Agregamos la relación inversa `logDiscrepancias` en `Usuario` para evitar el error de Prisma.

## 0.2.218
- Ocultamos los paneles al previsualizar un movimiento y añadimos botón para volver.

## 0.2.219
- Mejoramos la apariencia de materiales, unidades y movimientos.
- Eliminamos paneles duplicados de historial.

## 0.2.220
- Ajusté las relaciones inversas de `Reporte` y `ArchivoReporte` para evitar fallos de Prisma.

## 0.2.217
- Añadimos un botón "Comenzar" para ejecutar la ROM tras cargarla.

## 0.2.216
- Agregamos la relación inversa `minijuegos` en `Usuario` para evitar el error de Prisma.

## 0.2.214
- Corrijo la previsualización de movimientos con datos guardados.

## 0.2.215
- Reemplazamos el antiguo módulo de minijuegos por un cargador de ROMs.
- Añadimos API y modelo Prisma para gestionar los juegos.

## 0.2.211
- Agregué la relación inversa `historialAlmacenes` en `Usuario` para evitar el error de Prisma.

## 0.2.212
- Mejoramos la vista previa de movimientos con historial completo.
- Añadimos botones de historial por campo.
- Resaltamos el movimiento activo y mostramos su fecha.

## 0.2.213
- Integramos html5-qrcode para escanear códigos en el navegador.
- Comprimimos datos con lz-string antes de crear los QR.
- Exportamos materiales a PDF y Excel desde el cliente.
- Fechas de actualización ahora usan dayjs para formateo consistente.

## 0.2.210
- Registramos cambios de almacenes en historial y mostramos detalles.

## 0.2.209
- Agregamos botón para escanear códigos QR desde la vista del almacén.

## 0.2.208
- Integramos vista rápida, búsqueda y vaciado en la barra de cada almacén.
- Añadimos control global de cambios y limpieza masiva de materiales.

## 0.2.207
- Agregamos menú desplegable en "Almacenes" con opciones extra.

## 0.2.206
- Mostramos el código QR de cada almacén en sus tarjetas.

## 0.2.205
- Creamos la migración inicial para los modelos de chat.

## 0.2.204
- Prevenimos fallos si la API devuelve un formato inesperado en la lista de canales.

## 0.2.203
- Solucionamos la carga infinita del chat ajustando el fetch en la vista.

## 0.2.201
- Corregimos el orden de las variables en la página de chat.
- Optimización al generar la consulta con useMemo.

## 0.2.202
- Dejamos de enviar los archivos base64 en la lista de mensajes y los cargamos bajo demanda.

## 0.2.199
- Añadí vista de archivos en el chat y notificación unificada para integraciones.

## 0.2.200
- Agregué el campo `chatMensajes` en `Usuario` para la relación inversa con `ChatMensaje` y evitar errores de Prisma.

## 0.2.197
- Añadí filtros avanzados de búsqueda en el chat y soporte para notificar a Slack.

## 0.2.198
- Implementé mensajes anclados en el chat.

## 0.2.196
- Implementé el sistema inicial de chat con canales y mensajes.
- Añadí API y modelos en Prisma.

## 0.2.195
- Reemplacé el sidebar de herramientas por un menú en el navbar.
- Ordenamos los accesos y añadimos Chat.

## 0.2.192
- Creamos el gestor avanzado de archivos con importación y exportación.

## 0.2.193
- Reescribí la gestión de archivos con utilidades desglosadas.

## 0.2.194
- Añadí paneles para previsualización y mapeo de columnas.
- Soporte a XML, YAML y TXT en la importación.
- Exportación ahora permite descargar archivos ZIP.

## 0.2.191
- Cerré el contenedor principal en `MaterialForm` para evitar errores de compilación.
- Eliminé una función sin uso.

## 0.2.189
- Ajustamos el historial para abrir respaldos completos.
- Hicimos más grandes las tarjetas del inventario.
- Implementamos vista ampliada de imágenes.

## 0.2.190
- Corregí el formulario de materiales que impedía compilar.
- Mejoré la gestión de archivos adjuntos y vistas previas.

## 0.2.188
- Guardamos cada sesión en la base de datos.
- Verificamos la validez de la sesión en `getUsuarioFromSession`.
- Creamos `/api/logout-all` para cerrar todas las sesiones.
- Ajustamos el login para registrar y anular sesiones.
- Manejamos cookies de forma asíncrona.

## 0.2.186
- Mostramos respaldos completos al abrir movimientos.
- Corregimos ruta de unidades para registrar el historial.

## 0.2.187
- Registramos un respaldo del material al añadir movimientos.

## 0.2.185
- Conectamos las relaciones al crear materiales para evitar errores.

## 0.2.183
- Mejoramos los filtros del inventario.
- Permitimos espiar la generación de UUID en pruebas.

## 0.2.184
- Permitimos crear materiales sin unidad asignada.
- Iniciamos ruta para importar datos escaneando códigos QR.

## 0.2.182
- Añadimos la lista de historial de unidades en el modelo `Usuario` para evitar errores en Prisma.

## 0.2.181
- Corregimos la relación entre HistorialUnidad y MaterialUnidad en Prisma.

## 0.2.177
- Agregamos exportaciones múltiples en la vista de historial.
- Guardamos copias completas al crear, actualizar o borrar unidades.

## 0.2.178
- Guardamos el contexto adicional en cada movimiento.
- Mostramos el QR con opción de regenerarlo en formularios y historial.
- Iniciamos módulo base para proveedores de almacenamiento en la nube.

## 0.2.180
- Ajusté la conexión de Prisma para usar el proxy solo cuando se indique.

## 0.2.176
- Añadimos búsqueda y filtros al historial de movimientos.

## 0.1.0
- Registramos el estado completo de cada movimiento.
- Permitimos visualizar el respaldo en modo solo lectura.

## 0.2.174
- Evitamos desbordamiento de pila al convertir la imagen en el formulario de unidades.

## 0.2.173
- Ajustamos la vista de unidades para usar imagenUrl y evitar el valor vacío en src.

## 0.2.172
- Prevenimos errores al mostrar la imagen de la unidad.

## 0.2.171
- Mostramos los archivos guardados en materiales y unidades.
- Creamos un nuevo campo al subir cada archivo con un máximo de diez.
- Habilitamos desplazamiento para revisar los adjuntos.

## 0.2.170
- Subimos imágenes y archivos a la base de datos.
- Botón para descargar archivos en los formularios.

## 0.2.169
- Agregamos opción para quitar imágenes y archivos en los formularios.
- Permitimos subir múltiples archivos al material con límite de 20MB.

## 0.2.168
- Mostramos las miniaturas e imágenes cargadas en los formularios.
- Agrandamos las tarjetas del listado de materiales.
- Extendimos la altura de los paneles de materiales y unidades.
- Reubicamos el botón flotante de agregar.
## 0.2.167
- Aumenté la altura de los paneles de unidades e historial para mostrar más contenido.

## 0.2.166
- Deshabilitamos "Agregar" hasta guardar el material.
- Mostramos mensaje al descartar un material sin guardar.

## 0.2.165
- Forzamos el remount de formularios al cambiar la selección de material o unidad para evitar errores en React.

## 0.2.164
- Eliminamos el cliente Prisma del repo y generamos en postinstall para evitar errores de plataforma.

## 0.2.162
- Devolvemos 409 cuando la unidad ya existe al crearla o actualizarla.

## 0.2.163
- Permitimos guardar el código QR proporcionado en las rutas de unidades y lo omitimos si viene vacío.

## 0.2.161
- Validamos el ID de unidad antes de eliminarla desde el hook.

## 0.2.160
- Eliminamos materiales y archivos relacionados antes de borrar un almacén.

## 0.2.157
- Ajustamos el botón Agregar de Unidades para que permanezca alineado.

## 0.2.159
- Eliminamos las unidades asociadas antes de borrar un material.

## 0.2.158
- Validamos los IDs de material antes de consultar las unidades.
- Normalizamos valores y fechas al crear o modificar unidades.
- Mostramos previsualización de imagen y deshabilitamos "Guardar" si falta el nombre.
- Registramos errores detallados en desarrollo.

## 0.2.156
- Prevenimos errores al guardar una unidad con imagen adjunta.
- Corregimos el envío de nombre desde el panel de edición.

## 0.2.155
- Liberamos URLs de imagen en el menú de usuario y en la página de configuración.
- Evitamos fugas al revocar los object URLs cuando cambian.

## 0.2.151
- Eliminamos una migración vacía que interrumpía la generación.

## 0.2.152
- Incluimos todos los campos de unidad en la base de datos.
- Actualizamos APIs y hooks para manejar la nueva información.

## 0.2.153
- Agregamos la consulta individual de unidades con verificación de permisos.
- Cargamos los datos completos al abrir el panel de edición.

## 0.2.154
- Añadimos la relación `archivosUnidad` en el modelo `Usuario` para enlazar los archivos de unidad.

## 0.2.155
- Unificamos las llamadas fetch con apiFetch incluyendo las credenciales.

## 0.2.150
- Guardamos correctamente los cambios de la unidad desde el panel de edición.

## 0.2.149
- Corregimos el botón para agregar unidades.
- Optimizamos filtrados con useMemo.
- Conectamos todas las etiquetas con sus entradas mediante htmlFor.

## 0.2.148
- Aceptamos cantidad al registrar movimientos de unidad.
- Soportamos campos opcionales al crear o actualizar unidades.

## 0.2.147
- Permitimos enviar cookies en las peticiones de unidades para crear, modificar y eliminar.

## 0.2.145
- Reordenamos la migración de unidad para prevenir errores.

## 0.2.143
- Conectamos la vista de inventario con la API de materiales.

## 0.2.144
- Generamos códigos QR únicos al crear nuevas unidades.
- Ajustamos las rutas de unidades para devolver este valor.

## 0.2.142
- Reubiqué el panel de historial a la derecha del de unidades.
- Alargué las listas para mostrar más elementos.

## 0.2.141
- Eliminé duplicado de panel de unidad.
- Agregamos búsqueda de unidades.
- Fusionamos historial y movimientos en un solo panel.

## 0.2.140
- Añadimos formulario detallado para editar cada unidad.

## 0.2.138
- Ajusté paneles al seleccionar unidad y actualicé opciones.

## 0.2.139
- Simplifiqué el formulario de material mostrando solo los campos necesarios.

## 0.2.137
- Solucioné el acceso prematuro a `guardar` en la vista de almacén.

## 0.2.136
- Implementé `generarUUID` con verificación segura.
- Reemplacé usos directos de `randomUUID` en las vistas de materiales.
- Añadimos pruebas unitarias para la función de UUID.

## 0.2.18
- Ajustamos logs en almacenes.
- Corrigimos generacion de IDs de materiales.

## 0.1.0
- Ajustamos contenedores y variables para respuesta fluida en todo tamaño.

## 0.2.129
- Sincronizamos las unidades del material desde el panel de unidades.

## 0.2.130
- Avisamos si hay cambios sin guardar al salir de la vista de materiales.

## 0.2.131
- Añadimos el modelo `MaterialUnidad` y migración correspondiente.
- Nuevas rutas `/api/materiales/[id]/unidades` para gestionar unidades.
- Hook `useUnidades` y panel actualizado para listar y editar unidades.

## 0.2.132
- Registramos los movimientos de cada material.
- Endpoint `/api/materiales/[id]/movimientos` para crear y listar movimientos.
- Panel con historial del material en el dashboard.

## 0.2.133
- Generamos identificadores de materiales usando `crypto.randomUUID` con reserva.
- Pruebas para el hook `useMateriales` verifican el comportamiento.

## 0.2.134
- Validamos el parámetro `take` y respondemos 400 si no es numérico.

## 0.2.135
- El formulario carga las unidades desde la API `MaterialUnidad`.
- La lista de inventario muestra también el estado y la ubicación editables.
- Los cambios de materiales se sincronizan mediante los hooks correspondientes.

## 0.2.128
- Oculté los campos de unidad, estado y niveles mínimo y máximo en el formulario de materiales.

## 0.2.127
- Integramos dos paneles nuevos en la vista de almacén para unidades e historial.

## 0.2.124
- Adapté el navbar y los sidebars para móviles y tablets con overlay.

## 0.2.125
- Ajusté la lógica del proveedor de UI para reaccionar a los cambios de tamaño.
- Refiné las variables de ancho en `globals.css` para pantallas muy pequeñas.

## 0.2.126
- Reemplacé medidas fijas en navbars y sidebars por unidades relativas.
- Usé min-height y min-width para prevenir colapsos.

## 0.2.123
- Simplifiqué el navbar eliminando búsqueda, creación rápida y cambio de tema.

## 0.2.122
- Evitamos el bucle de enfoque al iniciar sesión.

## 0.2.121
- Guardamos un flag global para no crear intervalos repetidos en desarrollo.

## 0.2.122
- Memoricé los materiales para evitar ciclos de actualización infinitos al abrir un almacén.

## 0.2.119
- Usamos un ref para controlar el scroll del `Navbar` y el efecto solo se monta una vez.

## 0.2.120
- Obtenemos los IDs de materiales y almacenes directamente desde la URL.

## 0.2.116
- Al crear o duplicar un material se selecciona automáticamente para editarlo.

## 0.2.117
- Evitamos actualizaciones repetidas al sincronizar los almacenes.

## 0.2.118
- Cerramos la cámara al salir de la página de escaneo.

## 0.2.119
- Leemos las cookies desde la petición para evitar fallos de sesión.

## 0.2.114
- Generamos id único al duplicar materiales y seleccionamos la copia.
- Agregamos "(copia)" al nombre y limpiamos el lote.

## 0.2.115
- Definimos una función de actualización tipada para campos numéricos o de texto.
- Clonamos el material antes de actualizarlo para evitar mutaciones.

## 0.2.113
- Ajustamos `MaterialRow` para usar id en lugar de índice.
- Las vistas de inventario actualizan materiales por id.
- Solo se re-renderiza un renglón cuando su contenido cambia.

## 0.2.57
- Usamos `useSession` en el layout de almacén para evitar redirecciones inesperadas.

## 0.2.58
- Asignamos identificadores únicos al cargar o crear materiales.
- Seleccionamos y duplicamos por id en las listas.

## 0.2.110
- Nuevo endpoint `/api/materiales` para listar materiales de todos los almacenes.

## 0.2.112
- Evitamos fallos al cargar `lib/auth` sin `JWT_SECRET`.

## 0.2.111
- Renombramos `producto` a `nombre` en los formularios y listas.
- Ajustamos el hook `useMateriales` para enviar y recibir este campo.

## 0.2.109
- Creamos `useMateriales` para centralizar la gestión de inventario.
- Actualizamos la vista de almacén para usar este hook.

# Changelog
## 0.2.108
- Permitimos guardar códigos de barra y QR en materiales.
- Extendimos el formulario y la API para manejarlos.
## 0.2.107
- Calculamos el inventario como total de materiales y actualizamos las vistas.
## 0.2.106
- Agregamos endpoints para adjuntos de materiales.

## 0.2.104
- Mostramos confirmación al guardar materiales.
- Evitamos advertencias de inputs sin controlar.

## 0.2.105
- Recargamos el inventario desde la base después de cada cambio.
- Enviamos las miniaturas mediante `FormData`.
- Reemplazamos las alertas por notificaciones con `Toast`.
## 0.2.103
- Manejamos casos sin nombre al filtrar materiales para evitar fallos al guardar.
## 0.2.102
- Añadimos la migración para crear `Material` y sus tablas relacionadas.
## 0.2.101
- Corregimos un bucle infinito en `useAlmacenesLogic` al sincronizar los datos.
## 0.2.100
- Ajustamos las relaciones en Prisma para evitar errores de validación.
## 0.2.99
- Manejamos IDs no numéricos para evitar errores al consultar almacenes y materiales.
## 0.2.98
- Cambié la ruta de `QRCodeSVG` para evitar errores de módulo.
## 0.2.97
- Corregí la importación de `qrcode.react` para evitar errores al cargar los códigos.
## 0.2.96
- Implementé escaneo con react-zxing dentro de cada almacén.
- Generé códigos QR y de barras para los materiales.
## 0.2.95
- Integramos una página de escaneo para códigos de barras y QR.
- Registramos movimientos de cada lote con un historial dedicado.
## 0.2.94
- Añadimos gestión de materiales por almacén con archivos adjuntos.
- La API devuelve el inventario real y acepta altas completas.
- El formulario incluye unidad y límites para cada producto.
## 0.2.93
- Mejoramos la vista de almacén con paneles separados y un navbar renovado.

## 0.2.92
- Ajustamos la cookie de sesión para que use opciones coherentes en cada entorno.
- El middleware aplica estas configuraciones sin depender del host.
## 0.2.90
- Añadimos un middleware que protege todas las rutas privadas y APIs.
- Se aplican cabeceras `no-store` para evitar caché en contenido sensible.
- Redirección automática a `/login` si no hay sesión activa.
## 0.2.91
- Ajustamos las rutas de perfil para funcionar en subdirectorios.
## 0.2.89
- Unificamos la vista de almacén en una sola página con doble panel.
- Eliminamos la pestaña de inventario del navbar de detalle.
## 0.2.88
- Conectamos el detalle de almacenes con la API para obtener inventario y totales.
- Agregamos navegación hacia el inventario desde la barra superior.
- Incluimos una página dedicada para editar materiales por almacén.
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
