import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/i18n/context";
import { BentoGrid, BentoTile } from "@/components/bento/Bento";
import { realImagesIn } from "@/lib/real-image";
import { COURSES, EQUIPMENT, PNPC_STATS, TESTIMONIALS, INDUSTRIES } from "@/data/kaee";
import { DifferentiatorBlock } from "@/components/site/DifferentiatorBlock";

import { ClientLogosGrid } from "@/components/site/ClientLogosGrid";
import { InstagramFeed } from "@/components/site/InstagramFeed";


import heroImg from "@/assets/hero-clean.jpg";
import ctaImg from "@/assets/cta-office.jpg";
import alturasImg from "@/assets/courses/alturas.jpg";
import confinadosImg from "@/assets/courses/confinados.jpg";
import andamiosImg from "@/assets/courses/andamios.jpg";
import lotoImg from "@/assets/courses/loto.jpg";
import electricidadImg from "@/assets/courses/electricidad.jpg";
import calorImg from "@/assets/courses/calor.jpg";
import eppImg from "@/assets/equipment/epp.jpg";
import lvImg from "@/assets/equipment/lineas-de-vida.jpg";
import anclajesImg from "@/assets/equipment/anclajes.jpg";
import plataformasImg from "@/assets/equipment/plataformas.jpg";


const COURSE_IMG: Record<string, string> = {
  "alturas-autorizado": alturasImg,
  "alturas-competente": alturasImg,
  "alturas-monitor": alturasImg,
  "alturas-horizontales": alturasImg,
  andamios: andamiosImg,
  izajes: lotoImg,
  "plataformas-elevacion": electricidadImg,
  confinados: confinadosImg,
  loto: lotoImg,
  electricidad: electricidadImg,
  calor: calorImg,
};

const EQUIP_IMG: Record<string, string> = {
  epp: eppImg,
  "lineas-de-vida": lvImg,
  anclajes: anclajesImg,
  plataformas: plataformasImg,
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "KG Safety · Eliminación total de riesgos de caída" },
      { name: "description", content: "Ingeniería aplicada a la eliminación total de riesgos de caída. Capacitación DC-3, sistemas certificados e ingeniería para industria pesada. 30M+ horas-hombre sin accidentes." },
      { property: "og:title", content: "KG Safety · Eliminación total de riesgos de caída" },
      { property: "og:description", content: "Integrador de seguridad en altura: diagnóstico, ingeniería, instalación, certificación, capacitación y documentación auditable." },
      { property: "og:url", content: "https://kgsafety.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/" }],
  }),
});


