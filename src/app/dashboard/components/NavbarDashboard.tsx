"use client";

import { useRef, useEffect, useState } from "react";
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

// Simulación de resultados (reemplázalo por tu API/fetch real)
const MOCK_RESULTS = [
  { tipo: "almacén", nombre: "Almacén Central", url: "/almacenes/central" },
  { tipo: "widget", nombre: "Inventario Rápido", url: "/widgets/inventario" },
  { tipo: "usuario", nombre: "Luis Hernández", url: "/usuarios/luis" },
  { tipo: "almacén", nombre: "Almacén de Química", url: "/almacenes/quimica" },
];

// Asegúrate de que la interfaz Usuario coincida con la de layout.tsx
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  // ...otras propiedades si las usas...
}

export default function NavbarDashboard({ usuario }: { usuario: Usuario }) {
  // Estado de usuario y loading
  const [loading, setLoading] = useState(true);

  // Estado UI
  const [crearOpen, setCrearOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [buscador, setBuscador] = useState("");
  const [buscadorFocus, setBuscadorFocus] = useState(false);
  const [resultados, setResultados] = useState<typeof MOCK_RESULTS>([]);
  const navRef = useRef<HTMLDivElement>(null);

  // ---- Obtener usuario de la sesión vía API (sin contexto)
  useEffect(() => {
    setLoading(true);
    fetch("/api/login", { method: "GET" })
      .then(r => r.json())
      .then(data => {
        if (data?.success && data?.usuario) setUsuario(data.usuario);
        else setUsuario(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ---- Filtrado del buscador
  useEffect(() => {
    if (buscador.trim().length === 0) {
      setResultados([]);
    } else {
      const query = buscador.toLowerCase();
      setResultados(
        MOCK_RESULTS.filter((r) =>
          r.nombre.toLowerCase().includes(query) ||
          r.tipo.toLowerCase().includes(query)
        )
      );
    }
  }, [buscador]);

  // ---- Cierra menús al hacer click fuera o Escape
  useEffect(() => {
    function handler(e: MouseEvent | TouchEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setCrearOpen(false);
        setUserMenuOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setCrearOpen(false);
        setUserMenuOpen(false);
        setBuscadorFocus(false);
      }
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // ---- Logout
  const logout = async (redirectUrl?: string) => {
    await fetch("/api/login", { method: "DELETE" });
    setUsuario(null);
    if (redirectUrl) window.location.href = redirectUrl;
  };

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

  const puedeCrear = (
    usuario.rol === "admin" ||
    usuario.tipoCuenta === "empresarial" ||
    usuario.tipoCuenta === "institucional" ||
    usuario.tipoCuenta === "estandar"
  );

  const puedeInvitarUsuarios = (
    usuario.rol === "admin" ||
    usuario.tipoCuenta === "empresarial" ||
    usuario.tipoCuenta === "institucional"
  );

  return (
    <header
      ref={navRef}
      className="dashboard-navbar flex items-center px-8 py-2 justify-between sticky top-0 z-20 shadow bg-[var(--dashboard-navbar)]"
      style={{ minHeight: "70px" }}
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
        {puedeCrear && (
          <div className="relative">
            <button
              className="dashboard-btn flex items-center gap-2 shadow-sm hover:scale-105 hover:bg-white/15 hover:backdrop-blur-sm focus:bg-white/20 active:bg-white/25 transition"
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
              <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white dark:bg-[var(--dashboard-navbar)] shadow-xl border border-[var(--dashboard-border)] z-50 animate-fade-in">
                <button className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition rounded-t-xl">
                  + Almacén
                </button>
                {puedeInvitarUsuarios && (
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
        <div className="relative flex items-center ml-3 w-52 sm:w-64">
          <Search className={`w-5 h-5 absolute left-4 top-2.5 text-[var(--dashboard-muted)] pointer-events-none transition ${buscadorFocus ? 'text-[var(--dashboard-accent)] scale-110' : ''}`} />
          <input
            className={`
              dashboard-input pl-12 pr-3 py-2 w-full transition rounded-2xl border
              ${buscadorFocus ? "border-[var(--dashboard-accent)] ring-2 ring-[var(--dashboard-accent)] bg-white dark:bg-[var(--dashboard-bg)] shadow-lg" : "border-[var(--dashboard-border)]"}
              focus:outline-none
            `}
            style={{ minWidth: 180 }}
            placeholder="Buscar almacenes, widgets, usuarios…"
            value={buscador}
            onChange={e => setBuscador(e.target.value)}
            onFocus={() => setBuscadorFocus(true)}
            onBlur={() => setTimeout(() => setBuscadorFocus(false), 120)}
            autoComplete="off"
          />
          {/* Resultados */}
          {buscadorFocus && resultados.length > 0 && (
            <div className="absolute left-0 top-12 w-full rounded-2xl bg-white dark:bg-[var(--dashboard-bg)] shadow-xl border border-[var(--dashboard-border)] z-50 animate-fade-in overflow-y-auto max-h-64">
              {resultados.map((res, i) => (
                <Link
                  href={res.url}
                  key={res.url + i}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--dashboard-accent)]/15 transition cursor-pointer"
                  onClick={() => {
                    setBuscador("");
                    setBuscadorFocus(false);
                  }}
                >
                  <span className="text-xs px-2 py-1 rounded bg-[var(--dashboard-accent)] text-[var(--dashboard-navbar)] font-bold">{res.tipo}</span>
                  <span className="font-semibold">{res.nombre}</span>
                </Link>
              ))}
            </div>
          )}
          {/* Sin resultados */}
          {buscadorFocus && buscador.length > 0 && resultados.length === 0 && (
            <div className="absolute left-0 top-12 w-full rounded-2xl bg-white dark:bg-[var(--dashboard-bg)] shadow-xl border border-[var(--dashboard-border)] z-50 p-4 text-center text-[var(--dashboard-muted)]">
              Sin resultados
            </div>
          )}
        </div>
      </div>

      {/* --- DERECHA: Widgets, Tema, Mensajes, Notificaciones, Avatar --- */}
      <div className="flex items-center gap-3">
        <button className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition" title="Widgets">
          <AppWindow className="w-6 h-6 text-[var(--dashboard-accent)] transition" />
        </button>
        <button className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition" title="Tema">
          <SunMoon className="w-6 h-6 text-[var(--dashboard-accent)] transition" />
        </button>
        <button className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition" title="Mensajes">
          <MessageSquare className="w-6 h-6 text-[var(--dashboard-accent)] transition" />
        </button>
        <button className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition" title="Notificaciones">
          <Bell className="w-6 h-6 text-[var(--dashboard-accent)] transition" />
        </button>

        {/* Avatar + Menú Usuario */}
        <div className="relative ml-2">
          <button
            className="flex items-center gap-2 bg-[var(--dashboard-accent)]/20 px-3 py-1.5 rounded-xl hover:bg-white/25 hover:backdrop-blur-md transition"
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
            >
              <div className="px-5 py-3 font-bold">{usuario.nombre}</div>
              <div className="px-5 pb-2 text-xs text-[var(--dashboard-accent)]">
                {usuario.tipoCuenta} • {usuario.plan?.nombre ?? "Sin plan"}
              </div>
              <button className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition">
                Mi cuenta
              </button>
              <button className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition">
                Configuración
              </button>
              <button
                className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-[var(--dashboard-bg)] transition rounded-b-xl"
                onClick={() => logout("/login")}
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
