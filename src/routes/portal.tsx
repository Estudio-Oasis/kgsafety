import { Link, Outlet, useNavigate, useRouterState, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import {
  LayoutDashboard,
  Layers,
  ShieldCheck,
  Users,
  FileText,
  CalendarClock,
  Inbox,
  Receipt,
  Building2,
  Library,
  ScrollText,
  Settings,
  LogOut,
  AlertTriangle,
  TrendingUp,
  Activity,
  Database,
} from "lucide-react";
import { PortalAuthProvider, usePortalSession } from "@/hooks/use-portal-session";
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

const ALL_ROLES: Role[] = ["cliente-corp", "cliente-planta", "admin-kg", "equipo-kg"];
const CLIENT_ROLES: Role[] = ["cliente-corp", "cliente-planta", "admin-kg"];

const NAV: NavItem[] = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, roles: ALL_ROLES },
  { to: "/portal/sistemas", label: "Mis sistemas y servicios", icon: Layers, roles: CLIENT_ROLES },
  { to: "/portal/certificaciones", label: "Certificaciones y recertificaciones", icon: ShieldCheck, roles: CLIENT_ROLES },
  { to: "/portal/personal", label: "Personal capacitado y DC-3", icon: Users, roles: CLIENT_ROLES },
  { to: "/portal/constancias", label: "Constancias y fichas técnicas", icon: FileText, roles: CLIENT_ROLES },
  { to: "/portal/calendario", label: "Calendario de cumplimiento", icon: CalendarClock, roles: CLIENT_ROLES },
  { to: "/portal/solicitudes", label: "Solicitudes de servicio", icon: Inbox, roles: CLIENT_ROLES },
  { to: "/portal/facturacion", label: "Servicios realizados", icon: Receipt, roles: CLIENT_ROLES },
  { to: "/portal/clientes", label: "Clientes", icon: Building2, roles: ["admin-kg"] },
  { to: "/portal/leads", label: "Embudo comercial", icon: TrendingUp, roles: ["admin-kg", "equipo-kg"] },
  { to: "/portal/erp-kg", label: "ERP KG (datos propios)", icon: Database, roles: ["admin-kg", "equipo-kg"] },
  { to: "/portal/erp", label: "Monitoreo ERP", icon: Activity, roles: ["admin-kg", "equipo-kg"] },
  { to: "/portal/auditoria", label: "Auditoría de integraciones", icon: ScrollText, roles: ["admin-kg", "equipo-kg"] },
  { to: "/portal/biblioteca", label: "Biblioteca KG", icon: Library, roles: ["admin-kg", "equipo-kg"] },
  { to: "/portal/admin", label: "Panel admin", icon: Settings, roles: ["admin-kg"] },
];


const ROLE_LABEL: Record<Role, string> = {
  "cliente-corp": "Cliente corporativo",
  "cliente-planta": "Cliente planta",
  "admin-kg": "Admin KG Safety",
  "equipo-kg": "Equipo KG Safety",
};

// El portal ya cuenta con autenticación y autorización reales; sólo se apaga
// si explícitamente se define VITE_PORTAL_ENABLED="false".
const PORTAL_ENABLED = import.meta.env['VITE_PORTAL_ENABLED'] !== "false";

function PortalUnavailable() {
  return (
    <div className="min-h-screen grid place-items-center bg-[color:var(--surface)] text-[color:var(--on-surface)] px-6">
      <div className="max-w-md text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4">
          Portal de clientes
        </p>
        <h1 className="font-display text-2xl md:text-3xl uppercase mb-4">En construcción</h1>
        <p className="text-sm text-[color:var(--muted-fg)] mb-8">
          El portal de clientes está en desarrollo y no se encuentra disponible públicamente.
          Para consultar documentación, certificaciones o servicios, contacte a su ejecutivo KG Safety.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/contacto"
            className="bg-signal text-[color:var(--anchor-fixed)] px-6 py-3 font-bold text-[11px] uppercase tracking-widest"
          >
            Contactar
          </Link>
          <Link
            to="/"
            className="border border-[color:var(--border)] px-6 py-3 font-bold text-[11px] uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-colors"
          >
            Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}

function PortalLayout() {
  if (!PORTAL_ENABLED) return <PortalUnavailable />;
  return (
    <PortalAuthProvider>
      <PortalShell />
    </PortalAuthProvider>
  );
}

function PortalShell() {
  const { session, ready, status, logout } = usePortalSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/portal/login";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && !session && !isLogin) {
      navigate({ to: "/portal/login", replace: true });
    }
  }, [ready, session, isLogin, navigate]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (isLogin) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  if (!ready || !session) {
    return (
      <div className="min-h-screen grid place-items-center bg-[color:var(--surface)] text-[color:var(--muted-fg)] text-xs uppercase tracking-widest">
        {ready && status !== "signed-out" ? "Redirigiendo…" : "Verificando acceso…"}
      </div>
    );
  }

  const items = NAV.filter((n) => n.roles.includes(session.role));

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/portal/login", replace: true });
  };



  const sidebar = (
    <>
      <div className="px-5 py-5 border-b border-[color:var(--border)] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-navy grid place-items-center">
            <div className="w-3.5 h-3.5 border-[3px] border-signal" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm tracking-tight uppercase">KG <span className="text-brand-blue">Safety</span></div>
            <div className="text-[9px] uppercase tracking-widest text-[color:var(--muted-fg)]">Portal</div>
          </div>
        </Link>
        <button
          type="button"
          className="lg:hidden p-1"
          onClick={() => setMobileOpen(false)}
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>
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
              className={`flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider border-l-2 transition-colors leading-tight ${
                active
                  ? "border-signal text-brand-blue bg-brand-blue/5"
                  : "border-transparent text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] hover:text-brand-blue hover:bg-[color:var(--muted)]/30"
              }`}
            >
              <Icon size={14} strokeWidth={2.4} className="shrink-0" />
              <span>{item.label}</span>
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
          onClick={() => void handleLogout()}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider border border-[color:var(--border)] hover:border-signal hover:text-signal transition-colors"
        >
          <LogOut size={12} />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-[color:var(--border)] bg-[color:var(--surface)] flex-col sticky top-0 h-screen">
        {sidebar}
      </aside>

      {/* Sidebar móvil (drawer) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-[color:var(--surface)] border-r border-[color:var(--border)] flex flex-col">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="h-12 border-b border-[color:var(--border)] flex items-center justify-between px-4 md:px-6 sticky top-0 bg-[color:var(--surface)]/95 backdrop-blur z-10 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden p-1 -ml-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-600 min-w-0">
              <AlertTriangle size={12} className="shrink-0" />
              <span className="truncate">Datos de demostración · acceso restringido por empresa y rol</span>
            </div>
          </div>
          <Link to="/" className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] hover:text-brand-blue whitespace-nowrap hidden sm:inline">
            ← Volver al sitio público
          </Link>
        </header>
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}

