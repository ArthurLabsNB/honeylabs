'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { ArrowDownCircle, ArrowUpCircle, Users, Warehouse } from 'lucide-react';

// ================== CONFIG ===================
const GIF_BG = '/background.gif';

// ============ HOOKS PROFESIONALES ============

// Máquina de escribir
function useTypewriter(text: string, speed: number = 36) {
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

// Conteo animado para KPI
function useCountUp(to: number, duration: number = 1100) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    let raf: any;
    let startTime: number;
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

// ================== HERO SECTION ===================

function HeroSection() {
  const titulo = 'Gestión de materiales eficiente';
  const descripcion =
    'Nuestra plataforma permite gestionar, registrar y visualizar materiales en almacenes, adaptándose a cada tipo de usuario. Accede desde cualquier lugar, con dashboards personalizados para un control completo y fácil.';
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
    <section
      className="flex flex-col items-center justify-center min-h-[70vh] py-28 md:py-36 px-4 text-center select-none space-y-8"
      style={{ letterSpacing: '0.02em' }}
    >
      <h1
        className={clsx(
          'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-amber-200',
          'drop-shadow-xl',
          'transition-all',
          'animate-typewriter'
        )}
        style={{
          whiteSpace: 'pre-line',
          fontFamily: `'Nunito', 'Inter', 'Segoe UI', Arial, sans-serif`,
        }}
      >
        {textoTyped}
        <span className="ml-1 animate-blink text-amber-300">|</span>
      </h1>
      <div
        className={clsx(
          'max-w-xl text-base md:text-lg text-zinc-200 font-normal transition-opacity duration-600',
          showDesc ? 'opacity-100 animate-fade-in' : 'opacity-0'
        )}
      >
        {showDesc && descripcion}
      </div>
    </section>
  );
}

// ================== ABOUT SECTION ===================

