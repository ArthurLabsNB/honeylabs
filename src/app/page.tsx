'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import {
  Loader2,
  PackageSearch,
  CalendarDays,
  Megaphone,
  BarChart2,
  LifeBuoy,
  Star,
  Users,
  Heart,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Zap,
} from 'lucide-react';

// ===================
// Tipo de usuario
// ===================
type Usuario = { nombre: string; tipoCuenta: string; imagen?: string };

// ===================
// Página principal
// ===================
export default function HomePage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Cargar usuario desde localStorage (mejorable: usar cookies o contexto global)
  useEffect(() => {
    try {
      const datos = localStorage.getItem('usuario');
      if (datos) {
        const user = JSON.parse(datos);
        if (user?.nombre && user?.tipoCuenta) setUsuario(user);
      }
    } catch {
      localStorage.removeItem('usuario');
    } finally {
      setCargando(false);
    }
  }, []);

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <Loader2 className="animate-spin h-8 w-8 text-amber-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] px-2 sm:px-6 py-12 space-y-16">
      {/* 1. Hero / Bienvenida */}
      <section className="max-w-5xl mx-auto text-center animate-fade-in">
        <img src="/logo-honeylabs.svg" alt="HoneyLabs" className="mx-auto mb-6 h-12 w-12" draggable={false} />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 leading-tight">
          {usuario
            ? <>¡Hola, <span className="text-amber-600">{usuario.nombre}</span>!</>
            : <>Bienvenido a <span className="text-amber-600">HoneyLabs</span></>
          }
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
          {usuario
            ? <>Accede a tus herramientas y mantente al tanto de las novedades de tu cuenta <b className="text-amber-700">({usuario.tipoCuenta})</b>.</>
            : <>Gestiona inventarios, almacenes y calendarios en la plataforma inteligente para educación y empresas.</>
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-7">
          <Link href={usuario ? "/almacenes" : "/login"} className="btn-primary">
            {usuario ? "Ir a mis almacenes" : "Iniciar sesión"}
          </Link>
          <Link href="/acerca" className="btn-secondary">¿Qué es HoneyLabs?</Link>
        </div>
      </section>

      {/* 2. Panel de acceso rápido */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up-fade">
        <HomeCard
          title="Almacenes"
          icon={<PackageSearch className="h-6 w-6" />}
          href={usuario ? "/almacenes" : "/login"}
          description="Consulta, administra y personaliza tus almacenes y stock."
        />
        <HomeCard
          title="Calendario"
          icon={<CalendarDays className="h-6 w-6" />}
          href={usuario ? "/calendario" : "/login"}
          description="Gestiona fechas importantes, eventos y recordatorios."
        />
        <HomeCard
          title="Novedades"
          icon={<Megaphone className="h-6 w-6" />}
          href={usuario ? "/novedades" : "/login"}
          description="Noticias, anuncios y cambios recientes en tu organización."
        />
      </section>

      {/* 3. Resumen / KPIs */}
      <section className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <SummaryPanel
            icon={<BarChart2 className="h-7 w-7 text-amber-600" />}
            title="Movimientos este mes"
            value="45"
            subtitle="Entradas/Salidas registradas"
          />
          <SummaryPanel
            icon={<Star className="h-7 w-7 text-yellow-400" />}
            title="Nivel de satisfacción"
            value="97%"
            subtitle="Valoración promedio usuarios"
          />
          <SummaryPanel
            icon={<Users className="h-7 w-7 text-sky-500" />}
            title="Usuarios activos"
            value="128"
            subtitle="Conectados en la última semana"
          />
        </div>
      </section>

      {/* 4. Noticias destacadas */}
      <section className="max-w-5xl mx-auto space-y-5">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-amber-500" /> Novedades y anuncios
        </h2>
        <NewsPanel />
      </section>

      {/* 5. Tips y ayuda rápida */}
      <section className="max-w-5xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <LifeBuoy className="h-5 w-5 text-teal-400" /> ¿Necesitas ayuda?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TipCard
            icon={<BookOpen className="h-6 w-6 text-amber-600" />}
            title="Manual de usuario"
            description="Consulta nuestra guía completa para aprender a usar todas las funciones de HoneyLabs."
            href="/ayuda"
          />
          <TipCard
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            title="Atajos rápidos"
            description="Aprovecha los atajos de teclado y automatizaciones para agilizar tu flujo de trabajo."
            href="/ayuda#tips"
          />
        </div>
      </section>

      {/* 6. Partners / Integraciones */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-400" /> Aliados y colaboraciones
        </h2>
        <div className="flex gap-6 flex-wrap items-center justify-start">
          <PartnerLogo src="/aliado-itq.png" name="ITQ" href="https://www.queretaro.tecnm.mx/" />
          <PartnerLogo src="/aliado-partner.png" name="Partner X" href="#" />
          <PartnerLogo src="/aliado-edu.png" name="Educateam" href="#" />
        </div>
      </section>

      {/* 7. Estado del sistema / soporte */}
      <section className="max-w-5xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-500" /> Estado del sistema & soporte
        </h2>
        <StatusPanel />
      </section>
    </main>
  );
}

// =============== COMPONENTES REUTILIZABLES ===============

type HomeCardProps = {
  title: string;
  icon: React.ReactNode;
  description: string;
  href: string;
};

function HomeCard({ title, icon, description, href }: HomeCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-lg transition flex flex-col items-start gap-3"
    >
      <span className="rounded-lg p-2 bg-amber-100 dark:bg-zinc-800 text-amber-700 dark:text-amber-200 group-hover:scale-105 transition">
        {icon}
      </span>
      <span className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</span>
      <span className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{description}</span>
      <span className="mt-auto text-xs text-amber-700 dark:text-amber-400 font-bold group-hover:underline">Ver más →</span>
    </Link>
  );
}

type SummaryPanelProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
};

function SummaryPanel({ icon, title, value, subtitle }: SummaryPanelProps) {
  return (
    <div className="flex-1 rounded-xl bg-white dark:bg-zinc-900 shadow border border-zinc-200 dark:border-zinc-700 px-6 py-5 flex items-center gap-4 min-w-[200px] animate-fade-in">
      {icon}
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm text-zinc-700 dark:text-zinc-300">{title}</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</div>
      </div>
    </div>
  );
}

function NewsPanel() {
  // Simulación de noticias (puedes traer de una API real)
  const noticias = [
    {
      titulo: "¡Nuevo calendario avanzado!",
      fecha: "28 mayo 2025",
      resumen: "Lanzamos el calendario inteligente, ahora con adjuntos y notificaciones.",
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    },
    {
      titulo: "Mejora de seguridad",
      fecha: "23 mayo 2025",
      resumen: "Sistema de roles y códigos de invitación para mayor control.",
      icon: <ShieldCheck className="h-4 w-4 text-blue-500" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {noticias.map((n, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 flex gap-3 items-start shadow-sm">
          <span>{n.icon}</span>
          <div>
            <div className="font-semibold text-zinc-800 dark:text-zinc-100">{n.titulo}</div>
            <div className="text-xs text-zinc-500 mb-1">{n.fecha}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300">{n.resumen}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

type TipCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
};

function TipCard({ icon, title, description, href }: TipCardProps) {
  return (
    <Link href={href} className="flex gap-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 shadow hover:shadow-lg transition group items-start">
      <span className="rounded-lg p-2 bg-amber-50 dark:bg-zinc-800 text-amber-700 dark:text-amber-200 group-hover:scale-105 transition">{icon}</span>
      <div>
        <div className="font-semibold mb-1 text-zinc-900 dark:text-white">{title}</div>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">{description}</div>
      </div>
    </Link>
  );
}

type PartnerLogoProps = {
  src: string;
  name: string;
  href: string;
};

function PartnerLogo({ src, name, href }: PartnerLogoProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 p-2 rounded-md hover:bg-amber-100 dark:hover:bg-zinc-800 transition border border-transparent hover:border-amber-400">
      <img src={src} alt={name} className="h-8 w-8 rounded-lg object-contain" />
      <span className="font-medium">{name}</span>
    </a>
  );
}

function StatusPanel() {
  // Aquí podrías traer estado de API
  const statusOk = true;
  return (
    <div className={clsx(
      "rounded-xl p-4 flex gap-3 items-center shadow border transition",
      statusOk
        ? "border-green-300 bg-green-50 dark:bg-zinc-900"
        : "border-red-300 bg-red-50 dark:bg-zinc-900"
    )}>
      <span>{statusOk ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <LifeBuoy className="h-6 w-6 text-red-500" />}</span>
      <div>
        <div className="font-semibold">{statusOk ? "Sistema funcionando normalmente" : "Problemas detectados"}</div>
        <div className="text-xs text-zinc-600 dark:text-zinc-300">
          {statusOk
            ? "Todos los servicios activos. Última actualización: 12:31 PM"
            : "Estamos trabajando para resolver los inconvenientes lo antes posible."
          }
        </div>
      </div>
      <a href="/contacto" className="ml-auto text-xs text-amber-700 dark:text-amber-400 underline">Soporte</a>
    </div>
  );
}

// ============= BOTONES TAILWIND PARA TU CSS GLOBAL =============
// .btn-primary {
//   @apply bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-md shadow transition;
// }
// .btn-secondary {
//   @apply bg-white hover:bg-amber-100 text-amber-700 font-semibold py-2 px-6 rounded-md shadow border border-amber-200 transition;
// }
