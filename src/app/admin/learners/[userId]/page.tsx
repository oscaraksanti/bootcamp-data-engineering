import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { grantManualEntitlement, setUserRole } from "@/lib/actions/admin";

export default async function LearnerDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();

  const { data: learner } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (!learner) notFound();

  const [{ data: progress }, { data: attempts }, { data: certificates }, { data: entitlements }, { data: modules }] =
    await Promise.all([
      supabase.from("progress").select("lesson_id, completed_at").eq("user_id", userId),
      supabase.from("quiz_attempts").select("score, total, passed, attempted_at").eq("user_id", userId),
      supabase.from("certificates").select("module_id, public_slug, issued_at").eq("user_id", userId),
      supabase.from("entitlements").select("scope_module_id, source, granted_at, expires_at").eq("user_id", userId),
      supabase.from("modules").select("id, title"),
    ]);

  const moduleTitle = (id: string | null) =>
    id ? (modules ?? []).find((m) => m.id === id)?.title ?? "—" : "Accès complet";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">{learner.full_name ?? "Sans nom"}</h1>
      <p className="text-sm text-ink-faint mb-6">
        Inscrit le {new Date(learner.created_at).toLocaleDateString("fr-FR")} · {learner.points} points
      </p>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <Section title="Rôle">
          <form action={setUserRole.bind(null, userId, learner.role === "admin" ? "learner" : "admin")}>
            <button
              type="submit"
              className="text-sm font-semibold text-accent-ink border border-line-strong rounded-lg px-4 py-2 hover:border-accent"
            >
              {learner.role === "admin" ? "Retirer les droits admin" : "Promouvoir en admin"}
            </button>
          </form>
        </Section>

        <Section title="Accorder un accès manuel">
          <form action={grantManualEntitlement.bind(null, userId, null)}>
            <button
              type="submit"
              className="text-sm font-semibold text-accent-ink border border-line-strong rounded-lg px-4 py-2 hover:border-accent"
            >
              Offrir l&apos;accès complet
            </button>
          </form>
        </Section>
      </div>

      <Section title={`Progression — ${(progress ?? []).length} leçon(s) terminée(s)`}>
        <p className="text-sm text-ink-faint">
          Dernière activité :{" "}
          {(progress ?? []).length > 0
            ? new Date(
                Math.max(...(progress ?? []).map((p) => new Date(p.completed_at).getTime()))
              ).toLocaleDateString("fr-FR")
            : "aucune"}
        </p>
      </Section>

      <Section title="Tentatives de quiz">
        <div className="flex flex-col gap-1.5">
          {(attempts ?? []).length === 0 && <p className="text-sm text-ink-faint">Aucune tentative.</p>}
          {(attempts ?? []).map((a, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-ink-soft">{new Date(a.attempted_at).toLocaleDateString("fr-FR")}</span>
              <span className={a.passed ? "text-success" : "text-danger"}>
                {a.score}/{a.total} {a.passed ? "réussi" : "échoué"}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Certificats">
        <div className="flex flex-col gap-1.5">
          {(certificates ?? []).length === 0 && <p className="text-sm text-ink-faint">Aucun certificat.</p>}
          {(certificates ?? []).map((c) => (
            <div key={c.public_slug} className="flex justify-between text-sm">
              <span className="text-ink-soft">{moduleTitle(c.module_id)}</span>
              <a href={`/certificat/${c.public_slug}`} className="text-accent-ink hover:underline font-mono text-xs">
                /certificat/{c.public_slug}
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Accès">
        <div className="flex flex-col gap-1.5">
          {(entitlements ?? []).length === 0 && <p className="text-sm text-ink-faint">Gratuit uniquement.</p>}
          {(entitlements ?? []).map((e, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-ink-soft">{moduleTitle(e.scope_module_id)}</span>
              <span className="font-mono text-xs text-ink-faint">
                {e.source} {e.expires_at ? `· expire ${new Date(e.expires_at).toLocaleDateString("fr-FR")}` : "· à vie"}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-line bg-surface rounded-xl p-5 mb-4">
      <h3 className="font-display font-bold text-sm text-ink mb-3">{title}</h3>
      {children}
    </div>
  );
}
