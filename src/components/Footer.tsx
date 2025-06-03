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
      data-oid="e7ixl6b"
    >
      <div
        className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8"
        data-oid="-z:leng"
      >
        {/* 🔗 Navegación principal */}
        <nav
          className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6"
          aria-label="Navegación de footer"
          data-oid="f3lpt01"
        >
          <Link
            href="/"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-oid="5pg6suo"
          >
            Inicio
          </Link>
          <Link
            href="/docs"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-oid="vkmoyfy"
          >
            Documentación
          </Link>
          <Link
            href="/ayuda"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-oid="_99_.nv"
          >
            Soporte
          </Link>
          <Link
            href="/contacto"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-oid="fyzmazw"
          >
            Contacto
          </Link>
          <Link
            href="https://github.com/LabGestor/honeylabs"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            target="_blank"
            rel="noopener noreferrer"
            data-oid="jwnzkga"
          >
            GitHub
          </Link>
          <Link
            href="/estado"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-oid="p1zwuhc"
          >
            Estado del sistema
          </Link>
          {/* LEGAL DROPDOWN */}
          <div className="relative" ref={legalRef} data-oid="m.pu6l2">
            <button
              onClick={() => setShowLegal((v) => !v)}
              className="flex items-center gap-1 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-haspopup="true"
              aria-expanded={showLegal}
              aria-controls="legal-dropdown"
              tabIndex={0}
              type="button"
              data-oid="ig1re.h"
            >
              Legal
              <ChevronDown className="w-4 h-4" data-oid="_d6wlh3" />
            </button>
            <div
              ref={dropdownRef}
              id="legal-dropdown"
              className={`absolute z-50 min-w-[200px] max-w-xs w-fit bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-2xl text-left py-2 px-3 animate-fade-scale transition pointer-events-auto
                ${showLegal ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}
                ${dropdownPosition === "right" ? "right-0" : "left-0"}
                bottom-full mb-2
              `}
              style={{ minWidth: 190, maxWidth: 290 }}
              tabIndex={-1}
              role="menu"
              aria-label="Políticas legales"
              onClick={() => setShowLegal(false)}
              data-oid="4ae55z7"
            >
              <h3
                className="text-xs font-semibold text-zinc-500 mb-2"
                data-oid="lgxmwxw"
              >
                Políticas HoneyLabs
              </h3>
              <ul className="space-y-1 text-sm" data-oid="l69_93x">
                <li data-oid="g0uxso1">
                  <Link
                    href="/legal/privacidad"
                    className="hover:underline"
                    data-oid="9vee7r1"
                  >
                    Política de Privacidad
                  </Link>
                </li>
                <li data-oid="rvsumi4">
                  <Link
                    href="/legal/terminos"
                    className="hover:underline"
                    data-oid="wtyao_1"
                  >
                    Términos de Servicio
                  </Link>
                </li>
                <li data-oid="7i.v45b">
                  <Link
                    href="/legal/cookies"
                    className="hover:underline"
                    data-oid="_05wryy"
                  >
                    Política de Cookies
                  </Link>
                </li>
                <li data-oid="t-273vv">
                  <Link
                    href="/legal/derechos"
                    className="hover:underline"
                    data-oid="l5dc584"
                  >
                    Aviso de Derechos
                  </Link>
                </li>
                <li data-oid="nw5qn5a">
                  <Link
                    href="/legal/conducta"
                    className="hover:underline"
                    data-oid="q:xn_6:"
                  >
                    Código de Conducta
                  </Link>
                </li>
                <li data-oid="0lbs04o">
                  <Link
                    href="/legal/accesibilidad"
                    className="hover:underline"
                    data-oid="z9nwun3"
                  >
                    Accesibilidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* ℹ️ Info adicional */}
        <div className="text-center md:text-right" data-oid="4vrodhe">
          <p
            className="text-xs text-zinc-500 dark:text-zinc-400"
            data-oid="c8jyono"
          >
            © {new Date().getFullYear()} HoneyLabs. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-zinc-400 mt-1" data-oid="-773zdb">
            Plataforma para gestión de inventarios educativos y empresariales.
            <br data-oid="pv16r7." />
            <span className="text-amber-600" data-oid="1k6weht">
              Versión beta.
            </span>
          </p>
        </div>
      </div>
      {/* Animación simple */}
      <style jsx data-oid="dl6qo3q">{`
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
