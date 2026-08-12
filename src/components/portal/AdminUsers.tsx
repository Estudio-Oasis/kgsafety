import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, X, Loader2, RefreshCw, UserPlus, Copy } from "lucide-react";
import { toast } from "sonner";
import { Panel, ActionBtn, StatusBadge } from "@/components/portal/PortalUI";
import {
  listPortalUsers,
  listCompanyOptions,
  setPortalUserAccess,
  invitePortalUser,
  type InviteResult,
  type PortalUser,
} from "@/lib/portal.functions";

type RoleValue = "admin_kg" | "equipo_kg" | "cliente_corp" | "cliente_planta";

const ROLE_LABEL: Record<RoleValue, string> = {
  admin_kg: "Admin KG Safety",
  equipo_kg: "Equipo KG Safety",
  cliente_corp: "Cliente corporativo",
  cliente_planta: "Cliente planta",
};

function InviteForm({
  companies,
  onDone,
}: {
  companies: { slug: string; name: string }[];
  onDone: () => void;
}) {
  const invite = useServerFn(invitePortalUser);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<RoleValue>("equipo_kg");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<InviteResult | null>(null);
  const isClient = role === "cliente_corp" || role === "cliente_planta";
  const cleanEmail = email.trim().toLowerCase();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail);
  const canSubmit = emailOk && fullName.trim().length > 1 && (!isClient || !!company);

  const submit = async () => {
    if (!emailOk) {
      toast.error("Escribe un correo válido, por ejemplo nombre@empresa.com.");
      return;
    }
    if (!fullName.trim()) {
      toast.error("Escribe el nombre completo del usuario.");
      return;
    }
    if (isClient && !company) {
      toast.error("Selecciona la empresa del usuario cliente.");
      return;
    }
    setBusy(true);
    try {

      const res = await invite({
        data: {
          email,
          fullName,
          role,
          companySlug: isClient ? company || null : null,
          origin: window.location.origin,
        },
      });
      setResult(res);
      setEmail("");
      setFullName("");
      toast.success(res.created ? "Usuario creado y autorizado." : "Usuario existente actualizado.");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No fue posible crear el usuario.");
    } finally {
      setBusy(false);
    }
  };

  const accessText = result
    ? `Acceso al portal KG Safety\nEntra a: ${result.loginUrl}\nCorreo: ${result.email}\nContraseña temporal: ${result.tempPassword}\n(Cámbiala al iniciar sesión.)`
    : "";

  return (
    <div className="p-4 border-b border-[color:var(--border)] space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted-fg)]">
        Dar de alta un usuario
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nombre completo"
          aria-label="Nombre completo del nuevo usuario"
          className="bg-transparent border border-[color:var(--border)] px-3 py-2 text-sm"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="correo@empresa.com"
          aria-label="Correo del nuevo usuario"
          className="bg-transparent border border-[color:var(--border)] px-3 py-2 text-sm"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as RoleValue)}
          aria-label="Rol del nuevo usuario"
          className="bg-transparent border border-[color:var(--border)] px-3 py-2 text-sm"
        >
          {(Object.keys(ROLE_LABEL) as RoleValue[]).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={!isClient}
          aria-label="Empresa del nuevo usuario"
          className="bg-transparent border border-[color:var(--border)] px-3 py-2 text-sm disabled:opacity-40"
        >
          <option value="">Sin empresa</option>
          {companies.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <ActionBtn
        variant="primary"
        onClick={() => {
          if (!busy) void submit();
        }}
      >
        {busy ? <Loader2 size={11} className="animate-spin" /> : <UserPlus size={11} />} Crear acceso
      </ActionBtn>

      {result && (
        <div className="border border-[color:var(--border)] bg-[color:var(--muted)]/30 p-3 text-xs space-y-1">
          <p className="font-bold uppercase tracking-wider text-[10px]">Datos de acceso — compártelos una sola vez</p>
          <p>
            Portal: <span className="font-mono break-all">{result.loginUrl}</span>
          </p>
          <p>
            Correo: <span className="font-mono break-all">{result.email}</span>
          </p>
          <p>
            Contraseña temporal: <span className="font-mono">{result.tempPassword}</span>
          </p>
          <ActionBtn
            onClick={() => {
              void navigator.clipboard.writeText(accessText);
              toast.success("Datos copiados.");
            }}
          >
            <Copy size={11} /> Copiar instrucciones
          </ActionBtn>
        </div>
      )}
    </div>
  );
}


