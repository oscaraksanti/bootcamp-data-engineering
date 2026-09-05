import { createClient } from "@/lib/supabase/server";
import { deletePost, savePost } from "@/lib/actions/admin";

const CATEGORY_LABEL: Record<string, string> = {
  annonce: "Annonce",
  question: "Question",
  entraide: "Entraide",
  discussion: "Discussion",
};

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Annonces & communauté</h1>

      <details className="border border-dashed border-line-strong rounded-lg px-4 py-3 mb-6" open={(posts ?? []).length === 0}>
        <summary className="text-sm font-semibold text-accent-ink cursor-pointer">+ Nouvelle publication</summary>
        <form action={savePost.bind(null, null)} className="flex flex-col gap-3 mt-3">
          <input
            name="title"
            placeholder="Titre"
            required
            className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <textarea
            name="body"
            placeholder="Contenu du message"
            required
            className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent resize-none h-24"
          />
          <div className="flex items-center gap-4">
            <select name="category" className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink">
              {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" name="pinned" />
              Mettre en avant (épinglé)
            </label>
          </div>
          <button
            type="submit"
            className="self-start text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-5 py-2.5"
          >
            Publier
          </button>
        </form>
      </details>

      <div className="flex flex-col gap-3">
        {(posts ?? []).map((p) => (
          <div key={p.id} className="border border-line bg-surface rounded-xl px-5 py-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                {p.pinned && <span className="text-[10px] font-mono uppercase bg-amber-soft text-amber rounded-full px-2 py-0.5">Épinglé</span>}
                <span className="text-[10px] font-mono uppercase text-ink-faint bg-surface-2 border border-line rounded-full px-2 py-0.5">
                  {CATEGORY_LABEL[p.category]}
                </span>
              </div>
              <form action={deletePost.bind(null, p.id)}>
                <button type="submit" className="text-xs text-danger hover:underline">
                  Supprimer
                </button>
              </form>
            </div>
            <h3 className="font-display font-bold text-sm text-ink mb-1">{p.title}</h3>
            <p className="text-sm text-ink-soft">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
