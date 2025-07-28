# Endpoints de Auditorías

## POST /api/auditorias
Crea una nueva entrada de auditoría. Puede enviar datos en `multipart/form-data` o JSON.

- **Campos:** `tipo` (`almacen`|`material`|`unidad`), `objetoId`, `categoria`, `observaciones` (JSON) y opcionalmente `archivos`.
- **Respuesta:** `{ auditoria: { id } }`.

## POST /api/auditorias/[id]/restore
Restaura el elemento asociado a la auditoría indicada.

- **Parámetros:** ninguno en el cuerpo. El ID se toma de la URL.
- **Respuesta:** `{ success: true, auditoria: { id }, auditError?: string }`.
