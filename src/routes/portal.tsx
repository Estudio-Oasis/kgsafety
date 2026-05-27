import { Link, Outlet, useNavigate, useRouterState, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Factory,
  Briefcase,
  ShieldCheck,
  FileText,
  Receipt,
  Library,
  Settings,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { usePortalSession } from "@/hooks/use-portal-session";
import type { Role } from "@/data/portal";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/portal")({
  component: PortalLayout,
  head: () => ({
    meta: [
      { title: "Portal KG Safety" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; roles: Role[] };

const NAV: NavItem[] = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, roles: ["cliente-corp", "cliente-planta", "admin-kg", "equipo-kg"] },
  { to: "/portal/clientes", label: "Clientes", icon: Building2, roles: ["admin-kg"] },
  { to: "/portal/proyectos", label: "Proyectos", icon: Briefcase, roles: ["cliente-corp", "cliente-planta", "admin-kg", "equipo-kg"] },
  { to: "/portal/certificaciones", label: "Certificaciones", icon: ShieldCheck, roles: ["cliente-corp", "cliente-planta", "admin-kg"] },
  { to: "/portal/documentos", label: "Documentos", icon: FileText, roles: ["cliente-corp", "cliente-planta", "admin-kg"] },
  { to: "/portal/facturacion", label: "Facturación", icon: Receipt, roles: ["cliente-corp", "cliente-planta", "admin-kg"] },
  { to: "/portal/biblioteca", label: "Biblioteca KG", icon: Library, roles: ["admin-kg", "equipo-kg"] },
  { to: "/portal/admin", label: "Panel admin", icon: Settings, roles: ["admin-kg"] },
];

const ROLE_LABEL: Record<Role, string> = {
  "cliente-corp": "Cliente corporativo",
  "cliente-planta": "Cliente planta",
  "admin-kg": "Admin KG Safety",
  "equipo-kg": "Equipo KG Safety",
};

function PortalLayout() {
  const { session, ready, logout } = usePortalSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/portal/login";

  useEffect(() => {
    if (ready && !session && !isLogin) {
      navigate({ to: "/portal/login" });
    }
  }, [ready, session, isLogin, navigate]);

  if (isLogin) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  if (!ready || !session) {
    return <div className="min-h-screen bg-[color:var(--surface)]" />;
  }

  const items = NAV.filter((n) => n.roles.includes(session.role));

  const handleLogout = () => {
    logout();
    navigate({ to: "/portal/login" });
  };

  return (
    <div className="min-h-screen flex bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-[color:var(--border)] bg-[color:var(--surface)] flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-[color:var(--border)]">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-navy grid place-items-center">
              <div className="w-3.5 h-3.5 border-[3px] border-signal" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm tracking-tight uppercase">KG <span className="text-brand-blue">Safety</span></div>
              <div className="text-[9px] uppercase tracking-widest text-[color:var(--muted-fg)]">Portal</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.to || (item.to !== "/portal" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold uppercase tracking-wider border-l-2 transition-colors ${
                  active
                    ? "border-signal text-brand-blue bg-brand-blue/5"
                    : "border-transparent text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] hover:text-brand-blue hover:bg-[color:var(--muted)]/30"
                }`}
              >
                <Icon size={14} strokeWidth={2.4} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[color:var(--border)] p-3">
          <div className="px-2 py-2 mb-2">
            <p className="text-[9px] uppercase tracking-widest text-[color:var(--muted-fg)]">Sesión</p>
            <p className="text-xs font-bold text-[color:var(--on-surface)] truncate">{session.name}</p>
            <p className="text-[10px] text-[color:var(--muted-fg)]">{ROLE_LABEL[session.role]}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider border border-[color:var(--border)] hover:border-signal hover:text-signal transition-colors"
          >
            <LogOut size={12} />
            Cambiar rol
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="h-12 border-b border-[color:var(--border)] flex items-center justify-between px-6 sticky top-0 bg-[color:var(--surface)]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
            <AlertTriangle size={12} className="text-amber-500" />
            Prototipo · datos ficticios · no usar en producción
          </div>
          <Link to="/" className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] hover:text-brand-blue">
            ← Volver al sitio público
          </Link>
        </header>
        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
