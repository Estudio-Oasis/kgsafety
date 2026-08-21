import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";
import { COURSES } from "@/data/kaee";
import { erpListCourses, erpListCalendar, erpLookupClient, erpCreateQuote, erpListContractors } from "@/lib/erp.functions";
import { normalizeRfc, validateRfc } from "@/lib/rfc";
import { QuoteBillingBanner } from "@/components/site/QuoteBillingBanner";

export const Route = createFileRoute("/contacto")({
  component: ContactoPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { curso?: string; insumo?: string; idCurso?: string; folio?: string; tipo?: string } => ({
    curso: typeof search.curso === "string" ? search.curso : undefined,
    insumo: typeof search.insumo === "string" ? search.insumo : undefined,
    idCurso: typeof search.idCurso === "string" ? search.idCurso : undefined,
    folio: typeof search.folio === "string" ? search.folio : undefined,
    tipo: typeof search.tipo === "string" ? search.tipo : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Cotización · KG Safety" },
      { name: "description", content: "Solicite su cotización de capacitación en trabajos en altura. Respuesta personalizada según curso y número de participantes." },
      { property: "og:title", content: "Cotización · KG Safety" },
      { property: "og:description", content: "Cotice capacitación, ingeniería o equipos. Respuesta en menos de 1 hora." },
      { property: "og:url", content: "https://kgsafety.lovable.app/contacto" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cotización · KG Safety" },
      { name: "twitter:description", content: "Cotice capacitación, ingeniería o equipos. Respuesta en menos de 1 hora." },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/contacto" }],
  }),
});

type ErpCourse = { IdCurso: number; IdServicio: number; nombre: string; duracion: number; precio: number };
type ErpDate = { IdCalendario: number; fecha: string; fechaTexto: string; IdCurso: number; tipo: string };

type FormState = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  idCurso: string;
  participantes: string;
  modalidad: "Local" | "Foraneo";
  tipoCurso: "Cerrado" | "Abierto";
  ubicacion: string;
  rfc: string;
  fechaDeseada: string;
  mensaje: string;
  acepta: boolean;
  idContratista: string;
  otroContratista: string;
};

