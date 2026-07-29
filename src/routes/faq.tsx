import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";

const FAQ_GROUPS: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Documentos y auditoría",
    items: [
      { q: "¿Qué documentos recibo al terminar una capacitación?", a: "DC-3 oficial STPS con folio verificable en línea, certificado de cumplimiento KG Safety, credencial anti-falsificación, lista de asistencia con CURP y material didáctico KAEE." },
      { q: "¿Sus DC-3 son verificables ante la STPS?", a: "Sí. Cada DC-3 lleva folio único y está registrada en el portal STPS. El auditor o cliente puede verificarla en línea con CURP y folio." },
      { q: "¿Qué entregables incluye un sistema de líneas de vida?", a: "Memoria de cálculo firmada, planos as-built, certificado anual, etiqueta de inspección con QR, plan de rescate específico y manual del usuario." },
      { q: "¿Manejan inspección y certificación anual?", a: "Sí. Operamos programas anuales con calendario, inspección visual y de carga, reportes firmados por sistema y etiquetas físicas vigentes. Ver /servicios/inspeccion-certificacion-anual." },
    ],
  },
  {
    group: "Capacitación",
    items: [
      { q: "¿Capacitan en planta del cliente?", a: "Sí. Cobertura nacional con instructores certificados KAEE/STPS/OSHA/NSC. Llevamos arnés, anclajes, EPP y aula móvil cuando es necesario." },
      { q: "¿Cuáles son los niveles de capacitación?", a: "Tres niveles: Autorizado (8 h), Supervisor / Monitor (16 h) y Jefe de Seguridad / Competente (24 h). Adicionalmente impartimos OSHA 10 y OSHA 30 con tarjeta DOL." },
      { q: "¿Cuánto vale un DC-3 oficial?", a: "Tres años para trabajo en altura y espacios confinados. Manejamos programa de recertificación anualizada y recordatorio antes del vencimiento." },
      { q: "¿Quiénes son los instructores?", a: "Instructores certificados por KAEE Group FPCS, STPS, OSHA Outreach (autorizados DOL) y NSC. Cada instructor tiene perfil técnico, experiencia operativa y experiencia industrial verificable." },
    ],
  },
  {
    group: "Líneas de vida e inspección",
    items: [
      { q: "¿Inspeccionan sistemas instalados por otra empresa?", a: "Sí. Realizamos inspección, pruebas de carga y re-certificación de sistemas de cualquier marca o instalador. Si no pasa, entregamos plan de adecuación priorizado." },
      { q: "¿Cada cuánto se inspecciona una línea de vida?", a: "Mínimo una vez al año conforme a ANSI Z359.7 / EN 365 / NOM-009-STPS. Adicionalmente, inspección visual pre-uso por el trabajador y revisión después de cualquier caída." },
      { q: "¿Pueden adaptar líneas de vida a estructuras atípicas?", a: "Sí. Diseñamos sistemas a la medida (silos irregulares, techos curvos, equipo único) con memoria de cálculo, pruebas de carga y certificación. Ver /servicios/soluciones-personalizadas." },
    ],
  },
  {
    group: "Normas aplicables",
    items: [
      { q: "¿Qué normas cumplen sus sistemas y cursos?", a: "NOM-009-STPS-2011 (alturas), NOM-033-STPS-2015 (confinados), NOM-004-STPS (LOTO), OSHA 1910 / 1926, ANSI Z359, EN 795 y CSA Z259." },
      { q: "¿Trabajan con clientes que aplican OSHA?", a: "Sí. Operamos bajo OSHA 29 CFR 1910 y 1926 y entregamos tarjeta oficial OSHA Outreach (10 y 30 horas) firmada por trainer autorizado DOL." },
    ],
  },
  {
    group: "Plan de rescate y emergencias",
    items: [
      { q: "¿Diseñan plan de rescate?", a: "Sí. Plan de rescate por planta y por escenario, selección de equipo, capacitación de brigada y simulacro anual. Es obligatorio con cualquier sistema de protección contra caídas. Ver /servicios/plan-de-rescate." },
      { q: "Tenemos una auditoría urgente, ¿cuánto tardan en respondernos?", a: "Respuesta el mismo día hábil. Para auditoría inminente, agendamos visita técnica en 24-72 horas y entregamos plan de cierre de brechas inmediatamente." },
    ],
  },
  {
    group: "Cotización y comercial",
    items: [
      { q: "¿Cuánto tarda una cotización?", a: "Cotización de catálogo el mismo día hábil. Cotización de ingeniería o sistemas a la medida: 72 horas hábiles después de visita técnica." },
      { q: "¿Entregan ficha técnica antes de cotizar?", a: "Sí. Solicítela en /contacto indicando producto y norma de interés. Enviamos ficha técnica, certificado y manual de usuario sin compromiso." },
      { q: "¿Puedo auto-facturar?", a: "Sí. En /facturacion acceda al portal externo con su folio de cotización o referencia para generar su factura electrónica." },
      { q: "¿Trabajan con contratistas externos?", a: "Sí, a través del Programa Nacional de Profesionalización a Contratistas (P.N.P.C.) que estandariza la seguridad de sus proveedores con base de datos auditable. Ver /contratistas." },
      { q: "¿Tienen cobertura internacional?", a: "Sede en México (Toluca) con operación en Colombia, Estados Unidos y Argentina, y cobertura LATAM bajo la marca KG Safety Latam." },
    ],
  },
];

