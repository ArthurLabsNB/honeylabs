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
import AlmacenNavbar from "./components/AlmacenNavbar";
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

  const globalWidth = sidebarGlobalVisible
    ? sidebarGlobalCollapsed
      ? SIDEBAR_GLOBAL_COLLAPSED_WIDTH
      : SIDEBAR_GLOBAL_WIDTH
    : 0;
  const sidebarLeft = globalWidth;
  const mainMarginLeft = !fullscreen
    ? globalWidth + SIDEBAR_ALMACENES_WIDTH
    : 0;

  // Alturas para los elementos fijos
  const navbarHeight = '64px'; // Misma altura que el navbar del dashboard
  const almacenNavbarHeight = '50px'; // Altura del navbar de almacenes
  const totalNavbarHeight = `calc(${navbarHeight} + ${almacenNavbarHeight})`;

  return (
    <div
      className={`min-h-screen bg-[var(--dashboard-bg)] relative ${
        fullscreen ? "dashboard-full" : ""
      }`}
      data-oid="6fwyq0q"
    >
      {/* --- NAVBAR ALMACENES --- */}
      <div
        className="fixed left-0 right-0 z-40 bg-[var(--dashboard-navbar)] border-b border-[var(--dashboard-border)]"
        style={{
          top: navbarHeight, // Coloca este navbar debajo del navbar del dashboard
          height: almacenNavbarHeight,
          left: fullscreen ? 0 : sidebarLeft,
          right: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 1rem",
          transition: 'left 0.3s ease'
        }}
        data-oid="pyvpx.g"
      >
        {usuario && <AlmacenNavbar mode="list" />}
      </div>

      <div
        className="flex"
        style={{
          paddingTop: totalNavbarHeight, // Asegura que el contenido no se oculte bajo los navbars
          minHeight: `calc(100vh - ${navbarHeight})`,
          paddingLeft: !fullscreen ? sidebarLeft : 0,
          transition: 'padding-left 0.3s ease'
        }}
        data-oid="3g2x0lf"
      >
        {/* --- SIDEBAR ALMACENES --- */}
        {!fullscreen && (
          <aside
            style={{
              width: SIDEBAR_ALMACENES_WIDTH,
              minWidth: SIDEBAR_ALMACENES_WIDTH,
              backgroundColor: "var(--dashboard-sidebar-bg)",
              borderRight: "1px solid var(--dashboard-border)",
              overflowY: "auto",
              height: `calc(100vh - ${totalNavbarHeight})`,
              position: "fixed",
              left: sidebarLeft,
              top: totalNavbarHeight,
              zIndex: 30,
              transition: 'left 0.3s ease',
              padding: '1rem 0.5rem',
              boxSizing: 'border-box'
            }}
            data-oid="ea00760"
          >
            <div className="space-y-1">
              <AlmacenSidebar mode={pathname !== "/dashboard/almacenes" ? 'detail' : 'list'} />
            </div>
          </aside>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main
          className="flex-1"
          style={{
            marginLeft: !fullscreen ? `${SIDEBAR_ALMACENES_WIDTH}px` : 0,
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
