import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/i18n/context";
import { BentoGrid, BentoTile } from "@/components/bento/Bento";
import { realImagesIn } from "@/lib/real-image";
import { COURSES, EQUIPMENT, PNPC_STATS, TESTIMONIALS, INDUSTRIES } from "@/data/kaee";
import { DifferentiatorBlock } from "@/components/site/DifferentiatorBlock";
import { DivisionsBlock } from "@/components/site/DivisionsBlock";
import { ClientLogosBand } from "@/components/site/ClientLogosBand";
import { AuditableDeliverables } from "@/components/site/AuditableDeliverables";
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
      {/* ============== HERO BENTO ============== */}
      <section className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 pb-10">
        <div className="max-w-7xl mx-auto">
          <BentoGrid rows="auto-rows-[minmax(140px,auto)] md:auto-rows-[minmax(170px,auto)]">
            {/* Hero claim */}
            <BentoTile
              span="col-span-2 md:col-span-4 md:row-span-3"
              variant="image"
              image={heroImg}
              eyebrow={<span style={{ color: "var(--signal)" }}>{t("Integrador de seguridad en altura · WE NEVER FALL")}</span>}
            >
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.0] uppercase mb-4 md:mb-6" style={{ color: "#fff" }}>
                {t("Ingeniería aplicada a la")}{" "}
                <span style={{ color: "var(--signal)" }}>{t("eliminación total de riesgos de caída.")}</span>
              </h1>
              <p className="text-sm md:text-base max-w-md md:max-w-xl leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.88)" }}>
                {t("Capacitación DC-3, sistemas certificados e ingeniería para industria pesada.")}
              </p>
              <div className="flex flex-wrap gap-3 mt-auto relative z-10">
                <Link to="/contacto" className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md" style={{ background: "var(--signal)", color: "var(--anchor-fixed)" }}>
                  {t("Hablar con un especialista")} →
                </Link>
                <Link to="/servicios" className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md" style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.06)" }}>
                  {t("Ver soluciones")}
                </Link>
              </div>
            </BentoTile>


            {/* KPI grande */}
            <BentoTile span="col-span-2 md:col-span-2 md:row-span-2" variant="accent">
              <div className="font-display text-5xl md:text-7xl leading-none mb-2">30M+</div>
              <div className="text-[11px] uppercase tracking-[0.22em] font-bold leading-snug">
                {t("Horas-hombre supervisadas sin accidentes")}
              </div>
              <div className="mt-auto text-[10px] uppercase tracking-[0.25em] opacity-80">
                {t("12 años · 200+ clientes")}
              </div>
            </BentoTile>

            {/* Certificación + países en UN solo tile compacto */}
            <BentoTile span="md:col-span-2" variant="dark">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 h-full">
                <div className="flex flex-col">
                  <div className="text-[9px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color: "var(--signal)" }}>STPS · DC-3</div>
                  <div className="font-display text-sm md:text-base leading-tight mt-auto" style={{ color: "#fff" }}>{t("Registro oficial")}</div>
                </div>
                <div className="flex flex-col sm:border-l sm:pl-4 pt-3 sm:pt-0 border-t sm:border-t-0" style={{ borderColor: "rgba(255,255,255,0.18)" }}>
                  <div className="text-[9px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color: "var(--signal)" }}>{t("5 países")}</div>
                  <div className="font-display text-sm md:text-base leading-tight mt-auto" style={{ color: "#fff" }}>MX · CO · CL · US · CA</div>
                </div>
              </div>
            </BentoTile>
          </BentoGrid>

        </div>
      </section>

      {/* ============== DIFERENCIADOR ============== */}
      <DifferentiatorBlock />

      {/* ============== 5 DIVISIONES ============== */}
      <DivisionsBlock />

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

      {/* ============== ENTREGABLES AUDITABLES ============== */}
      <AuditableDeliverables variant="light" />


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
