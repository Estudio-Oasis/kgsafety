import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n/context";
import { DIVISIONS } from "@/data/kaee";

const DIVISION_LINKS: Record<string, string> = {
  "W@H": "/capacitacion",
  "MS&S": "/servicios",
  "WoLL": "/ingenieria",
  "S@H": "/equipos",
  "SoNs": "/servicios",
};

/**
 * "Un sistema completo contra el riesgo" — reemplaza la sección
 * "Cuatro frentes contra la gravedad". Muestra las 5 divisiones reales.
 */
export function DivisionsBlock() {
  const { t } = useT();
  return (
    <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-[color:var(--surface-2)] border-y border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
              {t("Estructura técnica")}
            </div>
            <h2 className="font-display text-2xl md:text-4xl uppercase leading-tight max-w-3xl">
              {t("Un sistema completo")}{" "}
              <span className="text-signal kg-highlight">{t("contra el riesgo")}</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-[color:color-mix(in_oklab,var(--on-surface)_72%,transparent)]">
              {t(
                "Cinco divisiones operativas que cubren capacitación, servicios técnicos, ingeniería, equipo certificado e infraestructura especializada.",
              )}
            </p>
          </div>
          <Link
            to="/servicios"
            className="text-brand-blue font-bold text-[11px] uppercase tracking-[0.22em] border-b border-brand-blue pb-1"
          >
            {t("Ver servicios")} →
          </Link>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
          {DIVISIONS.map((d) => (
            <li key={d.tag} className="bg-[color:var(--surface)] p-5 md:p-6 flex flex-col">
              <span
                className="font-display text-2xl md:text-3xl mb-2"
                style={{ color: "var(--brand-blue)" }}
              >
                {d.tag}
              </span>
              <span className="font-display text-[11px] uppercase tracking-[0.18em] text-[color:var(--on-surface)] mb-3 leading-snug">
                {t(d.name)}
              </span>
              <p className="text-xs md:text-sm leading-relaxed text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] mb-4">
                {t(d.desc)}
              </p>
              <Link
                to={DIVISION_LINKS[d.tag] ?? "/servicios"}
                className="mt-auto text-[10px] font-bold uppercase tracking-[0.22em] text-brand-blue hover:text-signal transition-colors"
              >
                {t("Ver división")} →
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
