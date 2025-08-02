"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSession from "@/hooks/useSession";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import { executeRecaptcha, isRecaptchaEnabled } from "@lib/recaptcha";

export default function LoginForm() {
  const router = useRouter();
  const { usuario } = useSession();
  const emailRef = useRef<HTMLInputElement>(null);

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const captchaEnabled = isRecaptchaEnabled();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (usuario) router.replace("/");
  }, [usuario, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    let captchaToken: string | null = null;
    if (captchaEnabled) {
      captchaToken = await executeRecaptcha("login");
      if (!captchaToken) {
        setMensaje("Error al verificar captcha");
        setLoading(false);
        return;
      }
    }

    const payload: Record<string, unknown> = {
      correo: formData.get("correo"),
      contrasena: formData.get("contrasena"),
    };
    if (captchaToken) payload.captchaToken = captchaToken;

    try {
      const res = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await jsonOrNull(res);
      if (!res.ok) throw new Error(data?.error || "Error de login");
      router.replace("/");
      router.refresh();
    } catch (err: any) {
      setMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl max-w-md w-full space-y-5 border border-amber-200 animate-fade-in"
      autoComplete="on"
      aria-labelledby="login-title"
    >
      <h1
        id="login-title"
        className="text-2xl font-bold text-center text-amber-700 dark:text-amber-300 mb-2"
      >
        Iniciar sesión
      </h1>

      <input
        ref={emailRef}
        name="correo"
        type="email"
        required
        placeholder="Correo electrónico"
        className="input"
        autoComplete="email"
      />

      <input
        name="contrasena"
        type="password"
        required
        placeholder="Contraseña"
        className="input"
        autoComplete="current-password"
      />

      <div className="flex justify-between text-sm">
        <a
          href="/olvide-contrasena"
          className="text-amber-600 hover:underline"
        >
          Olvidé la contraseña
        </a>
        <a href="/registro" className="text-amber-600 hover:underline">
          Crear cuenta
        </a>
      </div>

      {mensaje && (
        <p className="text-sm text-center text-red-600">{mensaje}</p>
      )}

      <button
        disabled={loading}
        type="submit"
        className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <div className="flex items-center text-xs text-amber-600 uppercase before:flex-1 before:border-t before:border-amber-200 before:me-2 after:flex-1 after:border-t after:border-amber-200 after:ms-2 mt-4">
        Próximamente
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          disabled
          title="En mantenimiento"
          className="w-full bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded cursor-not-allowed"
        >
          Google
        </button>
        <button
          type="button"
          disabled
          title="En mantenimiento"
          className="w-full bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded cursor-not-allowed"
        >
          Facebook
        </button>
        <button
          type="button"
          disabled
          title="En mantenimiento"
          className="w-full bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded cursor-not-allowed"
        >
          GitHub
        </button>
      </div>
    </form>
  );
}
