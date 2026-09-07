"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PostCategory } from "@/lib/supabase/types";

const POST_CATEGORIES: readonly PostCategory[] = ["question", "entraide", "discussion"];

function isPostCategory(value: string): value is PostCategory {
  return (POST_CATEGORIES as readonly string[]).includes(value);
}

export async function createPost(_prevState: unknown, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const category = String(formData.get("category") ?? "discussion");
  if (!title || !body) {
    return { error: "Titre et message sont obligatoires." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { data: program } = await supabase.from("programs").select("id").eq("slug", "data-engineering").single();

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    program_id: program?.id ?? null,
    title,
    body,
    category: isPostCategory(category) ? category : "discussion",
  });
  if (error) return { error: "Le message n'a pas pu être publié, réessaie." };

  revalidatePath("/app/communaute");
  return { success: true };
}

export async function createPostComment(postId: string, _prevState: unknown, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Le commentaire ne peut pas être vide." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase.from("post_comments").insert({ post_id: postId, author_id: user.id, body });
  if (error) return { error: "La réponse n'a pas pu être publiée, réessaie." };

  revalidatePath("/app/communaute");
  return { success: true };
}

export async function createLessonComment(
  lessonId: string,
  path: string,
  parentId: string | null,
  _prevState: unknown,
  formData: FormData
) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Le commentaire ne peut pas être vide." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase
    .from("lesson_comments")
    .insert({ lesson_id: lessonId, user_id: user.id, parent_id: parentId, body });
  if (error) return { error: "Le commentaire n'a pas pu être publié, réessaie." };

  revalidatePath(path);
  return { success: true };
}
