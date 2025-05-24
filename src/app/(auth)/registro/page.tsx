'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const router = useRouter();
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

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
      console.error('❌ Error en el registro:', err);
      setMensaje(err.message || 'Fallo en el registro');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full space-y-5 border border-amber-200"
      >
        <h1 className="text-2xl font-bold text-center text-amber-700">Crear cuenta</h1>

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

        <input name="codigo" placeholder="Código de invitación (opcional)" className="input" />

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
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          {cargando ? 'Registrando...' : 'Crear cuenta'}
        </button>

        {mensaje && (
          <p className="text-center text-sm font-medium mt-3 text-blue-600">{mensaje}</p>
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
