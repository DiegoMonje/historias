"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      status: "error",
      message: "Primero debes conectar el proyecto con Supabase.",
    };
  }

  if (!email || !password) {
    return { status: "error", message: "Introduce tu correo y contraseña." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { status: "error", message: "El correo o la contraseña no son correctos." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.is_admin !== true) {
    await supabase.auth.signOut();
    return {
      status: "error",
      message: "Esta cuenta no tiene permisos para administrar Ficción Oculta.",
    };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/acceso");
}
