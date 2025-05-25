'use client';

import Link from 'next/link';
import { Bell, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserMenu from './UserMenu';

const usuario = {
  nombre: 'ArthurNb',
  correo: 'arturonb00@gmail.com',
  imagen: null,
  tipoCuenta: 'estandar',
};

const sesionActiva = true;

export default function Navbar() {
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navFloating, setNavFloating] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 80) {
        setShowTopBar(false); // Bajando: ocultar topbar
        setNavFloating(true); // Navbar compacto se eleva arriba
      } else if (currentY < lastScrollY - 5) {
        setShowTopBar(true); // Subiendo: mostrar topbar y navbar normal
        setNavFloating(false);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
    // eslint-disable-next-line
  }, [lastScrollY]);

  return (
    <nav className="w-full fixed top-0 z-50 pointer-events-auto">
      {/* TOP BAR */}
      <div
        className={`bg-white border-b border-amber-200 px-4 py-2 transition-transform duration-300
        ${showTopBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
        style={{ willChange: 'transform' }}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <img src="/logo-honeylabs.svg" alt="HoneyLabs" className="h-8 w-8" />
            </Link>
            <Link href="/configuracion" className="text-sm font-medium text-amber-800 hover:underline">
              Bienvenido/a, <span className="font-semibold">{usuario.nombre}</span>
            </Link>
          </div>
          {/* Right */}
          <div className="flex items-center gap-4">
            <Link href="/notificaciones" className="text-amber-600 hover:text-amber-800">
              <Bell className="w-5 h-5" />
            </Link>
            <Link href="/wiki" className="text-amber-600 hover:text-amber-800">
              <BookOpen className="w-5 h-5" />
            </Link>
            <UserMenu usuario={usuario} />
          </div>
        </div>
      </div>

      {/* NAV BAR compacta - Animada, se eleva cuando baja scroll */}
      <div
        className={`
          bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 font-medium
          flex items-center gap-6 w-full transition-all duration-300
          ${navFloating
            ? 'fixed top-0 left-0 shadow-md z-50 bg-amber-100 border-amber-300 rounded-none animate-navbar-float'
            : 'relative max-w-7xl mx-auto'}
        `}
        style={{
          boxShadow: navFloating
            ? '0 4px 24px 0 rgba(214, 158, 46, 0.10)' : undefined,
          borderRadius: navFloating ? '0 0 18px 18px' : undefined,
        }}
      >
        <Link href="/" className="hover:underline">Inicio</Link>
        <Link href="/acerca" className="hover:underline">Acerca De</Link>
        <Link href="/servicios" className="hover:underline">Servicios</Link>
        <Link
          href="/panel"
          className="bg-amber-600 text-white px-3 py-1 rounded-md hover:bg-amber-700 transition"
        >
          Comenzar Ahora!
        </Link>
        {!sesionActiva && (
          <Link
            href="/registro"
            className="ml-auto bg-amber-100 border border-amber-300 px-3 py-1 rounded hover:bg-amber-200 transition"
          >
            Registrate
          </Link>
        )}
      </div>
      {/* Opcional: espacio para evitar "salto" del contenido */}
      <div style={{ height: navFloating ? 48 : 0 }}></div>
    </nav>
  );
}
