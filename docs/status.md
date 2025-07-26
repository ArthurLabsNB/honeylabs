# Endpoint de Estado del Sistema

`GET /api/status`

Retorna un JSON indicando si todos los servicios están operativos.

Si la variable de entorno `STATUS_SERVICE_URL` no está definida, se omite la
verificación externa y solo se comprueba la conexión a la base de datos.

```json
{ "status": "ok" }
```

En caso de fallo de alguna dependencia, la respuesta es:

```json
{ "status": "maintenance" }
```
