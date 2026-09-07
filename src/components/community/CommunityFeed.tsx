"use client";

import { useActionState, useState } from "react";
import { createPost, createPostComment } from "@/lib/actions/community";

type Comment = { id: string; body: string; created_at: string; authorName: string };
type Post = {
  id: string;
  category: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
};

const CATEGORY_STYLES: Record<string, string> = {
  annonce: "text-amber bg-amber-soft",
  question: "text-accent-ink bg-accent-soft",
  entraide: "text-success bg-success-soft",
  discussion: "text-ink-faint bg-surface-2 border border-line",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function PostComposer() {
  const [state, formAction, pending] = useActionState(createPost, null);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left text-sm text-ink-faint border border-dashed border-line-strong rounded-xl px-4 py-3 hover:border-accent hover:text-ink-soft"
      >
        Écrire un message à la communauté…
      </button>
    );
  }

  return (
    <form
      action={(fd) => {
        formAction(fd);
        setOpen(false);
      }}
      className="border border-line bg-surface rounded-xl p-4 flex flex-col gap-3"
    >
      <div className="flex gap-2">
        {[
          { value: "question", label: "Question" },
          { value: "entraide", label: "Entraide" },
          { value: "discussion", label: "Discussion" },
        ].map((c) => (
          <label key={c.value} className="flex items-center gap-1.5 text-xs text-ink-soft">
            <input type="radio" name="category" value={c.value} defaultChecked={c.value === "discussion"} />
            {c.label}
          </label>
        ))}
      </div>
      <input
        name="title"
        placeholder="Titre"
        required
        className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink bg-surface outline-none focus:border-accent"
      />
      <textarea
        name="body"
        placeholder="Ton message…"
        required
        className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink bg-surface outline-none focus:border-accent resize-none h-20"
      />
      {state?.error && <p className="text-xs text-danger">{state.error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent hover:bg-accent-strong disabled:opacity-60 text-white font-semibold text-sm rounded-lg px-4 py-2"
        >
          {pending ? "Publication…" : "Publier"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-ink-faint hover:text-ink px-2"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export function PostThread({
  post,
  categoryLabel,
  authorName,
  comments,
  currentUserId,
}: {
  post: Post;
  categoryLabel: string;
  authorName: string;
  comments: Comment[];
  currentUserId?: string;
}) {
  return (
    <div className="border border-line bg-surface rounded-xl px-4 py-3.5">
      <div className="flex items-center gap-2 mb-1.5">
        {post.pinned && <span className="text-xs">📌</span>}
        <span className={`font-mono text-[10px] uppercase rounded-full px-2 py-0.5 ${CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.discussion}`}>
          {categoryLabel}
        </span>
        <span className="text-xs text-ink-faint">
          {authorName} · {formatDate(post.created_at)}
        </span>
      </div>
      <h3 className="font-semibold text-sm text-ink mb-1">{post.title}</h3>
      <p className="text-sm text-ink-soft whitespace-pre-wrap mb-2.5">{post.body}</p>

      <details className="group">
        <summary className="text-xs font-medium text-accent-ink cursor-pointer list-none inline-flex items-center gap-1">
          {comments.length > 0 ? `${comments.length} réponse${comments.length > 1 ? "s" : ""}` : "Répondre"}
        </summary>
        <div className="mt-3 flex flex-col gap-2.5 pl-3 border-l border-line">
          {comments.map((c) => (
            <div key={c.id}>
              <p className="text-xs text-ink-faint">
                {c.authorName} · {formatDate(c.created_at)}
              </p>
              <p className="text-sm text-ink-soft whitespace-pre-wrap">{c.body}</p>
            </div>
          ))}
          {currentUserId && <CommentForm postId={post.id} />}
        </div>
      </details>
    </div>
  );
}

function CommentForm({ postId }: { postId: string }) {
  const [state, formAction, pending] = useActionState(createPostComment.bind(null, postId), null);
  return (
    <form action={formAction} className="flex gap-2 mt-1">
      <input
        name="body"
        placeholder="Ta réponse…"
        required
        className="flex-1 border border-line-strong rounded-lg px-3 py-1.5 text-sm text-ink bg-surface outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-semibold text-accent-ink border border-line-strong rounded-md px-3 py-1.5 hover:border-accent disabled:opacity-60"
      >
        {pending ? "…" : "Envoyer"}
      </button>
      {state?.error && <p className="text-xs text-danger self-center">{state.error}</p>}
    </form>
  );
}
