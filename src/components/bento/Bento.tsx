import { Link } from "@tanstack/react-router";
import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "dark" | "accent" | "image" | "stat" | "ghost";

type BaseProps = {
  span?: string;
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

// Each variant defines its OWN foreground via inline CSS var (--tf) so the
// legacy ".text-white { color: var(--on-surface) !important }" override in
// styles.css cannot flip white text into navy ink. We then drive text color
// with `text-[color:var(--tf)]` inside the tile.
const variantStyles: Record<Variant, { bg: string; border: string; fg: string; muted: string }> = {
  neutral: {
    bg: "var(--surface)",
    border: "color-mix(in oklab, var(--on-surface) 10%, transparent)",
    fg: "var(--on-surface)",
    muted: "color-mix(in oklab, var(--on-surface) 65%, transparent)",
  },
  dark: {
    bg: "var(--brand-navy)",
    border: "var(--brand-navy)",
    fg: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
  },
  accent: {
    bg: "var(--signal)",
    border: "var(--anchor-fixed)",
    fg: "var(--anchor-fixed)",
    muted: "color-mix(in oklab, var(--anchor-fixed) 70%, transparent)",
  },
  image: {
    bg: "var(--brand-navy)",
    border: "color-mix(in oklab, var(--on-surface) 10%, transparent)",
    fg: "#ffffff",
    muted: "rgba(255,255,255,0.78)",
  },
  stat: {
    bg: "var(--surface-2)",
    border: "color-mix(in oklab, var(--on-surface) 10%, transparent)",
    fg: "var(--on-surface)",
    muted: "color-mix(in oklab, var(--on-surface) 65%, transparent)",
  },
  ghost: {
    bg: "transparent",
    border: "color-mix(in oklab, var(--on-surface) 18%, transparent)",
    fg: "var(--on-surface)",
    muted: "color-mix(in oklab, var(--on-surface) 60%, transparent)",
  },
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
  const v = variantStyles[variant];

  const tileStyle: CSSProperties = {
    backgroundColor: v.bg,
    borderColor: v.border,
    color: v.fg,
    // expose tokens so children can use them: text-[color:var(--tf)] etc.
    ["--tf" as any]: v.fg,
    ["--tm" as any]: v.muted,
    ...style,
  };

  const inner = (
    <div
      className={cn(
        "group relative overflow-hidden flex flex-col p-4 md:p-6 rounded-[var(--bento-radius,1.25rem)]",
        "border transition-all duration-300 ease-out",
        interactive && "hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(15,27,61,0.45)] cursor-pointer",
        "min-h-[150px] h-full",
        span,
        className,
      )}
      style={tileStyle}
    >
      {image && (
        <>
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {imageOverlay && (
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,27,61,0.78) 0%, rgba(15,27,61,0.55) 55%, rgba(15,27,61,0.25) 100%)",
              }}
            />
          )}
        </>
      )}

      <div className="relative z-[2] flex-1 flex flex-col" style={{ color: v.fg }}>
        {badge && <div className="absolute -top-1 -right-1">{badge}</div>}
        {eyebrow && (
          <div
            className="text-[10px] font-bold uppercase tracking-[0.22em] mb-3"
            style={{ color: variant === "accent" ? v.fg : v.muted }}
          >
            {eyebrow}
          </div>
        )}
        {title && (
          <div className="font-display uppercase leading-[1.05] tracking-tight text-[clamp(0.72rem,3.4vw,0.95rem)] sm:text-base md:text-xl lg:text-2xl mb-2 [overflow-wrap:break-word] hyphens-none">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm leading-relaxed" style={{ color: v.muted }}>
            {description}
          </div>
        )}
        {children}
        {cta && (
          <div className="mt-auto pt-4 text-[11px] font-bold uppercase tracking-[0.22em] inline-flex items-center gap-2">
            <span>{cta}</span>
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
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
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className={cn("block h-full", span)}
      >
        {inner}
      </a>
    );
  }
  return inner;
}

export function BentoGrid({
  children,
  className,
  rows = "auto-rows-[minmax(140px,auto)] md:auto-rows-[minmax(160px,auto)]",
  cols = "grid-cols-2 md:grid-cols-6",
}: {
  children: ReactNode;
  className?: string;
  rows?: string;
  cols?: string;
}) {
  return <div className={cn("grid gap-3 md:gap-4", cols, rows, className)}>{children}</div>;
}
