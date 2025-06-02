'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistroPage() {
  const router = useRouter();
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const nombreRef = useRef<HTMLInputElement>(null);

  // Foco automático al nombre
  useEffect(() => {
    nombreRef.current?.focus();
  }, []);

  // Si ya hay sesión, redirige al home (o al panel)
  useEffect(() => {
    const datos = localStorage.getItem('usuario');
    if (datos) {
      try {
        const user = JSON.parse(datos);
        if (user && user.correo) {
          router.replace('/'); // O "/panel"
        }
      } catch {}
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    const formData = new FormData(e.currentTarget);

    // Validación rápida
    if (
      !formData.get('nombre') ||
      !formData.get('apellidos') ||
      !formData.get('correo') ||
      !formData.get('contrasena') ||
      !formData.get('tipoCuenta')
    ) {
      setMensaje('Por favor, completa todos los campos obligatorios.');
      setCargando(false);
      return;
    }

    // Aquí podrías hacer una validación extra del código invitación si quieres

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error desconocido');

      setMensaje(data.mensaje || '✔️ Registro exitoso');

      if (data.success) {
        setTimeout(() => router.replace('/login'), 2200);
      }
    } catch (err: any) {
      console.error('❌ Error en el registro:', err);
      setMensaje(`❌ ${err.message || 'Fallo en el registro'}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl max-w-md w-full space-y-5 border border-amber-200 animate-fade-in"
        autoComplete="on"
        aria-labelledby="register-title"
        noValidate
      >
        <h1
          id="register-title"
          className="text-2xl font-bold text-center text-amber-700 dark:text-amber-300 mb-2 animate-typewriter"
          style={{ animationDuration: '2s', animationTimingFunction: 'steps(25, end)' }}
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
        />
        <input
          name="apellidos"
          required
          placeholder="Apellidos"
          className="input"
          autoComplete="family-name"
        />
        <input
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
          autoComplete="new-password"
        />

        <select name="tipoCuenta" required className="input">
          <option value="">Tipo de cuenta</option>
          <option value="estandar">Usuario individual</option>
          <option value="empresarial">Empresa</option>
          <option value="institucional">Institución</option>
        </select>

        <input
          name="codigo"
          placeholder="Código de invitación (opcional)"
          className="input"
        />

        <div>
          <label htmlFor="archivo" className="block text-sm text-gray-600 mb-1">
            Archivo de validación (PDF o imagen, si aplica)
          </label>
          <input
            name="archivo"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="input file:bg-white file:border file:border-gray-300 file:rounded file:px-3"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition ${
            cargando ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {cargando ? 'Registrando...' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-1">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/login"
            className="text-amber-700 underline hover:text-amber-900 font-medium transition"
          >
            Inicia sesión
          </Link>
        </p>

        {mensaje && (
          <p
            className={`text-center text-sm font-medium mt-3 ${
              mensaje.startsWith('✔️') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </form>

      <style jsx>{`
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
