import { createFileRoute, Link } from "@tanstack/react-router";
import heroEngineer from "@/assets/hero-engineer.jpg";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "KG Safety · Ingeniería que detiene la caída" },
      {
        name: "description",
        content:
          "Capacitación DC-3, equipos certificados y sistemas de anclaje para empresas Clase Mundial. 30M+ horas-hombre supervisadas sin accidentes.",
      },
      { property: "og:title", content: "KG Safety · Ingeniería que detiene la caída" },
      {
        property: "og:description",
        content: "Soluciones integrales en seguridad para trabajos en altura. Cotiza hoy.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const STATS = [
  { value: "23,578", labelKey: "Trabajadores capacitados" },
  { value: "30M+", labelKey: "Horas-hombre supervisadas", accent: true },
  { value: "1,560", labelKey: "Cursos impartidos" },
  { value: "980+", labelKey: "Clientes corporativos", accent: true },
];

const SERVICES = [
  { n: "01", titleKey: "Capacitación DC-3", descKey: "Tres niveles certificados: básico 8 h, supervisor 16 h y jefe de seguridad 24 h. Cobertura nacional.", to: "/capacitacion" as const, ctaKey: "Ver niveles" },
  { n: "02", titleKey: "Líneas de Vida e Ingeniería", descKey: "Diseño, fabricación e instalación de sistemas verticales y horizontales bajo NOM-009-STPS.", to: "/ingenieria" as const, ctaKey: "Solicitar diagnóstico" },
  { n: "03", titleKey: "Equipos certificados", descKey: "EPP, anclajes, malacates y rescatadores con marcas líderes. Venta, renta y certificación.", to: "/equipos" as const, ctaKey: "Ver catálogo" },
  { n: "04", titleKey: "Supervisión en sitio", descKey: "Monitoreo profesional para trabajos de alto riesgo, auditorías y emisión de certificados.", to: "/ingenieria" as const, ctaKey: "Agendar visita" },
  { n: "05", titleKey: "P.N.P.C. Contratistas", descKey: "Estandariza la seguridad de tus proveedores externos con el programa nacional.", to: "/contratistas" as const, ctaKey: "Conocer programa" },
];

const KAEE = [
  { letter: "K", title: "Knowledge", descKey: "Transferencia de conocimiento técnico normativo nacional e internacional." },
  { letter: "A", title: "Analysis", descKey: "Evaluación exhaustiva de riesgos específicos en sitio con equipo certificado." },
  { letter: "E", title: "Engineering", descKey: "Diseño y fabricación a medida de sistemas de anclaje y líneas de vida." },
  { letter: "E", title: "Elimination", descKey: "Implementación final para la eliminación total del riesgo de caída." },
];

const CLIENTS = ["COCA-COLA FEMSA", "HOLCIM", "UNILEVER", "MERCK", "PETSTAR", "SANTA CLARA", "BIMBO", "NESTLÉ", "CEMEX", "HEINEKEN", "GRUPO MODELO", "PEMEX"];

const SUBBRANDS = [
  { name: "Working at Heights", tag: "WAH" },
  { name: "Working on Life Lines", tag: "WoLL" },
  { name: "Safety@Heights", tag: "S@H" },
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
            <Link to="/ingenieria" className="border-2 border-signal text-signal px-8 md:px-10 py-4 md:py-5 font-bold uppercase text-sm tracking-widest hover:bg-signal hover:text-anchor transition-colors text-center">
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
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
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
                <div className="font-display text-signal text-xs mb-6">{s.n} / 05</div>
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

      {/* SUB-BRANDS — new section */}
      <section className="py-16 md:py-20 px-6 md:px-12 border-b border-white/5 bg-steel">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <SectionLabel>{t("Submarcas KAEE Group")}</SectionLabel>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {SUBBRANDS.map((b) => (
              <div key={b.tag} className="bg-anchor p-8 text-center">
                <div className="font-display text-signal text-2xl mb-3">{b.tag}</div>
                <div className="font-display text-base uppercase text-white tracking-tight">{b.name}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mt-3">a KAEE GROUP brand</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-signal text-5xl font-display mb-6 opacity-50">"</div>
          <p className="text-xl md:text-2xl font-light italic leading-relaxed mb-8 text-white">
            {t("La rigurosidad técnica de KG Safety transformó nuestra cultura operativa. No solo instalaron equipos: instalaron tranquilidad en procesos de alto riesgo.")}
          </p>
          <div className="font-display text-xs uppercase tracking-[0.3em] text-signal">
            {t("Grupo IOCISA — Cliente Industrial")}
          </div>
        </div>
      </section>

      {/* P.N.P.C. CTA */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-signal text-anchor">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl mb-8 uppercase leading-tight">
            {t("Programa Nacional de Profesionalización a Contratistas")}
          </h2>
          <p className="text-base md:text-lg font-bold mb-10 opacity-80 uppercase tracking-tight max-w-2xl mx-auto">
            {t("Estandarice la seguridad de sus proveedores externos bajo los protocolos más estrictos de KG Safety.")}
          </p>
          <Link to="/contratistas" className="inline-block bg-anchor text-white px-10 md:px-12 py-5 md:py-6 font-display text-xs md:text-sm tracking-widest hover:bg-steel transition-colors uppercase">
            {t("Solicitar auditoría P.N.P.C.")}
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
