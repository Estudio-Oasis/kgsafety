import { useEffect, useRef, useState } from "react";
import { RappelGame } from "@/components/site/RappelGame";

/**
 * Subtle 8-bit rappeller that descends as the user scrolls. Clicking the
 * climber opens a pixel mini-game (RappelGame). DOM mutated via refs in a
 * single rAF — no re-renders during scroll. Toggle persisted in localStorage;
 * respects prefers-reduced-motion (but defaults to ON otherwise).
 */

const STORAGE_KEY = "kg.rappellers.enabled";
const PX = 3;

export function ScrollRappellers() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored != null) return stored === "1";
    return true; // default ON
  });
  const [gameOpen, setGameOpen] = useState(false);

  const ropeRef = useRef<HTMLDivElement | null>(null);
  const climberRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const computeProgress = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      const anchors = Array.from(
        document.querySelectorAll<HTMLElement>("[data-rappel-anchor]"),
      );
      if (anchors.length >= 2) {
        const points = anchors.map((el) => el.offsetTop).sort((a, b) => a - b);
        for (let i = 0; i < points.length - 1; i++) {
          const a = points[i];
          const b = points[i + 1];
          if (scrollTop >= a && scrollTop <= b) {
            const segP = (scrollTop - a) / Math.max(1, b - a);
            const eased =
              segP < 0.5 ? 4 * segP * segP * segP : 1 - Math.pow(-2 * segP + 2, 3) / 2;
            const sg = a / max;
            const eg = b / max;
            return Math.min(1, Math.max(0, sg + (eg - sg) * eased));
          }
        }
      }
      return Math.min(1, Math.max(0, scrollTop / max));
    };

    const apply = () => {
      rafRef.current = null;
      const p = computeProgress();
      const y = 5 + p * 85;
      const frame = Math.floor(p * 30) % 2;
      if (ropeRef.current) ropeRef.current.style.height = `${y}vh`;
      if (climberRef.current) {
        climberRef.current.style.top = `calc(${y}vh - ${PX * 2}px)`;
        const inner = climberRef.current.querySelector(".pixel-climber") as HTMLElement | null;
        if (inner) inner.dataset.frame = String(frame);
      }
    };

    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(apply);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  const toggle = () => {
    setEnabled((v) => {
      const next = !v;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <>
      {enabled && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[5]" style={{ overflow: "hidden" }}>
          <div
            ref={ropeRef}
            className="absolute top-0"
            style={{
              right: "calc(env(safe-area-inset-right, 0px) + 14px)",
              width: PX,
              height: "5vh",
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(245,197,0,0.7) 0 4px, transparent 4px 8px)",
              imageRendering: "pixelated",
              opacity: 0.6,
            }}
          />
          <div
            ref={climberRef}
            className="absolute pointer-events-auto cursor-pointer group"
            style={{
              right: "calc(env(safe-area-inset-right, 0px) + 4px)",
              top: "5vh",
              willChange: "top",
            }}
            onClick={() => setGameOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setGameOpen(true);
              }
            }}
            aria-label="Jugar mini-juego de rappel"
            title="¡Juega! Recolecta monedas"
          >
            <PixelClimber />
            <span className="absolute -left-20 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm bg-black/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#F5C500] opacity-0 transition group-hover:opacity-100">
              ¡Jugar!
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        title={enabled ? "Desactivar animación" : "Activar animación"}
        className="hidden md:flex fixed bottom-4 left-4 z-[40] h-7 items-center justify-center rounded-sm border border-white/15 bg-black/50 px-2 text-[9px] font-bold uppercase tracking-widest text-white/80 shadow backdrop-blur transition hover:bg-black/70"
      >
        FX {enabled ? "ON" : "OFF"}
      </button>

      {gameOpen && <RappelGame onClose={() => setGameOpen(false)} />}
    </>
  );
}

function PixelClimber() {
  const Y = "#F5C500";
  const N = "#0F1B3D";
  const W = "#FFFFFF";
  const S = "#E8B894";
  const K = "#0A0A0A";
  const cell = (x: number, y: number, color: string) => (
    <rect key={`${x}-${y}-${color}`} x={x * PX} y={y * PX} width={PX} height={PX} fill={color} />
  );
  const body = (
    <>
      {cell(2, 0, Y)}{cell(3, 0, Y)}{cell(4, 0, Y)}
      {cell(1, 1, Y)}{cell(2, 1, Y)}{cell(3, 1, Y)}{cell(4, 1, Y)}{cell(5, 1, Y)}
      {cell(1, 2, K)}{cell(2, 2, S)}{cell(3, 2, S)}{cell(4, 2, S)}{cell(5, 2, K)}
      {cell(1, 3, N)}{cell(2, 3, N)}{cell(3, 3, N)}{cell(4, 3, N)}{cell(5, 3, N)}{cell(6, 3, N)}
      {cell(1, 4, N)}{cell(2, 4, W)}{cell(3, 4, W)}{cell(4, 4, W)}{cell(5, 4, N)}{cell(6, 4, N)}
      {cell(1, 5, N)}{cell(2, 5, N)}{cell(3, 5, N)}{cell(4, 5, N)}{cell(5, 5, N)}
      {cell(2, 6, N)}{cell(3, 6, N)}{cell(4, 6, N)}
    </>
  );
  return (
    <div
      data-frame="0"
      className="pixel-climber"
      style={{ width: 7 * PX, height: 9 * PX, imageRendering: "pixelated", filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.4))" }}
    >
      <svg width={7 * PX} height={9 * PX} viewBox={`0 0 ${7 * PX} ${9 * PX}`} shapeRendering="crispEdges">
        {body}
        <g className="legs-a">
          {cell(2, 7, N)}{cell(4, 7, N)}
          {cell(1, 8, K)}{cell(2, 8, K)}{cell(4, 8, K)}{cell(5, 8, K)}
        </g>
        <g className="legs-b">
          {cell(3, 7, N)}{cell(4, 7, N)}
          {cell(2, 8, K)}{cell(3, 8, K)}{cell(5, 8, K)}
        </g>
      </svg>
      <style>{`
        .pixel-climber .legs-b { display: none; }
        .pixel-climber[data-frame="1"] .legs-a { display: none; }
        .pixel-climber[data-frame="1"] .legs-b { display: block; }
      `}</style>
    </div>
  );
}
