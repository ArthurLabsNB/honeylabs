'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type Usuario = {
  nombre: string;
  tipoCuenta: string;
};

export default function PanelPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const datos = localStorage.getItem('usuario');
      if (!datos) {
        router.push('/login'); // Redirige si no hay sesión
        return;
      }

      try {
        const usuarioParseado = JSON.parse(datos);
        setUsuario(usuarioParseado);
      } catch (error) {
        console.error('⚠️ Error al parsear usuario:', error);
        localStorage.removeItem('usuario');
        router.push('/login');
      } finally {
        setCargando(false);
      }
    };

    verificarSesion();
  }, [router]);

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-amber-50 to-yellow-100">
        <div className="text-center text-gray-600">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2" />
          Cargando panel...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-amber-50 to-yellow-100 flex items-center justify-center px-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-2xl w-full border border-yellow-300 animate-fade-in">
        <h1 className="text-4xl font-bold text-center text-amber-700 mb-6 tracking-tight">
          🐝 Panel de Bienvenida
        </h1>

        {usuario && (
          <>
            <p className="text-lg text-gray-700 text-center mb-4">
              ¡Hola <span className="font-semibold text-amber-700">{usuario.nombre}</span>!
            </p>
            <p className="text-center text-sm text-gray-600 mb-6">
              Has ingresado con una cuenta <strong>{usuario.tipoCuenta}</strong>. Desde aquí podrás gestionar tus almacenes, revisar novedades, y controlar tu calendario.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                📦 Ver almacenes
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                🗓️ Ir al calendario
              </button>
              <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition col-span-1 sm:col-span-2">
                📝 Ver novedades
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
