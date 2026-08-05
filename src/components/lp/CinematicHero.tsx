import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, BadgeCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/heights-worker.jpg";

export function CinematicHero({ waHref }: { waHref: string }) {
  const [y, setY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const p = Math.min(1, y / 700);

  return (
    <section className="lp-hero relative isolate min-h-[100svh] flex flex-col overflow-hidden">
      {/* Capa 1: imagen con Ken Burns + parallax */}
      <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden>
        <img
          src={heroImg}
          alt=""
          className="lp-kenburns w-full h-[118%] object-cover object-[60%_35%]"
          style={{ transform: `translate3d(0,${p * 90}px,0)` }}
        />
      </div>
      {/* Capa 2: gradientes cinematográficos + grano */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 90% at 78% 18%, rgba(15,27,61,0.12) 0%, rgba(15,27,61,0.72) 46%, rgba(10,16,36,0.97) 100%)",
        }}
      />
      <div className="lp-grain absolute inset-0 -z-10" aria-hidden />
      <div className="lp-scanline absolute inset-0 -z-10" aria-hidden />

      {/* HUD superior: sello de tiempo del relato */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 md:px-8 pt-24 md:pt-28">
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.32em] text-signal/90">
          <span className="lp-blink inline-block h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
          <span>REC · 06:41 h · turno matutino</span>
        </div>
      </div>

      {/* Titular */}
      <div
        className="relative z-10 flex-1 flex items-end"
        style={{ transform: `translate3d(0,${-p * 40}px,0)`, opacity: 1 - p * 0.55 }}
      >
        <div className="max-w-6xl w-full mx-auto px-4 md:px-8 pb-10 md:pb-14">
          <p className="lp-line text-white/70 text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] mb-5">
            Caso de estudio · La caída que no ocurrió
          </p>
          <h1 className="lp-title font-display uppercase text-white leading-[0.9] tracking-tight text-[clamp(2.6rem,13vw,8.5rem)]">
            <span className="block lp-line" style={{ animationDelay: "80ms" }}>
              Hoy alguien
            </span>
            <span className="block lp-line" style={{ animationDelay: "220ms" }}>
              subió 18 metros
            </span>
            <span className="block lp-line text-signal" style={{ animationDelay: "360ms" }}>
              y volvió a casa.
            </span>
          </h1>
          <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <p className="lp-line max-w-xl text-white/80 text-base md:text-lg leading-relaxed" style={{ animationDelay: "480ms" }}>
              No fue suerte. Fue una línea de vida con memoria de cálculo, un DC-3 que resiste auditoría y
              una supervisión que no negocia. <strong className="text-white">30M+ horas-hombre sin accidentes.</strong>
            </p>
            <div className="lp-line flex flex-col sm:flex-row gap-3" style={{ animationDelay: "600ms" }}>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center gap-2 bg-signal text-[color:var(--anchor-fixed)] font-bold uppercase tracking-[0.14em] text-[12px] md:text-sm px-7 py-4 md:px-8 md:py-5 shadow-[8px_8px_0_0_rgba(0,0,0,0.45)] hover:bg-white transition-colors"
              >
                Diagnóstico gratis <ArrowRight size={16} />
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-bold uppercase tracking-[0.14em] text-[12px] md:text-sm px-7 py-4 md:px-8 md:py-5 hover:bg-white/10 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <ul className="lp-line mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/60" style={{ animationDelay: "720ms" }}>
            {["Sin costo", "Respuesta el mismo día hábil", "Sin compromiso"].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <BadgeCheck size={13} className="text-signal" /> {i}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pie del hero: marquesina + señal de scroll */}
      <div className="relative z-10 border-t border-white/12 bg-[color:var(--anchor-fixed)]/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-6">
          <span className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white/60 shrink-0">
            <ArrowDown size={13} className="text-signal lp-bounce" /> Baje para ver el caso
          </span>
          <div className="lp-marquee min-w-0 flex-1 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.42em] text-white/35">
            <div className="lp-marquee__track">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i}>WE NEVER FALL · CERO CAÍDAS · WE NEVER FALL · CERO CAÍDAS ·&nbsp;</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
