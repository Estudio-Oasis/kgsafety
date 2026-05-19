import { Link } from "@tanstack/react-router";
import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "dark" | "accent" | "image" | "stat" | "ghost";

type BaseProps = {
  span?: string; // tailwind grid span classes e.g. "md:col-span-3 md:row-span-2"
  variant?: Variant;
  image?: string;
  imageAlt?: string;
  imageOverlay?: boolean;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  cta?: ReactNode;
  badge?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

type TileProps =
  | (BaseProps & { to: string; href?: never; params?: Record<string, string> })
  | (BaseProps & { href: string; to?: never })
  | (BaseProps & { to?: undefined; href?: undefined });

const variantClasses: Record<Variant, string> = {
  neutral: "bg-[color:var(--surface)] text-[color:var(--on-surface)] border border-[color:var(--border)]",
  dark: "bg-brand-navy text-white border border-brand-navy",
  accent: "bg-signal text-[color:var(--anchor-fixed)] border-2 border-[color:var(--anchor-fixed)]",
  image: "text-white border border-[color:var(--border)] bg-brand-navy",
  stat: "bg-[color:var(--surface-2)] text-[color:var(--on-surface)] border border-[color:var(--border)]",
  ghost: "bg-transparent text-[color:var(--on-surface)] border border-dashed border-[color:var(--border)]",
};

export function BentoTile(props: TileProps) {
  const {
    span = "",
    variant = "neutral",
    image,
    imageAlt = "",
    imageOverlay = true,
    eyebrow,
    title,
    description,
    cta,
    badge,
    className,
    style,
    children,
  } = props;

  const isLinkInternal = "to" in props && props.to;
  const isLinkExternal = "href" in props && props.href;
  const interactive = Boolean(isLinkInternal || isLinkExternal);

  const inner = (
    <div
      className={cn(
        "relative overflow-hidden flex flex-col p-5 md:p-7 rounded-[var(--bento-radius,1.25rem)] transition-all duration-200",
        variantClasses[variant],
        interactive && "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_var(--brand-navy)] cursor-pointer",
        "min-h-[140px] h-full",
        span,
        className,
      )}
      style={style}
    >
      {image && (
        <>
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover -z-0"
          />
          {imageOverlay && (
            <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-[color:var(--anchor-fixed)]/85 via-[color:var(--anchor-fixed)]/55 to-transparent" />
          )}
        </>
      )}

      <div className="relative flex-1 flex flex-col">
        {badge && <div className="absolute top-0 right-0">{badge}</div>}
        {eyebrow && (
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-80 mb-3">
            {eyebrow}
          </div>
        )}
        {title && (
          <div className="font-display uppercase leading-tight tracking-tight text-xl md:text-2xl mb-2">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm opacity-80 leading-relaxed">{description}</div>
        )}
        {children}
        {cta && (
          <div className="mt-auto pt-4 text-[11px] font-bold uppercase tracking-[0.22em] inline-flex items-center gap-2">
            {cta} <span aria-hidden>→</span>
          </div>
        )}
      </div>
    </div>
  );

  if (isLinkInternal) {
    const { to, params } = props as { to: string; params?: any };
    return (
      <Link to={to} params={params} className={cn("block h-full", span)}>
        {inner}
      </Link>
    );
  }
  if (isLinkExternal) {
    const { href } = props as { href: string };
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cn("block h-full", span)}>
        {inner}
      </a>
    );
  }
  return inner;
}

export function BentoGrid({
  children,
  className,
  rows = "auto-rows-[minmax(120px,auto)] md:auto-rows-[minmax(150px,auto)]",
  cols = "grid-cols-2 md:grid-cols-6",
}: {
  children: ReactNode;
  className?: string;
  rows?: string;
  cols?: string;
}) {
  return (
    <div className={cn("grid gap-3 md:gap-4", cols, rows, className)}>
      {children}
    </div>
  );
}
