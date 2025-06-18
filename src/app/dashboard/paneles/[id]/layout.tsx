"use client";
import { useEffect } from "react";
import { useDashboardUI } from "../../ui";
import { useRouter } from "next/navigation";
import PanelDetailNavbar from "../components/PanelDetailNavbar";
import { PanelOpsProvider, usePanelOps } from "../PanelOpsContext";
import Spinner from "@/components/Spinner";
import useSession from "@/hooks/useSession";

function ProtectedPanel({ children }: { children: React.ReactNode }) {
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
      <div className="flex min-h-screen items-center justify-center bg-[var(--dashboard-bg)]">
        <Spinner className="text-[var(--dashboard-accent)]" />
      </div>
    );
  }

  if (!usuario) return null;

  const { mostrarHistorial } = usePanelOps();
  return (
    <div className={`min-h-screen bg-[var(--dashboard-bg)] relative ${fullscreen ? 'dashboard-full' : ''}`}>
      <main className="flex flex-col min-h-screen transition-all duration-300" style={{ paddingTop: 140 }}>
        <PanelDetailNavbar onShowHistory={mostrarHistorial} />
        <section className="flex-1 p-4 overflow-y-auto bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]">
          {children}
        </section>
      </main>
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelOpsProvider>
      <ProtectedPanel>{children}</ProtectedPanel>
    </PanelOpsProvider>
  );
}
