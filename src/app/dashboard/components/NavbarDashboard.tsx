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

const MOCK_RESULTS = [
  { tipo: "almacén", nombre: "Almacén Central", url: "/almacenes/central" },
  { tipo: "widget", nombre: "Inventario Rápido", url: "/widgets/inventario" },
  { tipo: "usuario", nombre: "Luis Hernández", url: "/usuarios/luis" },
  { tipo: "almacén", nombre: "Almacén de Química", url: "/almacenes/quimica" },
];

interface Usuario {
  id: number;
  nombre: string;
  tipoCuenta?: string;
  rol?: string;
  plan?: { nombre?: string };
  avatarUrl?: string;
}

export default function NavbarDashboard({ usuario }: { usuario: Usuario }) {
  // Estado UI
  const [crearOpen, setCrearOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [buscador, setBuscador] = useState("");
  const [buscadorFocus, setBuscadorFocus] = useState(false);
  const [resultados, setResultados] = useState<typeof MOCK_RESULTS>([]);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buscador.trim().length === 0) {
      setResultados([]);
    } else {
      const query = buscador.toLowerCase();
      setResultados(
        MOCK_RESULTS.filter(
          (r) =>
            r.nombre.toLowerCase().includes(query) ||
            r.tipo.toLowerCase().includes(query),
        ),
      );
    }
  }, [buscador]);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setCrearOpen(false);
        setUserMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCrearOpen(false);
        setUserMenuOpen(false);
        setBuscadorFocus(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const logout = async (redirectUrl?: string) => {
    await fetch("/api/login", { method: "DELETE" });
    if (redirectUrl) window.location.href = redirectUrl;
  };

  const puedeCrear =
    usuario.rol === "admin" ||
    usuario.tipoCuenta === "empresarial" ||
    usuario.tipoCuenta === "institucional" ||
    usuario.tipoCuenta === "estandar";

  const puedeInvitarUsuarios =
    usuario.rol === "admin" ||
    usuario.tipoCuenta === "empresarial" ||
    usuario.tipoCuenta === "institucional";

  return (
    <header
      ref={navRef}
      className="dashboard-navbar flex items-center px-8 py-2 justify-between sticky top-0 z-20 shadow bg-[var(--dashboard-navbar)]"
      style={{ minHeight: "70px" }}
      data-oid="2kustdf"
    >
      <div className="flex gap-4 items-center relative" data-oid=":qjtfmr">
        <Link
          href="/"
          className="p-3 rounded-lg transition hover:bg-white/15 hover:backdrop-blur-sm focus:bg-white/25 active:bg-white/25"
          data-oid="e4eihcf"
        >
          <Home
            className="w-6 h-6 text-[var(--dashboard-accent)] transition"
            data-oid="o5mfbnn"
          />
        </Link>

        {puedeCrear && (
          <div className="relative" data-oid="0::8t-l">
            <button
              className="dashboard-btn flex items-center gap-2 shadow-sm hover:scale-105 hover:bg-white/15 hover:backdrop-blur-sm focus:bg-white/20 active:bg-white/25 transition"
              onClick={() => setCrearOpen((v) => !v)}
              aria-expanded={crearOpen}
              tabIndex={0}
              data-oid="76hbidg"
            >
              <Plus className="w-5 h-5" data-oid="a.pqxf_" />
              <span className="hidden sm:block" data-oid="_vvtkw0">
                Crear
              </span>
            </button>
            {crearOpen && (
              <div
                className="absolute left-0 mt-2 w-56 rounded-xl bg-white dark:bg-[var(--dashboard-navbar)] shadow-xl border border-[var(--dashboard-border)] z-50 animate-fade-in"
                data-oid="n016g_4"
              >
                <button
                  className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition rounded-t-xl"
                  data-oid=".86y0:5"
                >
                  + Almacén
                </button>
                {puedeInvitarUsuarios && (
                  <button
                    className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition"
                    data-oid="5g1qgfa"
                  >
                    + Usuario
                  </button>
                )}
                <button
                  className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition"
                  data-oid="ly.l4sa"
                >
                  + Reporte
                </button>
                <button
                  className="w-full text-left px-5 py-3 hover:bg-white/15 dark:hover:bg-[var(--dashboard-bg)] transition rounded-b-xl"
                  data-oid="cjxsmql"
                >
                  + Ticket
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className="relative flex items-center ml-3 w-52 sm:w-64"
          data-oid="jvpysvq"
        >
          <Search
            className={`w-5 h-5 absolute left-4 top-2.5 text-[var(--dashboard-muted)] pointer-events-none transition ${buscadorFocus ? "text-[var(--dashboard-accent)] scale-110" : ""}`}
            data-oid="f7iair6"
          />
          <input
            className={`dashboard-input pl-12 pr-3 py-2 w-full transition rounded-2xl border ${buscadorFocus ? "border-[var(--dashboard-accent)] ring-2 ring-[var(--dashboard-accent)] bg-white dark:bg-[var(--dashboard-bg)] shadow-lg" : "border-[var(--dashboard-border)]"} focus:outline-none`}
            style={{ minWidth: 180 }}
            placeholder="Buscar almacenes, widgets, usuarios…"
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
            onFocus={() => setBuscadorFocus(true)}
            onBlur={() => setTimeout(() => setBuscadorFocus(false), 120)}
            autoComplete="off"
            data-oid="edc-e:h"
          />

          {buscadorFocus && resultados.length > 0 && (
            <div
              className="absolute left-0 top-12 w-full rounded-2xl bg-white dark:bg-[var(--dashboard-bg)] shadow-xl border border-[var(--dashboard-border)] z-50 animate-fade-in overflow-y-auto max-h-64"
              data-oid="q78nepg"
            >
              {resultados.map((res, i) => (
                <Link
                  href={res.url}
                  key={res.url + i}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--dashboard-accent)]/15 transition cursor-pointer"
                  onClick={() => {
                    setBuscador("");
                    setBuscadorFocus(false);
                  }}
                  data-oid="_-pewpx"
                >
                  <span
                    className="text-xs px-2 py-1 rounded bg-[var(--dashboard-accent)] text-[var(--dashboard-navbar)] font-bold"
                    data-oid="cypno9j"
                  >
                    {res.tipo}
                  </span>
                  <span className="font-semibold" data-oid="i78xjsf">
                    {res.nombre}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3" data-oid="9ef0foo">
        <button
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          data-oid="0526-ms"
        >
          <AppWindow data-oid="3eusl9q" />
        </button>
        <button
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          data-oid="8rsc.dk"
        >
          <SunMoon data-oid="wqxz:o0" />
        </button>
        <button
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          data-oid="h5a88lo"
        >
          <MessageSquare data-oid="usa9w_i" />
        </button>
        <button
          className="p-3 rounded-lg hover:bg-white/15 hover:backdrop-blur-sm transition"
          data-oid="t3amhkj"
        >
          <Bell data-oid="61p0cbs" />
        </button>
        <div className="relative ml-2" data-oid="qtcq49p">
          <button
            className="flex items-center gap-2 bg-[var(--dashboard-accent)]/20 px-3 py-1.5 rounded-xl hover:bg-white/25 hover:backdrop-blur-md transition"
            onClick={() => setUserMenuOpen((v) => !v)}
            tabIndex={0}
            data-oid="y9xi0ut"
          >
            <User data-oid="12.0oi_" />
            <span data-oid="gf5z6h7">{usuario.nombre}</span>
            <ChevronDown data-oid="o9t4xfq" />
          </button>
        </div>
      </div>
    </header>
  );
}
