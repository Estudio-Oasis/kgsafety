import { createFileRoute } from "@tanstack/react-router";

/**
 * Reconciliación automática de la cola del ERP.
 * Llamado por pg_cron cada 5 minutos con la llave pública del proyecto.
 */
export const Route = createFileRoute("/api/public/hooks/erp-reconcile")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const provided =
          request.headers.get("x-erp-reconcile-secret") ??
          request.headers.get("authorization")?.replace(/^Bearer /i, "") ??
          "";
        const expected = process.env["ERP_RECONCILE_SECRET"] ?? "";

        const unauthorized = () =>
          new Response(JSON.stringify({ error: "unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });

        if (!expected) {
          console.error("[erp-reconcile] ERP_RECONCILE_SECRET no está configurado");
          return unauthorized();
        }

        // Comparación en tiempo constante (evita ataques de temporización).
        const a = new TextEncoder().encode(provided);
        const b = new TextEncoder().encode(expected);
        let diff = a.length ^ b.length;
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
          diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
        }
        if (diff !== 0) return unauthorized();

        const { runReconcile } = await import("@/lib/erp-admin.server");
        const result = await runReconcile(20);
        return Response.json({ ok: true, ...result });
      },
    },
  },
});
