import { useEffect, useRef, useState } from "react";

/**
 * Subtle 8-bit rappeller that descends as the user scrolls. Pure pixel art
 * (no anti-aliased SVG curves), single climber on the right gutter, thin
 * dashed rope. Mutates DOM via refs in a single rAF — no re-renders during
 * scroll. Toggle persisted in localStorage; respects prefers-reduced-motion.
 */

const STORAGE_KEY = "kg.rappellers.enabled";
const PX = 3; // size of a "pixel" cell

export function ScrollRappellers() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored != null) return stored === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !reduced;
  });

  const ropeRef = useRef<HTMLDivElement | null>(null);
  const climberRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef(0);

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
              segP < 0.5
                ? 4 * segP * segP * segP
                : 1 - Math.pow(-2 * segP + 2, 3) / 2;
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
      // Range: 5vh → 90vh
      const y = 5 + p * 85;
      // Two-frame leg shuffle keyed to scroll position (every ~3vh)
      const frame = Math.floor(p * 30) % 2;

      if (ropeRef.current) {
        ropeRef.current.style.height = `${y}vh`;
      }
      if (climberRef.current) {
        climberRef.current.style.top = `calc(${y}vh - ${PX * 2}px)`;
        climberRef.current.dataset.frame = String(frame);
      }
      tickRef.current++;
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
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[5]"
          style={{ overflow: "hidden" }}
        >
          {/* Dashed rope */}
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
              opacity: 0.55,
            }}
          />
          {/* Climber */}
          <div
            ref={climberRef}
            className="absolute"
            style={{
              right: "calc(env(safe-area-inset-right, 0px) + 4px)",
              top: "5vh",
              willChange: "top",
              opacity: 0.85,
            }}
          >
            <PixelClimber />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? "Desactivar animación" : "Activar animación"}
        title={enabled ? "Desactivar animación" : "Activar animación"}
        className="fixed bottom-4 left-4 z-[40] flex h-7 items-center justify-center rounded-sm border border-white/15 bg-black/50 px-2 text-[9px] font-bold uppercase tracking-widest text-white/80 shadow backdrop-blur transition hover:bg-black/70"
      >
        FX {enabled ? "ON" : "OFF"}
      </button>
    </>
  );
}

/**
 * 8-bit climber, 7 cells wide × 9 cells tall. Two leg frames swap based on
 * data-frame attribute mutated on the parent — CSS handles the switch so
 * React never re-renders.
 */
function PixelClimber() {
  const Y = "#F5C500"; // helmet / accent
  const N = "#0F1B3D"; // navy suit
  const W = "#FFFFFF"; // harness highlight
  const S = "#E8B894"; // skin
  const K = "#0A0A0A"; // outline / boots

  const cell = (x: number, y: number, color: string) => (
    <rect key={`${x}-${y}-${color}`} x={x * PX} y={y * PX} width={PX} height={PX} fill={color} />
  );

  // Shared body (rows 0-6): helmet, head, torso, harness, arms
  const body = (
    <>
      {/* Row 0: helmet top */}
      {cell(2, 0, Y)}
      {cell(3, 0, Y)}
      {cell(4, 0, Y)}
      {/* Row 1: helmet */}
      {cell(1, 1, Y)}
      {cell(2, 1, Y)}
      {cell(3, 1, Y)}
      {cell(4, 1, Y)}
      {cell(5, 1, Y)}
      {/* Row 2: helmet brim shadow + face */}
      {cell(1, 2, K)}
      {cell(2, 2, S)}
      {cell(3, 2, S)}
      {cell(4, 2, S)}
      {cell(5, 2, K)}
      {/* Row 3: shoulders + rope grip arm */}
      {cell(1, 3, N)}
      {cell(2, 3, N)}
      {cell(3, 3, N)}
      {cell(4, 3, N)}
      {cell(5, 3, N)}
      {cell(6, 3, N) /* arm reaching to rope */}
      {/* Row 4: torso with harness stripe */}
      {cell(1, 4, N)}
      {cell(2, 4, W)}
      {cell(3, 4, W)}
      {cell(4, 4, W)}
      {cell(5, 4, N)}
      {cell(6, 4, N)}
      {/* Row 5: torso */}
      {cell(1, 5, N)}
      {cell(2, 5, N)}
      {cell(3, 5, N)}
      {cell(4, 5, N)}
      {cell(5, 5, N)}
      {/* Row 6: hips */}
      {cell(2, 6, N)}
      {cell(3, 6, N)}
      {cell(4, 6, N)}
    </>
  );

  return (
    <div
      data-frame="0"
      className="pixel-climber"
      style={{
        width: 7 * PX,
        height: 9 * PX,
        imageRendering: "pixelated",
        filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.4))",
      }}
    >
      <svg
        width={7 * PX}
        height={9 * PX}
        viewBox={`0 0 ${7 * PX} ${9 * PX}`}
        shapeRendering="crispEdges"
      >
        {body}
        {/* Frame A legs */}
        <g className="legs-a">
          {cell(2, 7, N)}
          {cell(4, 7, N)}
          {cell(1, 8, K)}
          {cell(2, 8, K)}
          {cell(4, 8, K)}
          {cell(5, 8, K)}
        </g>
        {/* Frame B legs (one tucked) */}
        <g className="legs-b">
          {cell(3, 7, N)}
          {cell(4, 7, N)}
          {cell(2, 8, K)}
          {cell(3, 8, K)}
          {cell(5, 8, K)}
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
