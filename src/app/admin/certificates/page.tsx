import { createClient } from "@/lib/supabase/server";
import { issueCertificateManually, revokeCertificate } from "@/lib/actions/admin";

export default async function AdminCertificatesPage() {
  const supabase = await createClient();
  const [{ data: certificates }, { data: learners }, { data: modules }] = await Promise.all([
    supabase.from("certificates").select("*").order("issued_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name").order("full_name"),
    supabase.from("modules").select("id, number, title").order("sort_order"),
  ]);

  const learnerName = (id: string) => (learners ?? []).find((l) => l.id === id)?.full_name ?? "—";
  const moduleTitle = (id: string | null) =>
    id ? (modules ?? []).find((m) => m.id === id)?.title ?? "—" : "Certificat final du programme";

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Certificats</h1>

      <div className="border border-line rounded-xl overflow-hidden bg-surface mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-ink-faint border-b border-line">
              <th className="px-4 py-3 font-medium">Apprenant</th>
              <th className="px-4 py-3 font-medium">Certificat</th>
              <th className="px-4 py-3 font-medium">Délivré le</th>
              <th className="px-4 py-3 font-medium">Lien public</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(certificates ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-ink-faint">
                  Aucun certificat délivré pour l&apos;instant.
                </td>
              </tr>
            )}
            {(certificates ?? []).map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{learnerName(c.user_id)}</td>
                <td className="px-4 py-3 text-ink-soft">{moduleTitle(c.module_id)}</td>
                <td className="px-4 py-3 text-ink-soft font-mono text-xs">
                  {new Date(c.issued_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <a href={`/certificat/${c.public_slug}`} className="text-accent-ink hover:underline font-mono text-xs">
                    /certificat/{c.public_slug}
                  </a>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={revokeCertificate.bind(null, c.id)}>
                    <button type="submit" className="text-xs text-danger hover:underline">
                      Révoquer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display font-bold text-lg text-ink mb-3">Émettre manuellement</h2>
      <form action={issueCertificateManually} className="flex flex-wrap items-end gap-3 max-w-xl">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Apprenant</label>
          <select name="user_id" required className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink">
            {(learners ?? []).map((l) => (
              <option key={l.id} value={l.id}>
                {l.full_name ?? l.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Module (vide = certificat final)</label>
          <select name="module_id" className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink">
            <option value="">— Certificat final —</option>
            {(modules ?? []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-5 py-2.5"
        >
          Émettre
        </button>
      </form>
    </div>
  );
}
