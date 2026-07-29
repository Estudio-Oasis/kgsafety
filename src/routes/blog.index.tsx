import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";
import { Instagram } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";

export const Route = createFileRoute("/blog/")({
  component: RedesPage,
  head: () => ({
    meta: [
      { title: "Síguenos · KG Safety" },
      {
        name: "description",
        content:
          "Síganos en Instagram y consulte nuestros artículos y guías normativas en seguridad para trabajos en altura.",
      },
      { property: "og:title", content: "Síguenos · KG Safety" },
      { property: "og:description", content: "Redes sociales y artículos técnicos de KG Safety." },
      { property: "og:url", content: "https://kgsafety.lovable.app/blog" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Síguenos · KG Safety" },
      { name: "twitter:description", content: "Redes sociales y artículos técnicos de KG Safety." },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/blog" }],
  }),
});

function RedesPage() {
  const { t } = useT();
  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>{t("Síguenos")}</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            {t("Operación real en")}<br />
            <span className="text-signal">{t("nuestras redes.")}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            {t("Compartimos casos en sitio, capacitaciones y novedades técnicas en nuestras redes oficiales.")}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <SectionLabel>{t("Redes oficiales")}</SectionLabel>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            <a
              href="https://instagram.com/kg_safety"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-anchor p-8 md:p-10 flex items-start gap-5 hover:bg-steel transition-colors group"
            >
              <Instagram size={32} className="text-signal shrink-0 mt-1" />
              <div>
                <div className="font-display text-xs uppercase tracking-[0.3em] text-white/50 mb-2">Instagram</div>
                <div className="font-display text-2xl uppercase mb-2 group-hover:text-signal transition-colors">@kg_safety</div>
                <p className="text-sm text-white/55 leading-relaxed">
                  {t("Trabajos en sitio, antes y después, capacitaciones y rescates simulados.")}
                </p>
              </div>
            </a>
            <div className="bg-anchor p-8 md:p-10 flex flex-col justify-center">
              <div className="font-display text-xs uppercase tracking-[0.3em] text-white/40 mb-2">{t("Próximamente")}</div>
              <div className="font-display text-2xl uppercase mb-2 text-white/60">TikTok · LinkedIn · Facebook</div>
              <p className="text-sm text-white/50 leading-relaxed">
                {t("Estamos expandiendo nuestras redes oficiales. Mientras tanto, escríbanos directo por Instagram.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <SectionLabel>{t("Artículos recientes")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase mt-3">{t("Recursos técnicos")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {BLOG_POSTS.map((p) => (
              <article key={p.slug} className="bg-anchor p-8 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-display text-signal text-xs uppercase tracking-widest">{p.tag}</span>
                  <span className="text-[10px] text-white/40 tracking-widest">{p.date}</span>
                </div>
                <h3 className="font-display text-lg uppercase mb-4 leading-tight">{p.title}</h3>
                <p className="text-sm text-white/55 mb-8 flex-1 leading-relaxed">{p.excerpt}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
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
        <SectionLabel>{t("Hablemos")}</SectionLabel>
        <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
          {t("¿Una duda técnica? Escríbanos.")}
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
