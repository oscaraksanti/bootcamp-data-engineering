import { createClient } from "@/lib/supabase/server";
import { deleteEvent, saveEvent } from "@/lib/actions/admin";

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*").order("starts_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Lives & événements</h1>

      <details className="border border-dashed border-line-strong rounded-lg px-4 py-3 mb-6">
        <summary className="text-sm font-semibold text-accent-ink cursor-pointer">+ Nouveau live</summary>
        <form action={saveEvent.bind(null, null)} className="flex flex-col gap-3 mt-3">
          <input name="title" placeholder="Titre du live" required className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink" />
          <textarea name="description" placeholder="Description (optionnel)" className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink resize-none h-20" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1.5">Date et heure</label>
              <input type="datetime-local" name="starts_at" required className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1.5">Lien pour rejoindre</label>
              <input name="join_url" type="url" className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink" />
            </div>
          </div>
          <input name="replay_url" type="url" placeholder="Lien du replay (une fois disponible)" className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink" />
          <button type="submit" className="self-start text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-5 py-2.5">
            Planifier
          </button>
        </form>
      </details>

      <div className="flex flex-col gap-3">
        {(events ?? []).length === 0 && <p className="text-sm text-ink-faint">Aucun live planifié.</p>}
        {(events ?? []).map((e) => (
          <div key={e.id} className="border border-line bg-surface rounded-xl px-5 py-4 flex items-start justify-between">
            <div>
              <p className="font-mono text-xs text-accent-ink mb-1">
                {new Date(e.starts_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
              </p>
              <h3 className="font-display font-bold text-sm text-ink">{e.title}</h3>
              {e.description && <p className="text-sm text-ink-soft mt-1">{e.description}</p>}
            </div>
            <form action={deleteEvent.bind(null, e.id)}>
              <button type="submit" className="text-xs text-danger hover:underline">
                Supprimer
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
