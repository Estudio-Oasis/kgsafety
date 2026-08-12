import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { PortalDataset, Role } from "@/data/portal";

export type PortalProfile = {
  id: string;
  email: string;
  fullName: string;
  companySlug: string | null;
  requestedCompanySlug: string | null;
  status: "pending" | "approved" | "rejected";
};

export type PortalBootstrap = {
  profile: PortalProfile;
  role: Role | null;
  isAdmin: boolean;
  dataset: PortalDataset | null;
};

const ROLE_MAP: Record<string, Role> = {
  admin_kg: "admin-kg",
  equipo_kg: "equipo-kg",
  cliente_corp: "cliente-corp",
  cliente_planta: "cliente-planta",
};
const ROLE_PRIORITY = ["admin_kg", "equipo_kg", "cliente_corp", "cliente_planta"];

export const getPortalBootstrap = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortalBootstrap> => {
    const { supabase, userId } = context;

    const [{ data: profileRow }, { data: roleRows }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, company_slug, requested_company_slug, status")
        .eq("id", userId)
        .maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);

    const profile: PortalProfile = {
      id: userId,
      email: profileRow?.email ?? "",
      fullName: profileRow?.full_name ?? "",
      companySlug: profileRow?.company_slug ?? null,
      requestedCompanySlug: profileRow?.requested_company_slug ?? null,
      status: (profileRow?.status ?? "pending") as PortalProfile["status"],
    };

    const dbRoles = (roleRows ?? []).map((r) => String(r.role));
    const topRole = ROLE_PRIORITY.find((r) => dbRoles.includes(r));
    const role: Role | null =
      profile.status === "approved" ? (topRole ? ROLE_MAP[topRole] : "cliente-corp") : null;

    if (profile.status !== "approved") {
      return { profile, role: null, isAdmin: false, dataset: null };
    }

    const [companies, plants, systems, projects, certifications, documents, workers, library, requests] =
      await Promise.all([
        supabase.from("companies").select("slug, name, industry"),
        supabase.from("plants").select("slug, company_slug, name, location, industry, responsable, email"),
        supabase.from("systems").select("id, plant_slug, type, ubicacion, metros, norma"),
        supabase
          .from("projects")
          .select("id, name, type, company_slug, plant_slug, fecha, responsable, status, descripcion"),
        supabase.from("certifications").select("id, system_id, plant_slug, ultima, vencimiento"),
        supabase.from("documents").select("id, type, name, project_id, plant_slug, fecha, size_label").limit(2000),
        supabase.from("workers").select("id, nombre, puesto, plant_slug, curso, dc3, emision, vencimiento, instructor"),
        supabase.from("library_docs").select("id, category, name, fecha, size_label"),
        supabase.from("service_requests").select("id, fecha, plant_slug, tipo, descripcion, status, solicitante"),
      ]);

    const plantRows = plants.data ?? [];
    const dataset: PortalDataset = {
      clients: (companies.data ?? []).map((c) => ({
        slug: c.slug,
        name: c.name,
        industry: c.industry,
        plants: plantRows.filter((p) => p.company_slug === c.slug).length,
      })),
      plants: plantRows.map((p) => ({
        slug: p.slug,
        name: p.name,
        clientSlug: p.company_slug,
        location: p.location,
        industry: p.industry,
        responsable: p.responsable,
        email: p.email,
      })),
      systems: (systems.data ?? []).map((s) => ({
        id: s.id,
        plantSlug: s.plant_slug,
        type: s.type,
        ubicacion: s.ubicacion,
        metros: s.metros ?? undefined,
        norma: s.norma,
      })),
      projects: (projects.data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type as PortalDataset["projects"][number]["type"],
        clientSlug: p.company_slug,
        plantSlug: p.plant_slug,
        fecha: p.fecha,
        responsable: p.responsable,
        status: p.status as PortalDataset["projects"][number]["status"],
        descripcion: p.descripcion,
      })),
      certifications: (certifications.data ?? []).map((c) => ({
        id: c.id,
        systemId: c.system_id,
        plantSlug: c.plant_slug,
        ultima: c.ultima,
        vencimiento: c.vencimiento,
      })),
      documents: (documents.data ?? []).map((d) => ({
        id: d.id,
        type: d.type as PortalDataset["documents"][number]["type"],
        name: d.name,
        projectId: d.project_id,
        plantSlug: d.plant_slug,
        fecha: d.fecha,
        size: d.size_label,
      })),
      workers: (workers.data ?? []).map((w) => ({
        id: w.id,
        nombre: w.nombre,
        puesto: w.puesto,
        plantSlug: w.plant_slug,
        curso: w.curso,
        dc3: w.dc3,
        emision: w.emision,
        vencimiento: w.vencimiento,
        instructor: w.instructor,
      })),
      library: (library.data ?? []).map((l) => ({
        id: l.id,
        category: l.category,
        name: l.name,
        fecha: l.fecha,
        size: l.size_label,
      })),
      serviceRequests: (requests.data ?? []).map((r) => ({
        id: r.id,
        fecha: r.fecha,
        plantSlug: r.plant_slug,
        tipo: r.tipo,
        descripcion: r.descripcion,
        status: r.status as PortalDataset["serviceRequests"][number]["status"],
        solicitante: r.solicitante,
      })),
    };

    return { profile, role, isAdmin: topRole === "admin_kg", dataset };
  });

