"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";

// ========== BACKGROUND: ANIMATED GRADIENT + PARTICLES ==========
// Puedes agregar un fondo animado más avanzado si tienes librería. Aquí va un ejemplo base con Tailwind:
function AnimatedBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-amber-100 via-white to-amber-200 animate-gradient bg-fixed" />
      {/* Partículas sutiles */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber-300 blur-lg opacity-20"
            style={{
              width: `${40 + Math.random() * 70}px`,
              height: `${40 + Math.random() * 70}px`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animation: `floatParticle ${4 + Math.random() * 5}s infinite ease-in-out alternate ${i}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes floatParticle {
            0% { transform: translateY(0); }
            100% { transform: translateY(-30px); }
          }
        `}</style>
      </div>
      {/* Vignette sutil para foco */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-black/10" />
    </>
  );
}

// =============== TYPEWRITER HOOK ===============
function useTypewriter(text: string, speed = 60): string {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i === text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
}

// =============== HERO SECTION MEJORADA ===============
function HeroSection() {
  const titulo = "La gestión inteligente de inventarios para el mundo real";
  const desc =
    "HoneyLabs revoluciona el control y digitalización de materiales con dashboards, control total y acceso desde cualquier lugar. Solución perfecta para laboratorios, empresas y organizaciones.";

  const textoTyped = useTypewriter(titulo, 46);
  const [showDesc, setShowDesc] = useState(false);

  useEffect(() => {
    setShowDesc(false);
    if (textoTyped.length === titulo.length) {
      const timer = setTimeout(() => setShowDesc(true), 320);
      return () => clearTimeout(timer);
    }
  }, [textoTyped, titulo.length]);

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-5 md:px-20 py-20 overflow-hidden gap-10">
      <AnimatedBackground />
      {/* Logo animado */}
      <div className="absolute left-7 top-7 z-20">
        <Image
          src="/logo-honeylabs.svg"
          alt="Logo HoneyLabs"
          width={64}
          height={64}
          className="drop-shadow-2xl animate-spin-slow hover:scale-110 transition"
        />
      </div>
      {/* Texto y botones */}
      <div className="flex-1 z-10 flex flex-col items-center md:items-start text-center md:text-left space-y-8 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-9 shadow-2xl animate-fade-up">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--foreground)] drop-shadow-xl leading-tight transition-all animate-typewriter relative">
          <span className="text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text">{textoTyped}</span>
          <span className="ml-1 animate-blink text-amber-400">|</span>
        </h1>
        <p
          className={clsx(
            "max-w-2xl text-xl md:text-2xl font-medium text-[var(--dashboard-muted)] transition-opacity duration-700",
            showDesc ? "opacity-100 animate-fade-in" : "opacity-0"
          )}
        >
          {showDesc && desc}
        </p>
        <div className="flex gap-4 mt-6">
          <a
            href="#demo"
            className="relative bg-amber-400 hover:bg-amber-500 text-black font-bold px-7 py-3 rounded-xl shadow-lg group transition focus:outline-none focus:ring-2 focus:ring-amber-200 overflow-hidden"
          >
            <span className="absolute left-4 top-3 animate-pulse">
              <Image src="/icons/video.svg" alt="" width={24} height={24} />
            </span>
            <span className="ml-6">Ver demo en video</span>
            <span className="absolute inset-0 pointer-events-none opacity-0 group-active:opacity-100 transition duration-300 bg-white/20 rounded-xl animate-ripple" />
          </a>
          <a
            href="#features"
            className="bg-white/30 hover:bg-amber-400/70 text-amber-900 dark:text-amber-200 border border-amber-300 px-7 py-3 rounded-xl shadow-lg transition font-bold flex items-center gap-2"
          >
            <Image src="/icons/arrow-down.svg" alt="" width={22} height={22} className="animate-bounce" />
            Explorar características
          </a>
        </div>
      </div>
      {/* Imagen y gif mockup */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="relative w-full max-w-[420px] aspect-[4/3] drop-shadow-2xl animate-3dpop">
          <Image
            src="/hero-warehouse-ui-mockup.png"
            alt="Mockup HoneyLabs dashboard"
            fill
            className="rounded-3xl object-cover border-4 border-amber-200 shadow-2xl"
            priority
            draggable={false}
          />
          {/* Gif flotando */}
          <div className="absolute -bottom-8 -left-10 w-36 h-24 z-20 animate-float-card shadow-2xl">
            <Image
              src="/gif/demo-movimientos.gif"
              alt="Demostración animada movimientos"
              fill
              className="rounded-xl object-cover shadow-lg border-2 border-white"
              draggable={false}
            />
          </div>
        </div>
      </div>
      {/* Video demo flotando, solo en desktop */}
      <div className="hidden md:block absolute right-24 top-28 w-[360px] aspect-video z-0 opacity-85 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 animate-fade-in">
        <video
          src="/videos/demo-dashboard.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      {/* Línea decorativa */}
      <div className="absolute bottom-1 left-0 w-full h-3">
        <svg width="100%" height="100%">
          <rect width="100%" height="5" fill="url(#lineaAmber)" rx="3" />
          <defs>
            <linearGradient id="lineaAmber" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#FFD580" />
              <stop offset="100%" stopColor="#FFB300" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}

