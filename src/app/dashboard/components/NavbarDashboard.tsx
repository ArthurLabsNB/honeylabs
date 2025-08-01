"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Home, Bell, Menu } from "lucide-react";
import ToolsMenu from "./ToolsMenu";
import { useDashboardUI } from "../ui";
import type { Usuario } from "@/types/usuario";



export default function NavbarDashboard({ usuario }: { usuario: Usuario }) {
  // Estado UI
  const navRef = useRef<HTMLDivElement>(null);
  const { toggleSidebarVisible: toggleSidebar } = useDashboardUI();
  const [search, setSearch] = useState("");

  return (
    <header
      ref={navRef}
      className="dashboard-navbar flex items-center px-4 sm:px-6 lg:px-8 py-2 justify-between fixed top-0 left-0 right-0 z-20 shadow bg-[var(--dashboard-navbar)]"
      style={{ minHeight: '70px', width: '100%' }}
      data-oid="z5vbw0i"
    >
      <div className="dashboard-group flex gap-4 items-center" data-oid="ikd.5r1">
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
      <div className="dashboard-group hidden md:block" data-oid="search">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="bg-transparent border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]"
        />
      </div>

      <div className="flex items-center gap-3" data-oid="x5cdysc">
        <ToolsMenu usuario={usuario} />
        <button
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          data-oid=".-_1wyk"
        >
          <Bell data-oid="s9c-u68" />
        </button>
      </div>
    </header>
  );
}
