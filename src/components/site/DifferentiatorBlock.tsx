import { useT } from "@/i18n/context";
import kKnowledge from "@/assets/site/components__entrenamiento.jpg";
import kAnalysis from "@/assets/site/banners__asesoria.jpg";
import kEngineering from "@/assets/site/banners__ingenieria.jpg";
import kElimination from "@/assets/site/banners__instalacion.jpg";

/**
 * Bloque diferenciador competitivo + Método K.A.E.E.
 */
export function DifferentiatorBlock() {
  const { t } = useT();
  const negations = [
    { strike: t("Capacitadores"), tag: t("solo") },
    { strike: t("Distribuidores de EPP"), tag: t("solo") },
    { strike: t("Instaladores de líneas de vida"), tag: t("solo") },
  ];
  const kaee = [
    { letter: "K", title: "Knowledge",   desc: t("Conocimiento bilateral para entendimiento claro entre cliente y equipo técnico."), img: kKnowledge },
    { letter: "A", title: "Analysis",    desc: t("Análisis en común con el cliente para lograr comunicación y objetivos definidos."), img: kAnalysis },
    { letter: "E", title: "Engineering", desc: t("Aplicación de cualquier método de ingeniería necesario para lograr los objetivos."), img: kEngineering },
    { letter: "E", title: "Elimination", desc: t("Eliminación total de la problemática buscando el 100%."), img: kElimination },
  ];
  return (
    <section className="px-4 md:px-8 lg:px-12 py-14 md:py-20 bg-[color:var(--surface)] border-y border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
        <div>
          <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            {t("Integrador, no proveedor")}
          </div>

          {/* Negations as cards with X icon — no longer plain text */}
          <ul className="space-y-2.5 mb-8">
            {negations.map((n) => (
              <li
                key={n.strike}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)]"
              >
                <span
                  aria-hidden
                  className="shrink-0 inline-grid place-items-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-[color:var(--anchor-fixed)] text-[color:var(--signal)] text-xs font-bold"
                >
                  ✕
                </span>
                <div className="min-w-0 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.22em] text-[color:color-mix(in_oklab,var(--on-surface)_55%,transparent)]">
                    {t("No somos")} {n.tag}
                  </span>
                  <span className="font-display text-base md:text-xl uppercase leading-tight text-[color:var(--on-surface)] break-words">
                    {n.strike}.
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-base md:text-lg leading-relaxed text-[color:color-mix(in_oklab,var(--on-surface)_78%,transparent)] max-w-xl">
            {t(
              "KG Safety integra diagnóstico, ingeniería, instalación, certificación, capacitación y documentación para que cada solución sea técnicamente correcta, operativamente viable y auditable.",
            )}
          </p>

          {/* Normativa: grid de 3 cols en móvil → no deja orphan en línea 2 */}
          <div className="mt-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[color:color-mix(in_oklab,var(--on-surface)_60%,transparent)] mb-2.5">
              {t("Cumplimos normativa nacional e internacional")}
            </div>
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
              {["STPS", "OSHA", "ANSI Z359", "NOM-009", "EN-795"].map((n) => (
                <span
                  key={n}
                  className="text-[10px] font-display uppercase tracking-[0.18em] px-2.5 py-1.5 border border-[color:var(--border)] rounded-full text-[color:var(--on-surface)] text-center bg-[color:var(--surface)]"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Método K.A.E.E. — 4 tiles con imagen de fondo */}
        <div>
          <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
            {t("Método registrado")}
          </div>
          <h3 className="font-display text-2xl md:text-3xl lg:text-4xl uppercase leading-tight mb-6 text-[color:var(--on-surface)]">
            {t("Método")} <span className="text-signal">K.A.E.E.</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {kaee.map((k, i) => (
              <article
                key={i}
                className="kg-on-dark relative overflow-hidden rounded-xl min-h-[200px] md:min-h-[220px] flex flex-col justify-end p-4 md:p-5 group"
              >
                <img src={k.img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-navy)] via-[color:var(--brand-navy)]/75 to-[color:var(--brand-navy)]/20" />
                <div className="relative">
                  <div className="font-display text-signal text-4xl md:text-5xl leading-none mb-2">{k.letter}</div>
                  <h4 className="font-bold uppercase tracking-wider text-xs md:text-sm mb-1" style={{ color: "#ffffff" }}>{k.title}</h4>
                  <p className="text-[11px] md:text-xs leading-snug" style={{ color: "rgba(255,255,255,0.85)" }}>{k.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
