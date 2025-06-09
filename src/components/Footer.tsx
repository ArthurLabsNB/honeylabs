"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Footer() {
  const [showLegal, setShowLegal] = useState(false);
  const legalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<"left" | "right">(
    "left",
  );

  // Ajusta posición del menú legal si está muy cerca del borde derecho
  useEffect(() => {
    if (showLegal && legalRef.current && dropdownRef.current) {
      const buttonRect = legalRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      if (buttonRect.left + dropdownRect.width + 24 > windowWidth) {
        setDropdownPosition("right");
      } else {
        setDropdownPosition("left");
      }
    }
  }, [showLegal]);

  // Cierra el menú legal con click fuera o Escape
  useEffect(() => {
    if (!showLegal) return;
    function handleClick(e: MouseEvent) {
      if (
        legalRef.current &&
        !legalRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowLegal(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowLegal(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showLegal]);

  return (
    <footer
      className="bg-[var(--color-background)] border-t border-amber-200 dark:border-zinc-700 py-6 text-sm text-[var(--color-foreground)]"
      role="contentinfo"
    >
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
        {/* 🔗 Navegación principal */}
        <nav
          className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6"
          aria-label="Navegación de footer"
        >
          <Link
            href="/"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Inicio
          </Link>
          <Link
            href="/docs"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Documentación
          </Link>
          <Link
            href="/ayuda"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Soporte
          </Link>
          <Link
            href="/contacto"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Contacto
          </Link>
          <Link
            href="https://github.com/LabGestor/honeylabs"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          <Link
            href="/estado"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Estado del sistema
          </Link>
          {/* LEGAL DROPDOWN */}
          <div className="relative" ref={legalRef}>
            <button
              onClick={() => setShowLegal((v) => !v)}
              className="flex items-center gap-1 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-haspopup="true"
              aria-expanded={showLegal}
              aria-controls="legal-dropdown"
              tabIndex={0}
              type="button"
            >
              Legal
              <ChevronDown className="w-4 h-4" />
            </button>
            <div
              ref={dropdownRef}
              id="legal-dropdown"
              className={`absolute z-50 min-w-[11.875rem] max-w-[18.125rem] w-fit bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-2xl text-left py-2 px-3 animate-fade-scale transition pointer-events-auto
                ${showLegal ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}
                ${dropdownPosition === "right" ? "right-0" : "left-0"}
                bottom-full mb-2
              `}
              tabIndex={-1}
              role="menu"
              aria-label="Políticas legales"
              onClick={() => setShowLegal(false)}
            >
              <h3 className="text-xs font-semibold text-zinc-500 mb-2">
                Políticas HoneyLabs
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/legal/privacidad" className="hover:underline">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terminos" className="hover:underline">
                    Términos de Servicio
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookies" className="hover:underline">
                    Política de Cookies
                  </Link>
                </li>
                <li>
                  <Link href="/legal/derechos" className="hover:underline">
                    Aviso de Derechos
                  </Link>
                </li>
                <li>
                  <Link href="/legal/conducta" className="hover:underline">
                    Código de Conducta
                  </Link>
                </li>
                <li>
                  <Link href="/legal/accesibilidad" className="hover:underline">
                    Accesibilidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* ℹ️ Info adicional */}
        <div className="text-center md:text-right">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} HoneyLabs. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Plataforma para gestión de inventarios educativos y empresariales.
            <br />
            <span className="text-amber-600">Versión beta.</span>
          </p>
        </div>
      </div>
      {/* Animación simple */}
      <style jsx>{`
        .animate-fade-scale {
          transition: all 0.16s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(0.98);
        }
        .opacity-100.scale-100.visible {
          opacity: 1 !important;
          transform: scale(1) !important;
          visibility: visible !important;
        }
        .opacity-0.scale-95.invisible {
          opacity: 0 !important;
          transform: scale(0.95) !important;
          visibility: hidden !important;
        }
      `}</style>
    </footer>
  );
}
