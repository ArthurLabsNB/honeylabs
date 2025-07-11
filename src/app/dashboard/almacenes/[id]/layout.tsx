"use client";
import React, { useEffect } from "react";
import { useDashboardUI } from "../../ui";
import { useRouter } from "next/navigation";
import AlmacenDetailNavbar from "../components/AlmacenDetailNavbar";
import Spinner from "@/components/Spinner";
import useSession from "@/hooks/useSession";
import TabBoard from "../components/TabBoard";

function ProtectedAlmacen({ children }: { children: React.ReactNode }) {
  const { fullscreen, setFullscreen } = useDashboardUI();
  const router = useRouter();
  const { usuario, loading } = useSession();


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
        style={{ paddingTop: 56 }}
        data-oid="9d4tqvn"
      >
        <AlmacenDetailNavbar />
        <section
          className="flex-1 overflow-y-auto bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]"
          data-oid="fuuwox1"
        >
          <TabBoard />
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
