import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Factory, Shield, Wrench } from "lucide-react";
import { usePortalSession } from "@/hooks/use-portal-session";
import { CLIENTS, PLANTS } from "@/data/portal";
import type { Role } from "@/data/portal";

export const Route = createFileRoute("/portal/login")({
  component: PortalLogin,
  head: () => ({
    meta: [
      { title: "Acceso · Portal KG Safety" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const ROLES: { value: Role; label: string; desc: string; icon: typeof Building2 }[] = [
  { value: "cliente-corp", label: "Cliente corporativo", desc: "Acceso a todas las plantas de su empresa.", icon: Building2 },
  { value: "cliente-planta", label: "Cliente planta", desc: "Acceso a una sola planta específica.", icon: Factory },
  { value: "admin-kg", label: "Admin KG Safety", desc: "Acceso total: todos los clientes, plantas y módulos.", icon: Shield },
  { value: "equipo-kg", label: "Equipo KG Safety", desc: "Biblioteca interna técnica y operativa.", icon: Wrench },
];

function PortalLogin() {
  const { login } = usePortalSession();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("cliente-corp");
  const [clientSlug, setClientSlug] = useState(CLIENTS[0].slug);
  const [plantSlug, setPlantSlug] = useState(PLANTS[0].slug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session =
      role === "cliente-corp"
        ? { role, name: `Equipo HSE — ${CLIENTS.find((c) => c.slug === clientSlug)?.name}`, clientSlug }
        : role === "cliente-planta"
          ? { role, name: `Jefe HSE — ${PLANTS.find((p) => p.slug === plantSlug)?.name}`, plantSlug, clientSlug: PLANTS.find((p) => p.slug === plantSlug)?.clientSlug }
          : role === "admin-kg"
            ? { role, name: "Administrador KG Safety" }
            : { role, name: "Equipo técnico KG Safety" };
    login(session);
    navigate({ to: "/portal" });
  };

  const plantsForClient = PLANTS.filter((p) => p.clientSlug === clientSlug);
  const activePlant = PLANTS.find((p) => p.slug === plantSlug);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-anchor text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-navy grid place-items-center">
              <div className="w-5 h-5 border-[3px] border-signal" />
            </div>
            <span className="font-display text-lg uppercase tracking-tight">KG <span className="text-brand-blue">Safety</span></span>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-signal mb-3">Portal de clientes y operaciones</p>
          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[1.05] mb-5">
            Su historial técnico,{" "}<br />
            <span className="text-signal">en un solo lugar.</span>
          </h1>
          <p className="text-sm text-white/70 max-w-md leading-relaxed">
            Proyectos, sistemas instalados, certificaciones, vencimientos, reportes, facturas y documentos auditables — disponibles para cliente, equipo de planta y administración KG Safety.
          </p>
        </div>
        <div className="relative z-10 text-[10px] uppercase tracking-widest text-white/40">
          Prototipo · datos ficticios · etapa de validación
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/40 via-anchor to-anchor" />
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-2">Acceso al portal</p>
          <h2 className="font-display text-2xl uppercase mb-1">Seleccione su rol</h2>
          <p className="text-xs text-[color:var(--muted-fg)] mb-6">
            En esta versión de prototipo no se requiere usuario y contraseña.
          </p>

          <div className="grid grid-cols-1 gap-2 mb-5">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = r.value === role;
              return (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`flex items-start gap-3 p-3 border text-left transition-colors ${
                    active
                      ? "border-signal bg-brand-blue/5"
                      : "border-[color:var(--border)] hover:border-brand-blue"
                  }`}
                >
                  <Icon size={18} className={active ? "text-signal" : "text-[color:var(--muted-fg)]"} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">{r.label}</div>
                    <div className="text-[11px] text-[color:var(--muted-fg)] mt-0.5">{r.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {role === "cliente-corp" && (
            <label className="block mb-5">
              <span className="block text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1.5">Empresa</span>
              <select
                value={clientSlug}
                onChange={(e) => setClientSlug(e.target.value)}
                className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] px-3 py-2 text-sm focus:border-brand-blue outline-none"
              >
                {CLIENTS.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </label>
          )}

          {role === "cliente-planta" && (
            <label className="block mb-5">
              <span className="block text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1.5">Planta</span>
              <select
                value={plantSlug}
                onChange={(e) => setPlantSlug(e.target.value)}
                className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] px-3 py-2 text-sm focus:border-brand-blue outline-none"
              >
                {PLANTS.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
              {activePlant && (
                <p className="text-[10px] text-[color:var(--muted-fg)] mt-1.5">
                  {activePlant.location} · {activePlant.industry}
                </p>
              )}
            </label>
          )}

          <button
            type="submit"
            className="w-full bg-signal text-[color:var(--anchor-fixed)] py-3 font-bold text-xs uppercase tracking-widest border-2 border-[color:var(--anchor-fixed)] hover:bg-white transition-colors shadow-[3px_3px_0_0_var(--anchor-fixed)]"
          >
            Entrar al portal
          </button>

          <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mt-6 text-center">
            En producción → autenticación segura + permisos reales
          </p>
        </form>
      </div>
    </div>
  );
}
