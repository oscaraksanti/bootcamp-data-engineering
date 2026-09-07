"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateFullName(_prevState: unknown, formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!fullName) {
    return { error: "Le nom ne peut pas être vide." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (error) {
    return { error: "Le nom n'a pas pu être mis à jour, réessaie." };
  }

  revalidatePath("/app/profil");
  return { success: "Nom mis à jour." };
}

export async function changePassword(_prevState: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "Le mot de passe n'a pas pu être changé, réessaie." };
  }

  return { success: "Mot de passe mis à jour." };
}
