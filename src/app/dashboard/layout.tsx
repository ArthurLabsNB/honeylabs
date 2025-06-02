import React from "react";
import Sidebar from "./components/Sidebar";
import NavbarDashboard from "./components/NavbarDashboard";
import { UserProvider } from "./contexts/UserContext";
// Si luego agregas más contextos, descomenta estos
// import { ThemeProvider } from "./contexts/ThemeContext";
// import { NotificationProvider } from "./contexts/NotificationContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {/* <ThemeProvider> */}
      {/* <NotificationProvider> */}
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
      {/* </NotificationProvider> */}
      {/* </ThemeProvider> */}
    </UserProvider>
  );
}
