'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 🔒 Anti errores: rutas donde NO debe mostrarse navbar/footer
  const ocultarNavbar = /^\/auth\/(login|registro)(\/.*)?$/.test(pathname);

  return (
    <>
      {!ocultarNavbar && <Navbar />}
      <main className="min-h-[calc(100vh-120px)] pt-[96px] pb-8 container-xl">
        {children}
      </main>
      {!ocultarNavbar && <Footer />}
    </>
  );
}
