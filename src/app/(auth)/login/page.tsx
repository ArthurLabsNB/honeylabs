'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
// import { useUser } from '@/context/UserContext'; // Opcional: para manejo global de sesión

export default function LoginPage() {
  const router = useRouter();
  // const { usuario, login } = useUser(); // Si tienes contexto global de usuario

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const correoInput = useRef<HTMLInputElement>(null);

  // Autoenfocar el input de correo
  useEffect(() => {
    correoInput.current?.focus();
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
    // // Si usas contexto de usuario, haz esto:
    // if (usuario) router.replace('/');
  }, [router /*, usuario */]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'Credenciales inválidas');

      // Guardar sesión en localStorage (o usar contexto global)
      localStorage.setItem(
        'usuario',
        JSON.stringify({
          nombre: data.nombre,
          tipoCuenta: data.tipoCuenta,
          correo: data.correo,
        })
      );
      // login(data); // Si usas contexto de usuario

      setMensaje('✔️ Inicio de sesión exitoso');

      setTimeout(() => router.replace('/'), 900); // O "/panel"
    } catch (error: any) {
      setMensaje(`❌ ${error.message || 'Error de conexión con el servidor'}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-100 to-rose-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full space-y-5 border border-amber-300"
        aria-labelledby="login-title"
        autoComplete="on"
      >
        <h2 id="login-title" className="text-3xl font-bold text-center text-amber-700 tracking-tight">
          Iniciar Sesión
        </h2>

        <input
          ref={correoInput}
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={cargando}
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

        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link
            href="/registro"
            className="text-amber-700 underline hover:text-amber-900 font-medium transition"
          >
            Crear cuenta
          </Link>
        </p>

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
    </div>
  );
}
