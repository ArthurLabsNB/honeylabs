"use client";

import {
  Home,
  History,
  Box,
  FileText,
  Folder,
  Plus,
  Settings,
  BookOpen,
  Tag,
  Layers,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardUI } from "../../ui"; // para saber si sidebar global está colapsado
import {
  SIDEBAR_GLOBAL_WIDTH,
  SIDEBAR_GLOBAL_COLLAPSED_WIDTH,
  NAVBAR_HEIGHT,
  ALMACEN_NAVBAR_HEIGHT,
} from "../../constants";
import useSession from "@/hooks/useSession";
import { hasManagePerms } from "@lib/permisos";

// --- Estilos base ---
const sectionStyle =
  "mb-3 px-4 pt-4 text-xs font-medium text-gray-400 uppercase tracking-wider";
const menuItemStyle =
  "flex items-center gap-3 px-4 py-2 text-[15px] rounded-lg hover:bg-white/10 text-gray-300 transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]";

// Helper para enlaces del menú
function MenuLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${menuItemStyle} ${
        isActive
          ? "bg-[var(--dashboard-accent)]/20 text-white font-semibold"
          : "hover:text-white"
      }`}
      title={label}
      tabIndex={0}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={`w-5 h-5 transition-colors ${
          isActive
            ? "text-[var(--dashboard-accent)]"
            : "text-gray-400 group-hover:text-white"
        }`}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function AlmacenSidebar() {
  // Lee el estado del sidebar global para alinear el sidebar de almacenes
  const { sidebarGlobalCollapsed, sidebarGlobalVisible, fullscreen } = useDashboardUI();
  const { usuario } = useSession();

  const allowCreate = usuario ? hasManagePerms(usuario) : false;

  // Calcula el left según si el global está expandido o colapsado
  const sidebarLeft = fullscreen
    ? 0
    : sidebarGlobalVisible
      ? sidebarGlobalCollapsed
        ? SIDEBAR_GLOBAL_COLLAPSED_WIDTH
        : SIDEBAR_GLOBAL_WIDTH
      : 0;

  // Debes usar la misma altura de tus navbars globales (ajusta según tus constantes)
  const navbarsHeight = `calc(var(--navbar-height, ${NAVBAR_HEIGHT}px) + var(--almacen-navbar-height, ${ALMACEN_NAVBAR_HEIGHT}px))`;

  // --- Sidebar de almacenes ---
  return (
    <aside
      className="
        fixed z-30
        w-64 h-[calc(100vh-120px)]
        bg-[var(--dashboard-sidebar)]
        border-r border-[var(--dashboard-border)]
        shadow-sm
        transition-all
      "
      style={{
        left: sidebarLeft,
        top: `calc(${navbarsHeight})`,
        height: `calc(100vh - ${navbarsHeight})`,
      }}
    >
      <nav className="flex flex-col gap-1">
        <MenuLink href="/dashboard/almacenes" icon={Home} label="Inicio" />
        <MenuLink href="/dashboard/almacenes/inventario" icon={Box} label="Inventario" />
        <MenuLink href="/dashboard/almacenes/operaciones" icon={History} label="Operaciones" />
        <MenuLink href="/dashboard/almacenes/reportes" icon={FileText} label="Reportes" />
        <MenuLink href="/dashboard/almacenes/archivos" icon={Folder} label="Archivos" />
        {allowCreate && (
          <MenuLink href="/dashboard/almacenes/nuevo" icon={Plus} label="Nuevo" />
        )}
        <div className="my-2 border-t border-white/10"></div>
        <MenuLink href="/dashboard/almacenes/configuracion" icon={Settings} label="Configuración" />
        <MenuLink href="/dashboard/almacenes/ayuda" icon={BookOpen} label="Ayuda" />
      </nav>
    </aside>
  );
}
