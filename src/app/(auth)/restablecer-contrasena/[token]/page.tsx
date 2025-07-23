"use client";
import React, { useState } from "react";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    contrasena: z.string().min(6, "Mínimo 6 caracteres"),
    confirmacion: z.string().min(6, "Mínimo 6 caracteres"),
  })
  .refine((d) => d.contrasena === d.confirmacion, {
    message: "Las contraseñas no coinciden",
    path: ["confirmacion"],
  });

type FormData = z.infer<typeof schema>;

export default function RestablecerContrasenaPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (data: FormData) => {
    setGuardando(true);
    setMensaje("");
    const res = await apiFetch(`/api/recuperar-contrasena/${params.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contrasena: data.contrasena }),
    });
    if (res.ok) {
      setMensaje("Contraseña actualizada");
      setTimeout(() => router.replace("/login"), 1500);
    } else {
      const d = await jsonOrNull(res);
      setMensaje(d?.error || "Error");
    }
    setGuardando(false);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-900 shadow-xl border border-amber-300 dark:border-zinc-700 p-8 rounded-2xl max-w-md w-full space-y-5"
        noValidate
      >
        <h1 className="text-3xl font-bold text-center text-amber-700 dark:text-amber-300">
          Nueva contraseña
        </h1>
        <div className="space-y-1">
          <input
            {...register("contrasena")}
            type="password"
            placeholder="Contraseña nueva"
            disabled={guardando}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.contrasena ? "border-red-400" : ""}`}
            aria-invalid={!!errors.contrasena}
          />
          {errors.contrasena && (
            <p className="text-sm text-red-500">{errors.contrasena.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <input
            {...register("confirmacion")}
            type="password"
            placeholder="Confirmar contraseña"
            disabled={guardando}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.confirmacion ? "border-red-400" : ""}`}
            aria-invalid={!!errors.confirmacion}
          />
          {errors.confirmacion && (
            <p className="text-sm text-red-500">{errors.confirmacion.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={guardando}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          {guardando ? "Guardando..." : "Aceptar cambios"}
        </button>
        {mensaje && (
          <div className="text-center text-sm mt-2 font-semibold" aria-live="polite">
            {mensaje}
          </div>
        )}
      </form>
    </main>
  );
}
