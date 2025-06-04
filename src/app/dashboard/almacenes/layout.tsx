"use client";
import React, { useEffect, useState } from "react";
import { DashboardUIProvider, useDashboardUI } from "../ui";
import { useRouter } from "next/navigation";
import AlmacenesNavbar from "./components/AlmacenesNavbar";
import AlmacenesSidebar from "./components/AlmacenesSidebar";
import { AlmacenesUIProvider } from "./ui";

interface Usuario {
  id: number;
  nombre: string;
  email?: string;
}

// Deben coincidir con el global
const SIDEBAR_GLOBAL_WIDTH = 256; // Igual al global
const SIDEBAR_ALMACENES_WIDTH = 192;

function ProtectedAlmacenes({ children }: { children: React.ReactNode }) {
  // Ahora puedes controlar ambos desde tu context global (¡ajusta tu DashboardUIProvider!)
  const { fullscreen, sidebarGlobalVisible = true } = useDashboardUI();
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await fetch("/api/login", { credentials: "include" });
        const data = await res.json();
        if (data?.success && data?.usuario) {
          setUsuario(data.usuario);
        } else {
          setUsuario(null);
        }
      } catch {
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };
    cargarUsuario();
  }, []);

  useEffect(() => {
    if (!loading && !usuario) {
      router.replace("/login");
    }
  }, [usuario, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--dashboard-bg)]">
        <span className="text-[var(--dashboard-accent)] text-lg font-bold animate-pulse">
          Cargando...
        </span>
      </div>
    );
  }

  if (!usuario) return null;

  // Sidebar almacenes SIEMPRE pegado a la derecha del sidebar global si está visible
  const sidebarLeft = sidebarGlobalVisible ? SIDEBAR_GLOBAL_WIDTH : 0;
  // El main debe empujarse a la derecha por la suma de ambos
  const mainMarginLeft = !fullscreen
    ? (sidebarGlobalVisible
      ? SIDEBAR_GLOBAL_WIDTH + SIDEBAR_ALMACENES_WIDTH
      : SIDEBAR_ALMACENES_WIDTH)
    : 0;

  return (
    <div
      className={`min-h-screen bg-[var(--dashboard-bg)] relative ${
        fullscreen ? "dashboard-full" : ""
      }`}
    >
      {/* --- SIDEBAR ALMACENES --- */}
      {!fullscreen && (
        <aside
          style={{
            width: SIDEBAR_ALMACENES_WIDTH,
            minWidth: SIDEBAR_ALMACENES_WIDTH,
            left: sidebarLeft,
          }}
          className="fixed top-0 h-screen z-40 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] flex flex-col transition-all duration-300"
        >
          <AlmacenesSidebar />
        </aside>
      )}

      {/* --- CONTENIDO PRINCIPAL desplazado --- */}
      <div
        className="min-h-screen flex flex-col transition-all duration-300"
        style={{
          marginLeft: mainMarginLeft,
        }}
      >
        {!fullscreen && <AlmacenesNavbar />}
        <section className="flex-1 p-4 overflow-y-auto bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]">
          {children}
        </section>
      </div>
    </div>
  );
}

export default function AlmacenesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardUIProvider>
      <AlmacenesUIProvider>
        <ProtectedAlmacenes>{children}</ProtectedAlmacenes>
      </AlmacenesUIProvider>
    </DashboardUIProvider>
  );
}
