import { createClient } from "@/lib/supabase/server";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LivesPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, starts_at, join_url, replay_url")
    .order("starts_at", { ascending: true });

  const now = new Date();
  const upcoming = (events ?? []).filter((e) => new Date(e.starts_at) >= now);
  const past = (events ?? []).filter((e) => new Date(e.starts_at) < now).reverse();

  return (
    <main className="max-w-[720px] mx-auto w-full px-6 py-9">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Sessions en direct</h1>
      <p className="text-ink-soft text-sm mb-7">
        Live coding, Q&amp;A, corrections d&apos;exercices — en PostgreSQL + VS Code.
      </p>

      <h2 className="font-display font-bold text-sm text-ink mb-3">À venir</h2>
      <div className="flex flex-col gap-3 mb-8">
        {upcoming.length === 0 && (
          <p className="text-sm text-ink-faint">Aucun live programmé pour l&apos;instant.</p>
        )}
        {upcoming.map((e) => (
          <div key={e.id} className="border border-accent bg-accent-soft rounded-xl px-5 py-4">
            <p className="font-mono text-[11px] text-accent-ink uppercase mb-1">{formatDateTime(e.starts_at)}</p>
            <h3 className="font-semibold text-sm text-ink">{e.title}</h3>
            {e.description && <p className="text-sm text-ink-soft mt-1">{e.description}</p>}
            {e.join_url && (
              <a
                href={e.join_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-4 py-2"
              >
                Rejoindre le live →
              </a>
            )}
          </div>
        ))}
      </div>

      <h2 className="font-display font-bold text-sm text-ink mb-3">Replays</h2>
      <div className="flex flex-col gap-3">
        {past.length === 0 && <p className="text-sm text-ink-faint">Aucun replay disponible pour l&apos;instant.</p>}
        {past.map((e) => (
          <div key={e.id} className="border border-line bg-surface rounded-xl px-5 py-4">
            <p className="font-mono text-[11px] text-ink-faint uppercase mb-1">{formatDateTime(e.starts_at)}</p>
            <h3 className="font-semibold text-sm text-ink">{e.title}</h3>
            {e.description && <p className="text-sm text-ink-soft mt-1">{e.description}</p>}
            {e.replay_url ? (
              <a
                href={e.replay_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2.5 text-xs font-semibold text-accent-ink border border-line-strong rounded-lg px-3.5 py-1.5 hover:border-accent"
              >
                Voir le replay →
              </a>
            ) : (
              <p className="text-xs text-ink-faint mt-2">Replay pas encore disponible.</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
