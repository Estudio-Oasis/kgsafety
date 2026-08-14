import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw, ScrollText } from "lucide-react";
import { usePortalSession } from "@/hooks/use-portal-session";
import { StatCard } from "@/components/portal/PortalUI";
import {
  listarBitacora,
  listarExcepciones,
  type BitacoraRow,
  type ExcepcionRow,
} from "@/lib/erp-conciliacion.functions";

export const Route = createFileRoute("/portal/conciliacion")({
  component: ConciliacionPage,
  head: () => ({
    meta: [
      { title: "Conciliación y bitácora · Portal KG Safety" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Excepciones de la migración del ERP y bitácora de cambios de la base de KG Safety.",
      },
      { property: "og:title", content: "Conciliación y bitácora · Portal KG Safety" },
      {
        property: "og:description",
        content: "Revisión humana de excepciones históricas y trazabilidad de cambios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const SEVERIDAD_ORDEN: Record<string, number> = { alta: 0, media: 1, baja: 2 };

const CATEGORIA_LABEL: Record<string, string> = {
  folio_duplicado: "Folio de cotización duplicado",
  solicitud_sin_cliente: "Solicitud sin cliente",
  cotizacion_sin_partidas: "Cotización sin partidas",
  cotizacion_sin_solicitud: "Cotización sin solicitud",
  cotizacion_en_cero: "Cotización en cero",
  partida_invalida: "Partida con cantidad o precio inválido",
  cliente_sin_rfc: "Cliente sin RFC",
  cliente_sin_contacto: "Cliente sin contacto",
  participante_duplicado: "Participante duplicado (CURP)",
  participante_sin_curp: "Participante sin CURP",
  sesion_sin_instructor: "Sesión sin instructor",
  sesion_sin_curso: "Sesión sin curso del catálogo",
  inscripcion_sin_evaluacion: "Inscripción sin evaluación",
  dc3_pendiente: "DC-3 pendiente de generar",
  orden_sin_cotizacion: "Orden sin cotización",
  viatico_sin_instructor: "Viático sin instructor",
};

const ACCION_LABEL: Record<string, string> = {
  INSERT: "Alta",
  UPDATE: "Cambio",
  DELETE: "Baja",
};

function SeverityBadge({ severidad }: { severidad: string }) {
  const cls =
    severidad === "alta"
      ? "bg-destructive/10 text-destructive border-destructive/30"
      : severidad === "media"
        ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
        : "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {severidad}
    </span>
  );
}

function ConciliacionPage() {
  const { session } = usePortalSession();
  const allowed = session?.role === "admin-kg" || session?.role === "equipo-kg";

  const [loading, setLoading] = useState(true);
  const [excepciones, setExcepciones] = useState<ExcepcionRow[]>([]);
  const [bitacora, setBitacora] = useState<BitacoraRow[]>([]);
  const [categoria, setCategoria] = useState<string>("todas");

  const load = useCallback(async () => {
    if (!allowed) return;
    setLoading(true);
    try {
      const [ex, bi] = await Promise.all([listarExcepciones(), listarBitacora({ data: { limite: 100 } })]);
      setExcepciones(ex);
      setBitacora(bi);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No fue posible cargar la conciliación");
    } finally {
      setLoading(false);
    }
  }, [allowed]);

  useEffect(() => {
    void load();
  }, [load]);

  const resumen = useMemo(() => {
    const porSeveridad = { alta: 0, media: 0, baja: 0 } as Record<string, number>;
    const porCategoria = new Map<string, number>();
    for (const e of excepciones) {
      porSeveridad[e.severidad] = (porSeveridad[e.severidad] ?? 0) + 1;
      porCategoria.set(e.categoria, (porCategoria.get(e.categoria) ?? 0) + 1);
    }
    return {
      total: excepciones.length,
      porSeveridad,
      categorias: [...porCategoria.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [excepciones]);

  const filtradas = useMemo(() => {
    const rows = categoria === "todas" ? excepciones : excepciones.filter((e) => e.categoria === categoria);
    return [...rows].sort(
      (a, b) =>
        (SEVERIDAD_ORDEN[a.severidad] ?? 9) - (SEVERIDAD_ORDEN[b.severidad] ?? 9) ||
        a.categoria.localeCompare(b.categoria),
    );
  }, [excepciones, categoria]);

  if (!allowed) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-lg font-semibold">Acceso restringido</h1>
        <p className="mt-2 text-sm text-muted-foreground">Esta sección es exclusiva del equipo KG Safety.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 text-primary" aria-hidden="true" />
            Conciliación y bitácora
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Excepciones detectadas en la información migrada del ERP anterior. No se corrigen de forma automática:
            se listan para revisión humana. Abajo, la bitácora de cambios de nuestra base.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
          Actualizar
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Excepciones totales" value={String(resumen.total)} />
        <StatCard label="Severidad alta" value={String(resumen.porSeveridad["alta"] ?? 0)} />
        <StatCard label="Severidad media" value={String(resumen.porSeveridad["media"] ?? 0)} />
        <StatCard label="Severidad baja" value={String(resumen.porSeveridad["baja"] ?? 0)} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategoria("todas")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            categoria === "todas"
              ? "bg-primary text-primary-foreground"
              : "border border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          Todas ({resumen.total})
        </button>
        {resumen.categorias.map(([cat, n]) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoria(cat)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              categoria === cat
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {CATEGORIA_LABEL[cat] ?? cat} ({n})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Severidad</th>
              <th className="px-3 py-2 text-left font-semibold">Excepción</th>
              <th className="px-3 py-2 text-left font-semibold">Entidad</th>
              <th className="px-3 py-2 text-left font-semibold">Folio / clave</th>
              <th className="px-3 py-2 text-left font-semibold">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtradas.map((e, i) => (
              <tr key={`${e.categoria}-${e.registro_id}-${i}`}>
                <td className="px-3 py-2">
                  <SeverityBadge severidad={e.severidad} />
                </td>
                <td className="px-3 py-2 font-medium">{CATEGORIA_LABEL[e.categoria] ?? e.categoria}</td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{e.entidad}</td>
                <td className="px-3 py-2">{e.folio || "—"}</td>
                <td className="px-3 py-2 text-muted-foreground">{e.detalle}</td>
              </tr>
            ))}
            {!loading && filtradas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Sin excepciones en esta categoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ScrollText className="h-5 w-5 text-primary" aria-hidden="true" />
          Bitácora de cambios (últimos 100)
        </h2>
        <p className="text-sm text-muted-foreground">
          Cada alta, cambio o baja en clientes, cotizaciones, órdenes, sesiones, participantes, DC-3 y catálogos
          queda registrada automáticamente en nuestra base.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Fecha</th>
                <th className="px-3 py-2 text-left font-semibold">Acción</th>
                <th className="px-3 py-2 text-left font-semibold">Tabla</th>
                <th className="px-3 py-2 text-left font-semibold">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bitacora.map((b) => (
                <tr key={b.id}>
                  <td className="px-3 py-2">
                    {new Date(b.occurred_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td className="px-3 py-2 font-medium">{ACCION_LABEL[b.action] ?? b.action}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{b.table_name}</td>
                  <td className="px-3 py-2 font-mono text-xs">{b.record_id ?? "—"}</td>
                </tr>
              ))}
              {!loading && bitacora.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Aún no hay movimientos registrados. La bitácora empieza a llenarse con el primer cambio hecho
                    desde la plataforma.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {loading && <p className="text-sm text-muted-foreground">Cargando conciliación…</p>}
    </div>
  );
}
