import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  ClipboardCheck,
  HardHat,
  Phone,
  ShieldCheck,
} from "lucide-react";
import trainingImg from "@/assets/training-classroom.jpg";
import engineeringImg from "@/assets/engineering-install.jpg";
import equipmentImg from "@/assets/equipment-ppe.jpg";
import { ClientLogosGrid } from "@/components/site/ClientLogosGrid";
import { CinematicHero } from "@/components/lp/CinematicHero";
import { ScrollStory } from "@/components/lp/ScrollStory";
import { Reveal } from "@/components/lp/Reveal";

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10" aria-hidden>
      <div className="lp-progress h-full bg-signal" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

const WA = "https://wa.me/527228795076?text=" +
  encodeURIComponent(
    "Hola KG Safety, vengo de la landing. Quiero un diagnóstico de riesgo en altura para mi planta.",
  );

export const Route = createFileRoute("/lp")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Cero caídas en su planta · Diagnóstico gratuito · KG Safety" },
      {
        name: "description",
        content:
          "Capacitación DC-3 avalada STPS, líneas de vida con memoria de cálculo y equipo certificado. 30M+ horas-hombre sin accidentes. Reciba su diagnóstico de riesgo en altura sin costo.",
      },
      { property: "og:title", content: "Cero caídas en su planta · KG Safety" },
      {
        property: "og:description",
        content:
          "Ingeniería, capacitación DC-3 y equipo certificado contra caídas. Diagnóstico de riesgo sin costo para su planta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cero caídas en su planta · KG Safety" },
      {
        name: "twitter:description",
        content: "Diagnóstico de riesgo en altura sin costo. Respuesta el mismo día hábil.",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/lp" }],
  }),
});

