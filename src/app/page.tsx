"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";

// =============== HERO SECTION CON VIDEO Y GIF ===============
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

function HeroSection() {
  const titulo = "La gestión inteligente de inventarios para el mundo real";
  const desc =
    "HoneyLabs revoluciona el control y digitalización de materiales con dashboards, control total y acceso desde cualquier lugar. Solución perfecta para laboratorios, empresas y organizaciones.";

  const textoTyped = useTypewriter(titulo, 54);
  const [showDesc, setShowDesc] = useState(false);

  useEffect(() => {
    setShowDesc(false);
    if (textoTyped.length === titulo.length) {
      const timer = setTimeout(() => setShowDesc(true), 300);
      return () => clearTimeout(timer);
    }
  }, [textoTyped, titulo.length]);

  return (
    <section className="relative w-full bg-gradient-to-br from-amber-300/40 via-zinc-800/90 to-zinc-950 min-h-[85vh] flex flex-col md:flex-row items-center justify-between px-4 md:px-16 py-16 md:py-24 overflow-hidden gap-10">
      <div className="flex-1 z-10 flex flex-col items-center md:items-start text-center md:text-left space-y-7">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-amber-100 drop-shadow-xl transition-all animate-typewriter leading-tight">
          {textoTyped}
          <span className="ml-1 animate-blink text-amber-400">|</span>
        </h1>
        <p
          className={clsx(
            "max-w-2xl text-xl md:text-2xl font-medium text-zinc-700 dark:text-zinc-200 transition-opacity",
            showDesc ? "opacity-100 animate-fade-in" : "opacity-0"
          )}
        >
          {showDesc && desc}
        </p>
        <div className="flex gap-4 mt-6">
          <a
            href="#demo"
            className="bg-amber-400 hover:bg-amber-500 text-black font-bold px-7 py-3 rounded-xl shadow-lg animate-ripple transition focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            Ver demo en video
          </a>
          <a
            href="#features"
            className="bg-white/20 hover:bg-amber-400/70 text-amber-900 dark:text-amber-200 border border-amber-300 px-7 py-3 rounded-xl shadow-lg transition font-bold"
          >
            Explorar características
          </a>
        </div>
      </div>
      {/* Hero imagen y gif */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="relative w-full max-w-[440px] aspect-[4/3] drop-shadow-2xl animate-3dpop">
          <Image
            src="/hero-warehouse-ui-mockup.png"
            alt="Mockup HoneyLabs dashboard"
            fill
            className="rounded-3xl object-cover border-4 border-amber-200 shadow-2xl"
            priority
            draggable={false}
          />
          {/* Gif flotando */}
          <div className="absolute -bottom-8 -left-10 w-36 h-24 z-20 animate-float-card">
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
      <div className="hidden md:block absolute right-24 top-28 w-[360px] aspect-video z-0 opacity-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300">
        <video
          src="/videos/demo-dashboard.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
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
    <section id="features" className="bg-gradient-to-b from-zinc-100 via-white dark:from-zinc-950 dark:via-zinc-900 to-transparent py-24 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-zinc-800 dark:text-amber-200 mb-8">
          ¿Por qué HoneyLabs?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white/80 dark:bg-zinc-900 rounded-3xl shadow-xl hover:shadow-2xl border border-amber-200 p-7 flex flex-col items-center transition-all group"
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-amber-100 mb-5 shadow-md">
                <Image src={f.icon} alt={f.title} width={42} height={42} />
              </div>
              <h3 className="text-xl font-bold text-zinc-800 dark:text-amber-200 mb-2 text-center">
                {f.title}
              </h3>
              <p className="text-zinc-700 dark:text-zinc-200 text-center mb-4">{f.desc}</p>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow border">
                <Image
                  src={f.image}
                  alt={`Demostración de ${f.title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============== VIDEO DEMO Y TESTIMONIOS ===============
function DemoSection() {
  return (
    <section id="demo" className="bg-zinc-900/95 py-24 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-1">Mira HoneyLabs en acción</h2>
          <p className="text-zinc-200 text-lg md:text-xl">
            Descubre cómo es la experiencia de gestionar tu almacén, importar/exportar, visualizar movimientos y controlar todo con facilidad.  
            <span className="block mt-1 text-amber-200 font-semibold">
              Rápido, visual, seguro y 100% digital.
            </span>
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-zinc-400 text-base">
            <li>✔️ Edición visual de materiales y unidades</li>
            <li>✔️ Exportación a PDF/Excel y reportes avanzados</li>
            <li>✔️ Manejo de fotos, códigos QR y escaneo rápido</li>
            <li>✔️ Dashboards personalizables</li>
          </ul>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 aspect-video w-full max-w-[480px]">
            <video
              src="/videos/demo-dashboard.mp4"
              controls
              poster="/feature-inventario.png"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// =============== KPI SECTION (MODERNO) ===============
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
      setCount(Math.floor(start + (to - start) * progress));
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
    <section className="max-w-7xl mx-auto py-24 px-4 grid grid-cols-2 md:grid-cols-4 gap-7">
      <KpiCard title="Entradas" value={entradas} color="green" loading={loading} />
      <KpiCard title="Salidas" value={salidas} color="rose" loading={loading} />
      <KpiCard title="Usuarios" value={usuarios} color="sky" loading={loading} />
      <KpiCard title="Almacenes" value={almacenes} color="amber" loading={loading} />
    </section>
  );
}
function KpiCard({ title, value, color, loading }: { title: string, value: number, color: string, loading: boolean }) {
  const colorMap: any = {
    green: "bg-green-100 text-green-700 border-green-300",
    rose: "bg-rose-100 text-rose-700 border-rose-300",
    sky: "bg-sky-100 text-sky-700 border-sky-300",
    amber: "bg-amber-100 text-amber-700 border-amber-300",
  };
  return (
    <div className={clsx(
      "rounded-2xl shadow-lg p-7 bg-white/80 border-2 flex flex-col items-center min-h-[140px] animate-fade-in",
      colorMap[color]
    )}>
      <span className="text-4xl md:text-5xl font-extrabold">{loading ? "…" : value.toLocaleString()}</span>
      <span className="text-lg font-medium mt-2">{title}</span>
    </div>
  );
}

// =============== CASOS DE ÉXITO / TESTIMONIOS / CLIENTES ===============
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
    <section className="bg-gradient-to-b from-white dark:from-zinc-900 to-zinc-100 dark:to-zinc-950 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-zinc-800 dark:text-amber-200 mb-14">
          Casos de éxito y testimonios
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {CASES.map((c) => (
            <div
              key={c.name}
              className="rounded-3xl bg-white dark:bg-zinc-900 shadow-xl p-8 flex flex-col md:flex-row gap-7 items-center border-2 border-amber-100 dark:border-amber-300 animate-float-card"
            >
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-xl">
                <Image
                  src={c.image}
                  alt={`Foto ${c.name}`}
                  fill
                  className="object-cover"
                  draggable={false}
                />
                <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full border-2 border-white bg-white dark:bg-zinc-900 flex items-center justify-center">
                  <Image
                    src={c.logo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2 items-center md:items-start text-center md:text-left">
                <p className="text-lg text-zinc-700 dark:text-zinc-200 font-medium">
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

// =============== PARTNERS SECTION ===============
const PARTNERS = [
  {
    nombre: "Tecnológico Nacional de México - ITQ",
    img: "/aliados/itq.png",
    url: "https://www.queretaro.tecnm.mx/",
  },
  {
    nombre: "HoneyLabs Open Community",
    img: "/aliados/comunidad.png",
    url: "https://github.com/honeylabs",
  },
  {
    nombre: "Empresa Digital S.A.",
    img: "/aliados/aliado-ejemplo.png",
    url: "#",
  },
];
function PartnersSection() {
  return (
    <section className="py-24 px-4 bg-white dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-9 text-center">
          Colaboradores y aliados
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {PARTNERS.map((a) => (
            <a
              key={a.nombre}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group transition hover:scale-105"
            >
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-lg border-2 border-amber-200 w-32 h-32 flex items-center justify-center">
                <Image
                  src={a.img}
                  alt={a.nombre}
                  width={82}
                  height={82}
                  className="object-contain"
                  draggable={false}
                />
              </div>
              <span className="text-amber-600 dark:text-amber-300 font-semibold text-center text-sm">
                {a.nombre}
              </span>
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
    <main className="relative min-h-screen w-full font-sans overflow-x-hidden bg-gradient-to-b from-amber-50/80 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <KpiSection />
      <SuccessCasesSection />
      <PartnersSection />
    </main>
  );
}
