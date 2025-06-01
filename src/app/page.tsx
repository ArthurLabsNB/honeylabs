'use client';

import { useState, useEffect, ReactNode } from 'react';
import clsx from 'clsx';
import {
  ArrowDownCircle, ArrowUpCircle, Users, Warehouse,
  ChevronDown, ChevronUp
} from 'lucide-react';

// ========================
// FONDO GIF GLOBAL
// ========================
function FondoGIF() {
  // Usa div con background-image para mayor control responsivo
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen min-w-full min-h-full z-[-2] pointer-events-none select-none transition-all duration-500"
      style={{
        backgroundImage: "url('/background.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        inset: 0,
        width: "100vw",
        height: "100vh",
        minWidth: "100vw",
        minHeight: "100vh",
      }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

// ========================
// HERO SECTION
// ========================
function useTypewriter(text: string, speed = 36): string {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
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
  const titulo = 'Gestión de materiales eficiente';
  const descripcion =
    'Gestiona, registra y visualiza materiales en almacenes, adaptándose a cada tipo de usuario. Accede desde cualquier lugar con dashboards personalizados para un control completo y fácil.';
  const textoTyped = useTypewriter(titulo, 36);
  const [showDesc, setShowDesc] = useState(false);
  useEffect(() => {
    setShowDesc(false);
    if (textoTyped.length === titulo.length) {
      const timer = setTimeout(() => setShowDesc(true), 400);
      return () => clearTimeout(timer);
    }
  }, [textoTyped, titulo.length]);
  return (
    <section className="flex flex-col items-center justify-center min-h-[75vh] py-28 md:py-36 px-4 text-center select-none space-y-8">
      <h1 className={clsx(
        'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-amber-200 drop-shadow-xl transition-all animate-typewriter'
      )} style={{ fontFamily: `'Nunito', 'Inter', Arial, sans-serif` }}>
        {textoTyped}
        <span className="ml-1 animate-blink text-amber-300">|</span>
      </h1>
      <div className={clsx(
        'max-w-2xl text-lg md:text-xl text-zinc-200 font-normal transition-opacity duration-600',
        showDesc ? 'opacity-100 animate-fade-in' : 'opacity-0'
      )}>
        {showDesc && descripcion}
      </div>
      <a
        href="#acerca"
        className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-8 py-3 rounded-lg shadow-lg mt-3 animate-ripple transition focus:outline-none focus:ring-2 focus:ring-amber-200"
        aria-label="Explorar HoneyLabs"
      >
        Explorar HoneyLabs
      </a>
    </section>
  );
}

// ========================
// ABOUT SECTION
// ========================
function AboutSection() {
  return (
    <section id="acerca" className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14 py-24 md:py-32 px-4">
      <div className="flex-1 flex flex-col justify-center md:items-start items-center text-center md:text-left animate-fade-in-left">
        <h2 className="text-3xl md:text-4xl font-semibold text-amber-300 mb-4 tracking-tight">Acerca de HoneyLabs</h2>
        <p className="text-zinc-200 mb-6 max-w-lg text-lg md:text-xl font-normal">
          HoneyLabs es la solución moderna para la gestión logística y digitalización de inventarios en laboratorios, empresas e instituciones. Optimiza el registro, la organización y la consulta de materiales, facilitando procesos y colaboración en cualquier entorno.
        </p>
        <a
          href="/acerca"
          className="inline-block bg-amber-400 hover:bg-amber-500 text-black font-medium px-6 py-2 rounded-lg shadow transition animate-ripple"
          aria-label="Saber más sobre HoneyLabs"
        >
          Saber más
        </a>
      </div>
      <div className="flex-1 flex justify-center items-center animate-3dpop">
        <div className="relative group transition-transform duration-700 will-change-transform" tabIndex={0} style={{ perspective: '1000px', outline: 'none' }}>
          <img
            src="/ilustracion-almacen-3d.png"
            alt="Ilustración Almacén"
            className="w-80 h-80 md:w-[26rem] md:h-[26rem] object-cover rounded-2xl shadow-2xl border-2 border-amber-100 group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-3xl transition-transform duration-500"
            draggable={false}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

// ========================
// KPI SECTION
// ========================
type Metrics = { entradas: number; salidas: number; usuarios: number; almacenes: number };

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
    setLoading(true);
    fetch('/api/metrics')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(() => setData({ entradas: 0, salidas: 0, usuarios: 0, almacenes: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const entradas = useCountUp(data?.entradas ?? 0, 900);
  const salidas = useCountUp(data?.salidas ?? 0, 900);
  const usuarios = useCountUp(data?.usuarios ?? 0, 800);
  const almacenes = useCountUp(data?.almacenes ?? 0, 800);

  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 py-20 px-4">
      <KpiCard className="animate-float-card">
        {loading ? <LoaderKPI /> : (
          <>
            <div className="flex gap-7 mb-1">
              <div className="flex flex-col items-center">
                <ArrowDownCircle className="h-6 w-6 text-green-400" />
                <span className="text-2xl font-semibold text-green-300">{entradas.toLocaleString()}</span>
                <span className="text-xs text-zinc-100/70">Entradas</span>
              </div>
              <div className="flex flex-col items-center">
                <ArrowUpCircle className="h-6 w-6 text-rose-400" />
                <span className="text-2xl font-semibold text-rose-300">{salidas.toLocaleString()}</span>
                <span className="text-xs text-zinc-100/70">Salidas</span>
              </div>
            </div>
            <span className="text-sm text-zinc-400">Movimientos registrados</span>
          </>
        )}
      </KpiCard>
      <KpiCard className="animate-float-card-delayed">
        {loading ? <LoaderKPI /> : (
          <>
            <Users className="h-7 w-7 text-sky-400 mb-1" />
            <span className="text-3xl font-bold text-sky-100">{usuarios.toLocaleString()}</span>
            <span className="text-base text-zinc-200/90 mt-1">Usuarios registrados</span>
          </>
        )}
      </KpiCard>
      <KpiCard className="animate-float-card-delaymore">
        {loading ? <LoaderKPI /> : (
          <>
            <Warehouse className="h-7 w-7 text-amber-400 mb-1" />
            <span className="text-3xl font-bold text-amber-100">{almacenes.toLocaleString()}</span>
            <span className="text-base text-zinc-200/90 mt-1">Almacenes creados</span>
          </>
        )}
      </KpiCard>
    </section>
  );
}
function KpiCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`rounded-2xl bg-zinc-900/85 shadow-xl p-8 border border-amber-400/10 flex flex-col items-center transition-transform hover:scale-105 min-h-[170px] ${className}`}>
      {children}
    </div>
  );
}
function LoaderKPI() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-[80px]">
      <span className="inline-block h-7 w-7 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></span>
      <span className="text-xs text-zinc-400">Cargando…</span>
    </div>
  );
}

