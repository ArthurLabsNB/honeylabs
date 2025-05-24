'use client';

import { useEffect, useState } from 'react';

export default function PanelPage() {
  const [usuario, setUsuario] = useState<{ nombre: string; tipoCuenta: string } | null>(null);

  useEffect(() => {
    // Simulación: esto debería venir de una API o sesión real
    const usuarioSimulado = {
      nombre: 'Usuario Demo',
      tipoCuenta: 'estandar', // institucional, empresarial, etc.
    };

    setUsuario(usuarioSimulado);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-amber-50 to-yellow-100 flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl w-full border border-amber-300">
        <h1 className="text-3xl font-bold text-amber-700 text-center mb-4">¡Bienvenido a HoneyLabs!</h1>
        
        {usuario ? (
          <>
            <p className="text-gray-700 text-center">
              Hola <span className="font-semibold">{usuario.nombre}</span>,
              estás accediendo como cuenta <strong>{usuario.tipoCuenta}</strong>.
            </p>
            <p className="text-center mt-4 text-sm text-gray-500">
              Desde aquí pronto podrás gestionar tus almacenes, novedades y calendarios. 🚀
            </p>
          </>
        ) : (
          <p className="text-center text-gray-600">Cargando información del usuario...</p>
        )}
      </div>
    </main>
  );
}
