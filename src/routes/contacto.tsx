import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";
import { COURSES } from "@/data/kaee";

export const Route = createFileRoute("/contacto")({
  component: ContactoPage,
  head: () => ({
    meta: [
      { title: "Cotización · KG Safety" },
      { name: "description", content: "Solicite su cotización. Formulario alineado al ERP KG Safety: curso de interés, participantes, modalidad, ubicación, RFC y contratista." },
      { property: "og:title", content: "Cotización · KG Safety" },
      { property: "og:description", content: "Cotice capacitación, ingeniería o equipos con los mismos datos que utiliza nuestro ERP." },
      { property: "og:url", content: "https://kgsafety.lovable.app/contacto" },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/contacto" }],
  }),
});

type FormState = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  cursoInteres: string;
  participantes: string;
  modalidad: "Local" | "Foráneo";
  ubicacion: string;
  rfcStatus: "existente" | "nuevo";
  rfc: string;
  contratista: string;
  mensaje: string;
  acepta: boolean;
};

function ContactoPage() {
  const { t } = useT();
  const activeCourses = useMemo(() => COURSES.filter((c) => c.active !== false), []);

  const [form, setForm] = useState<FormState>({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    cursoInteres: activeCourses[0]?.name ?? "Otro",
    participantes: "",
    modalidad: "Local",
    ubicacion: "",
    rfcStatus: "nuevo",
    rfc: "",
    contratista: "",
    mensaje: "",
    acepta: false,
  });

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.acepta) return;
    const text =
      `Hola KG Safety, soy ${form.nombre} de ${form.empresa}.%0A%0A` +
      `Curso de interés: ${form.cursoInteres}%0A` +
      `Participantes: ${form.participantes}%0A` +
      `Modalidad: ${form.modalidad}%0A` +
      `Ubicación: ${form.ubicacion}%0A` +
      `RFC (${form.rfcStatus}): ${form.rfc}%0A` +
      `Contratista: ${form.contratista || "N/A"}%0A` +
      `Email: ${form.email} · Tel: ${form.telefono}%0A%0A` +
      `Mensaje: ${form.mensaje}`;
    window.open(`https://wa.me/527228795076?text=${text}`, "_blank");
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
            {t("Formulario alineado al ERP KG Safety. Los datos alimentan directamente el registro de la cotización.")}
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
                <input type="tel" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} className={inputCls} placeholder="+52 ..." />
              </div>
            </div>

            {/* Detalle del servicio */}
            <div className="pt-4 border-t border-white/10 grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{t("Curso de interés")}</label>
                <select value={form.cursoInteres} onChange={(e) => set("cursoInteres", e.target.value)} className={inputCls}>
                  {activeCourses.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Ingeniería / Líneas de vida">Ingeniería / Líneas de vida</option>
                  <option value="Equipos / EPP">Equipos / EPP</option>
                  <option value="P.N.P.C. Contratistas">P.N.P.C. Contratistas</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("Número de participantes")}</label>
                <input type="number" min={1} value={form.participantes} onChange={(e) => set("participantes", e.target.value)} className={inputCls} placeholder="10" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{t("Modalidad")}</label>
                <div className="flex gap-2">
                  {(["Local", "Foráneo"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => set("modalidad", m)}
                      className={`flex-1 px-4 py-3 text-xs uppercase tracking-widest font-bold border ${
                        form.modalidad === m
                          ? "bg-signal text-anchor border-signal"
                          : "border-white/15 text-white/70 hover:border-signal"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>{t("Ubicación (planta / ciudad / estado)")}</label>
                <input type="text" value={form.ubicacion} onChange={(e) => set("ubicacion", e.target.value)} className={inputCls} placeholder="Toluca, Edo. Méx." />
              </div>
            </div>

            {/* RFC */}
            <div className="pt-4 border-t border-white/10">
              <label className={labelCls}>{t("Validación de RFC")}</label>
              <div className="flex gap-2 mb-3">
                {(
                  [
                    { v: "existente", l: "Cliente existente" },
                    { v: "nuevo", l: "Registro nuevo" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => set("rfcStatus", opt.v)}
                    className={`flex-1 px-4 py-3 text-xs uppercase tracking-widest font-bold border ${
                      form.rfcStatus === opt.v
                        ? "bg-brand-blue text-white border-brand-blue"
                        : "border-white/15 text-white/70 hover:border-brand-blue"
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={form.rfc}
                onChange={(e) => set("rfc", e.target.value.toUpperCase())}
                className={inputCls}
                maxLength={13}
                placeholder="RFC (12 o 13 caracteres)"
              />
            </div>

            <div>
              <label className={labelCls}>{t("Contratista (si aplica)")}</label>
              <input type="text" value={form.contratista} onChange={(e) => set("contratista", e.target.value)} className={inputCls} placeholder={t("Razón social del contratista")} />
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

            <button
              type="submit"
              disabled={!form.acepta}
              className="w-full bg-signal text-anchor font-bold py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Enviar cotización")}
            </button>
            <p className="text-[10px] text-white/40 uppercase tracking-widest text-center">
              {t("También puede escribirnos a ventas@kg-safety.com")}
            </p>
          </form>

          <aside className="lg:col-span-2 space-y-10">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">{t("Teléfono y WhatsApp")}</h4>
              <a href="tel:+527228795076" className="font-display text-2xl text-signal hover:text-white transition-colors block">+52 722 879 5076</a>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">{t("Correo")}</h4>
              <a href="mailto:ventas@kg-safety.com" className="text-white hover:text-signal transition-colors">ventas@kg-safety.com</a>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">{t("Oficina")}</h4>
              <p className="text-white/70 leading-relaxed">
                José María Pino Suárez 304-1<br />Col. 5 de Mayo, Toluca<br />Estado de México, C.P. 50090
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">{t("Horario")}</h4>
              <p className="text-white/70">{t("Lunes a Viernes · 9:00 – 18:00 hrs")}</p>
            </div>
            <div className="border-t border-white/10 pt-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">{t("Atención inmediata")}</h4>
              <a href="https://wa.me/527228795076" target="_blank" rel="noopener noreferrer"
                className="inline-block bg-[#25D366] text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-opacity">
                {t("Abrir WhatsApp")}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
