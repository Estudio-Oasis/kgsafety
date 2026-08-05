import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

type Result = { resumen: string; generadoAt: string };

/**
 * Panel reutilizable de resumen con IA: convierte datos técnicos en lenguaje de negocio.
 */
export function AiSummaryPanel({
  titulo = "Resumen con IA",
  descripcion = "Traduce los datos técnicos de esta pantalla a lenguaje claro para dirección.",
  run,
  tone = "dark",
}: {
  titulo?: string;
  descripcion?: string;
  run: () => Promise<Result>;
  tone?: "dark" | "light";
}) {
  const [data, setData] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dark = tone === "dark";
  const shell = dark
    ? "border-white/10 bg-white/[0.02]"
    : "border-[color:var(--border)] bg-[color:var(--surface)]";
  const head = dark ? "text-white" : "text-[color:var(--on-surface)]";
  const sub = dark ? "text-white/60" : "text-[color:var(--muted-fg)]";
  const body = dark ? "text-white/85" : "text-[color:var(--on-surface)]";

  async function generar() {
    setBusy(true);
    setError(null);
    try {
      setData(await run());
    } catch (e) {
      setError(e instanceof Error ? e.message : "No fue posible generar el resumen");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={`border ${shell} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className={`font-display text-base uppercase ${head} flex items-center gap-2`}>
            <Sparkles size={15} className="text-signal shrink-0" /> {titulo}
          </h2>
          <p className={`text-xs mt-1.5 max-w-xl ${sub}`}>{descripcion}</p>
        </div>
        <button
          type="button"
          onClick={() => void generar()}
          disabled={busy}
          className="bg-signal text-[color:var(--anchor-fixed)] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
        >
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          {data ? "Actualizar resumen" : "Generar resumen"}
        </button>
      </div>

      {error && <p className="mt-4 text-xs text-red-400">{error}</p>}

      {data && (
        <div className="mt-4">
          <div className={`text-sm leading-relaxed space-y-1.5 ${body}`}>
            {data.resumen
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean)
              .map((linea, i) => (
                <p key={i} className={linea.startsWith("-") || linea.startsWith("•") ? "pl-4" : ""}>
                  {renderInline(linea.replace(/^[-•]\s*/, linea.match(/^[-•]/) ? "· " : ""))}
                </p>
              ))}
          </div>
          <p className={`mt-3 text-[10px] uppercase tracking-widest ${sub}`}>
            Generado {new Date(data.generadoAt).toLocaleString("es-MX")} · revisa siempre los datos de
            origen antes de decidir
          </p>
        </div>
      )}
    </section>
  );
}

/** Convierte **negritas** de markdown simple en elementos React. */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-bold">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
