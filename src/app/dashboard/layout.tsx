"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import Sidebar from "./components/Sidebar";
import NavbarDashboard from "./components/NavbarDashboard";
import WidgetToolbar from "./components/WidgetToolbar";
import { DashboardUIProvider, useDashboardUI } from "./ui";
import {
  SIDEBAR_GLOBAL_WIDTH,
  SIDEBAR_GLOBAL_COLLAPSED_WIDTH,
} from "./constants";
import { useRouter } from "next/navigation";

// Puedes controlar el colapso con un estado global/context

function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  // Añade en tu context esta propiedad si quieres permitir colapsar
  const {
    fullscreen,
    sidebarGlobalVisible = true,
    sidebarGlobalCollapsed,
  } = useDashboardUI();
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        data-oid="eqwh:-y"
      >
        <span
          className="text-[var(--dashboard-accent)] text-lg font-bold animate-pulse"
          data-oid="mvway4."
        >
          Cargando...
        </span>
      </div>
    );
  }

  if (!usuario) return null;

  const sidebarWidth = sidebarGlobalVisible
    ? sidebarGlobalCollapsed
      ? SIDEBAR_GLOBAL_COLLAPSED_WIDTH
      : SIDEBAR_GLOBAL_WIDTH
    : 0;
  const marginLeft = !fullscreen && !isMobile ? sidebarWidth : 0;

  return (
    <div
      className={`min-h-screen bg-[var(--dashboard-bg)] transition-colors duration-300 relative ${
        fullscreen ? "dashboard-full" : ""
      } ${isMobile ? "dashboard-layout-mobile" : ""}`}
      data-oid="3vix2gy"
    >
      {/* --- SIDEBAR FIJO --- */}
      {!fullscreen && (isMobile || sidebarGlobalVisible) && (
        <div
          style={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            left: 0,
            transform: isMobile
              ? sidebarGlobalVisible
                ? "translateX(0)"
                : "translateX(-100%)"
              : undefined,
          }}
          className={`fixed top-0 left-0 h-screen z-40 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] transition-all duration-300 dashboard-sidebar ${isMobile && sidebarGlobalVisible ? "open" : ""}`}
          data-oid="ookx_o-"
        >
          <Sidebar usuario={usuario} data-oid="t.unwrz" />
        </div>
      )}

      {/* --- ZONA CENTRAL --- */}
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft }}
        data-oid="ufsaxi9"
      >
        <NavbarDashboard usuario={usuario} data-oid="1w12i5_" />
        <section
          className="
            flex-1 p-0 sm:p-8
            bg-[var(--dashboard-bg)]
            text-[var(--dashboard-text)]
            overflow-y-auto
            animate-fade-in
            transition-colors duration-300
          "
          data-oid="-c2n1cr"
        >
          {children}
        </section>
        <WidgetToolbar data-oid="8l_ua.d" />
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardUIProvider data-oid="9vdsl11">
      <ProtectedDashboard data-oid=":1yrc0l">{children}</ProtectedDashboard>
    </DashboardUIProvider>
  );
}