function AboutSection() {
  return (
    <section
      className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 py-24 md:py-32 px-4 space-y-12 md:space-y-0"
      id="acerca"
    >
      {/* Texto izquierda */}
      <div className="flex-1 flex flex-col justify-center md:items-start items-center text-center md:text-left animate-fade-in-left">
        <h2 className="text-2xl md:text-3xl font-semibold text-amber-300 mb-4 tracking-tight">
          Acerca de HoneyLabs
        </h2>
        <p className="text-zinc-200 mb-6 max-w-md text-base md:text-lg font-normal">
          HoneyLabs es la solución moderna para la gestión logística y digitalización de inventarios en laboratorios, empresas e instituciones. Optimiza el registro, la organización y la consulta de materiales, facilitando procesos y colaboración en cualquier entorno.
        </p>
        <a
          href="/acerca"
          className="inline-block bg-amber-400 hover:bg-amber-500 text-black font-medium px-6 py-2 rounded-lg shadow transition animate-ripple"
        >
          Saber más
        </a>
      </div>
      {/* Imagen derecha con animación 3D */}
      <div className="flex-1 flex justify-center items-center animate-3dpop">
        <div className="relative group transition-transform duration-700 will-change-transform"
          tabIndex={0}
          style={{
            perspective: '1000px',
            outline: 'none'
          }}
        >
          <img
            src="/ilustracion-almacen-3d.png"
            alt="Ilustración Almacén"
            className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl border-2 border-amber-100 group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-3xl transition-transform duration-500"
            draggable={false}
            style={{
              transition: 'transform 0.5s cubic-bezier(.19,1,.22,1), box-shadow 0.4s',
              willChange: 'transform',
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ================== KPI SECTION ===================

function KpiSection() {
  const [data, setData] = useState<{ entradas: number; salidas: number; usuarios: number; almacenes: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/metrics')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  // Usa hook de conteo solo si hay datos y no está loading
  const entradas = useCountUp(data?.entradas ?? 0, 900);
  const salidas = useCountUp(data?.salidas ?? 0, 900);
  const usuarios = useCountUp(data?.usuarios ?? 0, 800);
  const almacenes = useCountUp(data?.almacenes ?? 0, 800);

  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 py-20 px-4 space-y-8 md:space-y-0">
      {/* Movimientos */}
      <KpiCard className="animate-float-card">
        {loading ? (
          <LoaderKPI />
        ) : (
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
      {/* Usuarios */}
      <KpiCard className="animate-float-card-delayed">
        {loading ? (
          <LoaderKPI />
        ) : (
          <>
            <Users className="h-7 w-7 text-sky-400 mb-1" />
            <span className="text-3xl font-bold text-sky-100">{usuarios.toLocaleString()}</span>
            <span className="text-base text-zinc-200/90 mt-1">Usuarios registrados</span>
          </>
        )}
      </KpiCard>
      {/* Almacenes */}
      <KpiCard className="animate-float-card-delaymore">
        {loading ? (
          <LoaderKPI />
        ) : (
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

function KpiCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-zinc-900/85 shadow-xl p-8 border border-amber-400/10 flex flex-col items-center
        transition-transform hover:scale-105
        min-h-[170px] ${className}`}
    >
      {children}
    </div>
  );
}

// Loader animado profesional para KPI
function LoaderKPI() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-[80px]">
      <span className="inline-block h-7 w-7 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></span>
      <span className="text-xs text-zinc-400">Cargando…</span>
    </div>
  );
}

// ================== FEATURES SECTION ===================

function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto py-24 px-4 space-y-10">
      {/* Primera fila: 3 tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <FeatureCard
          title="Inventario de entradas y salidas"
          desc="Gestiona todos los movimientos de material de manera eficiente, con registro y seguimiento de cada acción."
          icon="/features/inventario.png"
          animClass="animate-feature-in-left"
        />
        <FeatureCard
          title="Consulta y solicitudes"
          desc="Consulta materiales disponibles, solicita recursos y visualiza novedades, fechas y notificaciones."
          icon="/features/consulta.png"
          animClass="animate-feature-in-top"
        />
        <FeatureCard
          title="Reportes automáticos"
          desc="Recibe informes automáticos de consumo y disponibilidad para mantener inventarios al día."
          icon="/features/reportes.png"
          animClass="animate-feature-in-right"
        />
      </div>
      {/* Segunda fila: tarjeta grande + pequeña */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <FeatureCard
            title="Colaboración y permisos avanzados"
            desc="Crea almacenes, otorga permisos personalizados y trabaja en conjunto con tu equipo o institución."
            icon="/features/almacen.png"
            big
            animClass="animate-feature-in-bottom"
          />
        </div>
        <div>
          <FeatureCard
            title="Gestión granular de roles"
            desc="Define quién puede consultar, editar o administrar inventarios, adaptando la plataforma a tu organización."
            icon="/features/permisos.png"
            small
            animClass="animate-feature-float-delay"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, desc, icon, big, small, animClass = "" }: any) {
  return (
    <div className={
      `bg-zinc-900/85 rounded-2xl shadow-xl border border-amber-200/10 flex flex-col items-center p-7
      transition-transform hover:scale-[1.04] hover:shadow-2xl duration-300
      ${big ? 'min-h-[180px] text-base md:text-lg' : ''}
      ${small ? 'min-h-[120px] text-sm md:text-base' : ''}
      ${animClass}
      float-card`
    }>
      <img src={icon} alt={title} className={`mb-3 ${big ? "w-20 h-20" : "w-12 h-12"} drop-shadow`} />
      <h3 className="font-semibold text-amber-200 mb-1 text-center">{title}</h3>
      <p className="text-zinc-200 text-center">{desc}</p>
    </div>
  );
}

// ================== PÁGINA PRINCIPAL ===================

export default function Page() {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden font-sans"
      style={{
        background: `url('${GIF_BG}') center center / cover no-repeat fixed`,
      }}
    >
      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeroSection />
        <AboutSection />
        <KpiSection />
        <FeaturesSection />
        {/* Aquí podrías seguir con más secciones */}
      </div>
    </main>
  );
}

/* 
======= ANIMACIONES SUGERIDAS (Agrega a tu CSS global o tailwind.config) =======

@keyframes blink { 50% { opacity: 0 } }
.animate-blink { animation: blink 1.05s steps(1) infinite; }

@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
.animate-fade-in { animation: fadeIn 0.7s ease 0.1s both; }

.animate-typewriter {
  overflow: hidden;
  border-right: .15em solid #ffeb3b;
  white-space: nowrap;
}

@keyframes fadeInLeft { from { opacity: 0; transform: translateX(-48px); } to { opacity: 1; transform: none; } }
.animate-fade-in-left { animation: fadeInLeft 0.8s cubic-bezier(.36,1.6,.28,1) both; }

@keyframes pop3D { from { opacity: 0; transform: scale(0.94) rotateY(7deg); } to { opacity: 1; transform: scale(1) rotateY(0deg); } }
.animate-3dpop { animation: pop3D 1.1s cubic-bezier(.22,.68,0,1.71) both; }

@keyframes ripple { 0% { box-shadow: 0 0 0 0 #ffe06666; } 70% { box-shadow: 0 0 0 8px #ffe06622; } 100% { box-shadow: 0 0 0 0 #ffe06600; } }
.animate-ripple:active { animation: ripple .6s; }

@keyframes floatCard { 0% { transform: translateY(0px) } 50% { transform: translateY(-10px) } 100% { transform: translateY(0px) } }
.animate-float-card { animation: floatCard 2.8s ease-in-out infinite; }
.animate-float-card-delayed { animation: floatCard 2.8s 0.33s ease-in-out infinite; }
.animate-float-card-delaymore { animation: floatCard 2.8s 0.7s ease-in-out infinite; }

@keyframes featureInLeft { from { opacity: 0; transform: translateX(-64px) scale(.97); } to { opacity: 1; transform: none; } }
.animate-feature-in-left { animation: featureInLeft 0.9s cubic-bezier(.36,1.6,.28,1) both; }

@keyframes featureInRight { from { opacity: 0; transform: translateX(64px) scale(.97); } to { opacity: 1; transform: none; } }
.animate-feature-in-right { animation: featureInRight 0.9s cubic-bezier(.36,1.6,.28,1) both; }

@keyframes featureInTop { from { opacity: 0; transform: translateY(-40px) scale(.97); } to { opacity: 1; transform: none; } }
.animate-feature-in-top { animation: featureInTop 0.95s cubic-bezier(.36,1.6,.28,1) both; }

@keyframes featureInBottom { from { opacity: 0; transform: translateY(40px) scale(.97); } to { opacity: 1; transform: none; } }
.animate-feature-in-bottom { animation: featureInBottom 1s cubic-bezier(.36,1.6,.28,1) both; }

@keyframes featureFloat { 0% { transform: translateY(0px) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0px) } }
.animate-feature-float-delay { animation: featureFloat 3s 0.4s ease-in-out infinite; }

.float-card { will-change: transform; }
*/

