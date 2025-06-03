"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const nombreRef = useRef<HTMLInputElement>(null);

  // Foco automático al nombre
  useEffect(() => {
    nombreRef.current?.focus();
  }, []);

  // Revisa sesión REAL (cookie): si ya tiene, redirige a /dashboard
  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data?.usuario) router.replace("/dashboard");
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    const formData = new FormData(e.currentTarget);

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
      const res = await fetch("/api/registro", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error desconocido");

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
      data-oid="ejfnjy0"
    >
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl max-w-md w-full space-y-5 border border-amber-200 animate-fade-in"
        autoComplete="on"
        aria-labelledby="register-title"
        noValidate
        data-oid="l.6ofzn"
      >
        <h1
          id="register-title"
          className="text-2xl font-bold text-center text-amber-700 dark:text-amber-300 mb-2 animate-typewriter"
          style={{
            animationDuration: "2s",
            animationTimingFunction: "steps(25, end)",
          }}
          data-oid="8wqi.5w"
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
          data-oid="jevuym:"
        />

        <input
          name="apellidos"
          required
          placeholder="Apellidos"
          className="input"
          autoComplete="family-name"
          data-oid="3_r-9sf"
        />

        <input
          name="correo"
          type="email"
          required
          placeholder="Correo electrónico"
          className="input"
          autoComplete="email"
          data-oid="g_-vyu1"
        />

        <input
          name="contrasena"
          type="password"
          required
          placeholder="Contraseña"
          className="input"
          autoComplete="new-password"
          data-oid="_b4k1oh"
        />

        <select name="tipoCuenta" required className="input" data-oid="nl4djyl">
          <option value="" data-oid="-e7qchm">
            Tipo de cuenta
          </option>
          <option value="estandar" data-oid="01pryse">
            Usuario individual
          </option>
          <option value="empresarial" data-oid="i-lvw0q">
            Empresa
          </option>
          <option value="institucional" data-oid="4svn3oi">
            Institución
          </option>
        </select>

        <input
          name="codigo"
          placeholder="Código de invitación (opcional)"
          className="input"
          data-oid="ww2inj9"
        />

        <div data-oid="wzl455d">
          <label
            htmlFor="archivo"
            className="block text-sm text-gray-600 mb-1"
            data-oid="e-w.l7z"
          >
            Archivo de validación (PDF o imagen, si aplica)
          </label>
          <input
            name="archivo"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="input file:bg-white file:border file:border-gray-300 file:rounded file:px-3"
            data-oid="u5:8qaq"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition ${
            cargando ? "opacity-70 cursor-not-allowed" : ""
          }`}
          data-oid="zu_7ye4"
        >
          {cargando ? "Registrando..." : "Crear cuenta"}
        </button>

        <p
          className="text-center text-sm text-gray-600 mt-1"
          data-oid="015726v"
        >
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-amber-700 underline hover:text-amber-900 font-medium transition"
            data-oid="0y2txf7"
          >
            Inicia sesión
          </Link>
        </p>

        {mensaje && (
          <p
            className={`text-center text-sm font-medium mt-3 ${
              mensaje.startsWith("✔️") ? "text-green-600" : "text-red-600"
            }`}
            data-oid="22-1ocu"
          >
            {mensaje}
          </p>
        )}
      </form>

      <style jsx data-oid="7nlxk75">{`
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
