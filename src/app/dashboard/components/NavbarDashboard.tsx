"use client";

import { useRef } from "react";
import { apiFetch } from "@lib/api";
import Link from "next/link";
import { Home, Bell, Menu } from "lucide-react";
import ToolsMenu from "./ToolsMenu";
import UserMenu from "@/components/UserMenu";
import { useDashboardUI } from "../ui";
import type { Usuario } from "@/types/usuario";



export default function NavbarDashboard({ usuario }: { usuario: Usuario }) {
  // Estado UI
  const navRef = useRef<HTMLDivElement>(null);
  const { toggleSidebarVisible: toggleSidebar, sidebarGlobalVisible } =
    useDashboardUI();

  const logout = async (redirectUrl?: string) => {
    await apiFetch("/api/login", { method: "DELETE" });
    if (redirectUrl) window.location.href = redirectUrl;
  };

  return (
    <header
      ref={navRef}
      className="dashboard-navbar flex items-center px-8 py-2 justify-between fixed top-0 left-0 right-0 z-20 shadow bg-[var(--dashboard-navbar)]"
      style={{ minHeight: "70px", width: "100%" }}
      data-oid="z5vbw0i"
    >
      <div className="flex gap-4 items-center relative" data-oid="ikd.5r1">
        <button
          onClick={() => toggleSidebar()}
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-[var(--dashboard-accent)]" />
        </button>
        <span className="font-extrabold text-lg tracking-widest select-none">
          HoneyLabs
          {usuario.plan?.nombre && (
            <span className="ml-1 text-sm font-medium text-[var(--dashboard-muted)]">
              {usuario.plan.nombre}
            </span>
          )}
        </span>
        <Link
          href="/"
          className="p-3 rounded-lg transition hover:bg-white/15 hover:backdrop-blur-sm focus:bg-white/25 active:bg-white/25"
          data-oid="h_hgq:3"
        >
          <Home
            className="w-6 h-6 text-[var(--dashboard-accent)] transition"
            data-oid="5.tu7zt"
          />
        </Link>

        
      </div>

      <div className="flex items-center gap-3" data-oid="x5cdysc">
        <ToolsMenu usuario={usuario} />
        <button
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          data-oid=".-_1wyk"
        >
          <Bell data-oid="s9c-u68" />
        </button>
        <div className="ml-2" data-oid="lce8ecp">
          <UserMenu
            usuario={{
              nombre: usuario.nombre,
              correo: (usuario as any).correo ?? "",
              imagen: usuario.avatarUrl ?? undefined,
              plan: usuario.plan?.nombre,
            }}
          />
        </div>
      </div>
    </header>
  );
}
