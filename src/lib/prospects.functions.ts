import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";

const statusSchema = z.enum([
  "New",
  "Contacted",
  "Qualified",
  "Call Booked",
  "Proposal",
  "Client",
  "Not Now",
]);

export type Prospect = Tables<"prospects">;

async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) throw new Error("Unable to verify admin access");
  if (!data) throw new Error("You do not have permission to view prospects");
}

export const getAdminProspects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);

    const { data, error } = await context.supabase
      .from("prospects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error("Unable to load prospects");
    return data ?? [];
  });

export const updateAdminProspect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      status: statusSchema,
      notes: z.string().trim().max(2000),
    }),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);

    const { data: updated, error } = await context.supabase
      .from("prospects")
      .update({ status: data.status, notes: data.notes || null })
      .eq("id", data.id)
      .select("*")
      .single();

    if (error) throw new Error("Unable to update this prospect");
    return updated;
  });