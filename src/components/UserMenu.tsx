'use client';

import {
  ArrowUpRight,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  Settings,
  Sun,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export default function UserMenu({
  usuario,
}: {
  usuario: { nombre: string; correo: string } | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [sesionActiva, setSesionActiva] = useState(!!usuario);
  const refMenu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSesionActiva(!!usuario);
  }, [usuario]);

  useEffect(() => {
    const temaGuardado = localStorage.getItem('tema') === 'oscuro';
    setTemaOscuro(temaGuardado);
    if (temaGuardado) document.documentElement.classList.add('dark');
  }, []);

  // ⛔ Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (refMenu.current && !refMenu.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alternarTema = () => {
    const nuevoTema = !temaOscuro;
    setTemaOscuro(nuevoTema);
    document.documentElement.classList.toggle('dark', nuevoTema);
    localStorage.setItem('tema', nuevoTema ? 'oscuro' : 'claro');
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    sessionStorage.clear();
    document.cookie = 'session=; Max-Age=0; path=/';
    setOpen(false);
    setSesionActiva(false);
    router.refresh();
  };

  return (
    <div className="relative" ref={refMenu}>
      <button
        onClick={() => setOpen(!open)}
        className="h-9 w-9 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center hover:ring-2 ring-amber-400 transition"
      >
        {usuario?.correo?.[0]?.toUpperCase() || 'U'}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-amber-200 bg-white shadow-xl z-50 animate-fade-scale dark:bg-zinc-900 dark:border-zinc-700">
          {/* Sesión activa */}
          {sesionActiva ? (
            <div className="px-4 py-3">
              <p className="text-sm font-semibold">{usuario?.nombre}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{usuario?.correo}</p>
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-sm text-zinc-500">
              No has iniciado sesión
            </div>
          )}

          <div className="border-t dark:border-zinc-700 py-2">
            {sesionActiva && (
              <>
                <MenuLink href="/panel" icon={<LayoutDashboard className="h-4 w-4" />} label="Panel" />
                <MenuLink href="/configuracion" icon={<Settings className="h-4 w-4" />} label="Configuración" />
                <MenuLink href="/" icon={<Home className="h-4 w-4" />} label="Inicio" />
              </>
            )}
          </div>

          {/* Tema */}
          <div className="border-t dark:border-zinc-700 px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Tema</span>
            <div className="flex gap-2">
              <button
                onClick={alternarTema}
                className={clsx(
                  'rounded-full p-1 transition',
                  !temaOscuro
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-zinc-700 text-yellow-400 hover:bg-zinc-600'
                )}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={alternarTema}
                className={clsx(
                  'rounded-full p-1 transition',
                  temaOscuro
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                )}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Login / Logout */}
          <div className="border-t dark:border-zinc-700">
            {sesionActiva ? (
              <button
                onClick={cerrarSesion}
                className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800 dark:text-red-400 text-sm"
              >
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-2 flex items-center gap-2 text-amber-700 hover:bg-amber-50 dark:hover:bg-zinc-800 text-sm"
              >
                <LogIn className="h-4 w-4" /> Iniciar sesión
              </Link>
            )}
          </div>

          {/* Upgrade */}
          <div className="border-t dark:border-zinc-700">
            <Link
              href="/servicios"
              onClick={() => setOpen(false)}
              className="block w-full px-4 py-3 text-center text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition flex items-center justify-center gap-2"
            >
              Upgrade to Pro <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-amber-50 dark:hover:bg-zinc-800"
    >
      {icon}
      {label}
    </Link>
  );
}
