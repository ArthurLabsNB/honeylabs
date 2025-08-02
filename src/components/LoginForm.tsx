"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSession from "@/hooks/useSession";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import { executeRecaptcha, isRecaptchaEnabled } from "@lib/recaptcha";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const { usuario } = useSession();
  const emailRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const captchaEnabled = isRecaptchaEnabled();

  useEffect(() => { emailRef.current?.focus(); }, []);
  useEffect(() => { if (usuario) { router.replace("/"); router.refresh(); } }, [usuario, router]);

  function onMove(e: React.MouseEvent) {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(""); setLoading(true);

    const form = new FormData(e.currentTarget);
    const correo = String(form.get("correo") ?? "");
    const contrasena = String(form.get("contrasena") ?? "");

    let captchaToken: string | null = null;
    if (captchaEnabled) {
      try {
        captchaToken = await executeRecaptcha("login");
        if (!captchaToken) throw new Error("Error al verificar captcha");
      } catch { setLoading(false); setMensaje("Error al verificar captcha"); return; }
    }

    try {
      const res = await apiFetch("/api/login", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena, ...(captchaToken ? { captchaToken } : {}) }),
      });
      const data = await jsonOrNull(res);
      if (!res.ok) throw new Error(data?.error || "Error de login");

      const check = await fetch("/api/login", { credentials: "include", cache: "no-store" });
      if (!check.ok) throw new Error("La sesión no se pudo establecer");
      router.replace("/"); router.refresh();
    } catch (err: any) {
      setMensaje(err?.message ?? "Error de login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-transparent">
      <section className="w-full max-w-[820px] px-6">
        <div
          ref={frameRef}
          onMouseMove={onMove}
          className="relative rounded-[30px] overflow-hidden login-scope"
        >
          {/* Fondo oscuro + aurora sin blancos */}
          <div className="frame-bg pointer-events-none absolute inset-0 -z-10" />

          {/* Runner de luz en el borde */}
          <svg className="neon-outline pointer-events-none absolute inset-0 -z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(245,158,11,1)" />
                <stop offset="60%" stopColor="rgba(245,158,11,0.15)" />
                <stop offset="100%" stopColor="rgba(245,158,11,0)" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect
              x="1.5" y="1.5" width="97" height="97" rx="6" ry="6"
              fill="none"
              stroke="url(#strokeGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray="70 930"
              style={{ filter: "url(#glow)" }}
              className="runner"
            />
          </svg>

          {/* Card */}
          <div className="relative rounded-[30px] border border-amber-400/30 bg-zinc-950/85 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(245,158,11,0.55)]">
            <header className="px-12 pt-12 pb-6">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-amber-600 flex items-center justify-center text-zinc-950 font-extrabold shadow-lg">HL</div>
                <div>
                  <h1 className="text-[34px] leading-none font-black text-amber-50 tracking-tight">Bienvenido</h1>
                  <p className="text-sm text-amber-200/70 mt-1">Ingresa para continuar</p>
                </div>
              </div>
            </header>

            <form onSubmit={onSubmit} className="px-12 pb-12 space-y-7">
              {/* Correo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-amber-200">Correo</label>
                <div className="group flex items-center gap-3 h-16 rounded-2xl border border-amber-400/40 px-6 bg-transparent focus-within:border-amber-400 focus-within:shadow-[0_0_0_6px_rgba(245,158,11,0.10)] transition-all">
                  <Mail className="size-5 text-amber-400" />
                  <input
                    ref={emailRef}
                    name="correo"
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    className="login-input w-full bg-transparent outline-none text-amber-50 placeholder:text-amber-200/40 text-lg"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-amber-200">Contraseña</label>
                <div className="group flex items-center gap-3 h-16 rounded-2xl border border-amber-400/40 px-6 bg-transparent focus-within:border-amber-400 focus-within:shadow-[0_0_0_6px_rgba(245,158,11,0.10)] transition-all">
                  <Lock className="size-5 text-amber-400" />
                  <input
                    name="contrasena"
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="login-input w-full bg-transparent outline-none text-amber-50 placeholder:text-amber-200/40 text-lg"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setShowPass(s => !s)}
                    className="p-2 rounded-xl hover:bg-amber-400/10 active:scale-95 transition"
                  >
                    {showPass ? <EyeOff className="size-5 text-amber-300" /> : <Eye className="size-5 text-amber-300" />}
                  </button>
                </div>
              </div>

              {/* Enlaces */}
              <div className="flex items-center justify-between text-sm">
                <a href="/olvide-contrasena" className="text-amber-300 hover:underline">Olvidé la contraseña</a>
                <a href="/registro" className="text-amber-300/80 hover:underline">Crear cuenta</a>
              </div>

              {/* Mensaje */}
              {mensaje && (
                <div className="rounded-xl border border-red-400/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
                  {mensaje}
                </div>
              )}

              {/* Botón */}
              <button
                disabled={loading}
                type="submit"
                className="group w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-70 disabled:cursor-not-allowed text-zinc-950 font-semibold py-4 text-lg shadow-[0_10px_40px_-10px_rgba(245,158,11,0.55)] transition active:scale-[0.99]"
              >
                {loading ? <Loader2 className="size-5 animate-spin" /> : <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />}
                {loading ? "Entrando..." : "Entrar"}
              </button>

              {/* Próximamente */}
              <div>
                <div className="mt-2 mb-3 flex items-center text-[10px] tracking-wider text-amber-300/80 uppercase before:flex-1 before:border-t before:border-amber-400/30 before:me-3 after:flex-1 after:border-t after:border-amber-400/30 after:ms-3">
                  Próximamente
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button type="button" disabled className="h-12 rounded-xl bg-zinc-900/60 text-zinc-400 border border-amber-400/20">Google</button>
                  <button type="button" disabled className="h-12 rounded-xl bg-zinc-900/60 text-zinc-400 border border-amber-400/20">Facebook</button>
                  <button type="button" disabled className="h-12 rounded-xl bg-zinc-900/60 text-zinc-400 border border-amber-400/20">GitHub</button>
                </div>
              </div>

              {captchaEnabled && (
                <p className="text-[10px] text-center text-amber-200/70">
                  Protected by reCAPTCHA • <a href="https://policies.google.com/privacy" className="underline" target="_blank">Privacy</a> • <a href="https://policies.google.com/terms" className="underline" target="_blank">Terms</a>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Estilos globales para eliminar el blanco del autofill y animaciones */}
        <style jsx global>{`
          .login-scope .login-input {
            background: transparent !important;
            color: #fff;
            caret-color: #f59e0b;
          }
          .login-scope .login-input:autofill {
            background: transparent !important;
            -webkit-text-fill-color: #fefce8;
            box-shadow: 0 0 0 1000px #0a0a0b inset !important;
            border-radius: 16px;
          }
          .login-scope .login-input:-webkit-autofill,
          .login-scope .login-input:-webkit-autofill:hover,
          .login-scope .login-input:-webkit-autofill:focus,
          .login-scope .login-input:-webkit-autofill:active {
            -webkit-text-fill-color: #fefce8;
            box-shadow: 0 0 0 1000px #0a0a0b inset !important;
            transition: background-color 9999s ease-out 0s;
            border-radius: 16px;
          }

          .frame-bg {
            --mx: 50%;
            --my: 50%;
            background:
              radial-gradient(220px 220px at var(--mx) var(--my), rgba(245,158,11,0.18), transparent 60%),
              conic-gradient(from 180deg at 50% 0%, rgba(245,158,11,0.10), rgba(245,158,11,0.0) 25%, rgba(245,158,11,0.08) 60%, rgba(245,158,11,0.0));
            filter: saturate(120%);
            animation: aurora 14s linear infinite;
          }
          @keyframes aurora {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-2px) rotate(180deg); }
            100% { transform: translateY(0px) rotate(360deg); }
          }
          .neon-outline .runner { animation: dash 6s linear infinite; }
          @keyframes dash { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -1000; } }
        `}</style>
      </section>
    </main>
  );
}
