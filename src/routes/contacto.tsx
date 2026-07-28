import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";
import { COURSES } from "@/data/kaee";
import { erpListCourses, erpListCalendar, erpLookupClient, erpCreateQuote } from "@/lib/erp.functions";
import { QuoteBillingBanner } from "@/components/site/QuoteBillingBanner";

export const Route = createFileRoute("/contacto")({
  component: ContactoPage,
  validateSearch: (search: Record<string, unknown>): { curso?: string } => ({
    curso: typeof search.curso === "string" ? search.curso : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Cotización · KG Safety" },
      { name: "description", content: "Solicite su cotización de capacitación en trabajos en altura. Respuesta personalizada según curso y número de participantes." },
      { property: "og:title", content: "Cotización · KG Safety" },
      { property: "og:description", content: "Cotice capacitación, ingeniería o equipos. Respuesta en menos de 1 hora." },
      { property: "og:url", content: "https://kgsafety.lovable.app/contacto" },
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
};

function norm(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function ContactoPage() {
  const { t } = useT();
  const { curso: cursoSlug } = Route.useSearch();

  const [courses, setCourses] = useState<ErpCourse[]>([]);
  const [erpDown, setErpDown] = useState(false);
  const [dates, setDates] = useState<ErpDate[]>([]);
  const [rfcState, setRfcState] = useState<{ status: "idle" | "checking" | "existente" | "nuevo"; nombre?: string }>({ status: "idle" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; folio?: string | null; msg: string } | null>(null);

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
    mensaje: "",
    acepta: false,
  });

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
        setForm((f) => ({ ...f, idCurso: String((match ?? res.courses[0]).IdCurso) }));
      })
      .catch(() => alive && setErpDown(true));
    return () => {
      alive = false;
    };
  }, [preselectedName]);

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
    const clean = rfc.trim().toUpperCase();
    if (clean.length < 12) {
      setRfcState({ status: "idle" });
      return;
    }
    setRfcState({ status: "checking" });
    try {
      const res = await erpLookupClient({ data: { rfc: clean } });
      if (res.ok && res.client) {
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

    setSending(true);
    setResult(null);
    try {
      const res = await erpCreateQuote({
        data: {
          rfc: form.rfc.trim().toUpperCase(),
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
        },
      });

      if (res.ok) {
        setResult({
          ok: true,
          folio: res.folio,
          msg: "Su solicitud quedó registrada en nuestro sistema. Un asesor le enviará la cotización formal.",
        });
      } else {
        setResult({ ok: false, msg: "No pudimos registrar la solicitud. Envíela por WhatsApp y la atendemos de inmediato." });
      }
    } catch {
      setResult({ ok: false, msg: "No pudimos registrar la solicitud. Envíela por WhatsApp y la atendemos de inmediato." });
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
                <label className={labelCls}>{t("Nombre")}</label>
                <input required type="text" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} className={inputCls} placeholder="Juan Pérez" />
              </div>
              <div>
                <label className={labelCls}>{t("Empresa")}</label>
                <input required type="text" value={form.empresa} onChange={(e) => set("empresa", e.target.value)} className={inputCls} placeholder={t("Razón social")} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{t("Email corporativo")}</label>
                <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="juan@empresa.com" />
              </div>
              <div>
                <label className={labelCls}>{t("Teléfono")}</label>
                <input required type="tel" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} className={inputCls} placeholder="+52 ..." />
              </div>
            </div>

            {/* Detalle del servicio */}
            <div className="pt-4 border-t border-white/10 grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{t("Curso de interés")}</label>
                {erpDown ? (
                  <input type="text" value={form.mensaje ? "" : preselectedName ?? ""} onChange={(e) => set("mensaje", e.target.value)} className={inputCls} placeholder="Escriba el curso o servicio" />
                ) : (
                  <select value={form.idCurso} onChange={(e) => set("idCurso", e.target.value)} className={inputCls}>
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
                <label className={labelCls}>{t("Número de participantes")}</label>
                <input required type="number" min={1} value={form.participantes} onChange={(e) => set("participantes", e.target.value)} className={inputCls} placeholder="10" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{t("Modalidad")}</label>
                <div className="flex gap-2">
                  {([
                    { v: "Local", l: "Local" },
                    { v: "Foraneo", l: "Foráneo" },
                  ] as const).map((m) => (
                    <button
                      key={m.v}
                      type="button"
                      onClick={() => set("modalidad", m.v)}
                      className={`flex-1 px-4 py-3 text-xs uppercase tracking-widest font-bold border ${
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
                <label className={labelCls}>Tipo de curso</label>
                <div className="flex gap-2">
                  {(["Cerrado", "Abierto"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => set("tipoCurso", m)}
                      className={`flex-1 px-4 py-3 text-xs uppercase tracking-widest font-bold border ${
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
                <label className={labelCls}>{t("Ubicación (planta / ciudad / estado)")}</label>
                <input type="text" value={form.ubicacion} onChange={(e) => set("ubicacion", e.target.value)} className={inputCls} placeholder="Toluca, Edo. Méx." />
              </div>
              <div>
                <label className={labelCls}>Fecha deseada (opcional)</label>
                <select value={form.fechaDeseada} onChange={(e) => set("fechaDeseada", e.target.value)} className={inputCls} disabled={dates.length === 0}>
                  <option value="">{dates.length === 0 ? "Sin fechas publicadas · a convenir" : "A convenir"}</option>
                  {dates.map((d) => (
                    <option key={d.IdCalendario} value={d.fecha}>{d.fechaTexto} · {d.tipo}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* RFC */}
            <div className="pt-4 border-t border-white/10">
              <label className={labelCls}>{t("Validación de RFC")}</label>
              <input
                required
                type="text"
                value={form.rfc}
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
              <p className="text-[10px] uppercase tracking-widest mt-2 min-h-[14px]">
                {rfcState.status === "checking" && <span className="text-white/40">Validando RFC…</span>}
                {rfcState.status === "existente" && <span className="text-signal">Cliente existente{rfcState.nombre ? ` · ${rfcState.nombre}` : ""}</span>}
                {rfcState.status === "nuevo" && <span className="text-white/50">Registro nuevo · se dará de alta al enviar</span>}
              </p>
            </div>

            <div>
              <label className={labelCls}>{t("Mensaje adicional")}</label>
              <textarea value={form.mensaje} onChange={(e) => set("mensaje", e.target.value)} className={`${inputCls} h-28`} placeholder={t("Contexto operativo, fechas tentativas, alcance, etc.")} />
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
                  {result.ok ? "Solicitud registrada" : "No se pudo registrar"}
                </p>
                <p className="text-white/80 leading-relaxed">{result.msg}</p>
                {result.ok && result.folio && (
                  <p className="mt-2 font-mono text-xs">Folio: {result.folio}</p>
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
              disabled={!form.acepta || sending}
              className="w-full bg-signal text-anchor font-bold py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Enviando…" : t("Enviar cotización")}
            </button>
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
