'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

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

      if (!res.ok) throw new Error(data.error || 'Credenciales inválidas');

      // ✅ Guardar sesión
      localStorage.setItem(
        'usuario',
        JSON.stringify({
          nombre: data.nombre,
          tipoCuenta: data.tipoCuenta,
          correo: data.correo,
        })
      );

      setMensaje('✔️ Inicio de sesión exitoso');

      // ✅ Redirigir al panel
      setTimeout(() => router.push('/'), 1200);
    } catch (error: any) {
      setMensaje(`❌ ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-100 to-rose-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full space-y-5 border border-amber-300"
      >
        <h2 className="text-3xl font-bold text-center text-amber-700 tracking-tight">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-md transition flex justify-center items-center gap-2"
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
          <a
            href="/registro"
            className="text-amber-700 underline hover:text-amber-900 font-medium"
          >
            Crear cuenta
          </a>
        </p>

        {mensaje && (
          <div
            className={`text-center text-sm mt-2 font-semibold ${
              mensaje.startsWith('✔️') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </div>
        )}
      </form>
    </div>
  );
}
