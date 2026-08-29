import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
    .select("id, module_id, slug")
    .eq("status", "published");

  const { data: progress } = user
    ? await supabase.from("progress").select("lesson_id").eq("user_id", user.id)
    : { data: [] };

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));

  return (
    <main className="max-w-[1180px] mx-auto w-full px-6 py-9">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Ton parcours</h1>
      <p className="text-ink-soft text-sm mb-7">
        Commence par le Module 01 — il est entièrement gratuit.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {(modules ?? []).map((m) => {
          const moduleLessons = (lessons ?? []).filter((l) => l.module_id === m.id);
          const done = moduleLessons.filter((l) => completedIds.has(l.id)).length;
          const total = moduleLessons.length;
          const firstLessonSlug = moduleLessons[0]?.slug;

          return (
            <Link
              key={m.id}
              href={firstLessonSlug ? `/app/modules/${m.slug}/lessons/${firstLessonSlug}` : "#"}
              className="border border-line bg-surface rounded-xl px-5 py-4.5 shadow-[0_1px_2px_rgba(20,21,43,.05),0_10px_28px_-14px_rgba(20,21,43,.18)] hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-ink-faint">
                  MODULE {String(m.number).padStart(2, "0")}
                </span>
                {m.is_free && (
                  <span className="font-mono text-[10px] uppercase text-success bg-success-soft rounded-full px-2 py-0.5">
                    Gratuit
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-sm text-ink mt-1.5 mb-2">{m.title}</h4>
              {total > 0 ? (
                <>
                  <div className="h-1.5 rounded-full bg-line overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${Math.round((done / total) * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-ink-faint">
                    {done}/{total} leçons
                  </span>
                </>
              ) : (
                <span className="font-mono text-[11px] text-ink-faint">Bientôt disponible</span>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
