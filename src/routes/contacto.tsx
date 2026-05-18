import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionLabel } from "@/components/site/SectionLabel";

export const Route = createFileRoute("/contacto")({
  component: ContactoPage,
  head: () => ({
    meta: [
      { title: "Contacto y cotización · KG Safety" },
      {
        name: "description",
        content:
          "Solicite una cotización en menos de 24 horas. Teléfono, WhatsApp y oficinas en Toluca, Estado de México.",
      },
      { property: "og:title", content: "Contacto · KG Safety" },
      {
        property: "og:description",
        content: "Cotice equipos, capacitación o ingeniería. Respuesta el mismo día.",
      },
      { property: "og:url", content: "/contacto" },
    ],
    links: [{ rel: "canonical", href: "/contacto" }],
  }),
});

function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    interes: "Cotización general",
    mensaje: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text =
      `Hola KG Safety, soy ${form.nombre} de ${form.empresa}.%0A%0A` +
      `Interés: ${form.interes}%0A` +
      `Email: ${form.email}%0A` +
      `Teléfono: ${form.telefono}%0A%0A` +
      `Mensaje: ${form.mensaje}`;
    window.open(`https://wa.me/527228795076?text=${text}`, "_blank");
  }

  return (
    <div>
      {/* Hero */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>Cotización en 24 horas</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            Cuéntenos su proyecto.<br />
            <span className="text-signal">Respondemos hoy.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            Comparta detalles de equipos, capacitación o ingeniería. Un especialista lo
            contacta el mismo día hábil.
          </p>
        </div>
      </section>

      {/* Form + info */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 bg-steel border border-white/10 p-6 md:p-10 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] text-white/50 uppercase mb-2 block tracking-widest">
                  Nombre
                </label>
                <input
                  required
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full bg-anchor border border-white/10 px-4 py-3 text-sm focus:border-signal outline-none"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/50 uppercase mb-2 block tracking-widest">
                  Empresa
                </label>
                <input
                  required
                  type="text"
                  value={form.empresa}
                  onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  className="w-full bg-anchor border border-white/10 px-4 py-3 text-sm focus:border-signal outline-none"
                  placeholder="Razón social"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] text-white/50 uppercase mb-2 block tracking-widest">
                  Email corporativo
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-anchor border border-white/10 px-4 py-3 text-sm focus:border-signal outline-none"
                  placeholder="juan@empresa.com"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/50 uppercase mb-2 block tracking-widest">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="w-full bg-anchor border border-white/10 px-4 py-3 text-sm focus:border-signal outline-none"
                  placeholder="+52 ..."
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/50 uppercase mb-2 block tracking-widest">
                Interés
              </label>
              <select
                value={form.interes}
                onChange={(e) => setForm({ ...form, interes: e.target.value })}
                className="w-full bg-anchor border border-white/10 px-4 py-3 text-sm focus:border-signal outline-none"
              >
                <option>Cotización general</option>
                <option>Capacitación DC-3</option>
                <option>Líneas de vida e ingeniería</option>
                <option>Equipos y EPP</option>
                <option>Supervisión en sitio</option>
                <option>P.N.P.C. Contratistas</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-white/50 uppercase mb-2 block tracking-widest">
                Mensaje / proyecto
              </label>
              <textarea
                required
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                className="w-full bg-anchor border border-white/10 px-4 py-3 text-sm focus:border-signal outline-none h-32"
                placeholder="Describa su necesidad, número de participantes o características del sitio."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-signal text-anchor font-bold py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors"
            >
              Enviar por WhatsApp
            </button>
            <p className="text-[10px] text-white/40 uppercase tracking-widest text-center">
              También puede escribirnos a ventas@kg-safety.com
            </p>
          </form>

          {/* Info */}
          <aside className="lg:col-span-2 space-y-10">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">
                Teléfono y WhatsApp
              </h4>
              <a
                href="tel:+527228795076"
                className="font-display text-2xl text-signal hover:text-white transition-colors block"
              >
                +52 722 879 5076
              </a>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">
                Correo
              </h4>
              <a
                href="mailto:ventas@kg-safety.com"
                className="text-white hover:text-signal transition-colors"
              >
                ventas@kg-safety.com
              </a>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">
                Oficina
              </h4>
              <p className="text-white/70 leading-relaxed">
                José María Pino Suárez 304-1<br />
                Col. 5 de Mayo, Toluca<br />
                Estado de México, C.P. 50090
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">
                Horario
              </h4>
              <p className="text-white/70">Lunes a Viernes · 9:00 – 18:00 hrs</p>
            </div>
            <div className="border-t border-white/10 pt-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">
                Atención inmediata
              </h4>
              <a
                href="https://wa.me/527228795076"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#25D366] text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-opacity"
              >
                Abrir WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
