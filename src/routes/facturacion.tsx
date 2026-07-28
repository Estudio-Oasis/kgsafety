import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useT } from "@/i18n/context";
import { factLookupClient, factIssueInvoice } from "@/lib/facturacion.functions";

const USOS_CFDI = [
  { c: "G01", l: "G01 · Adquisición de mercancías" },
  { c: "G03", l: "G03 · Gastos en general" },
  { c: "I08", l: "I08 · Otra maquinaria y equipo" },
  { c: "P01", l: "P01 · Por definir" },
  { c: "D10", l: "D10 · Pagos por servicios educativos" },
  { c: "S01", l: "S01 · Sin efectos fiscales" },
];

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
              desc={t("Genere y timbre su factura aquí mismo con su código de cliente y folio de cotización.")}
              cta={t("Facturar ahora")}
              href="#autofactura"
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

          <AutoFactura />

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

function AutoFactura() {
  const { t } = useT();
  const lookup = useServerFn(factLookupClient);
  const issue = useServerFn(factIssueInvoice);

  const [codigo, setCodigo] = useState("");
  const [cliente, setCliente] = useState<{
    IdProveedorCliente: number;
    NombreEmpresa: string;
    RFC: string;
    Codigo: string;
    CP: string | null;
    RegimenFiscal: string | null;
  } | null>(null);
  const [noCotizacion, setNoCotizacion] = useState("");
  const [usoCFDI, setUsoCFDI] = useState("G03");
  const [referencia, setReferencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (codigo.trim().length < 2) return;
    setLoading(true);
    setMsg(null);
    try {
      const r = await lookup({ data: { codigo: codigo.trim() } });
      if (r.ok && r.client) {
        setCliente(r.client);
      } else {
        setCliente(null);
        setMsg({
          tone: "err",
          text: t("No encontramos ese código de cliente. Verifíquelo en su cotización o contacte a facturación."),
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function emitir(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente || noCotizacion.trim().length < 2) return;
    setLoading(true);
    setMsg(null);
    try {
      const r = await issue({
        data: {
          idProveedorCliente: cliente.IdProveedorCliente,
          noCotizacion: noCotizacion.trim(),
          usoCFDI,
          referencia: referencia.trim(),
        },
      });
      if (r.ok) {
        setUuid(r.uuid ?? null);
        setMsg({ tone: "ok", text: r.mensaje });
      } else {
        setMsg({ tone: "err", text: r.error });
      }
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-[color:var(--surface)] border border-[color:var(--border)] px-4 py-3 text-sm outline-none focus:border-brand-blue";
  const labelCls = "block text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue mb-2";

  return (
    <div
      id="autofactura"
      className="scroll-mt-24 bg-[color:var(--surface-2)] border border-[color:var(--border)] p-5 md:p-8 mb-10"
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-2">
        {t("Auto-facturación")}
      </div>
      <h2 className="font-display text-xl md:text-2xl uppercase mb-2">{t("Timbre su CFDI en línea")}</h2>
      <p className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_72%,transparent)] mb-6 max-w-2xl">
        {t(
          "Ingrese su código de cliente para confirmar sus datos fiscales y después el folio de la cotización a facturar. El XML y PDF se envían al correo registrado.",
        )}
      </p>

      {uuid !== null || msg?.tone === "ok" ? (
        <div className="border border-brand-blue/40 bg-[color:var(--surface)] p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue mb-2">
            {t("Factura timbrada")}
          </div>
          <p className="text-sm mb-2">{msg?.text}</p>
          {uuid && (
            <p className="text-xs font-mono break-all">
              {t("Folio fiscal (UUID)")}: <strong>{uuid}</strong>
            </p>
          )}
        </div>
      ) : (
        <>
          <form onSubmit={buscar} className="grid sm:grid-cols-[1fr_auto] gap-3 items-end mb-6">
            <div>
              <label className={labelCls} htmlFor="fact-codigo">
                {t("Código de cliente o RFC registrado")}
              </label>
              <input
                id="fact-codigo"
                className={inputCls}
                value={codigo}
                onChange={(ev) => {
                  setCodigo(ev.target.value);
                  setCliente(null);
                }}
                placeholder="CLI001"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="border-2 border-[color:var(--anchor-fixed)] bg-signal text-[color:var(--anchor-fixed)] px-6 py-3 font-bold text-[11px] uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? t("Buscando…") : t("Buscar")}
            </button>
          </form>

          {cliente && (
            <form onSubmit={emitir} className="border-t border-[color:var(--border)] pt-6 grid gap-4">
              <div className="bg-[color:var(--surface)] border border-[color:var(--border)] p-4">
                <div className="text-[10px] uppercase tracking-[0.25em] text-brand-blue font-bold mb-1">
                  {t("Datos fiscales confirmados")}
                </div>
                <div className="font-display text-base uppercase">{cliente.NombreEmpresa}</div>
                <div className="text-xs text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] mt-1">
                  RFC {cliente.RFC}
                  {cliente.CP ? ` · CP ${cliente.CP}` : ""}
                  {cliente.RegimenFiscal ? ` · ${t("Régimen")} ${cliente.RegimenFiscal}` : ""}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="fact-cot">
                    {t("Folio de cotización")}
                  </label>
                  <input
                    id="fact-cot"
                    className={inputCls}
                    value={noCotizacion}
                    onChange={(ev) => setNoCotizacion(ev.target.value)}
                    placeholder="COT-2026-001"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="fact-uso">
                    {t("Uso de CFDI")}
                  </label>
                  <select
                    id="fact-uso"
                    className={inputCls}
                    value={usoCFDI}
                    onChange={(ev) => setUsoCFDI(ev.target.value)}
                  >
                    {USOS_CFDI.map((u) => (
                      <option key={u.c} value={u.c}>
                        {u.l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="fact-ref">
                  {t("Referencia de pago (opcional)")}
                </label>
                <input
                  id="fact-ref"
                  className={inputCls}
                  value={referencia}
                  onChange={(ev) => setReferencia(ev.target.value)}
                  placeholder="REF123456"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="justify-self-start border-2 border-[color:var(--anchor-fixed)] bg-signal text-[color:var(--anchor-fixed)] px-6 py-3 font-bold text-[11px] uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? t("Timbrando…") : t("Emitir y timbrar factura")} →
              </button>
            </form>
          )}
        </>
      )}

      {msg && msg.tone === "err" && (
        <p className="mt-4 text-sm text-signal border border-signal/40 bg-[color:var(--surface)] p-3">{msg.text}</p>
      )}
    </div>
  );
}
