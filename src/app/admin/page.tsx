import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LineChart } from "@/components/charts/LineChart";

function fmtUSD(n: number) {
  return `$${n.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}`;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    { count: totalLearners },
    { data: recentProgress },
    { data: payments },
    { data: profiles },
    { data: modules },
    { data: certificates },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("progress")
      .select("user_id, completed_at")
      .gte("completed_at", sevenDaysAgo.toISOString()),
    supabase.from("payments").select("amount, status, created_at").eq("status", "paid"),
    supabase.from("profiles").select("id, full_name, points, created_at").order("points", { ascending: false }),
    supabase.from("modules").select("id, number, title").order("sort_order"),
    supabase.from("certificates").select("id, module_id, user_id"),
  ]);

  const activeLearners7d = new Set((recentProgress ?? []).map((p) => p.user_id)).size;
  const totalRevenue = (payments ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const revenueThisMonth = (payments ?? [])
    .filter((p) => new Date(p.created_at) >= startOfMonth)
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  // Inscriptions par jour, 14 derniers jours
  const days: { label: string; value: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = (profiles ?? []).filter((p) => {
      const created = new Date(p.created_at);
      return created >= d && created < next;
    }).length;
    days.push({ label: `${d.getDate()}/${d.getMonth() + 1}`, value: count });
  }

  const topLearners = (profiles ?? []).slice(0, 5);

  const topModules = (modules ?? []).map((m) => {
    const completedCount = (certificates ?? []).filter((c) => c.module_id === m.id).length;
    return { ...m, completedCount };
  });

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
        <StatCard label="Apprenants" value={String(totalLearners ?? 0)} />
        <StatCard label="Actifs (7 jours)" value={String(activeLearners7d)} />
        <StatCard label="Revenu total" value={fmtUSD(totalRevenue)} />
        <StatCard label="Revenu ce mois" value={fmtUSD(revenueThisMonth)} />
      </div>

      <LineChart title="Inscriptions — 14 derniers jours" points={days} />

      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <div className="border border-line bg-surface rounded-xl p-5">
          <h3 className="font-display font-bold text-sm text-ink mb-3">Top apprenants</h3>
          <div className="flex flex-col gap-2">
            {topLearners.length === 0 && <p className="text-sm text-ink-faint">Aucun apprenant pour l&apos;instant.</p>}
            {topLearners.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">
                  <span className="font-mono text-ink-faint mr-2">{i + 1}</span>
                  {p.full_name ?? "Sans nom"}
                </span>
                <span className="font-mono text-ink">{p.points} pts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-line bg-surface rounded-xl p-5">
          <h3 className="font-display font-bold text-sm text-ink mb-3">Modules — certificats délivrés</h3>
          <div className="flex flex-col gap-2">
            {topModules.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">
                  Module {String(m.number).padStart(2, "0")} — {m.title}
                </span>
                <span className="font-mono text-ink">{m.completedCount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin/modules" className="text-sm font-semibold text-accent-ink hover:underline">
          Gérer les modules & leçons →
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-surface rounded-xl px-4 py-3.5">
      <div className="font-mono font-semibold text-xl text-accent-ink">{value}</div>
      <div className="text-[11px] text-ink-faint mt-1">{label}</div>
    </div>
  );
}
