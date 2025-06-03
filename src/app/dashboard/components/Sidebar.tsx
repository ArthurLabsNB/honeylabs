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
    icon: <Home className="dashboard-sidebar-icon" data-oid="dv.0w-s" />,
    path: "/dashboard",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "almacenes",
    label: "Almacenes",
    icon: <Boxes className="dashboard-sidebar-icon" data-oid="fr37y_p" />,
    path: "/dashboard/almacenes",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "alertas",
    label: "Alertas",
    icon: <Bell className="dashboard-sidebar-icon" data-oid="0mtp8lf" />,
    path: "/dashboard/alertas",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "appcenter",
    label: "App Center",
    icon: <AppWindow className="dashboard-sidebar-icon" data-oid="dwu7n4e" />,
    path: "/dashboard/app-center",
    allowed: ["admin", "institucional", "empresarial"],
  },
  {
    key: "network",
    label: "Network",
    icon: <Network className="dashboard-sidebar-icon" data-oid="y__.q9x" />,
    path: "/dashboard/network",
    allowed: ["admin", "institucional"],
  },
  {
    key: "plantillas",
    label: "Plantillas",
    icon: <FileStack className="dashboard-sidebar-icon" data-oid="v3:2cjf" />,
    path: "/dashboard/plantillas",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: <FileText className="dashboard-sidebar-icon" data-oid="pkrv-1s" />,
    path: "/dashboard/reportes",
    allowed: ["admin", "institucional", "empresarial"],
  },
  {
    key: "billing",
    label: "Billing",
    icon: <Receipt className="dashboard-sidebar-icon" data-oid="x8tkxga" />,
    path: "/dashboard/billing",
    allowed: ["admin", "institucional"],
  },
  {
    key: "admin",
    label: "Admin",
    icon: <Settings className="dashboard-sidebar-icon" data-oid="y29vs_0" />,
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
      <aside
        className="dashboard-sidebar flex flex-col w-20 h-screen sticky top-0 z-30 justify-center items-center"
        data-oid="9cm8bwq"
      >
        <span className="text-[var(--dashboard-accent)]" data-oid="r_i-5uq">
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
      className={`dashboard-sidebar flex flex-col transition-all duration-200 shadow-xl ${
        collapsed ? "w-20" : "w-64"
      } h-screen sticky top-0 z-30`}
      data-oid="lauejtk"
    >
      {/* Logo y botón colapsar */}
      <div
        className="flex items-center justify-between px-4 h-20 border-b border-[var(--dashboard-border)]"
        data-oid="u.std6k"
      >
        <span
          className={`font-extrabold text-lg tracking-widest transition-all ${
            collapsed ? "hidden" : "block"
          }`}
          data-oid="bd3y04l"
        >
          HoneyLabs
        </span>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-full p-2 hover:bg-white/15 hover:backdrop-blur-sm transition"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          data-oid="z.3sbgz"
        >
          {collapsed ? (
            <ChevronRight
              className="w-6 h-6 text-[var(--dashboard-accent)]"
              data-oid="lqgxzg2"
            />
          ) : (
            <ChevronLeft
              className="w-6 h-6 text-[var(--dashboard-accent)]"
              data-oid="qjf919r"
            />
          )}
        </button>
      </div>

      {/* Menú navegación */}
      <nav className="flex-1 py-6 px-2 flex flex-col gap-1" data-oid="4x9q:9r">
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
              data-oid="-1.j8yu"
            >
              {item.icon}
              <span
                className={`whitespace-nowrap transition-all ${
                  collapsed
                    ? "opacity-0 w-0 overflow-hidden"
                    : "opacity-100 w-auto ml-2"
                }`}
                data-oid="c:sasih"
              >
                {item.label}
              </span>
              {active && !collapsed && (
                <span
                  className="absolute right-2 w-2 h-2 rounded-full bg-[var(--dashboard-accent)]"
                  data-oid="u:xveq2"
                ></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: usuario */}
      <div className="dashboard-sidebar-footer" data-oid="tzcabex">
        {usuario.avatarUrl ? (
          <img
            src={usuario.avatarUrl}
            alt="Avatar"
            className="w-12 h-12 rounded-full mb-2 border-2 border-[var(--dashboard-accent)]"
            data-oid="ir6-d7y"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full bg-[var(--dashboard-accent)]/30 flex items-center justify-center mb-2"
            data-oid="bd19_qv"
          >
            <User
              className="w-7 h-7 text-[var(--dashboard-navbar)]"
              data-oid="f.b0sjf"
            />
          </div>
        )}
        <span
          className={`font-bold text-sm ${collapsed ? "hidden" : "block"}`}
          data-oid=":odh-xe"
        >
          {usuario.nombre}
        </span>
        <span
          className={`text-xs text-[var(--dashboard-accent)] opacity-80 ${collapsed ? "hidden" : "block"}`}
          data-oid="xr.7zs1"
        >
          {typeof tipo === "string"
            ? tipo.charAt(0).toUpperCase() + tipo.slice(1)
            : "Invitado"}
        </span>
      </div>
    </aside>
  );
}
