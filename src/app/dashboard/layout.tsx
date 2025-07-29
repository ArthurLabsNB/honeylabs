"use client";
import React, { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";
import Sidebar from "./components/Sidebar";
import NavbarDashboard from "./components/NavbarDashboard";
import NavbarPaneles from "./paneles/components/NavbarPaneles";
import Spinner from "@/components/Spinner";
import { DashboardUIProvider, useDashboardUI } from "./ui";
import {
  SIDEBAR_GLOBAL_WIDTH,
  SIDEBAR_GLOBAL_COLLAPSED_WIDTH,
  NAVBAR_HEIGHT,
} from "./constants";
import { useRouter, usePathname } from "next/navigation";
import { ToastProvider } from "@/components/Toast";
import { PromptProvider } from "@/hooks/usePrompt";
import QueryProvider from "@/components/QueryProvider";

function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  // Añade en tu context esta propiedad si quieres permitir colapsar
  const {
    fullscreen,
    sidebarGlobalVisible = true,
    sidebarGlobalCollapsed,
    toggleSidebarVisible: toggleSidebar,
  } = useDashboardUI();
  const router = useRouter();
  const pathname = usePathname();
  const { usuario, loading } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsCompact(width < 1024);
    };
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
        <Spinner className="text-[var(--dashboard-accent)]" />
      </div>
    );
  }

  if (!usuario) return null;

  const sidebarWidth = sidebarGlobalVisible
    ? sidebarGlobalCollapsed
      ? SIDEBAR_GLOBAL_COLLAPSED_WIDTH
      : SIDEBAR_GLOBAL_WIDTH
    : '0px';

  // Altura del navbar
  const navbarHeight = NAVBAR_HEIGHT;
  const isAlmacenDetail = /^\/dashboard\/almacenes\/\d+(\/|$)/.test(pathname);
  const isPanelList = pathname === '/dashboard/paneles';
  const isPanelDetail = /^\/dashboard\/paneles\/[^/]+$/.test(pathname);
  const isAuditoriaDetail = /^\/dashboard\/auditorias\/\d+(\/|$)/.test(pathname);

  return (
    <div
      className={`min-h-screen bg-[var(--dashboard-bg)] transition-colors duration-300 relative ${
        fullscreen ? "dashboard-full" : ""
      } ${isMobile ? "dashboard-layout-mobile" : ""}`}
      data-oid="1sqtk2o"
    >
      {/* --- NAVBAR DASHBOARD FIJO --- */}
      {!(isAlmacenDetail || isPanelDetail || isAuditoriaDetail) && (
        <div
          className="fixed top-0 left-0 right-0 z-40 bg-[var(--dashboard-navbar)] border-b border-[var(--dashboard-border)]"
          style={{
            height: navbarHeight,
            paddingLeft:
              !fullscreen && sidebarGlobalVisible ? sidebarWidth : '0',
            transition: 'padding-left 0.3s ease'
          }}
          data-oid="taw.mzt"
        >
          {usuario && (
            isPanelList ? (
              <NavbarPaneles />
            ) : (
              <NavbarDashboard usuario={usuario} data-oid="m6qmdem" />
            )
          )}
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
            transform: isMobile && !sidebarGlobalVisible ? `translateX(calc(-1 * ${sidebarWidth}))` : 'none',
            paddingTop: isAlmacenDetail || isPanelDetail || isAuditoriaDetail ? 0 : navbarHeight // Asegura que el contenido del sidebar no se oculte bajo el navbar
          }}
          className={`fixed z-40 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] transition-all duration-300 dashboard-sidebar`}
          data-oid=".p64bxw"
        >
          <Sidebar usuario={usuario} data-oid="4t4x82h" />
        </div>
      )}

      {/* Overlay for sidebar on mobile/tablet */}
      {isCompact && sidebarGlobalVisible && (
        <div
          className="dashboard-overlay"
          onClick={() => toggleSidebar(false)}
        />
      )}


      {/* CONTENIDO PRINCIPAL */}
      <div
        className="flex flex-col min-h-screen transition-all duration-300 w-full"
        style={{
          paddingTop: isAlmacenDetail || isPanelDetail || isAuditoriaDetail ? 0 : navbarHeight,
          paddingLeft: !fullscreen ? sidebarWidth : 0,
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
          style={{ minHeight: `calc(100vh - ${isAlmacenDetail || isPanelDetail || isAuditoriaDetail ? '0px' : navbarHeight})` }}
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
    <QueryProvider>
      <DashboardUIProvider data-oid="-kp1hi9">
        <ToastProvider>
          <PromptProvider>
            <ProtectedDashboard data-oid="khrpzeo">{children}</ProtectedDashboard>
          </PromptProvider>
        </ToastProvider>
      </DashboardUIProvider>
    </QueryProvider>
  );
}
