import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonBody } from "@/components/lesson/LessonBody";
import { Quiz } from "@/components/quiz/Quiz";
import { markLessonComplete, addNote } from "@/lib/actions/lesson";
import { getAccessSummary, moduleIsUnlocked } from "@/lib/entitlements";
import { buildLessonTree, flattenLeaves, type LessonNode } from "@/lib/lesson-tree";
import type { LessonBodyContent } from "@/lib/lesson-blocks";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: courseModule } = await supabase
    .from("modules")
    .select("id, number, title, slug, is_free")
    .eq("slug", moduleSlug)
    .single();
  if (!courseModule) notFound();

  const access = await getAccessSummary(supabase, user.id);
  if (!moduleIsUnlocked(courseModule, access)) {
    redirect("/app");
  }

  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id, slug, title, number, sort_order, parent_lesson_id, status")
    .eq("module_id", courseModule.id)
    .eq("status", "published")
    .order("sort_order");
  if (!allLessons || allLessons.length === 0) notFound();

  const tree = buildLessonTree(allLessons);
  const leaves = flattenLeaves(tree);

  const currentIndex = leaves.findIndex((l) => l.slug === lessonSlug);
  if (currentIndex === -1) notFound();
  const lesson = leaves[currentIndex];
  const isLastLesson = currentIndex === leaves.length - 1;

  const { data: fullLesson } = await supabase
    .from("lessons")
    .select("body_content, body_html, video_id, duration_minutes")
    .eq("id", lesson.id)
    .single();

  const { data: progress } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("user_id", user.id);
  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));

  const { data: quizQuestions } = await supabase
    .from("quiz_questions")
    .select("id, question, options")
    .eq("lesson_id", lesson.id)
    .order("sort_order");

  const { data: moduleQuizQuestions } = isLastLesson
    ? await supabase
        .from("quiz_questions")
        .select("id, question, options")
        .eq("module_id", courseModule.id)
        .order("sort_order")
    : { data: null };

  const { data: notes } = await supabase
    .from("notes")
    .select("id, body, created_at")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id)
    .order("created_at", { ascending: false });

  const prevLesson = leaves[currentIndex - 1];
  const nextLesson = leaves[currentIndex + 1];
  const basePath = `/app/modules/${moduleSlug}/lessons`;
  const nextHref = nextLesson ? `${basePath}/${nextLesson.slug}` : "/app";
  const currentPath = `${basePath}/${lessonSlug}`;

  const content = (fullLesson?.body_content ?? { blocks: [] }) as unknown as LessonBodyContent;
  const completedCount = leaves.filter((l) => completedIds.has(l.id)).length;

  return (
    <div className="grid lg:grid-cols-[280px_1fr_280px] flex-1">
      {/* Sidebar */}
      <aside className="hidden lg:block border-r border-line bg-surface px-4 py-4.5 overflow-y-auto">
        <div className="font-mono text-[10.5px] uppercase tracking-wide text-ink-faint mb-1">
          Module {String(courseModule.number).padStart(2, "0")}
        </div>
        <div className="font-semibold text-sm text-ink mb-2.5">{courseModule.title}</div>
        <div className="flex justify-between font-mono text-[11px] text-ink-faint mb-1.5">
          <span>{completedCount}/{leaves.length} leçons</span>
          <span>{Math.round((completedCount / leaves.length) * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-line overflow-hidden mb-4">
          <div
            className="h-full bg-accent rounded-full"
            style={{ width: `${Math.round((completedCount / leaves.length) * 100)}%` }}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          {tree.map((node) => (
            <LessonTreeItem
              key={node.id}
              node={node}
              basePath={basePath}
              currentId={lesson.id}
              completedIds={completedIds}
            />
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="px-6 md:px-10 py-6 md:py-8 max-w-3xl">
        <div className="font-mono text-[11.5px] text-ink-faint tracking-wide mb-2.5">
          LEÇON {lesson.number} · MODULE {String(courseModule.number).padStart(2, "0")}
        </div>
        <h1 className="font-display font-bold text-2xl md:text-[1.65rem] text-ink mb-5">
          {lesson.title}
        </h1>

        {fullLesson?.video_id && (
          <div className="aspect-video rounded-xl overflow-hidden border border-line mb-6 bg-ink">
            <iframe
              src={fullLesson.video_id}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <LessonBody content={content} bodyHtml={fullLesson?.body_html} />

        {quizQuestions && quizQuestions.length > 0 && (
          <section className="mt-9 border-t border-line pt-7">
            <h3 className="font-display font-bold text-lg text-ink mb-4">Quiz de la leçon</h3>
            <Quiz questions={quizQuestions} lessonId={lesson.id} />
          </section>
        )}

        {isLastLesson && moduleQuizQuestions && moduleQuizQuestions.length > 0 && (
          <section className="mt-9 border-t border-line pt-7">
            <h3 className="font-display font-bold text-lg text-ink mb-1">
              Quiz final du module — {courseModule.title}
            </h3>
            <p className="text-sm text-ink-soft mb-4">
              80% pour valider et débloquer ton certificat du Module {String(courseModule.number).padStart(2, "0")}.
            </p>
            <Quiz questions={moduleQuizQuestions} moduleId={courseModule.id} />
          </section>
        )}

        <div className="flex justify-between items-center mt-9 pt-5 border-t border-line">
          {prevLesson ? (
            <Link
              href={`${basePath}/${prevLesson.slug}`}
              className="text-sm font-semibold text-ink border border-line-strong rounded-lg px-4 py-2 hover:border-accent"
            >
              ← Précédent
            </Link>
          ) : (
            <span />
          )}
          <form action={markLessonComplete.bind(null, lesson.id, nextHref)}>
            <button
              type="submit"
              className="text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-5 py-2.5"
            >
              {isLastLesson ? "Marquer terminé" : "Marquer terminé & continuer →"}
            </button>
          </form>
        </div>
      </main>

      {/* Right panel — notes */}
      <aside className="hidden lg:block border-l border-line bg-surface px-4.5 py-4.5 overflow-y-auto">
        <div className="font-mono text-[11px] uppercase tracking-wide text-ink-faint mb-3">
          Notes
        </div>
        <form action={addNote.bind(null, lesson.id, currentPath)} className="mb-3.5">
          <textarea
            name="body"
            placeholder="Écris une note sur cette leçon…"
            className="w-full border border-line rounded-lg p-2.5 text-[12.8px] text-ink outline-none focus:border-accent resize-none h-16"
          />
          <button
            type="submit"
            className="mt-1.5 text-xs font-semibold text-accent-ink border border-line-strong rounded-md px-2.5 py-1.5 hover:border-accent"
          >
            Ajouter
          </button>
        </form>
        <div className="flex flex-col gap-2.5">
          {(notes ?? []).map((n) => (
            <div key={n.id} className="text-[12.5px] text-ink-soft border-t border-line pt-2.5">
              {n.body}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function LessonTreeItem({
  node,
  basePath,
  currentId,
  completedIds,
}: {
  node: LessonNode;
  basePath: string;
  currentId: string;
  completedIds: Set<string>;
}) {
  // Feuille (pas d'enfants) — rendu identique à une leçon "à plat" d'avant.
  if (node.children.length === 0) {
    const done = completedIds.has(node.id);
    const isCurrent = node.id === currentId;
    return (
      <Link
        href={`${basePath}/${node.slug}`}
        className={`flex items-center gap-2 text-[12.5px] rounded-md px-2.5 py-2 ${
          isCurrent ? "bg-accent-soft text-accent-ink font-semibold" : "text-ink-soft hover:bg-surface-2"
        }`}
      >
        <span
          className={`w-4 h-4 rounded-full flex-none flex items-center justify-center ${
            done ? "bg-success" : isCurrent ? "border-2 border-accent" : "bg-line"
          }`}
        >
          {done && (
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5l2.5 2.5L8.5 2" stroke="#fff" strokeWidth="1.4" />
            </svg>
          )}
        </span>
        {node.number} — {node.title}
      </Link>
    );
  }

  // Chapitre — en-tête repliable, ses feuilles gardent la coche individuelle.
  const chapterDone = node.children.filter((c) => completedIds.has(c.id)).length;
  const containsCurrent = node.children.some((c) => c.id === currentId);

  return (
    <details className="mt-1 first:mt-0" open={containsCurrent}>
      <summary className="flex items-center justify-between gap-2 text-[12.5px] font-semibold text-ink rounded-md px-2.5 py-2 cursor-pointer hover:bg-surface-2 list-none [&::-webkit-details-marker]:hidden">
        <span>
          {node.number} — {node.title}
        </span>
        <span className="font-mono text-[10px] text-ink-faint font-normal">
          {chapterDone}/{node.children.length}
        </span>
      </summary>
      <div className="flex flex-col gap-0.5 pl-3 mt-0.5">
        {node.children.map((child) => (
          <LessonTreeItem
            key={child.id}
            node={child}
            basePath={basePath}
            currentId={currentId}
            completedIds={completedIds}
          />
        ))}
      </div>
    </details>
  );
}
