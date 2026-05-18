import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/nosotros")({
  component: NosotrosPage,
  head: () => ({
    meta: [
      { title: "Nosotros · Método K.A.E.E. · KG Safety" },
      { name: "description", content: "KG Fall Protection Engineering: diseño e implementación de sistemas de protección contra caídas con el método propietario K.A.E.E." },
      { property: "og:title", content: "Nosotros · KG Safety" },
      { property: "og:description", content: "Conozca el método K.A.E.E., nuestros valores y nuestro equipo." },
      { property: "og:url", content: "/nosotros" },
    ],
    links: [{ rel: "canonical", href: "/nosotros" }],
  }),
});

const KAEE = [
  { letter: "K", title: "Knowledge", descKey: "Conocimiento bilateral para entendimiento claro entre cliente y equipo técnico." },
  { letter: "A", title: "Analysis", descKey: "Análisis en común con el cliente para lograr comunicación y objetivos definidos." },
  { letter: "E", title: "Engineering", descKey: "Aplicación de cualquier método de ingeniería necesario para lograr los objetivos." },
  { letter: "E", title: "Elimination", descKey: "Eliminación total de la problemática buscando el 100%." },
];

const VALUES = [
  { titleKey: "Seguridad", descKey: "Sobre todo otro valor operativo." },
  { titleKey: "Integridad", descKey: "Documentación, normativa y cumplimiento sin excepción." },
  { titleKey: "Ingeniería", descKey: "Decisiones basadas en cálculo, no en suposición." },
  { titleKey: "Servicio", descKey: "Respuesta del mismo día, ejecución sin pretextos." },
  { titleKey: "Innovación", descKey: "Nuevos equipos, métodos y marcas evaluados continuamente." },
  { titleKey: "Legalidad", descKey: "Certeza jurídica plena en cada documento emitido." },
];

function NosotrosPage() {
  const { t } = useT();
  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>{t("Quiénes somos")}</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            {t("No solo diseñamos seguridad.")}<br />
            <span className="text-signal">{t("Diseñamos tranquilidad.")}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            {t("En KG nos especializamos en el diseño e implementación de sistemas de protección contra caídas que cumplen con los más altos estándares de ingeniería y seguridad. Cada estructura, cada persona y cada detalle importan.")}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-steel">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <SectionLabel>{t("Método registrado")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">
              {t("Método")} <span className="text-signal">K.A.E.E.</span>
            </h2>
            <p className="text-white/60 mt-6 leading-relaxed">
              {t("Cuatro etapas críticas de ingeniería aplicada. La metodología propietaria que reduce a cero los accidentes bajo implementación completa.")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {KAEE.map((k, i) => (
              <div key={i} className="bg-anchor p-8">
                <div className="font-display text-signal text-6xl mb-6 leading-none">{k.letter}</div>
                <h3 className="font-bold uppercase tracking-wider mb-3 text-sm">{k.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{t(k.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionLabel>{t("Valores")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">
              {t("Lo que nos hace innegociables.")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {VALUES.map((v, i) => (
              <div key={v.titleKey} className="bg-anchor p-8">
                <div className="font-display text-signal text-xs mb-4">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display text-lg uppercase mb-3">{t(v.titleKey)}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{t(v.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comunicación efectiva — NEW */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-steel">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{t("Comunicación efectiva en seguridad")}</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
            {t("Nueve pilares operativos")}
          </h2>
          <p className="text-white/70 leading-relaxed text-lg max-w-3xl">
            {t("Aseguramos comunicación, comprensión, detección de causa raíz, evaluación contra estándar, validación de proveedores, certificación de personal, flujo previo a trabajos en altura y capacitación continua.")}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{t("Normatividad y reglamentación")}</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-12 uppercase leading-tight">
            {t("Alineados con los más altos estándares.")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {["OSHA 1926 / 1910", "ANSI / ASSP", "CSA Z259", "EN-795", "NOM-009-STPS-2011", "Reglamentos internos por cliente"].map((n) => (
              <div key={n} className="bg-anchor p-6 text-center">
                <span className="font-display text-sm uppercase text-white tracking-tight">{t(n)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12 text-center">
        <p className="font-display text-5xl md:text-7xl text-signal mb-10 leading-none">
          {t("We never fall.")}
        </p>
        <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
          {t("Trabajemos juntos")}
        </Link>
      </section>
    </div>
  );
}
