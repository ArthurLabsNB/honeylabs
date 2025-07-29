"use client";
import React, { useState } from "react";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { executeRecaptcha } from "@lib/recaptcha";

const schema = z.object({
  correo: z.string().nonempty("Correo obligatorio").email("Correo inválido"),
});

type FormData = z.infer<typeof schema>;

export default function OlvideContrasenaPage() {
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (data: FormData) => {
    setEnviando(true);
    setMensaje("");
    const captchaToken = await executeRecaptcha("recuperar");
    if (!captchaToken) {
      setMensaje("Error al verificar captcha");
      setEnviando(false);
      return;
    }
    const res = await apiFetch("/api/recuperar-contrasena", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, captchaToken }),
    });
    if (res.ok) {
      setMensaje(
        "Si tu correo existe, recibirás un enlace para restablecer tu contraseña."
      );
    } else {
      const d = await jsonOrNull(res);
      setMensaje(d?.error || "Error al enviar correo");
    }
    setEnviando(false);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-900 shadow-xl border border-amber-300 dark:border-zinc-700 p-8 rounded-2xl max-w-md w-full space-y-5"
        noValidate
      >
        <h1 className="text-3xl font-bold text-center text-amber-700 dark:text-amber-300">
          Recuperar contraseña
        </h1>
        <p className="text-center text-sm text-gray-600 dark:text-zinc-300">
          Coloca el correo del que quieres recuperar tu contraseña. Te enviaremos
          un enlace para confirmarla y crear una nueva.
        </p>
        <div className="space-y-1">
          <input
            {...register("correo")}
            type="email"
            placeholder="Correo electrónico"
            disabled={enviando}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.correo ? "border-red-400" : ""}`}
            aria-invalid={!!errors.correo}
          />
        {errors.correo && (
          <p className="text-sm text-red-500">{errors.correo.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={enviando}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          {enviando ? "Enviando..." : "Enviar correo"}
        </button>
        <p className="text-center text-sm text-gray-600 dark:text-zinc-300">
          <Link
            href="/login"
            className="text-amber-700 underline hover:text-amber-900 dark:text-amber-300 font-medium transition"
          >
            Volver al login
          </Link>
        </p>
        {mensaje && (
          <div className="text-center text-sm mt-2 font-semibold text-amber-700 dark:text-amber-300" aria-live="polite">
            {mensaje}
          </div>
        )}
      </form>
    </main>
  );
}
