import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "@/components/admin/LessonForm";

export default async function NewLessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ parent?: string }>;
}) {
  const { moduleId } = await params;
  const { parent } = await searchParams;
  const supabase = await createClient();
  const { data: courseModule } = await supabase.from("modules").select("id, title").eq("id", moduleId).single();
  if (!courseModule) notFound();

  let parentTitle: string | null = null;
  if (parent) {
    const { data: parentLesson } = await supabase.from("lessons").select("title").eq("id", parent).single();
    parentTitle = parentLesson?.title ?? null;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <p className="text-xs text-ink-faint mb-1">
        {courseModule.title}
        {parentTitle && ` · ${parentTitle}`}
      </p>
      <h1 className="font-display font-bold text-2xl text-ink mb-6">
        {parent ? "Nouvelle leçon" : "Nouveau chapitre"}
      </h1>
      <LessonForm moduleId={moduleId} parentLessonId={parent ?? null} />
      {parent && (
        <p className="text-xs text-ink-faint mt-4">
          Le quiz de la leçon se configure une fois la leçon enregistrée une première fois.
        </p>
      )}
    </div>
  );
}
