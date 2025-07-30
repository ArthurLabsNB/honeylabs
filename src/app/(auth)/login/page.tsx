"use client";

import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import { signIn } from "next-auth/react";
import useSession, { clearSessionCache } from "@/hooks/useSession";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import CaptchaModal from "@/components/CaptchaModal";

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

  // Enfoca el correo solo una vez al cargar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setFocus("correo");
  }, []);

  const { usuario } = useSession();

  // --- Si ya tienes sesión, te manda a dashboard ---
  useEffect(() => {
    if (usuario) router.replace("/");
  }, [usuario, router]);

  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [pendingData, setPendingData] = useState<LoginData | null>(null);

  const onSubmit = (datos: LoginData) => {
    setMensaje("");
    setPendingData(datos);
    setCaptchaOpen(true);
  };

  const handleCaptcha = async (token: string | null) => {
    setCaptchaOpen(false);
    if (!pendingData) return;
    setCargando(true);
    try {
      clearSessionCache();
      if (!token) throw new Error("Error al verificar captcha");
      const res = await apiFetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pendingData, captchaToken: token }),
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

  const handleSocialLogin = async (
    provider: 'google' | 'github' | 'facebook',
  ) => {
    const result = await signIn(provider, {
      redirect: false,
      callbackUrl: '/',
    });
    if (result?.ok) {
      router.replace(result.url || '/');
    } else if (result?.error) {
      setMensaje(`❌ ${result.error}`);
    } else {
      setMensaje('❌ Error al iniciar sesión');
    }
  };

  return (
    <>
    <main
      className="min-h-screen w-full flex items-center justify-center"
      data-oid="s53qcho"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-900 shadow-xl border border-amber-300 dark:border-zinc-700 p-8 rounded-2xl max-w-md w-full space-y-5 animate-fade-in"
        autoComplete="on"
        aria-labelledby="login-title"
        noValidate
        data-oid="qnncfp1"
      >
        <h1
          id="login-title"
          className="text-3xl font-bold text-center text-amber-700 dark:text-amber-300 animate-typewriter"
          style={{
            animationDuration: "2.1s",
            animationTimingFunction: "steps(25, end)",
          }}
          data-oid="x7mu44d"
        >
          Iniciar Sesión
        </h1>

        {/* 📧 Correo */}
        <div className="space-y-1" data-oid="mrmu7bg">
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
            data-oid="4_qnitf"
          />

          {errors.correo && (
            <p
              id="error-correo"
              className="text-sm text-red-500"
              data-oid="3s7dr4j"
            >
              {errors.correo.message}
            </p>
          )}
        </div>

        {/* 🔒 Contraseña */}
        <div className="relative space-y-1" data-oid="3zesxgk">
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
            data-oid="a9vsonu"
          />

          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVerContrasena((v) => !v)}
            className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            aria-label={
              verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            disabled={cargando}
            data-oid="r86r71q"
          >
            {verContrasena ? (
              <EyeOff className="w-5 h-5" data-oid="mu9jnt6" />
            ) : (
              <Eye className="w-5 h-5" data-oid="-29-q_o" />
            )}
          </button>
        {errors.contrasena && (
          <p
            id="error-contrasena"
            className="text-sm text-red-500"
            data-oid="wzj_p49"
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
          data-oid="a4t6s:u"
        >
          {cargando ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" data-oid="adm.v0f" />{" "}
              Verificando...
            </>
          ) : (
            "Entrar"
          )}
        </button>

        {/* 💡 Registro */}
        <p
          className="text-center text-sm text-gray-600 dark:text-zinc-300"
          data-oid="921b0dp"
        >
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="text-amber-700 underline hover:text-amber-900 dark:text-amber-300 font-medium transition"
            data-oid="1cfpgqm"
          >
            Crear cuenta
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600 dark:text-zinc-300">
          <Link
            href="/olvide-contrasena"
            className="text-amber-700 underline hover:text-amber-900 dark:text-amber-300 font-medium transition"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="w-full border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition"
          >
            Continuar con Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            className="w-full border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition"
          >
            Continuar con GitHub
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            className="w-full border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition"
          >
            Continuar con Facebook
          </button>
        </div>

        {/* 🧾 Mensaje */}
        {mensaje && (
          <div
            className={`text-center text-sm mt-2 font-semibold ${
              mensaje.startsWith("✔️") ? "text-green-600" : "text-red-600"
            }`}
            aria-live="polite"
            data-oid="ri8yr07"
          >
            {mensaje}
          </div>
        )}
      </form>
    </main>
    {captchaOpen && (
      <CaptchaModal action="login" onSuccess={handleCaptcha} onClose={() => setCaptchaOpen(false)} />
    )}
    </>
  );
}
