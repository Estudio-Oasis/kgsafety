import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { FAQS } from "@/data/kaee";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => ({
    meta: [
      { title: "Preguntas Frecuentes · KG Safety" },
      { name: "description", content: "Respuestas sobre capacitación DC-3, ingeniería de líneas de vida, certificación, programas de mantenimiento y cobertura nacional KAEE Group." },
      { property: "og:title", content: "Preguntas Frecuentes · KG Safety" },
      { property: "og:description", content: "Las dudas más comunes sobre nuestros servicios y cursos." },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
});

function FAQPage() {
  return (
    <div>
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-5xl">
          <SectionLabel>Ayuda</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight text-[color:var(--on-surface)]">
            Preguntas <span className="text-brand-blue">frecuentes</span>
          </h1>
          <p className="text-lg md:text-xl text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] max-w-2xl leading-relaxed">
            Si tu pregunta no está aquí, contáctanos directamente.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQS.map((f, i) => (
            <details key={i} className="kg-bento p-6 group">
              <summary className="cursor-pointer font-display text-base md:text-lg uppercase tracking-tight text-[color:var(--on-surface)] flex justify-between items-center gap-4">
                <span>{f.q}</span>
                <span className="text-signal font-display text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 text-center">
        <h2 className="font-display text-2xl md:text-4xl uppercase mb-6 text-[color:var(--on-surface)]">¿Sigues con dudas?</h2>
        <Link to="/contacto" className="inline-block bg-signal text-[color:var(--anchor-fixed)] px-10 py-5 font-bold uppercase text-sm tracking-widest border-2 border-[color:var(--anchor-fixed)] shadow-[4px_4px_0_0_var(--anchor-fixed)] hover:bg-white transition-colors">
          Hablar con un especialista
        </Link>
      </section>
    </div>
  );
}
