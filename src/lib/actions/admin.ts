"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ContentStatus } from "@/lib/supabase/types";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/app");

  return supabase;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // diacritiques (é, à, ç...) après normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ============================================================ MODULES
export async function saveModule(moduleId: string | null, formData: FormData) {
  const supabase = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const payload = {
    title,
    slug: slugify(String(formData.get("slug") ?? title)),
    number: Number(formData.get("number")),
    hours_min: Number(formData.get("hours_min")),
    hours_max: Number(formData.get("hours_max")),
    is_free: formData.get("is_free") === "on",
    status: (formData.get("status") === "published" ? "published" : "draft") as ContentStatus,
    sort_order: Number(formData.get("number")),
    chariow_product_id: String(formData.get("chariow_product_id") ?? "").trim() || null,
  };

  if (moduleId) {
    await supabase.from("modules").update(payload).eq("id", moduleId);
  } else {
    const { data: program } = await supabase.from("programs").select("id").eq("slug", "data-engineering").single();
    await supabase.from("modules").insert({ ...payload, program_id: program?.id });
  }

  revalidatePath("/admin/modules");
  redirect("/admin/modules");
}

export async function toggleModuleStatus(moduleId: string, currentStatus: string) {
  const supabase = await requireAdmin();
  await supabase
    .from("modules")
    .update({ status: currentStatus === "published" ? "draft" : "published" })
    .eq("id", moduleId);
  revalidatePath("/admin/modules");
}

export async function deleteModule(moduleId: string) {
  const supabase = await requireAdmin();
  await supabase.from("modules").delete().eq("id", moduleId);
  revalidatePath("/admin/modules");
  redirect("/admin/modules");
}

// ============================================================ LEÇONS
export async function saveLesson(
  moduleId: string,
  lessonId: string | null,
  formData: FormData
) {
  const supabase = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const payload = {
    module_id: moduleId,
    title,
    slug: slugify(String(formData.get("slug") ?? title)),
    number: String(formData.get("number") ?? ""),
    duration_minutes: Number(formData.get("duration_minutes") ?? 0),
    video_id: String(formData.get("video_id") ?? "").trim() || null,
    body_html: String(formData.get("body_html") ?? ""),
    status: (formData.get("status") === "published" ? "published" : "draft") as ContentStatus,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  let savedId = lessonId;
  if (lessonId) {
    await supabase.from("lessons").update(payload).eq("id", lessonId);
  } else {
    const { data } = await supabase.from("lessons").insert(payload).select("id").single();
    savedId = data?.id ?? null;
  }

  revalidatePath(`/admin/modules/${moduleId}`);
  redirect(`/admin/modules/${moduleId}/lessons/${savedId}`);
}

export async function deleteLesson(moduleId: string, lessonId: string) {
  const supabase = await requireAdmin();
  await supabase.from("lessons").delete().eq("id", lessonId);
  revalidatePath(`/admin/modules/${moduleId}`);
  redirect(`/admin/modules/${moduleId}`);
}

// ============================================================ QUIZ
export async function saveQuizQuestion(
  lessonId: string,
  moduleId: string,
  questionId: string | null,
  formData: FormData
) {
  const supabase = await requireAdmin();

  const options = [
    String(formData.get("option_0") ?? ""),
    String(formData.get("option_1") ?? ""),
    String(formData.get("option_2") ?? ""),
  ].filter(Boolean);

  const payload = {
    lesson_id: lessonId || null,
    module_id: lessonId ? null : moduleId,
    question: String(formData.get("question") ?? ""),
    options,
    correct_index: Number(formData.get("correct_index") ?? 0),
    explain: String(formData.get("explain") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  if (questionId) {
    await supabase.from("quiz_questions").update(payload).eq("id", questionId);
  } else {
    await supabase.from("quiz_questions").insert(payload);
  }

  revalidatePath(`/admin/modules/${moduleId}/lessons/${lessonId}`);
}

export async function deleteQuizQuestion(moduleId: string, lessonId: string, questionId: string) {
  const supabase = await requireAdmin();
  await supabase.from("quiz_questions").delete().eq("id", questionId);
  revalidatePath(`/admin/modules/${moduleId}/lessons/${lessonId}`);
}

// ============================================================ APPRENANTS
export async function grantManualEntitlement(userId: string, moduleId: string | null) {
  const supabase = await requireAdmin();
  await supabase.from("entitlements").upsert(
    {
      user_id: userId,
      scope_module_id: moduleId,
      source: "admin_grant",
      expires_at: null,
    },
    { onConflict: "user_id,scope_module_id" }
  );
  revalidatePath(`/admin/learners/${userId}`);
}

export async function setUserRole(userId: string, role: "learner" | "admin") {
  const supabase = await requireAdmin();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath(`/admin/learners/${userId}`);
}
