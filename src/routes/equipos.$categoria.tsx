import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { EQUIPMENT, EQUIPMENT_DETAILS, equipmentDeep, type EquipmentCategory } from "@/data/kaee";

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
  const detail = EQUIPMENT_DETAILS[cat.slug] ?? {};
  const deep = equipmentDeep(cat.slug);
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

      {/* DETALLE TÉCNICO */}
      {(detail.norms || detail.brands || detail.targets) && (
        <section className="px-6 md:px-12 py-16 md:py-20 border-b border-[color:var(--border)]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
            {detail.norms && (
              <div className="bg-[color:var(--surface)] p-7">
                <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Normas aplicables</div>
                <ul className="flex flex-wrap gap-1.5">
                  {detail.norms.map((n) => (
                    <li key={n} className="text-[10px] font-bold uppercase tracking-widest border border-[color:var(--border)] px-2 py-1 text-[color:color-mix(in_oklab,var(--on-surface)_80%,transparent)]">{n}</li>
                  ))}
                </ul>
              </div>
            )}
            {detail.brands && (
              <div className="bg-[color:var(--surface)] p-7">
                <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Marcas representadas</div>
                <ul className="flex flex-wrap gap-2">
                  {detail.brands.map((b) => (
                    <li key={b} className="font-display text-sm uppercase tracking-tight text-[color:var(--on-surface)]">{b}</li>
                  ))}
                </ul>
              </div>
            )}
            {detail.targets && (
              <div className="bg-[color:var(--surface)] p-7">
                <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Aplicaciones típicas</div>
                <ul className="space-y-2">
                  {detail.targets.map((t) => (
                    <li key={t} className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)] flex items-start gap-2">
                      <span className="text-signal shrink-0">→</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CONTENIDO ÚNICO POR CATEGORÍA */}
      {(deep.subcategories || deep.selection || deep.docs) && (
        <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
            {deep.subcategories && (
              <div className="bg-[color:var(--surface)] p-7">
                <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Tipos / subcategorías</div>
                <ul className="space-y-2">
                  {deep.subcategories.map((s) => (
                    <li key={s} className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_80%,transparent)] flex gap-2"><span className="text-signal">→</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {deep.selection && (
              <div className="bg-[color:var(--surface)] p-7">
                <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Criterios de selección</div>
                <ul className="space-y-2">
                  {deep.selection.map((s) => (
                    <li key={s} className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_80%,transparent)] flex gap-2"><span className="text-signal">→</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {deep.docs && (
              <div className="bg-[color:var(--surface)] p-7">
                <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Documentos entregables</div>
                <ul className="space-y-2">
                  {deep.docs.map((d) => (
                    <li key={d} className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_80%,transparent)] flex gap-2"><span className="text-signal">→</span>{d}</li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
                  <Link to="/contacto" className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal hover:underline">
                    Cotizar {cat.name.split("—")[0].trim().toLowerCase()} →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}




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
