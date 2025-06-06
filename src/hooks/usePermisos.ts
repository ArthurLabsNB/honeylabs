"use client";
import { useMemo } from "react";
import type { Usuario } from "@/types/usuario";

export default function usePermisos(usuario: Usuario | null) {
  return useMemo(() => {
    if (!usuario || !usuario.roles) return {} as Record<string, any>;
    const permisos: Record<string, any> = {};
    for (const rol of usuario.roles) {
      if (rol.permisos) Object.assign(permisos, rol.permisos);
    }
    return permisos;
  }, [usuario]);
}
