import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/i18n/context";
import { BentoGrid, BentoTile } from "@/components/bento/Bento";
import { realImagesIn } from "@/lib/real-image";
import { COURSES, EQUIPMENT, PNPC_STATS, TESTIMONIALS, INDUSTRIES } from "@/data/kaee";
import { DifferentiatorBlock } from "@/components/site/DifferentiatorBlock";
import { DivisionsBlock } from "@/components/site/DivisionsBlock";
import { ClientLogosBand } from "@/components/site/ClientLogosBand";

import heroImg from "@/assets/hero-clean.jpg";
import ctaImg from "@/assets/cta-office.jpg";
import alturasImg from "@/assets/courses/alturas.jpg";
import confinadosImg from "@/assets/courses/confinados.jpg";
import andamiosImg from "@/assets/courses/andamios.jpg";
import lotoImg from "@/assets/courses/loto.jpg";
import electricidadImg from "@/assets/courses/electricidad.jpg";
import calorImg from "@/assets/courses/calor.jpg";
import eppImg from "@/assets/equipment/epp.jpg";
import lvImg from "@/assets/equipment/lineas-de-vida.jpg";
import anclajesImg from "@/assets/equipment/anclajes.jpg";
import plataformasImg from "@/assets/equipment/plataformas.jpg";


const COURSE_IMG: Record<string, string> = {
  alturas: alturasImg,
  confinados: confinadosImg,
  andamios: andamiosImg,
  loto: lotoImg,
  electricidad: electricidadImg,
  calor: calorImg,
};

const EQUIP_IMG: Record<string, string> = {
  epp: eppImg,
  "lineas-de-vida": lvImg,
  anclajes: anclajesImg,
  plataformas: plataformasImg,
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "KG Safety · Eliminación total de riesgos de caída" },
      { name: "description", content: "Ingeniería aplicada a la eliminación total de riesgos de caída. Capacitación DC-3, sistemas certificados e ingeniería para industria pesada. 30M+ horas-hombre sin accidentes." },
      { property: "og:title", content: "KG Safety · Eliminación total de riesgos de caída" },
      { property: "og:description", content: "Integrador de seguridad en altura: diagnóstico, ingeniería, instalación, certificación, capacitación y documentación auditable." },
      { property: "og:url", content: "https://kgsafety.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/" }],
  }),
});


