// src/app/estado/page.tsx
export default function EstadoPage() {
  return (
    <main className="max-w-3xl mx-auto p-8" data-oid="55r6f68">
      <h1 className="text-3xl font-bold mb-2 text-amber-700" data-oid="6:ostpz">
        Estado del sistema
      </h1>
      <p className="text-zinc-600 mb-4" data-oid="os1kij2">
        Consulta aquí el estado actual de los servicios y funcionalidades de
        HoneyLabs. Si algún servicio presenta problemas, aparecerá una
        notificación en esta sección.
      </p>
      <div
        className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-700 font-semibold"
        data-oid="3n303nl"
      >
        Todos los sistemas funcionan normalmente. Última actualización:{" "}
        {new Date().toLocaleString()}
      </div>
    </main>
  );
}
