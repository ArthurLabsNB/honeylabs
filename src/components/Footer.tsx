'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function Footer() {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <footer className="bg-[var(--color-background)] border-t border-amber-200 dark:border-zinc-700 py-10 text-sm text-[var(--color-foreground)]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* 🔗 Navegación */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6">
          <Link href="/" className="hover:underline">Inicio</Link>
          <Link href="/docs" className="hover:underline">Documentación</Link>
          <Link href="/ayuda" className="hover:underline">Soporte</Link>
          <Link href="/contacto" className="hover:underline">Contacto</Link>

          {/* 🔽 Legal dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLegal(!showLegal)}
              className="flex items-center gap-1 hover:underline focus:outline-none"
            >
              Legal
              <ChevronDown className="w-4 h-4" />
            </button>

            {showLegal && (
              <div className="absolute bottom-full mb-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 text-left py-2 px-4 animate-fade-scale">
                <h3 className="text-xs font-semibold text-zinc-500 mb-2">Políticas HoneyLabs</h3>
                <ul className="space-y-1 text-sm">
                  <li><Link href="/legal/privacidad" className="hover:underline">Política de Privacidad</Link></li>
                  <li><Link href="/legal/terminos" className="hover:underline">Términos de Servicio</Link></li>
                  <li><Link href="/legal/cookies" className="hover:underline">Política de Cookies</Link></li>
                  <li><Link href="/legal/derechos" className="hover:underline">Aviso de Derechos</Link></li>
                  <li><Link href="/legal/conducta" className="hover:underline">Código de Conducta</Link></li>
                  <li><Link href="/legal/accesibilidad" className="hover:underline">Accesibilidad</Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ℹ️ Info adicional */}
        <div className="text-center md:text-right">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} HoneyLabs. Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Versión experimental para instituciones educativas y entornos logísticos.
          </p>
        </div>
      </div>
    </footer>
  );
}
