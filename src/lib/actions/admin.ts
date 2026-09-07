"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ContentStatus, Database } from "@/lib/supabase/types";

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
    certificate_blurb: String(formData.get("certificate_blurb") ?? "").trim() || null,
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
  parentLessonId: string | null,
  formData: FormData
) {
  const supabase = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const payload = {
    module_id: moduleId,
    parent_lesson_id: parentLessonId,
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

  const questionType: "multiple_choice" | "code" =
    formData.get("question_type") === "code" ? "code" : "multiple_choice";
  const isCode = questionType === "code";

  const options = [
    String(formData.get("option_0") ?? ""),
    String(formData.get("option_1") ?? ""),
    String(formData.get("option_2") ?? ""),
  ].filter(Boolean);

  const payload = {
    lesson_id: lessonId || null,
    module_id: lessonId ? null : moduleId,
    question: String(formData.get("question") ?? ""),
    question_type: questionType,
    options: isCode ? null : options,
    correct_index: isCode ? null : Number(formData.get("correct_index") ?? 0),
    starter_query: isCode ? String(formData.get("starter_query") ?? "").trim() || null : null,
    expected_query: isCode ? String(formData.get("expected_query") ?? "").trim() || null : null,
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

// ============================================================ CERTIFICATS
export async function revokeCertificate(certId: string) {
  const supabase = await requireAdmin();
  await supabase.from("certificates").delete().eq("id", certId);
  revalidatePath("/admin/certificates");
}

export async function issueCertificateManually(formData: FormData) {
  const { randomUUID } = await import("crypto");
  const supabase = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const moduleId = String(formData.get("module_id") ?? "") || null;
  if (!userId) return;

  await supabase.from("certificates").insert({
    user_id: userId,
    module_id: moduleId,
    public_slug: randomUUID().replace(/-/g, "").slice(0, 16),
  });
  revalidatePath("/admin/certificates");
}

// ============================================================ ANNONCES
export async function savePost(postId: string | null, formData: FormData) {
  const supabase = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    category: String(formData.get("category") ?? "annonce") as
      | "annonce"
      | "question"
      | "entraide"
      | "discussion",
    pinned: formData.get("pinned") === "on",
  };

  if (postId) {
    await supabase.from("posts").update(payload).eq("id", postId);
  } else {
    await supabase.from("posts").insert({ ...payload, author_id: user!.id });
  }
  revalidatePath("/admin/posts");
}

export async function deletePost(postId: string) {
  const supabase = await requireAdmin();
  await supabase.from("posts").delete().eq("id", postId);
  revalidatePath("/admin/posts");
}

// ============================================================ OFFRES D'EMPLOI
export async function saveJob(jobId: string | null, formData: FormData) {
  const supabase = await requireAdmin();
  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim() || null,
    remote: formData.get("remote") === "on",
    apply_url: String(formData.get("apply_url") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    status: (formData.get("status") === "expired" ? "expired" : "active") as "active" | "expired",
    expires_at: String(formData.get("expires_at") ?? "") || null,
  };

  if (jobId) {
    await supabase.from("jobs").update(payload).eq("id", jobId);
  } else {
    await supabase.from("jobs").insert(payload);
  }
  revalidatePath("/admin/jobs");
}

export async function toggleJobStatus(jobId: string, currentStatus: string) {
  const supabase = await requireAdmin();
  await supabase
    .from("jobs")
    .update({ status: currentStatus === "active" ? "expired" : "active" })
    .eq("id", jobId);
  revalidatePath("/admin/jobs");
}

export async function deleteJob(jobId: string) {
  const supabase = await requireAdmin();
  await supabase.from("jobs").delete().eq("id", jobId);
  revalidatePath("/admin/jobs");
}

// ============================================================ LIVES
export async function saveEvent(eventId: string | null, formData: FormData) {
  const supabase = await requireAdmin();
  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    starts_at: String(formData.get("starts_at") ?? ""),
    join_url: String(formData.get("join_url") ?? "").trim() || null,
    replay_url: String(formData.get("replay_url") ?? "").trim() || null,
  };

  if (eventId) {
    await supabase.from("events").update(payload).eq("id", eventId);
  } else {
    await supabase.from("events").insert(payload);
  }
  revalidatePath("/admin/events");
}

export async function deleteEvent(eventId: string) {
  const supabase = await requireAdmin();
  await supabase.from("events").delete().eq("id", eventId);
  revalidatePath("/admin/events");
}

// ============================================================ PARAMÈTRES
export async function saveSettings(formData: FormData) {
  const supabase = await requireAdmin();

  const patch: Database["public"]["Tables"]["platform_settings"]["Update"] = {
    brand_name: String(formData.get("brand_name") ?? "DataLendo").trim(),
    brand_accent_color: String(formData.get("brand_accent_color") ?? "").trim() || null,
    certificate_location: String(formData.get("certificate_location") ?? "").trim() || null,
  };

  // Champs write-only : on ne les écrase que si l'admin a tapé une nouvelle
  // valeur — un champ laissé vide conserve le secret déjà enregistré.
  const secretKeys = [
    "chariow_api_key",
    "chariow_webhook_secret",
    "chariow_module_product_id",
    "chariow_full_access_product_id",
  ] as const;
  for (const key of secretKeys) {
    const value = String(formData.get(key) ?? "").trim();
    if (value) patch[key] = value;
  }

  await supabase.from("platform_settings").update(patch).eq("id", true);
  revalidatePath("/admin/settings");
}
