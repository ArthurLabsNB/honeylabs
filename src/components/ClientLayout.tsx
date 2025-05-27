'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

const RUTAS_OCULTAR_NAV = [
  /^\/auth(\/|$)/, // Oculta en cualquier ruta bajo /auth (login, registro, etc)
  // Puedes agregar más patrones aquí, ejemplo:
  // /^\/privado(\/|$)/,
];

function debeOcultarNavbarFooter(pathname: string): boolean {
  return RUTAS_OCULTAR_NAV.some((regex) => regex.test(pathname));
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const ocultarNavbar = debeOcultarNavbarFooter(pathname);

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

// Nota: Este layout se usa para manejar la navegación y el footer en el cliente.
// Si necesitas lógica adicional (como manejo de sesión), puedes agregarla aquí.