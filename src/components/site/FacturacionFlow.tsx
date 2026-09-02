import { useT } from "@/i18n/context";

const FACTURAR_URL = "https://facturacion.kg-safety.com/facturar/proceso";

export function FacturacionFlow() {
  const { t } = useT();

  return (
    <div
      id="autofactura"
      className="scroll-mt-24 bg-[color:var(--surface-2)] border border-[color:var(--border)] p-5 md:p-8 mb-10"
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-2">
        {t("Facturación electrónica")}
      </div>
      <h2 className="font-display text-xl md:text-2xl uppercase mb-4">
        {t("Facture o consulte su CFDI en línea")}
      </h2>

      {/* Aviso IMPORTANTE */}
      <div className="border-l-2 border-signal bg-[color:var(--surface)] p-4 mb-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue mb-1">
          {t("Importante")}
        </div>
        <p className="text-xs text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)]">
          {t(
            "La factura puede emitirse a partir del día siguiente de la operación y dentro del mes en curso; por disposiciones fiscales no puede emitirse después del mes en curso. Es obligatorio contar con la cotización emitida por el área de servicio. Para clientes tipo Normal es obligatoria la referencia de pago.",
          )}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href={FACTURAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-signal text-[color:var(--anchor-fixed)] px-6 py-4 font-bold text-xs md:text-sm uppercase tracking-widest border-2 border-[color:var(--anchor-fixed)] hover:bg-white transition-colors text-center"
        >
          {t("Facturar")} →
        </a>
        <a
          href={FACTURAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-signal text-[color:var(--anchor-fixed)] px-6 py-4 font-bold text-xs md:text-sm uppercase tracking-widest border-2 border-[color:var(--anchor-fixed)] hover:bg-white transition-colors text-center"
        >
          {t("Consultar o reenviar factura")} →
        </a>
      </div>
    </div>
  );
}
