"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDashboardUI } from "../ui";
import type { Usuario } from "@/types/usuario";
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

const sidebarMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <Home className="dashboard-sidebar-icon" data-oid="i99r0xl" />,
    path: "/dashboard",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "almacenes",
    label: "Almacenes",
    icon: <Boxes className="dashboard-sidebar-icon" data-oid="fhr-clw" />,
    path: "/dashboard/almacenes",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "alertas",
    label: "Alertas",
    icon: <Bell className="dashboard-sidebar-icon" data-oid=".ea6mni" />,
    path: "/dashboard/alertas",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "appcenter",
    label: "App Center",
    icon: <AppWindow className="dashboard-sidebar-icon" data-oid="am_k.6c" />,
    path: "/dashboard/app-center",
    allowed: ["admin", "institucional", "empresarial"],
  },
  {
    key: "network",
    label: "Network",
    icon: <Network className="dashboard-sidebar-icon" data-oid="z-33x83" />,
    path: "/dashboard/network",
    allowed: ["admin", "institucional"],
  },
  {
    key: "plantillas",
    label: "Plantillas",
    icon: <FileStack className="dashboard-sidebar-icon" data-oid="0vwt0b-" />,
    path: "/dashboard/plantillas",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: <FileText className="dashboard-sidebar-icon" data-oid="wzewnea" />,
    path: "/dashboard/reportes",
    allowed: ["admin", "institucional", "empresarial"],
  },
  {
    key: "billing",
    label: "Billing",
    icon: <Receipt className="dashboard-sidebar-icon" data-oid="ny9b2pu" />,
    path: "/dashboard/billing",
    allowed: ["admin", "institucional"],
  },
  {
    key: "admin",
    label: "Admin",
    icon: <Settings className="dashboard-sidebar-icon" data-oid="93xzl3d" />,
    path: "/dashboard/admin",
    allowed: ["admin"],
  },
];

export default function Sidebar({ usuario }: { usuario: Usuario }) {
  const { sidebarGlobalCollapsed: collapsed, toggleSidebarCollapsed } =
    useDashboardUI();
  const pathname = usePathname();
  const router = useRouter();

  if (!usuario || (!usuario.rol && !usuario.tipoCuenta) || !usuario.nombre) {
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

  const tipo =
    usuario.rol === "admin" ? "admin" : (usuario.tipoCuenta ?? "estandar");

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
          const active = pathname.startsWith(item.path);
          return (
            <button
              key={item.key}
              onClick={() => router.push(item.path)}
              className={`
                dashboard-sidebar-item group relative
                ${active ? "active" : ""}
                ${collapsed ? "justify-center px-0" : ""}
                hover:bg-white/10 hover:backdrop-blur-sm
                focus:bg-white/15
                active:bg-white/20
              `}
              title={collapsed ? item.label : ""}
              tabIndex={0}
              data-oid="ggwglbz"
            >
              <div className="flex items-center justify-center w-10 h-10">
                {item.icon}
              </div>
              <span
                className={`whitespace-nowrap transition-all ${
                  collapsed
                    ? "opacity-0 w-0 overflow-hidden"
                    : "opacity-100 w-auto ml-2"
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
