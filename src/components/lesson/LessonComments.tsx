"use client";

import { useActionState, useState } from "react";
import { createLessonComment } from "@/lib/actions/community";

export type LessonCommentItem = {
  id: string;
  body: string;
  created_at: string;
  parent_id: string | null;
  authorName: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function LessonComments({
  lessonId,
  path,
  comments,
}: {
  lessonId: string;
  path: string;
  comments: LessonCommentItem[];
}) {
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesByParent = new Map<string, LessonCommentItem[]>();
  for (const c of comments) {
    if (!c.parent_id) continue;
    if (!repliesByParent.has(c.parent_id)) repliesByParent.set(c.parent_id, []);
    repliesByParent.get(c.parent_id)!.push(c);
  }

  return (
    <section className="mt-9 border-t border-line pt-7">
      <h3 className="font-display font-bold text-lg text-ink mb-4">
        Discussion {comments.length > 0 && `(${comments.length})`}
      </h3>

      <CommentForm lessonId={lessonId} path={path} parentId={null} placeholder="Pose une question sur cette leçon…" />

      <div className="flex flex-col gap-4 mt-5">
        {topLevel.map((c) => (
          <div key={c.id} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
            <p className="text-xs text-ink-faint mb-1">
              {c.authorName} · {formatDate(c.created_at)}
            </p>
            <p className="text-sm text-ink-soft whitespace-pre-wrap">{c.body}</p>

            <div className="flex flex-col gap-2.5 mt-2.5 pl-4 border-l border-line">
              {(repliesByParent.get(c.id) ?? []).map((r) => (
                <div key={r.id}>
                  <p className="text-xs text-ink-faint mb-0.5">
                    {r.authorName} · {formatDate(r.created_at)}
                  </p>
                  <p className="text-sm text-ink-soft whitespace-pre-wrap">{r.body}</p>
                </div>
              ))}
              <ReplyToggle lessonId={lessonId} path={path} parentId={c.id} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReplyToggle({ lessonId, path, parentId }: { lessonId: string; path: string; parentId: string }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-medium text-accent-ink self-start">
        Répondre
      </button>
    );
  }
  return <CommentForm lessonId={lessonId} path={path} parentId={parentId} placeholder="Ta réponse…" compact />;
}

function CommentForm({
  lessonId,
  path,
  parentId,
  placeholder,
  compact,
}: {
  lessonId: string;
  path: string;
  parentId: string | null;
  placeholder: string;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    createLessonComment.bind(null, lessonId, path, parentId),
    null
  );
  return (
    <form action={formAction} className={`flex gap-2 ${compact ? "" : "mb-2"}`}>
      <input
        name="body"
        placeholder={placeholder}
        required
        className="flex-1 border border-line-strong rounded-lg px-3 py-1.5 text-sm text-ink bg-surface outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-semibold text-accent-ink border border-line-strong rounded-md px-3 py-1.5 hover:border-accent disabled:opacity-60 flex-none"
      >
        {pending ? "…" : "Envoyer"}
      </button>
      {state?.error && <p className="text-xs text-danger self-center">{state.error}</p>}
    </form>
  );
}
