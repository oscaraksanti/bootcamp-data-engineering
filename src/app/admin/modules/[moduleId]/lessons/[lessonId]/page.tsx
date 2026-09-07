import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "@/components/admin/LessonForm";
import { QuizBuilder } from "@/components/admin/QuizBuilder";
import { deleteLesson } from "@/lib/actions/admin";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const supabase = await createClient();

  const { data: courseModule } = await supabase.from("modules").select("id, title").eq("id", moduleId).single();
  const { data: lesson } = await supabase.from("lessons").select("*").eq("id", lessonId).single();
  if (!courseModule || !lesson) notFound();

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, question, question_type, options, correct_index, starter_query, expected_query, explain, sort_order")
    .eq("lesson_id", lessonId)
    .order("sort_order");

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <p className="text-xs text-ink-faint mb-1">{courseModule.title}</p>
      <h1 className="font-display font-bold text-2xl text-ink mb-6">{lesson.title}</h1>

      <LessonForm moduleId={moduleId} lesson={lesson} />

      <h2 className="font-display font-bold text-lg text-ink mt-10 mb-4">Quiz de la leçon</h2>
      <QuizBuilder moduleId={moduleId} lessonId={lessonId} questions={questions ?? []} />

      <form action={deleteLesson.bind(null, moduleId, lessonId)} className="mt-8 pt-6 border-t border-line">
        <button type="submit" className="text-xs text-danger hover:underline">
          Supprimer cette leçon
        </button>
      </form>
    </div>
  );
}