function Index() {
  const { t } = useT();
  const clientLogos = realImagesIn("logos-clientes");
  const topCourses = COURSES.filter((c) => c.active !== false).slice(0, 6);
  const topEquip = EQUIPMENT.filter((e) => EQUIP_IMG[e.slug]).slice(0, 4);
  const restEquip = EQUIPMENT.filter((e) => !EQUIP_IMG[e.slug]).slice(0, 4);
  void topEquip; void restEquip; void clientLogos;

  return (
    <div className="bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* ============== HERO ============== */}
      <section className="px-4 md:px-8 lg:px-12 pt-6 md:pt-10 pb-10">
        <div className="max-w-7xl mx-auto grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-6 lg:auto-rows-[minmax(170px,auto)]">

          {/* HERO TILE — split: navy block + image */}
          <div className="lg:col-span-4 lg:row-span-3 rounded-[var(--bento-radius,1.25rem)] overflow-hidden border border-[color:var(--brand-navy)] kg-on-dark bg-[color:var(--brand-navy)] flex flex-col lg:flex-row min-h-[460px] lg:min-h-[520px]">
            {/* Image */}
            <div className="relative lg:order-2 lg:w-[42%] h-[220px] md:h-[280px] lg:h-auto shrink-0">
              <img
                src={heroImg}
                alt={t("Técnico industrial trabajando en altura con arnés certificado")}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Soft navy edge fade — only at the seam, image stays visible */}
              <div
                className="absolute inset-0 pointer-events-none lg:bg-[linear-gradient(90deg,var(--brand-navy)_0%,transparent_22%)] bg-[linear-gradient(180deg,transparent_60%,var(--brand-navy)_100%)]"
              />
              <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-[0.25em] px-2 py-1 bg-black/40 backdrop-blur-sm text-white rounded">
                {t("En campo · 2026")}
              </span>
            </div>

            {/* Copy */}
            <div className="lg:order-1 lg:w-[58%] p-6 md:p-8 lg:p-11 flex flex-col">
              <span className="kg-pill-tech self-start mb-5">
                <span className="kg-led shrink-0" aria-hidden />
                <span className="kg-pill-text">
                  {t("Integrador de seguridad en altura")}
                  <span className="hidden sm:inline"> · {t("WE NEVER FALL")}</span>
                </span>
              </span>

              <h1 className="font-display uppercase leading-[0.95] tracking-tight mb-4 md:mb-5">
                <span className="block text-[clamp(2rem,5.5vw,3.75rem)] text-white [overflow-wrap:normal] [word-break:keep-all]">
                  {t("Cero caídas.")}
                </span>
                <span className="block text-[clamp(1.35rem,4vw,2.5rem)] mt-2" style={{ color: "var(--signal)" }}>
                  {t("Ingeniería que las elimina.")}
                </span>
              </h1>

              <p className="text-sm md:text-base lg:text-lg leading-relaxed max-w-xl mb-7 text-white text-left [text-wrap:pretty] [hyphens:none]">
                {t("Levantamientos con personal altamente calificado en los más altos estándares. Sistemas anticaídas certificados y capacitación con alto contenido técnico, para todo tipo de industria y construcción.")}
              </p>


              <div className="flex flex-wrap gap-3 mt-auto">
                <Link
                  to="/contacto"
                  className="inline-flex items-center gap-2 whitespace-nowrap px-5 md:px-6 py-3 font-bold uppercase text-[11px] md:text-xs tracking-[0.16em] md:tracking-[0.2em] rounded-md shadow-[3px_3px_0_0_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-transform"
                  style={{ background: "var(--signal)", color: "var(--anchor-fixed)" }}
                >
                  <span>{t("Hablar con un especialista")}</span>
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  to="/servicios"
                  className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md hover:bg-white/10 transition-colors"
                  style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.45)" }}
                >
                  {t("Ver soluciones")}
                </Link>
              </div>
            </div>
          </div>

          {/* KPI 30M+ */}
          <div className="lg:col-span-2 lg:row-span-2 rounded-[var(--bento-radius,1.25rem)] border-2 border-[color:var(--anchor-fixed)] bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] p-6 md:p-7 flex flex-col relative overflow-hidden min-h-[240px]">
            <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-[0.22em] bg-[color:var(--anchor-fixed)] text-[color:var(--signal)] px-2 py-1 rounded">
              {t("Sin accidentes")}
            </span>
            <div className="font-display text-[clamp(3.5rem,10vw,7rem)] leading-[0.9] mb-4 whitespace-nowrap [overflow-wrap:normal] tracking-tight">30M+</div>
            <div className="text-[13px] md:text-sm uppercase tracking-[0.22em] font-bold leading-snug max-w-[85%]">
              {t("Horas-hombre supervisadas")}
            </div>


            {/* Mini trend bars */}
            <div className="mt-5 flex items-end gap-1.5 h-10">
              {[28, 44, 62, 84, 100].map((h, i) => (
                <div
                  key={i}
                  className="w-2.5 rounded-sm bg-[color:var(--anchor-fixed)]"
                  style={{ height: `${h}%`, opacity: 0.45 + i * 0.11 }}
                />
              ))}
              <span className="ml-2 mb-0.5 text-[10px] font-bold tracking-widest uppercase opacity-80">
                {t("12 años continuos")}
              </span>
            </div>

            <div className="mt-auto pt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-bold border-t border-[color:var(--anchor-fixed)]/20">
              <span className="inline-grid place-items-center w-4 h-4 rounded-full bg-[color:var(--anchor-fixed)] text-[color:var(--signal)] text-[10px]">✓</span>
              <span>{t("200+ clientes industriales")}</span>
            </div>
          </div>

          {/* Registro + países */}
          <div className="lg:col-span-2 rounded-[var(--bento-radius,1.25rem)] border border-[color:var(--brand-navy)] bg-[color:var(--brand-navy)] kg-on-dark grid grid-cols-2 divide-x divide-white/15 overflow-hidden min-h-[170px]">
            <div className="p-5 md:p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: "var(--signal)" }}>
                  <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
                </svg>
                <span className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--signal)" }}>STPS · DC-3</span>
              </div>
              <div className="font-display text-base md:text-lg leading-tight mt-auto text-white">
                {t("Registro oficial")}
              </div>
              <div className="mt-1 h-[2px] w-8" style={{ background: "var(--signal)" }} />
            </div>
            <div className="p-5 md:p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: "var(--signal)" }}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" />
                </svg>
                <span className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--signal)" }}>{t("5 países")}</span>
              </div>
              <div className="font-display text-base md:text-lg leading-tight mt-auto text-white">
                MX · CO · CL · US · CA
              </div>
              <div className="mt-1 h-[2px] w-8" style={{ background: "var(--signal)" }} />
            </div>
          </div>


        </div>
      </section>


      {/* ============== BANNER: DIAGNÓSTICO (antes de diferenciador) ============== */}
      <section className="px-4 md:px-8 lg:px-12 pt-4 pb-2">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/contacto"
            className="group flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 justify-between rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-5 md:px-8 py-5 md:py-6 hover:border-[color:var(--signal)] hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-4 md:gap-5 min-w-0">
              <span aria-hidden className="hidden md:inline-grid place-items-center w-11 h-11 rounded-full bg-[color:var(--brand-navy)] text-[color:var(--signal)] font-display text-lg shrink-0">72h</span>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-blue mb-1">{t("Diagnóstico técnico gratuito")}</div>
                <div className="font-display text-lg md:text-2xl uppercase leading-tight text-[color:var(--on-surface)]">
                  {t("Sepa exactamente qué le falta para pasar auditoría STPS.")}
                </div>
                <p className="text-xs md:text-sm text-[color:color-mix(in_oklab,var(--on-surface)_65%,transparent)] mt-1">
                  {t("Un ingeniero revisa su sitio y le entrega un plan priorizado en 72 horas hábiles.")}
                </p>
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 px-5 py-3 font-bold uppercase text-[11px] tracking-[0.2em] rounded-md bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] shadow-[3px_3px_0_0_rgba(0,0,0,0.25)] group-hover:-translate-y-0.5 transition-transform">
              {t("Solicitar diagnóstico")} <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ============== DIFERENCIADOR ============== */}
      <DifferentiatorBlock />

      {/* ============== BANNER: CAPACITACIÓN (después de KAEE) ============== */}
      <section className="px-4 md:px-8 lg:px-12 pt-6 pb-2">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/capacitacion"
            className="group relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 justify-between rounded-xl border border-[color:var(--brand-navy)] bg-[color:var(--brand-navy)] kg-on-dark px-5 md:px-8 py-5 md:py-6 hover:-translate-y-0.5 transition-transform"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[color:var(--signal)] opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" aria-hidden />
            <div className="relative flex items-center gap-4 md:gap-5 min-w-0">
              <span aria-hidden className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] font-display text-[13px] md:text-sm tracking-tight leading-none shrink-0">DC-3</span>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] mb-1" style={{ color: "var(--signal)" }}>
                  {t("Capacitación STPS · 7 cursos activos 2026")}
                </div>
                <div className="font-display text-lg md:text-2xl uppercase leading-tight" style={{ color: "#fff" }}>
                  {t("Certifique a su equipo con instructores autorizados STPS.")}
                </div>
                <p className="text-xs md:text-sm mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {t("Alturas, andamios, izajes, plataformas y horizontales. DC-3 oficial incluida.")}
                </p>
              </div>
            </div>
            <span className="relative shrink-0 inline-flex items-center gap-2 px-5 py-3 font-bold uppercase text-[11px] tracking-[0.2em] rounded-md bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] shadow-[3px_3px_0_0_rgba(0,0,0,0.35)] group-hover:-translate-y-0.5 transition-transform">
              {t("Ver cursos")} <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>


      {/* ============== EVIDENCIA DOCUMENTAL ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-10 md:py-14 bg-[color:var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/cumplimiento"
            className="group block rounded-xl bg-[color:var(--anchor-fixed)] kg-on-dark text-white border border-white/10 overflow-hidden transition-all duration-200 hover:border-[color:var(--signal)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(15,27,61,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--signal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface)] active:scale-[0.995]"
          >
            <div className="grid md:grid-cols-[1.1fr_1fr] gap-0">
              {/* Left: pitch */}
              <div className="p-6 md:p-9 lg:p-10 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] text-xs font-bold">✓</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--signal)" }}>
                    {t("Cierre auditable")}
                  </span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl uppercase leading-tight mb-3 text-white">
                  {t("Cada proyecto se entrega con la carpeta lista para auditoría.")}
                </h3>
                <p className="text-sm md:text-base text-white/75 leading-relaxed mb-6 max-w-lg">
                  {t("No te dejamos con la responsabilidad legal. Documentamos cada hora-hombre, cada anclaje, cada certificación.")}
                </p>
                <span
                  className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-[11px] uppercase tracking-[0.2em] bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] shadow-[3px_3px_0_0_rgba(0,0,0,0.25)] transition-transform group-hover:-translate-y-0.5"
                >
                  {t("Ver entregables")}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>

              {/* Right: deliverables checklist */}
              <div className="bg-white/[0.04] border-t md:border-t-0 md:border-l border-white/10 p-6 md:p-9 lg:p-10">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55 mb-4">
                  {t("Incluye en cada entrega")}
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    t("Análisis de riesgo"),
                    t("Plan de rescate"),
                    t("Certificados de anclaje"),
                    t("DC-3 oficiales"),
                    t("Bitácora de inspección"),
                    t("Memoria de cálculo"),
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/90">
                      <span aria-hidden className="mt-0.5 inline-grid place-items-center w-4 h-4 rounded-sm border border-[color:var(--signal)] text-[color:var(--signal)] text-[10px] font-bold shrink-0">✓</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        </div>
      </section>


      {/* ============== BANNER: EQUIPOS (después de evidencia) ============== */}
      <section className="px-4 md:px-8 lg:px-12 pt-6 pb-2">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/equipos"
            className="group flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 justify-between rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-5 md:px-8 py-5 md:py-6 hover:border-[color:var(--signal)] hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-4 md:gap-5 min-w-0">
              <span aria-hidden className="hidden md:inline-grid place-items-center w-11 h-11 rounded-full bg-[color:var(--brand-navy)] text-[color:var(--signal)] font-display text-lg shrink-0">EPP</span>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-blue mb-1">{t("Equipos certificados en stock")}</div>
                <div className="font-display text-lg md:text-2xl uppercase leading-tight text-[color:var(--on-surface)]">
                  {t("Arneses, líneas de vida, anclajes y plataformas — con trazabilidad.")}
                </div>
                <p className="text-xs md:text-sm text-[color:color-mix(in_oklab,var(--on-surface)_65%,transparent)] mt-1">
                  {t("Selección técnica según su operación. Entrega, inspección y capacitación de uso incluidas.")}
                </p>
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 px-5 py-3 font-bold uppercase text-[11px] tracking-[0.2em] rounded-md bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] shadow-[3px_3px_0_0_rgba(0,0,0,0.25)] group-hover:-translate-y-0.5 transition-transform">
              {t("Ver catálogo")} <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ============== CLIENTES ============== */}
      <ClientLogosGrid />


      {/* ============== PROMO BANNER P.N.P.C. ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-10 md:py-14 bg-[color:var(--brand-navy)] kg-on-dark">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[var(--bento-radius,1.25rem)] border border-white/10 bg-gradient-to-br from-[color:var(--brand-navy)] to-[color:var(--anchor-fixed)] p-6 md:p-10 lg:p-12">
            {/* Decorative signal accent */}
            <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[color:var(--signal)] opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3" aria-hidden />
            <div className="absolute bottom-0 left-0 w-24 h-24 md:w-40 md:h-40 bg-[color:var(--brand-blue)] opacity-10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/3" aria-hidden />

            <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] text-xs font-bold">✓</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--signal)" }}>
                    {t("P.N.P.C. · Programa Nacional de Profesionalización a Contratistas")}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-4xl lg:text-5xl uppercase leading-[1.08] mb-4 text-white">
                  {t("Sus contratistas listos para operar")}{" "}
                  <span style={{ color: "var(--signal)" }}>{t("bajo control total.")}</span>
                </h2>
                <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-6">
                  {t("Gestione competencias, certificaciones y EPP en un solo sistema. 11 años de operación ininterrumpida con cumplimiento STPS, OSHA y ANSI/ASSP.")}
                </p>
                <ul className="grid sm:grid-cols-3 gap-3 text-[11px] md:text-xs text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--signal)]" aria-hidden />
                    {t("Competencias certificadas")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--signal)]" aria-hidden />
                    {t("Vigencias bajo control")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--signal)]" aria-hidden />
                    {t("Evidencia para auditoría")}
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[220px]">
                <Link
                  to="/contratistas"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 font-bold uppercase text-xs tracking-[0.2em] rounded-md shadow-[4px_4px_0_0_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-transform text-center"
                  style={{ background: "var(--signal)", color: "var(--anchor-fixed)" }}
                >
                  <span>{t("Conocer el programa")}</span>
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  to="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 font-bold uppercase text-xs tracking-[0.2em] rounded-md border border-white/40 text-white hover:bg-white/10 transition-colors text-center"
                >
                  <span>{t("Solicitar diagnóstico")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== SERVICIOS BENTO ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-[color:var(--surface-2)] border-y border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">

          <BentoGrid>
            <BentoTile
              span="col-span-2 md:col-span-3"
              variant="image"
              image={alturasImg}
              to="/capacitacion"
              eyebrow="01 / Capacitación"
              title={t("Cursos DC-3 certificados")}
              description={t("4 niveles · 10 áreas técnicas · STPS, OSHA y ANSI Z359.")}
              cta={t("Ver cursos")}
            />
            <BentoTile
              span="col-span-2 md:col-span-3"
              variant="image"
              image={eppImg}
              to="/equipos"
              eyebrow="02 / Equipos S@H"
              title={t("EPP y anclajes certificados")}
              description={t("Arnés, líneas de vida, andamios y más.")}
              cta={t("Catálogo")}
            />
            <BentoTile
              span="col-span-2 md:col-span-3"
              variant="image"
              image={lvImg}
              to="/ingenieria"
              eyebrow="03 / Ingeniería"
              title={t("Líneas de vida")}
              description={t("Diseño, instalación y certificación NOM-009 / EN-795.")}
              cta={t("Diagnóstico")}
            />
            <BentoTile
              span="col-span-2 md:col-span-3"
              variant="accent"
              to="/contratistas"
              eyebrow="04 / P.N.P.C."
              title={t("Contratistas")}
              description={t("Profesionalizamos a sus proveedores externos antes de operar en planta.")}
              cta={t("Conocer el programa")}
            />

          </BentoGrid>
        </div>
      </section>

      {/* ============== CATÁLOGO CURSOS ============== */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                {t("Capacitación")}
              </div>
              <h2 className="font-display text-2xl md:text-4xl uppercase">
                {t("Catálogo de cursos")}
              </h2>
            </div>
            <Link to="/capacitacion" className="text-brand-blue font-bold text-[11px] uppercase tracking-[0.22em] border-b border-brand-blue pb-1">
              {t("Ver los 7 cursos")} →
            </Link>
          </div>

          <BentoGrid cols="grid-cols-2 md:grid-cols-6" rows="auto-rows-[minmax(170px,auto)] md:auto-rows-[minmax(200px,auto)]">
            {topCourses.map((c, i) => {
              const img = COURSE_IMG[c.slug];
              const featured = i === 0;
              return (
                <BentoTile
                  key={c.slug}
                  span={featured ? "col-span-2 md:col-span-3 md:row-span-2" : "md:col-span-2"}
                  variant="image"
                  image={img}
                  to="/capacitacion/$curso"
                  params={{ curso: c.slug }}
                  eyebrow={`${String(i + 1).padStart(2, "0")} · ${c.levels.length} niveles`}
                  title={c.short}
                  description={featured ? c.desc : undefined}
                  cta={t("Ver curso")}
                />
              );
            })}
          </BentoGrid>
        </div>
      </section>





      {/* ============== BANNER: INGENIERÍA (antes del CTA final) ============== */}
      <section className="px-4 md:px-8 lg:px-12 pt-6 pb-2">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/ingenieria"
            className="group relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 justify-between rounded-xl border border-[color:var(--brand-navy)] bg-[color:var(--brand-navy)] kg-on-dark px-5 md:px-8 py-5 md:py-6 hover:-translate-y-0.5 transition-transform"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[color:var(--signal)] opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" aria-hidden />
            <div className="relative flex items-center gap-4 md:gap-5 min-w-0">
              <span aria-hidden className="hidden md:inline-grid place-items-center w-11 h-11 rounded-full bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] font-display text-lg shrink-0">Ø</span>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] mb-1" style={{ color: "var(--signal)" }}>
                  {t("Ingeniería aplicada")}
                </div>
                <div className="font-display text-lg md:text-2xl uppercase leading-tight" style={{ color: "#fff" }}>
                  {t("Diseño, instalación y certificación de líneas de vida.")}
                </div>
                <p className="text-xs md:text-sm mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {t("Memoria de cálculo, pruebas de carga y planos as-built firmados por ingeniero responsable.")}
                </p>
              </div>
            </div>
            <span className="relative shrink-0 inline-flex items-center gap-2 px-5 py-3 font-bold uppercase text-[11px] tracking-[0.2em] rounded-md bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] shadow-[3px_3px_0_0_rgba(0,0,0,0.35)] group-hover:-translate-y-0.5 transition-transform">
              {t("Ver ingeniería")} <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ============== FINAL CTA BENTO ============== */}

      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-[color:var(--surface-2)] border-t border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <BentoGrid>
            <BentoTile span="col-span-2 md:col-span-4 md:row-span-2" variant="image" image={ctaImg}>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "var(--signal)" }}>
                {t("Respuesta el mismo día hábil")}
              </div>
              <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight mb-4" style={{ color: "#fff" }}>
                {t("Comparta su riesgo.")}{" "}
                <br />
                <span style={{ color: "var(--signal)" }}>{t("Le respondemos con un plan técnico.")}</span>
              </h2>
              <p className="text-sm md:text-base max-w-xl mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
                {t("Indíquenos planta, tipo de trabajo, número de usuarios y fecha crítica. Un especialista le dirá si necesita capacitación, equipo, visita técnica, certificación o plan de rescate.")}
              </p>
              <div className="flex flex-wrap gap-3 mt-auto relative z-10">
                <Link to="/contacto" className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md" style={{ background: "var(--signal)", color: "var(--anchor-fixed)" }}>
                  {t("Hablar con un especialista")}
                </Link>
                <a href="https://wa.me/527228795076" target="_blank" rel="noopener noreferrer" className="px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] rounded-md" style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.06)" }}>
                  {t("WhatsApp directo")}
                </a>
              </div>
            </BentoTile>



            <BentoTile span="md:col-span-2" variant="accent" href="tel:+527228795076" eyebrow={t("Llamada directa")}>
              <div className="font-display uppercase leading-[1.05] tracking-tight text-[clamp(1rem,1.8vw,1.35rem)] mb-3">
                +52 722 879 5076
              </div>
              <div className="pt-1 text-[11px] font-bold uppercase tracking-[0.14em] flex items-center gap-2">
                <span>{t("Llamar ahora")}</span>
                <span aria-hidden>→</span>
              </div>
            </BentoTile>
            <BentoTile span="md:col-span-2" variant="neutral" eyebrow={t("Certificados")}>
              <div className="flex flex-wrap gap-2 mt-2 text-[10px] uppercase tracking-widest font-display opacity-70">
                <span>STPS</span><span>OSHA</span><span>ANSI Z359</span>
                <span>NOM-009</span><span>EN-795</span><span>CSA Z259</span>
              </div>
            </BentoTile>
          </BentoGrid>
        </div>
      </section>

      <InstagramFeed />
    </div>
  );
}

