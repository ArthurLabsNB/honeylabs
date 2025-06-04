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

function ProtectedAlmacenes({ children }: { children: React.ReactNode }) {
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
      <div className="flex min-h-screen items-center justify-center bg-[var(--dashboard-bg)]">
        <span className="text-[var(--dashboard-accent)] text-lg font-bold animate-pulse">Cargando...</span>
      </div>
    );
  }

  if (!usuario) return null;

  return (
    <div className={`min-h-screen bg-[var(--dashboard-bg)] relative ${fullscreen ? 'dashboard-full' : ''}`}>
      <AlmacenesSidebar />
      <main className="flex flex-col min-h-screen" style={{ paddingLeft: '192px' }}>
        <AlmacenesNavbar />
        <section className="flex-1 p-4 overflow-y-auto bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]">
          {children}
        </section>
      </main>
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
