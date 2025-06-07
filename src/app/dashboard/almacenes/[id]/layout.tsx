"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useDashboardUI } from "../../ui";
import { useRouter } from "next/navigation";
import AlmacenDetailNavbar from "../components/AlmacenDetailNavbar";
import AlmacenSidebar from "../components/AlmacenSidebar";
import {
  SIDEBAR_GLOBAL_WIDTH,
  SIDEBAR_GLOBAL_COLLAPSED_WIDTH,
  SIDEBAR_ALMACENES_WIDTH,
  NAVBAR_HEIGHT,
} from "../../constants";
import type { Usuario } from "@/types/usuario";

function ProtectedAlmacen({ children }: { children: React.ReactNode }) {
  const {
    fullscreen,
    sidebarGlobalVisible = true,
    sidebarGlobalCollapsed,
    toggleFullscreen,
  } = useDashboardUI();
  const router = useRouter();
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
    toggleFullscreen();
    return () => {
      toggleFullscreen();
    };
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
        data-oid="m8ihkvs"
      >
        <span
          className="text-[var(--dashboard-accent)] text-lg font-bold animate-pulse"
          data-oid="_r:ikd8"
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
  const mainMarginLeft = fullscreen ? SIDEBAR_ALMACENES_WIDTH : globalWidth + SIDEBAR_ALMACENES_WIDTH;

  return (
    <div
      className={`min-h-screen bg-[var(--dashboard-bg)] relative ${
        fullscreen ? "dashboard-full" : ""
      }`}
      style={{
        // Ajustamos variables para el sidebar de almacén
        // y eliminamos la altura del navbar global
        ["--navbar-height" as any]: "0px",
        ["--almacen-navbar-height" as any]: "56px",
      }}
      data-oid="vu397ln"
    >
      {!fullscreen && (
        <aside
          style={{
            width: SIDEBAR_ALMACENES_WIDTH,
            minWidth: SIDEBAR_ALMACENES_WIDTH,
            left: fullscreen ? 0 : globalWidth,
            top: NAVBAR_HEIGHT + 56,
            height: `calc(100vh - ${NAVBAR_HEIGHT + 56}px)`,
          }}
          className="fixed z-30 bg-[var(--dashboard-sidebar)] border-r border-[var(--dashboard-border)] shadow-sm"
        >
          <AlmacenSidebar mode="detail" />
        </aside>
      )}
      <main
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: mainMarginLeft, paddingTop: NAVBAR_HEIGHT + 56 }}
        data-oid="9d4tqvn"
      >
        <AlmacenDetailNavbar />
        <section
          className="flex-1 p-4 overflow-y-auto bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]"
          data-oid="fuuwox1"
        >
          {children}
        </section>
      </main>
    </div>
  );
}

export default function AlmacenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedAlmacen data-oid="vzd1u8v">{children}</ProtectedAlmacen>;
}
