import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hydratePortalData, clearPortalData, type Role } from "@/data/portal";
import { getPortalBootstrap, type PortalBootstrap } from "@/lib/portal.functions";

export type PortalSession = {
  role: Role;
  name: string;
  clientSlug?: string;
  plantSlug?: string;
};

type PortalAuthState = {
  /** Sesión del portal derivada del perfil y rol reales en la base de datos. */
  session: PortalSession | null;
  /** true cuando ya se resolvió el estado de autenticación. */
  ready: boolean;
  /** Hay usuario autenticado pero su cuenta aún no fue aprobada. */
  status: "signed-out" | "pending" | "rejected" | "approved";
  email: string | null;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<PortalAuthState | null>(null);

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [boot, setBoot] = useState<PortalBootstrap | null>(null);
  const [hasUser, setHasUser] = useState(false);
  const [version, setVersion] = useState(0);

  const load = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setHasUser(false);
      setBoot(null);
      clearPortalData();
      setVersion((v) => v + 1);
      setReady(true);
      return;
    }
    setHasUser(true);
    try {
      const result = await getPortalBootstrap();
      setBoot(result);
      if (result.dataset) hydratePortalData(result.dataset);
      else clearPortalData();
    } catch {
      setBoot(null);
      clearPortalData();
    }
    setVersion((v) => v + 1);
    setReady(true);
  }, []);

  useEffect(() => {
    void load();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void load();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    clearPortalData();
    setBoot(null);
    setHasUser(false);
    setVersion((v) => v + 1);
  }, []);

  const value = useMemo<PortalAuthState>(() => {
    const profile = boot?.profile ?? null;
    const status: PortalAuthState["status"] = !hasUser
      ? "signed-out"
      : profile?.status === "approved"
        ? "approved"
        : profile?.status === "rejected"
          ? "rejected"
          : "pending";

    const session: PortalSession | null =
      boot?.role && status === "approved"
        ? {
            role: boot.role,
            name: profile?.fullName || profile?.email || "Usuario del portal",
            ...(profile?.companySlug ? { clientSlug: profile.companySlug } : {}),
          }
        : null;

    return {
      session,
      ready,
      status,
      email: profile?.email ?? null,
      isAdmin: Boolean(boot?.isAdmin),
      refresh: load,
      logout,
    };
    // `version` fuerza re-render cuando se rehidratan las colecciones.
     
  }, [boot, hasUser, ready, load, logout, version]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePortalSession(): PortalAuthState {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      session: null,
      ready: false,
      status: "signed-out",
      email: null,
      isAdmin: false,
      refresh: async () => {},
      logout: async () => {},
    };
  }
  return ctx;
}
