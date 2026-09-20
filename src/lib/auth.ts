import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminSession() {
  if (!hasSupabaseConfig()) return null;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;

  if (error || !userId) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || profile?.is_admin !== true) return null;

  return { supabase, userId };
}

export async function requireAdmin() {
  if (!hasSupabaseConfig()) redirect("/acceso?motivo=configuracion");

  const session = await getAdminSession();
  if (!session) redirect("/acceso?motivo=sesion");

  return session;
}