function norm(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function ContactoPage() {
  const { t } = useT();
  const { curso: cursoSlug, insumo, idCurso: idCursoParam, folio: folioParam, tipo: tipoParam } = Route.useSearch();
  const [contractors, setContractors] = useState<{ IdContratista: number; nombre: string }[]>([]);

  const [courses, setCourses] = useState<ErpCourse[]>([]);
  const [erpDown, setErpDown] = useState(false);
  const [dates, setDates] = useState<ErpDate[]>([]);
  const [rfcState, setRfcState] = useState<{ status: "idle" | "checking" | "existente" | "nuevo" | "invalido"; nombre?: string }>({ status: "idle" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    folio?: string | null;
    msg: string;
    titulo?: string;
    traceId?: string | null;
    retryable?: boolean;
  } | null>(null);

  const [form, setForm] = useState<FormState>({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    idCurso: "",
    participantes: "",
    modalidad: "Local",
    tipoCurso: "Cerrado",
    ubicacion: "",
    rfc: "",
    fechaDeseada: "",
    mensaje: insumo ? `Solicito cotización de: ${insumo}` : "",
    acepta: false,
    idContratista: "",
    otroContratista: "",
  });

  useEffect(() => {
    let alive = true;
    erpListContractors()
      .then((r) => {
        if (!alive) return;
        // El ERP devuelve razones sociales repetidas (agentes/sucursales): se
        // deduplica por nombre normalizado para no mostrar opciones idénticas.
        const seen = new Set<string>();
        const unique = r.contractors.filter((c) => {
          const key = c.nombre.trim().toLowerCase();
          if (!key || key === "otro" || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setContractors(unique.sort((a, b) => a.nombre.localeCompare(b.nombre, "es")));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);


  useEffect(() => {
    if (idCursoParam) setForm((f) => ({ ...f, idCurso: idCursoParam }));
    if (tipoParam === "Abierto") setForm((f) => ({ ...f, tipoCurso: "Abierto" }));
  }, [idCursoParam, tipoParam]);

  // FA7: modalidad Local fija la sede de KG Safety.
  useEffect(() => {
    setForm((f) =>
      f.modalidad === "Local" ? { ...f, ubicacion: "Toluca de Lerdo, Estado de México" } : f,
    );
  }, [form.modalidad]);

  const preselectedName = useMemo(() => {
    if (!cursoSlug) return null;
    return COURSES.find((c) => c.slug === cursoSlug)?.name ?? null;
  }, [cursoSlug]);

  // Catálogo de cursos en vivo desde el ERP
  useEffect(() => {
    let alive = true;
    erpListCourses()
      .then((res) => {
        if (!alive) return;
        if (!res.ok || res.courses.length === 0) {
          setErpDown(true);
          return;
        }
        setCourses(res.courses);
        const match = preselectedName
          ? res.courses.find((c) => norm(c.nombre).includes(norm(preselectedName).split(" ")[0]))
          : undefined;
        setForm((f) => ({
          ...f,
          idCurso: idCursoParam || f.idCurso || String((match ?? res.courses[0]).IdCurso),
        }));
      })
      .catch(() => alive && setErpDown(true));
    return () => {
      alive = false;
    };
  }, [preselectedName, idCursoParam]);

  // Fechas disponibles del curso seleccionado
  useEffect(() => {
    const id = Number(form.idCurso);
    if (!id) {
      setDates([]);
      return;
    }
    let alive = true;
    erpListCalendar({ data: { idCurso: id } })
      .then((res) => alive && setDates(res.ok ? res.dates : []))
      .catch(() => alive && setDates([]));
    return () => {
      alive = false;
    };
  }, [form.idCurso]);

  const selectedCourse = courses.find((c) => String(c.IdCurso) === form.idCurso);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function checkRfc(rfc: string) {
    const clean = normalizeRfc(rfc);
    if (clean.length < 12) {
      setRfcState({ status: "idle" });
      return;
    }
    const local = validateRfc(clean);
    if (!local.valid) {
      setRfcState({ status: "invalido", nombre: local.reason });
      return;
    }
    setRfcState({ status: "checking" });
    try {
      const res = await erpLookupClient({ data: { rfc: clean } });
      if (res.estado === "rfc_invalido") {
        setRfcState({ status: "invalido", nombre: res.motivo });
      } else if (res.client) {
        setRfcState({ status: "existente", nombre: res.client.Nombre });
        setForm((f) => ({ ...f, empresa: f.empresa || res.client!.Nombre }));
      } else {
        setRfcState({ status: "nuevo" });
      }
    } catch {
      setRfcState({ status: "idle" });
    }
  }


  function whatsappFallback() {
    const text =
      `Hola KG Safety, soy ${form.nombre} de ${form.empresa}.%0A%0A` +
      `Curso: ${selectedCourse?.nombre ?? preselectedName ?? "Por definir"}%0A` +
      `Participantes: ${form.participantes}%0A` +
      `Modalidad: ${form.modalidad} · ${form.tipoCurso}%0A` +
      `Ubicación: ${form.ubicacion}%0A` +
      `RFC: ${form.rfc}%0A` +
      `Email: ${form.email} · Tel: ${form.telefono}%0A%0A` +
      `Mensaje: ${form.mensaje}`;
    window.open(`https://wa.me/527228795076?text=${text}`, "_blank");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.acepta || sending) return;

    if (erpDown || !selectedCourse) {
      whatsappFallback();
      return;
    }

    const rfcCheck = validateRfc(form.rfc);
    if (!rfcCheck.valid) {
      setRfcState({ status: "invalido", nombre: rfcCheck.reason });
      setResult({
        ok: false,
        titulo: "RFC inválido",
        msg: rfcCheck.reason ?? "Verifique el RFC antes de enviar la solicitud.",
      });
      return;
    }

    setSending(true);
    setResult(null);
    try {
      const res = await erpCreateQuote({
        data: {
          rfc: normalizeRfc(form.rfc),
          empresa: form.empresa,
          nombre: form.nombre,
          correo: form.email,
          telefono: form.telefono,
          idCurso: selectedCourse.IdCurso,
          idServicio: selectedCourse.IdServicio ?? 0,
          participantes: Number(form.participantes) || 1,
          lugarCurso: form.modalidad,
          tipoCursoCliente: form.tipoCurso,
          lugarServicio: form.ubicacion,
          comentarios: form.mensaje,
          fechaDeseada: form.fechaDeseada || undefined,
          idContratista: Number(form.idContratista) || 0,
          nombreContratista: form.otroContratista.trim(),
          folioCurso: folioParam ?? "",
        },
      });

      if (res.ok) {
        const pendiente = res.code === "recibida_pendiente_verificacion";
        const enCola = res.code === "recibida_en_cola";
        const folio = res.folio && res.folio.trim() ? res.folio.trim() : null;
        setResult({
          ok: true,
          folio,
          traceId: res.traceId,
          titulo: pendiente || enCola || !folio ? "Solicitud recibida" : "Solicitud registrada",
          msg: enCola
            ? res.message
            : pendiente
              ? "Su solicitud fue recibida y está pendiente de verificación. No la envíe de nuevo: un asesor la confirmará."
              : folio
                ? "Su solicitud quedó registrada en nuestro sistema. Un asesor le enviará la cotización formal."
                : "Su solicitud fue recibida correctamente. No la envíe de nuevo: un asesor la confirmará y le enviará la cotización formal.",
        });

      } else {
        setResult({
          ok: false,
          titulo:
            res.stage === "validacion"
              ? "RFC inválido"
              : res.stage === "crear_cliente"
                ? "No pudimos dar de alta el cliente"
                : "No se pudo registrar",
          msg: `${res.message} ${res.retryable ? "Puede intentarlo de nuevo en unos minutos." : "Envíela por WhatsApp y la atendemos de inmediato."}`,
          traceId: res.traceId,
          retryable: res.retryable,
        });
      }
    } catch {
      setResult({
        ok: false,
        titulo: "No se pudo confirmar el envío",
        msg: "No recibimos confirmación del sistema. No reenvíe la solicitud: contáctenos por WhatsApp para verificarla.",
      });
    } finally {
      setSending(false);
    }
  }


  const inputCls = "w-full bg-anchor border border-white/10 px-4 py-3 text-sm focus:border-signal outline-none";
  const labelCls = "text-[10px] text-white/50 uppercase mb-2 block tracking-widest";

  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>{t("Cotización en 24 horas")}</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            {t("Comparta su riesgo.")}{" "}<br />
            <span className="text-signal">{t("Lo convertimos en un plan técnico.")}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            {t("Proporciona los detalles del curso que te interesa y el número de personas para recibir una cotización personalizada.")}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-3 bg-steel border border-white/10 p-6 md:p-10 space-y-5">
            {/* Datos de contacto */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="f-nombre" className={labelCls}>{t("Nombre")}</label>
                <input id="f-nombre" name="nombre" autoComplete="name" required type="text" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} className={inputCls} placeholder="Juan Pérez" />
              </div>
              <div>
                <label htmlFor="f-empresa" className={labelCls}>{t("Empresa")}</label>
                <input id="f-empresa" name="organization" autoComplete="organization" required type="text" value={form.empresa} onChange={(e) => set("empresa", e.target.value)} className={inputCls} placeholder={t("Razón social")} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="f-email" className={labelCls}>{t("Email corporativo")}</label>
                <input id="f-email" name="email" autoComplete="email" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="juan@empresa.com" />
              </div>
              <div>
                <label htmlFor="f-telefono" className={labelCls}>{t("Teléfono")}</label>
                <input id="f-telefono" name="tel" autoComplete="tel" required type="tel" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} className={inputCls} placeholder="+52 ..." />
              </div>
            </div>

            {/* Detalle del servicio */}
            <div className="pt-4 border-t border-white/10 grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="f-curso" className={labelCls}>{t("Curso de interés")}</label>
                {erpDown ? (
                  <input id="f-curso" type="text" value={form.mensaje ? "" : preselectedName ?? ""} onChange={(e) => set("mensaje", e.target.value)} className={inputCls} placeholder="Escriba el curso o servicio" />
                ) : (
                  <select id="f-curso" value={form.idCurso} onChange={(e) => set("idCurso", e.target.value)} className={inputCls}>
                    {courses.length === 0 && <option value="">Cargando catálogo…</option>}
                    {courses.map((c) => (
                      <option key={c.IdCurso} value={c.IdCurso}>{c.nombre}</option>
                    ))}
                  </select>
                )}
                {selectedCourse && (
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">
                    {selectedCourse.duracion} h · Precio de referencia ${selectedCourse.precio.toLocaleString("es-MX")} + IVA
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="f-participantes" className={labelCls}>{t("Número de participantes")}</label>
                <input id="f-participantes" required type="number" min={1} value={form.participantes} onChange={(e) => set("participantes", e.target.value)} className={inputCls} placeholder="10" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <span className={labelCls} id="f-modalidad-label">{t("Modalidad")}</span>
                <div className="flex gap-2" role="group" aria-labelledby="f-modalidad-label">
                  {([
                    { v: "Local", l: "Local" },
                    { v: "Foraneo", l: "Foráneo" },
                  ] as const).map((m) => (
                    <button
                      key={m.v}
                      type="button"
                      aria-pressed={form.modalidad === m.v}
                      onClick={() => set("modalidad", m.v)}
                      className={`flex-1 min-h-11 px-4 py-3 text-xs uppercase tracking-widest font-bold border ${
                        form.modalidad === m.v
                          ? "bg-signal text-anchor border-signal"
                          : "border-white/15 text-white/70 hover:border-signal"
                      }`}
                    >
                      {m.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className={labelCls} id="f-tipo-label">Tipo de curso</span>
                <div className="flex gap-2" role="group" aria-labelledby="f-tipo-label">
                  {(["Cerrado", "Abierto"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={form.tipoCurso === m}
                      onClick={() => set("tipoCurso", m)}
                      className={`flex-1 min-h-11 px-4 py-3 text-xs uppercase tracking-widest font-bold border ${
                        form.tipoCurso === m
                          ? "bg-brand-blue text-white border-brand-blue"
                          : "border-white/15 text-white/70 hover:border-brand-blue"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="f-ubicacion" className={labelCls}>{t("Ubicación (planta / ciudad / estado)")}</label>
                <input
                  id="f-ubicacion"
                  type="text"
                  required
                  readOnly={form.modalidad === "Local"}
                  value={form.ubicacion}
                  onChange={(e) => set("ubicacion", e.target.value)}
                  className={`${inputCls} ${form.modalidad === "Local" ? "opacity-70" : ""}`}
                  placeholder="Toluca, Edo. Méx."
                />
                {form.modalidad === "Foraneo" && (
                  <p className="text-[10px] text-signal uppercase tracking-widest mt-2 leading-relaxed">
                    {t("Los cursos foráneos generan un costo extra por viáticos y traslado del instructor.")}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="f-fecha" className={labelCls}>Fecha deseada (opcional)</label>
                <select id="f-fecha" value={form.fechaDeseada} onChange={(e) => set("fechaDeseada", e.target.value)} className={inputCls} disabled={dates.length === 0}>
                  <option value="">{dates.length === 0 ? "Sin fechas publicadas · a convenir" : "A convenir"}</option>
                  {dates.map((d) => (
                    <option key={d.IdCalendario} value={d.fecha}>{d.fechaTexto} · {d.tipo}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contratista SSPA */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="f-contratista" className={labelCls}>{t("Contratista / empresa cliente")}</label>
                <select
                  id="f-contratista"
                  value={form.idContratista}
                  onChange={(e) => set("idContratista", e.target.value)}
                  className={inputCls}
                >
                  <option value="">{contractors.length === 0 ? t("No aplica") : t("Seleccione contratista")}</option>
                  {contractors.map((c) => (
                    <option key={c.IdContratista} value={c.IdContratista}>
                      {c.nombre}
                    </option>
                  ))}
                  <option value="0">{t("Otro")}</option>
                </select>
              </div>
              {form.idContratista === "0" && (
                <div>
                  <label htmlFor="f-otro-contratista" className={labelCls}>{t("Nombre del contratista")}</label>
                  <input
                    id="f-otro-contratista"
                    type="text"
                    required
                    value={form.otroContratista}
                    onChange={(e) => set("otroContratista", e.target.value)}
                    className={inputCls}
                    placeholder={t("Razón social del contratista")}
                  />
                </div>
              )}
            </div>

            {/* RFC */}
            <div className="pt-4 border-t border-white/10">
              <label htmlFor="f-rfc" className={labelCls}>{t("Validación de RFC")}</label>
              <input
                id="f-rfc"
                required
                type="text"
                value={form.rfc}
                aria-invalid={rfcState.status === "invalido"}
                aria-describedby="f-rfc-help"
                onChange={(e) => {
                  set("rfc", e.target.value.toUpperCase());
                  setRfcState({ status: "idle" });
                }}
                onBlur={(e) => checkRfc(e.target.value)}
                className={inputCls}
                minLength={12}
                maxLength={13}
                placeholder="RFC (12 o 13 caracteres)"
              />
              <p id="f-rfc-help" aria-live="polite" className="text-[10px] uppercase tracking-widest mt-2 min-h-[14px]">
                {rfcState.status === "checking" && <span className="text-white/40">Validando RFC…</span>}
                {rfcState.status === "invalido" && <span className="text-red-400 normal-case tracking-normal">{rfcState.nombre ?? "RFC inválido"}</span>}
                {rfcState.status === "existente" && <span className="text-signal">Cliente existente{rfcState.nombre ? ` · ${rfcState.nombre}` : ""}</span>}
                {rfcState.status === "nuevo" && <span className="text-white/50">RFC válido · cliente nuevo, se dará de alta al enviar</span>}
              </p>

            </div>

            <div>
              <label htmlFor="f-mensaje" className={labelCls}>{t("Mensaje adicional")}</label>
              <textarea id="f-mensaje" value={form.mensaje} onChange={(e) => set("mensaje", e.target.value)} className={`${inputCls} h-28`} placeholder={t("Contexto operativo, fechas tentativas, alcance, etc.")} />
            </div>


            <label className="flex items-start gap-3 text-xs text-white/70 leading-relaxed cursor-pointer">
              <input
                type="checkbox"
                checked={form.acepta}
                onChange={(e) => set("acepta", e.target.checked)}
                className="mt-1 h-4 w-4 accent-[color:var(--signal)] shrink-0"
                required
              />
              <span>
                {t("Acepto las políticas de servicio y el tratamiento de datos personales de KG Safety para fines de cotización y contacto comercial.")}
              </span>
            </label>

            {result && (
              <div className={`border p-4 text-sm ${result.ok ? "border-signal/40 bg-signal/10 text-white" : "border-red-500/40 bg-red-500/10 text-white"}`}>
                <p className="font-bold uppercase text-[10px] tracking-widest mb-1">
                  {result.titulo ?? (result.ok ? "Solicitud registrada" : "No se pudo registrar")}
                </p>
                <p className="text-white/80 leading-relaxed">{result.msg}</p>
                {result.ok && result.folio && (
                  <p className="mt-2 font-mono text-xs">Folio: {result.folio}</p>
                )}
                {result.traceId && (
                  <p className="mt-1 font-mono text-[10px] text-white/40">Ref. técnica: {result.traceId}</p>
                )}
                {!result.ok && (

                  <button type="button" onClick={whatsappFallback} className="mt-3 bg-[#25D366] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                    Enviar por WhatsApp
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!form.acepta || sending || rfcState.status === "invalido" || rfcState.status === "checking"}
              className="w-full min-h-12 bg-signal text-anchor font-bold py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Enviando…" : t("Enviar cotización")}
            </button>
            {rfcState.status === "invalido" && (
              <p className="text-[10px] text-red-400 uppercase tracking-widest text-center">
                Corrija el RFC para poder enviar la solicitud.
              </p>
            )}

            <p className="text-[10px] text-white/40 uppercase tracking-widest text-center">
              {t("También puede escribirnos a capacitacion@kg-safety.com")}
            </p>
          </form>

          <aside className="lg:col-span-2 space-y-8">
            <div>
              <SectionLabel>{t("Contacto directo")}</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl uppercase leading-tight mb-4">
                {t("Solicita una cotización")}
              </h2>
              <p className="text-white/60 leading-relaxed">
                {t("Proporciona los detalles del curso que te interesa y el número de personas para recibir una cotización personalizada.")}
              </p>
            </div>

            <a href="tel:+527228795076" className="flex items-start gap-4 bg-steel border border-white/10 p-5 hover:border-signal transition-colors group">
              <div className="w-11 h-11 flex items-center justify-center bg-signal/10 border border-signal/30 text-signal shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <p className="font-display text-lg text-white group-hover:text-signal transition-colors">722 879 5076</p>
                <p className="text-xs text-white/50 mt-1">{t("Lunes a Viernes de 09:00 a 18:00")}</p>
              </div>
            </a>

            <a href="mailto:capacitacion@kg-safety.com" className="flex items-start gap-4 bg-steel border border-white/10 p-5 hover:border-signal transition-colors group">
              <div className="w-11 h-11 flex items-center justify-center bg-signal/10 border border-signal/30 text-signal shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg text-white group-hover:text-signal transition-colors break-all">capacitacion@kg-safety.com</p>
                <p className="text-xs text-white/50 mt-1">{t("Respuesta en menos de 1 hora")}</p>
              </div>
            </a>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-3">{t("Oficina")}</h4>
              <p className="text-white/70 leading-relaxed text-sm">
                José María Pino Suárez 304-1<br />Col. 5 de Mayo, Toluca<br />Estado de México, C.P. 50090
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-3">{t("Atención inmediata")}</h4>
              <a href="https://wa.me/527228795076" target="_blank" rel="noopener noreferrer"
                className="inline-block bg-[#25D366] text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-opacity">
                {t("Abrir WhatsApp")}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <QuoteBillingBanner tone="light" quoteTitle="¿Ya tiene su cotización?" quoteDesc="Consulte el estatus de su solicitud o genere una nueva con el formulario de arriba." />
    </div>
  );
}
