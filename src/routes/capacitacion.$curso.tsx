import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SectionLabel } from "@/components/site/SectionLabel";
import { COURSES } from "@/data/kaee";

export const Route = createFileRoute("/capacitacion/$curso")({
  component: CoursePage,
  loader: ({ params }) => {
    const course = COURSES.find((c) => c.slug === params.curso);
    if (!course) throw notFound();
    return course;
  },
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <h1 className="font-display text-3xl uppercase mb-4">Curso no encontrado</h1>
      <Link to="/capacitacion" className="text-brand-blue underline">Ver todos los cursos</Link>
    </div>
  ),
  head: ({ params }) => {
    const c = COURSES.find((x) => x.slug === params.curso);
    const title = c ? `${c.name} · KG Safety` : "Curso · KG Safety";
    return {
      meta: [
        { title },
        { name: "description", content: c?.desc ?? "Curso de capacitación certificado KG Safety." },
        { property: "og:title", content: title },
        { property: "og:description", content: c?.desc ?? "" },
      ],
    };
  },
});

function CoursePage() {
  const course = Route.useLoaderData();
  const [active, setActive] = useState(course.levels[0].code);
  const lvl = course.levels.find((l) => l.code === active)!;

  return (
    <div>
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-5xl">
          <Link to="/capacitacion" className="text-[11px] uppercase tracking-widest text-brand-blue mb-6 inline-block hover:underline">← Capacitación</Link>
          <SectionLabel>Curso certificado</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight text-[color:var(--on-surface)]">
            {course.name}
          </h1>
          <p className="text-lg md:text-xl text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] max-w-2xl mb-10 leading-relaxed">
            {course.desc}
          </p>
          <Link to="/contacto" className="inline-block bg-signal text-[color:var(--anchor-fixed)] px-10 py-5 font-bold uppercase text-sm tracking-widest border-2 border-[color:var(--anchor-fixed)] shadow-[4px_4px_0_0_var(--anchor-fixed)] hover:bg-white transition-colors">
            Inscribir grupo
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Cuatro niveles disponibles</SectionLabel>
          <h2 className="font-display text-2xl md:text-4xl uppercase mb-10 text-[color:var(--on-surface)]">Elige el nivel</h2>

          <div className="flex flex-wrap gap-2 mb-10">
            {course.levels.map((l) => (
              <button
                key={l.code}
                onClick={() => setActive(l.code)}
                className={`px-5 py-3 font-bold text-xs uppercase tracking-widest border-2 transition-colors ${
                  active === l.code
                    ? "bg-brand-navy text-white border-brand-navy"
                    : "bg-transparent text-[color:var(--on-surface)] border-[color:var(--border)] hover:border-brand-blue"
                }`}
              >
                {l.code} · {l.name}
              </button>
            ))}
          </div>

          <div className="kg-bento p-8 md:p-12">
            <div className="font-display text-signal text-xs uppercase tracking-widest mb-4">Nivel {lvl.code} · {lvl.name}</div>
            <div className="font-display text-4xl md:text-5xl text-[color:var(--on-surface)] mb-6">{lvl.hours}</div>
            <p className="text-base text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)] leading-relaxed mb-8 max-w-3xl">
              {lvl.desc}
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 mb-8 border-t border-[color:var(--border)] pt-6">
              {["DC-3 oficial STPS", "Certificado de cumplimiento", "Credencial anti-falsificación", "Material didáctico KAEE"].map((b) => (
                <li key={b} className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_80%,transparent)] flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-signal" /> {b}
                </li>
              ))}
            </ul>
            <Link to="/contacto" className="inline-block bg-brand-navy text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-brand-blue transition-colors">
              Cotizar este nivel →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 bg-[color:var(--surface-2)] border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Otros cursos</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-6">
            {COURSES.filter((c) => c.slug !== course.slug).map((c) => (
              <Link
                key={c.slug}
                to="/capacitacion/$curso"
                params={{ curso: c.slug }}
                className="kg-bento p-4 text-[11px] uppercase tracking-widest font-bold text-[color:var(--on-surface)] hover:text-brand-blue"
              >
                {c.short}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
