import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

// 🎨 Tipografías profesionales
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// 🌐 Metadata global del sitio
export const metadata: Metadata = {
  title: 'HoneyLabs',
  description: 'Gestión inteligente de inventarios educativos y empresariales',
  icons: {
    icon: '/favicon.ico',
  },
};

// 📦 Layout raíz global (aplica a todas las rutas)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          bg-[var(--color-background)] text-[var(--color-foreground)]
          font-sans antialiased transition-colors duration-300
          overflow-x-hidden
        `}
      >
        {/* 🔝 Barra de navegación */}
        <Navbar />

        {/* 📄 Contenido principal */}
        <main className="min-h-[calc(100vh-120px)] pt-[96px] pb-8 container-xl">
          {children}
        </main>

        {/* 🦶 Footer global persistente */}
        <Footer />

        {/* 📊 Integraciones Vercel */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
