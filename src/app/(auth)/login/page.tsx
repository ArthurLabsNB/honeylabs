'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');

    // Aquí iría tu lógica real de login
    if (correo && contrasena) {
      // Simulación de login exitoso
      router.push('/panel');
    } else {
      setMensaje('Debes completar todos los campos.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md max-w-md w-full space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Iniciar sesión</h1>

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          className="input"
        />

        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          className="input"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Iniciar sesión
        </button>

        <button
          type="button"
          className="text-sm text-center text-blue-600 hover:underline w-full"
          onClick={() => router.push('/registro')}
        >
          ¿No tienes cuenta? Crear una
        </button>

        {mensaje && (
          <div className="mt-2 text-center text-sm text-red-600">
            {mensaje}
          </div>
        )}
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
          font-size: 1rem;
        }
      `}</style>
    </main>
  );
}
