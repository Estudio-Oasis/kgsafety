import { useT } from "@/i18n/context";
import { realImagesIn } from "@/lib/real-image";

/**
 * Banda de clientes destacados con logotipos reales (PNG).
 * Los logos se montan sobre tarjetas blancas para garantizar contraste
 * legible tanto en variante clara como oscura.
 */
export function ClientLogosBand({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const { t } = useT();
  const isDark = variant === "dark";
  const logos = realImagesIn("logos-clientes");
  return (
    <section
      className={`px-4 md:px-8 lg:px-12 py-14 md:py-20 border-y border-[color:var(--border)] ${
        isDark
          ? "bg-[color:var(--anchor-fixed)] text-white kg-on-dark"
          : "bg-[color:var(--surface)] text-[color:var(--on-surface)]"
      }`}
      aria-labelledby="client-logos-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div
            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "var(--signal)" }}
          >
            {t("Clientes destacados")}
          </div>
          <h2
            id="client-logos-heading"
            className="font-display text-xl md:text-3xl uppercase leading-tight max-w-3xl mx-auto"
          >
            {t("Operaciones industriales clase mundial confían en KG Safety.")}
          </h2>
        </div>
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4"
          role="list"
          aria-label={t("Logotipos de clientes")}
        >
          {logos.map((src, i) => (
            <li
              key={src}
              className="flex items-center justify-center px-4 py-6 md:py-8 rounded-md border bg-white border-black/10 min-h-[88px] md:min-h-[112px]"
            >
              <img
                src={src}
                alt={t(`Logotipo de cliente ${i + 1}`)}
                loading="lazy"
                decoding="async"
                width={220}
                height={110}
                className="max-h-12 md:max-h-14 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement | null)?.classList.add("hidden");
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
