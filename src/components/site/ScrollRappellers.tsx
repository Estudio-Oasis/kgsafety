import { useEffect, useRef, useState } from "react";

/**
 * Fixed full-viewport overlay with two rappellers that descend as the user
 * scrolls. The page acts like a building facade: ropes hang from the top,
 * climbers slide down along the gutters. Pointer-events disabled so it never
 * intercepts clicks. Respects prefers-reduced-motion.
 */
export function ScrollRappellers() {
  const [progress, setProgress] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setEnabled(false);
      return;
    }
    const onScroll = () => {
      if (raf.current != null) return;
      raf.current = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        setProgress(p);
        raf.current = null;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!enabled) return null;

  // Climber vertical position: from ~6% of viewport down to ~88%
  const yLeft = 6 + progress * 82;
  // Right climber slightly offset so they don't mirror exactly
  const offset = Math.sin(progress * Math.PI) * 6;
  const yRight = 8 + progress * 80 + offset;
  // Subtle sway based on scroll velocity proxy (progress fractional)
  const swayL = Math.sin(progress * Math.PI * 4) * 4;
  const swayR = Math.cos(progress * Math.PI * 4) * 4;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] hidden md:block"
      style={{ overflow: "hidden" }}
    >
      {/* Left rope */}
      <div
        className="absolute top-0"
        style={{
          left: "calc(env(safe-area-inset-left, 0px) + 28px)",
          width: 2,
          height: `${yLeft}vh`,
          background:
            "linear-gradient(to bottom, rgba(245,197,0,0.0) 0%, rgba(245,197,0,0.55) 12%, rgba(245,197,0,0.85) 100%)",
        }}
      />
      <Climber
        sideStyle={{
          left: "calc(env(safe-area-inset-left, 0px) + 8px)",
          top: `calc(${yLeft}vh - 2px)`,
          transform: `translateX(${swayL}px)`,
        }}
        facing="right"
      />

      {/* Right rope */}
      <div
        className="absolute top-0"
        style={{
          right: "calc(env(safe-area-inset-right, 0px) + 28px)",
          width: 2,
          height: `${yRight}vh`,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.45) 12%, rgba(255,255,255,0.8) 100%)",
        }}
      />
      <Climber
        sideStyle={{
          right: "calc(env(safe-area-inset-right, 0px) + 8px)",
          top: `calc(${yRight}vh - 2px)`,
          transform: `translateX(${-swayR}px)`,
        }}
        facing="left"
        variant="white"
      />
    </div>
  );
}

function Climber({
  sideStyle,
  facing,
  variant = "signal",
}: {
  sideStyle: React.CSSProperties;
  facing: "left" | "right";
  variant?: "signal" | "white";
}) {
  // Brand colors
  const helmet = variant === "signal" ? "#F5C500" : "#FFFFFF";
  const suit = "#0F1B3D"; // brand navy
  const harness = variant === "signal" ? "#FFFFFF" : "#F5C500";
  const skin = "#E8B894";

  return (
    <div
      className="absolute"
      style={{
        width: 42,
        height: 56,
        ...sideStyle,
        transition: "transform 120ms linear",
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
      }}
    >
      <svg
        viewBox="0 0 42 56"
        width={42}
        height={56}
        style={{ transform: facing === "left" ? "scaleX(-1)" : undefined }}
      >
        {/* Carabiner / connection to rope */}
        <rect x="19" y="0" width="4" height="6" rx="1.5" fill="#C9CDD6" />
        {/* Webbing from rope to harness */}
        <line x1="21" y1="6" x2="21" y2="16" stroke="#1a1a1a" strokeWidth="1.5" />

        {/* Helmet */}
        <path d="M11 16 Q21 7 31 16 L31 19 L11 19 Z" fill={helmet} />
        <rect x="11" y="18" width="20" height="2" fill="#0a0a0a" opacity="0.4" />

        {/* Head / face */}
        <rect x="16" y="19" width="10" height="6" rx="2" fill={skin} />

        {/* Torso (jacket) */}
        <path d="M11 25 L31 25 L29 41 L13 41 Z" fill={suit} />
        {/* Reflective stripe */}
        <rect x="13" y="32" width="16" height="2" fill={harness} opacity="0.9" />
        {/* Harness vertical strap */}
        <rect x="20" y="25" width="2" height="16" fill={harness} opacity="0.85" />

        {/* Arms (one gripping rope above) */}
        <path
          d="M11 26 Q6 22 9 16 L11 16 Q10 22 13 26 Z"
          fill={suit}
        />
        <path d="M31 26 L34 36 L31 38 L29 30 Z" fill={suit} />

        {/* Legs — bent, pushing off wall */}
        <path d="M13 41 L10 54 L14 54 L17 44 Z" fill={suit} />
        <path d="M29 41 L33 53 L29 54 L25 44 Z" fill={suit} />
        {/* Boots */}
        <rect x="9" y="52" width="6" height="3" rx="1" fill="#0a0a0a" />
        <rect x="27" y="52" width="6" height="3" rx="1" fill="#0a0a0a" />
      </svg>
    </div>
  );
}
