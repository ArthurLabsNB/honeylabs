'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

// SCHEMA VALIDACIÓN ZOD
const loginSchema = z.object({
  correo: z
    .string({ required_error: 'Correo obligatorio' })
    .nonempty({ message: 'Correo obligatorio' })
    .email({ message: 'Correo inválido' }),
  contrasena: z
    .string({ required_error: 'Contraseña obligatoria' })
    .nonempty({ message: 'Contraseña obligatoria' })
    .min(6, { message: 'Mínimo 6 caracteres' }),
});
type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [verContrasena, setVerContrasena] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
    reset,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    setFocus('correo');
  }, [setFocus]);

  useEffect(() => {
    const datos = localStorage.getItem('usuario');
    if (datos) {
      try {
        const user = JSON.parse(datos);
        if (user?.correo) router.replace('/');
      } catch {}
    }
  }, [router]);

  const onSubmit = async (datos: LoginData) => {
    setMensaje('');
    setCargando(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'Credenciales inválidas');

      localStorage.setItem('usuario', JSON.stringify(data));

      setMensaje('✔️ Inicio de sesión exitoso');
      reset();
      setTimeout(() => router.replace('/'), 800);
    } catch (error: any) {
      setMensaje(`❌ ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-900 shadow-xl border border-amber-300 dark:border-zinc-700 p-8 rounded-2xl max-w-md w-full space-y-5 animate-fade-in"
        autoComplete="on"
        aria-labelledby="login-title"
        noValidate
      >
        <h1
          id="login-title"
          className="text-3xl font-bold text-center text-amber-700 dark:text-amber-300 animate-typewriter"
          style={{ animationDuration: '2.1s', animationTimingFunction: 'steps(25, end)' }}
        >
          Iniciar Sesión
        </h1>

        {/* 📧 Correo */}
        <div className="space-y-1">
          <input
            {...register('correo')}
            placeholder="Correo electrónico"
            type="email"
            autoComplete="email"
            disabled={cargando}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              errors.correo ? 'border-red-400' : ''
            }`}
            aria-invalid={!!errors.correo}
            aria-describedby="error-correo"
          />
          {errors.correo && (
            <p id="error-correo" className="text-sm text-red-500">{errors.correo.message}</p>
          )}
        </div>

        {/* 🔒 Contraseña */}
        <div className="relative space-y-1">
          <input
            {...register('contrasena')}
            placeholder="Contraseña"
            type={verContrasena ? 'text' : 'password'}
            autoComplete="current-password"
            disabled={cargando}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10 ${
              errors.contrasena ? 'border-red-400' : ''
            }`}
            aria-invalid={!!errors.contrasena}
            aria-describedby="error-contrasena"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVerContrasena(v => !v)}
            className="absolute right-3 top-[10px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            disabled={cargando}
          >
            {verContrasena ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {errors.contrasena && (
            <p id="error-contrasena" className="text-sm text-red-500">{errors.contrasena.message}</p>
          )}
        </div>

        {/* 🔘 Botón */}
        <button
          type="submit"
          disabled={cargando}
          aria-busy={cargando}
          className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-md transition flex justify-center items-center gap-2 ${
            cargando ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {cargando ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" /> Verificando...
            </>
          ) : (
            'Entrar'
          )}
        </button>

        {/* 💡 Registro */}
        <p className="text-center text-sm text-gray-600 dark:text-zinc-300">
          ¿No tienes cuenta?{' '}
          <Link
            href="/registro"
            className="text-amber-700 underline hover:text-amber-900 dark:text-amber-300 font-medium transition"
          >
            Crear cuenta
          </Link>
        </p>

        {/* 🧾 Mensaje */}
        {mensaje && (
          <div
            className={`text-center text-sm mt-2 font-semibold ${
              mensaje.startsWith('✔️') ? 'text-green-600' : 'text-red-600'
            }`}
            aria-live="polite"
          >
            {mensaje}
          </div>
        )}
      </form>
    </main>
  );
}
