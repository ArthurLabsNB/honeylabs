"use client";
import React, { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";
import Sidebar from "./components/Sidebar";
import ToolsSidebar from "./components/ToolsSidebar";
import NavbarDashboard from "./components/NavbarDashboard";
import { DashboardUIProvider, useDashboardUI } from "./ui";
import {
  SIDEBAR_GLOBAL_WIDTH,
  SIDEBAR_GLOBAL_COLLAPSED_WIDTH,
  SIDEBAR_TOOLS_WIDTH,
  SIDEBAR_GAP,
  NAVBAR_HEIGHT,
} from "./constants";
import { useRouter, usePathname } from "next/navigation";
import { ToastProvider } from "@/components/Toast";

function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  // Añade en tu context esta propiedad si quieres permitir colapsar
  const {
    fullscreen,
    sidebarGlobalVisible = true,
    sidebarGlobalCollapsed,
    toolsSidebarVisible,
  } = useDashboardUI();
  const router = useRouter();
  const pathname = usePathname();
  const { usuario, loading } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        data-oid="7sw2va-"
      >
        <span
          className="text-[var(--dashboard-accent)] text-lg font-bold animate-pulse"
          data-oid="a.4woji"
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
  const toolsWidth = toolsSidebarVisible ? SIDEBAR_TOOLS_WIDTH : 0;
  const gapWidth = toolsSidebarVisible ? SIDEBAR_GAP : 0;

  // Altura del navbar
  const navbarHeight = `${NAVBAR_HEIGHT}px`;
  const isAlmacenDetail = /^\/dashboard\/almacenes\/\d+(\/|$)/.test(pathname);

  return (
    <div
      className={`min-h-screen bg-[var(--dashboard-bg)] transition-colors duration-300 relative ${
        fullscreen ? "dashboard-full" : ""
      } ${isMobile ? "dashboard-layout-mobile" : ""}`}
      data-oid="1sqtk2o"
    >
      {/* --- NAVBAR DASHBOARD FIJO --- */}
      {!isAlmacenDetail && (
        <div
          className="fixed top-0 left-0 right-0 z-40 bg-[var(--dashboard-navbar)] border-b border-[var(--dashboard-border)]"
          style={{
            height: navbarHeight,
            paddingLeft:
              !fullscreen && sidebarGlobalVisible
                ? sidebarWidth + toolsWidth + gapWidth
                : '0',
            transition: 'padding-left 0.3s ease'
          }}
          data-oid="taw.mzt"
        >
          {usuario && <NavbarDashboard usuario={usuario} data-oid="m6qmdem" />}
        </div>
      )}

      {/* --- SIDEBAR GLOBAL --- */}
      {!fullscreen && (isMobile || sidebarGlobalVisible) && (
        <div
          style={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            left: 0,
            top: 0,
            height: '100vh',
            transform: isMobile && !sidebarGlobalVisible ? `translateX(-${sidebarWidth}px)` : 'none',
            paddingTop: isAlmacenDetail ? 0 : navbarHeight // Asegura que el contenido del sidebar no se oculte bajo el navbar
          }}
          className={`fixed z-40 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] transition-all duration-300 dashboard-sidebar`}
          data-oid=".p64bxw"
        >
          <Sidebar usuario={usuario} data-oid="4t4x82h" />
        </div>
      )}

      {/* --- SIDEBAR TOOLS --- */}
      {!fullscreen && toolsSidebarVisible && (
        <div
          style={{
            width: toolsWidth,
            minWidth: toolsWidth,
            left: sidebarWidth + gapWidth,
            top: 0,
            height: '100vh',
            paddingTop: isAlmacenDetail ? 0 : navbarHeight,
          }}
          className="fixed z-40 dashboard-sidebar shadow-xl rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] transition-all duration-300"
          data-oid="tools-sidebar"
        >
          <ToolsSidebar usuario={usuario} />
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div
        className="flex flex-col min-h-screen transition-all duration-300 w-full"
        style={{
          paddingTop: isAlmacenDetail ? 0 : navbarHeight,
          paddingLeft: !fullscreen ? sidebarWidth + toolsWidth + gapWidth : 0,
          transition: 'padding-left 0.3s ease',
        }}
        data-oid="ou.:qgb"
      >
        <section
          className="
            flex-1 p-4 sm:p-8 w-full
            bg-[var(--dashboard-bg)]
            text-[var(--dashboard-text)]
            relative
            animate-fade-in
            transition-colors duration-300
          "
          style={{ minHeight: `calc(100vh - ${isAlmacenDetail ? 0 : NAVBAR_HEIGHT}px)` }}
          data-oid="xvd._xa"
        >
          {children}
        </section>
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
    <DashboardUIProvider data-oid="-kp1hi9">
      <ToastProvider>
        <ProtectedDashboard data-oid="khrpzeo">{children}</ProtectedDashboard>
      </ToastProvider>
    </DashboardUIProvider>
  );
}
