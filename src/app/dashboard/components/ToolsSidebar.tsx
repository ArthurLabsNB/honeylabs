"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardUI } from "../ui";
import type { Usuario } from "@/types/usuario";
import {
  Bell,
  AppWindow,
  Network,
  FileStack,
  Receipt,
  Search as SearchIcon,
} from "lucide-react";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";

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
];

export default function ToolsSidebar({ usuario }: { usuario: Usuario }) {
  const { toggleToolsSidebar } = useDashboardUI();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const mainRole = getMainRole(usuario)?.toLowerCase();
  const tipo = normalizeTipoCuenta(
    mainRole === "admin" ? "admin" : usuario.tipoCuenta,
  );

  const filtered = toolsMenu.filter(
    (i) =>
      i.allowed.includes(tipo) &&
      i.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <aside className="dashboard-sidebar flex flex-col h-full" data-oid="tools">
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
      <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
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
              className={`dashboard-sidebar-item relative ${active ? "active" : ""}`}
            >
              <div className="flex items-center justify-center w-10 h-10">
                {item.icon}
              </div>
              <span>{item.label}</span>
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
