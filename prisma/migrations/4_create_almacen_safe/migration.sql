-- create function to insert almacen and link usuario atomically
CREATE OR REPLACE FUNCTION public.create_almacen_safe(
  p_usuario_id int,
  p_entidad_id int,
  p_nombre text,
  p_descripcion text,
  p_codigo_unico text,
  p_imagen bytea DEFAULT NULL,
  p_imagen_nombre text DEFAULT NULL,
  p_imagen_url text DEFAULT NULL
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id int;
BEGIN
  INSERT INTO public.almacen(nombre, descripcion, codigo_unico, imagen, imagen_nombre, imagen_url, entidad_id)
  VALUES (p_nombre, p_descripcion, p_codigo_unico, p_imagen, p_imagen_nombre, p_imagen_url, p_entidad_id)
  RETURNING id INTO v_id;

  INSERT INTO public.usuario_almacen(usuario_id, almacen_id, rol_en_almacen)
  VALUES (p_usuario_id, v_id, 'propietario');

  RETURN v_id;
END;
$$;
