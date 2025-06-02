"use client";
import { usePathname, useRouter } from "next/navigation";
import ClientLayout from "@/components/ClientLayout";
// Cambia este import al relativo correcto para tu estructura:
import { useUser } from "../../dashboard/components/contexts/UserContext";
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
    if (!loading && !usuario && !isPublic(pathname)) {
      router.push("/login");
    }
  }, [usuario, loading, pathname, router]);

  // Loader mientras revisa sesión (opcional, para evitar flashes)
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
