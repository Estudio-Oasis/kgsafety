import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";

export const Route = createFileRoute("/equipos")({
  component: EquiposPage,
  head: () => ({
    meta: [
      { title: "Equipos certificados · EPP y anclajes · KG Safety" },
      {
        name: "description",
        content:
          "Catálogo de equipos para trabajos en altura: arneses, malacates, cuerdas, anclajes y rescatadores con marcas líderes.",
      },
      { property: "og:title", content: "Equipos certificados · KG Safety" },
      {
        property: "og:description",
        content: "EPP, anclajes y sistemas removibles para altura y espacios confinados.",
      },
      { property: "og:url", content: "/equipos" },
    ],
    links: [{ rel: "canonical", href: "/equipos" }],
  }),
});

const CATEGORIES = [
  { name: "Arneses y EPP", desc: "Equipo de protección personal certificado ANSI / OSHA." },
  { name: "Anclajes", desc: "Fijos, móviles, temporales, individuales y colectivos." },
  { name: "Malacates manuales", desc: "Para elevación y manejo controlado de cargas." },
  { name: "Malacates eléctricos", desc: "Operación industrial de alto ciclo." },
  { name: "Cuerdas y cables", desc: "Líneas de seguridad de acero y sintéticas." },
  { name: "Ganchos, poleas, grilletes", desc: "Hardware certificado con trazabilidad." },
  { name: "Anclajes de suelo", desc: "Bases removibles y soluciones permanentes." },
  { name: "Abrazaderas y troles", desc: "Sistemas de fijación y desplazamiento." },
  { name: "Descensores de emergencia", desc: "Equipos auto-rescatadores certificados." },
  { name: "Rescatadores de E.C.", desc: "Equipo especializado para espacios confinados." },
  { name: "Sistemas removibles", desc: "Soluciones temporales para baja frecuencia." },
  { name: "Plataformas elevadoras", desc: "Acceso seguro a altura controlada." },
];

const BRANDS = ["Petzl", "MSA", "3M", "Honeywell", "Capital Safety", "Tractel", "Yale", "Miller"];

function EquiposPage() {
  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>Catálogo de equipos</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            Equipos certificados,<br />
            <span className="text-signal">trazables</span>, garantizados.
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
            Más de 30 marcas de representación. Asesoría en selección, fichas técnicas y
            cotización inmediata para venta, renta y certificación.
          </p>
          <Link
            to="/contacto"
            className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors"
          >
            Solicitar catálogo PDF
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionLabel>Categorías</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase">12 líneas de producto</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.name}
                to="/contacto"
                className="bg-anchor p-7 hover:bg-steel transition-colors group block"
              >
                <div className="font-display text-signal text-xs mb-5">
                  {String(i + 1).padStart(2, "0")} / 12
                </div>
                <h3 className="font-display text-base uppercase mb-3 leading-tight">{c.name}</h3>
                <p className="text-sm text-white/55 mb-6 leading-relaxed">{c.desc}</p>
                <span className="text-signal font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-1 inline-block transition-transform">
                  Cotizar →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="px-6 md:px-12 py-16 md:py-20 bg-steel border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-center">
            Más de 30 marcas representadas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {BRANDS.map((b) => (
              <span key={b} className="font-display text-base md:text-lg text-white/60 uppercase tracking-tight">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 md:px-12 text-center">
        <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
          ¿Sabe qué equipo necesita? <span className="text-signal">¿O necesita asesoría?</span>
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
          Compártanos su proyecto y un ingeniero le arma una propuesta puntual.
        </p>
        <Link
          to="/contacto"
          className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors"
        >
          Cotizar equipos
        </Link>
      </section>
    </div>
  );
}
