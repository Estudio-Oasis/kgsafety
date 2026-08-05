import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/erp-selftest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey") ?? "";
        const expected =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"] ?? "";
        if (!expected || apikey !== expected) return new Response("unauthorized", { status: 401 });
        const url = new URL(request.url);
        if (url.searchParams.get("caida") === "1") {
          process.env["ERP_BASE_URL"] = "https://erp-inexistente.kg-safety.invalid";
          const { submitQuote } = await import("@/lib/erp-submit.server");
          const r = await submitQuote(
            {
              rfc: "XAXX010101000", empresa: "PRUEBA CAIDA ERP", nombre: "QA", correo: "qa@kg-safety.com",
              telefono: "7228795076", idCurso: 1, idServicio: 0, participantes: 1, lugarCurso: "Local",
              tipoCursoCliente: "Cerrado", lugarServicio: "QA", comentarios: "simulacion caida",
              fechaDeseada: null, idContratista: 0, nombreContratista: "", folioCurso: "",
            },
            { modo: "live", origen: "qa-caida", esPrueba: true },
          );
          delete process.env["ERP_BASE_URL"];
          return Response.json(r);
        }
        const { runE2ETests } = await import("@/lib/erp-admin.server");
        return Response.json(await runE2ETests());
      },
    },
  },
});
