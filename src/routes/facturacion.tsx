import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/i18n/context";

const LINKS = {
  obtenerFactura: "https://kg-safety.com/facturar/proceso",
  administracion: "https://admin-factura-cliente.noilmx.com/",
  facturar: "https://kg-safety.com/facturar?scroll=cotizacionForm",
  whatsapp: "https://api.whatsapp.com/send?phone=527222532753",
  email: "mailto:vianey-contadora@kg-safety.com",
  tel: "tel:+5217227990719",
};

export const Route = createFileRoute("/facturacion")({
  component: FacturacionPage,
  head: () => ({
    meta: [
      { title: "Facturación electrónica · KG Safety" },
      { name: "description", content: "Genere su factura electrónica con su folio de cotización o referencia. Portal de auto-facturación, administración y soporte directo de KG Safety." },
      { property: "og:title", content: "Facturación electrónica · KG Safety" },
      { property: "og:description", content: "Portal de auto-facturación, administración y soporte." },
      { property: "og:url", content: "https://kgsafety.lovable.app/facturacion" },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/facturacion" }],
  }),
});

function FacturacionPage() {
  const { t } = useT();
  return (
    <div className="bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      <section className="px-4 md:px-8 lg:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            {t("Facturación electrónica")}
          </div>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl uppercase leading-[1.05] mb-6">
            {t("Genere su")}{" "}
            <span className="text-signal kg-highlight">{t("factura")}</span>{" "}
            {t("en línea.")}
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)] mb-10">
            {t(
              "Tres opciones según su caso: auto-facturación con folio, acceso al portal de administración para clientes recurrentes o contacto directo con nuestra área contable.",
            )}
          </p>

          {/* 3 acciones principales */}
          <div className="grid md:grid-cols-3 gap-px bg-[color:var(--border)] border border-[color:var(--border)] mb-10">
            <ActionCard
              n="01"
              title={t("Obtener factura")}
              desc={t("Genere su factura con folio de cotización, número de pedido o referencia de venta.")}
              cta={t("Ir al proceso")}
              href={LINKS.obtenerFactura}
              external
            />
            <ActionCard
              n="02"
              title={t("Administración facturación")}
              desc={t("Acceso para clientes recurrentes: consulte historial, descargue XML/PDF y gestione su cuenta.")}
              cta={t("Ingresar al portal")}
              href={LINKS.administracion}
              external
            />
            <ActionCard
              n="03"
              title={t("Contactar facturación")}
              desc={t("Cancelaciones, complementos de pago o casos especiales. Respuesta el mismo día hábil.")}
              cta={t("Escribir a Vianey")}
              href={LINKS.email}
            />
          </div>

          {/* Datos de contacto directo */}
          <div className="grid sm:grid-cols-2 gap-px bg-[color:var(--border)] border border-[color:var(--border)] mb-10">
            <ContactBlock
              label={t("Teléfono directo")}
              value="+52 1 722 799 0719"
              href={LINKS.tel}
            />
            <ContactBlock
              label="WhatsApp"
              value="+52 1 722 253 2753"
              href={LINKS.whatsapp}
              external
            />
          </div>

          {/* Tip */}
          <div className="bg-[color:var(--surface-2)] border border-[color:var(--border)] p-5 md:p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-2">
              {t("¿Aún no factura?")}
            </div>
            <p className="text-sm md:text-base text-[color:color-mix(in_oklab,var(--on-surface)_78%,transparent)] mb-4">
              {t("Si no tiene folio o necesita generar una nueva cotización antes de facturar, comience aquí:")}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={LINKS.facturar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-signal text-[color:var(--anchor-fixed)] px-6 py-3 font-bold text-[11px] uppercase tracking-widest border-2 border-[color:var(--anchor-fixed)] hover:bg-white transition-colors"
              >
                {t("Iniciar facturación")} →
              </a>
              <Link
                to="/contacto"
                className="inline-block border border-[color:var(--border)] px-6 py-3 font-bold text-[11px] uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-colors"
              >
                {t("Hablar con un especialista")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActionCard({
  n,
  title,
  desc,
  cta,
  href,
  external,
}: {
  n: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group bg-[color:var(--surface-2)] p-6 md:p-7 flex flex-col hover:bg-[color:var(--surface)] transition-colors"
    >
      <div
        className="font-display text-[11px] tracking-[0.25em] mb-3"
        style={{ color: "var(--signal)" }}
      >
        {n}
      </div>
      <h3 className="font-display text-base md:text-lg uppercase mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-sm leading-relaxed mb-5 text-[color:color-mix(in_oklab,var(--on-surface)_72%,transparent)]">
        {desc}
      </p>
      <span className="mt-auto text-[10px] font-bold uppercase tracking-[0.22em] text-brand-blue group-hover:text-signal transition-colors">
        {cta} →
      </span>
    </a>
  );
}

function ContactBlock({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="bg-[color:var(--surface-2)] p-5 md:p-6 flex flex-col gap-2 hover:bg-[color:var(--surface)] transition-colors"
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue">
        {label}
      </span>
      <span className="font-display text-lg md:text-xl text-[color:var(--on-surface)]">
        {value}
      </span>
    </a>
  );
}
