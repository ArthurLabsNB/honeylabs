"use client";
import { usePathname, useRouter } from "next/navigation";
import ClientLayout from "@/components/ClientLayout";
import { useUser } from "../dashboard/contexts/UserContext"; // <- AQUÍ ESTÁ EL CAMBIO
import { useEffect } from "react";

const PUBLIC_PATHS = [
  "/", "/login", "/registro", "/ayuda", "/contacto"
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (pub) => pathname === pub || pathname.startsWith(pub + "/")
  );
}

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { usuario, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !usuario && !isPublic(pathname)) {
      router.push("/login");
    }
  }, [usuario, loading, pathname, router]);

  if (!loading && !usuario && !isPublic(pathname)) {
    return null;
  }

  if (pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }
  return <ClientLayout>{children}</ClientLayout>;
}
