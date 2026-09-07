"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addNote(lessonId: string, path: string, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase.from("notes").insert({ user_id: user.id, lesson_id: lessonId, body });
  if (error) throw new Error("La note n'a pas pu être enregistrée, réessaie.");
  revalidatePath(path);
}

export async function markLessonComplete(lessonId: string, nextHref: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase
    .from("progress")
    .upsert({ user_id: user.id, lesson_id: lessonId }, { onConflict: "user_id,lesson_id" });
  if (error) throw new Error("La progression n'a pas pu être enregistrée, réessaie.");

  redirect(nextHref);
}

export type QuizResult = {
  score: number;
  total: number;
  passed: boolean;
  perQuestion: { correct: boolean; correctIndex: number | null; explain: string | null }[];
  certificateSlug?: string;
};

const PASS_THRESHOLD = 0.8;

export async function submitQuiz(params: {
  lessonId?: string;
  moduleId?: string;
  answers: (number | null)[];
  /** Résultat pass/fail calculé côté client pour les questions "code" —
   * le serveur ne peut pas rejouer une requête contre le bac à sable
   * PGlite de l'apprenant (il vit uniquement dans son navigateur). */
  codeResults?: Record<number, boolean>;
}): Promise<QuizResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const query = supabase
    .from("quiz_questions")
    .select("id, question_type, correct_index, explain")
    .order("sort_order");
  const { data: questions } = params.lessonId
    ? await query.eq("lesson_id", params.lessonId)
    : await query.eq("module_id", params.moduleId!);

  if (!questions || questions.length === 0) {
    throw new Error("Aucune question trouvée pour ce quiz");
  }

  const perQuestion = questions.map((q, i) => ({
    correct:
      q.question_type === "code"
        ? params.codeResults?.[i] === true
        : params.answers[i] === q.correct_index,
    correctIndex: q.correct_index,
    explain: q.explain,
  }));
  const score = perQuestion.filter((q) => q.correct).length;
  const total = questions.length;
  const passed = score / total >= PASS_THRESHOLD;

  const { error: attemptError } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    lesson_id: params.lessonId ?? null,
    module_id: params.moduleId ?? null,
    score,
    total,
    passed,
  });
  if (attemptError) throw new Error("Le résultat du quiz n'a pas pu être enregistré, réessaie.");

  let certificateSlug: string | undefined;

  if (passed && params.moduleId) {
    const { data: existing } = await supabase
      .from("certificates")
      .select("public_slug")
      .eq("user_id", user.id)
      .eq("module_id", params.moduleId)
      .maybeSingle();

    if (existing) {
      certificateSlug = existing.public_slug;
    } else {
      const slug = randomUUID().replace(/-/g, "").slice(0, 16);
      const { error } = await supabase
        .from("certificates")
        .insert({ user_id: user.id, module_id: params.moduleId, public_slug: slug });
      if (!error) certificateSlug = slug;
    }
  }

  return { score, total, passed, perQuestion, certificateSlug };
}