function CTA({
  children,
  variant = "primary",
  className = "",
  href,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "wa";
  className?: string;
  href?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-[0.14em] text-[12px] md:text-sm px-6 py-4 md:px-8 md:py-5 transition-colors w-full sm:w-auto text-center";
  const styles =
    variant === "primary"
      ? "bg-signal text-[color:var(--anchor-fixed)] hover:bg-white shadow-[6px_6px_0_0_rgba(0,0,0,0.35)]"
      : variant === "wa"
        ? "bg-[#25D366] text-[#062d17] hover:brightness-110"
        : "border border-white/40 text-white hover:bg-white/10";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${styles} ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <Link to="/contacto" className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}




const METHOD = [
  {
    k: "K",
    title: "Know",
    body: "Levantamiento en sitio: frentes de trabajo, alturas, accesos y brechas normativas reales.",
  },
  {
    k: "A",
    title: "Assess",
    body: "Matriz de riesgo por tarea y jerarquía de controles. Priorizamos lo que puede matar hoy.",
  },
  {
    k: "E",
    title: "Engineer",
    body: "Diseño de sistemas de protección con memoria de cálculo, planos y especificación de materiales.",
  },
  {
    k: "E",
    title: "Execute",
    body: "Instalación, capacitación DC-3 y entrega de expediente auditable. Con acompañamiento posterior.",
  },
];

const OFFERS = [
  {
    img: trainingImg,
    tag: "Capacitación",
    title: "Cursos con DC-3 avalada STPS",
    body: "Alturas básico, intermedio y avanzado, espacios confinados, rescate y más. En sus instalaciones o en aula.",
    to: "/capacitacion" as const,
    cta: "Ver cursos y fechas",
  },
  {
    img: engineeringImg,
    tag: "Ingeniería",
    title: "Líneas de vida y sistemas de anclaje",
    body: "Diseño, memoria de cálculo, instalación certificada e inspección anual documentada.",
    to: "/ingenieria" as const,
    cta: "Ver ingeniería",
  },
  {
    img: equipmentImg,
    tag: "Equipos",
    title: "EPP certificado y trazable",
    body: "Arneses, absorbedores, líneas y kits de rescate con ficha técnica y respaldo de marca.",
    to: "/equipos" as const,
    cta: "Ver catálogo",
  },
];

const PROOF = [
  { n: "30M+", l: "horas-hombre supervisadas sin accidentes" },
  { n: "29", l: "operaciones críticas atendidas" },
  { n: "5", l: "países con cobertura operativa" },
  { n: "100%", l: "expedientes auditables entregados" },
];

const STEPS = [
  { n: "01", t: "Agenda de 15 minutos", d: "Nos cuenta su frente de trabajo y su fecha objetivo." },
  { n: "02", t: "Diagnóstico sin costo", d: "Recibe brechas normativas priorizadas y alcance propuesto." },
  { n: "03", t: "Propuesta el mismo día hábil", d: "Alcance, tiempos y costo. Sin letras chicas." },
  { n: "04", t: "Ejecución y expediente", d: "Se capacita, se instala y se documenta todo para auditoría." },
];

const FAQS = [
  {
    q: "¿La DC-3 es válida ante STPS?",
    a: "Sí. Emitimos DC-3 como agente capacitador con registro vigente, con datos del trabajador, tema y horas conforme al formato oficial.",
  },
  {
    q: "¿Cuánto tarda el diagnóstico?",
    a: "La llamada inicial es de 15 minutos y la propuesta se entrega el mismo día hábil tras la visita o revisión de planos.",
  },
  {
    q: "¿Atienden fuera de México?",
    a: "Sí: México, Colombia, Chile, Estados Unidos y Canadá, con el mismo estándar de entregables.",
  },
  {
    q: "¿Puedo facturar en línea?",
    a: "Sí. Con su código de cliente y folio de cotización timbra su CFDI 4.0 y recibe XML y PDF por correo.",
  },
];

function LandingPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="bg-[color:var(--brand-navy)] kg-on-dark pb-24 md:pb-0">
      {/* Barra superior mínima */}
      <div className="sticky top-0 z-40 bg-[color:var(--anchor-fixed)]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-3">
          <Link to="/" className="font-display text-white text-sm md:text-base uppercase tracking-tight">
            KG <span className="text-signal">Safety</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="tel:+527228795076"
              className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-signal"
            >
              <Phone size={14} /> 722 879 5076
            </a>
            <Link
              to="/contacto"
              className="bg-signal text-[color:var(--anchor-fixed)] px-4 py-2.5 text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-colors"
            >
              Diagnóstico gratis
            </Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Técnico trabajando en altura con arnés certificado" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--brand-navy)]/92 via-[color:var(--brand-navy)]/85 to-[color:var(--brand-navy)]" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-14 pb-16 md:pt-24 md:pb-24">
          <div className="kg-pill-tech mb-6">
            <span className="kg-led" aria-hidden />
            <span>Integrador de seguridad en altura · WE NEVER FALL</span>
          </div>
          <h1 className="font-display uppercase text-white leading-[1.02] break-words text-[clamp(2rem,9vw,4.5rem)] max-w-3xl">
            Su gente sube todos los días.
            <br />
            <span className="text-signal">Nosotros nos aseguramos de que baje.</span>
          </h1>
          <p className="mt-6 text-white/85 text-base md:text-xl leading-relaxed max-w-2xl">
            Capacitación con DC-3 avalada STPS, líneas de vida con memoria de cálculo y equipo certificado.
            Todo con expediente auditable. <strong className="text-white">30M+ horas-hombre sin accidentes.</strong>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <CTA>
              Quiero mi diagnóstico gratis <ArrowRight size={16} />
            </CTA>
            <CTA variant="wa" href={WA}>
              Hablar por WhatsApp
            </CTA>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-white/70">
            {["Sin costo", "Respuesta el mismo día hábil", "Sin compromiso de compra"].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-signal" /> {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRUEBA RÁPIDA */}
      <section className="bg-[color:var(--anchor-fixed)] border-y border-white/10 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {PROOF.map((p) => (
            <div key={p.l}>
              <div className="font-display text-signal text-[clamp(1.6rem,6vw,2.5rem)] leading-none">{p.n}</div>
              <div className="mt-2 text-[11px] uppercase tracking-widest text-white/60 leading-snug">{p.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EL PROBLEMA */}
      <section className="px-4 md:px-8 py-14 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-signal mb-4">El costo de no hacerlo</div>
          <h2 className="font-display uppercase text-white leading-tight text-[clamp(1.6rem,6.5vw,3rem)] max-w-3xl">
            El riesgo no avisa. La auditoría tampoco.
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-3">
            {STAKES.map((s) => (
              <article key={s.title} className="bg-white/[0.04] border border-white/12 p-6">
                <s.icon size={22} className="text-signal mb-4" strokeWidth={2.2} />
                <h3 className="font-display text-lg uppercase text-white leading-tight mb-2">{s.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <CTA>
              Revisar mi operación ahora <ArrowRight size={16} />
            </CTA>
          </div>
        </div>
      </section>

      {/* MÉTODO */}
      <section className="bg-[color:var(--anchor-fixed)] border-y border-white/10 px-4 md:px-8 py-14 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-signal mb-4">Método K.A.E.E.</div>
          <h2 className="font-display uppercase text-white leading-tight text-[clamp(1.6rem,6.5vw,3rem)] max-w-3xl">
            Un solo equipo diseña, capacita, instala y firma.
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {METHOD.map((m, i) => (
              <article key={i} className="border border-white/12 p-6 bg-white/[0.03]">
                <div className="font-display text-signal text-4xl leading-none mb-3">{m.k}</div>
                <h3 className="font-display text-base uppercase text-white mb-2">{m.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{m.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <CTA>Aplicar el método en mi planta</CTA>
            <CTA variant="ghost" href={WA}>
              Preguntar por WhatsApp
            </CTA>
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section className="px-4 md:px-8 py-14 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-signal mb-4">Qué resolvemos</div>
          <h2 className="font-display uppercase text-white leading-tight text-[clamp(1.6rem,6.5vw,3rem)] max-w-3xl">
            Tres frentes, un mismo estándar.
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-3">
            {OFFERS.map((o) => (
              <article key={o.title} className="border border-white/12 bg-white/[0.03] flex flex-col overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={o.img} alt={o.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal mb-3">{o.tag}</span>
                  <h3 className="font-display text-lg uppercase text-white leading-tight mb-2">{o.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-6">{o.body}</p>
                  <div className="mt-auto flex flex-col gap-2">
                    <Link
                      to="/contacto"
                      className="bg-signal text-[color:var(--anchor-fixed)] text-[11px] font-bold uppercase tracking-widest px-4 py-3 text-center hover:bg-white transition-colors"
                    >
                      Cotizar ahora
                    </Link>
                    <Link
                      to={o.to}
                      className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-signal text-center py-2"
                    >
                      {o.cta} →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTES */}
      <section className="bg-[color:var(--surface)] px-4 md:px-8 py-14 md:py-20 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4">
            Operaciones críticas que ya confían
          </div>
          <h2 className="font-display uppercase text-[color:var(--on-surface)] leading-tight text-[clamp(1.5rem,6vw,2.5rem)] max-w-2xl mb-10">
            Si funciona en estas plantas, funciona en la suya.
          </h2>
          <ClientLogosGrid />
        </div>
      </section>

      {/* CÓMO EMPIEZA */}
      <section className="px-4 md:px-8 py-14 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-signal mb-4">Cómo empezamos</div>
          <h2 className="font-display uppercase text-white leading-tight text-[clamp(1.6rem,6.5vw,3rem)] max-w-3xl">
            Cuatro pasos. Cero improvisación.
          </h2>
          <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STEPS.map((s) => (
              <li key={s.n} className="border border-white/12 bg-white/[0.03] p-6">
                <div className="font-display text-signal text-sm mb-3">{s.n}</div>
                <h3 className="font-display text-base uppercase text-white mb-2 leading-tight">{s.t}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            <CTA>
              <CalendarCheck size={16} /> Agendar diagnóstico
            </CTA>
            <CTA variant="wa" href={WA}>
              WhatsApp inmediato
            </CTA>
            <a
              href="tel:+527228795076"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-bold uppercase tracking-[0.14em] text-[12px] px-6 py-4 hover:bg-white/10 transition-colors"
            >
              <Phone size={16} /> Llamar ahora
            </a>
          </div>
        </div>
      </section>

      {/* GARANTÍAS / ENTREGABLES */}
      <section className="bg-[color:var(--anchor-fixed)] border-y border-white/10 px-4 md:px-8 py-14 md:py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, t: "Registro STPS vigente", d: "Agente capacitador con DC-3 válida ante auditoría." },
            { icon: ClipboardCheck, t: "Expediente auditable", d: "Planos, memorias, listas de asistencia y constancias." },
            { icon: HardHat, t: "Norma en la mano", d: "NOM-009-STPS, referencias OSHA y ANSI aplicadas al diseño." },
          ].map((g) => (
            <article key={g.t} className="border border-white/12 p-6 bg-white/[0.03]">
              <g.icon size={22} className="text-signal mb-4" strokeWidth={2.2} />
              <h3 className="font-display text-base uppercase text-white mb-2">{g.t}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{g.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-8 py-14 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-signal mb-4">Dudas frecuentes</div>
          <h2 className="font-display uppercase text-white leading-tight text-[clamp(1.6rem,6.5vw,2.6rem)] mb-8">
            Lo que preguntan antes de firmar
          </h2>
          <div className="divide-y divide-white/12 border-y border-white/12">
            {FAQS.map((f, i) => (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left"
                >
                  <span className="font-bold text-white text-sm md:text-base leading-snug">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 mt-0.5 text-signal transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i && <p className="pb-5 text-sm text-white/70 leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CTA>Resolver mi caso con un especialista</CTA>
          </div>
        </div>
      </section>

      {/* CIERRE */}
      <section className="px-4 md:px-8 py-16 md:py-28 bg-[color:var(--anchor-fixed)] border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display uppercase text-white leading-[1.05] text-[clamp(1.8rem,8vw,3.5rem)]">
            La próxima maniobra en altura <span className="text-signal">ya está agendada.</span>
          </h2>
          <p className="mt-5 text-white/80 text-base md:text-lg leading-relaxed">
            Pídanos el diagnóstico hoy y entre a esa maniobra con la ingeniería, la capacitación y el papel en orden.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <CTA>
              Solicitar diagnóstico gratis <ArrowRight size={16} />
            </CTA>
            <CTA variant="wa" href={WA}>
              Escribir por WhatsApp
            </CTA>
          </div>
          <p className="mt-8 text-[11px] uppercase tracking-widest text-white/45">
            KG Fall Protection Engineering · Toluca, Edo. Méx. · México · Colombia · Chile · EE. UU. · Canadá
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-[11px] uppercase tracking-widest text-white/45">
            <Link to="/" className="hover:text-signal">Sitio completo</Link>
            <Link to="/aviso-de-privacidad" className="hover:text-signal">Aviso de privacidad</Link>
          </div>
        </div>
      </section>

      {/* CTA fija móvil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[color:var(--anchor-fixed)] border-t border-white/10 px-3 py-3 flex items-center gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.35)]">
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-[#25D366] text-[#062d17] font-bold uppercase text-[10px] tracking-widest py-3.5"
        >
          WhatsApp
        </a>
        <Link
          to="/contacto"
          className="flex-[1.4] text-center bg-signal text-[color:var(--anchor-fixed)] font-bold uppercase text-[10px] tracking-widest py-3.5"
        >
          Diagnóstico gratis →
        </Link>
      </div>
    </div>
  );
}
