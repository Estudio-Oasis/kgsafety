import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/erp-selftest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey") ?? "";
        const expected =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"] ?? "";
        if (!expected || apikey !== expected) return new Response("unauthorized", { status: 401 });
        const { runE2ETests } = await import("@/lib/erp-admin.server");
        return Response.json(await runE2ETests());
      },
    },
  },
});
