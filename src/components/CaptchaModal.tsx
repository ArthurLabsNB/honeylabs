"use client";
import { useEffect, useState } from "react";
import { executeRecaptcha } from "@lib/recaptcha";
import Spinner from "./Spinner";

interface Props {
  action: string;
  onSuccess: (token: string | null) => void;
  onClose: () => void;
}

export default function CaptchaModal({ action, onSuccess, onClose }: Props) {
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  useEffect(() => {
    async function verify() {
      setStatus("loading");
      const token = await executeRecaptcha(action);
      if (token) {
        onSuccess(token);
      } else {
        setStatus("error");
      }
    }
    verify();
  }, [action, onSuccess]);

  const retry = async () => {
    setStatus("loading");
    const token = await executeRecaptcha(action);
    if (token) {
      onSuccess(token);
    } else {
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-zinc-800 p-6 rounded-md w-72 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "loading" ? (
          <div className="flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8" />
            <p>Verificando captcha...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p>Error al verificar captcha</p>
            <button
              onClick={retry}
              className="px-3 py-1 bg-amber-600 text-white rounded-md"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
