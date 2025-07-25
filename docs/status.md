# Endpoint de Estado del Sistema

`GET /api/status`

Retorna un JSON indicando si todos los servicios están operativos.

```json
{ "status": "ok" }
```

En caso de fallo de alguna dependencia, la respuesta es:

```json
{ "status": "maintenance" }
```
