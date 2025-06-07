"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useDashboardUI } from "../../ui";
import { useRouter } from "next/navigation";
import AlmacenDetailNavbar from "../components/AlmacenDetailNavbar";
import { NAVBAR_HEIGHT } from "../../constants";
import type { Usuario } from "@/types/usuario";

function ProtectedAlmacen({ children }: { children: React.ReactNode }) {
  const { fullscreen, setFullscreen } = useDashboardUI();
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await fetch("/api/login", { credentials: "include" });
        const data = await jsonOrNull(res);
        if (data?.success && data?.usuario) {
          setUsuario(data.usuario);
        } else {
          setUsuario(null);
        }
      } catch {
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };
    cargarUsuario();
  }, []);


  useEffect(() => {
    if (!loading && !usuario) {
      router.replace("/login");
    }
  }, [usuario, loading, router]);

  useEffect(() => {
    setFullscreen(true);
    return () => setFullscreen(false);
  }, [setFullscreen]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[var(--dashboard-bg)]"
        data-oid="m8ihkvs"
      >
        <span
          className="text-[var(--dashboard-accent)] text-lg font-bold animate-pulse"
          data-oid="_r:ikd8"
        >
          Cargando...
        </span>
      </div>
    );
  }

  if (!usuario) return null;


  return (
    <div
      className={`min-h-screen bg-[var(--dashboard-bg)] relative ${
        fullscreen ? "dashboard-full" : ""
      }`}
      data-oid="vu397ln"
    >
      <main
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ paddingTop: NAVBAR_HEIGHT + 56 }}
        data-oid="9d4tqvn"
      >
        <AlmacenDetailNavbar />
        <section
          className="flex-1 p-4 overflow-y-auto bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]"
          data-oid="fuuwox1"
        >
          {children}
        </section>
      </main>
    </div>
  );
}

export default function AlmacenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedAlmacen data-oid="vzd1u8v">{children}</ProtectedAlmacen>;
}
