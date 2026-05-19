import { createFileRoute, Link } from "@tanstack/react-router";
import heroEngineer from "@/assets/hero-engineer.jpg";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";
import { PNPC_STATS, TESTIMONIALS, DIVISIONS, CLIENTS_FULL, INDUSTRIES } from "@/data/kaee";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "KG Safety · 12 años eliminando riesgos de caída en México" },
      {
        name: "description",
        content:
          "KAEE Group: capacitación DC-3, ingeniería de líneas de vida y EPP certificado. 12 años sin accidentes, 200+ clientes, 30M+ horas-hombre supervisadas. Presencia en México, Colombia y Chile.",
      },
      { property: "og:title", content: "KG Safety · Eliminación de riesgos laborales" },
      {
        property: "og:description",
        content: "Soluciones integrales en seguridad para trabajos en altura, espacios confinados y renta de equipos.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const STATS = [
  { value: "12 años", labelKey: "Sin accidentes en sistemas instalados", accent: true },
  { value: "30M+",   labelKey: "Horas-hombre supervisadas" },
  { value: "200+",   labelKey: "Clientes corporativos", accent: true },
  { value: "3 países", labelKey: "México · Colombia · Chile" },
];

const SERVICES = [
  { n: "01", titleKey: "Capacitación DC-3 (W@H)", descKey: "Cuatro niveles certificados en 10 áreas técnicas: alturas, confinados, andamios, LOTO, electricidad, calor y más.", to: "/capacitacion" as const, ctaKey: "Ver cursos" },
  { n: "02", titleKey: "Ingeniería WoLL", descKey: "Diseño, fabricación e instalación de líneas de vida verticales y horizontales bajo NOM-009-STPS.", to: "/ingenieria" as const, ctaKey: "Solicitar diagnóstico" },
  { n: "03", titleKey: "Equipos certificados S@H", descKey: "EPP, anclajes, barandales, domos, plataformas y escalas con marcas líderes. Venta, renta y certificación.", to: "/equipos" as const, ctaKey: "Ver catálogo" },
  { n: "04", titleKey: "Consultoría MS&S", descKey: "Visita en sitio, asesoría, supervisión, certificación e instalación con cobertura nacional.", to: "/ingenieria" as const, ctaKey: "Agendar visita" },
  { n: "05", titleKey: "P.N.P.C. Contratistas", descKey: "Estandariza la seguridad de tus proveedores externos con el programa nacional propietario de KAEE.", to: "/contratistas" as const, ctaKey: "Conocer programa" },
  { n: "06", titleKey: "Soluciones por industria", descKey: "Silos, techos, espacios confinados, construcción y rack de tubería para 22 sectores.", to: "/soluciones" as const, ctaKey: "Ver industrias" },
];

const KAEE = [
  { letter: "K", title: "Knowledge", descKey: "Transferencia de conocimiento técnico normativo nacional e internacional." },
  { letter: "A", title: "Analysis", descKey: "Evaluación exhaustiva de riesgos específicos en sitio con equipo certificado." },
  { letter: "E", title: "Engineering", descKey: "Diseño y fabricación a medida de sistemas de anclaje y líneas de vida." },
  { letter: "E", title: "Elimination", descKey: "Implementación final para la eliminación total del riesgo de caída." },
];

