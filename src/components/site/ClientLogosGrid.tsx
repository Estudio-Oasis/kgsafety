import { useT } from "@/i18n/context";

// Logos ya disponibles (los pendientes usarán fallback textual limpio hasta que se suban)
const logoModules = import.meta.glob("@/assets/logos-empresas/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function logoUrl(slug: string): string | undefined {
  const match = Object.entries(logoModules).find(([p]) => p.endsWith(`/${slug}.png`));
  return match?.[1];
}

const CLIENTS: { slug: string; name: string }[] = [
  { slug: "coca-cola-femsa", name: "Coca-Cola FEMSA" },
  { slug: "holcim", name: "Holcim" },
  { slug: "unilever", name: "Unilever" },
  { slug: "merck", name: "Merck" },
  { slug: "petstar", name: "PetStar" },
  { slug: "santa-clara", name: "Santa Clara" },
  { slug: "bimbo", name: "Grupo Bimbo" },
  { slug: "nestle", name: "Nestlé" },
  { slug: "cemex", name: "Cemex" },
  { slug: "heineken", name: "Heineken" },
  { slug: "grupo-modelo", name: "Grupo Modelo" },
  { slug: "pemex", name: "Pemex" },
  { slug: "volkswagen", name: "Volkswagen" },
  { slug: "ford", name: "Ford" },
  { slug: "nissan", name: "Nissan" },
  { slug: "bayer", name: "Bayer" },
  { slug: "danone", name: "Danone" },
  { slug: "procter-gamble", name: "Procter & Gamble" },
  { slug: "loreal", name: "L'Oréal" },
  { slug: "kimberly-clark", name: "Kimberly-Clark" },
  { slug: "arca-continental", name: "Arca Continental" },
  { slug: "pirelli", name: "Pirelli" },
  { slug: "general-motors", name: "General Motors" },
  { slug: "pfizer", name: "Pfizer" },
  { slug: "cargill", name: "Cargill" },
  { slug: "johnson-johnson", name: "Johnson & Johnson" },
  { slug: "conoco-phillips", name: "ConocoPhillips" },
  { slug: "vestas", name: "Vestas" },
  { slug: "pepsico", name: "PepsiCo" },
];

export function ClientLogosGrid() {
  const { t } = useT();
  return (
    <section
      className="px-4 md:px-8 lg:px-12 py-16 md:py-24 bg-[color:var(--surface-2)] border-y border-[color:var(--border)]"
      aria-labelledby="clientes-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <div
            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "var(--signal)" }}
          >
            {t("Algunos clientes")}
          </div>
          <h2
            id="clientes-heading"
            className="font-display text-2xl md:text-4xl lg:text-5xl uppercase leading-tight text-[color:var(--on-surface)]"
          >
            {t("Operaciones")}{" "}
            <span className="text-signal">{t("críticas")}</span>{" "}
            {t("nos confían su gente")}
          </h2>
        </div>

        <ul
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
          role="list"
          aria-label={t("Logotipos de clientes")}
        >
          {CLIENTS.map((c) => {
            const url = logoUrl(c.slug);
            return (
              <li
                key={c.slug}
                className="group relative flex items-center justify-center bg-white border border-black/10 rounded-md px-4 py-6 md:py-8 min-h-[96px] md:min-h-[120px] overflow-hidden transition-all duration-300 hover:border-[color:var(--signal)] hover:shadow-[0_10px_30px_-15px_rgba(15,27,61,0.35)]"
                title={c.name}
              >
                {url ? (
                  <img
                    src={url}
                    alt={`${t("Logotipo")} ${c.name}`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-12 md:max-h-16 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                  />
                ) : (
                  <span className="font-display text-[11px] md:text-xs uppercase tracking-[0.15em] text-center text-neutral-800 transition-transform duration-300 ease-out group-hover:scale-105">
                    {c.name}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
