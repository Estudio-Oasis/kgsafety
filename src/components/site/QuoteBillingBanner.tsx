import { Link } from "@tanstack/react-router";
import { FileText, Receipt } from "lucide-react";
import { useT } from "@/i18n/context";

type Tone = "light" | "navy";

/**
 * Banner de doble acción: cotizar (ERP) y facturar (CFDI).
 * Se usa al cierre de las páginas de servicio para dar visibilidad
 * permanente a los dos flujos transaccionales del sitio.
 */
export function QuoteBillingBanner({
  tone = "light",
  quoteTitle,
  quoteDesc,
  quoteCourse,
}: {
  tone?: Tone;
  quoteTitle?: string;
  quoteDesc?: string;
  quoteCourse?: string;
}) {
  const { t } = useT();
  const navy = tone === "navy";

  const wrap = navy
    ? "bg-[color:var(--brand-navy)] kg-on-dark border-y border-white/10"
    : "bg-[color:var(--surface-2)] border-y border-[color:var(--border)]";
  const cardBase = navy
    ? "bg-white/[0.04] border border-white/12 hover:border-[color:var(--signal)]"
    : "bg-[color:var(--surface)] border border-[color:var(--border)] hover:border-brand-blue";
  const desc = navy
    ? "text-white/70"
    : "text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)]";
  const heading = navy ? "text-white" : "text-[color:var(--on-surface)]";

  return (
    <section className={`px-4 md:px-8 lg:px-12 py-12 md:py-16 ${wrap}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-6">
          {t("Trámites en línea")}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/contacto"
            {...(quoteCourse ? { search: { curso: quoteCourse } } : {})}
            className={`group p-6 md:p-7 flex flex-col transition-colors ${cardBase}`}
          >
            <FileText size={20} className="text-signal mb-4" strokeWidth={2.5} />
            <h3 className={`font-display text-lg md:text-xl uppercase leading-tight mb-2 ${heading}`}>
              {quoteTitle ?? t("Solicitar cotización en línea")}
            </h3>
            <p className={`text-sm leading-relaxed mb-5 ${desc}`}>
              {quoteDesc ??
                t("Elija curso o servicio, fecha disponible y reciba su folio de solicitud al instante.")}
            </p>
            <span className="mt-auto text-[10px] font-bold uppercase tracking-[0.22em] text-brand-blue group-hover:text-signal transition-colors">
              {t("Cotizar ahora")} →
            </span>
          </Link>

          <Link
            to="/facturacion"
            hash="autofactura"
            className={`group p-6 md:p-7 flex flex-col transition-colors ${cardBase}`}
          >
            <Receipt size={20} className="text-signal mb-4" strokeWidth={2.5} />
            <h3 className={`font-display text-lg md:text-xl uppercase leading-tight mb-2 ${heading}`}>
              {t("Facturación electrónica")}
            </h3>
            <p className={`text-sm leading-relaxed mb-5 ${desc}`}>
              {t("Timbre su CFDI 4.0 con su código de cliente y folio de cotización. XML y PDF por correo.")}
            </p>
            <span className="mt-auto text-[10px] font-bold uppercase tracking-[0.22em] text-brand-blue group-hover:text-signal transition-colors">
              {t("Facturar ahora")} →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
