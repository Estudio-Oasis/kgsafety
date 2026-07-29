import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import teamImg from "@/assets/contractors-team.jpg";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/contratistas")({
  component: ContratistasPage,
  head: () => ({
    meta: [
      { title: "P.N.P.C. · Profesionalización de Contratistas · KG Safety" },
      { name: "description", content: "El PNPC es el sistema de KG Safety para gestionar, certificar y verificar competencias de contratistas en actividades de alto riesgo. 11 años de operación con cumplimiento STPS, OSHA y ANSI/ASSP." },
      { property: "og:title", content: "P.N.P.C. · KG Safety" },
      { property: "og:description", content: "Sistema integral para administrar, evaluar y profesionalizar a contratistas y trabajadores en actividades de alto riesgo." },
      { property: "og:url", content: "https://kgsafety.lovable.app/contratistas" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "P.N.P.C. · KG Safety" },
      { name: "twitter:description", content: "Sistema integral para administrar, evaluar y profesionalizar a contratistas y trabajadores en actividades de alto riesgo." },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/contratistas" }],
  }),
});

const PARA_QUE_SIRVE = [
  "Garantizar que únicamente personal competente realice trabajos de alto riesgo.",
  "Verificar competencias, certificaciones y vigencias de cada trabajador.",
  "Mantener un historial completo de capacitación y profesionalización.",
  "Registrar e inspeccionar el Equipo de Protección Personal (EPP) de cada colaborador.",
  "Contar con evidencia documental para auditorías, inspecciones y procesos internos.",
  "Reducir riesgos legales, operativos y de contratación.",
];

const INDUSTRIAS = [
  "Alimentos y bebidas",
  "Manufactura",
  "Automotriz",
  "Cemento y materiales de construcción",
  "Energía",
  "Oil & Gas",
  "Química y farmacéutica",
  "Logística y centros de distribución",
  "Cualquier empresa que gestione contratistas para actividades de alto riesgo",
];

const BENEFICIOS = [
  "Cumplimiento con STPS, OSHA, ANSI/ASSP, CSA y estándares internacionales.",
  "Certeza jurídica en los procesos de capacitación y certificación.",
  "Registro nacional de empresas contratistas y trabajadores profesionalizados.",
  "Control de niveles, competencias y vigencias.",
  "Historial personalizado de capacitación y certificaciones.",
  "Inspección y trazabilidad del Equipo de Protección Personal (EPP).",
  "Base de datos centralizada para consulta y seguimiento.",
  "Asesoría técnica especializada 24/7.",
];

