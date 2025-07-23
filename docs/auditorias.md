# Endpoints de Auditorías

## POST /api/auditorias/[id]/restore
Restaura el elemento asociado a la auditoría indicada.

- **Parámetros:** ninguno en el cuerpo. El ID se toma de la URL.
- **Respuesta:** `{ success: true, auditoria: { id }, auditError?: string }`.
