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
    icon: <Home className="dashboard-sidebar-icon" data-oid="y5.gre2" />,
    path: "/dashboard",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "almacenes",
    label: "Almacenes",
    icon: <Boxes className="dashboard-sidebar-icon" data-oid="kx4.f-z" />,
    path: "/dashboard/almacenes",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "alertas",
    label: "Alertas",
    icon: <Bell className="dashboard-sidebar-icon" data-oid="ma4rz2d" />,
    path: "/dashboard/alertas",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "appcenter",
    label: "App Center",
    icon: <AppWindow className="dashboard-sidebar-icon" data-oid="y_imcvi" />,
    path: "/dashboard/app-center",
    allowed: ["admin", "institucional", "empresarial"],
  },
  {
    key: "network",
    label: "Network",
    icon: <Network className="dashboard-sidebar-icon" data-oid="2w8j2-e" />,
    path: "/dashboard/network",
    allowed: ["admin", "institucional"],
  },
  {
    key: "plantillas",
    label: "Plantillas",
    icon: <FileStack className="dashboard-sidebar-icon" data-oid="ip3gtrd" />,
    path: "/dashboard/plantillas",
    allowed: ["admin", "institucional", "empresarial", "estandar"],
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: <FileText className="dashboard-sidebar-icon" data-oid="t:1y507" />,
    path: "/dashboard/reportes",
    allowed: ["admin", "institucional", "empresarial"],
  },
  {
    key: "billing",
    label: "Billing",
    icon: <Receipt className="dashboard-sidebar-icon" data-oid="mzg:phg" />,
    path: "/dashboard/billing",
    allowed: ["admin", "institucional"],
  },
  {
    key: "admin",
    label: "Admin",
    icon: <Settings className="dashboard-sidebar-icon" data-oid="i7o10ry" />,
    path: "/dashboard/admin",
    allowed: ["admin"],
  },
];

export default function Sidebar({ usuario }: { usuario: Usuario }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (!usuario || (!usuario.rol && !usuario.tipoCuenta) || !usuario.nombre) {
    return (
      <aside
        className="dashboard-sidebar flex flex-col w-20 h-screen fixed top-0 left-0 z-30 justify-center items-center bg-[var(--dashboard-sidebar)] shadow-xl"
        data-oid="xh-w7cu"
      >
        <span className="text-[var(--dashboard-accent)]" data-oid="2v_z_xg">
          Cargando...
        </span>
      </aside>
    );
  }

  const tipo =
    usuario.rol === "admin" ? "admin" : usuario.tipoCuenta ?? "estandar";

  const filteredMenu = sidebarMenu.filter((item) =>
    item.allowed.includes(tipo),
  );

  return (
    <aside
      className={`
        dashboard-sidebar flex flex-col transition-all duration-200 shadow-xl
        ${collapsed ? "w-20" : "w-64"}
        h-screen fixed top-0 left-0 z-30
        bg-[var(--dashboard-sidebar)] border-r border-[var(--dashboard-border)]
      `}
      style={{
        minHeight: "100vh",
      }}
      data-oid="5bc7f7v"
    >
      {/* Logo y botón colapsar */}
      <div
        className="flex items-center justify-between px-4 h-20 border-b border-[var(--dashboard-border)]"
        data-oid="v45:z42"
      >
        <span
          className={`font-extrabold text-lg tracking-widest transition-all ${
            collapsed ? "hidden" : "block"
          }`}
          data-oid="qpz053_"
        >
          HoneyLabs
        </span>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-full p-2 hover:bg-white/15 hover:backdrop-blur-sm transition"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          data-oid="_1n:9hf"
        >
          {collapsed ? (
            <ChevronRight className="w-6 h-6 text-[var(--dashboard-accent)]" data-oid="g0cnjbp" />
          ) : (
            <ChevronLeft className="w-6 h-6 text-[var(--dashboard-accent)]" data-oid=".ezj2xq" />
          )}
        </button>
      </div>

      {/* Menú navegación */}
      <nav className="flex-1 py-6 px-2 flex flex-col gap-1" data-oid="8r1zf-8">
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
              data-oid="9tacdy8"
            >
              {item.icon}
              <span
                className={`whitespace-nowrap transition-all ${
                  collapsed
                    ? "opacity-0 w-0 overflow-hidden"
                    : "opacity-100 w-auto ml-2"
                }`}
                data-oid=":p.na_y"
              >
                {item.label}
              </span>
              {active && !collapsed && (
                <span
                  className="absolute right-2 w-2 h-2 rounded-full bg-[var(--dashboard-accent)]"
                  data-oid="zfp:tm5"
                ></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: usuario */}
      <div className="dashboard-sidebar-footer mb-4" data-oid="m8ufrcm">
        {usuario.avatarUrl ? (
          <img
            src={usuario.avatarUrl}
            alt="Avatar"
            className="w-12 h-12 rounded-full mb-2 border-2 border-[var(--dashboard-accent)]"
            data-oid="u7..kdu"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full bg-[var(--dashboard-accent)]/30 flex items-center justify-center mb-2"
            data-oid="o2nhv:6"
          >
            <User className="w-7 h-7 text-[var(--dashboard-navbar)]" data-oid="0p00fpi" />
          </div>
        )}
        <span className={`font-bold text-sm ${collapsed ? "hidden" : "block"}`} data-oid="0l2o3_x">
          {usuario.nombre}
        </span>
        <span className={`text-xs text-[var(--dashboard-accent)] opacity-80 ${collapsed ? "hidden" : "block"}`} data-oid="purvdjd">
          {typeof tipo === "string"
            ? tipo.charAt(0).toUpperCase() + tipo.slice(1)
            : "Invitado"}
        </span>
      </div>
    </aside>
  );
}
