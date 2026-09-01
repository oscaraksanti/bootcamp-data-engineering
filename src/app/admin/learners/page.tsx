import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLearnersPage() {
  const supabase = await createClient();
  const { data: learners } = await supabase
    .from("profiles")
    .select("id, full_name, role, points, subscription_status, created_at")
    .order("created_at", { ascending: false });

  const { data: progress } = await supabase.from("progress").select("user_id, lesson_id");
  const { data: entitlements } = await supabase.from("entitlements").select("user_id, scope_module_id");

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-ink">Apprenants</h1>
        <a
          href="/api/admin/export/learners"
          className="text-sm font-semibold text-accent-ink border border-line-strong rounded-lg px-4 py-2.5 hover:border-accent"
        >
          Exporter en CSV
        </a>
      </div>

      <div className="border border-line rounded-xl overflow-hidden bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-ink-faint border-b border-line">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Inscrit le</th>
              <th className="px-4 py-3 font-medium">Leçons terminées</th>
              <th className="px-4 py-3 font-medium">Accès</th>
              <th className="px-4 py-3 font-medium">Points</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(learners ?? []).map((l) => {
              const completedLessons = (progress ?? []).filter((p) => p.user_id === l.id).length;
              const accessCount = (entitlements ?? []).filter((e) => e.user_id === l.id).length;
              return (
                <tr key={l.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{l.full_name ?? "Sans nom"}</td>
                  <td className="px-4 py-3 text-ink-soft font-mono text-xs">
                    {new Date(l.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{completedLessons}</td>
                  <td className="px-4 py-3 text-ink-soft">{accessCount > 0 ? `${accessCount} module(s)+` : "Gratuit"}</td>
                  <td className="px-4 py-3 font-mono text-ink">{l.points}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-mono uppercase rounded-full px-2 py-0.5 ${
                        l.role === "admin" ? "bg-accent-soft text-accent-ink" : "bg-surface-2 text-ink-faint border border-line"
                      }`}
                    >
                      {l.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/learners/${l.id}`} className="text-accent-ink font-semibold hover:underline">
                      Voir
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
