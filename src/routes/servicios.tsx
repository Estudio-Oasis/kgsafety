import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { AuditableDeliverables } from "@/components/site/AuditableDeliverables";
import { SOLUTION_FAMILIES, SERVICE_DETAILS } from "@/data/kaee";
import { QuoteBillingBanner } from "@/components/site/QuoteBillingBanner";

export const Route = createFileRoute("/servicios")({
  component: ServiciosPage,
  head: () => ({
    meta: [
      { title: "Servicios · Sistema integral contra el riesgo en altura · KG Safety" },
      { name: "description", content: "Cinco divisiones operativas KG Safety: W@H capacitación DC-3, MS&S consultoría e ingeniería, WoLL líneas de vida, S@H equipos certificados y SoNs profesionalización de contratistas. Un solo estándar de seguridad." },
      { property: "og:title", content: "Servicios · KG Safety" },
      { property: "og:description", content: "Cinco divisiones · un solo estándar de seguridad: capacitación, ingeniería, equipos, contratistas y operación." },
      { property: "og:url", content: "https://kgsafety.lovable.app/servicios" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/servicios" }],
  }),
});


function ServiciosPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative px-6 md:px-12 py-20 md:py-28 border-b border-[color:var(--border)] bg-[color:var(--brand-navy)] kg-on-dark">
        <div className="max-w-6xl relative z-10">
          <SectionLabel>Portafolio operativo</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[1.05] mb-6" style={{ color: "#fff" }}>
            Un sistema completo{" "}<br />
            <span className="text-signal">contra el riesgo.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            Cinco frentes operativos. Un solo estándar de seguridad. Capacitación, ingeniería, equipos, contratistas y operación — diseñados, ejecutados y auditados por el mismo equipo.
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

      {/* CATÁLOGO DE SERVICIOS TÉCNICOS */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[color:var(--surface-2)] border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Servicios técnicos</SectionLabel>
              <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight text-[color:var(--on-surface)]">
                Otros <span className="text-signal">servicios</span>
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICE_DETAILS.map((s) => (
              <Link
                key={s.slug}
                to="/servicios/$servicio"
                params={{ servicio: s.slug }}
                className="kg-bento p-6 flex flex-col group"
              >
                <h3 className="font-display text-lg uppercase tracking-tight text-[color:var(--on-surface)] mb-2 leading-tight">{s.name}</h3>

                <p className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_65%,transparent)] leading-relaxed mb-4">{s.short}</p>
                <span className="mt-auto text-[11px] font-bold uppercase tracking-[0.22em] text-signal group-hover:translate-x-1 transition-transform">Ver servicio →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAMILIAS DE SOLUCIONES */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
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

      <QuoteBillingBanner tone="light" />

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