const ALL_QA = FAQ_GROUPS.flatMap((g) => g.items);

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => ({
    meta: [
      { title: "Preguntas Frecuentes · DC-3, inspección, plan de rescate · KG Safety" },
      { name: "description", content: "Respuestas técnicas sobre DC-3, ficha técnica, inspección anual de líneas de vida, plan de rescate, normas NOM/OSHA/ANSI, cotización y auditorías urgentes." },
      { property: "og:title", content: "Preguntas Frecuentes · KG Safety" },
      { property: "og:description", content: "Documentos auditables, capacitación, inspección, normas y cotización — respondidos por el equipo técnico." },
      { property: "og:url", content: "https://kgsafety.lovable.app/faq" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Preguntas Frecuentes · KG Safety" },
      { name: "twitter:description", content: "Documentos auditables, capacitación, inspección, normas y cotización — respondidos por el equipo técnico." },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: ALL_QA.map((qa) => ({
            "@type": "Question",
            name: qa.q,
            acceptedAnswer: { "@type": "Answer", text: qa.a },
          })),
        }),
      },
    ],
  }),
});

function FAQPage() {
  return (
    <div>
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-5xl">
          <SectionLabel>Ayuda técnica</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight text-[color:var(--on-surface)]">
            Preguntas <span className="text-brand-blue">frecuentes</span>
          </h1>
          <p className="text-lg md:text-xl text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] max-w-3xl leading-relaxed">
            Documentos auditables, capacitación, inspección, normas y cotización — respondido por nuestro equipo técnico. Si su pregunta no está aquí, contáctenos directamente.
          </p>
        </div>
      </section>

      {FAQ_GROUPS.map((g) => (
        <section key={g.group} className="px-6 md:px-12 py-12 md:py-16 border-b border-[color:var(--border)]">
          <div className="max-w-4xl mx-auto">
            <SectionLabel>{g.group}</SectionLabel>
            <div className="space-y-3 mt-6">
              {g.items.map((f, i) => (
                <details key={i} className="kg-bento p-6 group">
                  <summary className="cursor-pointer font-display text-base md:text-lg uppercase tracking-tight text-[color:var(--on-surface)] flex justify-between items-center gap-4">
                    <span>{f.q}</span>
                    <span className="text-signal font-display text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)] leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="px-6 md:px-12 py-16 text-center">
        <h2 className="font-display text-2xl md:text-4xl uppercase mb-6 text-[color:var(--on-surface)]">¿Sigue con dudas?</h2>
        <Link to="/contacto" className="inline-block bg-signal text-[color:var(--anchor-fixed)] px-10 py-5 font-bold uppercase text-sm tracking-widest border-2 border-[color:var(--anchor-fixed)] shadow-[4px_4px_0_0_var(--anchor-fixed)] hover:bg-white transition-colors">
          Hablar con un especialista
        </Link>
      </section>
    </div>
  );
}
