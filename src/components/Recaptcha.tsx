"use client";
import { useEffect, useRef } from "react";

export default function Recaptcha({ onToken }: { onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey || !ref.current) return;

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://www.google.com/recaptcha/api.js"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.render(ref.current!, {
            sitekey: siteKey,
            callback: onToken,
          });
        }
      };
    } else if (window.grecaptcha) {
      window.grecaptcha.render(ref.current, {
        sitekey: siteKey,
        callback: onToken,
      });
    } else {
      existing.addEventListener("load", () => {
        window.grecaptcha.render(ref.current!, {
          sitekey: siteKey,
          callback: onToken,
        });
      });
    }
  }, [onToken]);

  return <div ref={ref} />;
}

declare global {
  interface Window {
    grecaptcha: any;
  }
}
