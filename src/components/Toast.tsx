import React, { createContext, useContext, useState, ReactNode } from "react";
import { nanoid } from "nanoid";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "confirm";
  actions?: { label: string; onClick: () => void }[];
}

interface ToastContextValue {
  show: (message: string, type?: "success" | "error" | "info") => void;
  confirm: (message: string) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = (id: string) =>
    setToasts((t) => t.filter((toast) => toast.id !== id));

  const show = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    const id = nanoid();
    setToasts((t) => [...t, { id, message, type }]);
    const timeout = type === "error" ? 5000 : 3000;
    setTimeout(() => remove(id), timeout);
  };

  const confirmToast = (message: string) =>
    new Promise<boolean>((resolve) => {
      const id = nanoid();
      const yes = () => {
        remove(id);
        resolve(true);
      };
      const no = () => {
        remove(id);
        resolve(false);
      };
      setToasts((t) => [
        ...t,
        {
          id,
          message,
          type: "confirm",
          actions: [
            { label: "Sí", onClick: yes },
            { label: "No", onClick: no },
          ],
        },
      ]);
    });

  return (
    <ToastContext.Provider value={{ show, confirm: confirmToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-md text-sm bg-white/10 backdrop-blur ${
              t.type === "success"
                ? "text-green-300"
                : t.type === "error"
                  ? "text-red-400"
                  : "text-white"
            }`}
          >
            <p>{t.message}</p>
            {t.type === "confirm" && t.actions && (
              <div className="flex gap-2 mt-2">
                {t.actions.map((a) => (
                  <button
                    key={a.label}
                    onClick={a.onClick}
                    className="px-2 py-1 bg-white/20 rounded hover:bg-white/30"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
