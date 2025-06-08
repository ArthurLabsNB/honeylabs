"use client";

import { cn } from "@/lib/utils";

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-4 border-amber-600 border-t-transparent",
        className,
      )}
      role="status"
      aria-label="Cargando"
    />
  );
}
