import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "@/components/admin/LessonForm";

export default async function NewLessonPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const supabase = await createClient();
  const { data: courseModule } = await supabase.from("modules").select("id, title").eq("id", moduleId).single();
  if (!courseModule) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <p className="text-xs text-ink-faint mb-1">{courseModule.title}</p>
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Nouvelle leçon</h1>
      <LessonForm moduleId={moduleId} />
      <p className="text-xs text-ink-faint mt-4">
        Le quiz de la leçon se configure une fois la leçon enregistrée une première fois.
      </p>
    </div>
  );
}
