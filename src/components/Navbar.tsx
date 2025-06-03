"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/acerca", label: "Acerca De" },
  { href: "/servicios", label: "Servicios" },
];

const linkBase =
  "px-4 py-2 rounded-xl font-medium text-amber-50/90 bg-navglass/80 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-sm";

export default function Navbar() {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Obtiene el usuario en vivo del backend
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/perfil", { credentials: "include" });
        const data = await res.json();
        if (data.success && data.usuario) {
          setUsuario({
            nombre: data.usuario.nombre,
            correo: data.usuario.correo,
            imagen: data.usuario.fotoPerfilNombre
              ? `/api/perfil/foto?nombre=${encodeURIComponent(data.usuario.fotoPerfilNombre)}`
              : undefined,
            plan: data.usuario.planNombre, // Asegúrate que lo traes en el select
            tiene2FA: data.usuario.tiene2FA,
          });
        } else {
          setUsuario(null);
        }
      } catch {
        setUsuario(null);
      }
    }
    fetchUser();
  }, []);

  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();

  // Oculta Navbar en rutas auth/login/registro
  const ocultarNavbar = /^(\/auth(\/|$)|(\/)?(login|registro)(\/|$))/.test(
    pathname,
  );
  if (ocultarNavbar) return null;

  // Navbar flotante
  useEffect(() => {
    const controlNavbar = () => {
      const y = window.scrollY;
      if (y > lastScrollY && y > 64) {
        setShowTopBar(false);
      } else if (y < lastScrollY - 4 || y <= 0) {
        setShowTopBar(true);
      }
      setLastScrollY(y);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // Drawer mobile
  useEffect(() => {
    if (!menuOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.body.style.overflow = menuOpen ? "hidden" : "";
    window.addEventListener("keydown", handleKey);
    drawerRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href) && href !== "/";

  function handleComenzar(e: React.MouseEvent) {
    if (!usuario) {
      e.preventDefault();
      setShowTooltip(true);
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
      tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 1700);
    }
  }

  function rippleEffect(e: React.MouseEvent) {
    const button = e.currentTarget as HTMLElement;
    const circle = document.createElement("span");
    circle.className = "ripple";
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }

  return (
    <>
      <div
        className={`
          fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
          bg-[#101014]/95 backdrop-blur-md shadow-lg
          ${showTopBar ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"}
        `}
        style={{ willChange: "transform, opacity" }}
        role="banner"
        aria-label="Barra superior"
        data-oid="1x6ik0_"
      >
        <div
          className="flex items-center justify-between w-full max-w-7xl mx-auto px-3 md:px-6 py-2 gap-2 min-h-[64px]"
          data-oid="pvabmo1"
        >
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center mr-2"
            data-oid="zq7nhog"
          >
            <Link
              href="/"
              className="flex items-center gap-2 focus:outline-none select-none"
              aria-label="Ir al inicio"
              data-oid="qricy0z"
            >
              <Image
                src="/logo-honeylabs.png"
                alt="HoneyLabs"
                width={32}
                height={32}
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2"
                draggable={false}
                priority
                style={{ userSelect: "none" }}
                data-oid="esws44s"
              />
            </Link>
          </div>

          {/* Bienvenido con nombre, clickeable */}
          {usuario && (
            <Link
              href="/configuracion"
              title={usuario.nombre}
              className="hidden md:inline-block text-base font-semibold text-amber-100 ml-3 mr-2 drop-shadow max-w-[260px] truncate hover:underline cursor-pointer transition"
              style={{ lineHeight: "1.2" }}
              data-oid="01z0g:x"
            >
              Bienvenido,{" "}
              <span className="font-bold" data-oid="grkgzvl">
                {usuario.nombre}
              </span>
            </Link>
          )}

          {/* Botones de navegación */}
          <nav
            className="hidden md:flex items-center gap-2 mx-2"
            data-oid="4x7fw9l"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  ${linkBase}
                  ${
                    isActive(link.href)
                      ? "bg-amber-100/10 text-amber-200 underline underline-offset-4"
                      : ""
                  }
                `}
                tabIndex={0}
                aria-current={isActive(link.href) ? "page" : undefined}
                style={{
                  fontSize: "1rem",
                  minWidth: 92,
                  textAlign: "center",
                }}
                data-oid="6271ny1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Botón Wiki */}
          <Link
            href="/wiki"
            className="hidden md:inline-flex ml-2 p-2 rounded-full hover:bg-[#222]/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Ir a la Wiki"
            tabIndex={0}
            data-oid="pq6x-_4"
          >
            <BookOpen className="w-5 h-5 text-amber-200" data-oid="t.b.a.9" />
          </Link>

          {/* Botón Comenzar Ahora */}
          <div className="flex-shrink-0 ml-2" data-oid="3kwoumm">
            {usuario ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl font-semibold bg-navglass/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-md text-base w-full sm:w-auto max-w-xs text-center"
                style={{ letterSpacing: "0.02em" }}
                onClick={rippleEffect}
                tabIndex={0}
                data-oid="h1q3ha7"
              >
                Comenzar Ahora!
              </Link>
            ) : (
              <button
                className="px-4 py-2 rounded-xl font-semibold bg-navglass/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-md text-base w-full sm:w-auto max-w-xs text-center relative"
                style={{ letterSpacing: "0.02em" }}
                onClick={(e) => {
                  handleComenzar(e);
                  rippleEffect(e);
                }}
                tabIndex={0}
                data-oid="p91-7f1"
              >
                Comenzar Ahora!
                <span
                  className={`
                  pointer-events-none absolute left-1/2 -top-12 transform -translate-x-1/2 
                  bg-amber-400 text-[#101014] font-semibold rounded-xl shadow-lg px-4 py-2 
                  transition-all duration-300 text-sm select-none
                  ${showTooltip ? "opacity-100 scale-100 drop-shadow-2xl" : "opacity-0 scale-95"}
                `}
                  style={{ zIndex: 200 }}
                  data-oid="51:ex24"
                >
                  Debes iniciar sesión antes
                </span>
              </button>
            )}
          </div>

          {/* Botón de registrar si no hay sesión */}
          {!usuario && (
            <Link
              href="/registro"
              className="hidden md:inline-flex ml-2 px-4 py-2 rounded-xl font-semibold bg-[#222]/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow text-base"
              style={{
                minWidth: 120,
                textAlign: "center",
              }}
              tabIndex={0}
              onClick={rippleEffect}
              data-oid="bx7ah_o"
            >
              Regístrate
            </Link>
          )}

          {/* Avatar/UserMenu hasta la derecha */}
          <div
            className="flex-shrink-0 flex items-center ml-2"
            data-oid="85.3tz9"
          >
            <UserMenu usuario={usuario} data-oid="5wyat-b" />
          </div>

          {/* Botón hamburguesa solo móvil/tablet */}
          <button
            className="block md:hidden p-2 ml-1 rounded-full hover:bg-[#222]/70 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
            type="button"
            tabIndex={0}
            data-oid="-iabmme"
          >
            <Menu className="text-amber-100" data-oid="jqinblf" />
          </button>
        </div>
      </div>

      {/* Drawer móvil */}
      <div
        className={`
          fixed inset-0 bg-black/40 z-[99] transition-opacity duration-300
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
        data-oid=".:3jnwz"
      >
        <div
          ref={drawerRef}
          tabIndex={menuOpen ? 0 : -1}
          className={`
            absolute right-0 top-0 h-full w-80 max-w-[98vw] bg-[#101014]/95 backdrop-blur-lg shadow-lg p-6 flex flex-col gap-5 transition-transform duration-300
            ${menuOpen ? "translate-x-0" : "translate-x-full"}
          `}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Menú móvil"
          data-oid="t6ij8l1"
        >
          <button
            className="self-end mb-4 p-2 rounded hover:bg-[#332711]/30 focus:outline-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            data-oid="ugse3wn"
          >
            <X className="text-amber-200" data-oid="o0_glq." />
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 px-3 rounded-xl hover:bg-amber-400/90 hover:text-[#101014] text-lg text-amber-100 transition-all duration-300"
              onClick={() => setMenuOpen(false)}
              data-oid="lhrrfpj"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/wiki"
            className="py-2 px-3 rounded-xl hover:bg-amber-400/90 hover:text-[#101014] text-lg text-amber-100 flex items-center gap-2 transition-all duration-300"
            onClick={() => setMenuOpen(false)}
            data-oid=".0a7034"
          >
            <BookOpen className="w-5 h-5" data-oid="51tww7k" /> Wiki
          </Link>
          {usuario ? (
            <Link
              href="/panel"
              className="py-2 px-3 rounded-xl font-semibold bg-navglass/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 shadow text-lg"
              style={{ minWidth: 120, textAlign: "center" }}
              onClick={() => setMenuOpen(false)}
              data-oid=":zn-ekh"
            >
              Comenzar Ahora!
            </Link>
          ) : (
            <>
              <button
                className="py-2 px-3 rounded-xl font-semibold bg-navglass/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 shadow text-lg relative"
                style={{ minWidth: 120, textAlign: "center" }}
                onClick={handleComenzar}
                data-oid="i-9-ofx"
              >
                Comenzar Ahora!
                <span
                  className={`
                  pointer-events-none absolute left-1/2 -top-10 transform -translate-x-1/2 
                  bg-amber-400 text-[#101014] font-semibold rounded-xl shadow-lg px-4 py-2 
                  transition-all duration-300 text-sm select-none
                  ${showTooltip ? "opacity-100 scale-100 drop-shadow-2xl" : "opacity-0 scale-95"}
                `}
                  style={{ zIndex: 200 }}
                  data-oid="8mwt2g7"
                >
                  Debes iniciar sesión antes
                </span>
              </button>
              <Link
                href="/registro"
                className="mt-2 py-2 px-3 rounded-xl font-semibold bg-[#222]/80 text-amber-100 hover:bg-amber-400/90 hover:text-[#101014] transition-all duration-300 shadow text-lg"
                style={{ minWidth: 120, textAlign: "center" }}
                onClick={() => setMenuOpen(false)}
                data-oid="7ut5c66"
              >
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Espaciador navbar */}
      <div
        className="h-[80px] sm:h-[88px]"
        aria-hidden="true"
        data-oid="08c5icf"
      />

      <style jsx global data-oid="avmlgrh">{`
        .ripple {
          position: absolute;
          background: rgba(255, 193, 7, 0.13);
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
