import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** dirección de entrada */
  from?: "up" | "left" | "right" | "scale";
  as?: "div" | "section" | "article" | "li" | "span";
};

/**
 * Revela contenido al entrar en viewport (IntersectionObserver).
 * SSR-safe: el contenido se renderiza siempre; sólo cambia la animación.
 */
export function Reveal({ children, className = "", delay = 0, from = "up", as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref as never}
      data-shown={shown ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
      className={`lp-reveal lp-reveal--${from} ${className}`}
    >
      {children}
    </Tag>
  );
}