// =============== FEATURES CARDS ===============
const FEATURES = [
  {
    icon: "/icons/real-time.svg",
    title: "Inventario en tiempo real",
    desc: "Consulta y actualiza el estado de los materiales al instante, con historial y trazabilidad total.",
    image: "/feature-inventario.png",
  },
  {
    icon: "/icons/user-roles.svg",
    title: "Roles y permisos personalizados",
    desc: "Gestiona acceso y acciones según el tipo de usuario, asegurando la seguridad y organización.",
    image: "/feature-users.gif",
  },
  {
    icon: "/icons/cloud-access.svg",
    title: "Acceso desde cualquier lugar",
    desc: "Plataforma 100% web, disponible 24/7 desde cualquier dispositivo, con backups automáticos.",
    image: "/feature-web-devices.png",
  },
  {
    icon: "/icons/integrations.svg",
    title: "Integraciones y reportes",
    desc: "Exporta a Excel, PDF, conecta con APIs y obtén reportes visuales de movimientos y uso.",
    image: "/feature-integrations.gif",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[var(--foreground)] mb-8 animate-fade-up">
          <span className="inline-block bg-gradient-to-r from-amber-400 via-amber-500 to-amber-700 bg-clip-text text-transparent">¿Por qué HoneyLabs?</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="relative bg-white/80 dark:bg-zinc-900/70 rounded-3xl shadow-xl hover:shadow-2xl border border-amber-200 p-7 flex flex-col items-center transition-all group animate-fade-up"
              tabIndex={0}
            >
              {/* Tooltip decorativo */}
              <span className="absolute top-3 right-4 text-xs text-amber-500 opacity-60 group-hover:opacity-100 transition">Tip: ¡Haz hover!</span>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-amber-100 mb-5 shadow-md group-hover:scale-110 transition-transform">
                <Image src={f.icon} alt={f.title} width={42} height={42} />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 text-center">{f.title}</h3>
              <p className="text-[var(--dashboard-muted)] text-center mb-4">{f.desc}</p>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow border group-hover:scale-105 transition-transform duration-300 animate-fade-in">
                <Image
                  src={f.image}
                  alt={`Demostración de ${f.title}`}
                  fill
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Divider animado */}
      <div className="w-full flex justify-center mt-16">
        <div className="h-1 w-1/2 rounded-full bg-gradient-to-r from-amber-300 to-amber-600 animate-pulse" />
      </div>
    </section>
  );
}

