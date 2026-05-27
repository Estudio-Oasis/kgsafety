import { useEffect, useState, useCallback } from "react";
import type { Role } from "@/data/portal";

export type PortalSession = {
  role: Role;
  name: string;
  clientSlug?: string;
  plantSlug?: string;
};

const KEY = "kg-portal-session";

function read(): PortalSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PortalSession) : null;
  } catch {
    return null;
  }
}

export function usePortalSession() {
  const [session, setSession] = useState<PortalSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(read());
    setReady(true);
    const onStorage = () => setSession(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((s: PortalSession) => {
    localStorage.setItem(KEY, JSON.stringify(s));
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setSession(null);
  }, []);

  return { session, ready, login, logout };
}

export function getStoredSession(): PortalSession | null {
  return read();
}
