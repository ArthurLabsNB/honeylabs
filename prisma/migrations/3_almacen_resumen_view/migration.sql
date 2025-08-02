CREATE VIEW almacen_resumen AS
SELECT a.id,
       a.nombre,
       a.descripcion,
       a."imagenUrl",
       a."imagenNombre",
       a."fechaCreacion",
       a."codigoUnico",
       enc.nombre AS encargado_nombre,
       enc.correo AS encargado_correo,
       COALESCE(mov.entradas, 0) AS entradas,
       COALESCE(mov.salidas, 0) AS salidas,
       mov.ultima_actualizacion,
       COALESCE(mat.inventario, 0) AS inventario,
       COALESCE(uni.unidades, 0) AS unidades,
       COALESCE(notif.notificaciones, 0) AS notificaciones
FROM "Almacen" a
LEFT JOIN LATERAL (
  SELECT u.nombre, u.correo
  FROM usuario_almacen ua
  JOIN "Usuario" u ON u.id = ua."usuarioId"
  WHERE ua."almacenId" = a.id
  LIMIT 1
) enc ON true
LEFT JOIN LATERAL (
  SELECT
    SUM(CASE WHEN m.tipo = 'entrada' THEN m.cantidad ELSE 0 END) AS entradas,
    SUM(CASE WHEN m.tipo = 'salida' THEN m.cantidad ELSE 0 END) AS salidas,
    MAX(m.fecha) AS ultima_actualizacion
  FROM "Movimiento" m
  WHERE m."almacenId" = a.id
) mov ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS inventario
  FROM "Material" ma
  WHERE ma."almacenId" = a.id
) mat ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS unidades
  FROM material_unidad mu
  JOIN "Material" ma ON ma.id = mu."materialId"
  WHERE ma."almacenId" = a.id
) uni ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS notificaciones
  FROM "Notificacion" n
  WHERE n."almacenId" = a.id AND n.leida = false
) notif ON true;