function ContratistasPage() {
  const { t } = useT();
  return (
    <div className="kg-on-dark bg-anchor">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="grid lg:grid-cols-2">
          <div className="kg-on-dark px-6 md:px-12 py-20 md:py-28 bg-brand-navy text-white">
            <SectionLabel>{t("P.N.P.C.")}</SectionLabel>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl mb-6 uppercase leading-[1.08]">
              {t("Programa Nacional de")}{" "}
              <span className="text-signal">{t("Profesionalización")}</span>{" "}
              {t("a Contratistas.")}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-white/85 max-w-2xl mb-6 leading-relaxed">
              {t("El sistema desarrollado por KG Safety que permite a las empresas gestionar, certificar y verificar las competencias de todos sus contratistas en actividades de alto riesgo, garantizando cumplimiento normativo, trazabilidad y certeza jurídica.")}
            </p>
            <p className="text-sm md:text-base text-white/60 max-w-2xl mb-10 leading-relaxed">
              {t("11 años de implementación ininterrumpida en empresas multinacionales.")}
            </p>
            <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]">
              {t("Solicitar diagnóstico P.N.P.C.")}
            </Link>
          </div>
          <div className="relative min-h-[320px] lg:min-h-full">
            <img src={teamImg} alt="Equipo de contratistas con EPP" loading="eager" width={1600} height={1000} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-6 right-6 md:top-10 md:right-10 bg-signal text-anchor px-5 py-3 shadow-[5px_5px_0_0_rgba(0,0,0,0.4)] z-10">
              <div className="font-display text-xs uppercase tracking-[0.25em]">11 años · 0 accidentes</div>
            </div>
          </div>
        </div>
      </section>

      {/* 1 · ¿Qué es? */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-white/5 bg-anchor">
        <div className="max-w-5xl mx-auto kg-on-dark">
          <SectionLabel>{t("01 · ¿Qué es?")}</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight text-white">
            {t("Un sistema integral de profesionalización")}
          </h2>
          <p className="text-white/80 leading-relaxed text-lg max-w-3xl mb-4">
            {t("El Programa Nacional de Profesionalización a Contratistas (PNPC) es un sistema integral diseñado para administrar, evaluar y profesionalizar a las empresas contratistas y a sus trabajadores que realizan actividades de alto riesgo.")}
          </p>
          <p className="text-white/70 leading-relaxed text-base max-w-3xl">
            {t("A través del programa, las organizaciones pueden conocer en todo momento quién está capacitado, para qué actividades está autorizado, cuándo vence su certificación y si cuenta con el equipo de protección adecuado, reduciendo riesgos operativos, legales y administrativos.")}
          </p>
        </div>
      </section>

      {/* 2 · ¿Cómo nace? */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-white/5 bg-steel">
        <div className="max-w-5xl mx-auto kg-on-dark grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start">
          <div className="shrink-0">
            <div className="font-display text-6xl md:text-7xl text-signal leading-none">11</div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-white/60 mt-2">{t("años de operación")}</div>
          </div>
          <div>
            <SectionLabel>{t("02 · ¿Cómo nace?")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl mb-6 uppercase leading-tight text-white">
              {t("Nace de la necesidad real de la industria pesada")}
            </h2>
            <p className="text-white/75 leading-relaxed mb-4">
              {t("El PNPC fue desarrollado por KG Safety hace más de 11 años como respuesta a la necesidad de las grandes industrias de garantizar el cumplimiento de las Normas Oficiales Mexicanas (STPS) y de los principales estándares internacionales en seguridad.")}
            </p>
            <p className="text-white/65 leading-relaxed">
              {t("Hoy es una plataforma consolidada que permite gestionar de forma eficiente miles de trabajadores y empresas contratistas, asegurando que únicamente personal competente participe en actividades críticas.")}
            </p>
          </div>
        </div>
      </section>

      {/* 3 · ¿Para qué sirve? */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-anchor">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-3xl">
            <SectionLabel>{t("03 · ¿Para qué sirve?")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
              {t("Control centralizado, visibilidad y evidencia documental")}
            </h2>
            <p className="text-white/60 leading-relaxed">
              {t("Con el PNPC, las empresas controlan de forma centralizada todo el proceso de profesionalización de sus contratistas, con visibilidad, trazabilidad y evidencia en cada etapa.")}
            </p>
          </div>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {PARA_QUE_SIRVE.map((b, i) => (
              <li key={b} className="bg-anchor p-7 flex gap-4">
                <span className="font-display text-signal text-xs shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-white/75 text-sm leading-relaxed">{t(b)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 · ¿Para quién está diseñado? */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-steel">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 max-w-3xl">
            <SectionLabel>{t("04 · ¿Para quién está diseñado?")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
              {t("Industrias que gestionan contratistas de alto riesgo")}
            </h2>
            <p className="text-white/60 leading-relaxed">
              {t("El PNPC está dirigido a organizaciones que administran empresas contratistas y requieren garantizar el cumplimiento normativo y la competencia técnica de su personal.")}
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {INDUSTRIAS.map((ind) => (
              <li key={ind} className="border border-white/10 px-5 py-4 text-sm text-white/75 hover:border-signal hover:text-white transition-colors">
                {t(ind)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5 · Beneficios */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-anchor">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_1.4fr] gap-12 lg:gap-16 items-start">
          <div className="relative">
            <SectionLabel>{t("05 · Beneficios")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight relative z-10">
              {t("Operación bajo")}{" "}{t("control total.")}
            </h2>
            <p className="text-white/60 leading-relaxed mb-8 relative z-10">
              {t("Cumplimiento normativo y certeza jurídica, con historial y trazabilidad de cada trabajador y cada contratista.")}
            </p>
            <div className="border-l-2 border-signal pl-6 py-4 relative z-10">
              <div className="font-display text-3xl md:text-4xl text-white mb-2">100%</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 leading-relaxed">
                {t("Auditable por STPS,")}<br />{t("OSHA, ANSI/ASSP y CSA")}
              </div>
            </div>
          </div>
          <ul className="space-y-4">
            {BENEFICIOS.map((b, i) => (
              <li key={b} className="flex gap-5 border-b border-white/10 pb-4">
                <span className="font-display text-signal text-xs shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-white/75 text-sm leading-relaxed">{t(b)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-signal text-center">
        <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight text-anchor">
          {t("Active el P.N.P.C. en su planta.")}
        </h2>
        <p className="text-base md:text-lg font-bold mb-10 opacity-80 uppercase tracking-tight max-w-2xl mx-auto text-anchor">
          {t("Diagnóstico inicial sin compromiso · Respuesta el mismo día hábil.")}
        </p>
        <Link to="/contacto" className="inline-block bg-anchor px-10 md:px-12 py-5 md:py-6 font-display text-xs md:text-sm tracking-widest hover:bg-steel transition-colors uppercase" style={{ color: "#ffffff" }}>
          {t("Solicitar diagnóstico")}
        </Link>
      </section>
    </div>
  );
}
