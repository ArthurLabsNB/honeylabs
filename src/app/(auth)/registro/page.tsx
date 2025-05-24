'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Registro() {
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error desconocido');

      setMensaje(data.mensaje || 'Registro exitoso');
      if (data.success) {
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (err: any) {
      setMensaje(err.message || 'Fallo en el registro');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md max-w-md w-full space-y-4"
        encType="multipart/form-data"
      >
        <h1 className="text-xl font-bold text-center">Crear cuenta</h1>

        <input name="nombre" required placeholder="Nombre" className="input" />
        <input name="apellidos" required placeholder="Apellidos" className="input" />
        <input name="correo" type="email" required placeholder="Correo electrónico" className="input" />
        <input name="contrasena" type="password" required placeholder="Contraseña" className="input" />

        <select name="tipoCuenta" required className="input">
          <option value="">Tipo de cuenta</option>
          <option value="estandar">Usuario individual</option>
          <option value="empresarial">Empresa</option>
          <option value="institucional">Institución</option>
        </select>

        <input name="codigo" placeholder="Código (si aplica)" className="input" />

        <label className="text-sm text-gray-600">Archivo de validación (si aplica)</label>
        <input name="archivo" type="file" accept=".pdf,.png,.jpg,.jpeg" className="input" />

        <button
          type="submit"
          disabled={cargando}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          {cargando ? 'Registrando...' : 'Crear cuenta'}
        </button>

        {mensaje && (
          <div className="mt-4 text-center text-sm text-blue-600">
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
