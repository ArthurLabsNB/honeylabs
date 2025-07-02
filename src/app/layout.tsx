import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout"; // <--- Cambia aquí
import PwaRegister from "@/components/PwaRegister";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
export const metadata: Metadata = {
  title: "HoneyLabs",
  description: "Gestión inteligente de inventarios educativos y empresariales",
  icons: {
    icon: "/favicon.ico",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className="scroll-smooth motion-safe:transition-all"
      suppressHydrationWarning
      data-oid="ziduj:9"
    >
      <head data-oid="kp2s97_">
        <meta charSet="UTF-8" data-oid="upk8vf5" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
          data-oid="y9u6sdi"
        />
        <link rel="icon" href="/favicon.ico" data-oid="oydwumc" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffe066" />
      </head>
      <body
        className="bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased transition-colors duration-300 overflow-x-hidden"
        data-oid="41:bv5f"
      >
        <ReactQueryProvider>
          <ConditionalLayout data-oid="vy-b4dt">{children}</ConditionalLayout>
        </ReactQueryProvider>
        <PwaRegister />
        <Analytics data-oid="egcbm3r" />
        <SpeedInsights data-oid="vrt:7ii" />
      </body>
    </html>
  );
}
