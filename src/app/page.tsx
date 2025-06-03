"use client";

import { useState, useEffect, ReactNode, useRef } from "react";
import clsx from "clsx";

// ========================
// HERO SECTION
// ========================
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
  const titulo = "Gestión de materiales eficiente";
  const descripcion =
    "Gestiona, registra y visualiza materiales en almacenes, adaptándose a cada tipo de usuario. Accede desde cualquier lugar con dashboards personalizados para un control completo y fácil.";
  const textoTyped = useTypewriter(titulo, 60);
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
      className="flex flex-col items-center justify-center min-h-[75vh] py-32 md:py-44 px-4 text-center select-none space-y-8"
      data-oid="yjzc8z2"
    >
      <h1
        className={clsx(
          "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-amber-200 drop-shadow-xl transition-all animate-typewriter",
        )}
        style={{ fontFamily: `'Nunito', 'Inter', Arial, sans-serif` }}
        data-oid="4t98fx2"
      >
        {textoTyped}
        <span className="ml-1 animate-blink text-amber-300" data-oid="w:jorlo">
          |
        </span>
      </h1>
      <div
        className={clsx(
          "max-w-2xl text-lg md:text-xl text-zinc-200 font-normal transition-opacity duration-600",
          showDesc ? "opacity-100 animate-fade-in" : "opacity-0",
        )}
        data-oid="q5hw8wk"
      >
        {showDesc && descripcion}
      </div>
      <a
        href="#acerca"
        className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-8 py-3 rounded-lg shadow-lg mt-3 animate-ripple transition focus:outline-none focus:ring-2 focus:ring-amber-200"
        aria-label="Explorar HoneyLabs"
        data-oid="y5r2:dk"
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
    <section
      id="acerca"
      className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14 py-28 md:py-40 px-4"
      data-oid="q.l:s7e"
    >
      <div
        className="flex-1 flex flex-col justify-center md:items-start items-center text-center md:text-left animate-fade-in-left"
        data-oid="npa2g:f"
      >
        <h2
          className="text-3xl md:text-4xl font-semibold text-amber-300 mb-4 tracking-tight"
          data-oid="q_p6s:2"
        >
          Acerca de HoneyLabs
        </h2>
        <p
          className="text-zinc-200 mb-6 max-w-lg text-lg md:text-xl font-normal"
          data-oid="nmnrq3z"
        >
          HoneyLabs es la solución moderna para la gestión logística y
          digitalización de inventarios en laboratorios, empresas e
          instituciones. Optimiza el registro, la organización y la consulta de
          materiales, facilitando procesos y colaboración en cualquier entorno.
        </p>
        <a
          href="/acerca"
          className="inline-block bg-amber-400 hover:bg-amber-500 text-black font-medium px-6 py-2 rounded-lg shadow transition animate-ripple"
          aria-label="Saber más sobre HoneyLabs"
          data-oid="2kcp_qv"
        >
          Saber más
        </a>
      </div>
      <div
        className="flex-1 flex justify-center items-center animate-3dpop"
        data-oid="p5wgw:o"
      >
        <div
          className="relative group transition-transform duration-700 will-change-transform"
          tabIndex={0}
          style={{ perspective: "1000px", outline: "none" }}
          data-oid="iheq1uh"
        >
          <img
            src="/ilustracion-almacen-3d.png"
            alt="Ilustración Almacén"
            className="w-80 h-80 md:w-[26rem] md:h-[26rem] object-cover rounded-2xl shadow-2xl border-2 border-amber-100 group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-3xl transition-transform duration-500"
            draggable={false}
            loading="lazy"
            data-oid=":2rd1dr"
          />
        </div>
      </div>
    </section>
  );
}

// ========================
// KPI SECTION
// ========================
type Metrics = {
  entradas: number;
  salidas: number;
  usuarios: number;
  almacenes: number;
};

