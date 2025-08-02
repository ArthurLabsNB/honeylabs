"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AlmacenesUIProvider } from "./ui";
import InventarioErrorBoundary from "@/components/InventarioErrorBoundary";
import Spinner from "@/components/Spinner";

export default function AlmacenesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Resetea el error boundary al cambiar de ruta (evita estados atascados tras errores de creación)
  const pathname = usePathname();

  return (
    <InventarioErrorBoundary key={pathname}>
      <AlmacenesUIProvider>
        <Suspense
          fallback={
            <div className="p-4">
              <Spinner />
            </div>
          }
        >
          {children}
        </Suspense>
      </AlmacenesUIProvider>
    </InventarioErrorBoundary>
  );
}
