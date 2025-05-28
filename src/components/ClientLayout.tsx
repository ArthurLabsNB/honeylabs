'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieBanner from './CookieBanner'; // 👈 ¡Agregado!

const RUTAS_OCULTAR_NAV = [
  /^\/auth(\/|$)/, // Oculta en cualquier ruta bajo /auth (login, registro, etc)
  // Puedes agregar más patrones aquí.
];

function debeOcultarNavbarFooter(pathname: string): boolean {
  return RUTAS_OCULTAR_NAV.some((regex) => regex.test(pathname));
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ocultarNavbar = debeOcultarNavbarFooter(pathname);

  return (
    <>
      {/* Puedes agregar aquí un UserProvider o ThemeProvider global */}
      {!ocultarNavbar && <Navbar />}

      <main
        className="
          min-h-[calc(100vh-120px)]
          pt-[96px] pb-8
          max-w-7xl mx-auto w-full
        "
        aria-label="Contenido principal"
      >
        {children}
      </main>

      {!ocultarNavbar && <Footer />}

      {/* Banner de cookies (siempre visible excepto en rutas de auth) */}
      <CookieBanner />
    </>
  );
}
