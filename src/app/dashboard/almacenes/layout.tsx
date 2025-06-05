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
import { useRouter } from "next/navigation";
import AlmacenesNavbar from "./components/AlmacenesNavbar";
import AlmacenesSidebar from "./components/AlmacenesSidebar";
import { AlmacenesUIProvider } from "./ui";

interface Usuario {
  id: number;
  nombre: string;
  email?: string;
}

// Las constantes de ancho se comparten con el layout principal

function ProtectedAlmacenes({ children }: { children: React.ReactNode }) {
  const {
    fullscreen,
    sidebarGlobalVisible = true,
    sidebarGlobalCollapsed,
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
    if (!loading && !usuario) {
      router.replace("/login");
    }
  }, [usuario, loading, router]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[var(--dashboard-bg)]"
        data-oid="q5s3lyt"
      >
        <span
          className="text-[var(--dashboard-accent)] text-lg font-bold animate-pulse"
          data-oid="cjf3xe."
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

  return (
    <div
      className={`min-h-screen bg-[var(--dashboard-bg)] relative ${
        fullscreen ? "dashboard-full" : ""
      }`}
      data-oid="ed2j7bc"
    >
      {/* --- SIDEBAR ALMACENES --- */}
      {!fullscreen && (
        <aside
          style={{
            width: SIDEBAR_ALMACENES_WIDTH,
            minWidth: SIDEBAR_ALMACENES_WIDTH,
            left: sidebarLeft,
            top: NAVBAR_HEIGHT,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          }}
          className="fixed z-40 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] flex flex-col transition-all duration-300"
          data-oid="oz.pdwz"
        >
          <AlmacenesSidebar data-oid="m.62avw" />
        </aside>
      )}

      {/* --- CONTENIDO PRINCIPAL desplazado --- */}
      <div
        className="min-h-screen flex flex-col transition-all duration-300 sm:-mt-8"
        style={{
          marginLeft: mainMarginLeft,
        }}
        data-oid="mrz7ssi"
      >
        {!fullscreen && <AlmacenesNavbar data-oid="u48cql_" />}
        <section
          className="flex-1 p-4 sm:pt-0 overflow-y-auto bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]"
          data-oid="fs3:.b6"
        >
          {children}
        </section>
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
    <AlmacenesUIProvider data-oid="nlxusux">
      <ProtectedAlmacenes data-oid="i727_q2">{children}</ProtectedAlmacenes>
    </AlmacenesUIProvider>
  );
}
