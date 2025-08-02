-- Redefine vista almacen_resumen con columnas snake_case y totales
DROP VIEW IF EXISTS public."AlmacenResumen";
DROP VIEW IF EXISTS public.almacen_resumen;

CREATE OR REPLACE VIEW public.almacen_resumen AS
SELECT
  a.id,
  a.nombre,
  a.descripcion,
  a."imagenUrl"      AS imagen_url,
  a."imagenNombre"   AS imagen_nombre,
  a."fechaCreacion"  AS fecha_creacion,
  a."codigoUnico"    AS codigo_unico,
  enc.nombre          AS encargado_nombre,
  enc.correo          AS encargado_correo,
  mov.ultima          AS ultima_actualizacion,
  COALESCE(mat.inventario, 0) AS inventario,
  COALESCE(mat.unidades, 0)   AS unidades,
  COALESCE(notif.notificaciones, 0) AS notificaciones,
  COALESCE(mov.entradas, 0)   AS entradas,
  COALESCE(mov.salidas, 0)    AS salidas
FROM public."Almacen" a
LEFT JOIN LATERAL (
  SELECT u.nombre, u.correo
  FROM public.usuario_almacen ua
  JOIN public.usuario u ON u.id = ua."usuarioId"
  WHERE ua."almacenId" = a.id
  ORDER BY ua."usuarioId" ASC
  LIMIT 1
) enc ON TRUE
LEFT JOIN LATERAL (
  SELECT
    COALESCE(SUM(CASE WHEN m."tipo" = 'entrada' THEN m."cantidad" END), 0) AS entradas,
    COALESCE(SUM(CASE WHEN m."tipo" = 'salida'  THEN m."cantidad" END), 0) AS salidas,
    MAX(m."fecha") AS ultima
  FROM public."Movimiento" m
  WHERE m."almacenId" = a.id
) mov ON TRUE
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS notificaciones
  FROM public."Notificacion" n
  WHERE n."almacenId" = a.id
    AND n."leida" = FALSE
) notif ON TRUE
LEFT JOIN LATERAL (
  SELECT
    COUNT(DISTINCT m.id) AS inventario,
    COUNT(u.id) AS unidades
  FROM public."Material" m
  LEFT JOIN public."MaterialUnidad" u ON u."materialId" = m.id
  WHERE m."almacenId" = a.id
) mat ON TRUE;