function useCountUp(to: number, duration = 1100): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0,
      raf: number,
      startTime: number;
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
    fetch("/api/metrics")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() =>
        setData({ entradas: 0, salidas: 0, usuarios: 0, almacenes: 0 }),
      )
      .finally(() => setLoading(false));
  }, []);

  const entradas = useCountUp(data?.entradas ?? 0, 900);
  const salidas = useCountUp(data?.salidas ?? 0, 900);
  const usuarios = useCountUp(data?.usuarios ?? 0, 800);
  const almacenes = useCountUp(data?.almacenes ?? 0, 800);

  return (
    <section
      className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 py-24 px-4"
      data-oid="rf5babj"
    >
      <KpiCard className="animate-float-card" data-oid="qk3y.ky">
        {loading ? (
          <LoaderKPI data-oid="fnwc6o4" />
        ) : (
          <>
            <div className="flex gap-7 mb-1" data-oid="ymwqy7p">
              <div className="flex flex-col items-center" data-oid="4gtmxq6">
                <span
                  className="inline-block h-6 w-6 rounded-full bg-green-400/40 flex items-center justify-center"
                  data-oid="og:-jr6"
                >
                  <span className="text-green-500" data-oid="dx2eee:">
                    ↓
                  </span>
                </span>
                <span
                  className="text-2xl font-semibold text-green-300"
                  data-oid="7mqhhlh"
                >
                  {entradas.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-100/70" data-oid="od2zij8">
                  Entradas
                </span>
              </div>
              <div className="flex flex-col items-center" data-oid="kx.qp0w">
                <span
                  className="inline-block h-6 w-6 rounded-full bg-rose-400/40 flex items-center justify-center"
                  data-oid="m86s-_0"
                >
                  <span className="text-rose-400" data-oid="odenynm">
                    ↑
                  </span>
                </span>
                <span
                  className="text-2xl font-semibold text-rose-300"
                  data-oid="b1lf8yf"
                >
                  {salidas.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-100/70" data-oid="0l7uw8c">
                  Salidas
                </span>
              </div>
            </div>
            <span className="text-sm text-zinc-400" data-oid=".ryolig">
              Movimientos registrados
            </span>
          </>
        )}
      </KpiCard>
      <KpiCard className="animate-float-card-delayed" data-oid="ed-qz31">
        {loading ? (
          <LoaderKPI data-oid="mcdvisn" />
        ) : (
          <>
            <span
              className="inline-block h-7 w-7 bg-sky-400/40 rounded-full mb-1"
              data-oid="zhfmehx"
            />
            <span
              className="text-3xl font-bold text-sky-100"
              data-oid="3r_ayp8"
            >
              {usuarios.toLocaleString()}
            </span>
            <span
              className="text-base text-zinc-200/90 mt-1"
              data-oid="53wvbzi"
            >
              Usuarios registrados
            </span>
          </>
        )}
      </KpiCard>
      <KpiCard className="animate-float-card-delaymore" data-oid="qq-p4z4">
        {loading ? (
          <LoaderKPI data-oid="dkq-ma_" />
        ) : (
          <>
            <span
              className="inline-block h-7 w-7 bg-amber-400/50 rounded-full mb-1"
              data-oid="pze4bun"
            />
            <span
              className="text-3xl font-bold text-amber-100"
              data-oid="_-x:v40"
            >
              {almacenes.toLocaleString()}
            </span>
            <span
              className="text-base text-zinc-200/90 mt-1"
              data-oid="rlfsin1"
            >
              Almacenes creados
            </span>
          </>
        )}
      </KpiCard>
    </section>
  );
}
function KpiCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-zinc-900/85 shadow-xl p-8 border border-amber-400/10 flex flex-col items-center transition-transform hover:scale-105 min-h-[170px] ${className}`}
      data-oid="z8c7klf"
    >
      {children}
    </div>
  );
}
function LoaderKPI() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 min-h-[80px]"
      data-oid="nvs-m3j"
    >
      <span
        className="inline-block h-7 w-7 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"
        data-oid="j7::t:g"
      ></span>
      <span className="text-xs text-zinc-400" data-oid="m660sem">
        Cargando…
      </span>
    </div>
  );
}

// ========================
// FEATURES/ACCORDION CAROUSEL SECTION
// ========================
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
    detalle:
      "Lleva el control histórico de entradas, salidas y transferencias, todo en tiempo real, con trazabilidad completa.",
  },
  {
    title: "Consulta y solicitudes",
    desc: "Consulta materiales y haz solicitudes de uso.",
    icon: "/features/consulta.png",
    detalle:
      "Solicita materiales, visualiza disponibilidad y programa retiros anticipados sin filas ni papeleo.",
  },
  {
    title: "Reportes automáticos",
    desc: "Recibe informes visuales automáticos.",
    icon: "/features/reportes.png",
    detalle:
      "Genera reportes dinámicos de inventario, consumo, stock mínimo, y proyecciones automáticas de abastecimiento.",
  },
  {
    title: "Gestión granular de roles",
    desc: "Permisos y roles detallados.",
    icon: "/features/permisos.png",
    detalle:
      "Configura quién puede consultar, editar, aprobar o administrar materiales y almacenes, por persona o grupo.",
  },
  {
    title: "Colaboración avanzada",
    desc: "Flujos multiusuario y trabajo en equipo.",
    icon: "/features/almacen.png",
    detalle:
      "Comparte tareas, delega, recibe notificaciones y aprovisiona recursos colaborando con todos los roles.",
  },
  {
    title: "Alertas inteligentes",
    desc: "Recibe notificaciones automáticas.",
    icon: "/features/alerta.png",
    detalle:
      "Notifica por correo y en dashboard cuando hay faltantes, caducidades próximas, o solicitudes urgentes.",
  },
  {
    title: "Bitácora digital",
    desc: "Seguimiento total de operaciones.",
    icon: "/features/bitacora.png",
    detalle:
      "Toda acción es registrada con fecha, usuario y detalle, generando un historial auditable para seguridad total.",
  },
  {
    title: "Exportación de datos",
    desc: "Descarga información en Excel o PDF.",
    icon: "/features/exportar.png",
    detalle:
      "Exporta inventarios, movimientos y reportes en formatos profesionales para compartir o respaldar.",
  },
  {
    title: "Integración con IA",
    desc: "Automatiza predicciones y tareas repetitivas.",
    icon: "/features/ia.png",
    detalle:
      "La IA sugiere pedidos, detecta anomalías y ayuda a optimizar inventarios reduciendo errores humanos.",
  },
  {
    title: "Acceso móvil y offline",
    desc: "Gestiona desde cualquier dispositivo.",
    icon: "/features/mobile.png",
    detalle:
      "Consulta y gestiona tu inventario desde el móvil, con funciones offline para zonas sin Internet.",
  },
];

function FeaturesCarouselSection() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  // Swipe para mobile
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0,
      scrollLeft = 0,
      isDown = false;
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
    const end = () => {
      isDown = false;
    };
    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start);
    el.addEventListener("mousemove", move);
    el.addEventListener("touchmove", move);
    el.addEventListener("mouseup", end);
    el.addEventListener("touchend", end);
    el.addEventListener("mouseleave", end);
    return () => {
      el.removeEventListener("mousedown", start);
      el.removeEventListener("touchstart", start);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("mouseup", end);
      el.removeEventListener("touchend", end);
      el.removeEventListener("mouseleave", end);
    };
  }, []);
  // Flechas
  function scrollTo(idx: number) {
    setActive(idx);
    const el = containerRef.current;
    if (el) {
      const child = el.children[idx] as HTMLElement;
      child?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }
  return (
    <section
      className="max-w-7xl mx-auto py-32 px-4 space-y-16 relative"
      data-oid="3zublb8"
    >
      <h2
        className="text-3xl md:text-4xl font-bold text-amber-300 mb-14 text-center"
        data-oid="b0weglh"
      >
        Funciones principales
      </h2>
      {/* Flechas */}
      <button
        onClick={() => scrollTo(Math.max(0, active - 1))}
        className="hidden md:flex absolute left-1 z-10 top-1/2 -translate-y-1/2 bg-amber-300/70 text-zinc-900 rounded-full w-12 h-12 shadow-lg border-4 border-amber-300/50 items-center justify-center hover:scale-110 transition disabled:opacity-50"
        disabled={active === 0}
        aria-label="Anterior"
        data-oid="3jgh1al"
      >
        ‹
      </button>
      <button
        onClick={() => scrollTo(Math.min(features.length - 1, active + 1))}
        className="hidden md:flex absolute right-1 z-10 top-1/2 -translate-y-1/2 bg-amber-300/70 text-zinc-900 rounded-full w-12 h-12 shadow-lg border-4 border-amber-300/50 items-center justify-center hover:scale-110 transition disabled:opacity-50"
        disabled={active === features.length - 1}
        aria-label="Siguiente"
        data-oid="2ic4:u0"
      >
        ›
      </button>
      {/* Carrusel */}
      <div
        ref={containerRef}
        className="carousel-acordeon flex gap-8 overflow-x-auto px-4 py-8 pb-12 snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        data-oid="4w0j.:_"
      >
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            tabIndex={0}
            className={clsx(
              "feature-card-acordeon snap-center flex flex-col items-center transition-all duration-700 cursor-pointer relative",
              active === idx
                ? "active shadow-2xl scale-110 z-30"
                : Math.abs(active - idx) === 1
                  ? "neighbor scale-95 opacity-85 z-20"
                  : "inactive scale-90 opacity-60 z-0",
            )}
            style={{
              minWidth: 320,
              maxWidth: 340,
              height: active === idx ? 410 : 320,
              marginTop: active === idx ? 0 : 40,
              marginBottom: active === idx ? 0 : 60,
              background:
                "linear-gradient(120deg, #181325f8 60%, #ffe06622 100%)",
              boxShadow:
                active === idx
                  ? "0 0 32px #ffe06655,0 6px 28px #111"
                  : undefined,
            }}
            onClick={() => scrollTo(idx)}
            onFocus={() => scrollTo(idx)}
            data-oid="5p6105e"
          >
            <img
              src={feature.icon}
              alt={feature.title}
              className="mb-2 w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl mt-5"
              loading="lazy"
              data-oid="rmx0tce"
            />
            <h3
              className="font-semibold text-amber-200 mb-1 text-center text-lg md:text-xl px-2"
              data-oid="s0x51k6"
            >
              {feature.title}
            </h3>
            <p
              className="text-zinc-200 text-center text-base mb-2 px-3"
              data-oid="01nwlm4"
            >
              {feature.desc}
            </p>
            {active === idx && (
              <div
                className="expanded-detail text-amber-100 text-base px-6 pb-6 pt-3 w-full animate-fade-in"
                data-oid="rwp-:ai"
              >
                <div
                  className="font-bold text-lg mb-1 text-amber-200"
                  data-oid=":s:1uk1"
                >
                  {feature.title}
                </div>
                {feature.detalle}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Indicadores puntos */}
      <div className="flex justify-center gap-2 mt-2" data-oid="xhes5.5">
        {features.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            aria-label={`Ir a la tarjeta ${idx + 1}`}
            className={clsx(
              "inline-block w-3 h-3 rounded-full mx-1 border border-amber-400 transition",
              active === idx
                ? "bg-amber-400 shadow-md"
                : "bg-zinc-700 hover:bg-amber-300",
            )}
            data-oid="t71e8.2"
          />
        ))}
      </div>
      {/* CSS en línea para el carrusel y animaciones */}
      <style jsx global data-oid="jg5aasc">{`
        .carousel-acordeon::-webkit-scrollbar {
          display: none;
        }
        .feature-card-acordeon {
          border-radius: 1.7rem;
          border: 1.5px solid #ffe06625;
          box-shadow: 0 2px 14px #ffe06611;
          background: linear-gradient(120deg, #181325f8 60%, #ffe06622 100%);
          min-height: 320px;
          max-height: 420px;
          user-select: none;
        }
        .feature-card-acordeon.active {
          box-shadow:
            0 0 32px #ffe06655,
            0 8px 48px #151425bb;
          border: 2.5px solid #ffe06699;
        }
        .feature-card-acordeon.neighbor {
          border: 2px solid #ffe06633;
        }
        .feature-card-acordeon.inactive {
          filter: blur(0.5px) grayscale(0.18);
        }
        .feature-card-acordeon:focus-visible {
          outline: 3px solid #ffe06699;
        }
        .expanded-detail {
          border-radius: 1.25rem;
          margin-top: 1.1rem;
          background: linear-gradient(120deg, #ffe06628 10%, #181325f8 80%);
          box-shadow: 0 2px 14px #ffe06618;
        }
        /* Animaciones adicionales */
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1.05s steps(1) infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.33, 1, 0.68, 1) both;
        }
        .animate-typewriter {
          overflow: hidden;
          border-right: 0.15em solid #ffeb3b;
          white-space: nowrap;
          animation: blink-cursor 1s steps(1) infinite;
        }
        @keyframes blink-cursor {
          0%,
          100% {
            border-color: #ffeb3b;
          }
          50% {
            border-color: transparent;
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-48px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in-left {
          animation: fadeInLeft 0.9s cubic-bezier(0.36, 1.6, 0.28, 1) both;
        }
        @keyframes pop3D {
          from {
            opacity: 0;
            transform: scale(0.94) rotateY(7deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }
        .animate-3dpop {
          animation: pop3D 1.1s cubic-bezier(0.22, 0.68, 0, 1.71) both;
        }
        @keyframes ripple {
          0% {
            box-shadow: 0 0 0 0 #ffe06666;
          }
          70% {
            box-shadow: 0 0 0 8px #ffe06622;
          }
          100% {
            box-shadow: 0 0 0 0 #ffe06600;
          }
        }
        .animate-ripple:active {
          animation: ripple 0.6s;
        }
        @keyframes floatCard {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float-card {
          animation: floatCard 2.8s ease-in-out infinite;
        }
        .animate-float-card-delayed {
          animation: floatCard 2.8s 0.33s ease-in-out infinite;
        }
        .animate-float-card-delaymore {
          animation: floatCard 2.8s 0.7s ease-in-out infinite;
        }
        .float-card {
          will-change: transform;
        }
      `}</style>
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
    },
  ];

  const [open, setOpen] = useState(0);
  return (
    <section className="max-w-5xl mx-auto py-36 px-4" data-oid="328.9e5">
      <h2
        className="text-2xl md:text-3xl font-bold text-amber-300 mb-9 text-center"
        data-oid="df0zi4q"
      >
        Colaboradores y aliados
      </h2>
      <div className="flex flex-col gap-6" data-oid="8mq8pdv">
        {aliados.map((a, i) => (
          <div
            key={a.nombre}
            className={clsx(
              "rounded-2xl bg-zinc-900/80 border border-amber-300/15 shadow-xl transition-all",
              open === i
                ? "scale-100 shadow-2xl border-amber-300/30"
                : "scale-95 opacity-70",
            )}
            data-oid="kuh4w6p"
          >
            <button
              className="flex items-center w-full p-5 gap-6 focus:outline-none"
              onClick={() => setOpen(i)}
              aria-expanded={open === i}
              data-oid="6_g3fi0"
            >
              <img
                src={a.img}
                alt={a.nombre}
                className={clsx(
                  "rounded-2xl shadow border-2 object-cover transition",
                  a.principal
                    ? "w-24 h-24 border-amber-300"
                    : "w-20 h-20 border-amber-200",
                )}
                loading="lazy"
                data-oid="287rloi"
              />
              <div className="flex flex-col items-start" data-oid="txxoc3s">
                <span
                  className={clsx(
                    "font-bold text-lg",
                    a.principal ? "text-amber-200" : "text-amber-100",
                  )}
                  data-oid="4h4_yje"
                >
                  {a.nombre}
                </span>
                <span className="text-zinc-200 text-sm" data-oid="b8diyu3">
                  {a.desc}
                </span>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 mt-2 hover:underline"
                  data-oid="ugk9g--"
                >
                  Visitar sitio
                </a>
              </div>
              <div className="ml-auto" data-oid="r98dp4j">
                {open === i ? (
                  <span className="text-amber-300" data-oid="l2c7kf3">
                    ▲
                  </span>
                ) : (
                  <span className="text-amber-300" data-oid="b17_nq-">
                    ▼
                  </span>
                )}
              </div>
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
    <main
      className="relative min-h-screen w-full font-sans overflow-x-hidden"
      data-oid="wmnjgwf"
    >
      <div
        className="relative z-10 flex flex-col min-h-screen"
        data-oid="raq963y"
      >
        <HeroSection data-oid="8pv.gtg" />
        <AboutSection data-oid="hba7j2i" />
        <KpiSection data-oid="tqe:zki" />
        <FeaturesCarouselSection data-oid="esd75kn" />
        <PartnersSection data-oid="tsf_rw8" />
      </div>
    </main>
  );
}
