'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieBanner from './CookieBanner';

// Expande aquí según tus rutas a ocultar (puedes agregar más regex)
const RUTAS_OCULTAR_NAV = [
  /^\/auth(\/|$)/,     // Oculta todo bajo /auth (login, registro, etc.)
  /^\/login$/,         // Ejemplo: /login directo (si lo usas)
  /^\/registro$/,      // Ejemplo: /registro directo
  // Agrega otras rutas aquí según crezca tu app (ejemplo: /^\/admin/)
];

// Devuelve true si debe ocultarse nav/footer
function debeOcultarNavbarFooter(pathname: string): boolean {
  return RUTAS_OCULTAR_NAV.some((regex) => regex.test(pathname));
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ocultarNavbar = debeOcultarNavbarFooter(pathname);

  return (
    <>
      {/* Aquí puedes envolver con Providers globales */}
      {/* <UserProvider> */}
      {/* <ThemeProvider> */}

      {/* NAVBAR + FOOTER en todas las rutas, excepto rutas ocultas */}
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

      {/* Cookie banner SIEMPRE visible excepto en /auth (opcional) */}
      {!ocultarNavbar && <CookieBanner />}
      {/* Si quieres el cookie banner SIEMPRE, pon solo: <CookieBanner /> */}

      {/* </ThemeProvider> */}
      {/* </UserProvider> */}
    </>
  );
}
