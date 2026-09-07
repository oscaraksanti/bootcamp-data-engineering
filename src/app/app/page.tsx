import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAccessSummary, moduleIsUnlocked } from "@/lib/entitlements";
import { startCheckout } from "@/lib/actions/billing";
import { buildLessonTree, flattenLeaves } from "@/lib/lesson-tree";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: modules } = await supabase
    .from("modules")
    .select("id, number, slug, title, hours_min, hours_max, is_free")
    .order("sort_order");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, module_id, slug, title, number, sort_order, parent_lesson_id, status")
    .eq("status", "published");

  const { data: progress } = user
    ? await supabase.from("progress").select("lesson_id").eq("user_id", user.id)
    : { data: [] };

  const { data: certificates } = user
    ? await supabase
        .from("certificates")
        .select("public_slug, module_id, issued_at")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false })
    : { data: [] };

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));
  const certByModuleId = new Map((certificates ?? []).map((c) => [c.module_id, c]));
  const access = await getAccessSummary(supabase, user?.id);

  return (
    <main className="max-w-[1180px] mx-auto w-full px-6 py-9">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Ton parcours</h1>
      <p className="text-ink-soft text-sm mb-7">
        Commence par le Module 01 — il est entièrement gratuit. Débloque les
        modules suivants à 30$ à la carte, ou passe à l&apos;accès complet à 297$/an.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {(modules ?? []).map((m) => {
          const moduleLessons = (lessons ?? []).filter((l) => l.module_id === m.id);
          const leaves = flattenLeaves(buildLessonTree(moduleLessons));
          const done = leaves.filter((l) => completedIds.has(l.id)).length;
          const total = leaves.length;
          const isComplete = total > 0 && done === total;
          const certificate = certByModuleId.get(m.id);
          // Reprend à la première leçon non terminée, pas toujours la première du module.
          const resumeSlug = (leaves.find((l) => !completedIds.has(l.id)) ?? leaves[0])?.slug;
          const unlocked = moduleIsUnlocked(m, access);
          // Le module existe dans le programme mais son contenu n'est pas encore écrit —
          // à distinguer d'un module verrouillé qu'on peut débloquer en payant.
          const notYetReleased = total === 0 && !m.is_free;

          const cardBody = (
            <>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-ink-faint">
                  MODULE {String(m.number).padStart(2, "0")}
                </span>
                {isComplete && certificate ? (
                  <span className="font-mono text-[10px] uppercase text-accent-ink bg-accent-soft rounded-full px-2 py-0.5">
                    🏆 Certifié
                  </span>
                ) : notYetReleased ? (
                  <span className="font-mono text-[10px] uppercase text-ink-faint bg-surface-2 border border-line rounded-full px-2 py-0.5">
                    Bientôt
                  </span>
                ) : m.is_free ? (
                  <span className="font-mono text-[10px] uppercase text-success bg-success-soft rounded-full px-2 py-0.5">
                    Gratuit
                  </span>
                ) : !unlocked ? (
                  <span className="font-mono text-[10px] uppercase text-ink-faint bg-surface-2 border border-line rounded-full px-2 py-0.5">
                    Verrouillé
                  </span>
                ) : null}
              </div>
              <h4 className="font-semibold text-sm text-ink mt-1.5 mb-2">{m.title}</h4>
              {unlocked && total > 0 ? (
                <>
                  <div className="h-1.5 rounded-full bg-line overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${Math.round((done / total) * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-ink-faint">
                    {isComplete ? "Terminé — voir le certificat →" : `${done}/${total} leçons`}
                  </span>
                </>
              ) : notYetReleased ? (
                <span className="font-mono text-[11px] text-ink-faint">
                  À venir · {m.hours_min}–{m.hours_max}h estimées
                </span>
              ) : unlocked ? (
                <span className="font-mono text-[11px] text-ink-faint">Bientôt disponible</span>
              ) : (
                <span className="font-mono text-[11px] text-ink-faint">
                  {total} leçons · {m.hours_min}–{m.hours_max}h
                </span>
              )}
            </>
          );

          const cardClass =
            "border border-line bg-surface rounded-xl px-5 py-4.5 shadow-[0_1px_2px_rgba(20,21,43,.05),0_10px_28px_-14px_rgba(20,21,43,.18)] transition-colors";

          if (notYetReleased) {
            return (
              <div key={m.id} className={`${cardClass} opacity-70 cursor-default`}>
                {cardBody}
              </div>
            );
          }

          if (!unlocked) {
            return (
              <div key={m.id} className={`${cardClass} opacity-90`}>
                {cardBody}
                <form action={startCheckout.bind(null, "module", m.id)}>
                  <button
                    type="submit"
                    className="mt-3 w-full text-xs font-semibold text-accent-ink border border-line-strong rounded-lg py-2 hover:border-accent"
                  >
                    Débloquer pour 30$
                  </button>
                </form>
              </div>
            );
          }

          const cardHref = isComplete && certificate
            ? `/certificat/${certificate.public_slug}`
            : resumeSlug
              ? `/app/modules/${m.slug}/lessons/${resumeSlug}`
              : "#";

          return (
            <Link key={m.id} href={cardHref} className={`${cardClass} hover:border-accent`}>
              {cardBody}
            </Link>
          );
        })}
      </div>

      {certificates && certificates.length > 0 && (
        <div id="certificats" className="mt-10 scroll-mt-6">
          <h2 className="font-display font-bold text-lg text-ink mb-3">Mes certificats</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {certificates.map((c) => {
              const m = (modules ?? []).find((mod) => mod.id === c.module_id);
              return (
                <Link
                  key={c.public_slug}
                  href={`/certificat/${c.public_slug}`}
                  target="_blank"
                  className="flex items-center gap-3 border border-line bg-surface rounded-xl px-4 py-3.5 hover:border-accent transition-colors"
                >
                  <span className="text-xl flex-none">🏆</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {m ? m.title : "Certificat"}
                    </p>
                    <p className="font-mono text-[11px] text-ink-faint">
                      Délivré le {new Date(c.issued_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {!access.hasFullAccess && (
        <div className="mt-8 border border-accent bg-accent-soft rounded-xl px-6 py-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-display font-bold text-ink">Accès complet — 297$/an</p>
            <p className="text-sm text-ink-soft mt-1">
              Les 12 modules, tous les certificats, débloqués immédiatement — y compris ceux publiés après ton inscription.
            </p>
          </div>
          <form action={startCheckout.bind(null, "full_access", null)}>
            <button
              type="submit"
              className="text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-5 py-2.5 whitespace-nowrap"
            >
              Passer à l&apos;accès complet
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
