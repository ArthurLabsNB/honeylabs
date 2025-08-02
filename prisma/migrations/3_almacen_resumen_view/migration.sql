-- Limpia vistas antiguas
DROP VIEW IF EXISTS public."AlmacenResumen";
DROP VIEW IF EXISTS public.almacen_resumen;

-- Vista consistente con "Almacen" (CamelCase) y usuario en snake (usuario)
CREATE OR REPLACE VIEW public.almacen_resumen AS
SELECT
  a.id,
  a.nombre,
  a.descripcion,
  a."imagenUrl",
  a."imagenNombre",
  a."fechaCreacion",
  a."codigoUnico",
  enc.nombre  AS encargado,
  enc.correo  AS correo,
  mov.ultima  AS "ultimaActualizacion",
  COALESCE(notif.notificaciones, 0) AS notificaciones,
  COALESCE(mov.entradas, 0) AS entradas,
  COALESCE(mov.salidas, 0)  AS salidas
FROM public."Almacen" a
-- Encargado (primer usuario asociado)
LEFT JOIN LATERAL (
  SELECT u.nombre, u.correo
  FROM public.usuario_almacen ua
  JOIN public.usuario u ON u.id = ua."usuarioId"
  WHERE ua."almacenId" = a.id
  ORDER BY ua."usuarioId" ASC
  LIMIT 1
) enc ON TRUE
-- Movimientos (sumas y última fecha)
LEFT JOIN LATERAL (
  SELECT
    COALESCE(SUM(CASE WHEN m."tipo" = 'entrada' THEN m."cantidad" END), 0) AS entradas,
    COALESCE(SUM(CASE WHEN m."tipo" = 'salida'  THEN m."cantidad" END), 0) AS salidas,
    MAX(m."fecha") AS ultima
  FROM public."Movimiento" m
  WHERE m."almacenId" = a.id
) mov ON TRUE
-- Notificaciones no leídas
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS notificaciones
  FROM public."Notificacion" n
  WHERE n."almacenId" = a.id
    AND n."leida" = FALSE
) notif ON TRUE
;
