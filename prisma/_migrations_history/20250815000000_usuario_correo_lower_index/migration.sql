CREATE INDEX IF NOT EXISTS idx_usuario_correo_lower ON public.usuario (lower(correo));
