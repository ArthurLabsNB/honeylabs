"use client";
import { usePathname, useRouter } from "next/navigation";
import ClientLayout from "@/components/ClientLayout";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";

// Define aquí las rutas públicas de tu app
const PUBLIC_PATHS = [
  "/",             // Home pública
  "/login",        // Login
  "/registro",     // Registro
  "/ayuda",        // Centro de ayuda
  "/contacto",     // Contacto, etc.
  // Puedes agregar más según crezcan tus rutas
];

function isPublic(pathname: string) {
  // Coincidencia exacta o si es subruta (ej: /ayuda/pregunta)
  return PUBLIC_PATHS.some(
    (pub) => pathname === pub || pathname.startsWith(pub + "/")
  );
}

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { usuario, loading } = useUser();
  const router = useRouter();

  // --- Protección automática de rutas privadas ---
  useEffect(() => {
    // Si termina de cargar, no hay usuario y no es pública → redirige a login
    if (!loading && !usuario && !isPublic(pathname)) {
      router.push("/login");
    }
  }, [usuario, loading, pathname, router]);

  // Mientras revisa sesión, puedes mostrar un loader o null (para evitar FOUC/flashes)
  if (!loading && !usuario && !isPublic(pathname)) {
    return null;
  }

  // DASHBOARD: layout especial, no uses ClientLayout
  if (pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }

  // Layout global normal para todo lo demás
  return <ClientLayout>{children}</ClientLayout>;
}
