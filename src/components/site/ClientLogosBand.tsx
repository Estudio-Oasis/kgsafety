import { useT } from "@/i18n/context";

const CLIENTS = [
  "FEMSA", "Coca-Cola", "Holcim", "Unilever", "ALPLA", "Canacintra",
  "Envases", "APM Terminals", "Gamesa", "PetStar", "Sigma Alimentos",
  "Tupperware", "Owens-Illinois", "Merck", "Santa Clara",
];

/**
 * Grilla sobria de nombres de clientes — sin logos PNG, solo tipografía
 * Michroma. Va en home y /nosotros.
 */
export function ClientLogosBand({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const { t } = useT();
  const isDark = variant === "dark";
  return (
    <section
      className={`px-4 md:px-8 lg:px-12 py-14 md:py-20 border-y border-[color:var(--border)] ${
        isDark
          ? "bg-[color:var(--anchor-fixed)] text-white"
          : "bg-[color:var(--surface)] text-[color:var(--on-surface)]"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div
            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "var(--signal)" }}
          >
            {t("Clientes")}
          </div>
          <h2 className="font-display text-xl md:text-3xl uppercase leading-tight max-w-3xl mx-auto">
            {t("Experiencia con operaciones industriales de alto estándar.")}
          </h2>
        </div>
        <ul
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px ${
            isDark ? "bg-white/10 border border-white/10" : "bg-[color:var(--border)] border border-[color:var(--border)]"
          }`}
        >
          {CLIENTS.map((name) => (
            <li
              key={name}
              className={`flex items-center justify-center text-center px-3 py-5 md:py-6 font-display text-[11px] md:text-xs uppercase tracking-[0.18em] leading-tight ${
                isDark ? "bg-[color:var(--anchor-fixed)] text-white/85" : "bg-[color:var(--surface-2)] text-[color:var(--on-surface)]"
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
