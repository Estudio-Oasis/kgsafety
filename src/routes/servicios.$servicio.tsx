import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { serviceDetail, SERVICE_DETAILS } from "@/data/kaee";

export const Route = createFileRoute("/servicios/$servicio")({
  component: ServiceDetailPage,
  loader: ({ params }) => {
    const svc = serviceDetail(params.servicio);
    if (!svc) throw notFound();
    return { svc };
  },
  notFoundComponent: () => (
    <div className="px-6 md:px-12 py-24 max-w-3xl">
      <h1 className="font-display text-3xl uppercase mb-4">Servicio no encontrado</h1>
      <p className="text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] mb-6">
        Revise el catálogo completo en{" "}
        <Link to="/servicios" className="text-signal underline">/servicios</Link>.
      </p>
      <ul className="grid sm:grid-cols-2 gap-2">
        {SERVICE_DETAILS.map((s) => (
          <li key={s.slug}>
            <Link to="/servicios/$servicio" params={{ servicio: s.slug }} className="text-brand-blue underline">
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-6 py-24 max-w-3xl">
      <h1 className="font-display text-2xl uppercase mb-3">Error al cargar el servicio</h1>
      <p className="text-sm opacity-70">{String(error)}</p>
    </div>
  ),
  head: ({ params, loaderData }) => {
    const svc = loaderData?.svc;
    const title = svc ? `${svc.name} · KG Safety` : "Servicio · KG Safety";
    const desc = svc?.short ?? "Servicio técnico de seguridad en altura — KG Safety.";
    const url = `https://kgsafety.lovable.app/servicios/${params.servicio}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function ServiceDetailPage() {
  const { svc } = Route.useLoaderData();

  return (
    <div>
      {/* HERO */}
      <section className="relative px-6 md:px-12 py-20 md:py-28 border-b border-[color:var(--border)] bg-[color:var(--brand-navy)] kg-on-dark">
        <div className="max-w-5xl relative z-10">
          <SectionLabel>{svc.parent ? `División ${svc.parent}` : "Servicio KG Safety"}</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[1.05] mb-6" style={{ color: "#fff" }}>
            {svc.name}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            {svc.short}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/contacto" className="bg-signal text-anchor px-8 py-4 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
              Solicitar diagnóstico
            </Link>
            <a
              href="https://wa.me/527228795076"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 font-bold uppercase text-sm tracking-widest border border-white/40 text-white hover:bg-white/10 transition-colors"
            >
              WhatsApp directo
            </a>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Problema que resuelve</SectionLabel>
          <p className="font-display text-2xl md:text-3xl uppercase leading-tight text-[color:var(--on-surface)]">
            {svc.problem}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
          <DetailBlock title="Qué incluye" items={svc.includes} accent />
          <DetailBlock title="Entregables auditables" items={svc.deliverables} />
          <DetailBlock title="Normas relacionadas" items={svc.norms} />
          <DetailBlock title="Cuándo contratarlo" items={svc.whenToHire} />
        </div>
      </section>

      {/* OTROS SERVICIOS */}
      <section className="px-6 md:px-12 py-14 md:py-20 border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Otros servicios MS&S / WoLL</SectionLabel>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-4">
            {SERVICE_DETAILS.filter((s) => s.slug !== svc.slug).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/servicios/$servicio"
                  params={{ servicio: s.slug }}
                  className="block p-4 bg-[color:var(--surface)] border border-[color:var(--border)] text-sm hover:border-signal transition-colors"
                >
                  <span className="font-display uppercase text-[12px] tracking-tight text-[color:var(--on-surface)] block leading-tight">
                    {s.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-16 md:py-20 text-center border-t border-[color:var(--border)] bg-[color:var(--brand-navy)] kg-on-dark">
        <h2 className="font-display text-3xl md:text-5xl uppercase mb-6" style={{ color: "#fff" }}>
          ¿Lo necesita auditable?
        </h2>
        <p className="max-w-2xl mx-auto mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
          Un especialista evalúa su operación y entrega una propuesta priorizada el mismo día hábil.
        </p>
        <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
          Solicitar diagnóstico
        </Link>
      </section>
    </div>
  );
}

function DetailBlock({ title, items, accent = false }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <div className={`p-7 md:p-10 ${accent ? "bg-[color:var(--surface-2)]" : "bg-[color:var(--surface)]"}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-signal mb-4">{title}</div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-sm md:text-base text-[color:color-mix(in_oklab,var(--on-surface)_85%,transparent)] leading-relaxed">
            <span className="text-signal mt-1">→</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
