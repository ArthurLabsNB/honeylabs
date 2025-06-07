"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useDashboardUI } from "../ui";
import {
  SIDEBAR_GLOBAL_WIDTH,
  SIDEBAR_GLOBAL_COLLAPSED_WIDTH,
  SIDEBAR_ALMACENES_WIDTH,
  NAVBAR_HEIGHT,
} from "../constants";
import { useRouter, usePathname } from "next/navigation";
import AlmacenSidebar from "./components/AlmacenSidebar";
import { AlmacenesUIProvider } from "./ui";
import type { Usuario } from "@/types/usuario";

// Las constantes de ancho se comparten con el layout principal

function ProtectedAlmacenes({ children }: { children: React.ReactNode }) {
  const {
    fullscreen,
    sidebarGlobalVisible = true,
    sidebarGlobalCollapsed,
  } = useDashboardUI();
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await fetch("/api/login", { credentials: "include" });
        const data = await jsonOrNull(res);
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
        data-oid="6v.cx-e"
      >
        <span
          className="text-[var(--dashboard-accent)] text-lg font-bold animate-pulse"
          data-oid="w3-zh2q"
        >
          Cargando...
        </span>
      </div>
    );
  }

  if (!usuario) return null;

  const globalWidth = fullscreen
    ? 0
    : sidebarGlobalVisible
      ? sidebarGlobalCollapsed
        ? SIDEBAR_GLOBAL_COLLAPSED_WIDTH
        : SIDEBAR_GLOBAL_WIDTH
      : 0;
  const sidebarLeft = fullscreen ? 0 : globalWidth;

  const isDetail = /^\/dashboard\/almacenes\/\d+(\/|$)/.test(pathname);

  // Alturas para los elementos fijos
  const navbarHeight = isDetail ? '0px' : `${NAVBAR_HEIGHT}px`;
  const totalNavbarHeight = navbarHeight;

  return (
    <div
      className={`min-h-screen bg-[var(--dashboard-bg)] relative ${
        fullscreen ? "dashboard-full" : ""
      }`}
      style={{}}
      data-oid="6fwyq0q"
    >


      <div
        className="flex"
        style={{
          paddingTop: totalNavbarHeight,
          minHeight: `calc(100vh - ${navbarHeight})`,
          paddingLeft: !fullscreen ? sidebarLeft : 0,
          transition: 'padding-left 0.3s ease'
        }}
        data-oid="3g2x0lf"
      >
        {/* --- SIDEBAR ALMACENES --- */}
        {!fullscreen && (
          <aside
            className="dashboard-sidebar"
            style={{
              width: SIDEBAR_ALMACENES_WIDTH,
              minWidth: SIDEBAR_ALMACENES_WIDTH,
              backgroundColor: "var(--dashboard-sidebar-bg)",
              borderRight: "1px solid var(--dashboard-border)",
              overflowY: "auto",
              height: '100vh',
              position: "fixed",
              left: sidebarLeft,
              top: 0,
              paddingTop: totalNavbarHeight,
              zIndex: 30,
              transition: 'left 0.3s ease',
              padding: '1rem 0.5rem',
              boxSizing: 'border-box'
            }}
            data-oid="ea00760"
          >
            <div className="space-y-1">
              <AlmacenSidebar />
            </div>
          </aside>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main
          className="flex-1"
          style={{
            marginLeft: !fullscreen && !isDetail ? `${SIDEBAR_ALMACENES_WIDTH}px` : 0,
            padding: "1.5rem",
            transition: "all 0.3s ease",
            minHeight: `calc(100vh - ${totalNavbarHeight})`,
          }}
          data-oid="td4cq6l"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AlmacenesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlmacenesUIProvider data-oid="4wqxegx">
      <ProtectedAlmacenes data-oid="89hpowu">{children}</ProtectedAlmacenes>
    </AlmacenesUIProvider>
  );
}
