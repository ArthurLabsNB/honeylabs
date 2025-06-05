"use client";

import { useState, useEffect, useRef } from "react";
import { jsonOrNull } from "@lib/http";
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
      .then(jsonOrNull)
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

      const data = await jsonOrNull(res);

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
      data-oid=".xiapnw"
    >
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl max-w-md w-full space-y-5 border border-amber-200 animate-fade-in"
        autoComplete="on"
        aria-labelledby="register-title"
        noValidate
        data-oid="d6q-mnf"
      >
        <h1
          id="register-title"
          className="text-2xl font-bold text-center text-amber-700 dark:text-amber-300 mb-2 animate-typewriter"
          style={{
            animationDuration: "2s",
            animationTimingFunction: "steps(25, end)",
          }}
          data-oid="t0:rwn8"
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
          data-oid="5wqg4:z"
        />

        <input
          name="apellidos"
          required
          placeholder="Apellidos"
          className="input"
          autoComplete="family-name"
          data-oid="z.8rz2_"
        />

        <input
          name="correo"
          type="email"
          required
          placeholder="Correo electrónico"
          className="input"
          autoComplete="email"
          data-oid="oi_y327"
        />

        <input
          name="contrasena"
          type="password"
          required
          placeholder="Contraseña"
          className="input"
          autoComplete="new-password"
          data-oid="i6gaz9j"
        />

        <select name="tipoCuenta" required className="input" data-oid="qimliea">
          <option value="" data-oid="obh74f3">
            Tipo de cuenta
          </option>
          <option value="estandar" data-oid="pvr.pf:">
            Usuario individual
          </option>
          <option value="empresarial" data-oid=".lfpwl7">
            Empresa
          </option>
          <option value="institucional" data-oid="db:0fu5">
            Institución
          </option>
        </select>

        <input
          name="codigo"
          placeholder="Código de invitación (opcional)"
          className="input"
          data-oid="1f-fskc"
        />

        <div data-oid="jwj:f-_">
          <label
            htmlFor="archivo"
            className="block text-sm text-gray-600 mb-1"
            data-oid="_cpu7tj"
          >
            Archivo de validación (PDF o imagen, si aplica)
          </label>
          <input
            name="archivo"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="input file:bg-white file:border file:border-gray-300 file:rounded file:px-3"
            data-oid="bagzr:5"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition ${
            cargando ? "opacity-70 cursor-not-allowed" : ""
          }`}
          data-oid=":6qdl-1"
        >
          {cargando ? "Registrando..." : "Crear cuenta"}
        </button>

        <p
          className="text-center text-sm text-gray-600 mt-1"
          data-oid="t3-d.hm"
        >
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-amber-700 underline hover:text-amber-900 font-medium transition"
            data-oid="82mef4k"
          >
            Inicia sesión
          </Link>
        </p>

        {mensaje && (
          <p
            className={`text-center text-sm font-medium mt-3 ${
              mensaje.startsWith("✔️") ? "text-green-600" : "text-red-600"
            }`}
            data-oid="iddoll8"
          >
            {mensaje}
          </p>
        )}
      </form>

      <style jsx data-oid="q8h5ih7">{`
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
