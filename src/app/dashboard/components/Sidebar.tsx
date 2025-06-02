"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
type Usuario = {
  nombre: string;
  avatarUrl?: string | null;
  rol?: string;
  tipoCuenta?: string;
};

const sidebarMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <Home className="dashboard-sidebar-icon" />,
    path: "/dashboard",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "almacenes",
    label: "Almacenes",
    icon: <Boxes className="dashboard-sidebar-icon" />,
    path: "/dashboard/almacenes",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "alertas",
    label: "Alertas",
    icon: <Bell className="dashboard-sidebar-icon" />,
    path: "/dashboard/alertas",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "appcenter",
    label: "App Center",
    icon: <AppWindow className="dashboard-sidebar-icon" />,
    path: "/dashboard/app-center",
    allowed: ["admin", "institucional", "empresarial"],
  },
  {
    key: "network",
    label: "Network",
    icon: <Network className="dashboard-sidebar-icon" />,
    path: "/dashboard/network",
    allowed: ["admin", "institucional"],
  },
  {
    key: "plantillas",
    label: "Plantillas",
    icon: <FileStack className="dashboard-sidebar-icon" />,
    path: "/dashboard/plantillas",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: <FileText className="dashboard-sidebar-icon" />,
    path: "/dashboard/reportes",
    allowed: ["admin", "institucional", "empresarial"],
  },
  {
    key: "billing",
    label: "Billing",
    icon: <Receipt className="dashboard-sidebar-icon" />,
    path: "/dashboard/billing",
    allowed: ["admin", "institucional"],
  },
  {
    key: "admin",
    label: "Admin",
    icon: <Settings className="dashboard-sidebar-icon" />,
    path: "/dashboard/admin",
    allowed: ["admin"],
  },
];

export default function Sidebar({ usuario }: { usuario: Usuario }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Puedes agregar un loading aquí si lo quieres (pero normalmente ya está resuelto antes de cargar el dashboard)
  if (!usuario || (!usuario.rol && !usuario.tipoCuenta) || !usuario.nombre) {
    return (
      <aside className="dashboard-sidebar flex flex-col w-20 h-screen sticky top-0 z-30 justify-center items-center">
        <span className="text-[var(--dashboard-accent)]">Cargando...</span>
      </aside>
    );
  }

  const tipo =
    usuario.rol === "admin"
      ? "admin"
      : usuario.tipoCuenta ?? "estandar";

  const filteredMenu = sidebarMenu.filter((item) =>
    item.allowed.includes(tipo)
  );

  return (
    <aside
      className={`dashboard-sidebar flex flex-col transition-all duration-200 shadow-xl ${
        collapsed ? "w-20" : "w-64"
      } h-screen sticky top-0 z-30`}
    >
      {/* Logo y botón colapsar */}
      <div className="flex items-center justify-between px-4 h-20 border-b border-[var(--dashboard-border)]">
        <span
          className={`font-extrabold text-lg tracking-widest transition-all ${
            collapsed ? "hidden" : "block"
          }`}
        >
          HoneyLabs
        </span>
        <button
          onClick={() => setCollapsed((c) => !c)}
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

      {/* Menú navegación */}
      <nav className="flex-1 py-6 px-2 flex flex-col gap-1">
        {filteredMenu.map((item) => {
          const active = pathname === item.path;
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
            >
              {item.icon}
              <span
                className={`whitespace-nowrap transition-all ${
                  collapsed
                    ? "opacity-0 w-0 overflow-hidden"
                    : "opacity-100 w-auto ml-2"
                }`}
              >
                {item.label}
              </span>
              {active && !collapsed && (
                <span className="absolute right-2 w-2 h-2 rounded-full bg-[var(--dashboard-accent)]"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: usuario */}
      <div className="dashboard-sidebar-footer">
        {usuario.avatarUrl ? (
          <img
            src={usuario.avatarUrl}
            alt="Avatar"
            className="w-12 h-12 rounded-full mb-2 border-2 border-[var(--dashboard-accent)]"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--dashboard-accent)]/30 flex items-center justify-center mb-2">
            <User className="w-7 h-7 text-[var(--dashboard-navbar)]" />
          </div>
        )}
        <span className={`font-bold text-sm ${collapsed ? "hidden" : "block"}`}>
          {usuario.nombre}
        </span>
        <span className={`text-xs text-[var(--dashboard-accent)] opacity-80 ${collapsed ? "hidden" : "block"}`}>
          {typeof tipo === "string"
            ? tipo.charAt(0).toUpperCase() + tipo.slice(1)
            : "Invitado"}
        </span>
      </div>
    </aside>
  );
}
