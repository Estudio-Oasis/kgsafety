import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Blog y recursos · KG Safety" },
      {
        name: "description",
        content:
          "Artículos, guías normativas y análisis de casos en seguridad para trabajos en altura. NOM-009-STPS, OSHA, ANSI y mejores prácticas.",
      },
      { property: "og:title", content: "Blog · KG Safety" },
      { property: "og:description", content: "Recursos técnicos para líderes de seguridad industrial." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
});

const POSTS = [
  {
    tag: "NOM-009-STPS",
    title: "NOM-009-STPS-2011: claves para auditar trabajos en altura",
    excerpt:
      "Qué piden los auditores STPS, qué documentos debe tener su contratista y cómo demostrar competencias antes de iniciar trabajos.",
    date: "2025-04-12",
  },
  {
    tag: "Ingeniería",
    title: "LVV vs LVH: cuándo conviene cable y cuándo rigid rail",
    excerpt:
      "Comparativa de líneas de vida verticales y horizontales por tipo de aplicación, frecuencia de uso y factor de carga.",
    date: "2025-03-20",
  },
  {
    tag: "Capacitación",
    title: "Recertificación anual: por qué no es opcional",
    excerpt:
      "Riesgo legal y operativo de operar con DC-3 vencidos. Cómo organizar un programa de recertificación rotativo sin paralizar planta.",
    date: "2025-02-08",
  },
];

function BlogPage() {
  const { t } = useT();
  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>{t("Blog y recursos")}</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            {t("Recursos técnicos para")}<br />
            <span className="text-signal">{t("líderes de seguridad.")}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            {t("Artículos, guías normativas y análisis de casos para profesionales de seguridad industrial.")}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <SectionLabel>{t("Artículos recientes")}</SectionLabel>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {POSTS.map((p, i) => (
              <article key={i} className="bg-anchor p-8 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-display text-signal text-xs uppercase tracking-widest">
                    {p.tag}
                  </span>
                  <span className="text-[10px] text-white/40 tracking-widest">{p.date}</span>
                </div>
                <h3 className="font-display text-lg uppercase mb-4 leading-tight">
                  {p.title}
                </h3>
                <p className="text-sm text-white/55 mb-8 flex-1 leading-relaxed">{p.excerpt}</p>
                <Link
                  to="/contacto"
                  className="text-signal font-bold text-[10px] uppercase tracking-widest border-b border-signal pb-1 self-start"
                >
                  {t("Leer artículo →")}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12 text-center bg-steel">
        <SectionLabel>{t("Próximamente")}</SectionLabel>
        <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
          {t("Más contenido en camino. Suscríbase con su correo corporativo.")}
        </h2>
        <Link
          to="/contacto"
          className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors"
        >
          {t("Contacto")}
        </Link>
      </section>
    </div>
  );
}
