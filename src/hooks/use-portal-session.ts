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

// In-module pub/sub so multiple hook instances in the same tab stay in sync.
// `storage` events don't fire in the same tab that wrote them, which causes
// the layout to keep seeing `null` right after login and bounces back to /login.
type Listener = (s: PortalSession | null) => void;
const listeners = new Set<Listener>();
function notify(s: PortalSession | null) {
  listeners.forEach((l) => l(s));
}

export function usePortalSession() {
  const [session, setSession] = useState<PortalSession | null>(() => read());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Re-read after mount (SSR returns null) and subscribe.
    setSession(read());
    setReady(true);

    const onLocal: Listener = (s) => setSession(s);
    listeners.add(onLocal);

    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSession(read());
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const login = useCallback((s: PortalSession) => {
    localStorage.setItem(KEY, JSON.stringify(s));
    setSession(s);
    notify(s);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setSession(null);
    notify(null);
  }, []);

  return { session, ready, login, logout };
}

export function getStoredSession(): PortalSession | null {
  return read();
}
