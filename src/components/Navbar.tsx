'use client';

import Link from 'next/link';
import { Bell, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserMenu from './UserMenu';

interface Usuario {
  nombre: string;
  correo: string;
  imagen: string | null;
  tipoCuenta: string;
}

export default function Navbar() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navFloating, setNavFloating] = useState(false);

  // 📦 Obtener usuario de localStorage
  useEffect(() => {
    const datos = localStorage.getItem('usuario');
    if (datos) {
      try {
        const user: Usuario = JSON.parse(datos);
        setUsuario(user);
      } catch (err) {
        console.error('⚠️ Error al parsear usuario:', err);
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  // 🎯 Control de visibilidad de TopBar / Navbar flotante
  useEffect(() => {
    const controlNavbar = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 80) {
        setShowTopBar(false);
        setNavFloating(true);
      } else if (currentY < lastScrollY - 5 || currentY <= 0) {
        setShowTopBar(true);
        setNavFloating(false);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <>
      {/* 🔝 TOP BAR */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-out
        bg-white dark:bg-zinc-900 border-b border-amber-200 dark:border-zinc-700
        ${showTopBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
        style={{ willChange: 'transform' }}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img src="/logo-honeylabs.png" alt="HoneyLabs" className="h-8 w-8" />
            </Link>
            {usuario && (
              <Link href="/configuracion" className="text-sm font-medium text-amber-800 dark:text-amber-300 hover:underline">
                Bienvenido/a, <span className="font-semibold">{usuario.nombre}</span>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/notificaciones" className="text-amber-600 hover:text-amber-800 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </Link>
            <Link href="/wiki" className="text-amber-600 hover:text-amber-800 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </Link>
            <div className="relative z-50">
              <UserMenu usuario={usuario} />
            </div>
          </div>
        </div>
      </div>

      {/* 🔻 MAIN NAVBAR */}
      <div
        className={`
          fixed w-full left-0 transition-all duration-300 ease-in-out z-40
          ${navFloating
            ? 'top-0 bg-amber-100 dark:bg-zinc-800 border-b border-amber-300 shadow-md animate-navbar-fade-in'
            : 'top-12 bg-amber-50 dark:bg-zinc-900 border-b border-amber-200'}
        `}
      >
        <div className="flex items-center gap-6 px-4 py-2 max-w-7xl mx-auto text-sm font-medium text-amber-800 dark:text-amber-100">
          <Link href="/" className="hover:underline">Inicio</Link>
          <Link href="/acerca" className="hover:underline">Acerca De</Link>
          <Link href="/servicios" className="hover:underline">Servicios</Link>

          <Link
            href="/panel"
            className="bg-amber-600 text-white px-3 py-1 rounded-md hover:bg-amber-700 transition"
          >
            Comenzar Ahora!
          </Link>

          {!usuario && (
            <Link
              href="/registro"
              className="ml-auto bg-amber-100 border border-amber-300 px-3 py-1 rounded hover:bg-amber-200 transition"
            >
              Registrate
            </Link>
          )}
        </div>
      </div>

      {/* 🧱 Reservar espacio para navbar fijo */}
      <div className="h-[92px] sm:h-[96px]" />
    </>
  );
}
