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
          data-oid="b5wc80s"
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
          data-oid="p06g3io"
        >
          {usuario.nombre[0].toUpperCase()}
        </span>
      );
    }
    return (
      <span
        className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg text-white shadow"
        data-oid="st60zt5"
      >
        U
      </span>
    );
  };

  return (
    <div className="relative" ref={refMenu} data-oid="v5p4.:j">
      <button
        aria-label="Abrir menú de usuario"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center hover:ring-2 ring-amber-400 transition"
        tabIndex={0}
        data-oid="-6gs4k9"
      >
        {renderAvatar()}
      </button>

      {open && (
        <nav
          className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl border border-amber-200 bg-white shadow-xl z-50 animate-fade-scale dark:bg-zinc-900 dark:border-zinc-700"
          aria-label="Menú de usuario"
          data-oid="0w5pm_r"
        >
          {/* Sesión activa */}
          {usuario ? (
            <div className="px-4 py-3" data-oid="pjswov-">
              <div className="flex items-center gap-2" data-oid="it_jknp">
                <span className="text-sm font-semibold" data-oid="ozcown.">
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
                    data-oid="e_zxlbv"
                  >
                    <BadgeCheck className="w-3 h-3" data-oid="ttja0c9" />
                    {usuario.plan}
                  </span>
                )}
                {usuario.tiene2FA && (
                  <span
                    title="2FA activo"
                    className="ml-1 text-emerald-500"
                    data-oid="76ov1k3"
                  >
                    <ShieldCheck
                      className="h-4 w-4 inline"
                      data-oid="ngz6sj3"
                    />
                  </span>
                )}
              </div>
              <p
                className="text-xs text-zinc-500 dark:text-zinc-400 break-all"
                data-oid="fjvt7my"
              >
                {usuario?.correo}
              </p>
            </div>
          ) : (
            <div
              className="px-4 py-3 text-center text-sm text-zinc-500"
              data-oid="8rzmd9q"
            >
              No has iniciado sesión
            </div>
          )}

          {/* Accesos rápidos */}
          {usuario && (
            <div
              className="border-t dark:border-zinc-700 py-2"
              data-oid="a0wnbze"
            >
              <MenuLink
                href="/dashboard"
                icon={
                  <LayoutDashboard className="h-4 w-4" data-oid="fawohvy" />
                }
                label="Dashboard"
                tabIndex={open ? 0 : -1}
                data-oid="rsfsr2."
              />

              <MenuLink
                href="/configuracion"
                icon={<Settings className="h-4 w-4" data-oid="xwpeao9" />}
                label="Configuración"
                tabIndex={open ? 0 : -1}
                data-oid="4a5c0bc"
              />

              <MenuLink
                href="/"
                icon={<Home className="h-4 w-4" data-oid="nbcd5ka" />}
                label="Inicio"
                tabIndex={open ? 0 : -1}
                data-oid="1gws43m"
              />

              {usuario.tiene2FA && (
                <MenuLink
                  href="/configuracion#seguridad"
                  icon={
                    <ShieldCheck
                      className="h-4 w-4 text-emerald-500"
                      data-oid="j6merum"
                    />
                  }
                  label="Seguridad"
                  tabIndex={open ? 0 : -1}
                  data-oid="vfol.pg"
                />
              )}
            </div>
          )}

          {/* Tema claro/oscuro */}
          <div
            className="border-t dark:border-zinc-700 px-4 py-3 flex items-center justify-between text-sm"
            data-oid="4ni879u"
          >
            <span
              className="text-zinc-500 dark:text-zinc-400"
              data-oid="2nm9j79"
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
              data-oid="3r_v:dq"
            >
              {temaOscuro ? (
                <Sun className="h-4 w-4" data-oid="huo5:lx" />
              ) : (
                <Moon className="h-4 w-4" data-oid="f7dhfcu" />
              )}
            </button>
          </div>

          {/* Login / Logout */}
          <div className="border-t dark:border-zinc-700" data-oid="p1ehb25">
            {usuario ? (
              <button
                onClick={cerrarSesion}
                className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800 dark:text-red-400 text-sm"
                tabIndex={open ? 0 : -1}
                data-oid="8wswv3f"
              >
                <LogOut className="h-4 w-4" data-oid="nxzvv:7" /> Cerrar sesión
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full px-4 py-2 flex items-center gap-2 text-amber-700 hover:bg-amber-50 dark:hover:bg-zinc-800 text-sm"
                tabIndex={open ? 0 : -1}
                data-oid="wkns2eh"
              >
                <LogIn className="h-4 w-4" data-oid="vwi-1v:" /> Iniciar sesión
              </Link>
            )}
          </div>

          {/* Upgrade */}
          <div className="border-t dark:border-zinc-700" data-oid="x.khpkj">
            <Link
              href="/servicios"
              className="block w-full px-4 py-3 text-center text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition flex items-center justify-center gap-2"
              tabIndex={open ? 0 : -1}
              data-oid="b9xeosc"
            >
              {usuario?.plan === "Pro" || usuario?.plan === "Empresarial"
                ? "Gestionar mi Plan"
                : "Upgrade to Pro"}
              <ArrowUpRight className="h-4 w-4" data-oid="otdmpqh" />
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
      data-oid="q:3r48e"
    >
      {icon}
      {label}
    </Link>
  );
}
