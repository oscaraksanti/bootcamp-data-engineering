import { createClient } from "@/lib/supabase/server";
import { PostComposer, PostThread } from "@/components/community/CommunityFeed";

const CATEGORY_LABELS: Record<string, string> = {
  annonce: "Annonce",
  question: "Question",
  entraide: "Entraide",
  discussion: "Discussion",
};

export default async function CommunautePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, author_id, category, title, body, pinned, created_at")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const { data: comments } = await supabase
    .from("post_comments")
    .select("id, post_id, author_id, body, created_at")
    .order("created_at", { ascending: true });

  const authorIds = new Set([
    ...(posts ?? []).map((p) => p.author_id),
    ...(comments ?? []).map((c) => c.author_id),
  ]);
  const { data: profiles } = authorIds.size > 0
    ? await supabase.from("profiles").select("id, full_name").in("id", Array.from(authorIds))
    : { data: [] };
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name || "Apprenant"]));

  const commentsByPost = new Map<string, typeof comments>();
  for (const c of comments ?? []) {
    if (!commentsByPost.has(c.post_id)) commentsByPost.set(c.post_id, []);
    commentsByPost.get(c.post_id)!.push(c);
  }

  return (
    <main className="max-w-[720px] mx-auto w-full px-6 py-9">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Communauté</h1>
      <p className="text-ink-soft text-sm mb-7">
        Pose tes questions, entraide-toi avec les autres apprenants du bootcamp.
      </p>

      <PostComposer />

      <div className="flex flex-col gap-3 mt-8">
        {(posts ?? []).length === 0 && (
          <p className="text-sm text-ink-faint">Aucun message pour l&apos;instant — sois le premier à écrire.</p>
        )}
        {(posts ?? []).map((post) => (
          <PostThread
            key={post.id}
            post={post}
            categoryLabel={CATEGORY_LABELS[post.category] ?? post.category}
            authorName={nameById.get(post.author_id) ?? "Apprenant"}
            comments={(commentsByPost.get(post.id) ?? []).map((c) => ({
              ...c,
              authorName: nameById.get(c.author_id) ?? "Apprenant",
            }))}
            currentUserId={user?.id}
          />
        ))}
      </div>
    </main>
  );
}