function Index() {
  const { t } = useT();
  const clientLogos = realImagesIn("logos-clientes");
  const topCourses = COURSES.slice(0, 6);
  const topEquip = EQUIPMENT.filter((e) => EQUIP_IMG[e.slug]).slice(0, 4);
  const restEquip = EQUIPMENT.filter((e) => !EQUIP_IMG[e.slug]).slice(0, 4);
  void topEquip; void restEquip; void clientLogos;

  return (
    <div className="bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* ============== HERO ============== */}
      <section className="px-4 md:px-8 lg:px-12 pt-6 md:pt-10 pb-10">
        <div className="max-w-7xl mx-auto grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-6 lg:auto-rows-[minmax(170px,auto)]">

          {/* HERO TILE — split: navy block + image */}
          <div className="lg:col-span-4 lg:row-span-3 rounded-[var(--bento-radius,1.25rem)] overflow-hidden border border-[color:var(--brand-navy)] kg-on-dark bg-[color:var(--brand-navy)] flex flex-col lg:flex-row min-h-[460px] lg:min-h-[520px]">
            {/* Image */}
            <div className="relative lg:order-2 lg:w-[42%] h-[220px] md:h-[280px] lg:h-auto shrink-0">
              <img
                src={heroImg}
                alt={t("Técnico industrial trabajando en altura con arnés certificado")}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Soft navy edge fade — only at the seam, image stays visible */}
              <div
                className="absolute inset-0 pointer-events-none lg:bg-[linear-gradient(90deg,var(--brand-navy)_0%,transparent_22%)] bg-[linear-gradient(180deg,transparent_60%,var(--brand-navy)_100%)]"
              />
              <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-[0.25em] px-2 py-1 bg-black/40 backdrop-blur-sm text-white rounded">
                {t("En campo · 2026")}
              </span>
            </div>

            {/* Copy */}
            <div className="lg:order-1 lg:w-[58%] p-6 md:p-8 lg:p-11 flex flex-col">
              <span className="kg-pill-tech self-start mb-5">
                <span className="kg-led" aria-hidden />
                {t("Integrador de seguridad en altura · WE NEVER FALL")}
              </span>

              <h1 className="font-display uppercase leading-[0.95] tracking-tight mb-4 md:mb-5">
                <span className="block text-4xl md:text-6xl lg:text-7xl text-white">
                  {t("Cero caídas.")}
                </span>
                <span className="block text-2xl md:text-3xl lg:text-5xl mt-2" style={{ color: "var(--signal)" }}>
                  {t("Ingeniería que las elimina.")}
                </span>
              </h1>

              <p className="text-sm md:text-base lg:text-lg leading-relaxed max-w-xl mb-7 text-white">
                {t("Diagnóstico, sistemas certificados y capacitación DC-3 para industria pesada.")}
              </p>

              <div className="flex flex-wrap gap-3 mt-auto">
                <Link
                  to="/contacto"
                  className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md shadow-[3px_3px_0_0_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-transform"
                  style={{ background: "var(--signal)", color: "var(--anchor-fixed)" }}
                >
                  {t("Hablar con un especialista")} →
                </Link>
                <Link
                  to="/servicios"
                  className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md hover:bg-white/10 transition-colors"
                  style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.45)" }}
                >
                  {t("Ver soluciones")}
                </Link>
              </div>
            </div>
          </div>

          {/* KPI 30M+ */}
          <div className="lg:col-span-2 lg:row-span-2 rounded-[var(--bento-radius,1.25rem)] border-2 border-[color:var(--anchor-fixed)] bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] p-6 md:p-7 flex flex-col relative overflow-hidden min-h-[240px]">
            <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-[0.22em] bg-[color:var(--anchor-fixed)] text-[color:var(--signal)] px-2 py-1 rounded">
              {t("Sin accidentes")}
            </span>
            <div className="font-display text-6xl md:text-7xl lg:text-8xl leading-none mb-3">30M+</div>
            <div className="text-[11px] uppercase tracking-[0.22em] font-bold leading-snug max-w-[80%]">
              {t("Horas-hombre supervisadas")}
            </div>

            {/* Mini trend bars */}
            <div className="mt-5 flex items-end gap-1.5 h-10">
              {[28, 44, 62, 84, 100].map((h, i) => (
                <div
                  key={i}
                  className="w-2.5 rounded-sm bg-[color:var(--anchor-fixed)]"
                  style={{ height: `${h}%`, opacity: 0.45 + i * 0.11 }}
                />
              ))}
              <span className="ml-2 mb-0.5 text-[10px] font-bold tracking-widest uppercase opacity-80">
                {t("12 años")}
              </span>
            </div>

            <div className="mt-auto pt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-bold border-t border-[color:var(--anchor-fixed)]/20">
              <span className="inline-grid place-items-center w-4 h-4 rounded-full bg-[color:var(--anchor-fixed)] text-[color:var(--signal)] text-[10px]">✓</span>
              <span>{t("200+ clientes industriales")}</span>
            </div>
          </div>

          {/* Registro + países */}
          <div className="lg:col-span-2 rounded-[var(--bento-radius,1.25rem)] border border-[color:var(--brand-navy)] bg-[color:var(--brand-navy)] kg-on-dark grid grid-cols-2 divide-x divide-white/15 overflow-hidden min-h-[170px]">
            <div className="p-5 md:p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: "var(--signal)" }}>
                  <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
                </svg>
                <span className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--signal)" }}>STPS · DC-3</span>
              </div>
              <div className="font-display text-base md:text-lg leading-tight mt-auto text-white">
                {t("Registro oficial")}
              </div>
              <div className="mt-1 h-[2px] w-8" style={{ background: "var(--signal)" }} />
            </div>
            <div className="p-5 md:p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: "var(--signal)" }}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" />
                </svg>
                <span className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--signal)" }}>{t("5 países")}</span>
              </div>
              <div className="font-display text-base md:text-lg leading-tight mt-auto text-white">
                MX · CO · CL · US · CA
              </div>
              <div className="mt-1 h-[2px] w-8" style={{ background: "var(--signal)" }} />
            </div>
          </div>


        </div>
      </section>


      {/* ============== DIFERENCIADOR ============== */}
      <DifferentiatorBlock />

      {/* ============== 5 DIVISIONES ============== */}
      <DivisionsBlock />

      {/* ============== EVIDENCIA DOCUMENTAL (CTA compacto) ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-8 md:py-10 bg-[color:var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/cumplimiento"
            className="group block rounded-lg bg-[color:var(--anchor-fixed)] text-white p-6 md:p-8 border border-white/10 transition-all duration-200 hover:border-[color:var(--signal)] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--signal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface)] active:scale-[0.99]"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="max-w-xl">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: "var(--signal)" }}>
                  {t("Cierre auditable")}
                </div>
                <h3 className="font-display text-xl md:text-2xl uppercase leading-tight mb-2">
                  {t("Evidencia documental")}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {t("Análisis de riesgo, plan de rescate, certificados, DC-3 y bitácora de inspección en cada proyecto.")}
                </p>
              </div>
              <span
                className="self-start md:self-auto inline-flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.25em] whitespace-nowrap"
                style={{ color: "var(--signal)" }}
              >
                {t("Ver cumplimiento")}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ============== CLIENTES ============== */}
      <ClientLogosBand variant="light" />






      {/* ============== SERVICIOS BENTO ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-[color:var(--surface-2)] border-y border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                {t("Servicios")}
              </div>
              <h2 className="font-display text-2xl md:text-4xl uppercase leading-tight">
                {t("Capacidades operativas")}{" "}
                <span className="text-signal kg-highlight">{t("para alto riesgo")}</span>
              </h2>
            </div>
            <Link to="/servicios" className="text-brand-blue font-bold text-[11px] uppercase tracking-[0.22em] border-b border-brand-blue pb-1">
              {t("Ver todos los servicios")} →
            </Link>

          </div>

          <BentoGrid>
            <BentoTile
              span="col-span-2 md:col-span-3 md:row-span-2"
              variant="image"
              image={alturasImg}
              to="/capacitacion"
              eyebrow="01 / Capacitación"
              title={t("Cursos DC-3 certificados")}
              description={t("4 niveles · 10 áreas técnicas · STPS, OSHA y ANSI Z359.")}
              cta={t("Ver cursos")}
            />
            <BentoTile
              span="col-span-2 md:col-span-3"
              variant="image"
              image={eppImg}
              to="/equipos"
              eyebrow="02 / Equipos S@H"
              title={t("EPP y anclajes certificados")}
              description={t("Arnés, líneas de vida, andamios y más.")}
              cta={t("Catálogo")}
            />
            <BentoTile
              span="md:col-span-2"
              variant="image"
              image={lvImg}
              to="/ingenieria"
              eyebrow="03 / Ingeniería"
              title={t("Diseño WoLL")}
              cta={t("Diagnóstico")}
            />
            <BentoTile
              span="md:col-span-1"
              variant="accent"
              to="/contratistas"
              eyebrow="04 / P.N.P.C."
              title={t("Filtro de contratistas")}
              description={t("Profesionalizamos a sus proveedores externos antes de operar en planta.")}
              cta={t("Conocer el programa")}
            />
          </BentoGrid>
        </div>
      </section>

      {/* ============== CATÁLOGO CURSOS ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                {t("Capacitación")}
              </div>
              <h2 className="font-display text-2xl md:text-4xl uppercase">
                {t("Catálogo de cursos")}
              </h2>
            </div>
            <Link to="/capacitacion" className="text-brand-blue font-bold text-[11px] uppercase tracking-[0.22em] border-b border-brand-blue pb-1">
              {t("Ver los 10 cursos")} →
            </Link>
          </div>

          <BentoGrid cols="grid-cols-2 md:grid-cols-6" rows="auto-rows-[minmax(170px,auto)] md:auto-rows-[minmax(200px,auto)]">
            {topCourses.map((c, i) => {
              const img = COURSE_IMG[c.slug];
              const featured = i === 0;
              return (
                <BentoTile
                  key={c.slug}
                  span={featured ? "col-span-2 md:col-span-3 md:row-span-2" : "md:col-span-2"}
                  variant="image"
                  image={img}
                  to="/capacitacion/$curso"
                  params={{ curso: c.slug }}
                  eyebrow={`${String(i + 1).padStart(2, "0")} · ${c.levels.length} niveles`}
                  title={c.short}
                  description={featured ? c.desc : undefined}
                  cta={t("Ver curso")}
                />
              );
            })}
          </BentoGrid>
        </div>
      </section>





      {/* ============== FINAL CTA BENTO ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-[color:var(--surface-2)] border-t border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <BentoGrid>
            <BentoTile span="col-span-2 md:col-span-4 md:row-span-2" variant="image" image={ctaImg}>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "var(--signal)" }}>
                {t("Respuesta el mismo día hábil")}
              </div>
              <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight mb-4" style={{ color: "#fff" }}>
                {t("Comparta su riesgo.")}{" "}
                <br />
                <span style={{ color: "var(--signal)" }}>{t("Le respondemos con un plan técnico.")}</span>
              </h2>
              <p className="text-sm md:text-base max-w-xl mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
                {t("Indíquenos planta, tipo de trabajo, número de usuarios y fecha crítica. Un especialista le dirá si necesita capacitación, equipo, visita técnica, certificación o plan de rescate.")}
              </p>
              <div className="flex flex-wrap gap-3 mt-auto relative z-10">
                <Link to="/contacto" className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md" style={{ background: "var(--signal)", color: "var(--anchor-fixed)" }}>
                  {t("Hablar con un especialista")}
                </Link>
                <a href="https://wa.me/527228795076" target="_blank" rel="noopener noreferrer" className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md" style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.06)" }}>
                  {t("WhatsApp directo")}
                </a>
              </div>
            </BentoTile>



            <BentoTile span="md:col-span-2" variant="accent" href="tel:+527228795076" eyebrow={t("Llamada directa")} title="+52 722 879 5076" cta={t("Llamar ahora")} />
            <BentoTile span="md:col-span-2" variant="neutral" eyebrow={t("Certificados")}>
              <div className="flex flex-wrap gap-2 mt-2 text-[10px] uppercase tracking-widest font-display opacity-70">
                <span>STPS</span><span>OSHA</span><span>ANSI Z359</span>
                <span>NOM-009</span><span>EN-795</span><span>CSA Z259</span>
              </div>
            </BentoTile>
          </BentoGrid>
        </div>
      </section>
    </div>
  );
}
