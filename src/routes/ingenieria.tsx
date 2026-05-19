import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import installImg from "@/assets/engineering-install.jpg";
import officeImg from "@/assets/engineering-office.jpg";
import { useT } from "@/i18n/context";
import { ENGINEERING } from "@/data/kaee";

export const Route = createFileRoute("/ingenieria")({
  component: IngenieriaPage,
  head: () => ({
    meta: [
      { title: "Ingeniería · Líneas de vida y anclajes · KG Safety" },
      { name: "description", content: "Diseño, fabricación e instalación de líneas de vida verticales y horizontales, anclajes y plataformas bajo NOM-009-STPS y OSHA." },
      { property: "og:title", content: "Ingeniería · KG Safety" },
      { property: "og:description", content: "Sistemas de anclaje y líneas de vida diseñados a medida con certificación." },
      { property: "og:url", content: "/ingenieria" },
    ],
    links: [{ rel: "canonical", href: "/ingenieria" }],
  }),
});

const SERVICES = [
  { titleKey: "Líneas de Vida Verticales", descKey: "Sistemas LVV con cable y rigid rail para escaleras, torres y silos." },
  { titleKey: "Líneas de Vida Horizontales", descKey: "Sistemas LVH overhead y a nivel: structural, rigid rail y cable base." },
  { titleKey: "Anclajes", descKey: "Móviles, portátiles, temporales, removibles, individuales o colectivos. Compra o renta." },
  { titleKey: "Hand Rails", descKey: "Barandales fijos y removibles para acceso seguro a zonas perimetrales." },
  { titleKey: "Plataformas y estructuras", descKey: "Plataformas elevadoras y obra civil a medida con departamento propio." },
  { titleKey: "Supervisión y certificación", descKey: "Auditorías, pruebas de carga y verificación periódica de sistemas." },
];

const PROCESS = [
  { n: "01", titleKey: "Diagnóstico en sitio", descKey: "Visita técnica con ingeniero certificado." },
  { n: "02", titleKey: "Propuesta de ingeniería", descKey: "Diseño bajo NOM-009-STPS, OSHA, ANSI y EN-795." },
  { n: "03", titleKey: "Fabricación", descKey: "Manufactura controlada con materiales certificados." },
  { n: "04", titleKey: "Montaje e instalación", descKey: "Instaladores certificados con cobertura nacional." },
  { n: "05", titleKey: "Certificación y entrega", descKey: "Pruebas de carga, documentación y plan de mantenimiento." },
];

function IngenieriaPage() {
  const { t } = useT();
  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>{t("Ingeniería aplicada")}</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            {t("Sistemas de anclaje")}<br />
            <span className="text-signal">{t("diseñados")}</span> {t("a medida.")}
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
            {t("Líneas de vida, anclajes, plataformas y estructuras de obra civil. Ingeniería certificada para cada estructura, cada persona, cada detalle.")}
          </p>
          <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
            {t("Agendar diagnóstico")}
          </Link>
        </div>
      </section>

      <section className="border-b border-white/5">
        <img src={installImg} alt="Instalación de línea de vida horizontal en planta industrial" loading="lazy" width={1920} height={1080} className="w-full h-[40vh] md:h-[60vh] object-cover grayscale brightness-90" />
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionLabel>{t("Catálogo de soluciones")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">{t("Seis frentes técnicos")}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {SERVICES.map((s, i) => (
              <div key={s.titleKey} className="bg-anchor p-8 hover:bg-steel transition-colors">
                <div className="font-display text-signal text-xs mb-6">{String(i + 1).padStart(2, "0")} / 06</div>
                <h3 className="font-display text-base uppercase mb-4 leading-tight">{t(s.titleKey)}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{t(s.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-steel">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionLabel>{t("Proceso")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">
              {t("De diagnóstico a")} <span className="text-signal">{t("entrega certificada")}</span>.
            </h2>
          </div>
          <div className="grid md:grid-cols-5 gap-px bg-white/5 border border-white/5">
            {PROCESS.map((p) => (
              <div key={p.n} className="bg-anchor p-6">
                <div className="font-display text-signal text-2xl mb-4">{p.n}</div>
                <h4 className="font-bold uppercase text-xs tracking-wider mb-3">{t(p.titleKey)}</h4>
                <p className="text-xs text-white/55 leading-relaxed">{t(p.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MS&S sub-services links */}
      <section className="px-6 md:px-12 py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>{t("División MS&S · Servicios")}</SectionLabel>
          <h2 className="font-display text-2xl md:text-4xl uppercase mb-8">{t("Siete servicios especializados")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {ENGINEERING.map((s) => (
              <Link key={s.slug} to="/ingenieria/$servicio" params={{ servicio: s.slug }} className="kg-bento p-4 text-[11px] uppercase tracking-widest font-bold text-[color:var(--on-surface)] hover:text-brand-blue text-center">
                {t(s.name)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Construcción y mantenimiento — NEW */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <SectionLabel>{t("Construcción y mantenimiento")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
              {t("Programas residenciales e industriales")}
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              {t("Mantenimientos puntuales, programas preventivos y correctivos a corto, mediano y largo plazo. Limpieza, pintura, electricidad, impermeabilización y obra civil.")}
            </p>
          </div>
          <div className="bg-steel border border-white/10 p-8 md:p-10">
            <div className="font-display text-signal text-xs uppercase tracking-widest mb-4">
              {t("Programa a 3 años")}
            </div>
            <div className="font-display text-4xl md:text-5xl mb-6 text-white">3Y</div>
            <p className="text-sm text-white/70 leading-relaxed">
              {t("Al término del programa el cliente es propietario de los elementos sin costo extra.")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12 text-center">
        <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
          {t("Cada estructura")} <span className="text-signal">{t("merece")}</span> {t("un anclaje propio.")}
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
          {t("Pida una visita técnica sin costo. Nuestros ingenieros responden el mismo día.")}
        </p>
        <Link to="/contacto" className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
          {t("Solicitar visita técnica")}
        </Link>
      </section>
    </div>
  );
}
