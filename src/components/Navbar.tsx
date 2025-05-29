'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import UserMenu from './UserMenu';

// Links del navbar
const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/acerca', label: 'Acerca De' },
  { href: '/servicios', label: 'Servicios' },
];

const linkBase =
  'px-4 py-2 rounded-xl font-medium text-amber-50/90 bg-navglass/80 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-sm';

export default function Navbar() {
  // --- Estado de usuario real: aquí simulas, cambia luego por tu lógica de auth/estado global.
  const [usuario, setUsuario] = useState<any | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Simula login para test rápido (quítalo en producción)
  useEffect(() => {
    // Descomenta esto para test
    // setUsuario({ nombre: 'Arthur', correo: 'arthur@honeylabs.com' });
    const raw = localStorage.getItem('usuario');
    setUsuario(raw ? JSON.parse(raw) : null);
  }, []);

  const [showTopBar, setShowTopBar] = useState(true);
  const [navFloating, setNavFloating] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Oculta Navbar en rutas auth/login/registro
  const ocultarNavbar = /^(\/auth(\/|$)|(\/)?(login|registro)(\/|$))/.test(pathname);
  if (ocultarNavbar) return null;

  // Navbar flotante
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

  // Drawer mobile
  useEffect(() => {
    if (!menuOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    window.addEventListener('keydown', handleKey);
    drawerRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Link activo
  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname.startsWith(href) && href !== '/';

  // --- Animación de burbuja si no hay sesión
  function handleComenzar(e: React.MouseEvent) {
    if (!usuario) {
      e.preventDefault();
      setShowTooltip(true);
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
      tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 1700);
    }
  }

  // Ripple effect (opcional)
  function rippleEffect(e: React.MouseEvent) {
    const button = e.currentTarget as HTMLElement;
    const circle = document.createElement('span');
    circle.className = 'ripple';
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }

  return (
    <>
      {/* NAVBAR PRINCIPAL */}
      <div
        className={`
          fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
          bg-[#101014]/95 backdrop-blur-md shadow-lg
          ${showTopBar ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}
        `}
        style={{ willChange: 'transform, opacity' }}
        role="banner"
        aria-label="Barra superior"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-2 gap-4 min-h-[58px]">
          {/* Logo + Bienvenida */}
          <div className="flex items-center gap-2 group">
            <Link href="/" className="flex items-center gap-2 focus:outline-none select-none" aria-label="Ir al inicio">
              <Image
                src="/logo-honeylabs.png"
                alt="HoneyLabs"
                width={28}
                height={28}
                className="h-7 w-7 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2"
                draggable={false}
                priority
                style={{ userSelect: 'none' }}
              />
              {usuario && (
                <span className="hidden sm:inline-block text-base font-semibold text-amber-100 ml-2 drop-shadow">
                  Bienvenido, <span className="font-bold">{usuario.nombre}</span>
                </span>
              )}
            </Link>
          </div>

          {/* Links principales */}
          <nav className="flex items-center gap-2 mx-4">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  ${linkBase}
                  ${isActive(link.href)
                    ? 'bg-amber-100/10 text-amber-200 underline underline-offset-4'
                    : ''
                  }
                `}
                tabIndex={0}
                aria-current={isActive(link.href) ? 'page' : undefined}
                style={{
                  fontSize: '1rem',
                  minWidth: 92,
                  textAlign: 'center'
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Botón principal y acciones */}
          <div className="flex items-center gap-2 relative">
            {/* Si hay sesión: botón activo */}
            {usuario ? (
              <Link
                href="/panel"
                className="px-5 py-2 rounded-xl font-semibold bg-navglass/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-md text-base"
                style={{
                  minWidth: 154,
                  textAlign: 'center',
                  letterSpacing: '0.02em'
                }}
                onClick={rippleEffect}
                tabIndex={0}
              >
                Comenzar Ahora!
              </Link>
            ) : (
              <>
                <button
                  className="px-5 py-2 rounded-xl font-semibold bg-navglass/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-md text-base relative"
                  style={{
                    minWidth: 154,
                    textAlign: 'center',
                    letterSpacing: '0.02em'
                  }}
                  onClick={e => { handleComenzar(e); rippleEffect(e); }}
                  tabIndex={0}
                >
                  Comenzar Ahora!
                  {/* Tooltip animado */}
                  <span className={`
                    pointer-events-none absolute left-1/2 -top-12 transform -translate-x-1/2 
                    bg-amber-400 text-[#101014] font-semibold rounded-xl shadow-lg px-4 py-2 
                    transition-all duration-300 text-sm select-none
                    ${showTooltip ? 'opacity-100 scale-100 drop-shadow-2xl' : 'opacity-0 scale-95'}
                  `} style={{
                    zIndex: 200
                  }}>
                    Debes iniciar sesión antes
                  </span>
                </button>
                <Link
                  href="/registro"
                  className="ml-2 px-4 py-2 rounded-xl font-semibold bg-[#222]/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow text-base"
                  style={{
                    minWidth: 120,
                    textAlign: 'center'
                  }}
                  tabIndex={0}
                  onClick={rippleEffect}
                >
                  Regístrate
                </Link>
              </>
            )}
            <Link
              href="/wiki"
              className="ml-2 p-2 rounded-full hover:bg-[#222]/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="Ir a la Wiki"
              tabIndex={0}
            >
              <BookOpen className="w-5 h-5 text-amber-200" />
            </Link>
            <UserMenu usuario={usuario} />
            {/* Responsive: Hamburguesa */}
            <button
              className="md:hidden p-2 ml-1 rounded-full hover:bg-[#222]/70 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="Abrir menú"
              onClick={() => setMenuOpen(true)}
              type="button"
              tabIndex={0}
            >
              <Menu className="text-amber-100" />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Drawer móvil */}
      <div
        className={`
          fixed inset-0 bg-black/40 z-[99] transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      >
        <div
          ref={drawerRef}
          tabIndex={menuOpen ? 0 : -1}
          className={`
            absolute right-0 top-0 h-full w-72 max-w-[90vw] bg-[#101014]/95 backdrop-blur-lg shadow-lg p-6 flex flex-col gap-6 transition-transform duration-300
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-label="Menú móvil"
        >
          <button className="self-end mb-4 p-2 rounded hover:bg-[#332711]/30 focus:outline-none" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
            <X className="text-amber-200" />
          </button>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="py-2 px-3 rounded-xl hover:bg-amber-400/90 hover:text-[#101014] text-lg text-amber-100 transition-all duration-300" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {usuario ? (
            <Link
              href="/panel"
              className="py-2 px-3 rounded-xl font-semibold bg-navglass/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 shadow text-lg"
              style={{ minWidth: 120, textAlign: 'center' }}
              onClick={() => setMenuOpen(false)}
            >
              Comenzar Ahora!
            </Link>
          ) : (
            <>
              <button
                className="py-2 px-3 rounded-xl font-semibold bg-navglass/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 shadow text-lg relative"
                style={{ minWidth: 120, textAlign: 'center' }}
                onClick={handleComenzar}
              >
                Comenzar Ahora!
                {/* Tooltip móvil */}
                <span className={`
                  pointer-events-none absolute left-1/2 -top-10 transform -translate-x-1/2 
                  bg-amber-400 text-[#101014] font-semibold rounded-xl shadow-lg px-4 py-2 
                  transition-all duration-300 text-sm select-none
                  ${showTooltip ? 'opacity-100 scale-100 drop-shadow-2xl' : 'opacity-0 scale-95'}
                `} style={{
                  zIndex: 200
                }}>
                  Debes iniciar sesión antes
                </span>
              </button>
              <Link
                href="/registro"
                className="mt-2 py-2 px-3 rounded-xl font-semibold bg-[#222]/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 shadow text-lg"
                style={{ minWidth: 120, textAlign: 'center' }}
                onClick={() => setMenuOpen(false)}
              >
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Spacer para navbar fijo */}
      <div className="h-[80px] sm:h-[88px]" aria-hidden="true" />

      {/* Ripple y fondo glass */}
      <style jsx global>{`
        .ripple {
          position: absolute;
          background: rgba(255,193,7,0.13);
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
