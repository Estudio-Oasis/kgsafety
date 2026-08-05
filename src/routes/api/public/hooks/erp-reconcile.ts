import { createFileRoute } from "@tanstack/react-router";

/**
 * Reconciliación automática de la cola del ERP.
 * Llamado por pg_cron cada 5 minutos con la llave pública del proyecto.
 */
export const Route = createFileRoute("/api/public/hooks/erp-reconcile")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey =
          request.headers.get("apikey") ??
          request.headers.get("authorization")?.replace(/^Bearer /i, "") ??
          "";
        const expected = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"] ?? "";
        if (!expected || apikey !== expected) {
          return new Response(JSON.stringify({ error: "unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const { runReconcile } = await import("@/lib/erp-admin.server");
        const result = await runReconcile(20);
        return Response.json({ ok: true, ...result });
      },
    },
  },
});
