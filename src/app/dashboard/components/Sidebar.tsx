"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDashboardUI } from "../ui";
import type { Usuario } from "@/types/usuario";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";
import Spinner from "@/components/Spinner";
import {
  Home,
  Boxes,
  Bell,
  Network,
  FileText,
  FileStack,
  Settings,
  Star,
  BarChart,
  Palette,
  Eye,
  Sliders,
  Shuffle,
  Activity,
  Mic,
  Search,
  Key,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
} from "lucide-react";

// El tipo mínimo del usuario (ajusta según tu modelo)

const menuItemStyle =
  "flex items-center gap-2 px-3 py-2 text-[14px] rounded-lg transition-all duration-150 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]";

const sidebarMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <Home className="dashboard-sidebar-icon" data-oid="i99r0xl" />,
    path: "/dashboard",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "almacenes",
    label: "Almacenes",
    icon: <Boxes className="dashboard-sidebar-icon" data-oid="fhr-clw" />,
    path: "/dashboard/almacenes",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "auditorias",
    label: "Auditorías",
    icon: <FileStack className="dashboard-sidebar-icon" data-oid="audits" />,
    path: "/dashboard/auditorias",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "paneles",
    label: "Paneles",
    icon: <Bell className="dashboard-sidebar-icon" data-oid="piz-ico" />,
    path: "/dashboard/paneles",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "app",
    label: "App",
    icon: <Download className="dashboard-sidebar-icon" />,
    path: "/dashboard/app",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
];

export default function Sidebar({ usuario }: { usuario: Usuario }) {
  const {
    sidebarGlobalCollapsed: collapsed,
    toggleSidebarCollapsed,
  } = useDashboardUI();
  const pathname = usePathname();

  if (!usuario || !usuario.nombre) {
    return (
      <aside
        className="dashboard-sidebar flex flex-col w-[4.5rem] min-w-[4.5rem] h-screen fixed top-0 left-0 z-30 justify-center items-center bg-[var(--dashboard-sidebar)] shadow-xl"
        data-oid="skizcvj"
      >
        <Spinner className="text-[var(--dashboard-accent)]" />
      </aside>
    );
  }

  const mainRole = getMainRole(usuario)?.toLowerCase();
  const tipo = normalizeTipoCuenta(
    mainRole === "admin" || mainRole === "administrador"
      ? "admin"
      : usuario.tipoCuenta,
  );

  const filteredMenu =
    mainRole === "admin" || mainRole === "administrador"
      ? sidebarMenu
      : sidebarMenu.filter((item) => item.allowed.includes(tipo));

  return (
    <aside
      className="dashboard-sidebar flex flex-col transition-all duration-200 shadow-xl fixed top-0 left-0 z-30 bg-[var(--dashboard-sidebar)] border-r border-[var(--dashboard-border)]"
      style={{
        minHeight: '100vh',
        width: collapsed
          ? 'var(--sidebar-collapsed-width)'
          : 'var(--sidebar-width)',
        minWidth: collapsed
          ? 'var(--sidebar-collapsed-width)'
          : 'var(--sidebar-width)',
      }}
      data-oid="ru25x:g"
    >
      {/* Logo y botón colapsar */}
      <div
        className="flex items-center justify-between px-4 h-20 border-b border-[var(--dashboard-border)]"
        data-oid="vycic85"
      >
        <span
          className={`font-extrabold text-lg tracking-widest transition-all ${
            collapsed ? "hidden" : "block"
          }`}
          data-oid="rpvw8q:"
        >
          HoneyLabs
        </span>
        <button
          onClick={toggleSidebarCollapsed}
          className="rounded-full p-2 hover:bg-white/15 hover:backdrop-blur-sm transition"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          data-oid="fk94:.u"
        >
          {collapsed ? (
            <ChevronRight
              className="w-6 h-6 text-[var(--dashboard-accent)]"
              data-oid=":-cl_oo"
            />
          ) : (
            <ChevronLeft
              className="w-6 h-6 text-[var(--dashboard-accent)]"
              data-oid="jmh-_9u"
            />
          )}
        </button>
      </div>

      {/* Menú navegación */}
      <nav className="flex-1 py-6 px-2 flex flex-col gap-1" data-oid="_fmifu.">
        {filteredMenu.map((item) => {
          const active = item.path
            ? item.path === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.path || pathname.startsWith(`${item.path}/`)
            : false;
          const handleClick = () => {};
          const classes = `${menuItemStyle} ${
            active
              ? "bg-[var(--dashboard-accent)]/20 text-white font-semibold"
              : "hover:bg-white/10 hover:text-white"
          } ${collapsed ? "justify-center px-2" : ""}`;
          const content = (
            <>
              <div className="flex items-center justify-center w-10 h-10">
                {item.icon}
              </div>
              <span
                className={`whitespace-nowrap transition-all ${
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto ml-2"
                }`}
                data-oid="2j.rcq2"
              >
                {item.label}
              </span>
              {active && !collapsed && (
                <span
                  className="absolute right-2 w-2 h-2 rounded-full bg-[var(--dashboard-accent)]"
                  data-oid="av0rn45"
                ></span>
              )}
            </>
          );
          return (
            <Link
              href={item.path as string}
              key={item.key}
              className={classes}
              title={collapsed ? item.label : ""}
              tabIndex={0}
              data-oid="ggwglbz"
            >
              {content}
            </Link>
          );
        })}
      </nav>

      {/* Footer: usuario */}
      <div className="dashboard-sidebar-footer mb-4" data-oid="3f:v6ch">
        {usuario.avatarUrl ? (
          <img
            src={usuario.avatarUrl}
            alt="Avatar"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full mb-2 border-2 border-[var(--dashboard-accent)]"
            data-oid="zye-v51"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full bg-[var(--dashboard-accent)]/30 flex items-center justify-center mb-2"
            data-oid="cbtdm:g"
          >
            <User
              className="w-7 h-7 text-[var(--dashboard-navbar)]"
              data-oid="q6ir15y"
            />
          </div>
        )}
        <span
          className={`font-bold text-sm ${collapsed ? "hidden" : "block"}`}
          data-oid="gyk:8wh"
        >
          {usuario.nombre}
        </span>
        <span
          className={`text-xs text-[var(--dashboard-accent)] opacity-80 ${collapsed ? "hidden" : "block"}`}
          data-oid=":dpvkvq"
        >
          {typeof tipo === "string"
            ? tipo.charAt(0).toUpperCase() + tipo.slice(1)
            : "Invitado"}
        </span>
      </div>
    </aside>
  );
}
