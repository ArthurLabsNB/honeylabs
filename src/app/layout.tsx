import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout"; // <--- Cambia aquí
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
      data-oid="fwn250i"
    >
      <head data-oid="rirgn6v">
        <meta charSet="UTF-8" data-oid="wvvk10x" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
          data-oid="l.eirl5"
        />
        <link rel="icon" href="/favicon.ico" data-oid="_hn994n" />
      </head>
      <body
        className="bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased transition-colors duration-300 overflow-x-hidden"
        data-oid="o49zeqb"
      >
        <ConditionalLayout data-oid="1_0rw1-">{children}</ConditionalLayout>
        <Analytics data-oid="hfm83.k" />
        <SpeedInsights data-oid="0s2sk9b" />
      </body>
    </html>
  );
}
