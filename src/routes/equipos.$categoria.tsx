import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { EQUIPMENT, type EquipmentCategory } from "@/data/kaee";

export const Route = createFileRoute("/equipos/$categoria")({
  component: CategoryPage,
  loader: ({ params }) => {
    const cat = EQUIPMENT.find((c) => c.slug === params.categoria);
    if (!cat) throw notFound();
    return cat;
  },
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <h1 className="font-display text-3xl uppercase mb-4">Categoría no encontrada</h1>
      <Link to="/equipos" className="text-brand-blue underline">Ver catálogo</Link>
    </div>
  ),
  head: ({ params }) => {
    const c = EQUIPMENT.find((x) => x.slug === params.categoria);
    const title = c ? `${c.name} · KG Safety` : "Equipos · KG Safety";
    return {
      meta: [
        { title },
        { name: "description", content: c?.desc ?? "Equipos certificados KG Safety." },
        { property: "og:title", content: title },
        { property: "og:description", content: c?.desc ?? "" },
      ],
    };
  },
});

function CategoryPage() {
  const cat = Route.useLoaderData() as EquipmentCategory;
  return (
    <div>
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-5xl">
          <Link to="/equipos" className="text-[11px] uppercase tracking-widest text-brand-blue mb-6 inline-block hover:underline">← Equipos</Link>
          <SectionLabel>Catálogo</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight text-[color:var(--on-surface)]">{cat.name}</h1>
          <p className="text-lg md:text-xl text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] max-w-2xl mb-10 leading-relaxed">{cat.desc}</p>
          <Link to="/contacto" className="inline-block bg-signal text-[color:var(--anchor-fixed)] px-10 py-5 font-bold uppercase text-sm tracking-widest border-2 border-[color:var(--anchor-fixed)] shadow-[4px_4px_0_0_var(--anchor-fixed)] hover:bg-white transition-colors">
            Cotizar esta línea
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Productos en esta línea</SectionLabel>
          <h2 className="font-display text-2xl md:text-4xl uppercase mb-10 text-[color:var(--on-surface)]">{cat.items.length} variantes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {cat.items.map((item, i) => (
              <div key={item} className="kg-bento p-5">
                <div className="font-display text-signal text-[10px] uppercase tracking-widest mb-2">{String(i + 1).padStart(2, "0")}</div>
                <div className="font-bold text-sm text-[color:var(--on-surface)] leading-tight">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 bg-[color:var(--surface-2)] border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Otras categorías</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-6">
            {EQUIPMENT.filter((c) => c.slug !== cat.slug).map((c) => (
              <Link key={c.slug} to="/equipos/$categoria" params={{ categoria: c.slug }} className="kg-bento p-4 text-[11px] uppercase tracking-widest font-bold text-[color:var(--on-surface)] hover:text-brand-blue">
                {c.name.split("—")[0].trim()}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
