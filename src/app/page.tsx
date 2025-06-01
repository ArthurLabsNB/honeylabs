'use client';

import { useState, useEffect, ReactNode, useRef } from 'react';
import clsx from 'clsx';

// ============ HERO SECTION =============
function useTypewriter(text: string, speed = 70): string {
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
  const textoTyped = useTypewriter(titulo, 70);
  const [showDesc, setShowDesc] = useState(false);
  useEffect(() => {
    setShowDesc(false);
    if (textoTyped.length === titulo.length) {
      const timer = setTimeout(() => setShowDesc(true), 400);
      return () => clearTimeout(timer);
    }
  }, [textoTyped, titulo.length]);
  return (
    <section className="flex flex-col items-center justify-center min-h-[75vh] py-32 md:py-44 px-4 text-center select-none space-y-8">
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
      <style jsx global>{`
        @keyframes blink { 50% { opacity: 0 } }
        .animate-blink { animation: blink 1.05s steps(1) infinite; }
        .animate-typewriter { overflow: hidden; border-right: .15em solid #ffeb3b; white-space: nowrap; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .animate-fade-in { animation: fadeIn 0.7s ease 0.15s both; }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-48px); } to { opacity: 1; transform: none; } }
        .animate-fade-in-left { animation: fadeInLeft 0.8s cubic-bezier(.36,1.6,.28,1) both; }
        @keyframes pop3D { from { opacity: 0; transform: scale(0.94) rotateY(7deg); } to { opacity: 1; transform: scale(1) rotateY(0deg); } }
        .animate-3dpop { animation: pop3D 1.05s cubic-bezier(.22,.68,0,.17) both; }
      `}</style>
    </section>
  );
}

// ============ ABOUT SECTION =============
function AboutSection() {
  return (
    <section id="acerca" className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14 py-28 md:py-40 px-4">
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

// ============ KPI SECTION =============
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
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 py-24 px-4">
      <KpiCard className="animate-float-card">
        {loading ? <LoaderKPI /> : (
          <>
            <div className="flex gap-7 mb-1">
              <div className="flex flex-col items-center">
                <img src="/features/inventario.png" alt="" className="w-7 h-7 mb-1" />
                <span className="text-2xl font-semibold text-green-300">{entradas.toLocaleString()}</span>
                <span className="text-xs text-zinc-100/70">Entradas</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/features/reportes.png" alt="" className="w-7 h-7 mb-1" />
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
            <img src="/features/consulta.png" alt="" className="w-8 h-8 mb-1" />
            <span className="text-3xl font-bold text-sky-100">{usuarios.toLocaleString()}</span>
            <span className="text-base text-zinc-200/90 mt-1">Usuarios registrados</span>
          </>
        )}
      </KpiCard>
      <KpiCard className="animate-float-card-delaymore">
        {loading ? <LoaderKPI /> : (
          <>
            <img src="/features/almacen.png" alt="" className="w-8 h-8 mb-1" />
            <span className="text-3xl font-bold text-amber-100">{almacenes.toLocaleString()}</span>
            <span className="text-base text-zinc-200/90 mt-1">Almacenes creados</span>
          </>
        )}
      </KpiCard>
      <style jsx global>{`
        .kpi-card { box-shadow: 0 0 8px #000c; border-radius: 18px; }
      `}</style>
    </section>
  );
}
function KpiCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`rounded-2xl bg-zinc-900/85 shadow-xl p-8 border border-amber-400/10 flex flex-col items-center transition-transform hover:scale-105 min-h-[170px] kpi-card ${className}`}>
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

