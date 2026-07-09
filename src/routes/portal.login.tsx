import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Users, Shield, Wrench, ArrowLeft, AlertTriangle } from "lucide-react";
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

type TopRole = "cliente" | "admin-kg" | "equipo-kg";

const ROLES: { value: TopRole; label: string; desc: string; icon: typeof Users }[] = [
  { value: "cliente", label: "Cliente", desc: "Empresas con proyectos, sistemas o certificaciones KG Safety.", icon: Users },
  { value: "equipo-kg", label: "Equipo KG Safety", desc: "Personal técnico y operativo de KG Safety.", icon: Wrench },
  { value: "admin-kg", label: "Administrador KG Safety", desc: "Acceso total: todos los clientes, plantas y módulos.", icon: Shield },
];

const logoModules = import.meta.glob("@/assets/logos-empresas/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
function logoBySlug(slug: string): string | undefined {
  const key = Object.keys(logoModules).find((k) => k.endsWith(`/${slug}.png`));
  return key ? logoModules[key] : undefined;
}
// Map data-file client slug -> filename slug used in /assets/logos-empresas
const LOGO_MAP: Record<string, string> = {
  femsa: "coca-cola-femsa",
  jnj: "johnson-johnson",
  gm: "general-motors",
  conoco: "conoco-phillips",
  pyg: "procter-gamble",
  kimberly: "kimberly-clark",
  arca: "arca-continental",
  bimbo: "bimbo",
};


type Step = "role" | "cliente-empresa" | "cliente-planta" | "credenciales";

function PortalLogin() {
  const { login } = usePortalSession();
  const navigate = useNavigate();

  const [role, setRole] = useState<TopRole>("cliente");
  const [step, setStep] = useState<Step>("role");
  const [clientSlug, setClientSlug] = useState<string | null>(null);
  const [otherClient, setOtherClient] = useState(false);
  const [plantSlug, setPlantSlug] = useState<string | null>(null);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const clientPlants = useMemo(
    () => (clientSlug ? PLANTS.filter((p) => p.clientSlug === clientSlug) : []),
    [clientSlug],
  );

  const goBack = () => {
    if (step === "credenciales") {
      if (otherClient || role !== "cliente") setStep("role");
      else if (clientPlants.length > 1) setStep("cliente-planta");
      else setStep("cliente-empresa");
    } else if (step === "cliente-planta") setStep("cliente-empresa");
    else if (step === "cliente-empresa") setStep("role");
  };

  const handleRoleContinue = () => {
    if (role === "cliente") setStep("cliente-empresa");
    else setStep("credenciales");
  };

  const handleSelectClient = (slug: string) => {
    setOtherClient(false);
    setClientSlug(slug);
    setPlantSlug(null);
    const plants = PLANTS.filter((p) => p.clientSlug === slug);
    if (plants.length > 1) setStep("cliente-planta");
    else {
      if (plants[0]) setPlantSlug(plants[0].slug);
      setStep("credenciales");
    }
  };

  const handleSelectOtros = () => {
    setOtherClient(true);
    setClientSlug(null);
    setPlantSlug(null);
    setStep("credenciales");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let session:
      | { role: Role; name: string; clientSlug?: string; plantSlug?: string }
      | null = null;

    if (role === "admin-kg") {
      session = { role: "admin-kg", name: "Administrador KG Safety" };
    } else if (role === "equipo-kg") {
      session = { role: "equipo-kg", name: "Equipo técnico KG Safety" };
    } else if (otherClient) {
      session = { role: "cliente-corp", name: `Cliente — ${usuario || "acceso KG Safety"}` };
    } else if (clientSlug) {
      const client = CLIENTS.find((c) => c.slug === clientSlug);
      if (plantSlug) {
        const plant = PLANTS.find((p) => p.slug === plantSlug);
        session = {
          role: "cliente-planta",
          name: `HSE — ${plant?.name ?? client?.name}`,
          plantSlug,
          clientSlug,
        };
      } else {
        session = {
          role: "cliente-corp",
          name: `Equipo HSE — ${client?.name}`,
          clientSlug,
        };
      }
    }
    if (!session) return;
    login(session);
    navigate({ to: "/portal" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* Panel izquierdo */}
      <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-anchor text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-navy grid place-items-center">
              <div className="w-5 h-5 border-[3px] border-signal" />
            </div>
            <span className="font-display text-lg uppercase tracking-tight">
              KG <span className="text-brand-blue">Safety</span>
            </span>
          </div>
        </div>
        <div className="relative z-10 max-w-lg">
          <p className="text-[10px] uppercase tracking-widest text-signal mb-3">
            Portal de clientes y operaciones
          </p>
          <h1 className="font-display uppercase leading-[1.05] mb-5 text-[clamp(1.75rem,3vw,3rem)] [overflow-wrap:normal] [word-break:normal] hyphens-none">
            Su historia técnica<br />
            <span className="text-signal">en un solo lugar.</span>
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Sistemas instalados, certificaciones, DC-3, constancias, calendario de cumplimiento,
            solicitudes de servicio y facturación — con trazabilidad auditable.
          </p>
        </div>
        <div className="relative z-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-300">
          <AlertTriangle size={12} />
          Prototipo · datos ficticios · no usar en producción
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/40 via-anchor to-anchor" />
      </div>

      {/* Panel derecho */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-lg">
          {/* Aviso prototipo (móvil/tablet) */}
          <div className="lg:hidden inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-600 mb-4">
            <AlertTriangle size={12} />
            Prototipo · datos ficticios · no usar en producción
          </div>

          {step !== "role" && (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] hover:text-brand-blue mb-3"
            >
              <ArrowLeft size={12} /> Atrás
            </button>
          )}

          {/* STEP 1 — Rol */}
          {step === "role" && (
            <>
              <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-2">
                Acceso al portal
              </p>
              <h2 className="font-display text-2xl uppercase mb-1">Seleccione su rol</h2>
              <p className="text-xs text-[color:var(--muted-fg)] mb-6">
                En esta versión de prototipo no se validan credenciales.
              </p>

              <div className="grid gap-2 mb-5">
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

              <button
                type="button"
                onClick={handleRoleContinue}
                className="w-full bg-signal text-[color:var(--anchor-fixed)] py-3 font-bold text-xs uppercase tracking-widest border-2 border-[color:var(--anchor-fixed)] hover:bg-white transition-colors"
              >
                Continuar
              </button>
            </>
          )}

          {/* STEP 2 — Selección de empresa cliente */}
          {step === "cliente-empresa" && (
            <>
              <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-2">
                Acceso cliente
              </p>
              <h2 className="font-display text-2xl uppercase mb-1">Seleccione su empresa</h2>
              <p className="text-xs text-[color:var(--muted-fg)] mb-5">
                Elija el logotipo de su empresa. Si no aparece, seleccione <b>Otros</b>.
              </p>

              <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[60vh] md:max-h-[520px] overflow-y-auto pr-1 mb-3">
                {CLIENTS.map((c) => {
                  const url = logoBySlug(LOGO_MAP[c.slug] ?? c.slug);
                  return (
                    <li key={c.slug}>
                      <button
                        type="button"
                        onClick={() => handleSelectClient(c.slug)}
                        title={c.name}
                        className="w-full aspect-[4/3] bg-white border border-black/10 rounded-md p-2 flex items-center justify-center hover:border-signal hover:shadow-md transition-all"
                      >
                        {url ? (
                          <img src={url} alt={c.name} className="max-h-10 w-auto object-contain" loading="lazy" />
                        ) : (
                          <span className="font-display text-[9px] uppercase tracking-wider text-neutral-800 text-center leading-tight">
                            {c.name}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    type="button"
                    onClick={handleSelectOtros}
                    className="w-full aspect-[4/3] border-2 border-dashed border-[color:var(--border)] rounded-md flex items-center justify-center hover:border-signal hover:bg-brand-blue/5 transition-colors"
                  >
                    <span className="font-display text-xs uppercase tracking-widest text-[color:var(--muted-fg)]">
                      Otros
                    </span>
                  </button>
                </li>
              </ul>
            </>
          )}

          {/* STEP 3 — Selección de planta / CD */}
          {step === "cliente-planta" && clientSlug && (
            <>
              <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-2">
                {CLIENTS.find((c) => c.slug === clientSlug)?.name}
              </p>
              <h2 className="font-display text-2xl uppercase mb-1">Planta o centro de distribución</h2>
              <p className="text-xs text-[color:var(--muted-fg)] mb-5">
                Seleccione la ubicación a la que corresponde su acceso.
              </p>
              <div className="grid gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => { setPlantSlug(null); setStep("credenciales"); }}
                  className="p-3 border border-[color:var(--border)] hover:border-signal text-left transition-colors"
                >
                  <div className="text-xs font-bold uppercase tracking-wider">Acceso corporativo</div>
                  <div className="text-[11px] text-[color:var(--muted-fg)] mt-0.5">Ver todas las plantas de esta empresa.</div>
                </button>
                {clientPlants.map((p) => (
                  <button
                    type="button"
                    key={p.slug}
                    onClick={() => { setPlantSlug(p.slug); setStep("credenciales"); }}
                    className="p-3 border border-[color:var(--border)] hover:border-signal text-left transition-colors"
                  >
                    <div className="text-xs font-bold uppercase tracking-wider">{p.name}</div>
                    <div className="text-[11px] text-[color:var(--muted-fg)] mt-0.5">{p.location} · {p.industry}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STEP 4 — Credenciales */}
          {step === "credenciales" && (
            <form onSubmit={handleSubmit}>
              <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-2">
                {role === "cliente"
                  ? otherClient
                    ? "Acceso otorgado por KG Safety"
                    : `${CLIENTS.find((c) => c.slug === clientSlug)?.name}${plantSlug ? ` · ${PLANTS.find((p) => p.slug === plantSlug)?.name}` : ""}`
                  : ROLES.find((r) => r.value === role)?.label}
              </p>
              <h2 className="font-display text-2xl uppercase mb-1">Ingrese sus credenciales</h2>
              <p className="text-xs text-[color:var(--muted-fg)] mb-6">
                Prototipo: cualquier usuario y contraseña permiten el acceso.
              </p>

              <label className="block mb-3">
                <span className="block text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1.5">
                  Usuario
                </span>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] px-3 py-2 text-sm focus:border-brand-blue outline-none"
                />
              </label>
              <label className="block mb-5">
                <span className="block text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1.5">
                  Contraseña
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] px-3 py-2 text-sm focus:border-brand-blue outline-none"
                />
              </label>

              <button
                type="submit"
                className="w-full bg-signal text-[color:var(--anchor-fixed)] py-3 font-bold text-xs uppercase tracking-widest border-2 border-[color:var(--anchor-fixed)] hover:bg-white transition-colors shadow-[3px_3px_0_0_var(--anchor-fixed)]"
              >
                Entrar al portal
              </button>

              <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mt-6 text-center">
                En producción → autenticación segura y permisos reales
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
