import { createFileRoute, Link } from "@tanstack/react-router";
import { CLIENTS, PLANTS, CERTIFICATIONS, certState } from "@/data/portal";
import { PageHeader, StatusBadge } from "@/components/portal/PortalUI";

export const Route = createFileRoute("/portal/clientes/")({
  component: ClientesIndex,
});

function ClientesIndex() {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader eyebrow="Cartera" title="Clientes" subtitle="Empresas con proyectos activos o histórico con KG Safety." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {CLIENTS.map((c) => {
          const plants = PLANTS.filter((p) => p.clientSlug === c.slug);
          const plantSlugs = plants.map((p) => p.slug);
          const certs = CERTIFICATIONS.filter((x) => plantSlugs.includes(x.plantSlug));
          const vigentes = certs.filter((x) => certState(x) === "vigente").length;
          const vencidos = certs.filter((x) => certState(x) === "vencido").length;
          return (
            <Link
              key={c.slug}
              to="/portal/clientes/$slug"
              params={{ slug: c.slug }}
              className="block bg-[color:var(--surface)] border border-[color:var(--border)] p-4 hover:border-brand-blue transition-colors"
            >
              <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">{c.industry}</p>
              <h3 className="font-display text-lg uppercase mt-1">{c.name}</h3>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div>
                  <p className="font-display text-xl">{plants.length}</p>
                  <p className="text-[9px] uppercase tracking-widest text-[color:var(--muted-fg)]">Plantas</p>
                </div>
                <div>
                  <p className="font-display text-xl text-emerald-600 dark:text-emerald-400">{vigentes}</p>
                  <p className="text-[9px] uppercase tracking-widest text-[color:var(--muted-fg)]">Vigentes</p>
                </div>
                <div>
                  <p className={`font-display text-xl ${vencidos ? "text-red-600 dark:text-red-400" : ""}`}>{vencidos}</p>
                  <p className="text-[9px] uppercase tracking-widest text-[color:var(--muted-fg)]">Vencidas</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
