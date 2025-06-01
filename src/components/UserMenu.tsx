'use client';

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
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';

interface UsuarioData {
  nombre: string;
  correo: string;
  imagen?: string | null; // url del avatar en endpoint /api/perfil/foto?nombre=
  plan?: string;
  tiene2FA?: boolean;
}

export default function UserMenu({
  usuario,
}: {
  usuario: UsuarioData | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [temaOscuro, setTemaOscuro] = useState(true); // Oscuro por default
  const refMenu = useRef<HTMLDivElement>(null);

  // Avatar image url (si existe)
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // Inicializa tema desde localStorage o sistema, por default oscuro
  useEffect(() => {
    let temaGuardado = localStorage.getItem('tema');
    if (!temaGuardado) {
      const preferenciaSistema = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      temaGuardado = preferenciaSistema || 'dark';
    }
    setTemaOscuro(temaGuardado === 'dark');
    document.documentElement.classList.toggle('dark', temaGuardado === 'dark');
    document.documentElement.classList.toggle('light', temaGuardado === 'light');
  }, []);

  // Cerrar menú al click fuera o Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (refMenu.current && !refMenu.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Cierra menú al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Carga foto de perfil desde el backend si está disponible (llama una sola vez)
  useEffect(() => {
    if (usuario?.imagen) {
      setFotoPerfil(usuario.imagen);
    } else if (usuario?.correo) {
      // Si usas endpoint propio: `/api/perfil/foto?correo=...`
      fetch(`/api/perfil/foto?correo=${encodeURIComponent(usuario.correo)}`)
        .then(r => r.ok ? r.blob() : null)
        .then(blob => {
          if (blob) setFotoPerfil(URL.createObjectURL(blob));
        });
    } else {
      setFotoPerfil(null);
    }
  }, [usuario]);

  // Switch Tema: actualiza html y localStorage
  const alternarTema = () => {
    setTemaOscuro((prev) => {
      const nextIsDark = !prev;
      document.documentElement.classList.toggle('dark', nextIsDark);
      document.documentElement.classList.toggle('light', !nextIsDark);
      localStorage.setItem('tema', nextIsDark ? 'dark' : 'light');
      return nextIsDark;
    });
  };

  // Cerrar sesión de verdad (endpoint)
  const cerrarSesion = async () => {
    setOpen(false);
    await fetch('/api/login', { method: 'DELETE' });
    router.replace('/login');
  };

  // Avatar rendering (image, svg avatar, or initial)
  const renderAvatar = () => {
    if (fotoPerfil) {
      return (
        <img
          src={fotoPerfil}
          alt="Avatar"
          className="h-9 w-9 rounded-full object-cover border-2 border-amber-300 shadow"
        />
      );
    }
    if (usuario?.nombre) {
      // Avatar colorido con inicial
      const color = usuario.nombre.charCodeAt(0) % 5;
      const bgList = [
        'bg-amber-400',
        'bg-blue-300',
        'bg-emerald-300',
        'bg-pink-300',
        'bg-purple-400'
      ];
      return (
        <span className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-lg ${bgList[color]} text-white shadow`}>
          {usuario.nombre[0].toUpperCase()}
        </span>
      );
    }
    return (
      <span className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg text-white shadow">
        U
      </span>
    );
  };

  return (
    <div className="relative" ref={refMenu}>
      <button
        aria-label="Abrir menú de usuario"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center hover:ring-2 ring-amber-400 transition"
        tabIndex={0}
      >
        {renderAvatar()}
      </button>

      {open && (
        <nav
          className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl border border-amber-200 bg-white shadow-xl z-50 animate-fade-scale dark:bg-zinc-900 dark:border-zinc-700"
          aria-label="Menú de usuario"
        >
          {/* Sesión activa */}
          {usuario ? (
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{usuario?.nombre}</span>
                {/* PLAN */}
                {usuario.plan && (
                  <span className={clsx(
                    "text-xs px-2 py-0.5 rounded-full ml-auto flex items-center gap-1",
                    usuario.plan === "Pro"
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : usuario.plan === "Empresarial"
                      ? "bg-sky-100 text-sky-700 border border-sky-300"
                      : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                  )}>
                    <BadgeCheck className="w-3 h-3" />
                    {usuario.plan}
                  </span>
                )}
                {/* 2FA */}
                {usuario.tiene2FA && (
                  <span title="2FA activo" className="ml-1 text-emerald-500"><ShieldCheck className="h-4 w-4 inline" /></span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 break-all">{usuario?.correo}</p>
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-sm text-zinc-500">
              No has iniciado sesión
            </div>
          )}

          {/* Accesos rápidos */}
          {usuario && (
            <div className="border-t dark:border-zinc-700 py-2">
              <MenuLink href="/panel" icon={<LayoutDashboard className="h-4 w-4" />} label="Panel" tabIndex={open ? 0 : -1} />
              <MenuLink href="/configuracion" icon={<Settings className="h-4 w-4" />} label="Configuración" tabIndex={open ? 0 : -1} />
              <MenuLink href="/" icon={<Home className="h-4 w-4" />} label="Inicio" tabIndex={open ? 0 : -1} />
              {/* Seguridad (2FA, solo acceso si está activo) */}
              {usuario.tiene2FA && (
                <MenuLink href="/configuracion#seguridad" icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />} label="Seguridad" tabIndex={open ? 0 : -1} />
              )}
            </div>
          )}

          {/* Tema claro/oscuro */}
          <div className="border-t dark:border-zinc-700 px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Tema</span>
            <button
              onClick={alternarTema}
              className={clsx(
                'rounded-full p-1 transition',
                temaOscuro
                  ? 'bg-zinc-700 text-yellow-400 hover:bg-zinc-600'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              )}
              aria-label={temaOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              {temaOscuro ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          {/* Login / Logout */}
          <div className="border-t dark:border-zinc-700">
            {usuario ? (
              <button
                onClick={cerrarSesion}
                className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800 dark:text-red-400 text-sm"
                tabIndex={open ? 0 : -1}
              >
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full px-4 py-2 flex items-center gap-2 text-amber-700 hover:bg-amber-50 dark:hover:bg-zinc-800 text-sm"
                tabIndex={open ? 0 : -1}
              >
                <LogIn className="h-4 w-4" /> Iniciar sesión
              </Link>
            )}
          </div>

          {/* Upgrade */}
          <div className="border-t dark:border-zinc-700">
            <Link
              href="/servicios"
              className="block w-full px-4 py-3 text-center text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition flex items-center justify-center gap-2"
              tabIndex={open ? 0 : -1}
            >
              {usuario?.plan === "Pro" || usuario?.plan === "Empresarial" ? "Gestionar mi Plan" : "Upgrade to Pro"}
              <ArrowUpRight className="h-4 w-4" />
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
    >
      {icon}
      {label}
    </Link>
  );
}
