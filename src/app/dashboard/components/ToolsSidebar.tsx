"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardUI } from "../ui";
import type { Usuario } from "@/types/usuario";
import {
  Bell,
  AppWindow,
  Network,
  FileStack,
  Receipt,
  Home,
  Box,
  History,
  FileText,
  Folder,
  Plus,
  Settings,
  BookOpen,
  Search as SearchIcon,
} from "lucide-react";
import { getMainRole, normalizeTipoCuenta, hasManagePerms } from "@lib/permisos";

const toolsMenu = [
  {
    key: "alertas",
    label: "Alertas",
    icon: <Bell className="dashboard-sidebar-icon" />,
    path: "/dashboard/alertas",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "plantillas",
    label: "Plantillas",
    icon: <FileStack className="dashboard-sidebar-icon" />,
    path: "/dashboard/plantillas",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "network",
    label: "Network",
    icon: <Network className="dashboard-sidebar-icon" />,
    path: "/dashboard/network",
    allowed: ["admin", "administrador", "institucional"],
  },
  {
    key: "appcenter",
    label: "App Center",
    icon: <AppWindow className="dashboard-sidebar-icon" />,
    path: "/dashboard/app-center",
    allowed: ["admin", "administrador", "institucional", "empresarial"],
  },
  {
    key: "billing",
    label: "Billing",
    icon: <Receipt className="dashboard-sidebar-icon" />,
    path: "/dashboard/billing",
    allowed: ["admin", "administrador", "institucional"],
  },
  // --- opciones de Almacenes ---
  {
    key: "almacen-inicio",
    label: "Inicio",
    icon: <Home className="dashboard-sidebar-icon" />,
    path: "/dashboard/almacenes",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "inventario",
    label: "Inventario",
    icon: <Box className="dashboard-sidebar-icon" />,
    path: "/dashboard/almacenes/inventario",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "operaciones",
    label: "Operaciones",
    icon: <History className="dashboard-sidebar-icon" />,
    path: "/dashboard/almacenes/operaciones",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "almacen-reportes",
    label: "Reportes",
    icon: <FileText className="dashboard-sidebar-icon" />,
    path: "/dashboard/almacenes/reportes",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "almacen-archivos",
    label: "Archivos",
    icon: <Folder className="dashboard-sidebar-icon" />,
    path: "/dashboard/almacenes/archivos",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "nuevo-almacen",
    label: "Nuevo",
    icon: <Plus className="dashboard-sidebar-icon" />,
    path: "/dashboard/almacenes/nuevo",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
    requiresManage: true,
  },
  {
    key: "configuracion-almacen",
    label: "Configuración",
    icon: <Settings className="dashboard-sidebar-icon" />,
    path: "/dashboard/almacenes/configuracion",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
  {
    key: "ayuda-almacen",
    label: "Ayuda",
    icon: <BookOpen className="dashboard-sidebar-icon" />,
    path: "/dashboard/almacenes/ayuda",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
];

export default function ToolsSidebar({ usuario }: { usuario: Usuario }) {
  const { toggleToolsSidebar } = useDashboardUI();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        toggleToolsSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [toggleToolsSidebar]);

  const mainRole = getMainRole(usuario)?.toLowerCase();
  const tipo = normalizeTipoCuenta(
    mainRole === "admin" ? "admin" : usuario.tipoCuenta,
  );
  const allowCreate = hasManagePerms(usuario);

  const filtered = toolsMenu.filter(
    (i) =>
      i.allowed.includes(tipo) &&
      (!i.requiresManage || allowCreate) &&
      i.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <aside
      ref={ref}
      className="tools-sidebar flex flex-col h-full"
      data-oid="tools"
    >
      <div className="p-4 border-b border-[var(--dashboard-border)] flex items-center gap-2">
        <SearchIcon className="w-4 h-4 text-[var(--dashboard-accent)]" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          className="flex-1 bg-transparent focus:outline-none text-sm"
        />
        <button
          onClick={() => toggleToolsSidebar(false)}
          className="text-xs text-[var(--dashboard-accent)] hover:underline"
        >
          Cerrar
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 flex flex-col items-center gap-4">
        {filtered.map((item) => {
          const active =
            pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <button
              key={item.key}
              onClick={() => {
                router.push(item.path);
                toggleToolsSidebar(false);
              }}
              className={`tool-item ${active ? "active" : ""}`}
            >
              <div className="tool-icon flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <span className="px-4 py-2 text-sm text-[var(--dashboard-muted)]">No hay resultados</span>
        )}
      </nav>
    </aside>
  );
}
