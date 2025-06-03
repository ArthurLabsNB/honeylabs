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
      data-oid="y05nir:"
    >
      <div
        className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8"
        data-oid="g6dtsd4"
      >
        {/* 🔗 Navegación principal */}
        <nav
          className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6"
          aria-label="Navegación de footer"
          data-oid="9qbc6hu"
        >
          <Link
            href="/"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-oid="oryo:rf"
          >
            Inicio
          </Link>
          <Link
            href="/docs"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-oid="c.eqm1e"
          >
            Documentación
          </Link>
          <Link
            href="/ayuda"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-oid="w63i:vb"
          >
            Soporte
          </Link>
          <Link
            href="/contacto"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-oid="n4z62m8"
          >
            Contacto
          </Link>
          <Link
            href="https://github.com/LabGestor/honeylabs"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            target="_blank"
            rel="noopener noreferrer"
            data-oid="kbv_msr"
          >
            GitHub
          </Link>
          <Link
            href="/estado"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-oid="svsdb3i"
          >
            Estado del sistema
          </Link>
          {/* LEGAL DROPDOWN */}
          <div className="relative" ref={legalRef} data-oid="15f:3k-">
            <button
              onClick={() => setShowLegal((v) => !v)}
              className="flex items-center gap-1 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-haspopup="true"
              aria-expanded={showLegal}
              aria-controls="legal-dropdown"
              tabIndex={0}
              type="button"
              data-oid="8qbx-jn"
            >
              Legal
              <ChevronDown className="w-4 h-4" data-oid="bzj4aeb" />
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
              data-oid="otxfztm"
            >
              <h3
                className="text-xs font-semibold text-zinc-500 mb-2"
                data-oid="8jrlzxl"
              >
                Políticas HoneyLabs
              </h3>
              <ul className="space-y-1 text-sm" data-oid="nezh9qu">
                <li data-oid="j3pbt96">
                  <Link
                    href="/legal/privacidad"
                    className="hover:underline"
                    data-oid="x5yqh9u"
                  >
                    Política de Privacidad
                  </Link>
                </li>
                <li data-oid="e4dxrpm">
                  <Link
                    href="/legal/terminos"
                    className="hover:underline"
                    data-oid=":oo7pnb"
                  >
                    Términos de Servicio
                  </Link>
                </li>
                <li data-oid="hbdaxhz">
                  <Link
                    href="/legal/cookies"
                    className="hover:underline"
                    data-oid="al14qum"
                  >
                    Política de Cookies
                  </Link>
                </li>
                <li data-oid="pcq1yc6">
                  <Link
                    href="/legal/derechos"
                    className="hover:underline"
                    data-oid="frtl0d2"
                  >
                    Aviso de Derechos
                  </Link>
                </li>
                <li data-oid="g.efw8-">
                  <Link
                    href="/legal/conducta"
                    className="hover:underline"
                    data-oid="xgtoulh"
                  >
                    Código de Conducta
                  </Link>
                </li>
                <li data-oid="z2t6c7z">
                  <Link
                    href="/legal/accesibilidad"
                    className="hover:underline"
                    data-oid="20ecp37"
                  >
                    Accesibilidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* ℹ️ Info adicional */}
        <div className="text-center md:text-right" data-oid="ukyux75">
          <p
            className="text-xs text-zinc-500 dark:text-zinc-400"
            data-oid="nox_iem"
          >
            © {new Date().getFullYear()} HoneyLabs. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-zinc-400 mt-1" data-oid="3zcytvb">
            Plataforma para gestión de inventarios educativos y empresariales.
            <br data-oid=".u5n75_" />
            <span className="text-amber-600" data-oid="n41yjz4">
              Versión beta.
            </span>
          </p>
        </div>
      </div>
      {/* Animación simple */}
      <style jsx data-oid="_0:ste9">{`
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
