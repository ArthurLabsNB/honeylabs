"use client";
import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import NavbarDashboard from "./components/NavbarDashboard";
import { UserProvider, useUser } from "./contexts/UserContext";
import { useRouter } from "next/navigation";
// Si luego agregas más contextos, descomenta estos
// import { ThemeProvider } from "./contexts/ThemeContext";
// import { NotificationProvider } from "./contexts/NotificationContext";

// --- Wrapper para proteger y redirigir ---
function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !usuario) {
      router.push("/login");
    }
  }, [usuario, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--dashboard-bg)]">
        <span className="text-[var(--dashboard-accent)] text-lg font-bold animate-pulse">
          Cargando...
        </span>
      </div>
    );
  }

  if (!usuario) return null; // Bloquea UI hasta redirigir

  return (
    <div className="flex min-h-screen bg-[var(--dashboard-bg)] transition-colors duration-300">
      {/* --- SIDEBAR --- */}
      <Sidebar />
      {/* --- ZONA CENTRAL --- */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* --- NAVBAR EXCLUSIVO DASHBOARD --- */}
        <NavbarDashboard />
        {/* --- CONTENIDO MODULAR --- */}
        <section className="
          flex-1 p-0 sm:p-8
          bg-[var(--dashboard-bg)]
          text-[var(--dashboard-text)]
          overflow-y-auto
          animate-fade-in
          transition-colors duration-300
        ">
          {children}
        </section>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {/* <ThemeProvider> */}
      {/* <NotificationProvider> */}
      <ProtectedDashboard>{children}</ProtectedDashboard>
      {/* </NotificationProvider> */}
      {/* </ThemeProvider> */}
    </UserProvider>
  );
}