// ========================
// FEATURES SECTION
// ========================
interface FeatureCardProps {
  title: string;
  desc: string;
  icon: string;
  big?: boolean;
  small?: boolean;
  animClass?: string;
}
function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto py-24 px-4 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <FeatureCard title="Inventario de entradas y salidas" desc="Gestiona todos los movimientos de material de manera eficiente, con registro y seguimiento de cada acción." icon="/features/inventario.png" animClass="animate-feature-in-left" />
        <FeatureCard title="Consulta y solicitudes" desc="Consulta materiales disponibles, solicita recursos y visualiza novedades, fechas y notificaciones." icon="/features/consulta.png" animClass="animate-feature-in-top" />
        <FeatureCard title="Reportes automáticos" desc="Recibe informes automáticos de consumo y disponibilidad para mantener inventarios al día." icon="/features/reportes.png" animClass="animate-feature-in-right" />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <FeatureCard title="Colaboración y permisos avanzados" desc="Crea almacenes, otorga permisos personalizados y trabaja en conjunto con tu equipo o institución." icon="/features/almacen.png" big animClass="animate-feature-in-bottom" />
        </div>
        <div>
          <FeatureCard title="Gestión granular de roles" desc="Define quién puede consultar, editar o administrar inventarios, adaptando la plataforma a tu organización." icon="/features/permisos.png" small animClass="animate-feature-float-delay" />
        </div>
      </div>
    </section>
  );
}
function FeatureCard({ title, desc, icon, big, small, animClass = "" }: FeatureCardProps) {
  return (
    <div className={
      `bg-zinc-900/85 rounded-2xl shadow-xl border border-amber-200/10 flex flex-col items-center p-7
      transition-transform hover:scale-[1.04] hover:shadow-2xl duration-300
      ${big ? 'min-h-[180px] text-base md:text-lg' : ''}
      ${small ? 'min-h-[120px] text-sm md:text-base' : ''}
      ${animClass}
      float-card`
    }>
      <img src={icon} alt={title} className={`mb-3 ${big ? "w-20 h-20" : "w-12 h-12"} drop-shadow`} loading="lazy" />
      <h3 className="font-semibold text-amber-200 mb-1 text-center">{title}</h3>
      <p className="text-zinc-200 text-center">{desc}</p>
    </div>
  );
}

