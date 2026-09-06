import { saveLesson } from "@/lib/actions/admin";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { Database } from "@/lib/supabase/types";

type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];

export function LessonForm({
  moduleId,
  lesson,
  parentLessonId = null,
}: {
  moduleId: string;
  lesson?: LessonRow;
  parentLessonId?: string | null;
}) {
  const effectiveParentId = lesson ? (lesson.parent_lesson_id ?? null) : parentLessonId;

  return (
    <form
      action={saveLesson.bind(null, moduleId, lesson?.id ?? null, effectiveParentId)}
      className="flex flex-col gap-4"
    >
      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">Titre</label>
        <input
          name="title"
          defaultValue={lesson?.title}
          required
          className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Numéro (ex. 1.5)</label>
          <input
            name="number"
            defaultValue={lesson?.number}
            required
            className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Ordre</label>
          <input
            type="number"
            name="sort_order"
            defaultValue={lesson?.sort_order ?? 0}
            required
            className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Durée (min)</label>
          <input
            type="number"
            name="duration_minutes"
            defaultValue={lesson?.duration_minutes ?? 60}
            required
            className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">
          Vidéo (URL d&apos;intégration — YouTube, Bunny Stream...)
        </label>
        <input
          name="video_id"
          defaultValue={lesson?.video_id ?? ""}
          placeholder="https://..."
          className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">Contenu de la leçon</label>
        <RichTextEditor name="body_html" initialHtml={lesson?.body_html} />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" name="status" value="published" defaultChecked={lesson?.status === "published"} />
        Publiée (visible des apprenants ayant accès au module)
      </label>

      <button
        type="submit"
        className="self-start text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-5 py-2.5 mt-1"
      >
        Enregistrer la leçon
      </button>
    </form>
  );
}
