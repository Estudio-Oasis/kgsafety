import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";

// TODO: reemplazar por el URL real del portal de auto-facturación cuando esté disponible.
const PORTAL_URL = "https://facturacion.kg-safety.com";

export const Route = createFileRoute("/facturacion")({
  component: FacturacionPage,
  head: () => ({
    meta: [
      { title: "Auto-facturación · KG Safety" },
      { name: "description", content: "Genere su factura ingresando su folio de cotización o referencia en el portal de auto-facturación de KG Safety." },
      { property: "og:title", content: "Auto-facturación · KG Safety" },
      { property: "og:description", content: "Portal de auto-facturación con folio o referencia." },
      { property: "og:url", content: "/facturacion" },
    ],
    links: [{ rel: "canonical", href: "/facturacion" }],
  }),
});

function FacturacionPage() {
  const { t } = useT();
  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-4xl">
          <SectionLabel>{t("Auto-facturación")}</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            {t("Genere su")} <span className="text-signal">{t("factura")}</span> {t("en línea.")}
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-10">
            {t("Acceda al portal de auto-facturación con su número de cotización o referencia de venta para generar su factura inmediatamente.")}
          </p>

          <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5 mb-10">
            <div className="bg-anchor p-8">
              <div className="font-display text-signal text-xs mb-3">01</div>
              <h3 className="font-display text-base uppercase mb-2">{t("Tenga listo su folio")}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{t("Folio de cotización, número de pedido o referencia de venta entregada por su asesor.")}</p>
            </div>
            <div className="bg-anchor p-8">
              <div className="font-display text-signal text-xs mb-3">02</div>
              <h3 className="font-display text-base uppercase mb-2">{t("Acceda al portal")}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{t("Capture su RFC y datos fiscales. Reciba el PDF y XML en su correo.")}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]"
            >
              {t("Ir al portal de facturación →")}
            </a>
            <Link
              to="/contacto"
              className="inline-block border border-white/20 text-white px-10 py-5 font-bold uppercase text-sm tracking-widest hover:border-signal hover:text-signal transition-colors"
            >
              {t("¿Necesita ayuda?")}
            </Link>
          </div>

          <p className="text-xs text-white/40 mt-8 leading-relaxed max-w-xl">
            {t("¿Problemas con su factura? Escríbanos a")}{" "}
            <a href="mailto:facturacion@kg-safety.com" className="text-signal hover:underline">facturacion@kg-safety.com</a>
            {" "}{t("y le respondemos el mismo día hábil.")}
          </p>
        </div>
      </section>
    </div>
  );
}
