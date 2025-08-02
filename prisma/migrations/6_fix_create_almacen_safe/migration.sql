-- required tables: public.usuario, public.entidad, public.almacen, public.usuario_almacen
-- drop obsolete create_almacen_safe signature and recreate with expected argument order
DROP FUNCTION IF EXISTS public.create_almacen_safe(
  int,
  int,
  text,
  text,
  text,
  text,
  text,
  text,
  bytea,
  text,
  text
);

-- new signature matching application call order
CREATE OR REPLACE FUNCTION public.create_almacen_safe(
  p_codigo_unico text,
  p_descripcion text,
  p_entidad_correo text DEFAULT NULL,
  p_entidad_nombre text DEFAULT NULL,
  p_entidad_tipo text DEFAULT NULL,
  p_imagen bytea DEFAULT NULL,
  p_imagen_nombre text DEFAULT NULL,
  p_imagen_url text DEFAULT NULL,
  p_nombre text,
  p_usuario_id int
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id int;
  v_entidad_id int;
BEGIN
  -- try to reuse entidad asociada al usuario
  v_entidad_id := (SELECT entidad_id FROM public.usuario WHERE id = p_usuario_id);

  -- crea entidad si el usuario no tiene una
  IF v_entidad_id IS NULL THEN
    INSERT INTO public.entidad(nombre, tipo, correo_contacto)
    VALUES (
      COALESCE(p_entidad_nombre, 'Entidad de ' || (SELECT nombre FROM public.usuario WHERE id = p_usuario_id)),
      COALESCE(p_entidad_tipo, (SELECT tipo_cuenta FROM public.usuario WHERE id = p_usuario_id)),
      COALESCE(p_entidad_correo, (SELECT correo FROM public.usuario WHERE id = p_usuario_id))
    )
    RETURNING id INTO v_entidad_id;

    UPDATE public.usuario SET entidad_id = v_entidad_id WHERE id = p_usuario_id;
  END IF;

  -- inserta almacen y vincula con el usuario
  INSERT INTO public.almacen(nombre, descripcion, codigo_unico, imagen, imagen_nombre, imagen_url, entidad_id)
  VALUES (p_nombre, p_descripcion, p_codigo_unico, p_imagen, p_imagen_nombre, p_imagen_url, v_entidad_id)
  RETURNING id INTO v_id;

  INSERT INTO public.usuario_almacen(usuario_id, almacen_id, rol_en_almacen)
  VALUES (p_usuario_id, v_id, 'propietario');

  RETURN v_id;
END;
$$;
