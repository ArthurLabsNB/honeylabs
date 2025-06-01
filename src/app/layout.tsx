import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout'; // <--- Cambia aquí
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'HoneyLabs',
  description: 'Gestión inteligente de inventarios educativos y empresariales',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth motion-safe:transition-all" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`
        ${geistSans.variable} ${geistMono.variable}
        bg-[var(--color-background)] text-[var(--color-foreground)]
        font-sans antialiased transition-colors duration-300
        overflow-x-hidden
      `}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