// ============= SOLICITUDES DE SERVICIO =============
export const createServiceRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { plantSlug: string; tipo: string; descripcion: string }) => {
    const plantSlug = String(input.plantSlug ?? "").trim().slice(0, 80);
    const tipo = String(input.tipo ?? "").trim().slice(0, 80);
    const descripcion = String(input.descripcion ?? "").trim().slice(0, 1000);
    if (!plantSlug || !tipo) throw new Error("Planta y tipo de servicio son obligatorios.");
    return { plantSlug, tipo, descripcion };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, status")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.status !== "approved") throw new Error("Cuenta pendiente de aprobación.");

    const { error } = await supabase.from("service_requests").insert({
      plant_slug: data.plantSlug,
      tipo: data.tipo,
      descripcion: data.descripcion,
      solicitante: profile.full_name || profile.email || "Usuario del portal",
      created_by: userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============= ADMINISTRACIÓN DE ACCESOS =============
export type PortalUser = {
  id: string;
  email: string;
  fullName: string;
  companySlug: string | null;
  requestedCompanySlug: string | null;
  status: "pending" | "approved" | "rejected";
  roles: string[];
  createdAt: string;
  lastSignInAt: string | null;
  signInCount: number;
};

export const listPortalUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortalUser[]> => {
    const { supabase } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: context.userId, _role: "admin_kg" });
    if (!isAdmin) throw new Error("Forbidden");
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, company_slug, requested_company_slug, status, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    // Actividad de acceso (solo lectura administrativa)
    const activity = new Map<string, { lastSignInAt: string | null; signInCount: number }>();
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      for (const u of authUsers?.users ?? []) {
        const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
        activity.set(u.id, {
          lastSignInAt: u.last_sign_in_at ?? null,
          signInCount: Number(meta["sign_in_count"] ?? 0) || (u.last_sign_in_at ? 1 : 0),
        });
      }
    } catch {
      // si no hay acceso administrativo, seguimos sin datos de actividad
    }

    return (profiles ?? []).map((p) => ({
      id: p.id,
      email: p.email,
      fullName: p.full_name,
      companySlug: p.company_slug,
      requestedCompanySlug: p.requested_company_slug,
      status: p.status as PortalUser["status"],
      roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => String(r.role)),
      createdAt: p.created_at,
      lastSignInAt: activity.get(p.id)?.lastSignInAt ?? null,
      signInCount: activity.get(p.id)?.signInCount ?? 0,
    }));
  });


export const setPortalUserAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      userId: string;
      status: "pending" | "approved" | "rejected";
      role: "admin_kg" | "equipo_kg" | "cliente_corp" | "cliente_planta" | null;
      companySlug: string | null;
    }) => {
      if (!input.userId) throw new Error("Usuario inválido.");
      if (!["pending", "approved", "rejected"].includes(input.status)) throw new Error("Estado inválido.");
      if (
        input.role !== null &&
        !["admin_kg", "equipo_kg", "cliente_corp", "cliente_planta"].includes(input.role)
      ) {
        throw new Error("Rol inválido.");
      }
      return input;
    },
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin_kg" });
    if (!isAdmin) throw new Error("Forbidden");
    if (data.userId === context.userId && data.role !== "admin_kg") {
      throw new Error("No puedes quitarte tu propio acceso de administrador.");
    }
    const isClientRole = data.role === "cliente_corp" || data.role === "cliente_planta";
    if (data.status === "approved" && isClientRole && !data.companySlug) {
      throw new Error("Los usuarios cliente requieren una empresa asignada.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        status: data.status,
        company_slug: isClientRole ? data.companySlug : null,
      })
      .eq("id", data.userId);
    if (profileError) throw new Error(profileError.message);

    const { error: delError } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    if (delError) throw new Error(delError.message);

    if (data.role && data.status === "approved") {
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: data.userId, role: data.role });
      if (roleError) throw new Error(roleError.message);
    }
    return { ok: true };
  });

