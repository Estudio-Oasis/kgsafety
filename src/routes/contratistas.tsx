import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import teamImg from "@/assets/contractors-team.jpg";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/contratistas")({
  component: ContratistasPage,
  head: () => ({
    meta: [
      { title: "P.N.P.C. · Profesionalización de Contratistas · KG Safety" },
      { name: "description", content: "Programa Nacional de Profesionalización a Contratistas. Estandarice la seguridad de sus proveedores externos con base de datos nacional." },
      { property: "og:title", content: "P.N.P.C. · KG Safety" },
      { property: "og:description", content: "Control, capacitación y registro nacional de contratistas en seguridad industrial." },
      { property: "og:url", content: "https://kgsafety.lovable.app/contratistas" },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/contratistas" }],
  }),
});

const BENEFITS = [
  "Control y registro de contratistas en tres niveles de capacitación.",
  "Reglas de operación claras dentro de cada planta.",
  "Acceso a base de datos nacional de contratistas inscritos.",
  "Reducción de tiempos muertos previo a AST y EPP.",
  "Auditoría completa por STPS, REPSE y clientes.",
  "Comunicación trazable entre contratista, mantenimiento, compras y safety.",
];

const PROBLEMS = [
  "Mercado negro de supervisores.",
  "Falta de temarios de capacitación homologados.",
  "Retrasos por falta de profesionalismo del contratista.",
  "Criterios divididos para toma de decisiones.",
  "Desconocimiento de nuevos equipos y marcas.",
  "Planeación tardía vs procedimientos de la empresa.",
];

function ContratistasPage() {
  const { t } = useT();
  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/5">

        <div className="grid lg:grid-cols-2">
          <div className="kg-on-dark px-6 md:px-12 py-20 md:py-28 bg-brand-navy text-white">
            <SectionLabel>{t("P.N.P.C.")}</SectionLabel>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl mb-6 uppercase leading-[1.08]">
              {t("Programa Nacional de")}{" "}
              <span className="text-signal">{t("Profesionalización")}</span>{" "}
              {t("a Contratistas.")}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
              {t("10 años de implementación ininterrumpida en empresas multinacionales. Reducción a cero de accidentes en trabajos en altura bajo programa completo.")}
            </p>
            <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]">
              {t("Solicitar auditoría P.N.P.C.")}
            </Link>
          </div>
          <div className="relative min-h-[320px] lg:min-h-full">
            <img src={teamImg} alt="Equipo de contratistas con EPP" loading="eager" width={1600} height={1000} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-6 right-6 md:top-10 md:right-10 bg-signal text-anchor px-5 py-3 shadow-[5px_5px_0_0_rgba(0,0,0,0.4)] z-10">
              <div className="font-display text-xs uppercase tracking-[0.25em]">10 años · 0 accidentes</div>
            </div>
          </div>
        </div>
      </section>


      {/* Antecedentes — NEW */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-b border-white/5 bg-steel">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{t("Antecedentes")}</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
            {t("Una década midiendo cero")}
          </h2>
          <p className="text-white/70 leading-relaxed text-lg max-w-3xl">
            {t("10 años de implementación. Reducción a cero de accidentes en trabajos en alturas bajo programa completo. 100% auditable por STPS, REPSE y clientes. Información clara y accesible en tiempo real.")}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="relative">
            <SectionLabel>{t("Beneficios")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight relative z-10">
              {t("Operación bajo")}{" "}{t("control total.")}
            </h2>
            <p className="text-white/60 leading-relaxed mb-8 relative z-10">
              {t("El P.N.P.C. permite controlar a los contratistas en los tres niveles de capacitación y al personal interno para una comunicación correcta entre ambas partes.")}
            </p>
            <div className="border-l-2 border-signal pl-6 py-4 relative z-10">
              <div className="font-display text-3xl md:text-4xl text-white mb-2">100%</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 leading-relaxed">
                {t("Auditable por STPS,")}<br />{t("REPSE y clientes")}
              </div>
            </div>
          </div>

          <ul className="space-y-5">
            {BENEFITS.map((b, i) => (
              <li key={b} className="flex gap-5 border-b border-white/10 pb-5">
                <span className="font-display text-signal text-xs shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-white/70 text-sm leading-relaxed">{t(b)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-steel">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <SectionLabel>{t("Problemáticas que resolvemos")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">
              {t("Causas raíz que")} <span className="text-signal">{t("eliminamos")}</span>.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {PROBLEMS.map((p, i) => (
              <div key={p} className="bg-anchor p-7">
                <div className="font-display text-signal text-xs mb-4">{String(i + 1).padStart(2, "0")}</div>
                <p className="text-sm text-white/70 leading-relaxed">{t(p)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Áreas P.N.P.C. — NEW */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{t("Áreas y entrenamiento P.N.P.C.")}</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
            {t("3 áreas de capacitación + 2 de entrenamiento")}
          </h2>
          <p className="text-white/60 leading-relaxed text-lg max-w-3xl">
            {t("Persona autorizada · Monitor de seguridad · Persona competente. Más entrenamiento en rescate y uso de anclajes temporales.")}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <SectionLabel>{t("Instituto")}</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
            {t("Instituto Nacional de Capacitación en Seguridad Laboral KG")}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            {t("Información clara, accesible y en tiempo real para todos los involucrados: seguridad, mantenimiento, abastecimiento, servicio médico y contratistas alineados bajo un solo estándar.")}
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12 bg-signal text-anchor text-center">
        <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
          {t("Active el P.N.P.C. en su planta.")}
        </h2>
        <p className="text-base md:text-lg font-bold mb-10 opacity-80 uppercase tracking-tight max-w-2xl mx-auto">
          {t("Solicite una auditoría inicial sin compromiso.")}
        </p>
        <Link to="/contacto" className="inline-block bg-anchor text-white px-10 md:px-12 py-5 md:py-6 font-display text-xs md:text-sm tracking-widest hover:bg-steel transition-colors uppercase">
          {t("Solicitar auditoría")}
        </Link>
      </section>
    </div>
  );
}
