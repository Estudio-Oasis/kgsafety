import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";

export const Route = createFileRoute("/nosotros")({
  component: NosotrosPage,
  head: () => ({
    meta: [
      { title: "Nosotros · Método K.A.E.E. · KG Safety" },
      {
        name: "description",
        content:
          "KG Fall Protection Engineering: diseño e implementación de sistemas de protección contra caídas con el método propietario K.A.E.E.",
      },
      { property: "og:title", content: "Nosotros · KG Safety" },
      {
        property: "og:description",
        content: "Conozca el método K.A.E.E., nuestros valores y nuestro equipo.",
      },
      { property: "og:url", content: "/nosotros" },
    ],
    links: [{ rel: "canonical", href: "/nosotros" }],
  }),
});

const KAEE = [
  {
    letter: "K",
    title: "Knowledge",
    desc: "Conocimiento bilateral para entendimiento claro entre cliente y equipo técnico.",
  },
  {
    letter: "A",
    title: "Analysis",
    desc: "Análisis en común con el cliente para lograr comunicación y objetivos definidos.",
  },
  {
    letter: "E",
    title: "Engineering",
    desc: "Aplicación de cualquier método de ingeniería necesario para lograr los objetivos.",
  },
  {
    letter: "E",
    title: "Elimination",
    desc: "Eliminación total de la problemática buscando el 100%.",
  },
];

const VALUES = [
  { title: "Seguridad", desc: "Sobre todo otro valor operativo." },
  { title: "Integridad", desc: "Documentación, normativa y cumplimiento sin excepción." },
  { title: "Ingeniería", desc: "Decisiones basadas en cálculo, no en suposición." },
  { title: "Servicio", desc: "Respuesta del mismo día, ejecución sin pretextos." },
  { title: "Innovación", desc: "Nuevos equipos, métodos y marcas evaluados continuamente." },
  { title: "Legalidad", desc: "Certeza jurídica plena en cada documento emitido." },
];

function NosotrosPage() {
  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>Quiénes somos</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            No solo diseñamos seguridad.<br />
            <span className="text-signal">Diseñamos tranquilidad.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            En KG nos especializamos en el diseño e implementación de sistemas de
            protección contra caídas que cumplen con los más altos estándares de
            ingeniería y seguridad. Cada estructura, cada persona y cada detalle importan.
          </p>
        </div>
      </section>

      {/* K.A.E.E. */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-steel">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <SectionLabel>Método registrado</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">
              Método <span className="text-signal">K.A.E.E.</span>
            </h2>
            <p className="text-white/60 mt-6 leading-relaxed">
              Cuatro etapas críticas de ingeniería aplicada. La metodología propietaria
              que reduce a cero los accidentes bajo implementación completa.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {KAEE.map((k, i) => (
              <div key={i} className="bg-anchor p-8">
                <div className="font-display text-signal text-6xl mb-6 leading-none">
                  {k.letter}
                </div>
                <h3 className="font-bold uppercase tracking-wider mb-3 text-sm">{k.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionLabel>Valores</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">
              Lo que nos hace innegociables.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {VALUES.map((v, i) => (
              <div key={v.title} className="bg-anchor p-8">
                <div className="font-display text-signal text-xs mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-lg uppercase mb-3">{v.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Normativa */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-steel">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Normatividad y reglamentación</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-12 uppercase leading-tight">
            Alineados con los más altos estándares.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {[
              "OSHA 1926 / 1910",
              "ANSI / ASSP",
              "CSA Z259",
              "EN-795",
              "NOM-009-STPS-2011",
              "Reglamentos internos por cliente",
            ].map((n) => (
              <div key={n} className="bg-anchor p-6 text-center">
                <span className="font-display text-sm uppercase text-white tracking-tight">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tagline + CTA */}
      <section className="py-20 md:py-28 px-6 md:px-12 text-center">
        <p className="font-display text-5xl md:text-7xl text-signal mb-10 leading-none">
          We never fall.
        </p>
        <Link
          to="/contacto"
          className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors"
        >
          Trabajemos juntos
        </Link>
      </section>
    </div>
  );
}
