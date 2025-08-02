# Endpoints de Materiales

## GET /api/almacenes/[id]/materiales

Lista los materiales de un almacén.

### Respuesta

```json
{
  "materiales": [
    {
      "id": 1,
      "nombre": "Reactivo A",
      "fechaRegistro": "2024-01-01T00:00:00.000Z",
      "fechaActualizacion": "2024-02-01T00:00:00.000Z"
    }
  ]
}
```

`fechaActualizacion` se incluye cuando existe un registro de última modificación.
