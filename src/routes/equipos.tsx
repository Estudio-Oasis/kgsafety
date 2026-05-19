import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import ppeImg from "@/assets/equipment-ppe.jpg";
import { useT } from "@/i18n/context";
import { EQUIPMENT } from "@/data/kaee";

export const Route = createFileRoute("/equipos")({
  component: EquiposPage,
  head: () => ({
    meta: [
      { title: "Equipos certificados · EPP, anclajes, líneas de vida · KG Safety" },
      { name: "description", content: "Catálogo WoLL + S@H: EPP, anclajes, líneas de vida, barandales, domos, andamios, plataformas, pasos de gato y escalas con marcas líderes." },
      { property: "og:title", content: "Equipos certificados · KG Safety" },
      { property: "og:description", content: "Diez familias de producto con venta, renta y certificación." },
      { property: "og:url", content: "/equipos" },
    ],
    links: [{ rel: "canonical", href: "/equipos" }],
  }),
});

const BRANDS = ["Petzl", "MSA", "3M", "Honeywell", "Capital Safety", "Tractel", "Yale", "Miller"];

function EquiposPage() {
  const { t } = useT();
  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>{t("Catálogo de equipos")}</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            {t("Equipos certificados,")}<br />
            <span className="text-signal">{t("trazables")}</span>{t(", garantizados.")}
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
            {t("Más de 30 marcas de representación. Asesoría en selección, fichas técnicas y cotización inmediata para venta, renta y certificación.")}
          </p>
          <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
            {t("Solicitar catálogo PDF")}
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionLabel>{t("Categorías")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase">{t("10 líneas de producto")}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {EQUIPMENT.map((c, i) => (
              <Link key={c.slug} to="/equipos/$categoria" params={{ categoria: c.slug }} className="bg-anchor p-7 hover:bg-steel transition-colors group block">
                <div className="font-display text-signal text-xs mb-5">{String(i + 1).padStart(2, "0")} / 10</div>
                <h3 className="font-display text-base uppercase mb-3 leading-tight">{t(c.name)}</h3>
                <p className="text-sm text-white/55 mb-6 leading-relaxed">{t(c.desc)}</p>
                <span className="text-signal font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-1 inline-block transition-transform">
                  {t("Ver categoría")} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-20 bg-steel border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-center">
            {t("Más de 30 marcas representadas")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {BRANDS.map((b) => (
              <span key={b} className="font-display text-base md:text-lg text-white/60 uppercase tracking-tight">{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12 text-center">
        <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
          {t("¿Sabe qué equipo necesita?")} <span className="text-signal">{t("¿O necesita asesoría?")}</span>
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
          {t("Compártanos su proyecto y un ingeniero le arma una propuesta puntual.")}
        </p>
        <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
          {t("Cotizar equipos")}
        </Link>
      </section>
    </div>
  );
}
