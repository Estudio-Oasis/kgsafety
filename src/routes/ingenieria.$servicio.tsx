import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { ENGINEERING } from "@/data/kaee";

export const Route = createFileRoute("/ingenieria/$servicio")({
  component: ServicePage,
  loader: ({ params }) => {
    const s = ENGINEERING.find((x) => x.slug === params.servicio);
    if (!s) throw notFound();
    return s;
  },
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <h1 className="font-display text-3xl uppercase mb-4">Servicio no encontrado</h1>
      <Link to="/ingenieria" className="text-brand-blue underline">Ver ingeniería</Link>
    </div>
  ),
  head: ({ params }) => {
    const s = ENGINEERING.find((x) => x.slug === params.servicio);
    return {
      meta: [
        { title: s ? `${s.name} · KG Safety` : "Ingeniería · KG Safety" },
        { name: "description", content: s?.desc ?? "Ingeniería KG Safety." },
        { property: "og:title", content: s ? `${s.name} · KG Safety` : "" },
        { property: "og:description", content: s?.desc ?? "" },
      ],
    };
  },
});

function ServicePage() {
  const s = Route.useLoaderData();
  return (
    <div>
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-5xl">
          <Link to="/ingenieria" className="text-[11px] uppercase tracking-widest text-brand-blue mb-6 inline-block hover:underline">← Ingeniería</Link>
          <SectionLabel>Servicio MS&S</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight text-[color:var(--on-surface)]">{s.name}</h1>
          <p className="text-lg md:text-xl text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] max-w-2xl mb-10 leading-relaxed">{s.desc}</p>
          <Link to="/contacto" className="inline-block bg-signal text-[color:var(--anchor-fixed)] px-10 py-5 font-bold uppercase text-sm tracking-widest border-2 border-[color:var(--anchor-fixed)] shadow-[4px_4px_0_0_var(--anchor-fixed)] hover:bg-white transition-colors">
            Solicitar este servicio
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Alcance</SectionLabel>
          <div className="grid md:grid-cols-2 gap-px bg-[color:var(--border)] border border-[color:var(--border)] mt-8">
            {s.bullets.map((b, i) => (
              <div key={b} className="bg-[color:var(--surface)] p-8">
                <div className="font-display text-signal text-xs mb-3">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-bold text-base uppercase tracking-tight text-[color:var(--on-surface)]">{b}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 bg-[color:var(--surface-2)] border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Otros servicios</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mt-6">
            {ENGINEERING.filter((x) => x.slug !== s.slug).map((x) => (
              <Link key={x.slug} to="/ingenieria/$servicio" params={{ servicio: x.slug }} className="kg-bento p-4 text-[11px] uppercase tracking-widest font-bold text-[color:var(--on-surface)] hover:text-brand-blue">
                {x.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