export const listCompanyOptions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin_kg" });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("companies").select("slug, name").order("name");
    return data ?? [];
  });

// ============= ALTA DIRECTA DE USUARIOS (INVITACIÓN) =============
export type InviteResult = {
  ok: true;
  email: string;
  tempPassword: string;
  loginUrl: string;
  created: boolean;
};

export const invitePortalUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      email: string;
      fullName: string;
      role: "admin_kg" | "equipo_kg" | "cliente_corp" | "cliente_planta";
      companySlug: string | null;
      origin?: string;
    }) => {
      const email = String(input.email ?? "").trim().toLowerCase().slice(0, 160);
      const fullName = String(input.fullName ?? "").trim().slice(0, 120);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new Error("Correo inválido.");
      if (!["admin_kg", "equipo_kg", "cliente_corp", "cliente_planta"].includes(input.role)) {
        throw new Error("Rol inválido.");
      }
      const isClient = input.role === "cliente_corp" || input.role === "cliente_planta";
      const companySlug = input.companySlug ? String(input.companySlug).trim().slice(0, 80) : null;
      if (isClient && !companySlug) throw new Error("Los usuarios cliente requieren una empresa asignada.");
      return { email, fullName, role: input.role, companySlug: isClient ? companySlug : null, origin: input.origin ?? "" };
    },
  )
  .handler(async ({ data, context }): Promise<InviteResult> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin_kg",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Contraseña temporal robusta; el usuario la cambia al entrar.
    const tempPassword = `KG-${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}!7`;

    let userId: string | null = null;
    let created = false;

    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });

    if (createdUser?.user) {
      userId = createdUser.user.id;
      created = true;
    } else {
      const message = createError?.message ?? "";
      const alreadyExists = /already|registered|exists/i.test(message);
      if (!alreadyExists) throw new Error(message || "No fue posible crear el usuario.");
      // Ya existe: localizamos su perfil y le reponemos la contraseña temporal.
      const { data: existing } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", data.email)
        .maybeSingle();
      if (!existing) throw new Error("El correo ya existe pero no tiene perfil asociado.");
      userId = existing.id;
      const { error: updError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: tempPassword,
        email_confirm: true,
      });
      if (updError) throw new Error(updError.message);
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          email: data.email,
          full_name: data.fullName,
          status: "approved",
          company_slug: data.companySlug,
        },
        { onConflict: "id" },
      );
    if (profileError) throw new Error(profileError.message);

    await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: data.role });
    if (roleError) throw new Error(roleError.message);

    const base = data.origin || "https://kgsafety.lovable.app";
    return { ok: true, email: data.email, tempPassword, loginUrl: `${base}/portal/login`, created };
  });

// ============= RESTABLECER ACCESO DE UN USUARIO EXISTENTE =============
export const resetPortalUserAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; fullName?: string; origin?: string }) => {
    const userId = String(input.userId ?? "").trim();
    if (!userId) throw new Error("Usuario inválido.");
    return {
      userId,
      fullName: input.fullName ? String(input.fullName).trim().slice(0, 120) : "",
      origin: input.origin ?? "",
    };
  })
  .handler(async ({ data, context }): Promise<InviteResult> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin_kg",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", data.userId)
      .maybeSingle();
    if (!profile) throw new Error("No encontramos el perfil de este usuario.");

    const tempPassword = `KG-${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}!7`;
    const { error: updError } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: tempPassword,
      email_confirm: true,
    });
    if (updError) throw new Error(updError.message);

    if (data.fullName && data.fullName !== profile.full_name) {
      const { error: nameError } = await supabaseAdmin
        .from("profiles")
        .update({ full_name: data.fullName })
        .eq("id", data.userId);
      if (nameError) throw new Error(nameError.message);
    }

    const base = data.origin || "https://kgsafety.lovable.app";
    return {
      ok: true,
      email: profile.email,
      tempPassword,
      loginUrl: `${base}/portal/login`,
      created: false,
    };
  });

