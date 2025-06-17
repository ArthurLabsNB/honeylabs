"use client";
import { useEffect, useRef } from "react";

interface Item {
  label: string;
  onClick: () => void;
}

export default function ContextMenu({ items, position, onClose }: { items: Item[]; position: { x: number; y: number }; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", esc);
    };
  }, [onClose]);
  return (
    <div
      ref={ref}
      style={{ top: position.y, left: position.x }}
      className="fixed z-50 bg-[var(--dashboard-navbar)] border border-[var(--dashboard-border)] rounded text-sm shadow"
    >
      {items.map((it, i) => (
        <button
          key={i}
          onClick={() => {
            onClose();
            it.onClick();
          }}
          className="block px-3 py-1 text-left w-full hover:bg-white/10"
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
