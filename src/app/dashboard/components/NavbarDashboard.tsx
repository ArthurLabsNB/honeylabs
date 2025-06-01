"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Search,
  AppWindow,
  SunMoon,
  MessageSquare,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";
import { useUser } from "../contexts/UserContext";

export default function NavbarDashboard() {
  const [crearOpen, setCrearOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { usuario, loading, logout } = useUser();

  if (loading) {
    return (
      <header className="dashboard-navbar flex items-center px-8 py-2" style={{ minHeight: "70px" }}>
        <span className="text-[var(--dashboard-accent)]">Cargando usuario…</span>
      </header>
    );
  }

  if (!usuario) {
    return (
      <header className="dashboard-navbar flex items-center px-8 py-2" style={{ minHeight: "70px" }}>
        <span className="text-red-500">No autenticado</span>
      </header>
    );
  }

  // Cierra el menú si das click fuera (mejor UX)
  function closeMenus() {
    setCrearOpen(false);
    setUserMenuOpen(false);
  }

  return (
    <header
      className="dashboard-navbar flex items-center px-8 py-2 justify-between sticky top-0 z-20 shadow"
      style={{ minHeight: "70px" }}
      onBlur={closeMenus}
    >
      {/* --- IZQUIERDA: Home, Crear, Buscador --- */}
      <div className="flex gap-4 items-center relative">
        {/* Botón Home */}
        <Link
          href="/"
          className="p-3 rounded-lg transition hover:bg-white/15 hover:backdrop-blur-sm focus:bg-white/25 active:bg-white/25"
          title="Ir al inicio"
        >
          <Home className="w-6 h-6 text-[var(--dashboard-accent)] transition" />
        </Link>

        {/* Botón Crear */}
        {(usuario.rol === "admin" ||
          usuario.rol === "encargado" ||
          usuario.plan === "Pro" ||
          usuario.plan === "Empresarial" ||
          usuario.plan === "Institucional") && (
          <div className="relative">
            <button
              className="
                dashboard-btn flex items-center gap-2 shadow-sm hover:scale-105
                hover:bg-white/15 hover:backdrop-blur-sm
                focus:bg-white/20
                active:bg-white/25
                transition
              "
              onClick={() => {
                setCrearOpen((v) => !v);
                setUserMenuOpen(false);
              }}
              aria-expanded={crearOpen}
              tabIndex={0}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:block">Crear</span>
            </button>
            {crearOpen && (
              <div
                className="absolute left-0 mt-2 w-56 rounded-xl bg-white dark:bg-[var(--dashboard-navbar)] shadow-xl border border-[var(--dashboard-border)] z-50 animate-fade-in"
                onMouseLeave={() => setCrearOpen(false)}
              >
                {(usuario.rol === "admin" || usuario.rol === "encargado") && (
                  <button className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition rounded-t-xl">
                    + Almacén
                  </button>
                )}
                {(usuario.rol === "admin" ||
                  usuario.plan === "Empresarial" ||
                  usuario.plan === "Institucional") && (
                  <button className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition">
                    + Usuario
                  </button>
                )}
                <button className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition">
                  + Reporte
                </button>
                <button className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition rounded-b-xl">
                  + Ticket
                </button>
              </div>
            )}
          </div>
        )}

        {/* Buscador */}
        <div className="relative flex items-center ml-3">
          <Search className="w-5 h-5 absolute left-4 text-[var(--dashboard-muted)] pointer-events-none" />
          <input
            className="dashboard-input pl-12 pr-3 py-2 w-52 sm:w-64 transition"
            style={{ minWidth: 180 }}
            placeholder="Buscar…"
          />
        </div>
      </div>

      {/* --- DERECHA: Widgets, Tema, Mensajes, Notif, Avatar --- */}
      <div className="flex items-center gap-3">
        <button
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          title="Widgets"
        >
          <AppWindow className="w-6 h-6 text-[var(--dashboard-accent)] transition" />
        </button>
        <button
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          title="Tema"
          // onClick={...} // Aquí irá tu toggle de tema
        >
          <SunMoon className="w-6 h-6 text-[var(--dashboard-accent)] transition" />
        </button>
        <button
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          title="Mensajes"
        >
          <MessageSquare className="w-6 h-6 text-[var(--dashboard-accent)] transition" />
        </button>
        <button
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          title="Notificaciones"
        >
          <Bell className="w-6 h-6 text-[var(--dashboard-accent)] transition" />
        </button>
        {/* Avatar + menú usuario */}
        <div className="relative ml-2">
          <button
            className="
              flex items-center gap-2 bg-[var(--dashboard-accent)]/20 px-3 py-1.5 rounded-xl
              hover:bg-white/25 hover:backdrop-blur-md
              transition
            "
            onClick={() => {
              setUserMenuOpen((v) => !v);
              setCrearOpen(false);
            }}
            aria-expanded={userMenuOpen}
            tabIndex={0}
          >
            {usuario.avatarUrl ? (
              <img
                src={usuario.avatarUrl}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-[var(--dashboard-accent)]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--dashboard-accent)] flex items-center justify-center">
                <User className="w-6 h-6 text-[var(--dashboard-navbar)]" />
              </div>
            )}
            <span className="hidden sm:block font-bold text-[var(--dashboard-navbar)]">
              {usuario.nombre}
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--dashboard-navbar)]" />
          </button>
          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-[var(--dashboard-navbar)] shadow-xl border border-[var(--dashboard-border)] z-50 animate-fade-in"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <div className="px-5 py-3 font-bold">{usuario.nombre}</div>
              <div className="px-5 pb-2 text-xs text-[var(--dashboard-accent)]">
                {usuario.rol} • {usuario.plan}
              </div>
              <button className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition">
                Mi cuenta
              </button>
              <button className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition">
                Configuración
              </button>
              <button
                className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-[var(--dashboard-bg)] transition rounded-b-xl"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