// ============ FEATURES CAROUSEL/ACCORDION ============
interface Feature {
  title: string;
  desc: string;
  icon: string;
  detalle: string;
}
const features: Feature[] = [
  {
    title: "Inventario de entradas y salidas",
    desc: "Registra cada movimiento de materiales.",
    icon: "/features/inventario.png",
    detalle: "Lleva el control histórico de entradas, salidas y transferencias, todo en tiempo real, con trazabilidad completa."
  },
  {
    title: "Consulta y solicitudes",
    desc: "Consulta materiales y haz solicitudes de uso.",
    icon: "/features/consulta.png",
    detalle: "Solicita materiales, visualiza disponibilidad y programa retiros anticipados sin filas ni papeleo."
  },
  {
    title: "Reportes automáticos",
    desc: "Recibe informes visuales automáticos.",
    icon: "/features/reportes.png",
    detalle: "Genera reportes dinámicos de inventario, consumo, stock mínimo, y proyecciones automáticas de abastecimiento."
  },
  {
    title: "Gestión granular de roles",
    desc: "Permisos y roles detallados.",
    icon: "/features/permisos.png",
    detalle: "Configura quién puede consultar, editar, aprobar o administrar materiales y almacenes, por persona o grupo."
  },
  {
    title: "Colaboración avanzada",
    desc: "Flujos multiusuario y trabajo en equipo.",
    icon: "/features/almacen.png",
    detalle: "Comparte tareas, delega, recibe notificaciones y aprovisiona recursos colaborando con todos los roles."
  },
  {
    title: "Alertas inteligentes",
    desc: "Recibe notificaciones automáticas.",
    icon: "/features/alerta.png",
    detalle: "Notifica por correo y en dashboard cuando hay faltantes, caducidades próximas, o solicitudes urgentes."
  },
  {
    title: "Bitácora digital",
    desc: "Seguimiento total de operaciones.",
    icon: "/features/bitacora.png",
    detalle: "Toda acción es registrada con fecha, usuario y detalle, generando un historial auditable para seguridad total."
  },
  {
    title: "Exportación de datos",
    desc: "Descarga información en Excel o PDF.",
    icon: "/features/exportar.png",
    detalle: "Exporta inventarios, movimientos y reportes en formatos profesionales para compartir o respaldar."
  },
  {
    title: "Integración con IA",
    desc: "Automatiza predicciones y tareas repetitivas.",
    icon: "/features/ia.png",
    detalle: "La IA sugiere pedidos, detecta anomalías y ayuda a optimizar inventarios reduciendo errores humanos."
  },
  {
    title: "Acceso móvil y offline",
    desc: "Gestiona desde cualquier dispositivo.",
    icon: "/features/mobile.png",
    detalle: "Consulta y gestiona tu inventario desde el móvil, con funciones offline para zonas sin Internet."
  },
];

