"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// === Modelo del usuario desde API ===
type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: string; // Puede venir desde algún campo personalizado o calculado
  tipoCuenta: string; // estandar, institucional, empresarial
  plan?: {
    id: number;
    nombre: string; // Free, Pro, Empresarial, Institucional
    limites?: Record<string, any>;
  } | null;
  entidad?: {
    id: number;
    nombre: string;
    tipo: string;
    planId?: number;
  } | null;
  avatarUrl?: string; // Calculado en el servidor si se guarda como buffer
};

interface UserContextType {
  usuario: Usuario | null;
  loading: boolean;
  setUsuario: (u: Usuario | null) => void;
  logout: () => void;
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

// === Proveedor del contexto ===
export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/login", { method: "GET" });
        const data = await res.json();

        if (data?.success && data?.usuario) {
          setUsuarioState(userWithDefaults(data.usuario));
        } else {
          setUsuarioState(null);
        }
      } catch (err) {
        console.warn("❌ Error cargando sesión:", err);
        setUsuarioState(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const setUsuario = (u: Usuario | null) => {
    setUsuarioState(u ? userWithDefaults(u) : null);
  };

  const logout = async () => {
    await fetch("/api/login", { method: "DELETE" });
    setUsuarioState(null);
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider value={{ usuario, loading, setUsuario, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// === Hook personalizado ===
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error("useUser debe usarse dentro de <UserProvider>");
  return ctx;
}
