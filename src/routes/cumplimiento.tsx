import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { AuditableDeliverables } from "@/components/site/AuditableDeliverables";

export const Route = createFileRoute("/cumplimiento")({
  component: CumplimientoPage,
  head: () => ({
    meta: [
      { title: "Cumplimiento normativo · NOM-009 · STPS · DC-3 · KG Safety" },
      { name: "description", content: "Cumplimiento documental para auditoría STPS: NOM-009, NOM-033, OSHA, ANSI Z359, DC-3, plan de rescate, bitácora de inspección y evidencia integral." },
      { property: "og:title", content: "Cumplimiento · KG Safety" },
      { property: "og:description", content: "Toda la evidencia documental que su auditor necesita — emitida por KG Safety." },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/cumplimiento" }],
  }),
});

const STANDARDS = [
  { code: "NOM-009-STPS-2011", scope: "Trabajos en altura · México", desc: "Marco oficial mexicano para protección contra caídas: condiciones de seguridad, equipo, capacitación y supervisión." },
  { code: "NOM-033-STPS-2015", scope: "Espacios confinados · México", desc: "Permisos, monitoreo atmosférico, equipo de rescate y procedimientos para ingreso a espacios confinados." },
  { code: "NOM-004-STPS",      scope: "LOTO · México",                desc: "Sistemas de bloqueo y etiquetado de energías peligrosas en maquinaria." },
  { code: "OSHA 1910 / 1926",  scope: "Industria y construcción · US", desc: "Estándares federales OSHA para protección contra caídas en industria general y construcción." },
  { code: "ANSI Z359",         scope: "Sistemas personales de detención de caídas", desc: "Familia de normas ANSI/ASSP para diseño, prueba y uso de equipo PFAS." },
  { code: "EN-795",            scope: "Anclajes · Europa",            desc: "Norma europea para dispositivos de anclaje individuales, fijos y línea de vida." },
  { code: "CSA Z259",          scope: "Equipo de protección · Canadá", desc: "Familia canadiense para arneses, conectores y sistemas de detención de caídas." },
  { code: "NFPA 70E",          scope: "Seguridad eléctrica",          desc: "Práctica segura para trabajos cerca de partes eléctricas energizadas." },
];

const PROCESS = [
  { n: "01", title: "Diagnóstico de cumplimiento", desc: "Levantamiento de instalaciones, equipos y procedimientos actuales contra normativa aplicable." },
  { n: "02", title: "Plan de cierre de brechas",   desc: "Roadmap priorizado por riesgo: qué documentar, qué corregir, qué certificar y en qué orden." },
  { n: "03", title: "Ejecución y emisión",         desc: "Capacitación DC-3, instalación certificada, pruebas de carga y emisión de toda la documentación." },
  { n: "04", title: "Auditoría asistida",          desc: "Acompañamiento durante auditorías STPS, cliente o aseguradora. Defensa técnica de la evidencia." },
];

function CumplimientoPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative px-6 md:px-12 py-20 md:py-28 border-b border-[color:var(--border)] bg-[color:var(--brand-navy)] kg-on-dark">
        <div className="max-w-5xl relative z-10">
          <SectionLabel>Cumplimiento normativo</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[1.05] mb-6" style={{ color: "#fff" }}>
            La evidencia que su <span className="text-signal">auditor</span> pide,{" "}<br />
            <span className="text-signal">emitida por un equipo técnico.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            Cada trabajo cierra con su carpeta completa: análisis de riesgo, plan de rescate, DC-3 oficial, certificados de equipo y bitácora de inspección. Sin observaciones en auditoría.
          </p>
        </div>
      </section>

      {/* NORMAS */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Marco normativo</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight mb-12 text-[color:var(--on-surface)]">
            Alineados con <span className="text-signal">8 estándares</span> internacionales
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
            {STANDARDS.map((s) => (
              <article key={s.code} className="bg-[color:var(--surface)] p-6 flex flex-col">
                <div className="flex items-baseline justify-between gap-3 mb-3">
                  <h3 className="font-display text-lg md:text-xl uppercase tracking-tight text-[color:var(--on-surface)]">{s.code}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-blue">{s.scope}</span>
                </div>
                <p className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] leading-relaxed">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ENTREGABLES */}
      <AuditableDeliverables variant="light" />

      {/* PROCESO */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[color:var(--surface-2)] border-y border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Cómo trabajamos</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight mb-12 text-[color:var(--on-surface)]">
            Del diagnóstico <span className="text-signal">a la auditoría</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {PROCESS.map((p) => (
              <article key={p.n} className="kg-bento p-6 flex flex-col h-full">
                <div className="font-display text-signal text-4xl md:text-5xl leading-none mb-4">{p.n}</div>
                <h3 className="font-display text-lg uppercase tracking-tight text-[color:var(--on-surface)] mb-3">{p.title}</h3>
                <p className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] leading-relaxed">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTRATISTAS CTA */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-b border-[color:var(--border)]">
        <div className="max-w-5xl mx-auto kg-bento p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-blue mb-2">¿Trabaja con contratistas?</div>
            <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight text-[color:var(--on-surface)]">
              Estandarice su seguridad con <span className="text-signal">P.N.P.C.</span>
            </h2>
            <p className="mt-3 text-sm text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] max-w-2xl">
              Programa Nacional de Profesionalización a Contratistas — auditoría y capacitación de proveedores en su nombre.
            </p>
          </div>
          <Link to="/contratistas" className="shrink-0 px-8 py-4 font-bold uppercase text-xs tracking-[0.22em] bg-signal text-anchor hover:bg-white transition-colors">
            Ver P.N.P.C. →
          </Link>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 md:px-12 py-16 md:py-20 text-center bg-[color:var(--brand-navy)] kg-on-dark">
        <h2 className="font-display text-3xl md:text-5xl uppercase mb-6" style={{ color: "#fff" }}>
          ¿Tiene auditoría próxima?
        </h2>
        <p className="max-w-2xl mx-auto mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
          Diagnóstico exprés en 72 horas hábiles. Le decimos exactamente qué falta y en qué orden cerrarlo.
        </p>
        <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
          Agendar diagnóstico
        </Link>
      </section>
    </div>
  );
}
