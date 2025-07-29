"use client";

import { useState, useEffect, useRef } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSession from "@/hooks/useSession";
import Recaptcha from "@/components/Recaptcha";

export default function RegistroPage() {
  const router = useRouter();
  const { usuario } = useSession();
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const nombreRef = useRef<HTMLInputElement>(null);

  // Foco automático al nombre
  useEffect(() => {
    nombreRef.current?.focus();
  }, []);

  // Revisa sesión: si ya tienes usuario, redirige a dashboard
  useEffect(() => {
    if (usuario) router.replace("/dashboard");
  }, [usuario, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    const formData = new FormData(e.currentTarget);

    if (!captchaToken) {
      setMensaje("Completa el captcha");
      setCargando(false);
      return;
    }
    formData.append("captchaToken", captchaToken);

    // Validación rápida en frontend
    if (
      !formData.get("nombre") ||
      !formData.get("apellidos") ||
      !formData.get("correo") ||
      !formData.get("contrasena") ||
      !formData.get("tipoCuenta")
    ) {
      setMensaje("Por favor, completa todos los campos obligatorios.");
      setCargando(false);
      return;
    }

    try {
      const res = await apiFetch("/api/registro", {
        method: "POST",
        body: formData,
      });

      const data = await jsonOrNull(res);

      if (!res.ok) throw new Error(data?.detalle || data?.error || "Error desconocido");

      setMensaje(data.mensaje || "✔️ Registro exitoso");

      if (data.success) {
        setTimeout(() => router.replace("/login"), 1700);
      }
    } catch (err: any) {
      setMensaje(`❌ ${err.message || "Fallo en el registro"}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center"
      data-oid="tj7zuom"
    >
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl max-w-md w-full space-y-5 border border-amber-200 animate-fade-in"
        autoComplete="on"
        aria-labelledby="register-title"
        noValidate
        data-oid="k43o5p:"
      >
        <h1
          id="register-title"
          className="text-2xl font-bold text-center text-amber-700 dark:text-amber-300 mb-2 animate-typewriter"
          style={{
            animationDuration: "2s",
            animationTimingFunction: "steps(25, end)",
          }}
          data-oid="006xtx:"
        >
          Crear cuenta
        </h1>

        <input
          ref={nombreRef}
          name="nombre"
          required
          placeholder="Nombre"
          className="input"
          autoComplete="given-name"
          data-oid="tefj4lr"
        />

        <input
          name="apellidos"
          required
          placeholder="Apellidos"
          className="input"
          autoComplete="family-name"
          data-oid="qu3xlbl"
        />

        <input
          name="correo"
          type="email"
          required
          placeholder="Correo electrónico"
          className="input"
          autoComplete="email"
          data-oid="2w0mb39"
        />

        <input
          name="contrasena"
          type="password"
          required
          placeholder="Contraseña"
          className="input"
          autoComplete="new-password"
          data-oid="7awqi:9"
        />

        <select name="tipoCuenta" required className="input" data-oid="s_mshbr">
          <option value="" data-oid=".eu29cw">
            Tipo de cuenta
          </option>
          <option value="individual" data-oid="47wixu9">
            Usuario individual
          </option>
          <option value="empresarial" disabled data-oid="j47sjsj">
            Empresa (Aún en proceso)
          </option>
          <option value="institucional" disabled data-oid="k8gx-.a">
            Institución (Aún en proceso)
          </option>
        </select>

        <input
          name="codigo"
          placeholder="Código de invitación (opcional)"
          className="input"
          data-oid="0s1tav6"
        />

        <div data-oid="0b6nj.f">
          <label
            htmlFor="archivo"
            className="block text-sm text-gray-600 mb-1"
            data-oid="wqvadr5"
          >
            Archivo de validación (PDF o imagen, si aplica)
          </label>
          <input
            name="archivo"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="input file:bg-white file:border file:border-gray-300 file:rounded file:px-3"
            data-oid="9ode.vn"
          />
        </div>

        <Recaptcha onToken={setCaptchaToken} />

        <button
          type="submit"
          disabled={cargando}
          className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition ${
            cargando ? "opacity-70 cursor-not-allowed" : ""
          }`}
          data-oid="neg:buu"
        >
          {cargando ? "Registrando..." : "Crear cuenta"}
        </button>

        <p
          className="text-center text-sm text-gray-600 mt-1"
          data-oid="qy8_jyw"
        >
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-amber-700 underline hover:text-amber-900 font-medium transition"
            data-oid="siryd-b"
          >
            Inicia sesión
          </Link>
        </p>

        {mensaje && (
          <p
            className={`text-center text-sm font-medium mt-3 ${
              mensaje.startsWith("✔️") ? "text-green-600" : "text-red-600"
            }`}
            data-oid="16-t3wy"
          >
            {mensaje}
          </p>
        )}
      </form>

      <style jsx data-oid="rrvytj_">{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
          font-size: 1rem;
          outline: none;
        }
        .input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 1px #f59e0b;
        }
      `}</style>
    </main>
  );
}
