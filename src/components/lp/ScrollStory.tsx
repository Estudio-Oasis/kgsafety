import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import confined from "@/assets/confined-space.jpg";
import engineering from "@/assets/engineering-install.jpg";
import equipment from "@/assets/equipment-ppe.jpg";
import training from "@/assets/training-classroom.jpg";
import heights from "@/assets/heights-worker.jpg";

const CHAPTERS = [
  {
    time: "06:41",
    kicker: "Capítulo 01 · La orden",
    title: "“Sube y cambia esa luminaria.”",
    body:
      "Nave industrial, 18 metros de altura, sin plataforma fija. La tarea es de cinco minutos; el riesgo, permanente. Aquí empieza todo caso que investiga la STPS.",
    img: training,
    stat: { n: "18 m", l: "altura de trabajo real" },
  },
  {
    time: "07:15",
    kicker: "Capítulo 02 · Lo que casi pasa",
    title: "Un anclaje improvisado a una tubería.",
    body:
      "Sin memoria de cálculo nadie sabe cuánto resiste. Un arnés bien puesto en un punto mal elegido sigue siendo una caída libre. Ese es el hallazgo #1 en 8 de cada 10 diagnósticos.",
    img: confined,
    stat: { n: "8/10", l: "plantas con anclajes sin respaldo" },
  },
  {
    time: "08:02",
    kicker: "Capítulo 03 · Entra la ingeniería",
    title: "Se calcula. Se firma. Se instala.",
    body:
      "Línea de vida diseñada con memoria de cálculo, planos y especificación de materiales. Lo que antes era criterio del soldador, ahora es un sistema con respaldo legal y técnico.",
    img: engineering,
    stat: { n: "100%", l: "sistemas con memoria de cálculo" },
  },
  {
    time: "09:30",
    kicker: "Capítulo 04 · La gente",
    title: "Capacitación con DC-3 que resiste auditoría.",
    body:
      "El equipo aprende a inspeccionar, conectar y rescatar. Cada constancia queda emitida por agente capacitador con registro vigente ante la STPS.",
    img: equipment,
    stat: { n: "DC-3", l: "avalada · registro STPS vigente" },
  },
  {
    time: "17:40",
    kicker: "Capítulo 05 · Fin de turno",
    title: "Nadie escribió un reporte de accidente.",
    body:
      "La luminaria funciona, la planta no se detuvo y el expediente auditable ya está en la carpeta: planos, memorias, asistencias y constancias. La caída simplemente no ocurrió.",
    img: heights,
    stat: { n: "0", l: "incidentes registrados" },
  },
];

export function ScrollStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative bg-[color:var(--anchor-fixed)] border-y border-white/10">
      {/* Encabezado del acto */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-16 md:pt-28 pb-6 md:pb-10">
        <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-signal mb-5">
          Caso de estudio · un turno completo
        </div>
        <h2 className="font-display uppercase text-white leading-[0.95] text-[clamp(1.9rem,8vw,4.5rem)] max-w-4xl">
          La historia de una caída <span className="text-signal">que no ocurrió.</span>
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16 md:pb-28 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-14">
        {/* Columna visual fija (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 h-[calc(100svh-8rem)] max-h-[42rem]">
            <div className="relative h-full w-full overflow-hidden border border-white/12">
              {CHAPTERS.map((c, i) => (
                <img
                  key={c.time}
                  src={c.img}
                  alt={c.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-out"
                  style={{
                    opacity: active === i ? 1 : 0,
                    transform: active === i ? "scale(1)" : "scale(1.08)",
                  }}
                />
              ))}
              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,16,36,0.92) 0%, rgba(10,16,36,0.25) 45%, rgba(10,16,36,0.1) 100%)",
                }}
              />
              <div className="lp-grain absolute inset-0" aria-hidden />
              {/* HUD */}
              <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-signal">
                <span className="lp-blink h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
                {CHAPTERS[active].time} h
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="font-display text-signal leading-none text-[clamp(2rem,4vw,3.4rem)]">
                  {CHAPTERS[active].stat.n}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/70">
                  {CHAPTERS[active].stat.l}
                </div>
                <div className="mt-5 flex gap-1.5" aria-hidden>
                  {CHAPTERS.map((c, i) => (
                    <span
                      key={c.time}
                      className={`h-[3px] flex-1 transition-colors duration-500 ${
                        i <= active ? "bg-signal" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capítulos */}
        <ol className="relative lg:border-l lg:border-white/12 lg:pl-10">
          {CHAPTERS.map((c, i) => (
            <li
              key={c.time}
              data-idx={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="relative py-10 md:py-16 lg:min-h-[56vh] lg:flex lg:flex-col lg:justify-center"
            >
              <span
                aria-hidden
                className={`hidden lg:block absolute -left-[45px] top-[calc(50%-6px)] h-3 w-3 rotate-45 border transition-colors duration-500 ${
                  active === i ? "bg-signal border-signal" : "bg-transparent border-white/30"
                }`}
              />
              <div
                className={`transition-opacity duration-500 ${active === i ? "opacity-100" : "lg:opacity-45"}`}
              >
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-mono text-signal text-sm tracking-[0.18em]">{c.time}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/50">
                    {c.kicker}
                  </span>
                </div>
                <h3 className="font-display uppercase text-white leading-[1.02] text-[clamp(1.4rem,5.5vw,2.6rem)] break-words">
                  {c.title}
                </h3>
                <p className="mt-5 text-white/75 text-base md:text-lg leading-relaxed max-w-xl">{c.body}</p>

                {/* Visual en móvil */}
                <div className="lg:hidden mt-6 relative overflow-hidden border border-white/12">
                  <img src={c.img} alt={c.title} loading="lazy" className="w-full aspect-[4/3] object-cover" />
                  <div
                    className="absolute inset-0"
                    aria-hidden
                    style={{
                      background: "linear-gradient(to top, rgba(10,16,36,0.9), rgba(10,16,36,0.05))",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 p-5">
                    <div className="font-display text-signal text-3xl leading-none">{c.stat.n}</div>
                    <div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-white/70">{c.stat.l}</div>
                  </div>
                </div>

                {i === CHAPTERS.length - 1 && (
                  <Link
                    to="/contacto"
                    className="mt-8 inline-flex items-center justify-center gap-2 bg-signal text-[color:var(--anchor-fixed)] font-bold uppercase tracking-[0.14em] text-[12px] px-7 py-4 hover:bg-white transition-colors shadow-[6px_6px_0_0_rgba(0,0,0,0.35)]"
                  >
                    Quiero este turno en mi planta <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
