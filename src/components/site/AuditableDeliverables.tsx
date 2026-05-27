import { useT } from "@/i18n/context";

const DELIVERABLES = [
  "Análisis de riesgo",
  "Levantamiento en sitio",
  "Plan de rescate",
  "Memoria técnica (cuando aplica)",
  "Ficha técnica",
  "Certificados de equipo",
  "Certificado de instalación",
  "Reporte fotográfico",
  "Lista de asistencia",
  "Evaluación",
  "DC-3 STPS",
  "Bitácora de inspección",
];

/**
 * Bloque reutilizable. Lista de entregables auditables que KG Safety entrega
 * al cierre de cada proyecto. Va en home, /servicios e /ingenieria.
 */
export function AuditableDeliverables({
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
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
        <div>
          <div
            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "var(--signal)" }}
          >
            {t("Evidencia documental")}
          </div>
          <h2 className="font-display text-2xl md:text-4xl uppercase leading-tight mb-4">
            {t("Entregables que sí puede defender ante una auditoría.")}
          </h2>
          <p
            className={`text-sm md:text-base leading-relaxed max-w-md ${
              isDark ? "text-white/70" : "text-[color:color-mix(in_oklab,var(--on-surface)_72%,transparent)]"
            }`}
          >
            {t(
              "Cada proyecto cierra con un paquete documental verificable que respalda cumplimiento STPS, NOM-009 y estándares internacionales.",
            )}
          </p>
        </div>
        <ul
          className={`grid grid-cols-1 sm:grid-cols-2 gap-px ${
            isDark ? "bg-white/10 border border-white/10" : "bg-[color:var(--border)] border border-[color:var(--border)]"
          }`}
        >
          {DELIVERABLES.map((d, i) => (
            <li
              key={d}
              className={`flex items-start gap-3 p-4 md:p-5 ${
                isDark ? "bg-[color:var(--anchor-fixed)]" : "bg-[color:var(--surface-2)]"
              }`}
            >
              <span
                className="font-display text-[11px] tracking-[0.2em] pt-0.5"
                style={{ color: "var(--signal)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xs md:text-sm uppercase tracking-[0.06em] leading-snug">
                {t(d)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
