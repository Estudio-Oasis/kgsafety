import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/i18n/context";
import { BentoGrid, BentoTile } from "@/components/bento/Bento";
import { realImagesIn } from "@/lib/real-image";
import { COURSES, EQUIPMENT, PNPC_STATS, TESTIMONIALS, INDUSTRIES, CLIENTS_FULL, DIVISIONS } from "@/data/kaee";
import heroImg from "@/assets/hero-clean.jpg";
import ctaImg from "@/assets/cta-office.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "KG Safety · 12 años eliminando riesgos de caída en México" },
      { name: "description", content: "KAEE Group: capacitación DC-3, ingeniería de líneas de vida y EPP certificado. 30M+ horas-hombre supervisadas sin accidentes." },
      { property: "og:title", content: "KG Safety · Bento de seguridad industrial" },
      { property: "og:description", content: "Capacitación, equipos, ingeniería y consultoría para empresas Clase Mundial." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  const { t } = useT();
  const clientLogos = realImagesIn("logos-clientes");
  const icons = realImagesIn("iconos-servicios");
  const topCourses = COURSES.slice(0, 6);
  const topEquip = EQUIPMENT.slice(0, 6);

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
              eyebrow={<span style={{ color: "var(--signal)" }}>{t("Líder en ingeniería de alturas")}</span>}
            >
              <h1
                className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] uppercase mb-4 md:mb-6"
                style={{ color: "#fff" }}
              >
                {t("WE NEVER")} <span style={{ color: "var(--signal)" }}>{t("FALL.")}</span>
              </h1>
              <p
                className="text-sm md:text-base max-w-lg leading-relaxed mb-6"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {t("Soluciones integrales en seguridad industrial para empresas Clase Mundial.")}
              </p>
              <div className="flex flex-wrap gap-3 mt-auto relative z-10">
                <Link
                  to="/contacto"
                  className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md transition-colors"
                  style={{ background: "var(--signal)", color: "var(--anchor-fixed)" }}
                >
                  {t("Cotizar ahora")} →
                </Link>
                <Link
                  to="/ingenieria"
                  className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md transition-colors hover:backdrop-brightness-110"
                  style={{
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.45)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  {t("Líneas de vida")}
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

            {/* Certificación */}
            <BentoTile span="md:col-span-1" variant="dark" eyebrow="STPS · DC-3">
              <div className="font-display text-2xl mt-auto">{t("Registro oficial")}</div>
            </BentoTile>
            <BentoTile span="md:col-span-1" variant="neutral" eyebrow={t("3 países")}>
              <div className="font-display text-base mt-auto leading-tight">MX · CO · CL</div>
            </BentoTile>

            {/* Logos clientes — banda inferior */}
            <BentoTile span="col-span-2 md:col-span-6" variant="stat" className="!p-4 md:!p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mb-3">
                {t("Confiado por líderes de la industria")}
              </div>
              <div className="overflow-hidden relative">
                <div className="flex gap-10 md:gap-14 animate-marquee-slow whitespace-nowrap w-max items-center">
                  {[...CLIENTS_FULL, ...CLIENTS_FULL].map((c, i) => (
                    <span key={`${c}-${i}`} className="font-display text-sm md:text-base opacity-70 shrink-0 tracking-tight">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              {clientLogos.length > 0 && (
                <div className="mt-4 flex gap-3 md:gap-5 items-center flex-wrap opacity-80">
                  {clientLogos.slice(0, 8).map((src, i) => (
                    <img key={i} src={src} alt="" className="h-8 md:h-10 w-auto object-contain grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition" />
                  ))}
                </div>
              )}
            </BentoTile>
          </BentoGrid>
        </div>
      </section>

      {/* ============== SERVICIOS BENTO ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-[color:var(--surface-2)] border-y border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                {t("División técnica")}
              </div>
              <h2 className="font-display text-2xl md:text-4xl uppercase leading-tight">
                {t("Cuatro frentes contra la")} <span className="text-signal kg-highlight">{t("gravedad")}</span>
              </h2>
            </div>
            <Link to="/soluciones" className="text-brand-blue font-bold text-[11px] uppercase tracking-[0.22em] border-b border-brand-blue pb-1">
              {t("Ver todas las soluciones")} →
            </Link>
          </div>

          <BentoGrid>
            <BentoTile
              span="col-span-2 md:col-span-3 md:row-span-2"
              variant="dark"
              to="/capacitacion"
              eyebrow="01 / Capacitación"
              title={t("Cursos DC-3 certificados")}
              description={t("4 niveles · 10 áreas técnicas · STPS, OSHA y ANSI Z359.")}
              cta={t("Ver cursos")}
            />
            <BentoTile
              span="col-span-2 md:col-span-3"
              variant="accent"
              to="/equipos"
              eyebrow="02 / Equipos S@H"
              title={t("EPP y anclajes certificados")}
              description={t("Arnés, líneas de vida, andamios, plataformas y más.")}
              cta={t("Catálogo")}
            />
            <BentoTile
              span="md:col-span-2"
              variant="neutral"
              to="/ingenieria"
              eyebrow="03 / Ingeniería"
              title={t("Diseño WoLL")}
              description={t("Líneas de vida, anclajes, domos, barandales.")}
              cta={t("Diagnóstico")}
            />
            <BentoTile
              span="md:col-span-1"
              variant="stat"
              to="/contratistas"
              eyebrow="04 / Contratistas"
              title="P.N.P.C."
              cta={t("Programa")}
            />
          </BentoGrid>
        </div>
      </section>

      {/* ============== TOP CURSOS BENTO ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
              {t("Capacitación")}
            </div>
            <h2 className="font-display text-2xl md:text-4xl uppercase">
              {t("Cursos más solicitados")}
            </h2>
          </div>

          <BentoGrid cols="grid-cols-2 md:grid-cols-6" rows="auto-rows-[minmax(140px,auto)] md:auto-rows-[minmax(170px,auto)]">
            {topCourses.map((c, i) => {
              const featured = i === 0;
              return (
                <BentoTile
                  key={c.slug}
                  span={featured ? "md:col-span-2 md:row-span-2" : "md:col-span-2"}
                  variant={featured ? "dark" : i % 2 === 1 ? "neutral" : "stat"}
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

      {/* ============== EQUIPOS + ICONOS ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-[color:var(--surface-2)] border-y border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                {t("Catálogo Safety@Heights")}
              </div>
              <h2 className="font-display text-2xl md:text-4xl uppercase">
                {t("Equipos certificados")}
              </h2>
            </div>
            <Link to="/equipos" className="text-brand-blue font-bold text-[11px] uppercase tracking-[0.22em] border-b border-brand-blue pb-1">
              {t("Ver catálogo completo")} →
            </Link>
          </div>

          <BentoGrid>
            <BentoTile
              span="col-span-2 md:col-span-3 md:row-span-2"
              variant="dark"
              to="/equipos/epp"
              eyebrow={t("EPP completo")}
              title={t("Arnés · Casco · Conectores")}
              description={t("Líneas líderes mundiales. Venta, renta y certificación con pruebas de carga.")}
              cta={t("Cotizar EPP")}
            />
            {topEquip.slice(0, 5).map((e, i) => (
              <BentoTile
                key={e.slug}
                span={i === 0 ? "md:col-span-3" : "md:col-span-1"}
                variant={i === 0 ? "dark" : "neutral"}
                to="/equipos/$categoria"
                params={{ categoria: e.slug }}
                eyebrow={`${e.items.length} items`}
                title={e.name.split("—")[0].trim()}
                cta={i === 0 ? t("Ver línea") : undefined}
              >
                {i !== 0 && icons[i] && (
                  <img src={icons[i]} alt="" className="absolute right-3 bottom-3 w-10 h-10 object-contain opacity-50" />
                )}
              </BentoTile>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* ============== PRUEBA SOCIAL BENTO ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <BentoGrid>
            {/* Testimonio grande */}
            <BentoTile span="col-span-2 md:col-span-3 md:row-span-2" variant="dark">
              <div className="font-display text-5xl leading-none mb-4" style={{ color: "var(--signal)" }}>"</div>
              <p className="italic leading-relaxed text-base md:text-lg mb-4" style={{ color: "rgba(255,255,255,0.95)" }}>
                {TESTIMONIALS[0].quote}
              </p>
              <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.18)" }}>
                <div className="font-bold text-sm" style={{ color: "#fff" }}>{TESTIMONIALS[0].name}</div>
                <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--signal)" }}>{TESTIMONIALS[0].role}</div>
              </div>
            </BentoTile>

            {/* PNPC stats — 2 tiles */}
            {PNPC_STATS.slice(0, 2).map((s, i) => (
              <BentoTile key={s.label} span="md:col-span-3" variant={i === 0 ? "accent" : "stat"}>
                <div className="font-display text-5xl md:text-6xl leading-none mb-2">{s.value}</div>
                <div className="text-[10px] uppercase tracking-[0.22em] font-bold opacity-80">{t(s.label)}</div>
              </BentoTile>
            ))}

            {/* Industrias chips */}
            <BentoTile span="col-span-2 md:col-span-4" variant="neutral" eyebrow={t("22 sectores")} title={t("Industrias atendidas")}>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {INDUSTRIES.slice(0, 14).map((ind) => (
                  <span key={ind} className="text-[10px] uppercase tracking-[0.15em] border border-[color:var(--border)] px-2 py-1 rounded-full">
                    {ind}
                  </span>
                ))}
                <span className="text-[10px] uppercase tracking-[0.15em] text-brand-blue font-bold px-2 py-1">
                  +{INDUSTRIES.length - 14}
                </span>
              </div>
            </BentoTile>

            {/* Divisiones */}
            <BentoTile span="md:col-span-2" variant="dark" eyebrow="KAEE Group" title={t("5 divisiones")}>
              <div className="mt-3 space-y-1.5">
                {DIVISIONS.map((d) => (
                  <div key={d.tag} className="flex items-baseline gap-2 text-xs">
                    <span className="font-display text-sm w-12 shrink-0" style={{ color: "var(--signal)" }}>{d.tag}</span>
                    <span className="leading-tight" style={{ color: "rgba(255,255,255,0.78)" }}>{d.name}</span>
                  </div>
                ))}
              </div>
            </BentoTile>
          </BentoGrid>
        </div>
      </section>

      {/* ============== FINAL CTA BENTO ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-[color:var(--surface-2)] border-t border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <BentoGrid>
            <BentoTile span="col-span-2 md:col-span-4 md:row-span-2" variant="image" image={office}>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "var(--signal)" }}>
                {t("Cotice en menos de 24 h")}
              </div>
              <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight mb-4" style={{ color: "#fff" }}>
                {t("Comparta su necesidad")}<br />
                <span style={{ color: "var(--signal)" }}>{t("respondemos hoy.")}</span>
              </h2>
              <p className="text-sm md:text-base max-w-xl mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
                {t("Equipo, capacitación o ingeniería. Un especialista lo contactará el mismo día.")}
              </p>
              <div className="flex flex-wrap gap-3 mt-auto relative z-10">
                <Link to="/contacto" className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md" style={{ background: "var(--signal)", color: "var(--anchor-fixed)" }}>
                  {t("Solicitar cotización")}
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
