import { useT } from "@/i18n/context";

/**
 * Bloque diferenciador competitivo. Va en home, después de la barra de métricas.
 * Tono serio, técnico, sin marketing genérico.
 */
export function DifferentiatorBlock() {
  const { t } = useT();
  const negations = [
    t("No somos solo capacitadores."),
    t("No somos solo distribuidores de EPP."),
    t("No somos solo instaladores de líneas de vida."),
  ];
  const pillars = [
    { n: "01", k: t("Diagnóstico") },
    { n: "02", k: t("Ingeniería") },
    { n: "03", k: t("Instalación") },
    { n: "04", k: t("Certificación") },
    { n: "05", k: t("Capacitación") },
    { n: "06", k: t("Documentación") },
  ];
  return (
    <section className="px-4 md:px-8 lg:px-12 py-14 md:py-20 bg-[color:var(--surface)] border-y border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
        <div>
          <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            {t("Integrador, no proveedor")}
          </div>
          <ul className="space-y-3 mb-8">
            {negations.map((line) => (
              <li
                key={line}
                className="font-display text-xl md:text-3xl uppercase leading-tight text-[color:var(--on-surface)]"
              >
                {line}
              </li>
            ))}
          </ul>
          <p className="text-base md:text-lg leading-relaxed text-[color:color-mix(in_oklab,var(--on-surface)_78%,transparent)] max-w-xl">
            {t(
              "KG Safety integra diagnóstico, ingeniería, instalación, certificación, capacitación y documentación para que cada solución sea técnicamente correcta, operativamente viable y auditable.",
            )}
          </p>
        </div>
        <ol className="grid grid-cols-2 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
          {pillars.map((p) => (
            <li
              key={p.n}
              className="bg-[color:var(--surface-2)] p-5 md:p-6 flex flex-col gap-2"
            >
              <span
                className="font-display text-[11px] tracking-[0.25em]"
                style={{ color: "var(--signal)" }}
              >
                {p.n}
              </span>
              <span className="font-display text-base md:text-lg uppercase leading-tight text-[color:var(--on-surface)]">
                {p.k}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
