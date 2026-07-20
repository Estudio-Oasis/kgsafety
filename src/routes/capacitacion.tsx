import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import trainingImg from "@/assets/training-classroom.jpg";
import heightsImg from "@/assets/heights-worker.jpg";
import confinedImg from "@/assets/confined-space.jpg";
import { useT } from "@/i18n/context";
import { COURSES, type Course } from "@/data/kaee";
import { HardHat, Layers, ArrowUpFromLine, Construction, MoveUp, type LucideIcon } from "lucide-react";

const COURSE_ICON: Record<string, LucideIcon> = {
  "alturas-autorizado": HardHat,
  "alturas-competente": HardHat,
  "alturas-monitor": HardHat,
  andamios: Construction,
  izajes: ArrowUpFromLine,
  "plataformas-elevacion": MoveUp,
  "alturas-horizontales": Layers,
};

export const Route = createFileRoute("/capacitacion")({
  component: CapacitacionPage,
  head: () => ({
    meta: [
      { title: "Capacitación DC-3 oficial STPS · KG Safety" },
      { name: "description", content: "Programas DC-3 registrados ante STPS para trabajos en alturas, andamios, izajes, plataformas y líneas de vida horizontales. Agente Capacitador Externo Working at Heights. Cobertura nacional." },
      { property: "og:title", content: "Capacitación DC-3 · STPS · KG Safety" },
      { property: "og:description", content: "DC-3 STPS y Agente Capacitador Externo Working at Heights. 7 cursos vigentes." },
      { property: "og:url", content: "https://kgsafety.lovable.app/capacitacion" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/capacitacion" }],
  }),
});

// Niveles reales del curso de Trabajos en Alturas — confirmados contra fuente original.
const LEVELS = [
  { n: "01", badgeKey: "Autorizado (Básico)", hoursKey: "8 horas",
    descKey: "El participante conoce los elementos básicos de seguridad para el uso de los equipos y la ejecución segura de sus labores.",
    bullets: ["DC-3 registrado STPS", "Constancia de habilidades", "Registro verificable"] },
  { n: "02", badgeKey: "Competente (Intermedio)", hoursKey: "24 horas",
    descKey: "Capacita en supervisión de trabajadores, evaluación de condiciones de seguridad y maniobras de rescate.",
    bullets: ["DC-3 registrado STPS", "Criterio de supervisión", "Rescate básico"] },
  { n: "03", badgeKey: "Monitor Supervisor (Avanzado)", hoursKey: "40 horas",
    descKey: "Cubre normativa aplicable, criterios de anclaje, planes de trabajo y capacidad para dirigir maniobras y supervisar equipos.",
    bullets: ["DC-3 registrado STPS", "Perfil de monitor", "Dirección de maniobra"] },
];

// areas now come from COURSES dataset

function CapacitacionPage() {
  const { t } = useT();
  return (
    <div className="kg-on-dark bg-[color:var(--anchor-fixed)]">

      <section className="relative px-6 md:px-12 py-20 md:py-28 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heightsImg} alt="" loading="eager" width={1600} height={1000} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-anchor via-anchor/85 to-anchor/30" />
        </div>
        <div className="kg-on-dark max-w-5xl relative z-10">
          <SectionLabel>{t("Capacitación certificada")}</SectionLabel>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl mb-6 uppercase leading-[1.05] text-white">
            {t("DC-3 registrado")}{" "}<br />
            <span className="text-signal">{t("ante la STPS")}</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/85 max-w-2xl mb-10 leading-relaxed">
            {t("Agente Capacitador Externo Working at Heights (Reg. STPS N° WAH131021CQ8-0013). Programas presenciales para trabajos en alturas, andamios, izajes, plataformas y líneas de vida horizontales.")}
          </p>
          <Link to="/contacto" className="inline-block bg-signal text-anchor px-8 py-4 md:px-10 md:py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]">
            {t("Inscribir grupo")}
          </Link>
        </div>
      </section>

      {/* visual band: confined space */}
      <section className="relative border-b border-white/5 grid lg:grid-cols-3">
        <div className="lg:col-span-2 relative h-64 md:h-80">
          <img src={confinedImg} alt="Rescate en espacio confinado" loading="lazy" width={1600} height={1000} className="w-full h-full object-cover" />
        </div>
        <div className="bg-signal text-anchor p-8 md:p-12 flex flex-col justify-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3">{t("Realismo operativo")}</div>
          <div className="font-display text-3xl md:text-4xl uppercase leading-tight mb-3">7 cursos vigentes</div>
          <p className="text-sm leading-relaxed">{t("Trabajos en alturas (3 niveles), andamios, izajes con grúa, plataformas elevadoras y líneas de vida horizontales.")}</p>
        </div>
      </section>

      {/* Banner PNPC destacado */}
      <section className="px-6 md:px-12 py-12 md:py-16 border-b border-white/5 bg-brand-navy">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1.4fr)_auto] items-center gap-8 lg:gap-12">
          <div className="kg-on-dark">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-signal mb-4">
              <span className="w-2 h-2 bg-signal rounded-full animate-pulse" />
              {t("Programa insignia · 11 años")}
            </div>
            <h2 className="font-display text-2xl md:text-4xl uppercase leading-tight text-white mb-4">
              {t("P.N.P.C. — Profesionalización a Contratistas")}
            </h2>
            <p className="text-white/75 leading-relaxed max-w-2xl mb-6">
              {t("Sistema integral desarrollado por KG Safety para gestionar, certificar y verificar las competencias de contratistas en actividades de alto riesgo, con cumplimiento STPS.")}
            </p>
            <Link to="/contratistas" className="inline-block bg-signal text-anchor px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,0.4)]">
              {t("Conocer el P.N.P.C.")} →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4 lg:min-w-[280px]">
            {[
              { v: "11", l: "años" },
              { v: "0", l: "accidentes" },
              { v: "100%", l: "auditable" },
            ].map((s) => (
              <div key={s.l} className="border border-white/15 p-3 text-center kg-on-dark">
                <div className="font-display text-2xl md:text-3xl text-signal leading-none">{s.v}</div>
                <div className="text-[9px] uppercase tracking-widest text-white/60 mt-1.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionLabel>{t("Niveles del curso de Alturas")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase">{t("Tres niveles · Trabajos en Alturas")}</h2>
            <p className="text-white/60 mt-4 max-w-2xl leading-relaxed">
              {t("Estructura específica del curso de Trabajos en Alturas registrado ante STPS. Otros cursos del catálogo tienen su propia duración indicada en cada ficha.")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {LEVELS.map((l) => (
              <div key={l.n} className="bg-anchor p-8 md:p-10 flex flex-col">
                <div className="font-display text-signal text-xs mb-6">{l.n} / 03</div>
                <div className="font-display text-3xl text-white mb-2">{t(l.hoursKey)}</div>
                <h3 className="font-display text-base uppercase text-white/80 mb-6 leading-tight">{t(l.badgeKey)}</h3>
                <p className="text-sm text-white/55 mb-8 leading-relaxed flex-1">{t(l.descKey)}</p>
                <ul className="space-y-2 mb-8 border-t border-white/10 pt-6">
                  {l.bullets.map((b) => (
                    <li key={b} className="text-xs text-white/70 flex items-center gap-3">
                      <span className="w-1 h-1 bg-signal" /> {t(b)}
                    </li>
                  ))}
                </ul>
                <Link to="/contacto" className="text-signal font-bold text-[10px] uppercase tracking-widest border-b border-signal pb-1 self-start">
                  {t("Inscribir →")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start mb-12 lg:mb-14">
            <div>
              <SectionLabel>{t("Catálogo vigente")}</SectionLabel>
              <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
                {t("Cursos")} {t("disponibles")}
              </h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                {t("Temarios homologados, instructores certificados y emisión documental con certeza jurídica. Registro de CURP y verificación en línea.")}
              </p>
              <div className="bg-signal text-anchor border-2 border-anchor px-4 py-3 shadow-[4px_4px_0_0_rgba(0,0,0,0.35)]">
                <p className="text-xs md:text-sm font-bold uppercase tracking-wide leading-snug">
                  ★ ¡Precios especiales para grupos! Precios reducidos o diferenciados para grupos de 20 a 25 asistentes.
                </p>
              </div>
            </div>
            <img
              src={trainingImg}
              alt="Sesión de capacitación con equipo de protección personal"
              loading="lazy"
              width={1920}
              height={1080}
              className="w-full rounded-sm shadow-[8px_8px_0_0_var(--signal,#F5C500)]"
            />
          </div>

          {(() => {
            const list = COURSES.filter((c) => c.active !== false);
            const alturas = list.filter((c) => c.slug.startsWith("alturas-") && c.slug !== "alturas-horizontales");
            const otros = list.filter((c) => !alturas.includes(c));
            const total = list.length;
            let idx = 0;

            return (
              <div className="space-y-10">
                {/* Familia Alturas */}
                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em]">
                      Familia · Trabajos en Alturas
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">
                      3 niveles STPS
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {alturas.map((c) => {
                      idx += 1;
                      return <CourseCard key={c.slug} c={c} i={idx} total={total} t={t} highlight />;
                    })}
                  </div>
                </div>

                {/* Otros cursos */}
                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em]">
                      Cursos independientes
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">
                      {otros.length} cursos
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {otros.map((c) => {
                      idx += 1;
                      return <CourseCard key={c.slug} c={c} i={idx} total={total} t={t} />;
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>



      {/* OSHA + Recertificación — NEW content blocks */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          <div className="bg-anchor p-8 md:p-10">
            <SectionLabel>{t("OSHA — referencia técnica")}</SectionLabel>
            <h3 className="font-display text-xl md:text-2xl uppercase mb-4 leading-tight">
              OSHA 1926 · OSHA 1910
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              {t("Los temarios usan las Subpartes OSHA 1926 y 1910 como referencia técnica de guion, homologados con la NOM-009-STPS-2011. La certificación oficial emitida es la DC-3 registrada ante STPS.")}
            </p>
          </div>
          <div className="bg-anchor p-8 md:p-10">
            <SectionLabel>{t("Recertificación y rotación de personal")}</SectionLabel>
            <h3 className="font-display text-xl md:text-2xl uppercase mb-4 leading-tight">
              100%
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              {t("Programas anualizados, control de vencimientos y apoyo en rotación de personal para mantener al 100% al equipo operativo certificado.")}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-steel">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{t("Certeza jurídica")}</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-12 uppercase leading-tight">
            {t("Cero margen para la falsificación.")}
          </h2>
          <ul className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              "Registro de trabajadores y empresas en base de datos.",
              "Seguimiento directo de CURP.",
              "Registro de asistencia y aprobación del curso.",
              "DC-3 emitido y verificable en línea.",
              "Certificado de cumplimiento para identidad corporativa.",
              "Cumplimiento REPSE y auditable por STPS.",
            ].map((c) => (
              <li key={c} className="flex gap-4 text-white/70 leading-relaxed">
                <span className="text-signal font-display shrink-0">+</span>
                <span>{t(c)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pt-10 md:pt-14 pb-20 md:pb-28 px-6 md:px-12 text-center">
        <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
          {t("Inscriba a su equipo")} <span className="text-signal">{t("esta semana")}</span>.
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
          {t("Programación a nivel nacional. Modalidad presencial e instructores certificados.")}
        </p>
        <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
          {t("Solicitar fechas")}
        </Link>
      </section>
    </div>
  );
}

function CourseCard({
  c,
  i,
  total,
  t,
  highlight = false,
}: {
  c: Course;
  i: number;
  total: number;
  t: (s: string) => string;
  highlight?: boolean;
}) {
  const Icon = COURSE_ICON[c.slug] ?? HardHat;
  return (
    <Link
      to="/capacitacion/$curso"
      params={{ curso: c.slug }}
      className={`group relative flex flex-col p-6 md:p-7 border-2 transition-all rounded-sm ${
        highlight
          ? "bg-[color:color-mix(in_oklab,var(--anchor)_72%,white)] border-signal/40 hover:border-signal"
          : "bg-[color:color-mix(in_oklab,var(--anchor)_78%,white)] border-white/25 hover:border-signal"
      } hover:-translate-y-0.5 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_14px_28px_-10px_rgba(0,0,0,0.75)]`}
      title={c.foraneoPersona ? `Foráneo: ${c.foraneoPersona}` : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center border border-white/10 bg-white/[0.03] text-signal shrink-0">
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <div className="font-display text-signal text-[10px] tracking-widest">
          {String(i).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>

      <h3 className="font-display text-lg md:text-xl uppercase leading-tight text-white group-hover:text-signal transition-colors mb-2">
        {t(c.short)}
      </h3>

      <div className="text-[10px] uppercase tracking-widest text-white/50 mb-3">
        {[c.duracion, c.nivel].filter(Boolean).join(" · ")}
      </div>

      {c.tema && (
        <p className="text-[12px] text-white/55 leading-relaxed mb-5 line-clamp-2">{c.tema}</p>
      )}

      {c.precioLocalPersona && (
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="font-display text-signal text-xl md:text-2xl leading-none">
            {c.precioLocalPersona.replace(" MXN + IVA", "")}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">
            + IVA · por persona (local)
          </div>
          {(c.precioGrupal || c.foraneoPersona) && (
            <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
              {c.precioGrupal && (
                <div className="text-[11px] text-white/60">
                  Grupal <span className="text-white/85 font-bold">{c.precioGrupal.replace(" MXN + IVA", "")}</span>
                  {c.grupoRango && <span className="text-white/40"> · {c.grupoRango}</span>}
                </div>
              )}
              {c.foraneoPersona && (
                <div className="text-[10px] text-white/40">
                  + Foráneo {c.foraneoPersona.replace(" MXN por persona (adicional)", " por persona")}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
