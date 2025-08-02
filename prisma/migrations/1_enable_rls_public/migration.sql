-- Habilita RLS en todas las tablas públicas y crea una política permisiva
-- para mantener acceso abierto mientras se diseñan reglas específicas.
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', rec.tablename);
    EXECUTE format('CREATE POLICY "allow_all" ON public.%I FOR ALL USING (true) WITH CHECK (true);', rec.tablename);
  END LOOP;
END $$;
