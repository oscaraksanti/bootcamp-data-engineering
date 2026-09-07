import { deleteQuizQuestion, saveQuizQuestion } from "@/lib/actions/admin";

interface Question {
  id: string;
  question: string;
  question_type: "multiple_choice" | "code";
  options: string[] | null;
  correct_index: number | null;
  starter_query: string | null;
  expected_query: string | null;
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
      <summary className="text-sm text-ink cursor-pointer">
        {q.question_type === "code" && <span className="font-mono text-[10px] text-accent-ink mr-1.5">[CODE]</span>}
        {q.question}
      </summary>
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
  const isCode = defaultValues?.question_type === "code";
  // Un radio group ne peut pas changer dynamiquement quels champs sont
  // "required" sans JS — on affiche donc les deux blocs (aucun `required`
  // dessus) et saveQuizQuestion (server action) ne garde que les champs
  // pertinents selon question_type.

  return (
    <form action={action} className="flex flex-col gap-3 mt-3">
      <input
        name="question"
        defaultValue={defaultValues?.question}
        placeholder="Intitulé de la question"
        required
        className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />

      <div className="flex gap-4">
        <label className="flex items-center gap-1.5 text-xs text-ink-soft">
          <input
            type="radio"
            name="question_type"
            value="multiple_choice"
            defaultChecked={!isCode}
          />
          Choix multiple
        </label>
        <label className="flex items-center gap-1.5 text-xs text-ink-soft">
          <input
            type="radio"
            name="question_type"
            value="code"
            defaultChecked={isCode}
          />
          Code SQL (exécuté et comparé dans le bac à sable)
        </label>
      </div>

      <fieldset className="flex flex-col gap-2 border border-line rounded-lg p-3">
        <legend className="text-[11px] font-mono uppercase text-ink-faint px-1">Choix multiple</legend>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name="correct_index"
              value={i}
              defaultChecked={defaultValues?.correct_index === i}
            />
            <input
              name={`option_${i}`}
              defaultValue={defaultValues?.options?.[i] ?? ""}
              placeholder={`Option ${i + 1}${i === 0 ? " (obligatoire si QCM)" : ""}`}
              className="flex-1 border border-line-strong rounded-lg px-3 py-1.5 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2 border border-line rounded-lg p-3">
        <legend className="text-[11px] font-mono uppercase text-ink-faint px-1">Code SQL</legend>
        <label className="text-xs text-ink-faint">Requête de départ (pré-remplie pour l&apos;apprenant)</label>
        <textarea
          name="starter_query"
          defaultValue={defaultValues?.starter_query ?? ""}
          placeholder="select * from fact_transactions limit 10;"
          className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink font-mono outline-none focus:border-accent resize-none h-20"
        />
        <label className="text-xs text-ink-faint">
          Requête de référence (le résultat de l&apos;apprenant doit correspondre à celui-ci)
        </label>
        <textarea
          name="expected_query"
          defaultValue={defaultValues?.expected_query ?? ""}
          placeholder="select country_code, count(*) from fact_transactions group by country_code;"
          className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink font-mono outline-none focus:border-accent resize-none h-20"
        />
      </fieldset>

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
