import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Database, RefreshCw, Search } from "lucide-react";
import { usePortalSession } from "@/hooks/use-portal-session";
import { StatCard } from "@/components/portal/PortalUI";
import {
  erpKgClients,
  erpKgCourses,
  erpKgParticipants,
  erpKgQuotes,
  erpKgRequests,
  erpKgStats,
  type ErpClientRow,
  type ErpCourseRow,
  type ErpKgStats,
  type ErpParticipantRow,
  type ErpQuoteRow,
  type ErpRequestRow,
} from "@/lib/erpkg.functions";

export const Route = createFileRoute("/portal/erp-kg")({
  component: ErpKgPage,
  head: () => ({
    meta: [
      { title: "ERP KG · Portal KG Safety" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Datos operativos propios de KG Safety migrados desde el ERP anterior." },
      { property: "og:title", content: "ERP KG · Portal KG Safety" },
      { property: "og:description", content: "Clientes, cursos, solicitudes y cotizaciones en la base propia de KG Safety." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type TabKey = "clientes" | "cursos" | "solicitudes" | "cotizaciones" | "participantes";

const TABS: { key: TabKey; label: string }[] = [
  { key: "clientes", label: "Clientes" },
  { key: "cursos", label: "Cursos y precios" },
  { key: "solicitudes", label: "Solicitudes" },
  { key: "cotizaciones", label: "Cotizaciones" },
  { key: "participantes", label: "Participantes" },
];

const money = (v: number | null | undefined) =>
  v === null || v === undefined
    ? "—"
    : new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 }).format(Number(v));

const dash = (v: string | number | null | undefined) =>
  v === null || v === undefined || v === "" ? "—" : String(v);

const fmtDate = (v: string | null) =>
  v ? new Date(`${v}T00:00:00`).toLocaleDateString("es-MX", { dateStyle: "medium" }) : "—";

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

function ErpKgPage() {
  const { session } = usePortalSession();
  const allowed = session?.role === "admin-kg" || session?.role === "equipo-kg";

  const [tab, setTab] = useState<TabKey>("clientes");
  const [buscar, setBuscar] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ErpKgStats | null>(null);
  const [clients, setClients] = useState<ErpClientRow[]>([]);
  const [courses, setCourses] = useState<ErpCourseRow[]>([]);
  const [requests, setRequests] = useState<ErpRequestRow[]>([]);
  const [quotes, setQuotes] = useState<ErpQuoteRow[]>([]);
  const [participants, setParticipants] = useState<ErpParticipantRow[]>([]);

  const load = useCallback(async () => {
    if (!allowed) return;
    setLoading(true);
    try {
      const [s, c, cu, r, q, p] = await Promise.all([
        erpKgStats(),
        erpKgClients({ data: { buscar: buscar || undefined } }),
        erpKgCourses({ data: { buscar: buscar || undefined } }),
        erpKgRequests(),
        erpKgQuotes(),
        erpKgParticipants(),
      ]);
      setStats(s);
      setClients(c);
      setCourses(cu);
      setRequests(r);
      setQuotes(q);
      setParticipants(p);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No fue posible cargar el ERP KG");
    } finally {
      setLoading(false);
    }
  }, [allowed, buscar]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!allowed) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-lg font-semibold">Acceso restringido</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta sección es exclusiva del equipo KG Safety.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <Database className="h-5 w-5 text-primary" aria-hidden="true" />
            ERP KG Safety
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Información operativa que antes vivía únicamente en el ERP externo y ahora es propiedad de KG Safety:
            clientes, cursos, solicitudes, cotizaciones y participantes con su registro original conservado.
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
        <StatCard label="Clientes" value={String(stats?.clients ?? "—")} />
        <StatCard label="Cursos" value={String(stats?.courses ?? "—")} />
        <StatCard label="Cotizaciones" value={String(stats?.quotes ?? "—")} />
        <StatCard label="Monto cotizado" value={stats ? money(stats.quotedTotal) : "—"} />
        <StatCard label="Solicitudes" value={String(stats?.requests ?? "—")} />
        <StatCard label="Participantes" value={String(stats?.participants ?? "—")} />
        <StatCard label="Inscripciones" value={String(stats?.enrollments ?? "—")} />
        <StatCard label="Proveedores" value={String(stats?.suppliers ?? "—")} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Buscar en clientes y cursos</span>
          <input
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder="Buscar cliente, RFC o curso"
            className="w-56 bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      {tab === "clientes" && (
        <Table head={["Cliente", "Razón social", "RFC", "Contacto", "Ubicación", "Estatus"]}>
          {clients.map((c) => (
            <tr key={c.id}>
              <td className="px-3 py-2 font-medium">{dash(c.commercial_name)}</td>
              <td className="px-3 py-2 text-muted-foreground">{dash(c.legal_name)}</td>
              <td className="px-3 py-2">{dash(c.tax_id)}</td>
              <td className="px-3 py-2 text-muted-foreground">
                {dash(c.email)}
                <br />
                {dash(c.phone)}
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {dash(c.city)}
                {c.state ? `, ${c.state}` : ""}
              </td>
              <td className="px-3 py-2">{c.active ? "Activo" : "Inactivo"}</td>
            </tr>
          ))}
        </Table>
      )}

      {tab === "cursos" && (
        <Table head={["Curso", "Clave", "Duración", "Precio local", "Precio foráneo", "Web"]}>
          {courses.map((c) => (
            <tr key={c.id}>
              <td className="px-3 py-2 font-medium">{c.name}</td>
              <td className="px-3 py-2 text-muted-foreground">{dash(c.code)}</td>
              <td className="px-3 py-2">{dash(c.duration_text_legacy)}</td>
              <td className="px-3 py-2">{money(c.local_unit_price)}</td>
              <td className="px-3 py-2">{money(c.travel_unit_price)}</td>
              <td className="px-3 py-2">{c.visible_on_web ? "Sí" : "No"}</td>
            </tr>
          ))}
        </Table>
      )}

      {tab === "solicitudes" && (
        <Table head={["Folio", "Fecha", "Participantes", "Modalidad", "Lugar", "Contacto", "Estatus"]}>
          {requests.map((r) => (
            <tr key={r.id}>
              <td className="px-3 py-2 font-medium">{dash(r.code)}</td>
              <td className="px-3 py-2">{fmtDate(r.request_date)}</td>
              <td className="px-3 py-2">{dash(r.participant_count)}</td>
              <td className="px-3 py-2 text-muted-foreground">
                {dash(r.delivery_type)} · {dash(r.travel_mode)}
              </td>
              <td className="px-3 py-2">{dash(r.location)}</td>
              <td className="px-3 py-2 text-muted-foreground">{dash(r.contact_email)}</td>
              <td className="px-3 py-2">{dash(r.status)}</td>
            </tr>
          ))}
        </Table>
      )}

      {tab === "cotizaciones" && (
        <Table head={["Folio", "Fecha", "Vigencia", "Origen", "Lugar", "Subtotal", "Total", "Estatus"]}>
          {quotes.map((q) => (
            <tr key={q.id}>
              <td className="px-3 py-2 font-medium">{dash(q.code)}</td>
              <td className="px-3 py-2">{fmtDate(q.quote_date)}</td>
              <td className="px-3 py-2">{fmtDate(q.valid_until)}</td>
              <td className="px-3 py-2 text-muted-foreground">{dash(q.origin)}</td>
              <td className="px-3 py-2">{dash(q.location)}</td>
              <td className="px-3 py-2">{money(q.subtotal)}</td>
              <td className="px-3 py-2 font-semibold">{money(q.total)}</td>
              <td className="px-3 py-2">{dash(q.status)}</td>
            </tr>
          ))}
        </Table>
      )}

      {tab === "participantes" && (
        <Table head={["Participante", "CURP", "Puesto", "Empresa", "RFC empresa"]}>
          {participants.map((p) => (
            <tr key={p.id}>
              <td className="px-3 py-2 font-medium">
                {[p.given_names, p.paternal_surname, p.maternal_surname].filter(Boolean).join(" ") || "—"}
              </td>
              <td className="px-3 py-2 font-mono text-xs">{dash(p.curp)}</td>
              <td className="px-3 py-2">{dash(p.position)}</td>
              <td className="px-3 py-2 text-muted-foreground">{dash(p.employer_commercial_name)}</td>
              <td className="px-3 py-2">{dash(p.employer_tax_id)}</td>
            </tr>
          ))}
        </Table>
      )}

      {loading && <p className="text-sm text-muted-foreground">Cargando datos del ERP KG…</p>}
    </div>
  );
}
