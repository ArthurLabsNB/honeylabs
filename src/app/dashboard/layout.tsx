"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import NavbarDashboard from "./components/NavbarDashboard";
import WidgetToolbar from "./components/WidgetToolbar";
import { DashboardUIProvider, useDashboardUI } from "./ui";
import { useRouter } from "next/navigation";

// Define tu tipo de usuario
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  // ...otras propiedades
}

// Sidebar fijo, padding del main igual al ancho del sidebar
function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  const { fullscreen } = useDashboardUI();
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
      <div
        className="flex min-h-screen items-center justify-center bg-[var(--dashboard-bg)]"
        data-oid="fg.5god"
      >
        <span
          className="text-[var(--dashboard-accent)] text-lg font-bold animate-pulse"
          data-oid="9iqeiry"
        >
          Cargando...
        </span>
      </div>
    );
  }

  if (!usuario) return null;

  // Sidebar ancho fijo 256px (w-64) siempre
  return (
    <div
      className={`min-h-screen bg-[var(--dashboard-bg)] transition-colors duration-300 relative ${fullscreen ? 'dashboard-full' : ''}`}
      data-oid="agicnbm"
    >
      {/* --- SIDEBAR FIJO --- */}
      <Sidebar usuario={usuario} data-oid="zs00-jl" />
      {/* --- ZONA CENTRAL --- */}
      <main
        className="flex flex-col min-h-screen"
        style={{ paddingLeft: "256px" /* igual a w-64 */ }}
        data-oid="b0.nwxn"
      >
        {/* NAVBAR DASHBOARD */}
        <NavbarDashboard usuario={usuario} data-oid="f2812xq" />
        {/* CONTENIDO MODULAR */}
        <section
          className="
            flex-1 p-0 sm:p-8
            bg-[var(--dashboard-bg)]
            text-[var(--dashboard-text)]
            overflow-y-auto
            animate-fade-in
            transition-colors duration-300
          "
          data-oid="74v:xgb"
        >
          {children}
        </section>
        <WidgetToolbar />
      </main>
    </div>
  );
}

// Layout principal
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardUIProvider>
      <ProtectedDashboard data-oid="1baelfe">{children}</ProtectedDashboard>
    </DashboardUIProvider>
  );
}
