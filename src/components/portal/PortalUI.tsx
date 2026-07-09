import { ReactNode } from "react";
import { toast } from "sonner";
import type { CertState, ProjectStatus } from "@/data/portal";

export function StatusBadge({
  state,
  label,
}: {
  state: CertState | ProjectStatus | "default";
  label: string;
}) {
  const styles: Record<string, string> = {
    vigente: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    completado: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    "por-vencer-60": "bg-amber-400/15 text-amber-700 dark:text-amber-300 border-amber-400/30",
    "por-vencer-30": "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
    "en-curso": "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    revision: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    vencido: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
    pendiente: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/30",
    default: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
        styles[state] ?? styles.default
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "neutral" | "danger" | "warn" | "ok";
}) {
  const tones: Record<string, string> = {
    neutral: "border-[color:var(--border)]",
    danger: "border-red-500/50",
    warn: "border-amber-400/50",
    ok: "border-emerald-500/50",
  };
  return (
    <div className={`bg-[color:var(--surface)] border ${tones[tone]} p-4 md:p-5 min-w-0`}>
      <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-2 truncate">{label}</p>
      <p
        className="font-display text-[color:var(--on-surface)] leading-none whitespace-nowrap [text-wrap:balance]"
        style={{ fontSize: "clamp(1.25rem, 4.2vw, 1.875rem)" }}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-[color:var(--muted-fg)]">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="bg-[color:var(--surface)] border border-[color:var(--border)]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--border)]">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface)]">{title}</h2>
        {action}
      </header>
      <div className="p-0">{children}</div>
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-2">{eyebrow}</p>
        )}
        <h1 className="font-display text-2xl md:text-3xl uppercase text-[color:var(--on-surface)]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[color:var(--muted-fg)] max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function simAction(label = "Acción simulada — prototipo") {
  toast(label, { description: "En producción esto descargaría el archivo / ejecutaría la acción real." });
}

export function ActionBtn({
  children,
  onClick,
  variant = "ghost",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "primary";
  title?: string;
}) {
  const base =
    variant === "primary"
      ? "bg-signal text-[color:var(--anchor-fixed)] border-[color:var(--anchor-fixed)] hover:bg-white"
      : "bg-transparent text-[color:var(--on-surface)] border-[color:var(--border)] hover:border-brand-blue hover:text-brand-blue";
  return (
    <button
      type="button"
      title={title}
      onClick={onClick ?? (() => simAction())}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors ${base}`}
    >
      {children}
    </button>
  );
}

export function MetaCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="bg-[color:var(--surface)] border border-[color:var(--border)] p-4">
      <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1">{label}</p>
      <p className="text-sm font-bold text-[color:var(--on-surface)] leading-snug">{value}</p>
      {hint && <p className="text-[11px] text-[color:var(--muted-fg)] mt-1">{hint}</p>}
    </div>
  );
}

export function NoAccess({ title = "Sin acceso", message }: { title?: string; message: string }) {
  return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <p className="text-xs uppercase tracking-widest text-red-500 mb-2">Acceso restringido</p>
      <h1 className="font-display text-2xl uppercase">{title}</h1>
      <p className="mt-3 text-sm text-[color:var(--muted-fg)]">{message}</p>
    </div>
  );
}

