import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useT } from "@/i18n/context";
import { factCheckQuote, factUpdateAndIssue, factFindInvoice } from "@/lib/facturacion.functions";

const USOS_CFDI = [
  { c: "G01", l: "G01 · Adquisición de mercancías" },
  { c: "G03", l: "G03 · Gastos en general" },
  { c: "I01", l: "I01 · Construcciones" },
  { c: "I08", l: "I08 · Otra maquinaria y equipo" },
  { c: "P01", l: "P01 · Por definir" },
  { c: "S01", l: "S01 · Sin efectos fiscales" },
];

type FiscalClient = {
  IdProveedorCliente: number;
  NombreEmpresa: string;
  RFC: string;
  Codigo: string;
  Email: string;
  RegimenFiscal: string;
  Calle: string;
  No: string;
  NoInt: string;
  Colonia: string;
  CP: string;
  TelEmpresa: string;
};

type Invoice = {
  folio: string;
  uuid: string;
  cotizacion: string;
  fecha: string;
  total: number;
  xml: string | null;
};

const inputCls =
  "w-full bg-[color:var(--surface)] border border-[color:var(--border)] px-4 py-3 text-sm outline-none focus:border-brand-blue";
const labelCls = "block text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue mb-2";
const btnCls =
  "border-2 border-[color:var(--anchor-fixed)] bg-signal text-[color:var(--anchor-fixed)] px-6 py-3 font-bold text-[11px] uppercase tracking-widest disabled:opacity-50";
const ghostCls =
  "border border-[color:var(--border)] px-6 py-3 font-bold text-[11px] uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-colors";

