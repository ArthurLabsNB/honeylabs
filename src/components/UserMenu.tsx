'use client';

import { useState, useEffect } from 'react';
import {
  LogOut,
  Settings,
  LayoutDashboard,
  Home,
  Sun,
  Moon,
  LogIn,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
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

  // ⏳ Detectar cambio de sesión
  useEffect(() => {
    setSesionActiva(!!usuario);
  }, [usuario]);

  // 🌙 Cargar tema desde localStorage
  useEffect(() => {
    const temaGuardado = localStorage.getItem('tema') === 'oscuro';
    setTemaOscuro(temaGuardado);
    if (temaGuardado) document.documentElement.classList.add('dark');
  }, []);

  const alternarTema = () => {
    const nuevoTema = !temaOscuro;
    setTemaOscuro(nuevoTema);
    document.documentElement.classList.toggle('dark', nuevoTema);
    localStorage.setItem('tema', nuevoTema ? 'oscuro' : 'claro');
  };

  const cerrarSesion = () => {
    // 🔐 Simulación de cierre de sesión
    localStorage.removeItem('usuario');
    sessionStorage.clear();
    document.cookie = 'session=; Max-Age=0; path=/';

    setOpen(false);
    setSesionActiva(false);

    // Puedes redirigir si deseas
    // router.push('/login');
    router.refresh();
  };

  return (
    <div className="relative">
      {/* Botón circular (avatar inicial) */}
      <button
        onClick={() => setOpen(!open)}
        className="h-9 w-9 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center hover:ring-2 ring-amber-400 transition"
      >
        {usuario?.correo?.[0]?.toUpperCase() || 'U'}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 shadow-xl border border-amber-200 dark:border-zinc-700 rounded-xl z-50 text-sm text-zinc-800 dark:text-zinc-100 overflow-hidden">
          {/* 🧑 Usuario o no sesión */}
          {sesionActiva ? (
            <div className="px-4 py-3 border-b dark:border-zinc-700">
              <p className="font-semibold">{usuario?.nombre}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{usuario?.correo}</p>
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-sm">
              No has iniciado sesión
            </div>
          )}

          {/* 📚 Opciones si hay sesión */}
          {sesionActiva && (
            <div className="flex flex-col py-2">
              <Link
                href="/panel"
                className="px-4 py-2 hover:bg-amber-50 dark:hover:bg-zinc-800 flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link
                href="/configuracion"
                className="px-4 py-2 hover:bg-amber-50 dark:hover:bg-zinc-800 flex items-center gap-2"
              >
                <Settings className="h-4 w-4" /> Account Settings
              </Link>
              <Link
                href="/"
                className="px-4 py-2 hover:bg-amber-50 dark:hover:bg-zinc-800 flex items-center gap-2"
              >
                <Home className="h-4 w-4" /> Home Page
              </Link>
            </div>
          )}

          {/* 🎨 Cambio de tema */}
          <div className="border-t dark:border-zinc-700 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Tema</span>
            <div className="flex items-center gap-2">
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

          {/* 🔐 Logout o Login */}
          <div className="border-t dark:border-zinc-700">
            {sesionActiva ? (
              <button
                onClick={cerrarSesion}
                className="w-full px-4 py-2 hover:bg-amber-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4" /> Cerrar Sesión
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-2 hover:bg-amber-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-amber-700"
              >
                <LogIn className="h-4 w-4" /> Iniciar Sesión
              </Link>
            )}
          </div>

          {/* 🚀 Upgrade */}
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
