"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useDashboardUI } from "../../ui";
import { useRouter } from "next/navigation";
import AlmacenNavbar from "../components/AlmacenNavbar";
import AlmacenSidebar from "../components/AlmacenSidebar";
import {
  SIDEBAR_GLOBAL_WIDTH,
  SIDEBAR_GLOBAL_COLLAPSED_WIDTH,
  SIDEBAR_ALMACENES_WIDTH,
  NAVBAR_HEIGHT,
} from "../../constants";

interface Usuario {
  id: number;
  nombre: string;
  email?: string;
}

function ProtectedAlmacen({ children }: { children: React.ReactNode }) {
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
      data-oid="vu397ln"
    >
      <AlmacenSidebar
        style={{
          left: sidebarLeft,
          top: NAVBAR_HEIGHT,
          width: SIDEBAR_ALMACENES_WIDTH,
          minWidth: SIDEBAR_ALMACENES_WIDTH,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
        data-oid="iw4v12t"
      />

      <main
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: mainMarginLeft, marginTop: NAVBAR_HEIGHT }}
        data-oid="9d4tqvn"
      >
        <AlmacenNavbar data-oid="0mfue8q" />
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
