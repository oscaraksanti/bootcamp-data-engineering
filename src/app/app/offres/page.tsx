import { createClient } from "@/lib/supabase/server";

export default async function OffresPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, company, location, remote, apply_url, description, status, posted_at")
    .eq("status", "active")
    .order("posted_at", { ascending: false });

  return (
    <main className="max-w-[720px] mx-auto w-full px-6 py-9">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Offres d&apos;emploi</h1>
      <p className="text-ink-soft text-sm mb-7">
        Des opportunités partagées pour la communauté DataLendo.
      </p>

      <div className="flex flex-col gap-3">
        {(jobs ?? []).length === 0 && (
          <p className="text-sm text-ink-faint">Aucune offre active pour l&apos;instant — reviens bientôt.</p>
        )}
        {(jobs ?? []).map((job) => (
          <a
            key={job.id}
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-line bg-surface rounded-xl px-5 py-4 hover:border-accent transition-colors"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-semibold text-sm text-ink">{job.title}</h3>
                <p className="text-sm text-ink-soft mt-0.5">
                  {job.company}
                  {job.location && ` · ${job.location}`}
                </p>
              </div>
              {job.remote && (
                <span className="font-mono text-[10px] uppercase text-success bg-success-soft rounded-full px-2 py-0.5 flex-none">
                  Remote
                </span>
              )}
            </div>
            {job.description && (
              <p className="text-sm text-ink-faint mt-2 line-clamp-2">{job.description}</p>
            )}
            <span className="text-xs font-semibold text-accent-ink mt-2.5 inline-block">
              Postuler →
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}
