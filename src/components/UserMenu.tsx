"use client";

import {
  ArrowUpRight,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  Sun,
  Settings,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

interface UsuarioData {
  nombre: string;
  correo: string;
  imagen?: string | null;
  plan?: string;
  tiene2FA?: boolean;
}

export default function UserMenu({ usuario }: { usuario: UsuarioData | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [temaOscuro, setTemaOscuro] = useState(true);
  const refMenu = useRef<HTMLDivElement>(null);

  // Avatar image url (si existe)
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  useEffect(() => {
    let temaGuardado = localStorage.getItem("tema");
    if (!temaGuardado) {
      const preferenciaSistema = window.matchMedia(
        "(prefers-color-scheme: light)",
      ).matches
        ? "light"
        : "dark";
      temaGuardado = preferenciaSistema || "dark";
    }
    setTemaOscuro(temaGuardado === "dark");
    document.documentElement.classList.toggle("dark", temaGuardado === "dark");
    document.documentElement.classList.toggle(
      "light",
      temaGuardado === "light",
    );
  }, []);

  // Cierra menú al click fuera o Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (refMenu.current && !refMenu.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (usuario?.imagen) {
      setFotoPerfil(usuario.imagen);
    } else if (usuario?.correo) {
      fetch(`/api/perfil/foto?correo=${encodeURIComponent(usuario.correo)}`)
        .then((r) => (r.ok ? r.blob() : null))
        .then((blob) => {
          if (blob) setFotoPerfil(URL.createObjectURL(blob));
        });
    } else {
      setFotoPerfil(null);
    }
  }, [usuario]);

  const alternarTema = () => {
    setTemaOscuro((prev) => {
      const nextIsDark = !prev;
      document.documentElement.classList.toggle("dark", nextIsDark);
      document.documentElement.classList.toggle("light", !nextIsDark);
      localStorage.setItem("tema", nextIsDark ? "dark" : "light");
      return nextIsDark;
    });
  };

  // --- Nuevo logout sin contexto ---
  const cerrarSesion = async () => {
    setOpen(false);
    await fetch("/api/login", { method: "DELETE" });
    router.replace("/login");
  };

  const renderAvatar = () => {
    if (fotoPerfil) {
      return (
        <img
          src={fotoPerfil}
          alt="Avatar"
          className="h-9 w-9 rounded-full object-cover border-2 border-amber-300 shadow"
          data-oid="th7vkmj"
        />
      );
    }
    if (usuario?.nombre) {
      const color = usuario.nombre.charCodeAt(0) % 5;
      const bgList = [
        "bg-amber-400",
        "bg-blue-300",
        "bg-emerald-300",
        "bg-pink-300",
        "bg-purple-400",
      ];

      return (
        <span
          className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-lg ${bgList[color]} text-white shadow`}
          data-oid="5.3i99g"
        >
          {usuario.nombre[0].toUpperCase()}
        </span>
      );
    }
    return (
      <span
        className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg text-white shadow"
        data-oid="b0gvib_"
      >
        U
      </span>
    );
  };

  return (
    <div className="relative" ref={refMenu} data-oid="32daohh">
      <button
        aria-label="Abrir menú de usuario"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center hover:ring-2 ring-amber-400 transition"
        tabIndex={0}
        data-oid="v:a86:e"
      >
        {renderAvatar()}
      </button>

      {open && (
        <nav
          className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl border border-amber-200 bg-white shadow-xl z-50 animate-fade-scale dark:bg-zinc-900 dark:border-zinc-700"
          aria-label="Menú de usuario"
          data-oid="c1xoti0"
        >
          {/* Sesión activa */}
          {usuario ? (
            <div className="px-4 py-3" data-oid="uhiux8u">
              <div className="flex items-center gap-2" data-oid="p1g9g8v">
                <span className="text-sm font-semibold" data-oid="ao-sasc">
                  {usuario?.nombre}
                </span>
                {usuario.plan && (
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full ml-auto flex items-center gap-1",
                      usuario.plan === "Pro"
                        ? "bg-amber-100 text-amber-700 border border-amber-300"
                        : usuario.plan === "Empresarial"
                          ? "bg-sky-100 text-sky-700 border-sky-300"
                          : "bg-zinc-100 text-zinc-600 border-zinc-200",
                    )}
                    data-oid="7avkuii"
                  >
                    <BadgeCheck className="w-3 h-3" data-oid="e-wufx4" />
                    {usuario.plan}
                  </span>
                )}
                {usuario.tiene2FA && (
                  <span
                    title="2FA activo"
                    className="ml-1 text-emerald-500"
                    data-oid="oy.y8-m"
                  >
                    <ShieldCheck
                      className="h-4 w-4 inline"
                      data-oid="kkq-tto"
                    />
                  </span>
                )}
              </div>
              <p
                className="text-xs text-zinc-500 dark:text-zinc-400 break-all"
                data-oid="wknef20"
              >
                {usuario?.correo}
              </p>
            </div>
          ) : (
            <div
              className="px-4 py-3 text-center text-sm text-zinc-500"
              data-oid="w1.j5i_"
            >
              No has iniciado sesión
            </div>
          )}

          {/* Accesos rápidos */}
          {usuario && (
            <div
              className="border-t dark:border-zinc-700 py-2"
              data-oid="vvhjlju"
            >
              <MenuLink
                href="/dashboard"
                icon={
                  <LayoutDashboard className="h-4 w-4" data-oid="myeoim." />
                }
                label="Dashboard"
                tabIndex={open ? 0 : -1}
                data-oid="368ko5_"
              />
              <MenuLink
                href="/configuracion"
                icon={<Settings className="h-4 w-4" data-oid="3_sb_xz" />}
                label="Configuración"
                tabIndex={open ? 0 : -1}
                data-oid="yiu9:r3"
              />
              <MenuLink
                href="/"
                icon={<Home className="h-4 w-4" data-oid="i:4enmg" />}
                label="Inicio"
                tabIndex={open ? 0 : -1}
                data-oid="ydn7o13"
              />
              {usuario.tiene2FA && (
                <MenuLink
                  href="/configuracion#seguridad"
                  icon={
                    <ShieldCheck
                      className="h-4 w-4 text-emerald-500"
                      data-oid="sq8kkui"
                    />
                  }
                  label="Seguridad"
                  tabIndex={open ? 0 : -1}
                  data-oid="t::og20"
                />
              )}
            </div>
          )}

          {/* Tema claro/oscuro */}
          <div
            className="border-t dark:border-zinc-700 px-4 py-3 flex items-center justify-between text-sm"
            data-oid="dcnfoq_"
          >
            <span
              className="text-zinc-500 dark:text-zinc-400"
              data-oid="bs8gfnd"
            >
              Tema
            </span>
            <button
              onClick={alternarTema}
              className={clsx(
                "rounded-full p-1 transition",
                temaOscuro
                  ? "bg-zinc-700 text-yellow-400 hover:bg-zinc-600"
                  : "bg-amber-500 text-white hover:bg-amber-600",
              )}
              aria-label={
                temaOscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
              }
              data-oid="rv44axf"
            >
              {temaOscuro ? (
                <Sun className="h-4 w-4" data-oid=":8rck0p" />
              ) : (
                <Moon className="h-4 w-4" data-oid="rn_ci.n" />
              )}
            </button>
          </div>

          {/* Login / Logout */}
          <div className="border-t dark:border-zinc-700" data-oid="fysmff4">
            {usuario ? (
              <button
                onClick={cerrarSesion}
                className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800 dark:text-red-400 text-sm"
                tabIndex={open ? 0 : -1}
                data-oid="s.brx:t"
              >
                <LogOut className="h-4 w-4" data-oid="1z60s69" /> Cerrar sesión
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full px-4 py-2 flex items-center gap-2 text-amber-700 hover:bg-amber-50 dark:hover:bg-zinc-800 text-sm"
                tabIndex={open ? 0 : -1}
                data-oid="3hso6n:"
              >
                <LogIn className="h-4 w-4" data-oid="h1-28hl" /> Iniciar sesión
              </Link>
            )}
          </div>

          {/* Upgrade */}
          <div className="border-t dark:border-zinc-700" data-oid="y.87e-d">
            <Link
              href="/servicios"
              className="block w-full px-4 py-3 text-center text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition flex items-center justify-center gap-2"
              tabIndex={open ? 0 : -1}
              data-oid="6ewegp_"
            >
              {usuario?.plan === "Pro" || usuario?.plan === "Empresarial"
                ? "Gestionar mi Plan"
                : "Upgrade to Pro"}
              <ArrowUpRight className="h-4 w-4" data-oid="5-d_zsz" />
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  label,
  tabIndex,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  tabIndex?: number;
}) {
  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-amber-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-md"
      data-oid="rasrixf"
    >
      {icon}
      {label}
    </Link>
  );
}
