import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import plantImg from "@/assets/industries-plant.jpg";
import { INDUSTRIES, SOLUTIONS } from "@/data/kaee";

export const Route = createFileRoute("/soluciones")({
  component: SolucionesPage,
  head: () => ({
    meta: [
      { title: "Soluciones por industria y aplicación · KG Safety" },
      { name: "description", content: "Soluciones de seguridad para silos, techos, espacios confinados, construcción y rack de tubería en 22 industrias." },
      { property: "og:title", content: "Soluciones · KG Safety" },
      { property: "og:description", content: "Especialistas en alturas para industria pesada, alimenticia, farmacéutica, energética y más." },
    ],
    links: [{ rel: "canonical", href: "/soluciones" }],
  }),
});

function SolucionesPage() {
  return (
    <div>
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
      <section className="relative px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)] overflow-hidden">
        <div className="absolute inset-0">
          <img src={plantImg} alt="" loading="eager" width={1600} height={900} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/80 to-brand-navy/40" />
        </div>
        <div className="max-w-5xl relative z-10">
          <SectionLabel>Soluciones a la medida</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight text-white">
            Aplicaciones <span className="text-signal">y</span> sectores
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mb-10 leading-relaxed">
            Cinco familias de aplicaciones · veintidós industrias atendidas con ingeniería y capacitación KAEE Group.
          </p>
          <Link to="/contacto" className="inline-block bg-signal text-[color:var(--anchor-fixed)] px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors shadow-[6px_6px_0_0_rgba(0,0,0,0.45)]">
            Cotizar solución
          </Link>
        </div>
      </section>


      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Aplicaciones</SectionLabel>
          <h2 className="font-display text-2xl md:text-4xl uppercase mb-10 text-[color:var(--on-surface)]">Cinco frentes técnicos</h2>
          <div className="grid md:grid-cols-5 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
            {SOLUTIONS.map((s, i) => (
              <div key={s} className="bg-[color:var(--surface)] p-6">
                <div className="font-display text-signal text-xs mb-4">{String(i + 1).padStart(2, "0")} / 05</div>
                <h3 className="font-display text-base uppercase tracking-tight text-[color:var(--on-surface)]">{s}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24 bg-[color:var(--surface-2)] border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Industrias atendidas</SectionLabel>
          <h2 className="font-display text-2xl md:text-4xl uppercase mb-10 text-[color:var(--on-surface)]">22 sectores · cobertura nacional</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {INDUSTRIES.map((ind) => (
              <div key={ind} className="kg-bento p-4 text-sm font-bold uppercase tracking-tight text-[color:var(--on-surface)]">
                {ind}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
