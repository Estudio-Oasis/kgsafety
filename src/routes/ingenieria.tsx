import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import installImg from "@/assets/engineering-install.jpg";

export const Route = createFileRoute("/ingenieria")({
  component: IngenieriaPage,
  head: () => ({
    meta: [
      { title: "Ingeniería · Líneas de vida y anclajes · KG Safety" },
      {
        name: "description",
        content:
          "Diseño, fabricación e instalación de líneas de vida verticales y horizontales, anclajes y plataformas bajo NOM-009-STPS y OSHA.",
      },
      { property: "og:title", content: "Ingeniería · KG Safety" },
      {
        property: "og:description",
        content:
          "Sistemas de anclaje y líneas de vida diseñados a medida con certificación.",
      },
      { property: "og:url", content: "/ingenieria" },
    ],
    links: [{ rel: "canonical", href: "/ingenieria" }],
  }),
});

const SERVICES = [
  {
    title: "Líneas de Vida Verticales",
    desc: "Sistemas LVV con cable y rigid rail para escaleras, torres y silos.",
  },
  {
    title: "Líneas de Vida Horizontales",
    desc: "Sistemas LVH overhead y a nivel: structural, rigid rail y cable base.",
  },
  {
    title: "Anclajes",
    desc: "Móviles, portátiles, temporales, removibles, individuales o colectivos. Compra o renta.",
  },
  {
    title: "Hand Rails",
    desc: "Barandales fijos y removibles para acceso seguro a zonas perimetrales.",
  },
  {
    title: "Plataformas y estructuras",
    desc: "Plataformas elevadoras y obra civil a medida con departamento propio.",
  },
  {
    title: "Supervisión y certificación",
    desc: "Auditorías, pruebas de carga y verificación periódica de sistemas.",
  },
];

const PROCESS = [
  { n: "01", title: "Diagnóstico en sitio", desc: "Visita técnica con ingeniero certificado." },
  { n: "02", title: "Propuesta de ingeniería", desc: "Diseño bajo NOM-009-STPS, OSHA, ANSI y EN-795." },
  { n: "03", title: "Fabricación", desc: "Manufactura controlada con materiales certificados." },
  { n: "04", title: "Montaje e instalación", desc: "Instaladores certificados con cobertura nacional." },
  { n: "05", title: "Certificación y entrega", desc: "Pruebas de carga, documentación y plan de mantenimiento." },
];

function IngenieriaPage() {
  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>Ingeniería aplicada</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            Sistemas de anclaje<br />
            <span className="text-signal">diseñados</span> a medida.
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
            Líneas de vida, anclajes, plataformas y estructuras de obra civil. Ingeniería
            certificada para cada estructura, cada persona, cada detalle.
          </p>
          <Link
            to="/contacto"
            className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors"
          >
            Agendar diagnóstico
          </Link>
        </div>
      </section>

      {/* Hero image */}
      <section className="border-b border-white/5">
        <img
          src={installImg}
          alt="Instalación de línea de vida horizontal en planta industrial"
          loading="lazy"
          width={1920}
          height={1080}
          className="w-full h-[40vh] md:h-[60vh] object-cover grayscale brightness-90"
        />
      </section>

      {/* Services grid */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionLabel>Catálogo de soluciones</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">
              Seis frentes técnicos
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="bg-anchor p-8 hover:bg-steel transition-colors">
                <div className="font-display text-signal text-xs mb-6">
                  {String(i + 1).padStart(2, "0")} / 06
                </div>
                <h3 className="font-display text-base uppercase mb-4 leading-tight">{s.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-steel">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionLabel>Proceso</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">
              De diagnóstico a <span className="text-signal">entrega certificada</span>.
            </h2>
          </div>
          <div className="grid md:grid-cols-5 gap-px bg-white/5 border border-white/5">
            {PROCESS.map((p) => (
              <div key={p.n} className="bg-anchor p-6">
                <div className="font-display text-signal text-2xl mb-4">{p.n}</div>
                <h4 className="font-bold uppercase text-xs tracking-wider mb-3">{p.title}</h4>
                <p className="text-xs text-white/55 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 md:px-12 text-center">
        <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
          Cada estructura <span className="text-signal">merece</span> un anclaje propio.
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
          Pida una visita técnica sin costo. Nuestros ingenieros responden el mismo día.
        </p>
        <Link
          to="/contacto"
          className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors"
        >
          Solicitar visita técnica
        </Link>
      </section>
    </div>
  );
}
