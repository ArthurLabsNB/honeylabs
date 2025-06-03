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
      data-oid=":x948vr"
    >
      <head data-oid="8_rldaq">
        <meta charSet="UTF-8" data-oid="4mdbnhy" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
          data-oid="48ws1dy"
        />

        <link rel="icon" href="/favicon.ico" data-oid="g_4c.h4" />
      </head>
      <body
        className="bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased transition-colors duration-300 overflow-x-hidden"
        data-oid="y:x5:s_"
      >
        <ConditionalLayout data-oid="zem_tx.">{children}</ConditionalLayout>
        <Analytics data-oid="du-849g" />
        <SpeedInsights data-oid="v-0_t_e" />
      </body>
    </html>
  );
}
