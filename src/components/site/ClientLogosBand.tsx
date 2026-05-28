import { useT } from "@/i18n/context";
import { realImagesIn } from "@/lib/real-image";

/**
 * Banda de clientes destacados con logotipos reales (PNG).
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
            {t("Clientes destacados")}
          </div>
          <h2 className="font-display text-xl md:text-3xl uppercase leading-tight max-w-3xl mx-auto">
            {t("Operaciones industriales clase mundial confían en KG Safety.")}
          </h2>
        </div>
        <ul
        <ul
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4`}
        >
          {logos.map((src, i) => (
            <li
              key={src}
              className={`flex items-center justify-center px-4 py-6 md:py-8 rounded-md border ${
                isDark
                  ? "bg-white border-white/10"
                  : "bg-[color:var(--surface-2)] border-[color:var(--border)]"
              }`}
            >
              <img
                src={src}
                alt={`Cliente destacado ${i + 1}`}
                loading="lazy"
                className="max-h-14 md:max-h-16 w-auto object-contain"
              />
            </li>
          ))}
        </ul>
}