// =============== DEMO SECTION MEJORADA ===============
function DemoSection() {
  return (
    <section id="demo" className="py-24 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center animate-fade-up">
        <div className="flex-1 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-1 animate-pulse">Mira HoneyLabs en acción</h2>
          <p className="text-[var(--dashboard-muted)] text-lg md:text-xl">
            Descubre cómo es la experiencia de gestionar tu almacén, importar/exportar, visualizar movimientos y controlar todo con facilidad.  
            <span className="block mt-1 text-amber-500 font-semibold">
              Rápido, visual, seguro y 100% digital.
            </span>
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-[var(--dashboard-muted)] text-base">
            <li>✔️ Edición visual de materiales y unidades</li>
            <li>✔️ Exportación a PDF/Excel y reportes avanzados</li>
            <li>✔️ Manejo de fotos, códigos QR y escaneo rápido</li>
            <li>✔️ Dashboards personalizables</li>
          </ul>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 aspect-video w-full max-w-[480px] group animate-pulse-slow">
            <video
              src="/videos/demo-dashboard.mp4"
              controls
              poster="/feature-inventario.png"
              className="w-full h-full object-cover group-hover:brightness-110 transition"
            />
            <div className="absolute bottom-4 right-4 bg-white/70 dark:bg-zinc-800/80 rounded-xl px-3 py-1 shadow flex items-center gap-2 text-sm text-amber-800">
              <Image src="/icons/lightning.svg" alt="Rápido" width={18} height={18} />
              Demo rápida
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============== KPI SECTION (con tooltip animado) ===============
type Metrics = {
  entradas: number;
  salidas: number;
  usuarios: number;
  almacenes: number;
};
function useCountUp(to: number, duration = 1100): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0, raf: number, startTime: number;
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(start + (to - start) * (1 - Math.cos(progress * Math.PI)) / 2)); // easing suave
      if (progress < 1) raf = requestAnimationFrame(animate);
      else setCount(to);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return count;
}
function KpiSection() {
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/metrics")
      .then(r => r.json())
      .then(d => setData(d || null))
      .catch(() =>
        setData({ entradas: 0, salidas: 0, usuarios: 0, almacenes: 0 }),
      )
      .finally(() => setLoading(false));
  }, []);

  const entradas = useCountUp(data?.entradas ?? 0, 800);
  const salidas = useCountUp(data?.salidas ?? 0, 800);
  const usuarios = useCountUp(data?.usuarios ?? 0, 700);
  const almacenes = useCountUp(data?.almacenes ?? 0, 700);

  return (
    <section className="max-w-7xl mx-auto py-24 px-4 grid grid-cols-2 md:grid-cols-4 gap-7 animate-fade-up">
      <KpiCard title="Entradas" value={entradas} color="green" loading={loading} info="Entradas de materiales al sistema en los últimos 12 meses" />
      <KpiCard title="Salidas" value={salidas} color="rose" loading={loading} info="Salidas totales de materiales registradas" />
      <KpiCard title="Usuarios" value={usuarios} color="sky" loading={loading} info="Usuarios activos usando la plataforma" />
      <KpiCard title="Almacenes" value={almacenes} color="amber" loading={loading} info="Almacenes y laboratorios gestionados" />
    </section>
  );
}
function KpiCard({ title, value, color, loading, info }: { title: string, value: number, color: string, loading: boolean, info: string }) {
  const colorMap: any = {
    green: "bg-green-100 text-green-700 border-green-300",
    rose: "bg-rose-100 text-rose-700 border-rose-300",
    sky: "bg-sky-100 text-sky-700 border-sky-300",
    amber: "bg-amber-100 text-amber-700 border-amber-300",
  };
  return (
    <div className={clsx(
      "relative rounded-2xl shadow-lg p-7 bg-white/80 border-2 flex flex-col items-center min-h-[140px] animate-fade-in group cursor-pointer",
      colorMap[color]
    )}>
      <span className="absolute top-2 right-3 opacity-40 text-xl group-hover:opacity-100 transition" tabIndex={0}>ⓘ
        <div className="absolute top-8 right-0 z-30 w-48 bg-white/90 border border-amber-200 text-xs text-amber-900 rounded-xl shadow-lg px-4 py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition">
          {info}
        </div>
      </span>
      <span className="text-4xl md:text-5xl font-extrabold drop-shadow">{loading ? "…" : value.toLocaleString()}</span>
      <span className="text-lg font-medium mt-2">{title}</span>
    </div>
  );
}

