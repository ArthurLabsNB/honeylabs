"use client";

import {
  Home,
  Star,
  History,
  ArrowDownCircle,
  ArrowUpCircle,
  Move,
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
import { useEffect, useState } from "react";
import { useDashboardUI } from "../../ui"; // para saber si sidebar global está colapsado
import {
  SIDEBAR_GLOBAL_WIDTH,
  SIDEBAR_GLOBAL_COLLAPSED_WIDTH,
} from "../../constants";
import type { Usuario } from "@/types/usuario";
import { jsonOrNull } from "@lib/http";

function getMainRole(u: any): string | undefined {
  return u?.rol || u?.roles?.[0]?.nombre;
}

function hasManagePerms(u: any): boolean {
  const rol = getMainRole(u)?.toLowerCase();
  const tipo = (u?.tipoCuenta ?? "").toLowerCase();
  const plan = (u?.plan?.nombre ?? "").toLowerCase();
  if (rol === "admin" || rol === "administrador") return true;
  if (["institucional", "empresarial"].includes(tipo)) return true;
  if (["empresarial", "institucional", "pro"].includes(plan)) return true;
  return false;
}

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

export default function AlmacenSidebar({
  mode = "list",
}: {
  mode?: "list" | "detail";
}) {
  // Lee el estado del sidebar global para alinear el sidebar de almacenes
  const { sidebarGlobalCollapsed, sidebarGlobalVisible, fullscreen } = useDashboardUI();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then(jsonOrNull)
      .then((d) => (d?.success ? setUsuario(d.usuario) : setUsuario(null)))
      .catch(() => setUsuario(null));
  }, []);

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
  const navbarsHeight = "calc(var(--navbar-height, 64px) + var(--almacen-navbar-height, 56px))";

  // --- Sidebar modo detalle (un almacén específico) ---
  if (mode === "detail") {
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
          <h3 className={sectionStyle}>Navegación</h3>
          <MenuLink href="#" icon={Box} label="Inventario" />
          <MenuLink href="#categorias" icon={Tag} label="Categorías" />
          <MenuLink href="#ubicaciones" icon={Layers} label="Ubicaciones" />
          <MenuLink href="#movimientos" icon={History} label="Movimientos" />
          <MenuLink href="#reportes" icon={FileText} label="Reportes" />
          <div className="my-2 border-t border-white/10"></div>
          <h3 className={sectionStyle}>Configuración</h3>
          <MenuLink href="#usuarios" icon={Users} label="Usuarios" />
          <MenuLink href="#configuracion" icon={Settings} label="Ajustes" />
          <MenuLink href="#ayuda" icon={BookOpen} label="Ayuda" />
        </nav>
      </aside>
    );
  }

  // --- Sidebar modo lista (todos los almacenes) ---
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
        <MenuLink href="/dashboard/almacenes/favoritos" icon={Star} label="Favoritos" />
        <MenuLink href="/dashboard/almacenes/movimientos" icon={History} label="Movimientos" />
        <MenuLink href="/dashboard/almacenes/entradas" icon={ArrowDownCircle} label="Entradas" />
        <MenuLink href="/dashboard/almacenes/salidas" icon={ArrowUpCircle} label="Salidas" />
        <MenuLink href="/dashboard/almacenes/transferencias" icon={Move} label="Transferencias" />
        <MenuLink href="/dashboard/almacenes/inventario" icon={Box} label="Inventario global" />
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
