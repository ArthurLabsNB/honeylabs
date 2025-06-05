"use client";

import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

// SCHEMA VALIDACIÓN ZOD
const loginSchema = z.object({
  correo: z.string().nonempty("Correo obligatorio").email("Correo inválido"),
  contrasena: z
    .string()
    .nonempty("Contraseña obligatoria")
    .min(6, "Mínimo 6 caracteres"),
});
type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [verContrasena, setVerContrasena] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
    reset,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  // Enfoca el correo al cargar
  useEffect(() => {
    setFocus("correo");
  }, [setFocus]);

  // --- Si ya tienes sesión, te manda a dashboard ---
  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then(jsonOrNull)
      .then((data) => {
        if (data?.success && data?.usuario) router.replace("/");
      });
  }, [router]);

  const onSubmit = async (datos: LoginData) => {
    setMensaje("");
    setCargando(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const data = await jsonOrNull(res);
      if (!res.ok || !data?.success)
        throw new Error(data?.error || "Credenciales inválidas");

      setMensaje("✔️ Inicio de sesión exitoso");
      reset();
      setTimeout(() => router.replace("/"), 800);
    } catch (error: any) {
      setMensaje(`❌ ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center"
      data-oid="z01dvcc"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-900 shadow-xl border border-amber-300 dark:border-zinc-700 p-8 rounded-2xl max-w-md w-full space-y-5 animate-fade-in"
        autoComplete="on"
        aria-labelledby="login-title"
        noValidate
        data-oid="32ds6_w"
      >
        <h1
          id="login-title"
          className="text-3xl font-bold text-center text-amber-700 dark:text-amber-300 animate-typewriter"
          style={{
            animationDuration: "2.1s",
            animationTimingFunction: "steps(25, end)",
          }}
          data-oid="8cow870"
        >
          Iniciar Sesión
        </h1>

        {/* 📧 Correo */}
        <div className="space-y-1" data-oid="eu3m4xy">
          <input
            {...register("correo")}
            placeholder="Correo electrónico"
            type="email"
            autoComplete="email"
            disabled={cargando}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              errors.correo ? "border-red-400" : ""
            }`}
            aria-invalid={!!errors.correo}
            aria-describedby="error-correo"
            data-oid=":jr5_al"
          />

          {errors.correo && (
            <p
              id="error-correo"
              className="text-sm text-red-500"
              data-oid="6p.pt07"
            >
              {errors.correo.message}
            </p>
          )}
        </div>

        {/* 🔒 Contraseña */}
        <div className="relative space-y-1" data-oid="gyrhz_p">
          <input
            {...register("contrasena")}
            placeholder="Contraseña"
            type={verContrasena ? "text" : "password"}
            autoComplete="current-password"
            disabled={cargando}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10 ${
              errors.contrasena ? "border-red-400" : ""
            }`}
            aria-invalid={!!errors.contrasena}
            aria-describedby="error-contrasena"
            data-oid="54j9g7w"
          />

          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVerContrasena((v) => !v)}
            className="absolute right-3 top-[10px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            aria-label={
              verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            disabled={cargando}
            data-oid="m:-8iyf"
          >
            {verContrasena ? (
              <EyeOff className="w-5 h-5" data-oid="xxrca4-" />
            ) : (
              <Eye className="w-5 h-5" data-oid="11pa8wl" />
            )}
          </button>
          {errors.contrasena && (
            <p
              id="error-contrasena"
              className="text-sm text-red-500"
              data-oid=".8395om"
            >
              {errors.contrasena.message}
            </p>
          )}
        </div>

        {/* 🔘 Botón */}
        <button
          type="submit"
          disabled={cargando}
          aria-busy={cargando}
          className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-md transition flex justify-center items-center gap-2 ${
            cargando ? "opacity-70 cursor-not-allowed" : ""
          }`}
          data-oid="-21979t"
        >
          {cargando ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" data-oid="d30k.m8" />{" "}
              Verificando...
            </>
          ) : (
            "Entrar"
          )}
        </button>

        {/* 💡 Registro */}
        <p
          className="text-center text-sm text-gray-600 dark:text-zinc-300"
          data-oid="9k_w9ua"
        >
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="text-amber-700 underline hover:text-amber-900 dark:text-amber-300 font-medium transition"
            data-oid="a62yz-3"
          >
            Crear cuenta
          </Link>
        </p>

        {/* 🧾 Mensaje */}
        {mensaje && (
          <div
            className={`text-center text-sm mt-2 font-semibold ${
              mensaje.startsWith("✔️") ? "text-green-600" : "text-red-600"
            }`}
            aria-live="polite"
            data-oid="2zm_i7o"
          >
            {mensaje}
          </div>
        )}
      </form>
    </main>
  );
}
