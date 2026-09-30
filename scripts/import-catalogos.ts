/**
 * Importador de catálogos a Supabase (cotizador propio).
 *
 * Lee los cursos y servicios REALES del sitio (src/data/kaee.ts) y los sube a
 * Supabase (tablas courses / services de la org KGSAFETY), usando el slug como
 * legacy_id. Al final resuelve los paquetes de precios (resolve_price_package_courses),
 * que enlazan cada paquete con su curso por legacy_id.
 *
 * Uso:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... bun run scripts/import-catalogos.ts
 *
 * Es idempotente: se puede correr varias veces (upsert por organization_id+legacy_id).
 */

import { createClient } from "@supabase/supabase-js";
import { COURSES, ENGINEERING } from "../src/data/kaee";

const ORG_CODE = process.env["IMPORT_ORG_CODE"] || "KGSAFETY";

/** "$1,355.00 MXN + IVA" -> 1355.00 ; devuelve null si no hay número. */
function parseMoney(v?: string | null): number | null {
  if (!v) return null;
  const m = v.replace(/[^0-9.]/g, "");
  if (!m) return null;
  const n = Number(m);
  return Number.isFinite(n) ? n : null;
}

/** "8 horas" -> 480 ; "24 horas" -> 1440 ; null si no aplica. */
function parseDurationMinutes(v?: string | null): number | null {
  if (!v) return null;
  const m = v.match(/(\d+(?:\.\d+)?)\s*h/i);
  if (!m) return null;
  const horas = Number(m[1]);
  return Number.isFinite(horas) ? Math.round(horas * 60) : null;
}

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    console.error(`\n[import] Falta la variable de entorno ${name}.`);
    console.error(
      "[import] Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... bun run scripts/import-catalogos.ts\n",
    );
    process.exit(1);
  }
  return val;
}

async function main() {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  // 1) Resolver la organización.
  const { data: org, error: orgErr } = await db
    .from("organizations")
    .select("id,code")
    .eq("code", ORG_CODE)
    .maybeSingle();
  if (orgErr) throw orgErr;
  if (!org) throw new Error(`Organización ${ORG_CODE} no encontrada.`);
  const organization_id = org.id as string;
  console.log(`[import] Organización ${ORG_CODE} = ${organization_id}`);

  // 2) Cursos.
  const courseRows = COURSES.filter((c) => c.active !== false).map((c) => {
    const local = parseMoney(c.precioLocalPersona);
    const foraneoExtra = parseMoney(c.foraneoPersona);
    return {
      organization_id,
      legacy_id: c.slug,
      name: c.name,
      duration_text_legacy: c.duracion ?? null,
      duration_minutes: parseDurationMinutes(c.duracion),
      local_unit_price: local,
      travel_unit_price: local !== null && foraneoExtra !== null ? local + foraneoExtra : local,
      visible_on_web: true,
      active: true,
    };
  });

  const { error: cErr } = await db
    .from("courses")
    .upsert(courseRows, { onConflict: "organization_id,legacy_id" });
  if (cErr) throw cErr;
  console.log(`[import] Cursos importados/actualizados: ${courseRows.length}`);

  // 3) Servicios de ingeniería.
  const serviceRows = ENGINEERING.map((s) => ({
    organization_id,
    legacy_id: s.slug,
    name: s.name,
    description: s.desc,
    service_type: "ingenieria",
    active: true,
  }));
  const { error: sErr } = await db
    .from("services")
    .upsert(serviceRows, { onConflict: "organization_id,legacy_id" });
  if (sErr) throw sErr;
  console.log(`[import] Servicios importados/actualizados: ${serviceRows.length}`);

  // 4) Resolver los paquetes de precios (course_id por legacy_id).
  const { data: resolved, error: rErr } = await db.rpc("resolve_price_package_courses", {
    p_org_code: ORG_CODE,
  });
  if (rErr) throw rErr;
  console.log(`[import] Paquetes de precios enlazados a un curso: ${resolved ?? 0}`);

  console.log("[import] Listo. El catálogo del cotizador propio está sincronizado.");
}

main().catch((e) => {
  console.error("[import] Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
