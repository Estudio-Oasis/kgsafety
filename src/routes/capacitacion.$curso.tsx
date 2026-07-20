import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SectionLabel } from "@/components/site/SectionLabel";
import { COURSES, courseDetail, courseDeep, type Course } from "@/data/kaee";

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
    const url = `https://kgsafety.lovable.app/capacitacion/${params.curso}`;
    return {
      meta: [
        { title },
        { name: "description", content: c?.desc ?? "Curso de capacitación certificado KG Safety." },
        { property: "og:title", content: title },
        { property: "og:description", content: c?.desc ?? "" },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function CoursePage() {
  const course = Route.useLoaderData() as Course;
  const [active, setActive] = useState(course.levels[0].code);
  const lvl = course.levels.find((l) => l.code === active)!;
  const detail = courseDetail(course.slug);
  const deep = courseDeep(course.slug);


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

      {/* FICHA COMPLETA — Nivel, Duración, Participantes, Costo */}
      <section className="px-6 md:px-12 py-10 md:py-14 border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Ficha del curso</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:var(--border)] border border-[color:var(--border)] mt-4">
            {[
              { l: "Nivel", v: course.nivel ?? course.levels.map((l) => l.code).join(" · ") },
              { l: "Duración", v: course.duracion ?? course.levels.map((l) => l.hours).join(" / ") },
              {
                l: "Participantes",
                v:
                  course.minParticipantes || course.maxParticipantes
                    ? `${course.minParticipantes ?? "—"} – ${course.maxParticipantes ?? "—"}`
                    : "Por confirmar",
              },
              { l: "Costo", v: course.costo ?? "Cotizar a la medida" },
            ].map((f) => (
              <div key={f.l} className="bg-[color:var(--surface)] p-5">
                <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-2">{f.l}</div>
                <div className="text-sm md:text-base font-bold text-[color:var(--on-surface)] leading-snug">{f.v}</div>
              </div>
            ))}
          </div>
          {course.alcance && (
            <p className="mt-6 text-sm md:text-base text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)] leading-relaxed max-w-4xl">
              {course.alcance}
            </p>
          )}
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
              {detail.deliverables.map((b) => (
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

      {/* DETALLE TÉCNICO */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
          {detail.audience && (
            <div className="bg-[color:var(--surface)] p-7">
              <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Dirigido a</div>
              <ul className="space-y-2">
                {detail.audience.map((a) => (
                  <li key={a} className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)] flex items-start gap-2">
                    <span className="text-signal shrink-0">→</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {detail.norms && (
            <div className="bg-[color:var(--surface)] p-7">
              <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Normas aplicables</div>
              <ul className="flex flex-wrap gap-1.5">
                {detail.norms.map((n) => (
                  <li key={n} className="text-[10px] font-bold uppercase tracking-widest border border-[color:var(--border)] px-2 py-1 text-[color:color-mix(in_oklab,var(--on-surface)_80%,transparent)]">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="bg-[color:var(--surface)] p-7">
            <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Evaluación</div>
            <p className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)] leading-relaxed">{detail.evaluation}</p>
            {detail.practice && (
              <p className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_65%,transparent)] leading-relaxed mt-3 pt-3 border-t border-[color:var(--border)]">
                <span className="font-bold uppercase tracking-widest text-[10px] text-brand-blue block mb-1">Práctica</span>
                {detail.practice}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CONTENIDO ÚNICO POR CURSO */}
      {(deep.risks || deep.syllabus || deep.apps) && (
        <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
            {deep.risks && (
              <div className="bg-[color:var(--surface)] p-7">
                <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Riesgos que controla</div>
                <ul className="space-y-2">
                  {deep.risks.map((r) => (
                    <li key={r} className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_80%,transparent)] flex gap-2"><span className="text-signal">→</span>{r}</li>
                  ))}
                </ul>
              </div>
            )}
            {deep.syllabus && (
              <div className="bg-[color:var(--surface)] p-7">
                <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Temario</div>
                <ul className="space-y-2">
                  {deep.syllabus.map((s) => (
                    <li key={s} className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_80%,transparent)] flex gap-2"><span className="text-signal">→</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {deep.apps && (
              <div className="bg-[color:var(--surface)] p-7">
                <div className="font-display text-signal text-[10px] uppercase tracking-[0.22em] mb-3">Aplicaciones industriales</div>
                <ul className="space-y-2">
                  {deep.apps.map((a) => (
                    <li key={a} className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_80%,transparent)] flex gap-2"><span className="text-signal">→</span>{a}</li>
                  ))}
                </ul>
                {deep.duration && (
                  <div className="mt-4 pt-4 border-t border-[color:var(--border)] text-xs uppercase tracking-widest text-brand-blue font-bold">
                    Duración: {deep.duration}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}




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
