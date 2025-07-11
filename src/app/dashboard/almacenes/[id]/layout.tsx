"use client";
import React, { useEffect } from "react";
import { useDashboardUI } from "../../ui";
import { useRouter } from "next/navigation";
import AlmacenDetailNavbar from "../components/AlmacenDetailNavbar";
import Spinner from "@/components/Spinner";
import useSession from "@/hooks/useSession";
import CardBoard from "../components/CardBoard";
import { BoardProvider } from "../board/BoardProvider";
import { DetalleUIProvider, useDetalleUI } from "../DetalleUI";

function ProtectedAlmacen({ children }: { children: React.ReactNode }) {
  const { fullscreen, setFullscreen } = useDashboardUI();
  const router = useRouter();
  const { usuario, loading } = useSession();
  const { collapsed, toggleCollapsed } = useDetalleUI();


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
        <Spinner className="text-[var(--dashboard-accent)]" />
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
        style={{ paddingTop: collapsed ? 0 : 56 }}
        data-oid="9d4tqvn"
      >
        <AlmacenDetailNavbar />
        <section
          className="flex-1 overflow-y-auto bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]"
          data-oid="fuuwox1"
        >
          <BoardProvider>
            <CardBoard />
          </BoardProvider>
        </section>
        <button
          onClick={toggleCollapsed}
          className="fixed top-1 right-1 z-40 p-1 rounded-md bg-[var(--dashboard-sidebar)] hover:bg-white/10"
        >
          {collapsed ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
          )}
        </button>
      </main>
    </div>
  );
}

export default function AlmacenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DetalleUIProvider>
      <ProtectedAlmacen data-oid="vzd1u8v">{children}</ProtectedAlmacen>
    </DetalleUIProvider>
  );
}
