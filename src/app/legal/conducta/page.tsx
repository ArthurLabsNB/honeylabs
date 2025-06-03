// src/app/legal/conducta/page.tsx
export default function ConductaPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12" data-oid="9twk_2:">
      <h1 className="text-3xl font-bold mb-4 text-amber-700" data-oid="8c1cugt">
        Código de Conducta
      </h1>
      <p className="text-zinc-700 dark:text-zinc-300 mb-6" data-oid="41gy-6_">
        Fomentamos un ambiente seguro y respetuoso para todos los usuarios.
        Pronto compartiremos nuestro código de conducta.
      </p>
      <p className="text-sm text-zinc-500" data-oid="a4bv13_">
        Última actualización: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