// =============== CASOS DE ÉXITO (avatar animado) ===============
const CASES = [
  {
    name: "Laboratorio de Eléctrica ITQ",
    image: "/clientes/itq-lab.jpg",
    logo: "/aliados/itq.png",
    testimonial:
      "Antes de HoneyLabs, el control era manual y lento. Ahora tenemos trazabilidad completa y acceso instantáneo desde cualquier dispositivo. ¡Recomiendo la plataforma para cualquier laboratorio o empresa!",
    person: "Ing. Alejandra Ramírez",
    role: "Coordinadora Lab. Eléctrica",
  },
  {
    name: "HoneyLabs Open Community",
    image: "/clientes/comunidad.jpg",
    logo: "/aliados/comunidad.png",
    testimonial:
      "Como comunidad, valoramos la facilidad de uso y la capacidad de proponer mejoras. La integración y los reportes han optimizado nuestro tiempo y recursos.",
    person: "Carlos R. - Desarrollador",
    role: "Miembro comunidad",
  },
];

function SuccessCasesSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[var(--foreground)] mb-14 animate-fade-up">
          Casos de éxito y testimonios
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {CASES.map((c) => (
            <div
              key={c.name}
              className="rounded-3xl bg-white/80 dark:bg-zinc-900/70 shadow-xl p-8 flex flex-col md:flex-row gap-7 items-center border-2 border-amber-100 dark:border-amber-300 animate-float-card group hover:scale-[1.03] transition"
              tabIndex={0}
            >
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-xl group-hover:ring-4 group-hover:ring-amber-400 transition-all">
                <Image
                  src={c.image}
                  alt={`Foto ${c.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  draggable={false}
                />
                <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full border-2 border-white bg-white dark:bg-zinc-900 flex items-center justify-center group-hover:shadow-amber-400 group-hover:shadow-lg transition-all">
                  <Image
                    src={c.logo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full animate-spin-slow"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2 items-center md:items-start text-center md:text-left">
                <p className="text-lg text-[var(--dashboard-muted)] font-medium">
                  “{c.testimonial}”
                </p>
                <span className="text-amber-500 font-bold mt-2">{c.person}</span>
                <span className="text-sm text-zinc-500">{c.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============== PARTNERS SECTION: carousel animado ===============
const PARTNERS = [
  {
    nombre: "Tecnológico Nacional de México - ITQ",
    img: "/aliados/itq.png",
    url: "https://www.queretaro.tecnm.mx/",
    verified: true,
  },
  {
    nombre: "HoneyLabs Open Community",
    img: "/aliados/comunidad.png",
    url: "https://github.com/honeylabs",
    verified: true,
  },
  {
    nombre: "Empresa Digital S.A.",
    img: "/aliados/aliado-ejemplo.png",
    url: "#",
    verified: false,
  },
];
function PartnersSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-9 text-center animate-fade-up">
          Colaboradores y aliados
        </h2>
        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto gap-8 pb-2 justify-center items-center snap-x snap-mandatory">
          {PARTNERS.map((a) => (
            <a
              key={a.nombre}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group transition hover:scale-105 snap-center min-w-[160px] animate-fade-in"
            >
              <div className="relative bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-lg border-2 border-amber-200 w-32 h-32 flex items-center justify-center group-hover:shadow-amber-300 transition">
                <Image
                  src={a.img}
                  alt={a.nombre}
                  width={82}
                  height={82}
                  className="object-contain"
                  draggable={false}
                />
                {a.verified && (
                  <span className="absolute bottom-2 right-2 bg-green-400 text-white text-xs rounded-full px-2 py-1 shadow animate-pulse">
                    Verified
                  </span>
                )}
              </div>
              <span className="text-amber-600 dark:text-amber-300 font-semibold text-center text-sm">{a.nombre}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============== EXPORT DE LA PAGINA PRINCIPAL ===============
export default function Page() {
  return (
    <main className="relative min-h-screen w-full font-sans overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <KpiSection />
      <SuccessCasesSection />
      <PartnersSection />
    </main>
  );
}
