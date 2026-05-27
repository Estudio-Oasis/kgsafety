import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { AuditableDeliverables } from "@/components/site/AuditableDeliverables";
import { COURSES, EQUIPMENT, ENGINEERING, SOLUTION_FAMILIES } from "@/data/kaee";

export const Route = createFileRoute("/servicios")({
  component: ServiciosPage,
  head: () => ({
    meta: [
      { title: "Servicios · Capacitación, equipos e ingeniería · KG Safety" },
      { name: "description", content: "Catálogo integral de servicios KG Safety: capacitación DC-3, equipos certificados, ingeniería de líneas de vida, supervisión, certificación e instalación." },
      { property: "og:title", content: "Servicios · KG Safety" },
      { property: "og:description", content: "Capacitación, equipos, ingeniería y P.N.P.C. — todo el portafolio operativo en un solo lugar." },
    ],
    links: [{ rel: "canonical", href: "/servicios" }],
  }),
});

const PILLARS = [
  {
    tag: "01",
    title: "Capacitación",
    to: "/capacitacion" as const,
    desc: "10 áreas técnicas en 3 niveles. DC-3 oficial STPS, OSHA 10 y OSHA 30.",
    stat: `${COURSES.length} cursos`,
    cta: "Ver cursos",
  },
  {
    tag: "02",
    title: "Equipos Safety@Heights",
    to: "/equipos" as const,
    desc: "Catálogo certificado: EPP, conexión, anclajes, líneas de vida, andamios y plataformas.",
    stat: `${EQUIPMENT.length} categorías`,
    cta: "Ver catálogo",
  },
  {
    tag: "03",
    title: "Ingeniería WoLL",
    to: "/ingenieria" as const,
    desc: "Asesoría, consultoría, soluciones a la medida, supervisión, certificación e instalación.",
    stat: `${ENGINEERING.length} servicios`,
    cta: "Ver ingeniería",
  },
  {
    tag: "04",
    title: "P.N.P.C. Contratistas",
    to: "/contratistas" as const,
    desc: "Programa Nacional de Profesionalización a Contratistas — estandariza la seguridad de tus proveedores.",
    stat: "2,094+ contratistas",
    cta: "Ver programa",
  },
];

function ServiciosPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative px-6 md:px-12 py-20 md:py-28 border-b border-[color:var(--border)] bg-[color:var(--brand-navy)] kg-on-dark">
        <div className="max-w-6xl relative z-10">
          <SectionLabel>Portafolio operativo</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[1.05] mb-6" style={{ color: "#fff" }}>
            Cuatro pilares.<br />
            <span className="text-signal">Una sola responsabilidad: que vuelvan a casa.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            Capacitación, equipos, ingeniería y programa de contratistas. Todo el ciclo de seguridad en altura — diseñado, ejecutado y auditado por el mismo equipo.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/contacto" className="bg-signal text-anchor px-8 py-4 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
              Solicitar diagnóstico
            </Link>
            <a href="https://wa.me/527228795076" target="_blank" rel="noopener noreferrer" className="px-8 py-4 font-bold uppercase text-sm tracking-widest border border-white/40 text-white hover:bg-white/10 transition-colors">
              WhatsApp directo
            </a>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Los 4 pilares</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight mb-12 text-[color:var(--on-surface)]">
            Cada servicio se contrata <span className="text-signal">por separado o como sistema.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
            {PILLARS.map((p) => (
              <Link key={p.tag} to={p.to} className="bg-[color:var(--surface)] p-8 flex flex-col group hover:bg-[color:var(--surface-2)] transition-colors">
                <div className="font-display text-signal text-xs mb-4 tracking-[0.22em]">{p.tag}</div>
                <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-[color:var(--on-surface)] leading-tight mb-3">{p.title}</h3>
                <p className="text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] leading-relaxed mb-6">{p.desc}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[color:var(--border)]">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-blue">{p.stat}</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal group-hover:translate-x-1 transition-transform">{p.cta} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAMILIAS DE SOLUCIONES */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[color:var(--surface-2)] border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Familias de aplicación</SectionLabel>
              <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight text-[color:var(--on-surface)]">
                Por frente <span className="text-signal">de trabajo</span>
              </h2>
            </div>
            <Link to="/soluciones" className="text-brand-blue font-bold text-[11px] uppercase tracking-[0.22em] border-b border-brand-blue pb-1">
              Ver soluciones por industria →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SOLUTION_FAMILIES.map((f) => (
              <article key={f.slug} className="kg-bento p-6 flex flex-col">
                <h3 className="font-display text-xl uppercase tracking-tight text-[color:var(--on-surface)] mb-2">{f.name}</h3>
                <p className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_65%,transparent)] leading-relaxed mb-4">{f.desc}</p>
                <ul className="flex flex-wrap gap-1.5 mt-auto">
                  {f.apps.slice(0, 6).map((a) => (
                    <li key={a} className="text-[10px] font-bold uppercase tracking-widest border border-[color:var(--border)] px-2 py-1 text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)]">
                      {a}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ENTREGABLES */}
      <AuditableDeliverables variant="light" />

      {/* CTA */}
      <section className="px-6 md:px-12 py-16 md:py-20 text-center border-t border-[color:var(--border)] bg-[color:var(--brand-navy)] kg-on-dark">
        <h2 className="font-display text-3xl md:text-5xl uppercase mb-6" style={{ color: "#fff" }}>
          ¿No sabe por dónde empezar?
        </h2>
        <p className="max-w-2xl mx-auto mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
          Un especialista evalúa su operación y le entrega una propuesta priorizada el mismo día hábil.
        </p>
        <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
          Solicitar diagnóstico
        </Link>
      </section>
    </div>
  );
}
