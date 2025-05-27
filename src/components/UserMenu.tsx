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

  const refMenu = useRef<HTMLDivElement>(null);

  // Inicializa tema desde localStorage o sistema
  useEffect(() => {
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado === 'oscuro' || (!temaGuardado && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTemaOscuro(true);
      document.documentElement.classList.add('dark');
    } else {
      setTemaOscuro(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Cerrar menú al click fuera o al navegar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (refMenu.current && !refMenu.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cierra menú al navegar
  useEffect(() => {
    setOpen(false);
  }, [router]);

  const alternarTema = () => {
    setTemaOscuro((prev) => {
      const nuevo = !prev;
      document.documentElement.classList.toggle('dark', nuevo);
      localStorage.setItem('tema', nuevo ? 'oscuro' : 'claro');
      return nuevo;
    });
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    sessionStorage.clear();
    document.cookie = 'session=; Max-Age=0; path=/';
    setOpen(false);
    // 🔄 Refresca toda la app para forzar recarga y logout limpio
    window.location.href = '/login';
  };

  return (
    <div className="relative" ref={refMenu}>
      <button
        aria-label="Abrir menú de usuario"
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center hover:ring-2 ring-amber-400 transition"
        tabIndex={0}
      >
        {usuario?.correo?.[0]?.toUpperCase() || 'U'}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-amber-200 bg-white shadow-xl z-50 animate-fade-scale dark:bg-zinc-900 dark:border-zinc-700">
          {/* Sesión activa */}
          {usuario ? (
            <div className="px-4 py-3">
              <p className="text-sm font-semibold">{usuario?.nombre}</p>
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
              <MenuLink href="/panel" icon={<LayoutDashboard className="h-4 w-4" />} label="Panel" />
              <MenuLink href="/configuracion" icon={<Settings className="h-4 w-4" />} label="Configuración" />
              <MenuLink href="/" icon={<Home className="h-4 w-4" />} label="Inicio" />
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
              >
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            ) : (
              <Link
                href="/login"
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