// ========================
// ROADMAP SECTION (línea de tiempo animada)
// ========================
interface RoadmapStep {
  titulo: string;
  texto: string;
  icon: string;
}
function RoadmapSection() {
  const pasos: RoadmapStep[] = [
    { titulo: "Registro", texto: "Crea tu cuenta o únete a una organización", icon: "👤" },
    { titulo: "Configura tus almacenes", texto: "Agrega y personaliza tus almacenes, usuarios y permisos", icon: "🏢" },
    { titulo: "Registra movimientos", texto: "Controla entradas y salidas en tiempo real", icon: "📦" },
    { titulo: "Analiza y mejora", texto: "Obtén reportes automáticos y sugerencias", icon: "📊" },
  ];
  const [activo, setActivo] = useState(2);
  useEffect(() => {
    const id = setInterval(() => setActivo(a => (a + 1) % pasos.length), 2900);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="max-w-5xl mx-auto py-24 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-10 text-center">¿Cómo funciona?</h2>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
        {pasos.map((paso, i) => (
          <div key={paso.titulo} className="flex flex-col items-center relative">
            <div className={clsx(
              "rounded-full flex items-center justify-center shadow-xl border-2 transition-all",
              activo === i ? "bg-amber-400 text-black border-amber-400 scale-110" : "bg-zinc-800 text-amber-200 border-amber-300 scale-100"
            )} style={{ width: 64, height: 64, fontSize: 34 }}>
              <span>{paso.icon}</span>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
              {i < pasos.length - 1 && (
                <div className="w-32 h-2 bg-gradient-to-r from-amber-400 to-amber-300/60 rounded-full animate-pulse md:block hidden"
                  style={{ marginLeft: 32 }}
                />
              )}
            </div>
            <span className={clsx(
              "font-semibold mt-4 text-center",
              activo === i ? "text-amber-400 scale-105" : "text-amber-200"
            )}>{paso.titulo}</span>
            <span className="text-zinc-200 text-sm text-center mt-1 max-w-xs">{paso.texto}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ========================
// TESTIMONIALS SECTION (3D Slider)
// ========================
interface Testimonial {
  nombre: string;
  rol: string;
  img: string;
  texto: string;
}
function TestimonialsSection() {
  const testimonios: Testimonial[] = [
    { nombre: "Ana Sánchez", rol: "Docente", img: "/testimonios/ana.png", texto: "¡Organizar los materiales nunca fue tan fácil y visual! Mis alumnos pueden consultar y pedir lo que necesitan, y yo sé siempre quién usó qué." },
    { nombre: "Ing. López", rol: "Jefe de Almacén", img: "/testimonios/lopez.png", texto: "Integrar HoneyLabs con mis procesos de inventario digital fue inmediato. El reporte automático me ahorra horas cada semana." },
    { nombre: "Luis Torres", rol: "Estudiante", img: "/testimonios/luis.png", texto: "Por fin puedo ver disponibilidad y pedir materiales para prácticas, sin filas y sin perder tiempo." },
  ];
  const [indice, setIndice] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndice(i => (i + 1) % testimonios.length), 4500);
    return () => clearInterval(id);
  }, [testimonios.length]);
  return (
    <section className="max-w-5xl mx-auto py-24 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-8 text-center">Lo que dicen de HoneyLabs</h2>
      <div className="relative flex justify-center items-center h-56">
        {testimonios.map((t, i) => (
          <div key={t.nombre}
            className={clsx(
              "absolute top-0 left-[46%] -translate-x-1/2 flex flex-col items-center transition-all duration-700",
              i === indice ? "opacity-100 scale-105 z-20" :
                Math.abs(i - indice) === 1 ? "opacity-60 scale-95 z-10" : "opacity-0 scale-75 z-0",
              i > indice ? "translate-x-28" : i < indice ? "-translate-x-28" : "translate-x-0"
            )}
            style={{ transition: "all 0.8s cubic-bezier(.18,.89,.32,1.28)", width: "350px" }}
          >
            <img src={t.img} alt={t.nombre} className="w-24 h-24 rounded-full object-cover border-4 border-amber-300 mb-3 shadow-lg" loading="lazy" />
            <div className="bg-zinc-900/85 p-6 rounded-xl shadow-xl border border-amber-100/20 text-zinc-100 text-center font-normal text-lg">
              <p className="mb-2">"{t.texto}"</p>
              <span className="text-amber-200 font-bold">{t.nombre}</span>
              <span className="ml-2 text-sm text-zinc-300">{t.rol}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ========================
// FAQ ACCORDION SECTION
// ========================
interface FAQ { q: string; a: string; }
function FAQSection() {
  const faqs: FAQ[] = [
    { q: "¿Qué puedo hacer si soy estudiante?", a: "Puedes consultar el inventario, hacer solicitudes de materiales y ver tus registros de uso." },
    { q: "¿Puedo exportar mis datos?", a: "Sí, desde tu perfil puedes exportar toda tu información y registros en formato seguro." },
    { q: "¿HoneyLabs es gratuito para escuelas?", a: "¡Sí! La plataforma es de uso gratuito para instituciones educativas registradas." },
    { q: "¿Soportan control por roles?", a: "Sí. Puedes definir permisos granulares para cada usuario, almacén y función." },
  ];
  const [open, setOpen] = useState(-1);
  return (
    <section className="max-w-4xl mx-auto py-24 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-7 text-center">Preguntas frecuentes</h2>
      <div className="rounded-2xl bg-zinc-900/80 border border-amber-300/15 divide-y divide-amber-200/10 shadow-xl">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button className="flex w-full justify-between items-center p-6 text-left focus:outline-none group" onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="text-lg font-medium text-amber-100 group-hover:text-amber-400">{faq.q}</span>
              {open === i ? <ChevronUp className="text-amber-300" /> : <ChevronDown className="text-amber-300" />}
            </button>
            <div className={clsx(
              "overflow-hidden transition-all duration-500 px-6",
              open === i ? "max-h-40 py-3 opacity-100" : "max-h-0 py-0 opacity-0"
            )}>
              <span className="block text-zinc-200 text-base">{faq.a}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ========================
// PARTNERS/ALIADOS SECTION (Acordeón Multimedia)
// ========================
interface Aliado {
  nombre: string;
  img: string;
  url: string;
  desc: string;
  principal?: boolean;
}
function PartnersSection() {
  const aliados: Aliado[] = [
    {
      nombre: "Tecnológico Nacional de México - ITQ",
      img: "/aliados/itq.png",
      url: "https://www.queretaro.tecnm.mx/",
      desc: "Principal aliado institucional, promotor de la digitalización de laboratorios y prácticas profesionales en logística.",
      principal: true,
    },
    {
      nombre: "HoneyLabs Open Community",
      img: "/aliados/comunidad.png",
      url: "https://github.com/honeylabs",
      desc: "Red de desarrolladores y usuarios que contribuyen con ideas, soporte y feedback para la mejora continua.",
    },
    {
      nombre: "Otro Aliado",
      img: "/aliados/aliado-ejemplo.png",
      url: "#",
      desc: "Ejemplo de empresa aliada en digitalización logística.",
    }
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="max-w-5xl mx-auto py-24 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-9 text-center">Colaboradores y aliados</h2>
      <div className="flex flex-col gap-6">
        {aliados.map((a, i) => (
          <div key={a.nombre} className={clsx(
            "rounded-2xl bg-zinc-900/80 border border-amber-300/15 shadow-xl transition-all",
            open === i ? "scale-100 shadow-2xl border-amber-300/30" : "scale-95 opacity-70"
          )}>
            <button className="flex items-center w-full p-5 gap-6 focus:outline-none" onClick={() => setOpen(i)} aria-expanded={open === i}>
              <img src={a.img} alt={a.nombre} className={clsx("rounded-2xl shadow border-2 object-cover transition", a.principal ? "w-24 h-24 border-amber-300" : "w-20 h-20 border-amber-200")} loading="lazy" />
              <div className="flex flex-col items-start">
                <span className={clsx("font-bold text-lg", a.principal ? "text-amber-200" : "text-amber-100")}>{a.nombre}</span>
                <span className="text-zinc-200 text-sm">{a.desc}</span>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-amber-300 mt-2 hover:underline">Visitar sitio</a>
              </div>
              <div className="ml-auto">{open === i ? <ChevronUp className="text-amber-300" /> : <ChevronDown className="text-amber-300" />}</div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ========================
// MAIN PAGE (EXPORT)
// ========================
export default function Page() {
  return (
    <main className="relative min-h-screen w-full font-sans overflow-x-hidden">
      <FondoGIF />
      {/* Overlay suave para contraste (ajusta opacidad si lo ves muy oscuro) */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none z-0 transition-all duration-700" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeroSection />
        <AboutSection />
        <KpiSection />
        <FeaturesSection />
        <RoadmapSection />
        <TestimonialsSection />
        <FAQSection />
        <PartnersSection />
      </div>
    </main>
  );
}
