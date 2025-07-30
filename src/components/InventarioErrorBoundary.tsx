"use client";
import { ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { useToast } from "@/components/Toast";
import * as logger from "@lib/logger";

export default function InventarioErrorBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const toast = useToast();
  return (
    <ErrorBoundary
      message="Error en inventario"
      onError={(err) => {
        logger.error("InventarioError", err);
        const msg = err instanceof Error ? err.message : String(err);
        toast.show(msg, "error");
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
