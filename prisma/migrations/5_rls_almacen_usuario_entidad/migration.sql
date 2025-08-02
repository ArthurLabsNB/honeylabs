-- Habilita RLS y define políticas basadas en auth.uid() para tablas clave

-- Tabla: almacen
ALTER TABLE public.almacen ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all" ON public.almacen;
CREATE POLICY "almacen_select" ON public.almacen
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuario u
      WHERE u.id = auth.uid() AND u.entidad_id = almacen.entidad_id
    )
  );
CREATE POLICY "almacen_insert" ON public.almacen
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuario u
      WHERE u.id = auth.uid() AND u.entidad_id = NEW.entidad_id
    )
  );

-- Tabla: usuario_almacen
ALTER TABLE public.usuario_almacen ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all" ON public.usuario_almacen;
CREATE POLICY "usuario_almacen_select" ON public.usuario_almacen
  FOR SELECT USING (usuario_id = auth.uid());
CREATE POLICY "usuario_almacen_insert" ON public.usuario_almacen
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

-- Tabla: entidad
ALTER TABLE public.entidad ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all" ON public.entidad;
CREATE POLICY "entidad_select" ON public.entidad
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuario u
      WHERE u.id = auth.uid() AND u.entidad_id = entidad.id
    )
  );
CREATE POLICY "entidad_insert" ON public.entidad
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuario u
      WHERE u.id = auth.uid() AND u.entidad_id = NEW.id
    )
  );
