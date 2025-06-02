"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

// === Modelo del usuario desde API ===
export type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  tipoCuenta: string; // estandar, institucional, empresarial
  plan?: {
    id: number;
    nombre: string;
    limites?: Record<string, any>;
  } | null;
  entidad?: {
    id: number;
    nombre: string;
    tipo: string;
    planId?: number;
  } | null;
  avatarUrl?: string;
};

interface UserContextType {
  usuario: Usuario | null;
  loading: boolean;
  setUsuario: (u: Usuario | null) => void;
  logout: (redirectUrl?: string) => Promise<void>;
  refrescarUsuario: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// === Normaliza estructura del usuario ===
function userWithDefaults(data: any): Usuario {
  return {
    id: data?.id ?? 0,
    nombre: data?.nombre ?? "Usuario",
    correo: data?.correo ?? "",
    rol: data?.roles?.[0]?.nombre ?? "estandar",
    tipoCuenta: data?.tipoCuenta ?? "estandar",
    plan: data?.plan ?? null,
    entidad: data?.entidad ?? null,
    avatarUrl: data?.fotoPerfilNombre
      ? `/api/perfil/foto?nombre=${encodeURIComponent(data.fotoPerfilNombre)}`
      : undefined,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch de usuario reutilizable (para refrescar tras login, registro, etc)
  const refrescarUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/login", { method: "GET" });
      const data = await res.json();
      if (data?.success && data?.usuario) {
        setUsuarioState(userWithDefaults(data.usuario));
      } else {
        setUsuarioState(null);
      }
    } catch (err) {
      setUsuarioState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refrescarUsuario();
  }, [refrescarUsuario]);

  const setUsuario = (u: Usuario | null) => {
    setUsuarioState(u ? userWithDefaults(u) : null);
  };

  const logout = async (redirectUrl?: string) => {
    await fetch("/api/login", { method: "DELETE" });
    setUsuarioState(null);
    if (redirectUrl !== undefined) {
      window.location.href = redirectUrl;
    }
  };

  return (
    <UserContext.Provider
      value={{
        usuario,
        loading,
        setUsuario,
        logout,
        refrescarUsuario,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// === Hook personalizado ===
export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error("useUser debe usarse dentro de <UserProvider>");
  return ctx;
}
