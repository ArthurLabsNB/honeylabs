'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CalendarDays, PackageSearch, Megaphone } from 'lucide-react';

type Usuario = {
  nombre: string;
  tipoCuenta: string;
};

export default function HomePage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // 📦 Verifica la sesión desde localStorage
  useEffect(() => {
    const datos = localStorage.getItem('usuario');
    if (!datos) {
      setCargando(false); // Mostrar página pública si no hay sesión
      return;
    }

    try {
      const user = JSON.parse(datos);
      if (!user?.nombre || !user?.tipoCuenta) throw new Error('Usuario incompleto');
      setUsuario(user);
    } catch (error) {
      console.error('⚠️ Usuario no válido:', error);
      localStorage.removeItem('usuario');
    } finally {
      setCargando(false);
    }
  }, [router]);

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center text-zinc-500">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2" />
          Cargando...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] px-6 py-12">
      <section className="max-w-6xl mx-auto">
        {/* 🧠 Estado de sesión */}
        <div className="mb-10 animate-fade-scale text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2 leading-snug">
            {usuario
              ? <>Bienvenido de nuevo, <span className="text-amber-600">{usuario.nombre}</span></>
              : <>Bienvenido a <span className="text-amber-600">HoneyLabs</span></>
            }
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base max-w-xl mx-auto">
            {usuario
              ? <>Has iniciado sesión como <strong className="capitalize">{usuario.tipoCuenta}</strong>. Accede a tus herramientas principales a continuación.</>
              : <>Gestiona tus almacenes, calendarios y novedades con la plataforma más intuitiva para entornos educativos y empresariales.</>
            }
          </p>
        </div>

        {/* 🧩 Acciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up-fade">
          <CardPanel
            title="Almacenes"
            description="Consulta y gestiona tus almacenes conectados"
            icon={<PackageSearch className="h-6 w-6 text-amber-600" />}
            actionLabel="Entrar"
            href={usuario ? '/almacenes' : '/login'}
          />
          <CardPanel
            title="Calendario"
            description="Visualiza fechas clave y añade eventos"
            icon={<CalendarDays className="h-6 w-6 text-amber-600" />}
            actionLabel="Ver calendario"
            href={usuario ? '/calendario' : '/login'}
          />
          <CardPanel
            title="Novedades"
            description="Mantente informado sobre tus proyectos activos"
            icon={<Megaphone className="h-6 w-6 text-amber-600" />}
            actionLabel="Revisar"
            href={usuario ? '/novedades' : '/login'}
          />
        </div>

        {/* 📊 Bloque informativo solo si hay sesión */}
        {usuario && (
          <div className="mt-14">
            <h2 className="text-2xl font-semibold mb-4">Resumen de actividad</h2>
            <div className="card text-sm text-zinc-600 dark:text-zinc-300">
              Aquí podrás ver el historial de movimientos de tus almacenes, próximos eventos y cambios relevantes en tu cuenta.
              <br />
              (En versiones futuras se incluirán gráficas, estadísticas y comparativas).
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

// 🧱 Componente de tarjeta reutilizable
function CardPanel({
  title,
  description,
  icon,
  actionLabel,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  href: string;
}) {
  return (
    <div className="card hover:shadow-md transition">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-amber-100 dark:bg-zinc-800 rounded-lg p-2">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">{title}</h3>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{description}</p>
      <a
        href={href}
        className="text-sm font-medium text-amber-600 hover:text-amber-700 transition"
      >
        {actionLabel} →
      </a>
    </div>
  );
}
