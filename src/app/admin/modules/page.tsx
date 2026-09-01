import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { toggleModuleStatus } from "@/lib/actions/admin";

export default async function AdminModulesPage() {
  const supabase = await createClient();
  const { data: modules } = await supabase.from("modules").select("*").order("sort_order");
  const { data: lessons } = await supabase.from("lessons").select("id, module_id");

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-ink">Modules & Leçons</h1>
        <Link
          href="/admin/modules/new"
          className="text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-4 py-2.5"
        >
          + Nouveau module
        </Link>
      </div>

      <div className="border border-line rounded-xl overflow-hidden bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-ink-faint border-b border-line">
              <th className="px-4 py-3 font-medium">Module</th>
              <th className="px-4 py-3 font-medium">Leçons</th>
              <th className="px-4 py-3 font-medium">Durée</th>
              <th className="px-4 py-3 font-medium">Gratuit</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(modules ?? []).map((m) => {
              const count = (lessons ?? []).filter((l) => l.module_id === m.id).length;
              return (
                <tr key={m.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-mono text-ink-faint text-xs mr-2">
                      {String(m.number).padStart(2, "0")}
                    </span>
                    <span className="font-semibold text-ink">{m.title}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{count}</td>
                  <td className="px-4 py-3 text-ink-soft font-mono text-xs">
                    {m.hours_min}–{m.hours_max}h
                  </td>
                  <td className="px-4 py-3">{m.is_free ? "Oui" : "Non"}</td>
                  <td className="px-4 py-3">
                    <form action={toggleModuleStatus.bind(null, m.id, m.status)}>
                      <button
                        type="submit"
                        className={`text-[11px] font-mono uppercase rounded-full px-2.5 py-1 ${
                          m.status === "published"
                            ? "bg-success-soft text-success"
                            : "bg-surface-2 text-ink-faint border border-line"
                        }`}
                      >
                        {m.status === "published" ? "Actif" : "Inactif"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/modules/${m.id}`} className="text-accent-ink font-semibold hover:underline">
                      Gérer
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
