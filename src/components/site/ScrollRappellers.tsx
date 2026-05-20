import { useEffect, useRef, useState } from "react";

/**
 * Fixed full-viewport overlay with two rappellers that descend as the user
 * scrolls. Page acts like a building facade. Performance:
 * - No React state during scroll. We mutate refs and write to style directly
 *   inside a single rAF, so scrolling never triggers a re-render.
 * - Section sync: we read offsetTop of [data-rappel-anchor] elements and ease
 *   the climbers between those checkpoints so the descent "lands" on hero,
 *   soluciones, contacto, etc.
 * - Mobile: a smaller, subtler variant is rendered (single climber, slimmer
 *   rope, reduced sway) so it stays out of the way on small screens.
 * - User toggle persisted in localStorage; respects prefers-reduced-motion.
 */

const STORAGE_KEY = "kg.rappellers.enabled";

export function ScrollRappellers() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored != null) return stored === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !reduced;
  });

  // Refs to the DOM nodes we mutate every frame
  const leftRopeRef = useRef<HTMLDivElement | null>(null);
  const rightRopeRef = useRef<HTMLDivElement | null>(null);
  const leftClimberRef = useRef<HTMLDivElement | null>(null);
  const rightClimberRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const computeProgress = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;

      // Section sync: find anchors and snap progress to checkpoints so the
      // climbers pause briefly when each section comes into view.
      const anchors = Array.from(
        document.querySelectorAll<HTMLElement>("[data-rappel-anchor]"),
      );
      if (anchors.length >= 2) {
        const points = anchors
          .map((el) => el.offsetTop)
          .sort((a, b) => a - b);
        // Map raw scrollTop to a smoothed value that eases through anchors
        for (let i = 0; i < points.length - 1; i++) {
          const a = points[i];
          const b = points[i + 1];
          if (scrollTop >= a && scrollTop <= b) {
            const segP = (scrollTop - a) / Math.max(1, b - a);
            // ease-in-out cubic for natural settle between checkpoints
            const eased =
              segP < 0.5
                ? 4 * segP * segP * segP
                : 1 - Math.pow(-2 * segP + 2, 3) / 2;
            const startGlobal = a / max;
            const endGlobal = b / max;
            return Math.min(1, Math.max(0, startGlobal + (endGlobal - startGlobal) * eased));
          }
        }
      }
      return Math.min(1, Math.max(0, scrollTop / max));
    };

    const apply = () => {
      rafRef.current = null;
      const p = computeProgress();
      lastProgressRef.current = p;

      const isMobile = window.innerWidth < 768;
      // Vertical range tuned per viewport
      const yL = (isMobile ? 4 : 6) + p * (isMobile ? 84 : 82);
      const offset = Math.sin(p * Math.PI) * (isMobile ? 3 : 6);
      const yR = (isMobile ? 6 : 8) + p * (isMobile ? 82 : 80) + offset;

      const swayMag = isMobile ? 2 : 4;
      const swayL = Math.sin(p * Math.PI * 4) * swayMag;
      const swayR = Math.cos(p * Math.PI * 4) * swayMag;

      if (leftRopeRef.current) {
        leftRopeRef.current.style.height = `${yL}vh`;
      }
      if (rightRopeRef.current) {
        rightRopeRef.current.style.height = `${yR}vh`;
      }
      if (leftClimberRef.current) {
        leftClimberRef.current.style.top = `calc(${yL}vh - 2px)`;
        leftClimberRef.current.style.transform = `translateX(${swayL}px)`;
      }
      if (rightClimberRef.current) {
        rightClimberRef.current.style.top = `calc(${yR}vh - 2px)`;
        rightClimberRef.current.style.transform = `translateX(${-swayR}px)`;
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
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[5]"
          style={{ overflow: "hidden" }}
        >
          {/* Left rope */}
          <div
            ref={leftRopeRef}
            className="absolute top-0"
            style={{
              left: "calc(env(safe-area-inset-left, 0px) + 16px)",
              width: 2,
              height: "6vh",
              background:
                "linear-gradient(to bottom, rgba(245,197,0,0.0) 0%, rgba(245,197,0,0.55) 12%, rgba(245,197,0,0.85) 100%)",
            }}
          />
          <div
            ref={leftClimberRef}
            className="absolute"
            style={{
              left: "calc(env(safe-area-inset-left, 0px) - 4px)",
              top: "6vh",
              willChange: "transform, top",
            }}
          >
            <Climber facing="right" />
          </div>

          {/* Right rope */}
          <div
            ref={rightRopeRef}
            className="absolute top-0"
            style={{
              right: "calc(env(safe-area-inset-right, 0px) + 16px)",
              width: 2,
              height: "8vh",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.45) 12%, rgba(255,255,255,0.8) 100%)",
            }}
          />
          <div
            ref={rightClimberRef}
            className="absolute"
            style={{
              right: "calc(env(safe-area-inset-right, 0px) - 4px)",
              top: "8vh",
              willChange: "transform, top",
            }}
          >
            <Climber facing="left" variant="white" />
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? "Desactivar animación de rappel" : "Activar animación de rappel"}
        title={enabled ? "Desactivar animación" : "Activar animación"}
        className="fixed bottom-4 left-4 z-[40] flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur transition hover:bg-black/80"
      >
        <span className="text-[10px] font-bold tracking-widest uppercase">
          {enabled ? "ON" : "OFF"}
        </span>
      </button>
    </>
  );
}

function Climber({
  facing,
  variant = "signal",
}: {
  facing: "left" | "right";
  variant?: "signal" | "white";
}) {
  const helmet = variant === "signal" ? "#F5C500" : "#FFFFFF";
  const suit = "#0F1B3D";
  const harness = variant === "signal" ? "#FFFFFF" : "#F5C500";
  const skin = "#E8B894";

  // Smaller on mobile, full on md+
  return (
    <div
      style={{
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
      }}
      className="w-[28px] h-[38px] md:w-[42px] md:h-[56px]"
    >
      <svg
        viewBox="0 0 42 56"
        width="100%"
        height="100%"
        style={{ transform: facing === "left" ? "scaleX(-1)" : undefined }}
      >
        <rect x="19" y="0" width="4" height="6" rx="1.5" fill="#C9CDD6" />
        <line x1="21" y1="6" x2="21" y2="16" stroke="#1a1a1a" strokeWidth="1.5" />
        <path d="M11 16 Q21 7 31 16 L31 19 L11 19 Z" fill={helmet} />
        <rect x="11" y="18" width="20" height="2" fill="#0a0a0a" opacity="0.4" />
        <rect x="16" y="19" width="10" height="6" rx="2" fill={skin} />
        <path d="M11 25 L31 25 L29 41 L13 41 Z" fill={suit} />
        <rect x="13" y="32" width="16" height="2" fill={harness} opacity="0.9" />
        <rect x="20" y="25" width="2" height="16" fill={harness} opacity="0.85" />
        <path d="M11 26 Q6 22 9 16 L11 16 Q10 22 13 26 Z" fill={suit} />
        <path d="M31 26 L34 36 L31 38 L29 30 Z" fill={suit} />
        <path d="M13 41 L10 54 L14 54 L17 44 Z" fill={suit} />
        <path d="M29 41 L33 53 L29 54 L25 44 Z" fill={suit} />
        <rect x="9" y="52" width="6" height="3" rx="1" fill="#0a0a0a" />
        <rect x="27" y="52" width="6" height="3" rx="1" fill="#0a0a0a" />
      </svg>
    </div>
  );
}