function Index() {
  const { t } = useT();
  return (
    <div className="bg-anchor text-white">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-12 py-20 border-b border-white/5 overflow-hidden">
        <div className="max-w-4xl z-10 relative">
          <SectionLabel>{t("Líder en ingeniería de alturas")}</SectionLabel>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 leading-[0.95] tracking-tight">
            {t("WE NEVER")}<br />
            <span className="text-signal">{t("FALL.")}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 leading-relaxed">
            {t("Soluciones integrales en seguridad industrial para empresas Clase Mundial.")}{" "}
            <span className="kg-highlight font-semibold">{t("Ingeniería aplicada a la eliminación total de riesgos de caída.")}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contacto" className="bg-signal text-anchor px-8 md:px-10 py-4 md:py-5 font-bold uppercase text-sm tracking-widest hover:scale-105 transition-transform text-center shadow-[6px_6px_0_0_var(--anchor-fixed)]">
              {t("Cotizar ahora")} →
            </Link>
            <Link to="/ingenieria" className="border-2 border-brand-navy text-brand-navy px-8 md:px-10 py-4 md:py-5 font-bold uppercase text-sm tracking-widest hover:bg-brand-navy hover:text-white transition-colors text-center">
              {t("Líneas de vida")}
            </Link>
          </div>
          <div className="mt-12 inline-flex items-center gap-4 bg-signal text-anchor pl-5 pr-6 py-3 shadow-[5px_5px_0_0_rgba(0,0,0,0.6)]">
            <div className="font-display text-3xl md:text-4xl">30M+</div>
            <div className="text-[10px] uppercase tracking-[0.22em] leading-snug font-bold">
              {t("Horas-hombre supervisadas")}<br />{t("sin accidentes reportados")}
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-full md:w-[55%] h-full opacity-30 md:opacity-60 pointer-events-none">
          <img src={heroEngineer} alt="Ingeniero de seguridad inspeccionando una estructura industrial" className="w-full h-full object-cover object-center" width={1280} height={1600} />
          <div className="absolute inset-0 bg-gradient-to-r from-anchor via-anchor/40 to-transparent md:via-transparent" />
        </div>
      </section>

      {/* CLIENT LOGOS — auto-sliding marquee */}
      <section className="border-y-2 border-signal bg-steel py-8 overflow-hidden">
        <p className="text-signal text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-center">
          {t("Confiado por líderes de la industria")}
        </p>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-12 md:gap-16 animate-marquee-slow whitespace-nowrap w-max px-6">
            {[...CLIENTS_FULL, ...CLIENTS_FULL].map((c, i) => (
              <div key={`${c}-${i}`} className="font-display text-base md:text-xl text-white tracking-tight shrink-0">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5">
        {STATS.map((s, i) => (
          <div key={s.labelKey} className={`p-8 md:p-12 ${i < STATS.length - 1 ? "border-r border-white/5" : ""}`}>
            <div className={`text-3xl md:text-4xl font-display mb-2 ${s.accent ? "text-signal" : ""}`}>{s.value}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 leading-relaxed">{t(s.labelKey)}</div>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <SectionLabel>{t("División técnica")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl mb-6 leading-tight uppercase">
              {t("Cinco frentes contra")}<br />la <span className="text-signal">{t("gravedad")}</span>.
            </h2>
            <p className="text-white/60 text-lg">
              {t("Cada servicio diseñado para convertir riesgo crítico en operación controlada.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {SERVICES.map((s) => (
              <div key={s.titleKey} className="bg-anchor p-8 hover:bg-steel transition-colors group flex flex-col">
                <div className="font-display text-signal text-xs mb-6">{s.n} / 06</div>
                <h3 className="font-display text-lg uppercase mb-4 leading-tight">{t(s.titleKey)}</h3>
                <p className="text-sm text-white/55 mb-8 flex-1 leading-relaxed">{t(s.descKey)}</p>
                <Link to={s.to} className="text-signal font-bold text-[10px] uppercase tracking-widest border-b border-signal pb-1 self-start group-hover:translate-x-1 transition-transform">
                  {t(s.ctaKey)} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD K.A.E.E. */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-20 items-start">
          <div>
            <SectionLabel>{t("Método propietario")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl mb-6 leading-tight uppercase">
              {t("El método")} <span className="text-signal">K.A.E.E.</span>
            </h2>
            <p className="text-white/60 text-lg mb-12 leading-relaxed">
              {t("Metodología registrada que reduce a cero los accidentes en trabajos en altura bajo implementación del programa completo.")}
            </p>
            <Link to="/nosotros" className="inline-block border border-white/20 px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-colors">
              {t("Conoce el método →")}
            </Link>
          </div>

          <div className="space-y-8">
            {KAEE.map((k, i) => (
              <div key={i} className="flex gap-6 border-l-2 border-white/10 pl-6 pb-2">
                <div className="text-signal font-display text-3xl leading-none w-10 shrink-0">{k.letter}</div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider mb-2 text-sm">{k.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{t(k.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUB-BRANDS / DIVISIONES — todas las 5 marcas KAEE Group */}
      <section className="py-16 md:py-20 px-6 md:px-12 border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <SectionLabel>{t("Divisiones KAEE Group")}</SectionLabel>
            <h2 className="font-display text-2xl md:text-4xl uppercase mt-4 text-[color:var(--on-surface)]">
              {t("Cinco marcas, un solo grupo")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {DIVISIONS.map((b) => (
              <div key={b.tag} className="kg-bento p-6 text-center">
                <div className="font-display text-brand-blue text-2xl mb-3">{b.tag}</div>
                <div className="font-display text-sm uppercase text-[color:var(--on-surface)] tracking-tight mb-3 leading-tight">{b.name}</div>
                <div className="text-xs text-[color:color-mix(in_oklab,var(--on-surface)_65%,transparent)] leading-snug">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS REALES — con nombres del sitio anterior */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <SectionLabel>{t("Testimonios")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl uppercase mt-4 text-[color:var(--on-surface)]">
              {t("Voces de nuestros clientes")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tm) => (
              <div key={tm.name} className="kg-bento p-8 flex flex-col">
                <div className="text-signal text-4xl font-display mb-4 leading-none">"</div>
                <p className="text-[color:color-mix(in_oklab,var(--on-surface)_80%,transparent)] italic leading-relaxed mb-6 flex-1">
                  {tm.quote}
                </p>
                <div className="border-t border-[color:var(--border)] pt-4">
                  <div className="font-bold text-sm text-[color:var(--on-surface)] leading-tight">{tm.name}</div>
                  <div className="text-xs text-brand-blue uppercase tracking-widest mt-1">{tm.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PNPC NUMBERS — del sitio anterior */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-brand-navy text-white border-y-8 border-signal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-signal text-[color:var(--anchor-fixed)] px-4 py-2 mb-4 text-[10px] font-bold uppercase tracking-[0.25em]">
              <span className="w-1.5 h-1.5 bg-[color:var(--anchor-fixed)] rounded-full" />
              {t("Programa P.N.P.C.")}
            </div>
            <h2 className="font-display text-2xl md:text-4xl uppercase">
              {t("Resultados verificables")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
            {PNPC_STATS.map((s) => (
              <div key={s.label} className="bg-brand-navy p-8 text-center">
                <div className="font-display text-3xl md:text-5xl text-signal mb-3">{s.value}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/70 leading-relaxed">{t(s.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIAS */}
      <section className="py-16 md:py-20 px-6 md:px-12 border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <SectionLabel>{t("Industrias atendidas")}</SectionLabel>
            <h2 className="font-display text-2xl md:text-4xl uppercase mt-4 text-[color:var(--on-surface)]">
              {t("22 sectores · cobertura nacional")}
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
            {INDUSTRIES.map((ind) => (
              <span key={ind} className="kg-pill-outline">{ind}</span>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/soluciones" className="inline-block border-2 border-brand-navy text-brand-navy px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-brand-navy hover:text-white transition-colors">
              {t("Ver todas las soluciones")} →
            </Link>
          </div>
        </div>
      </section>


      {/* P.N.P.C. CTA — navy bento with yellow safety stripe */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-brand-navy text-white border-t-8 border-signal">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-signal text-anchor px-4 py-2 mb-8 text-[10px] font-bold uppercase tracking-[0.25em]">
            <span className="w-1.5 h-1.5 bg-anchor rounded-full" />
            {t("Programa propietario · 10 años")}
          </div>
          <h2 className="font-display text-3xl md:text-5xl mb-8 uppercase leading-tight">
            {t("Programa Nacional de Profesionalización a Contratistas")}
          </h2>
          <p className="text-base md:text-lg mb-10 opacity-80 max-w-2xl mx-auto leading-relaxed">
            {t("Estandarice la seguridad de sus proveedores externos bajo los protocolos más estrictos de KG Safety.")}
          </p>
          <Link to="/contratistas" className="inline-block bg-signal text-anchor px-10 md:px-12 py-5 md:py-6 font-display text-xs md:text-sm tracking-widest hover:bg-white transition-colors uppercase border-2 border-signal shadow-[5px_5px_0_0_rgba(255,255,255,0.15)]">
            {t("Solicitar auditoría P.N.P.C.")} →
          </Link>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="py-12 px-6 md:px-12 bg-steel border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between gap-8 md:gap-12 items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {t("Certificados y alineados:")}
          </span>
          <div className="flex flex-wrap gap-8 md:gap-10 font-display text-xs text-white/60 uppercase tracking-widest">
            <span>STPS</span><span>OSHA</span><span>ANSI Z359</span>
            <span>NOM-009-STPS</span><span>EN-795</span><span>CSA Z259</span>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl mb-6 leading-tight uppercase">
            {t("Cotice su proyecto en")} <span className="text-signal">{t("menos de 24 horas")}</span>.
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            {t("Comparta su necesidad: equipo, capacitación o ingeniería. Un especialista lo contactará el mismo día.")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contacto" className="bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
              {t("Solicitar cotización")}
            </Link>
            <a href="https://wa.me/527228795076" target="_blank" rel="noopener noreferrer" className="border border-white/20 px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white/5 transition-colors">
              {t("WhatsApp directo")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
