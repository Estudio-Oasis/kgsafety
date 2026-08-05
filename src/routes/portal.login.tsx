import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Loader2, Mail, Lock, Building2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePortalSession } from "@/hooks/use-portal-session";

export const Route = createFileRoute("/portal/login")({
  component: PortalLogin,
  head: () => ({
    meta: [
      { title: "Acceso · Portal KG Safety" },
      { name: "description", content: "Acceso privado al portal de clientes KG Safety." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Mode = "login" | "signup";

function PortalLogin() {
  const navigate = useNavigate();
  const { session, status, ready, refresh, logout } = usePortalSession();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (ready && session) navigate({ to: "/portal", replace: true });
  }, [ready, session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        await refresh();
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal/login`,
            data: { full_name: fullName, requested_company_slug: company },
          },
        });
        if (err) throw err;
        if (!data.session) {
          setInfo(
            "Cuenta creada. Revisa tu correo para confirmar el acceso. Un administrador de KG Safety debe autorizar tu cuenta antes de ver información.",
          );
        } else {
          await refresh();
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No fue posible completar la operación.";
      setError(
        msg.includes("Invalid login credentials")
          ? "Correo o contraseña incorrectos."
          : msg.includes("already registered")
            ? "Ese correo ya tiene una cuenta. Inicia sesión."
            : msg,
      );
    } finally {
      setBusy(false);
    }
  };

  if (ready && (status === "pending" || status === "rejected")) {
    return (
      <div className="min-h-screen grid place-items-center bg-[color:var(--surface)] text-[color:var(--on-surface)] px-6">
        <div className="max-w-md text-center">
          <Shield size={28} className="mx-auto text-brand-blue" />
          <h1 className="font-display text-2xl uppercase mt-4">
            {status === "rejected" ? "Acceso no autorizado" : "Cuenta en revisión"}
          </h1>
          <p className="text-sm text-[color:var(--muted-fg)] mt-3">
            {status === "rejected"
              ? "Tu solicitud de acceso al portal fue rechazada. Contacta a tu ejecutivo KG Safety si crees que es un error."
              : "Tu cuenta fue creada correctamente. Un administrador de KG Safety debe autorizarla y asignarte una empresa antes de que puedas consultar información."}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => void refresh()}
              className="border border-[color:var(--border)] px-6 py-3 font-bold text-[11px] uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue"
            >
              Revisar de nuevo
            </button>
            <button
              onClick={() => void logout()}
              className="bg-signal text-[color:var(--anchor-fixed)] px-6 py-3 font-bold text-[11px] uppercase tracking-widest"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[color:var(--surface)] text-[color:var(--on-surface)] px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 bg-brand-navy grid place-items-center">
            <div className="w-4 h-4 border-[3px] border-signal" />
          </div>
          <div className="leading-tight text-left">
            <div className="font-display text-base uppercase tracking-tight">
              KG <span className="text-brand-blue">Safety</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-[color:var(--muted-fg)]">
              Portal de clientes
            </div>
          </div>
        </Link>

        <div className="border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
          <div className="flex gap-1 mb-6 border border-[color:var(--border)] p-1">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setInfo(null);
                }}
                aria-pressed={mode === m}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  mode === m
                    ? "bg-brand-navy text-white"
                    : "text-[color:var(--muted-fg)] hover:text-brand-blue"
                }`}
              >
                {m === "login" ? "Iniciar sesión" : "Solicitar acceso"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <>
                <Field
                  id="nombre"
                  label="Nombre completo"
                  icon={User}
                  value={fullName}
                  onChange={setFullName}
                  autoComplete="name"
                  required
                />
                <Field
                  id="empresa"
                  label="Empresa"
                  icon={Building2}
                  value={company}
                  onChange={setCompany}
                  autoComplete="organization"
                  required
                />
              </>
            )}
            <Field
              id="email"
              label="Correo corporativo"
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
            />
            <Field
              id="password"
              label="Contraseña"
              icon={Lock}
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />

            {error && (
              <p aria-live="polite" className="text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {info && (
              <p aria-live="polite" className="text-xs text-emerald-700 dark:text-emerald-400">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 bg-signal text-[color:var(--anchor-fixed)] px-6 py-3.5 font-bold text-[11px] uppercase tracking-widest disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 size={14} className="animate-spin" />}
              {mode === "login" ? "Entrar al portal" : "Enviar solicitud"}
            </button>
          </form>

          <p className="text-[10px] text-[color:var(--muted-fg)] mt-5 leading-relaxed">
            El acceso al portal es exclusivo para clientes y personal autorizado de KG Safety. Cada
            cuenta sólo puede consultar la información de su propia empresa.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] hover:text-brand-blue"
          >
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  icon: typeof Mail;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted-fg)] mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2 border border-[color:var(--border)] px-3 focus-within:border-brand-blue">
        <Icon size={14} className="text-[color:var(--muted-fg)] shrink-0" />
        <input
          id={id}
          type={type}
          value={value}
          required={required}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
      </div>
    </div>
  );
}
