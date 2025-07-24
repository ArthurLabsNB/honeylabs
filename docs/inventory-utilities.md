# Utilidades de Inventario

Este documento resume operaciones útiles disponibles en la sección de Almacenes.

- **Exportar a CSV**: permite descargar listados completos de materiales, unidades o almacenes en formato CSV mediante `/api/archivos/export`.
- **Actualizaciones masivas**: envía varias modificaciones de stock en una sola acción utilizando `/api/materiales/[id]/ajuste`.
- **Alertas de bajo stock**: consulta `/api/alertas` para mostrar materiales con existencias por debajo del mínimo configurado.
- **Generación de códigos QR por lote**: crea varios códigos de acceso con `/api/codigos/generar` para identificación rápida.
