"use client";
import { useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { isRecaptchaEnabled } from "@lib/recaptcha";

interface Props {
  action: string;
  onSuccess: (token: string | null) => void;
  onClose: () => void;
}

export default function CaptchaModal({ action, onSuccess, onClose }: Props) {

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

  const enabled = isRecaptchaEnabled();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  useEffect(() => {
    if (!enabled) onSuccess(null);
  }, [enabled, onSuccess]);
  if (!enabled || !siteKey) return null;

  const handleChange = (token: string | null) => {
    if (token) onSuccess(token);
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
        <ReCAPTCHA sitekey={siteKey} onChange={handleChange} />
      </div>
    </div>
  );
}
