"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// --- Modelo de usuario (adáptalo a tu backend real) ---
type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;         // admin, encargado, empleado, institucional, etc.
  plan: string;        // Free, Pro, Empresarial, Institucional
  avatarUrl?: string;
  entidad?: { id: number; nombre: string; tipo: string };
  // Puedes añadir más campos según tus necesidades
};

// --- Modelo del context ---
interface UserContextType {
  usuario: Usuario | null;
  loading: boolean;
  setUsuario: (u: Usuario | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// --- Función que asegura que usuario tenga todos los campos necesarios ---
function userWithDefaults(user: any): Usuario {
  return {
    id: user?.id ?? 0,
    nombre: user?.nombre ?? "Usuario",
    correo: user?.correo ?? "",
    rol: user?.rol ?? "empleado",        // O "usuario" o tu default seguro
    plan: user?.plan ?? "Free",
    avatarUrl: user?.avatarUrl,
    entidad: user?.entidad,
  };
}

// --- Provider real ---
export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Carga el usuario al montar el provider (ejemplo: fetch a /api/login)
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
      } catch {
        setUsuarioState(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Siempre asegura que usuario esté "limpio" al usar setUsuario
  const setUsuario = (u: Usuario | null) => {
    setUsuarioState(u ? userWithDefaults(u) : null);
  };

  // Función de logout
  const logout = async () => {
    await fetch("/api/login", { method: "DELETE" });
    setUsuarioState(null);
    window.location.href = "/login"; // o la ruta que prefieras
  };

  return (
    <UserContext.Provider value={{ usuario, loading, setUsuario, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// --- Custom hook para consumir el usuario desde cualquier componente ---
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de <UserProvider>");
  return ctx;
}
