import { createClient } from "@/lib/supabase/server";
import { deleteJob, saveJob, toggleJobStatus } from "@/lib/actions/admin";

export default async function AdminJobsPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase.from("jobs").select("*").order("posted_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Offres d&apos;emploi</h1>

      <details className="border border-dashed border-line-strong rounded-lg px-4 py-3 mb-6">
        <summary className="text-sm font-semibold text-accent-ink cursor-pointer">+ Nouvelle offre</summary>
        <form action={saveJob.bind(null, null)} className="flex flex-col gap-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="title" placeholder="Intitulé du poste" required className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink" />
            <input name="company" placeholder="Entreprise" required className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="location" placeholder="Localisation (optionnel)" className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink" />
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" name="remote" /> Télétravail possible
            </label>
          </div>
          <input name="apply_url" type="url" placeholder="Lien pour postuler" required className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink" />
          <textarea name="description" placeholder="Description (optionnel)" className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink resize-none h-20" />
          <div className="grid grid-cols-2 gap-3">
            <select name="status" className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink">
              <option value="active">Active</option>
              <option value="expired">Expirée</option>
            </select>
            <input type="date" name="expires_at" className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink" />
          </div>
          <button type="submit" className="self-start text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-5 py-2.5">
            Publier l&apos;offre
          </button>
        </form>
      </details>

      <div className="border border-line rounded-xl overflow-hidden bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-ink-faint border-b border-line">
              <th className="px-4 py-3 font-medium">Poste</th>
              <th className="px-4 py-3 font-medium">Entreprise</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(jobs ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-ink-faint">Aucune offre publiée.</td>
              </tr>
            )}
            {(jobs ?? []).map((j) => (
              <tr key={j.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{j.title}</td>
                <td className="px-4 py-3 text-ink-soft">{j.company}</td>
                <td className="px-4 py-3">
                  <form action={toggleJobStatus.bind(null, j.id, j.status)}>
                    <button
                      type="submit"
                      className={`text-[11px] font-mono uppercase rounded-full px-2.5 py-1 ${
                        j.status === "active" ? "bg-success-soft text-success" : "bg-surface-2 text-ink-faint border border-line"
                      }`}
                    >
                      {j.status === "active" ? "Active" : "Expirée"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteJob.bind(null, j.id)}>
                    <button type="submit" className="text-xs text-danger hover:underline">
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
