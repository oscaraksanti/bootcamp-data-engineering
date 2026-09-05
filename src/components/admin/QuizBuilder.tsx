import { deleteQuizQuestion, saveQuizQuestion } from "@/lib/actions/admin";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explain: string | null;
  sort_order: number;
}

export function QuizBuilder({
  moduleId,
  lessonId,
  questions,
}: {
  moduleId: string;
  lessonId: string;
  questions: Question[];
}) {
  const nextOrder = questions.length;

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q) => (
        <QuestionRow key={q.id} moduleId={moduleId} lessonId={lessonId} question={q} />
      ))}

      <details className="border border-dashed border-line-strong rounded-lg px-4 py-3">
        <summary className="text-sm font-semibold text-accent-ink cursor-pointer">+ Ajouter une question</summary>
        <QuestionFormFields
          action={saveQuizQuestion.bind(null, lessonId, moduleId, null)}
          defaultSortOrder={nextOrder}
        />
      </details>
    </div>
  );
}

function QuestionRow({
  moduleId,
  lessonId,
  question: q,
}: {
  moduleId: string;
  lessonId: string;
  question: Question;
}) {
  return (
    <details className="border border-line rounded-lg px-4 py-3 bg-surface-2">
      <summary className="text-sm text-ink cursor-pointer">{q.question}</summary>
      <QuestionFormFields
        action={saveQuizQuestion.bind(null, lessonId, moduleId, q.id)}
        defaultValues={q}
      />
      <form action={deleteQuizQuestion.bind(null, moduleId, lessonId, q.id)} className="mt-2">
        <button type="submit" className="text-xs text-danger hover:underline">
          Supprimer cette question
        </button>
      </form>
    </details>
  );
}

function QuestionFormFields({
  action,
  defaultValues,
  defaultSortOrder,
}: {
  action: (formData: FormData) => void;
  defaultValues?: Question;
  defaultSortOrder?: number;
}) {
  return (
    <form action={action} className="flex flex-col gap-3 mt-3">
      <input
        name="question"
        defaultValue={defaultValues?.question}
        placeholder="Intitulé de la question"
        required
        className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="radio"
            name="correct_index"
            value={i}
            defaultChecked={defaultValues?.correct_index === i}
            required
          />
          <input
            name={`option_${i}`}
            defaultValue={defaultValues?.options?.[i] ?? ""}
            placeholder={`Option ${i + 1}${i === 0 ? " (obligatoire)" : ""}`}
            required={i < 2}
            className="flex-1 border border-line-strong rounded-lg px-3 py-1.5 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      ))}
      <textarea
        name="explain"
        defaultValue={defaultValues?.explain ?? ""}
        placeholder="Explication affichée après réponse (optionnel)"
        className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent resize-none h-16"
      />
      <input type="hidden" name="sort_order" value={defaultValues?.sort_order ?? defaultSortOrder ?? 0} />
      <button
        type="submit"
        className="self-start text-xs font-semibold text-accent-ink border border-line-strong rounded-md px-3 py-1.5 hover:border-accent"
      >
        Enregistrer la question
      </button>
    </form>
  );
}
