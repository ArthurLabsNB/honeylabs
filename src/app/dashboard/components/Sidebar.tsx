"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDashboardUI } from "../ui";
import type { Usuario } from "@/types/usuario";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";
import {
  Home,
  Boxes,
  Bell,
  AppWindow,
  Network,
  FileText,
  FileStack,
  Receipt,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

// El tipo mínimo del usuario (ajusta según tu modelo)

const menuItemStyle =
  "flex items-center gap-3 px-4 py-2 text-[15px] rounded-lg transition-all duration-150 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]";

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
    key: "tools",
    label: "Herramientas",
    icon: <AppWindow className="dashboard-sidebar-icon" />,
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
    action: true,
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: <FileText className="dashboard-sidebar-icon" data-oid="wzewnea" />,
    path: "/dashboard/reportes",
    allowed: ["admin", "administrador", "institucional", "empresarial"],
  },
  {
    key: "admin",
    label: "Admin",
    icon: <Settings className="dashboard-sidebar-icon" data-oid="93xzl3d" />,
    path: "/dashboard/admin",
    allowed: ["admin", "administrador"],
  },
];

export default function Sidebar({ usuario }: { usuario: Usuario }) {
  const {
    sidebarGlobalCollapsed: collapsed,
    toggleSidebarCollapsed,
    toggleToolsSidebar,
  } = useDashboardUI();
  const pathname = usePathname();
  const router = useRouter();

  if (!usuario || !usuario.nombre) {
    return (
      <aside
        className="dashboard-sidebar flex flex-col w-[72px] h-screen fixed top-0 left-0 z-30 justify-center items-center bg-[var(--dashboard-sidebar)] shadow-xl"
        data-oid="skizcvj"
      >
        <span className="text-[var(--dashboard-accent)]" data-oid="gguzj:m">
          Cargando...
        </span>
      </aside>
    );
  }

  const mainRole = getMainRole(usuario)?.toLowerCase();
  const tipo = normalizeTipoCuenta(
    mainRole === "admin" ? "admin" : usuario.tipoCuenta,
  );

  const filteredMenu = sidebarMenu.filter((item) =>
    item.allowed.includes(tipo),
  );

  return (
    <aside
      className={`
        dashboard-sidebar flex flex-col transition-all duration-200 shadow-xl
        ${collapsed ? "w-[72px]" : "w-56"}
        h-screen fixed top-0 left-0 z-30
        bg-[var(--dashboard-sidebar)] border-r border-[var(--dashboard-border)]
      `}
      style={{
        minHeight: "100vh",
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
          const handleClick = () => {
            if (item.action) {
              toggleToolsSidebar();
            } else if (item.path) {
              router.push(item.path);
            }
          };
          return (
            <button
              key={item.key}
              onClick={handleClick}
              className={`${menuItemStyle} ${
                active
                  ? "bg-[var(--dashboard-accent)]/20 text-white font-semibold"
                  : "hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.label : ""}
              tabIndex={0}
              data-oid="ggwglbz"
            >
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
            </button>
          );
        })}
      </nav>

      {/* Footer: usuario */}
      <div className="dashboard-sidebar-footer mb-4" data-oid="3f:v6ch">
        {usuario.avatarUrl ? (
          <img
            src={usuario.avatarUrl}
            alt="Avatar"
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
