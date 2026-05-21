import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import trainingImg from "@/assets/training-classroom.jpg";
import heightsImg from "@/assets/heights-worker.jpg";
import confinedImg from "@/assets/confined-space.jpg";
import { useT } from "@/i18n/context";
import { COURSES } from "@/data/kaee";

export const Route = createFileRoute("/capacitacion")({
  component: CapacitacionPage,
  head: () => ({
    meta: [
      { title: "Capacitación DC-3 · KG Safety" },
      { name: "description", content: "Programas DC-3 en 3 niveles para trabajos en altura, espacios confinados, andamios y más. Certificado y registro STPS, OSHA y NSC." },
      { property: "og:title", content: "Capacitación DC-3 · KG Safety" },
      { property: "og:description", content: "Tres niveles de capacitación certificada con cobertura nacional." },
      { property: "og:url", content: "/capacitacion" },
    ],
    links: [{ rel: "canonical", href: "/capacitacion" }],
  }),
});

const LEVELS = [
  { n: "01", badgeKey: "Básico / Autorizado", hoursKey: "8 horas",
    descKey: "El participante conocerá los elementos básicos de seguridad para el uso de los equipos y la ejecución segura de sus labores.",
    bullets: ["DC-3 oficial", "Certificado de cumplimiento", "Registro STPS verificable"] },
  { n: "02", badgeKey: "Supervisor / Monitor", hoursKey: "16 horas",
    descKey: "Capacita en supervisión de trabajadores, evaluación de condiciones de seguridad y maniobras de rescate.",
    bullets: ["DC-3 oficial", "Certificado", "Criterio de supervisión"] },
  { n: "03", badgeKey: "Jefe de Seguridad / Competente", hoursKey: "24 horas",
    descKey: "Cubre normativas nacionales e internacionales, diseño de anclajes, planes de trabajo y capacidad para impartir cursos internos.",
    bullets: ["DC-3 oficial", "Certificado Competent Person", "Diseño de anclajes"] },
];

// areas now come from COURSES dataset

function CapacitacionPage() {
  const { t } = useT();
  return (
    <div>
      <section className="relative px-6 md:px-12 py-20 md:py-28 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heightsImg} alt="" loading="eager" width={1600} height={1000} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-anchor via-anchor/85 to-anchor/30" />
        </div>
        <div className="kg-on-dark max-w-5xl relative z-10">
          <SectionLabel>{t("Capacitación certificada")}</SectionLabel>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl mb-6 uppercase leading-[1.05] text-white">
            {t("DC-3 y certificado")}<br />
            <span className="text-signal">{t("oficial")}</span> {t("STPS · OSHA · NSC.")}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/85 max-w-2xl mb-10 leading-relaxed">
            {t("Tres niveles · doce áreas · capacitadores certificados por KAEE Group FPCS, STPS, OSHA y NSC. Cobertura nacional con programas de recertificación anualizada.")}
          </p>
          <Link to="/contacto" className="inline-block bg-signal text-anchor px-8 py-4 md:px-10 md:py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]">
            {t("Inscribir grupo")}
          </Link>
        </div>
      </section>

      {/* visual band: confined space */}
      <section className="relative border-b border-white/5 grid md:grid-cols-3">
        <div className="md:col-span-2 relative h-64 md:h-80">
          <img src={confinedImg} alt="Rescate en espacio confinado" loading="lazy" width={1600} height={1000} className="w-full h-full object-cover" />
        </div>
        <div className="bg-signal text-anchor p-8 md:p-12 flex flex-col justify-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3">{t("Realismo operativo")}</div>
          <div className="font-display text-3xl md:text-4xl uppercase leading-tight mb-3">12 áreas técnicas</div>
          <p className="text-sm leading-relaxed">{t("Alturas, confinados, andamios, calor, eléctrico, LOTO, primeros auxilios, extintores, OSHA 10 y 30 y más.")}</p>
        </div>
      </section>


      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionLabel>{t("Niveles")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase">{t("Tres niveles de mando")}</h2>
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
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <SectionLabel>{t("12 áreas")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
              {t("Cursos")}<br />{t("disponibles")}
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              {t("Temarios homologados, instructores certificados y emisión documental con certeza jurídica. Registro de CURP y verificación en línea.")}
            </p>
            <img src={trainingImg} alt="Sesión de capacitación con equipo de protección personal" loading="lazy" width={1920} height={1080} className="w-full rounded-sm shadow-[8px_8px_0_0_var(--signal,#F5C500)]" />
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
            {COURSES.map((c, i) => (
              <Link
                key={c.slug}
                to="/capacitacion/$curso"
                params={{ curso: c.slug }}
                className="bg-anchor p-5 md:p-6 hover:bg-steel transition-colors group block"
              >
                <div className="font-display text-signal text-[10px] mb-2">{String(i + 1).padStart(2, "0")}</div>
                <div className="font-bold text-sm uppercase tracking-tight group-hover:text-brand-blue">{t(c.short)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OSHA + Recertificación — NEW content blocks */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          <div className="bg-anchor p-8 md:p-10">
            <SectionLabel>{t("OSHA Subpartes — guion básico")}</SectionLabel>
            <h3 className="font-display text-xl md:text-2xl uppercase mb-4 leading-tight">
              OSHA 1926 · OSHA 1910
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              {t("Los temarios siguen como guion las Subpartes OSHA 1926 y 1910, homologados con la NOM-009-STPS-2011 y adaptados al estándar interno de cada cliente.")}
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

      <section className="py-20 md:py-28 px-6 md:px-12 text-center">
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
