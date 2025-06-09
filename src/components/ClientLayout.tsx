"use client";

import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieBanner from "./CookieBanner";
import Spinner from "./Spinner";
import useSession from "@/hooks/useSession";
import { useEffect } from "react";

// Expande aquí según tus rutas a ocultar (puedes agregar más regex)
const RUTAS_OCULTAR_NAV = [
  /^\/auth(\/|$)/, // Oculta todo bajo /auth (login, registro, etc.)
  /^\/login$/, // Ejemplo: /login directo (si lo usas)
  /^\/registro$/, // Ejemplo: /registro directo
  // Agrega otras rutas aquí según crezca tu app (ejemplo: /^\/admin/)
];

// Devuelve true si debe ocultarse nav/footer
function debeOcultarNavbarFooter(pathname: string): boolean {
  return RUTAS_OCULTAR_NAV.some((regex) => regex.test(pathname));
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, loading } = useSession();
  const ocultarNavbar = debeOcultarNavbarFooter(pathname);
  const esRutaAuth = /^\/auth(\/|$)|^\/login$|^\/registro$/.test(pathname);

  useEffect(() => {
    if (!loading && !usuario && !esRutaAuth) {
      router.replace("/login");
    }
  }, [usuario, loading, esRutaAuth, router]);

  if (!esRutaAuth && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!esRutaAuth && !loading && !usuario) return null;

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
          max-w-screen-2xl mx-auto w-full px-3 sm:px-5 md:px-7
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
