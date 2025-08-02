"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDashboardUI } from "../ui";
import type { Usuario } from "@/types/usuario";
import { getMainRole, normalizeRol, normalizeTipoCuenta } from "@lib/permisos";
import Spinner from "@/components/Spinner";
import {
  Home,
  Boxes,
  Box,
  Bell,
  Download,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

/* Estilo base de ítems */
const menuItemStyle =
  "relative flex items-center gap-2 px-3 py-2 text-[14px] rounded-lg transition-all duration-150 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]";

/* Menú */
const sidebarMenu = [
  { key: "dashboard", label: "Dashboard", icon: <Home className="dashboard-sidebar-icon" />, path: "/dashboard", allowed: ["admin","administrador","institucional","empresarial","individual"] },
  { key: "almacenes", label: "Almacenes", icon: <Boxes className="dashboard-sidebar-icon" />, path: "/dashboard/almacenes", allowed: ["admin","administrador","institucional","empresarial","individual"] },
  { key: "inventario", label: "Inventario", icon: <Box className="dashboard-sidebar-icon" />, path: "/dashboard/inventario", allowed: ["admin","administrador","institucional","empresarial","individual"] },
  { key: "paneles", label: "Paneles", icon: <Bell className="dashboard-sidebar-icon" />, path: "/dashboard/paneles", allowed: ["admin","administrador","institucional","empresarial","individual"] },
  { key: "app", label: "App", icon: <Download className="dashboard-sidebar-icon" />, path: "/dashboard/app", allowed: ["admin","administrador","institucional","empresarial","individual"] },
];

export default function Sidebar({ usuario }: { usuario: Usuario | null | undefined }) {
  const { sidebarGlobalCollapsed: collapsed, toggleSidebarCollapsed } = useDashboardUI();
  const pathname = usePathname();

  // Loading: sólo mientras no exista usuario
  if (!usuario) {
    return (
      <aside className="dashboard-sidebar flex flex-col w-[4.5rem] min-w-[4.5rem] h-screen fixed top-0 left-0 z-30 justify-center items-center bg-[var(--dashboard-sidebar)] shadow-xl">
        <Spinner className="text-[var(--dashboard-accent)]" />
      </aside>
    );
  }

  // Rol/tipo robustos
  const r = getMainRole(usuario as any);
  const mainRole = normalizeRol(typeof r === "string" ? r : r?.nombre ?? "");
  const tipo = normalizeTipoCuenta(
    mainRole === "admin" || mainRole === "administrador" ? "admin" : String((usuario as any).tipoCuenta ?? "")
  );

  const filteredMenu =
    mainRole === "admin" || mainRole === "administrador"
      ? sidebarMenu
      : sidebarMenu.filter(i => i.allowed.includes(tipo));

  // Acepta sesiones que sólo aportan email
  const displayName =
    usuario?.nombre?.trim() || usuario?.correo || usuario?.email || "";

  return (
    <aside
      className="dashboard-sidebar flex flex-col transition-all duration-200 shadow-xl fixed top-0 left-0 z-30 bg-[var(--dashboard-sidebar)] border-r border-[var(--dashboard-border)]"
      style={{
        minHeight: "100vh",
        width: collapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
        minWidth: collapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-20 border-b border-[var(--dashboard-border)]">
        <span className={`font-extrabold text-lg tracking-widest transition-all ${collapsed ? "hidden" : "block"}`}>
          HoneyLabs
        </span>
        <button
          onClick={toggleSidebarCollapsed}
          className="rounded-full p-2 hover:bg-white/15 hover:backdrop-blur-sm transition"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? (
            <ChevronRight className="w-6 h-6 text-[var(--dashboard-accent)]" />
          ) : (
            <ChevronLeft className="w-6 h-6 text-[var(--dashboard-accent)]" />
          )}
        </button>
      </div>

      {/* Menú */}
      <nav className="flex-1 py-6 px-2 flex flex-col gap-1">
        {filteredMenu.map((item) => {
          const active = item.path
            ? item.path === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.path || pathname.startsWith(`${item.path}/`)
            : false;

          const classes = `${menuItemStyle} ${
            active ? "bg-[var(--dashboard-accent)]/20 text-white font-semibold" : "hover:bg-white/10 hover:text-white"
          } ${collapsed ? "justify-center px-2" : ""}`;

          return (
            <Link
              href={item.path}
              key={item.key}
              className={classes}
              title={collapsed ? item.label : ""}
              tabIndex={0}
            >
              <div className="flex items-center justify-center w-10 h-10">{item.icon}</div>
              <span className={`whitespace-nowrap transition-all ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto ml-2"}`}>
                {item.label}
              </span>
              {active && !collapsed && <span className="absolute right-2 w-2 h-2 rounded-full bg-[var(--dashboard-accent)]" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer usuario */}
      <div className="dashboard-sidebar-footer mb-4 flex flex-col items-center px-3">
        {(usuario as any).avatarUrl ? (
          <img
            src={(usuario as any).avatarUrl}
            alt="Avatar"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full mb-2 border-2 border-[var(--dashboard-accent)]"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--dashboard-accent)]/30 flex items-center justify-center mb-2">
            <User className="w-7 h-7 text-[var(--dashboard-navbar)]" />
          </div>
        )}

        {/* Nombre del usuario (siempre que no esté colapsado) */}
        <span className={`font-bold text-sm ${collapsed ? "hidden" : "block"}`}>
          {displayName}
        </span>
        <span className={`text-xs text-[var(--dashboard-accent)] opacity-80 ${collapsed ? "hidden" : "block"}`}>
          {tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1) : "Invitado"}
        </span>
      </div>
    </aside>
  );
}
