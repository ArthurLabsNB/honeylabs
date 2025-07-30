"use client";
import { AlmacenesUIProvider } from "./ui";
import InventarioErrorBoundary from "@/components/InventarioErrorBoundary";

export default function AlmacenesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InventarioErrorBoundary>
      <AlmacenesUIProvider>{children}</AlmacenesUIProvider>
    </InventarioErrorBoundary>
  );
}
