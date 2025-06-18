"use client";
import { useEffect, useState } from "react";

export default function PromptModal({
  message,
  initial = "",
  onSubmit,
  onCancel,
}: {
  message: string;
  initial?: string;
  onSubmit: (v: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onCancel}>
      <div
        className="bg-white dark:bg-zinc-800 p-4 rounded-md w-64"
        onClick={(e) => e.stopPropagation()}
      >
        <label className="block text-sm mb-2">{message}</label>
        <input
          className="w-full px-2 py-1 mb-3 text-black rounded"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 bg-white/20 rounded">
            Cancelar
          </button>
          <button onClick={() => onSubmit(value.trim())} className="px-3 py-1 bg-white/20 rounded">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