function FeaturesCarouselSection() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  // Centrado automático al cambiar de tarjeta
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const child = el.children[active] as HTMLElement;
      child?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [active]);
  // Swipe (touch) horizontal
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0, scrollLeft = 0, isDown = false;
    const start = (e: any) => {
      isDown = true;
      startX = e.touches ? e.touches[0].pageX : e.pageX;
      scrollLeft = el.scrollLeft;
    };
    const move = (e: any) => {
      if (!isDown) return;
      const x = e.touches ? e.touches[0].pageX : e.pageX;
      el.scrollLeft = scrollLeft - (x - startX);
    };
    const end = () => { isDown = false; };
    el.addEventListener('mousedown', start); el.addEventListener('touchstart', start);
    el.addEventListener('mousemove', move); el.addEventListener('touchmove', move);
    el.addEventListener('mouseup', end); el.addEventListener('touchend', end);
    el.addEventListener('mouseleave', end);
    return () => {
      el.removeEventListener('mousedown', start); el.removeEventListener('touchstart', start);
      el.removeEventListener('mousemove', move); el.removeEventListener('touchmove', move);
      el.removeEventListener('mouseup', end); el.removeEventListener('touchend', end);
      el.removeEventListener('mouseleave', end);
    };
  }, []);
  return (
    <section className="max-w-7xl mx-auto py-32 px-4 space-y-16 relative">
      <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-14 text-center">Funciones principales</h2>
      <div className="flex justify-center items-center mb-8 gap-3">
        <button
          onClick={() => setActive(a => Math.max(0, a - 1))}
          className="arrow-btn"
          disabled={active === 0}
          aria-label="Anterior"
        >‹</button>
        <button
          onClick={() => setActive(a => Math.min(features.length - 1, a + 1))}
          className="arrow-btn"
          disabled={active === features.length - 1}
          aria-label="Siguiente"
        >›</button>
      </div>
      <div
        ref={containerRef}
        className="carousel-acordeon flex gap-10 overflow-x-auto px-1 pb-12 snap-x snap-mandatory justify-center"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          minHeight: 400,
        }}
      >
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            tabIndex={0}
            className={clsx(
              "feature-card-acordeon snap-center flex flex-col items-center transition-all duration-500 cursor-pointer relative",
              active === idx
                ? "active shadow-glow scale-110 z-30"
                : Math.abs(active - idx) === 1
                ? "neighbor scale-95 opacity-90 z-10"
                : "inactive scale-90 opacity-60 z-0"
            )}
            style={{
              minWidth: 330,
              maxWidth: 350,
              height: active === idx ? 410 : 320,
              marginTop: active === idx ? 0 : 35,
              marginBottom: active === idx ? 0 : 40,
              background: "linear-gradient(120deg, #181325f7 60%, #ffe06619 100%)",
              border: active === idx ? "2.4px solid #ffe066cc" : "1.5px solid #ffe06640",
              boxShadow: active === idx
                ? "0 0 40px 8px #ffe06655, 0 10px 28px #111a"
                : "0 1px 12px #0007",
              outline: active === idx ? "2px solid #fff2" : "none",
            }}
            onClick={() => setActive(idx)}
            onFocus={() => setActive(idx)}
          >
            <img src={feature.icon} alt={feature.title} className="mb-2 w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl mt-5" loading="lazy" />
            <h3 className="font-semibold text-amber-200 mb-1 text-center text-lg md:text-xl px-2">{feature.title}</h3>
            <p className="text-zinc-200 text-center text-base mb-2 px-3">{feature.desc}</p>
            {active === idx && (
              <div className="expanded-detail text-amber-100 text-base px-6 pb-6 pt-3 w-full animate-fade-in font-medium">
                {feature.detalle}
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx global>{`
        .carousel-acordeon::-webkit-scrollbar { display: none; }
        .arrow-btn {
          background: linear-gradient(120deg, #ffe066bb 20%, #ffdb66 90%);
          color: #181325;
          font-size: 2.1rem;
          width: 2.8rem;
          height: 2.8rem;
          border-radius: 50%;
          box-shadow: 0 2px 12px #18132566;
          border: 0;
          display: flex; align-items: center; justify-content: center;
          font-weight: bold;
          cursor: pointer;
          transition: transform .15s, background .22s;
        }
        .arrow-btn:disabled { opacity: .4; cursor: not-allowed; }
        .feature-card-acordeon {
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 2px 16px #181325a8;
          transition: all .5s cubic-bezier(.43,1.53,.56,1.04);
          cursor: pointer;
        }
        .feature-card-acordeon.active {
          background: linear-gradient(120deg, #1e1a2cf5 80%, #ffe0661b 100%);
          box-shadow: 0 0 45px 8px #ffe06666, 0 14px 36px #111c;
          outline: 2.5px solid #ffe06644;
          z-index: 50;
        }
        .feature-card-acordeon.inactive {
          opacity: .65;
        }
        .feature-card-acordeon .expanded-detail {
          border-top: 1.5px solid #ffe0662c;
          margin-top: 8px;
          font-size: 1.09rem;
          background: rgba(30,20,48,.55);
          border-radius: 0 0 22px 22px;
          box-shadow: 0 0 32px #ffe06611;
        }
        .shadow-glow {
          box-shadow: 0 0 45px 0px #ffe06688, 0 7px 24px #181325cc !important;
        }
      `}</style>
    </section>
  );
}

// ============ MAIN PAGE EXPORT ============
export default function Page() {
  return (
    <main className="relative min-h-screen w-full font-sans overflow-x-hidden bg-[#181325]">
      <HeroSection />
      <AboutSection />
      <KpiSection />
      <FeaturesCarouselSection />
    </main>
  );
}