export function AdminUsers() {
  const fetchUsers = useServerFn(listPortalUsers);
  const fetchCompanies = useServerFn(listCompanyOptions);
  const saveAccess = useServerFn(setPortalUserAccess);

  const [users, setUsers] = useState<PortalUser[] | null>(null);
  const [companies, setCompanies] = useState<{ slug: string; name: string }[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, { role: RoleValue; company: string }>>({});

  const load = async () => {
    try {
      const [u, c] = await Promise.all([fetchUsers(), fetchCompanies()]);
      setUsers(u);
      setCompanies(c);
    } catch {
      toast.error("No fue posible cargar los usuarios.");
      setUsers([]);
    }
  };

  useEffect(() => {
    void load();
     
  }, []);

  const pending = useMemo(() => (users ?? []).filter((u) => u.status === "pending"), [users]);

  const update = async (
    user: PortalUser,
    status: "approved" | "rejected" | "pending",
    role: RoleValue | null,
    company: string | null,
  ) => {
    setBusyId(user.id);
    try {
      await saveAccess({ data: { userId: user.id, status, role, companySlug: company } });
      toast.success(
        status === "approved" ? "Acceso autorizado." : status === "rejected" ? "Acceso rechazado." : "Acceso actualizado.",
      );
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No fue posible guardar el acceso.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Panel
      title={`Usuarios del portal${pending.length ? ` · ${pending.length} pendiente(s)` : ""}`}
      action={
        <ActionBtn onClick={() => void load()}>
          <RefreshCw size={11} /> Actualizar
        </ActionBtn>
      }
    >
      <InviteForm companies={companies} onDone={() => void load()} />
      {users === null ? (

        <div className="p-6 flex items-center gap-2 text-xs text-[color:var(--muted-fg)]">
          <Loader2 size={14} className="animate-spin" /> Cargando usuarios…
        </div>
      ) : users.length === 0 ? (
        <p className="p-6 text-xs text-[color:var(--muted-fg)]">Aún no hay usuarios registrados en el portal.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
              <tr>
                <th className="text-left px-4 py-2 font-bold">Usuario</th>
                <th className="text-left px-4 py-2 font-bold">Empresa solicitada</th>
                <th className="text-left px-4 py-2 font-bold">Rol</th>
                <th className="text-left px-4 py-2 font-bold">Empresa asignada</th>
                <th className="text-left px-4 py-2 font-bold">Estado</th>
                <th className="text-right px-4 py-2 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {users.map((u) => {
                const current = draft[u.id] ?? {
                  role: ((u.roles[0] as RoleValue) ?? "cliente_corp") as RoleValue,
                  company: u.companySlug ?? "",
                };
                const isClient = current.role === "cliente_corp" || current.role === "cliente_planta";
                const busy = busyId === u.id;
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-2.5">
                      <p className="font-bold">{u.fullName || "—"}</p>
                      <p className="text-[11px] text-[color:var(--muted-fg)]">{u.email}</p>
                    </td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)] text-xs">
                      {u.requestedCompanySlug || "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        aria-label={`Rol de ${u.email}`}
                        value={current.role}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            [u.id]: { ...current, role: e.target.value as RoleValue },
                          }))
                        }
                        className="bg-transparent border border-[color:var(--border)] px-2 py-1.5 text-xs"
                      >
                        {(Object.keys(ROLE_LABEL) as RoleValue[]).map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        aria-label={`Empresa de ${u.email}`}
                        disabled={!isClient}
                        value={current.company}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            [u.id]: { ...current, company: e.target.value },
                          }))
                        }
                        className="bg-transparent border border-[color:var(--border)] px-2 py-1.5 text-xs disabled:opacity-40 max-w-[190px]"
                      >
                        <option value="">Sin asignar</option>
                        {companies.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge
                        state={u.status === "approved" ? "vigente" : u.status === "rejected" ? "vencido" : "default"}
                        label={u.status === "approved" ? "Aprobado" : u.status === "rejected" ? "Rechazado" : "Pendiente"}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex gap-1.5">
                        <ActionBtn
                          variant="primary"
                          onClick={() => {
                            if (busy) return;
                            void update(u, "approved", current.role, isClient ? current.company || null : null);
                          }}
                        >
                          {busy ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} Autorizar
                        </ActionBtn>
                        <ActionBtn onClick={() => void update(u, "rejected", null, null)}>
                          <X size={11} /> Rechazar
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
