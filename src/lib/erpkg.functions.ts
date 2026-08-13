import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const listSchema = z.object({
  buscar: z.string().trim().max(120).optional(),
  limite: z.number().int().min(1).max(500).optional(),
});

export type ErpClientRow = {
  id: string;
  legacy_id: string | null;
  code: string | null;
  commercial_name: string | null;
  legal_name: string | null;
  tax_id: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  active: boolean;
};

export type ErpCourseRow = {
  id: string;
  legacy_id: string | null;
  code: string | null;
  name: string;
  duration_text_legacy: string | null;
  local_unit_price: number | null;
  travel_unit_price: number | null;
  visible_on_web: boolean;
  active: boolean;
};

export type ErpRequestRow = {
  id: string;
  code: string | null;
  request_date: string | null;
  participant_count: number | null;
  travel_mode: string | null;
  delivery_type: string | null;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  status: string | null;
  comments: string | null;
};

export type ErpQuoteRow = {
  id: string;
  code: string | null;
  quote_date: string | null;
  valid_until: string | null;
  origin: string | null;
  delivery_type: string | null;
  travel_mode: string | null;
  location: string | null;
  currency: string | null;
  subtotal: number | null;
  total: number | null;
  status: string | null;
};

export type ErpParticipantRow = {
  id: string;
  curp: string | null;
  given_names: string | null;
  paternal_surname: string | null;
  maternal_surname: string | null;
  position: string | null;
  employer_commercial_name: string | null;
  employer_tax_id: string | null;
};

export type ErpKgStats = {
  clients: number;
  courses: number;
  requests: number;
  quotes: number;
  quoteLines: number;
  participants: number;
  enrollments: number;
  sessions: number;
  suppliers: number;
  contractors: number;
  quotedTotal: number;
};

async function assertStaff(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("admin_kg") && !roles.includes("equipo_kg")) {
    throw new Error("No autorizado");
  }
}

export const erpKgStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ErpKgStats> => {
    await assertStaff(context.supabase, context.userId);
    const count = async (table: string) => {
      const { count: c, error } = await context.supabase
        .from(table)
        .select("id", { count: "exact", head: true });
      if (error) throw new Error(`${table}: ${error.message}`);
      return c ?? 0;
    };
    const [
      clients,
      courses,
      requests,
      quotes,
      quoteLines,
      participants,
      enrollments,
      sessions,
      suppliers,
      contractors,
    ] = await Promise.all([
      count("clients"),
      count("courses"),
      count("quote_requests"),
      count("quotes"),
      count("quote_lines"),
      count("participants"),
      count("enrollments"),
      count("course_sessions"),
      count("suppliers"),
      count("contractors"),
    ]);
    const { data: totals, error: totalsError } = await context.supabase
      .from("quotes")
      .select("total");
    if (totalsError) throw new Error(totalsError.message);
    const quotedTotal = (totals ?? []).reduce(
      (acc: number, row: { total: number | null }) => acc + Number(row.total ?? 0),
      0,
    );
    return {
      clients,
      courses,
      requests,
      quotes,
      quoteLines,
      participants,
      enrollments,
      sessions,
      suppliers,
      contractors,
      quotedTotal,
    };
  });

export const erpKgClients = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => listSchema.parse(data ?? {}))
  .handler(async ({ context, data }): Promise<ErpClientRow[]> => {
    await assertStaff(context.supabase, context.userId);
    let query = context.supabase
      .from("clients")
      .select(
        "id,legacy_id,code,commercial_name,legal_name,tax_id,email,phone,city,state,active",
      )
      .order("commercial_name", { ascending: true })
      .limit(data.limite ?? 300);
    if (data.buscar) {
      const term = `%${data.buscar}%`;
      query = query.or(
        `commercial_name.ilike.${term},legal_name.ilike.${term},tax_id.ilike.${term},email.ilike.${term}`,
      );
    }
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows ?? []) as ErpClientRow[];
  });

export const erpKgCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => listSchema.parse(data ?? {}))
  .handler(async ({ context, data }): Promise<ErpCourseRow[]> => {
    await assertStaff(context.supabase, context.userId);
    let query = context.supabase
      .from("courses")
      .select(
        "id,legacy_id,code,name,duration_text_legacy,local_unit_price,travel_unit_price,visible_on_web,active",
      )
      .order("name", { ascending: true })
      .limit(data.limite ?? 200);
    if (data.buscar) query = query.ilike("name", `%${data.buscar}%`);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows ?? []) as ErpCourseRow[];
  });

export const erpKgRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ErpRequestRow[]> => {
    await assertStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("quote_requests")
      .select(
        "id,code,request_date,participant_count,travel_mode,delivery_type,location,contact_email,contact_phone,status,comments",
      )
      .order("request_date", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as ErpRequestRow[];
  });

export const erpKgQuotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ErpQuoteRow[]> => {
    await assertStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("quotes")
      .select(
        "id,code,quote_date,valid_until,origin,delivery_type,travel_mode,location,currency,subtotal,total,status",
      )
      .order("quote_date", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as ErpQuoteRow[];
  });

export const erpKgParticipants = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ErpParticipantRow[]> => {
    await assertStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("participants")
      .select(
        "id,curp,given_names,paternal_surname,maternal_surname,position,employer_commercial_name,employer_tax_id",
      )
      .order("paternal_surname", { ascending: true })
      .limit(300);
    if (error) throw new Error(error.message);
    return (data ?? []) as ErpParticipantRow[];
  });
