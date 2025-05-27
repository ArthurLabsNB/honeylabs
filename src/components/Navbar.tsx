'use client';

import Link from 'next/link';
import { Bell, BookOpen, Menu, X, Sun, Moon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';

interface Usuario {
  nombre: string;
  correo: string;
  imagen: string | null;
  tipoCuenta: string;
}

// Constantes de links del navbar principal
const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/acerca', label: 'Acerca De' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/wiki', label: 'Wiki' }, // Si tienes la página wiki
];

const linkColor = "text-amber-800 dark:text-amber-100";
const linkHover = "hover:text-amber-600 dark:hover:text-amber-300";

export default function Navbar() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [showTopBar, setShowTopBar] = useState(true);
  const [navFloating, setNavFloating] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [userTooltip, setUserTooltip] = useState(false);

  const pathname = usePathname();

  // --- Oculta Navbar en rutas de auth, login, registro ---
  const ocultarNavbar = /^(\/auth(\/|$)|(\/)?(login|registro)(\/|$))/.test(pathname);
  if (ocultarNavbar) return null;

  // --- Maneja estado de usuario y escucha cambios en otras pestañas ---
  useEffect(() => {
    function updateUser() {
      const datos = localStorage.getItem('usuario');
      if (datos) {
        try {
          setUsuario(JSON.parse(datos));
        } catch {
          setUsuario(null);
          localStorage.removeItem('usuario');
        }
      } else {
        setUsuario(null);
      }
    }
    updateUser();
    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, []);

  // --- Navbar flotante con animación al hacer scroll ---
  useEffect(() => {
    const controlNavbar = () => {
      const y = window.scrollY;
      if (y > lastScrollY && y > 64) {
        setShowTopBar(false);
        setNavFloating(true);
      } else if (y < lastScrollY - 4 || y <= 0) {
        setShowTopBar(true);
        setNavFloating(false);
      }
      setLastScrollY(y);
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // --- Dark Mode toggle ---
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // --- Tooltip para nombres largos ---
  const userNameMax = 18;
  const userNameShort = usuario?.nombre && usuario.nombre.length > userNameMax
    ? usuario.nombre.substring(0, userNameMax - 1) + '…'
    : usuario?.nombre;

  // --- Ripple effect ---
  function rippleEffect(e: React.MouseEvent) {
    const button = e.currentTarget as HTMLElement;
    const circle = document.createElement('span');
    circle.className = 'ripple';
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }

  // --- Placeholder para panel de notificaciones (futuro) ---
  // const [showNotificaciones, setShowNotificaciones] = useState(false);

  return (
    <>
      {/* TOP BAR */}
      <div
        className={`
          fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
          bg-white dark:bg-zinc-900 border-b border-amber-200 dark:border-zinc-700 shadow-sm
          ${showTopBar ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}
        `}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-3 py-2 gap-2 min-h-[52px]">
          {/* LOGO + BIENVENIDA */}
          <div className="flex items-center gap-2 transition-all duration-300 group">
            <Link href="/" className="flex items-center gap-1" aria-label="Ir al inicio">
              <img
                src="/logo-honeylabs.png"
                alt="HoneyLabs"
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                draggable={false}
                style={{ userSelect: 'none' }}
              />
              {usuario && (
                <span
                  className="hidden sm:inline-block text-base font-semibold text-amber-800 dark:text-amber-200 ml-2 relative cursor-pointer"
                  onMouseEnter={() => usuario.nombre.length > userNameMax && setUserTooltip(true)}
                  onMouseLeave={() => setUserTooltip(false)}
                >
                  Bienvenido,
                  <span className="font-bold ml-1">
                    {userNameShort}
                  </span>
                  {/* Tooltip si es largo */}
                  {userTooltip && (
                    <span className="absolute left-0 top-[110%] bg-black text-white px-2 py-1 rounded shadow text-xs whitespace-nowrap z-50">
                      {usuario.nombre}
                    </span>
                  )}
                </span>
              )}
            </Link>
          </div>
          {/* ACCIONES DERECHA */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Cambiar modo claro/oscuro"
              onClick={() => setIsDark(d => !d)}
              className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-zinc-700 transition"
              type="button"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {/* Ejemplo: Icono de notificaciones (a futuro como Drawer/Panel, no como página) */}
            {/* 
            <button
              aria-label="Notificaciones"
              className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-zinc-700 transition"
              onClick={() => setShowNotificaciones(v => !v)}
            >
              <Bell className="w-5 h-5" />
            </button>
            */}
            <Link
              href="/wiki"
              className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-zinc-700 transition"
              aria-label="Ir a la Wiki"
            >
              <BookOpen className="w-5 h-5" />
            </Link>
            <UserMenu usuario={usuario} />
            {/* Responsive: Hamburguesa */}
            <button
              className="md:hidden p-2 ml-2 rounded-full hover:bg-amber-200 dark:hover:bg-zinc-800 transition"
              aria-label="Abrir menú"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR (flotante al bajar) */}
      <div
        className={`
          fixed w-full left-0 z-40 transition-all duration-400 ease-in-out pointer-events-auto
          ${navFloating
            ? 'top-0 bg-amber-50/95 dark:bg-zinc-900/95 border-b border-amber-300 shadow-lg backdrop-blur-sm'
            : 'top-[52px] bg-amber-50 dark:bg-zinc-900 border-b border-amber-200'}
        `}
        style={{
          minHeight: '44px',
          willChange: 'transform, background, box-shadow',
        }}
      >
        <div className={`
          flex items-center
          ${navFloating ? 'gap-6 pl-[70px] pr-4' : 'gap-6 px-4'}
          py-2 max-w-7xl mx-auto text-sm font-semibold ${linkColor} transition-all duration-300
        `}>
          {/* Logo sticky cuando baja */}
          <div className={`transition-all duration-300 ${navFloating ? 'absolute left-4 top-1 scale-90 bg-white dark:bg-zinc-800 rounded-full shadow-md px-1 py-1 backdrop-blur' : 'hidden'}`}>
            <Link href="/" draggable={false} aria-label="Ir al inicio">
              <img
                src="/logo-honeylabs.png"
                alt="HoneyLabs"
                className="h-7 w-7"
                style={{ userSelect: 'none' }}
              />
            </Link>
          </div>
          {/* Links */}
          <nav className="flex items-center gap-3 flex-grow" aria-label="Navegación principal">
            {navLinks.slice(0, 3).map((link, i) => (
              <span key={link.href} className="flex items-center">
                <Link href={link.href} className={`px-2 ${linkHover}`}>
                  {link.label}
                </Link>
                {i < 2 && (
                  <span className="mx-1 text-amber-400 select-none font-bold">·</span>
                )}
              </span>
            ))}
          </nav>
          {/* Botones */}
          {usuario ? (
            <Link
              href="/panel"
              className="ml-auto bg-amber-600 text-white px-3 py-1 rounded-md shadow hover:bg-amber-700 hover:shadow-lg transition relative overflow-hidden"
              onClick={rippleEffect}
              tabIndex={0}
            >
              Comenzar Ahora!
            </Link>
          ) : (
            <Link
              href="/registro"
              className="ml-auto bg-amber-100 border border-amber-300 px-3 py-1 rounded shadow hover:bg-amber-200 hover:shadow-lg transition relative overflow-hidden"
              onClick={rippleEffect}
              tabIndex={0}
            >
              Regístrate
            </Link>
          )}
        </div>
      </div>

      {/* Responsive Menú hamburguesa (Mobile Drawer) */}
      <div
        className={`
          fixed inset-0 bg-black/30 z-[99] transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`
            absolute right-0 top-0 h-full w-72 max-w-[90vw] bg-white dark:bg-zinc-900 shadow-lg p-6 flex flex-col gap-6 transition-transform duration-300
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          onClick={e => e.stopPropagation()}
        >
          <button className="self-end mb-4 p-2 rounded hover:bg-amber-100 dark:hover:bg-zinc-800" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
            <X />
          </button>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="py-2 px-3 rounded hover:bg-amber-100 dark:hover:bg-zinc-800 text-lg" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {usuario ? (
            <Link
              href="/panel"
              className="py-2 px-3 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
              onClick={() => setMenuOpen(false)}
            >
              Comenzar Ahora!
            </Link>
          ) : (
            <Link
              href="/registro"
              className="py-2 px-3 bg-amber-100 border border-amber-300 rounded hover:bg-amber-200 transition"
              onClick={() => setMenuOpen(false)}
            >
              Regístrate
            </Link>
          )}
        </div>
      </div>

      {/* Spacer para navbar fijo */}
      <div className="h-[96px] sm:h-[98px]" />
      {/* Efecto Ripple */}
      <style jsx global>{`
        .ripple {
          position: absolute;
          background: rgba(255,193,7,0.19);
          border-radius: 100%;
          transform: scale(0);
          animation: ripple-anim 0.6s linear;
          pointer-events: none;
          left: 50%;
          top: 50%;
          width: 120%;
          height: 120%;
          z-index: 0;
          translate: -50% -50%;
        }
        @keyframes ripple-anim {
          to {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
