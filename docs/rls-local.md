# Ajustar RLS en entornos locales

Las políticas de Row Level Security pueden bloquear operaciones durante el desarrollo. Para probar sin restricciones existen dos opciones:

1. **Usar la clave `service_role`**
   - Define la variable `SUPABASE_SERVICE_ROLE` en `.env.local`.
   - Las solicitudes que incluyan esta clave omiten las políticas RLS.

2. **Modificar RLS temporalmente**
   - Desactivar RLS:
     ```sql
     ALTER TABLE public.almacen DISABLE ROW LEVEL SECURITY;
     ```
   - Crear una política abierta para pruebas:
     ```sql
     ALTER TABLE public.almacen ENABLE ROW LEVEL SECURITY;
     CREATE POLICY "allow_all" ON public.almacen FOR ALL USING (true) WITH CHECK (true);
     ```

Recuerda revertir estos cambios antes de subir a producción y usar migraciones en `prisma/migrations` para ajustes permanentes.
