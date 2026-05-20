import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import heightsImg from "@/assets/heights-worker.jpg";
import { useT } from "@/i18n/context";

import vSeguridad from "@/assets/site/services__casco.png";
import vIntegridad from "@/assets/site/banners__certificacion.jpg";
import vIngenieria from "@/assets/site/features__ingeniero.png";
import vServicio from "@/assets/site/components__supervision.jpg";
import vInnovacion from "@/assets/site/features__soluciones.png";
import vLegalidad from "@/assets/site/components__certificacion.png";

import kKnowledge from "@/assets/site/components__entrenamiento.jpg";
import kAnalysis from "@/assets/site/banners__asesoria.jpg";
import kEngineering from "@/assets/site/banners__ingenieria.jpg";
import kElimination from "@/assets/site/banners__instalacion.jpg";

export const Route = createFileRoute("/nosotros")({
  component: NosotrosPage,
  head: () => ({
    meta: [
      { title: "Nosotros · Método K.A.E.E. · KG Safety" },
      { name: "description", content: "KG Fall Protection Engineering: diseño e implementación de sistemas de protección contra caídas con el método propietario K.A.E.E." },
      { property: "og:title", content: "Nosotros · KG Safety" },
      { property: "og:description", content: "Conozca el método K.A.E.E., nuestros valores y nuestro equipo." },
      { property: "og:url", content: "/nosotros" },
    ],
    links: [{ rel: "canonical", href: "/nosotros" }],
  }),
});

const KAEE = [
  { letter: "K", title: "Knowledge",   descKey: "Conocimiento bilateral para entendimiento claro entre cliente y equipo técnico.", img: kKnowledge },
  { letter: "A", title: "Analysis",    descKey: "Análisis en común con el cliente para lograr comunicación y objetivos definidos.", img: kAnalysis },
  { letter: "E", title: "Engineering", descKey: "Aplicación de cualquier método de ingeniería necesario para lograr los objetivos.", img: kEngineering },
  { letter: "E", title: "Elimination", descKey: "Eliminación total de la problemática buscando el 100%.", img: kElimination },
];

const VALUES = [
  { titleKey: "Seguridad",  descKey: "Sobre todo otro valor operativo.",                          img: vSeguridad },
  { titleKey: "Integridad", descKey: "Documentación, normativa y cumplimiento sin excepción.",    img: vIntegridad },
  { titleKey: "Ingeniería", descKey: "Decisiones basadas en cálculo, no en suposición.",          img: vIngenieria },
  { titleKey: "Servicio",   descKey: "Respuesta del mismo día, ejecución sin pretextos.",         img: vServicio },
  { titleKey: "Innovación", descKey: "Nuevos equipos, métodos y marcas evaluados continuamente.", img: vInnovacion },
  { titleKey: "Legalidad",  descKey: "Certeza jurídica plena en cada documento emitido.",         img: vLegalidad },
];

function NosotrosPage() {
  const { t } = useT();
  return (
    <div>
      {/* HERO — dark, legible en cualquier tema */}
      <section className="relative px-6 md:px-12 py-20 md:py-28 overflow-hidden bg-[color:var(--brand-navy)]">
        <div className="absolute inset-0">
          <img src={heightsImg} alt="" loading="eager" width={1600} height={1000} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--brand-navy)] via-[color:var(--brand-navy)]/85 to-[color:var(--brand-navy)]/40" />
        </div>
        <div className="kg-on-dark max-w-5xl relative z-10">
          <SectionLabel>{t("Quiénes somos")}</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight" style={{ color: "#ffffff" }}>
            {t("No solo diseñamos seguridad.")}<br />
            <span className="text-signal">{t("Diseñamos tranquilidad.")}</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            {t("En KG nos especializamos en el diseño e implementación de sistemas de protección contra caídas que cumplen con los más altos estándares de ingeniería y seguridad. Cada estructura, cada persona y cada detalle importan.")}
          </p>
        </div>
      </section>

      {/* MÉTODO K.A.E.E. — tiles con imagen */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-y border-[color:var(--border)] bg-[color:var(--surface-2)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <SectionLabel>{t("Método registrado")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight text-[color:var(--on-surface)]">
              {t("Método")} <span className="text-signal">K.A.E.E.</span>
            </h2>
            <p className="text-[color:var(--on-surface)]/70 mt-6 leading-relaxed">
              {t("Cuatro etapas críticas de ingeniería aplicada. La metodología propietaria que reduce a cero los accidentes bajo implementación completa.")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {KAEE.map((k, i) => (
              <article key={i} className="kg-on-dark relative overflow-hidden rounded-[var(--bento-radius,1.25rem)] min-h-[280px] flex flex-col justify-end p-6 group">
                <img src={k.img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-navy)] via-[color:var(--brand-navy)]/70 to-[color:var(--brand-navy)]/20" />
                <div className="relative">
                  <div className="font-display text-signal text-5xl md:text-6xl leading-none mb-3">{k.letter}</div>
                  <h3 className="font-bold uppercase tracking-wider mb-2 text-sm" style={{ color: "#ffffff" }}>{k.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>{t(k.descKey)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VALORES — ahora con imagen, sin "todo blanco" */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <SectionLabel>{t("Valores")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight text-[color:var(--on-surface)]">
              {t("Lo que nos hace innegociables.")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {VALUES.map((v, i) => (
              <article key={v.titleKey} className="kg-on-dark relative overflow-hidden rounded-[var(--bento-radius,1.25rem)] min-h-[260px] flex flex-col justify-end p-6 group border border-[color:var(--border)]">
                <img src={v.img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-navy)] via-[color:var(--brand-navy)]/75 to-[color:var(--brand-navy)]/25" />
                <div className="relative">
                  <div className="font-display text-signal text-xs mb-3 tracking-[0.22em]">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="font-display text-2xl uppercase mb-2" style={{ color: "#ffffff" }}>{t(v.titleKey)}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>{t(v.descKey)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comunicación efectiva */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{t("Comunicación efectiva en seguridad")}</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight text-[color:var(--on-surface)]">
            {t("Nueve pilares operativos")}
          </h2>
          <p className="text-[color:var(--on-surface)]/70 leading-relaxed text-lg max-w-3xl">
            {t("Aseguramos comunicación, comprensión, detección de causa raíz, evaluación contra estándar, validación de proveedores, certificación de personal, flujo previo a trabajos en altura y capacitación continua.")}
          </p>
        </div>
      </section>

      {/* Normatividad */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-[color:var(--border)]">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{t("Normatividad y reglamentación")}</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-12 uppercase leading-tight text-[color:var(--on-surface)]">
            {t("Alineados con los más altos estándares.")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {["OSHA 1926 / 1910", "ANSI / ASSP", "CSA Z259", "EN-795", "NOM-009-STPS-2011", "Reglamentos internos por cliente"].map((n) => (
              <div key={n} className="kg-bento p-6 text-center">
                <span className="font-display text-sm uppercase text-[color:var(--on-surface)] tracking-tight">{t(n)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12 text-center bg-[color:var(--brand-navy)] kg-on-dark">
        <p className="font-display text-5xl md:text-7xl text-signal mb-10 leading-none">
          {t("We never fall.")}
        </p>
        <Link to="/contacto" className="inline-block bg-signal text-[color:var(--anchor-fixed)] px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
          {t("Trabajemos juntos")}
        </Link>
      </section>
    </div>
  );
}
