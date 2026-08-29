"use client";

import { useState } from "react";
import { submitQuiz, type QuizResult } from "@/lib/actions/lesson";

type Question = { id: string; question: string; options: string[] };

export function Quiz({
  questions,
  lessonId,
  moduleId,
  onPassed,
}: {
  questions: Question[];
  lessonId?: string;
  moduleId?: string;
  onPassed?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [pending, setPending] = useState(false);

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  async function handleSubmit() {
    setPending(true);
    try {
      const res = await submitQuiz({
        lessonId,
        moduleId,
        answers: questions.map((_, i) => answers[i]),
      });
      setResult(res);
      if (res.passed) onPassed?.();
    } finally {
      setPending(false);
    }
  }

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="border border-line bg-surface rounded-xl p-5">
        <div
          className={`font-mono text-sm font-semibold mb-1 ${result.passed ? "text-success" : "text-danger"}`}
        >
          {result.score}/{result.total} ({pct}%) — {result.passed ? "Réussi" : "Non validé, réessaie"}
        </div>
        {!result.passed && (
          <p className="text-sm text-ink-soft mb-3">Il faut au moins 80% pour valider.</p>
        )}
        {result.certificateSlug && (
          <a
            href={`/certificat/${result.certificateSlug}`}
            target="_blank"
            className="inline-flex text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-4 py-2 mb-4"
          >
            Voir mon certificat →
          </a>
        )}
        <div className="flex flex-col gap-4 mt-3">
          {questions.map((q, i) => {
            const pq = result.perQuestion[i];
            return (
              <div key={q.id} className="border-t border-line pt-3.5 first:border-t-0 first:pt-0">
                <p className="text-sm text-ink font-medium mb-1.5">{q.question}</p>
                <p className={`text-xs ${pq.correct ? "text-success" : "text-danger"}`}>
                  {pq.correct ? "Correct" : `Réponse attendue : ${q.options[pq.correctIndex]}`}
                </p>
                {pq.explain && <p className="text-xs text-ink-faint mt-1">{pq.explain}</p>}
              </div>
            );
          })}
        </div>
        {!result.passed && (
          <button
            onClick={() => {
              setResult(null);
              setAnswers({});
            }}
            className="mt-4 text-sm font-semibold text-accent-ink border border-line-strong rounded-lg px-4 py-2 hover:border-accent"
          >
            Retenter le quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {questions.map((q, i) => (
        <div key={q.id}>
          <p className="text-sm font-medium text-ink mb-2">{q.question}</p>
          <div className="flex flex-col gap-1.5">
            {q.options.map((opt, j) => (
              <label
                key={j}
                className={`flex items-center gap-2.5 text-sm rounded-lg border px-3.5 py-2.5 cursor-pointer ${
                  answers[i] === j ? "border-accent bg-accent-soft text-ink" : "border-line-strong text-ink-soft hover:border-accent"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${i}`}
                  className="accent-[var(--accent)]"
                  checked={answers[i] === j}
                  onChange={() => setAnswers((a) => ({ ...a, [i]: j }))}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={!allAnswered || pending}
        className="self-start bg-accent hover:bg-accent-strong disabled:opacity-50 text-white font-semibold text-sm rounded-lg px-5 py-2.5"
      >
        {pending ? "Correction…" : "Valider le quiz"}
      </button>
    </div>
  );
}
