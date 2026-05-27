import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { INDUSTRIES, CLIENTS_FULL } from "@/data/kaee";
import plantImg from "@/assets/industries-plant.jpg";

export const Route = createFileRoute("/industrias")({
  component: IndustriasPage,
  head: () => ({
    meta: [
      { title: "Industrias atendidas · 22 sectores · KG Safety" },
      { name: "description", content: "KG Safety opera en 22+ sectores: alimenticia, farmacéutica, automotriz, energética, petroquímica, manufactura, construcción y más. Cobertura LATAM." },
      { property: "og:title", content: "Industrias · KG Safety" },
      { property: "og:description", content: "22 sectores con experiencia técnica en alturas, ingeniería de líneas de vida y P.N.P.C." },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/industrias" }],
  }),
});

// Agrupación por familias amplias
const INDUSTRY_GROUPS = [
  {
    tag: "01",
    name: "Consumo y Alimentos",
    desc: "Plantas con líneas de producción 24/7, sanitización crítica y altura sobre maquinaria activa.",
    items: ["Alimenticia", "Farmacéutica", "Textil"],
  },
  {
    tag: "02",
    name: "Industria Pesada y Energía",
    desc: "Operación en caliente, atmósferas peligrosas y estructuras de gran altura.",
    items: ["Siderúrgica", "Química", "Petroquímica", "Energía Eólica", "Plantas nucleares"],
  },
  {
    tag: "03",
    name: "Automotriz y Manufactura",
    desc: "Naves industriales, racks, paros de planta y montaje de líneas.",
    items: ["Automotriz", "Manufacturera", "Camiones y Trenes"],
  },
  {
    tag: "04",
    name: "Infraestructura y Construcción",
    desc: "Obra nueva, mantenimiento mayor, montaje de estructuras y trabajos verticales.",
    items: ["Inmobiliaria", "Puentes", "Presas", "Mantenimiento de Edificios"],
  },
  {
    tag: "05",
    name: "Logística y Comercio",
    desc: "Centros de distribución, rack selectivo y mantenimiento de inmuebles comerciales.",
    items: ["Rack de Almacenamiento", "Centros Comerciales", "Anuncios Publicitarios"],
  },
  {
    tag: "06",
    name: "Telecom, Aviación y Eventos",
    desc: "Torres, antenas, hangares y aforos masivos con riesgo en altura.",
    items: ["Telecomunicaciones", "Aeronáutica", "Grúas", "Estadios"],
  },
];

function IndustriasPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative px-6 md:px-12 py-20 md:py-28 border-b border-[color:var(--border)] overflow-hidden">
        <div className="absolute inset-0">
          <img src={plantImg} alt="" loading="eager" width={1600} height={900} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--brand-navy)] via-[color:var(--brand-navy)]/85 to-[color:var(--brand-navy)]/55" />
        </div>
        <div className="kg-on-dark max-w-5xl relative z-10">
          <SectionLabel>{INDUSTRIES.length}+ sectores · cobertura LATAM</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[1.05] mb-6" style={{ color: "#fff" }}>
            Cada industria<br />
            <span className="text-signal">tiene su riesgo crítico.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            Diseñamos protocolos por sector: lo que funciona en una planta de alimentos no aplica en una torre eólica. Ingeniería y capacitación adaptadas a su operación.
          </p>
        </div>
      </section>

      {/* GRUPOS */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Familias de industria</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight mb-12 text-[color:var(--on-surface)]">
            Seis grandes <span className="text-signal">verticales</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
            {INDUSTRY_GROUPS.map((g) => (
              <article key={g.tag} className="bg-[color:var(--surface)] p-7 flex flex-col">
                <div className="font-display text-signal text-xs mb-4 tracking-[0.22em]">{g.tag}</div>
                <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight text-[color:var(--on-surface)] leading-tight mb-3">{g.name}</h3>
                <p className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_65%,transparent)] leading-relaxed mb-5">{g.desc}</p>
                <ul className="flex flex-wrap gap-1.5 mt-auto">
                  {g.items.map((it) => (
                    <li key={it} className="text-[10px] font-bold uppercase tracking-widest border border-[color:var(--border)] px-2 py-1 text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)]">
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTES */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[color:var(--surface-2)] border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Algunos clientes</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight mb-10 text-[color:var(--on-surface)]">
            Operaciones <span className="text-signal">críticas</span> nos confían su gente
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
            {CLIENTS_FULL.map((c) => (
              <div key={c} className="bg-[color:var(--surface)] px-3 py-5 text-center font-display text-[11px] md:text-xs uppercase tracking-[0.15em] text-[color:var(--on-surface)] flex items-center justify-center min-h-[64px]">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-16 md:py-20 text-center border-t border-[color:var(--border)]">
        <h2 className="font-display text-3xl md:text-5xl uppercase mb-6 text-[color:var(--on-surface)]">
          ¿Su sector no aparece?
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)]">
          Hemos atendido proyectos en industrias no listadas. Comparta su caso y armamos un protocolo a medida.
        </p>
        <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
          Hablar con un especialista
        </Link>
      </section>
    </div>
  );
}
