"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Network,
  AppWindow,
  Receipt,
  Home,
  Box,
  History,
  FileText,
  Folder,
  Settings,
  BookOpen,
  MessageSquare,
  Wrench,
} from "lucide-react";
import type { Usuario } from "@/types/usuario";
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
  {
    key: "chat",
    label: "Chat",
    icon: <MessageSquare className="dashboard-sidebar-icon" />,
    path: "/dashboard/chat",
    allowed: ["admin", "administrador", "institucional", "empresarial", "individual"],
  },
];

export default function ToolsMenu({ usuario }: { usuario: Usuario }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const mainRole = getMainRole(usuario)?.toLowerCase();
  const tipo = normalizeTipoCuenta(
    mainRole === "admin" ? "admin" : usuario.tipoCuenta,
  );
  const allowCreate = hasManagePerms(usuario);

  const filtered = toolsMenu.filter(
    (i) =>
      i.allowed.includes(tipo) && (!i.requiresManage || allowCreate),
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
        aria-label="Herramientas"
      >
        <Wrench className="w-6 h-6 text-[var(--dashboard-accent)]" />
      </button>
      {open && (
        <nav
          className="absolute right-0 mt-2 w-72 p-4 grid grid-cols-3 gap-3 rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)] shadow-xl backdrop-blur-md"
        >
          {filtered.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                router.push(item.path);
                setOpen(false);
              }}
              className="tool-item"
            >
              <div className="tool-icon">{item.icon}</div>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