export function FacturacionFlow() {
  const { t } = useT();
  const check = useServerFn(factCheckQuote);
  const issue = useServerFn(factUpdateAndIssue);
  const search = useServerFn(factFindInvoice);

  const [tab, setTab] = useState<"facturar" | "consultar">("facturar");

  // CU006
  const [cotizacion, setCotizacion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [cliente, setCliente] = useState<FiscalClient | null>(null);
  const [fiscal, setFiscal] = useState({ calle: "", numero: "", numeroInt: "", colonia: "", cp: "", telefono: "" });
  const [usoCFDI, setUsoCFDI] = useState("G03");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);

  // CU007
  const [criterio, setCriterio] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showXml, setShowXml] = useState(false);

  function resetFacturar() {
    setCotizacion("");
    setReferencia("");
    setCliente(null);
    setError(null);
  }

  async function validarPago(e: React.FormEvent) {
    e.preventDefault();
    if (!cotizacion.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const r = await check({ data: { cotizacion: cotizacion.trim(), referencia: referencia.trim() } });
      if (r.ok && r.client) {
        setCliente(r.client);
        setFiscal({
          calle: r.client.Calle,
          numero: r.client.No,
          numeroInt: r.client.NoInt,
          colonia: r.client.Colonia,
          cp: r.client.CP,
          telefono: r.client.TelEmpresa,
        });
      } else {
        setCliente(null);
        setError(r.error ?? t("No fue posible validar la cotización."));
      }
    } finally {
      setLoading(false);
    }
  }

  async function actualizarYFacturar(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente) return;
    if (!fiscal.calle || !fiscal.numero || !fiscal.colonia || !/^\d{5}$/.test(fiscal.cp)) {
      setError(t("Por favor complete todos los campos marcados como obligatorios."));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = await issue({
        data: {
          idProveedorCliente: cliente.IdProveedorCliente,
          noCotizacion: cotizacion.trim(),
          referencia: referencia.trim(),
          usoCFDI,
          calle: fiscal.calle.trim(),
          numero: fiscal.numero.trim(),
          numeroInt: fiscal.numeroInt.trim(),
          colonia: fiscal.colonia.trim(),
          cp: fiscal.cp.trim(),
          telefono: fiscal.telefono.trim(),
        },
      });
      if (r.ok) {
        setUuid(r.uuid ?? "");
        setCriterio(r.uuid ?? cotizacion.trim());
        setTab("consultar");
        resetFacturar();
      } else {
        setError(r.error ?? t("Ocurrió un error al emitir la factura."));
      }
    } finally {
      setLoading(false);
    }
  }

  async function buscarFactura(e?: React.FormEvent) {
    e?.preventDefault();
    if (!criterio.trim()) return;
    setSearching(true);
    setSearchError(null);
    setInvoice(null);
    try {
      const r = await search({ data: { criterio: criterio.trim() } });
      if (r.ok && r.invoice) setInvoice(r.invoice);
      else setSearchError(r.error ?? t("No se encontró ninguna factura con los datos proporcionados."));
    } catch {
      setSearchError(t("Error de conexión. Verifique su internet e intente de nuevo."));
    } finally {
      setSearching(false);
    }
  }

  function descargarXml() {
    if (!invoice?.xml) return;
    const blob = new Blob([invoice.xml], { type: "application/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Factura_${invoice.folio || invoice.uuid}.xml`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div
      id="autofactura"
      className="scroll-mt-24 bg-[color:var(--surface-2)] border border-[color:var(--border)] p-5 md:p-8 mb-10"
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-2">
        {t("Facturación electrónica")}
      </div>
      <h2 className="font-display text-xl md:text-2xl uppercase mb-4">{t("Timbre o consulte su CFDI en línea")}</h2>

      <div className="flex flex-wrap gap-px bg-[color:var(--border)] border border-[color:var(--border)] mb-6">
        {(
          [
            ["facturar", t("Facturar")],
            ["consultar", t("Consultar factura")],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 min-w-[9rem] px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
              tab === key
                ? "bg-brand-blue text-white"
                : "bg-[color:var(--surface)] hover:text-brand-blue"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "facturar" && (
        <>
          <div className="border-l-2 border-signal bg-[color:var(--surface)] p-4 mb-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue mb-1">
              {t("Importante")}
            </div>
            <p className="text-xs text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)]">
              {t(
                "La factura puede emitirse a partir del día siguiente de la operación y dentro del mes en curso. Para clientes tipo Normal es obligatoria la referencia de pago.",
              )}
            </p>
          </div>

          {!cliente ? (
            <form onSubmit={validarPago} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="fact-cot">
                    {t("No. Cotización")} *
                  </label>
                  <input
                    id="fact-cot"
                    className={inputCls}
                    value={cotizacion}
                    onChange={(ev) => setCotizacion(ev.target.value)}
                    placeholder="COT-2026-001"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="fact-ref">
                    {t("Referencia de pago")}
                  </label>
                  <input
                    id="fact-ref"
                    className={inputCls}
                    value={referencia}
                    onChange={(ev) => setReferencia(ev.target.value)}
                    placeholder="REF123456"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={loading} className={btnCls}>
                  {loading ? t("Validando…") : t("Continuar")} →
                </button>
                <button type="button" onClick={resetFacturar} className={ghostCls}>
                  {t("Cancelar")}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={actualizarYFacturar} className="grid gap-4">
              <div className="bg-[color:var(--surface)] border border-[color:var(--border)] p-4">
                <div className="text-[10px] uppercase tracking-[0.25em] text-brand-blue font-bold mb-1">
                  {t("Confirmar datos fiscales")}
                </div>
                <div className="font-display text-base uppercase break-words">{cliente.NombreEmpresa}</div>
                <div className="text-xs text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] mt-1 break-words">
                  RFC {cliente.RFC} · {t("Código")} {cliente.Codigo}
                  {cliente.Email ? ` · ${cliente.Email}` : ""}
                  {cliente.RegimenFiscal ? ` · ${t("Régimen")} ${cliente.RegimenFiscal}` : ""}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="f-calle">
                    {t("Calle")} *
                  </label>
                  <input
                    id="f-calle"
                    className={inputCls}
                    value={fiscal.calle}
                    onChange={(ev) => setFiscal({ ...fiscal, calle: ev.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls} htmlFor="f-no">
                      {t("No. Ext")} *
                    </label>
                    <input
                      id="f-no"
                      className={inputCls}
                      value={fiscal.numero}
                      onChange={(ev) => setFiscal({ ...fiscal, numero: ev.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="f-noint">
                      {t("No. Int")}
                    </label>
                    <input
                      id="f-noint"
                      className={inputCls}
                      value={fiscal.numeroInt}
                      onChange={(ev) => setFiscal({ ...fiscal, numeroInt: ev.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="f-col">
                    {t("Colonia")} *
                  </label>
                  <input
                    id="f-col"
                    className={inputCls}
                    value={fiscal.colonia}
                    onChange={(ev) => setFiscal({ ...fiscal, colonia: ev.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls} htmlFor="f-cp">
                      {t("CP")} *
                    </label>
                    <input
                      id="f-cp"
                      className={inputCls}
                      value={fiscal.cp}
                      inputMode="numeric"
                      maxLength={5}
                      onChange={(ev) => setFiscal({ ...fiscal, cp: ev.target.value.replace(/\D/g, "") })}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="f-tel">
                      {t("Teléfono")}
                    </label>
                    <input
                      id="f-tel"
                      className={inputCls}
                      value={fiscal.telefono}
                      onChange={(ev) => setFiscal({ ...fiscal, telefono: ev.target.value })}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="f-uso">
                    {t("Uso de CFDI")} *
                  </label>
                  <select
                    id="f-uso"
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

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={loading} className={btnCls}>
                  {loading ? t("Emitiendo…") : t("Actualizar y emitir factura")} →
                </button>
                <button type="button" onClick={resetFacturar} className={ghostCls}>
                  {t("Cancelar")}
                </button>
              </div>
            </form>
          )}

          {error && (
            <p className="mt-4 text-sm text-signal border border-signal/40 bg-[color:var(--surface)] p-3">{error}</p>
          )}
        </>
      )}

      {tab === "consultar" && (
        <>
          {uuid !== null && (
            <div className="border border-brand-blue/40 bg-[color:var(--surface)] p-4 mb-6">
              <p className="text-sm font-bold">{t("¡Factura emitida con éxito!")}</p>
              {uuid && <p className="text-xs font-mono break-all mt-1">UUID: {uuid}</p>}
            </div>
          )}

          <form onSubmit={buscarFactura} className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
            <div>
              <label className={labelCls} htmlFor="q-criterio">
                {t("Folio, folio fiscal (UUID) o No. de cotización")}
              </label>
              <input
                id="q-criterio"
                className={inputCls}
                value={criterio}
                onChange={(ev) => setCriterio(ev.target.value)}
                placeholder="COT-2026-001"
              />
            </div>
            <button type="submit" disabled={searching} className={btnCls}>
              {searching ? t("Buscando…") : t("Buscar")}
            </button>
            <button
              type="button"
              className={ghostCls}
              onClick={() => {
                setCriterio("");
                setInvoice(null);
                setSearchError(null);
              }}
            >
              {t("Limpiar")}
            </button>
          </form>

          {searchError && (
            <p className="mt-4 text-sm text-signal border border-signal/40 bg-[color:var(--surface)] p-3">
              {searchError}
            </p>
          )}

          {invoice && (
            <div className="mt-6 bg-[color:var(--surface)] border border-[color:var(--border)] p-4 md:p-5 grid md:grid-cols-[1fr_auto] gap-4 items-start">
              <div className="text-sm grid gap-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue">
                  {t("Factura encontrada")}
                </div>
                <div>
                  <strong>{t("Folio")}:</strong> {invoice.folio || "—"}
                </div>
                <div className="break-all">
                  <strong>UUID:</strong> {invoice.uuid || "—"}
                </div>
                <div>
                  <strong>{t("Cotización")}:</strong> {invoice.cotizacion || "—"}
                </div>
                <div>
                  <strong>{t("Fecha")}:</strong>{" "}
                  {invoice.fecha ? invoice.fecha.split("-").reverse().join("/") : "—"}
                </div>
                <div>
                  <strong>{t("Total")}:</strong>{" "}
                  {invoice.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className={ghostCls}
                  onClick={() =>
                    invoice.xml ? setShowXml(true) : setSearchError(t("No hay XML disponible para esta factura."))
                  }
                >
                  XML
                </button>
                <button type="button" className={ghostCls} onClick={descargarXml} disabled={!invoice.xml}>
                  {t("Descargar")}
                </button>
              </div>
            </div>
          )}

          {showXml && invoice?.xml && (
            <div className="mt-4 border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue">
                  {t("Contenido XML")}
                </div>
                <button type="button" className={ghostCls} onClick={() => setShowXml(false)}>
                  {t("Cerrar")}
                </button>
              </div>
              <pre className="max-h-72 overflow-auto text-[11px] leading-relaxed whitespace-pre-wrap break-all">
                {invoice.xml}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
