"use client";
import { usePathname } from "next/navigation";
import ClientLayout from "@/components/ClientLayout";

// Puedes añadir aquí otros layouts globales si lo necesitas (cookies, banners, etc)

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Si la ruta empieza con /dashboard, NO envuelvas con ClientLayout
  if (pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }
  // Si no, usa el layout global normal
  return <ClientLayout>{children}</ClientLayout>;
}