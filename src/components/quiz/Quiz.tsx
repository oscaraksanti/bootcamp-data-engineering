"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { submitQuiz, type QuizResult } from "@/lib/actions/lesson";
import { useOptionalSandbox, type QueryResult } from "@/components/lesson/SandboxProvider";
import { SqlCode } from "@/components/lesson/SqlCode";

type Question = {
  id: string;
  question: string;
  question_type: "multiple_choice" | "code";
  options: string[] | null;
  starter_query?: string | null;
  expected_query?: string | null;
};

/** Compare deux résultats de requête en ignorant l'ordre des lignes et les
 * noms de colonnes (seules les valeurs, position par position, comptent) —
 * assez tolérant pour ne pas pénaliser un alias différent, assez strict
 * pour exiger les bonnes colonnes dans le bon ordre. */
function canonicalizeRows(rows: unknown[][]): string {
  const normalized = rows.map((row) =>
    JSON.stringify(row.map((v) => (v instanceof Date ? v.toISOString() : v)))
  );
  normalized.sort();
  return normalized.join("\n");
}

function resultsMatch(a: QueryResult, b: QueryResult): boolean {
  if (a.columns.length !== b.columns.length) return false;
  return canonicalizeRows(a.rows) === canonicalizeRows(b.rows);
}

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
  const sandbox = useOptionalSandbox();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [codeQueries, setCodeQueries] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    questions.forEach((q, i) => {
      if (q.question_type === "code") init[i] = q.starter_query ?? "";
    });
    return init;
  });
  const [codePreview, setCodePreview] = useState<Record<number, QueryResult | { error: string } | null>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [pending, setPending] = useState(false);

  const allAnswered = questions.every((q, i) =>
    q.question_type === "code" ? (codeQueries[i] ?? "").trim().length > 0 : answers[i] !== undefined
  );

  async function handleTestQuery(i: number) {
    if (!sandbox) return;
    const res = await sandbox.runQuery(codeQueries[i] ?? "");
    setCodePreview((p) => ({ ...p, [i]: res }));
  }

  async function handleSubmit() {
    setPending(true);
    try {
      const codeResults: Record<number, boolean> = {};

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (q.question_type !== "code") continue;

        if (!sandbox || sandbox.status !== "ready") {
          codeResults[i] = false;
          continue;
        }
        const learnerRes = await sandbox.runQuery(codeQueries[i] ?? "");
        const expectedRes = await sandbox.runQuery(q.expected_query ?? "");
        codeResults[i] =
          !("error" in learnerRes) && !("error" in expectedRes) && resultsMatch(learnerRes, expectedRes);
      }

      const res = await submitQuiz({
        lessonId,
        moduleId,
        answers: questions.map((q, i) => (q.question_type === "code" ? null : answers[i] ?? null)),
        codeResults,
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
                  {pq.correct
                    ? "Correct"
                    : q.question_type === "code"
                      ? "Le résultat de ta requête ne correspond pas à ce qui était attendu"
                      : `Réponse attendue : ${q.options?.[pq.correctIndex ?? -1] ?? ""}`}
                </p>
                {q.question_type === "code" && !pq.correct && q.expected_query && (
                  <div className="mt-2">
                    <p className="text-xs text-ink-faint mb-1">Requête de référence :</p>
                    <SqlCode text={q.expected_query} />
                  </div>
                )}
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
              setCodePreview({});
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
    <div className="flex flex-col gap-6">
      {questions.map((q, i) => (
        <div key={q.id}>
          <p className="text-sm font-medium text-ink mb-2">{q.question}</p>

          {q.question_type === "code" ? (
            <div className="border border-line rounded-xl overflow-hidden bg-surface">
              <div className="border-b border-line">
                <CodeMirror
                  value={codeQueries[i] ?? ""}
                  onChange={(v) => setCodeQueries((c) => ({ ...c, [i]: v }))}
                  theme={oneDark}
                  extensions={[sql({ dialect: PostgreSQL })]}
                  basicSetup={{ lineNumbers: true, foldGutter: false }}
                  height="120px"
                  style={{ fontSize: 13 }}
                />
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                <button
                  onClick={() => handleTestQuery(i)}
                  disabled={!sandbox || sandbox.status !== "ready"}
                  className="text-xs font-semibold text-accent-ink border border-line-strong rounded-md px-3 py-1.5 hover:border-accent disabled:opacity-50"
                >
                  ▶ Tester ma requête
                </button>
                {!sandbox && (
                  <span className="font-mono text-[11px] text-danger ml-auto">
                    Bac à sable indisponible pour cette question.
                  </span>
                )}
                {sandbox && sandbox.status === "loading" && (
                  <span className="font-mono text-[11px] text-ink-faint ml-auto">Initialisation…</span>
                )}
              </div>
              {codePreview[i] && (
                <div className="max-h-56 overflow-auto border-t border-line">
                  {"error" in codePreview[i]! ? (
                    <pre className="px-3.5 py-2.5 text-[12px] font-mono text-danger whitespace-pre-wrap">
                      {(codePreview[i] as { error: string }).error}
                    </pre>
                  ) : (
                    (() => {
                      const r = codePreview[i] as QueryResult;
                      return r.rows.length === 0 ? (
                        <p className="px-3.5 py-2.5 text-[12px] text-ink-faint">Aucune ligne retournée.</p>
                      ) : (
                        <table className="w-full text-[11.5px] border-collapse">
                          <thead className="sticky top-0 bg-surface-2">
                            <tr>
                              {r.columns.map((c) => (
                                <th key={c} className="text-left font-mono font-medium text-ink-faint px-2.5 py-1.5 border-b border-line whitespace-nowrap">
                                  {c}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {r.rows.map((row, ri) => (
                              <tr key={ri} className="border-b border-line last:border-0">
                                {row.map((cell, ci) => (
                                  <td key={ci} className="px-2.5 py-1 text-ink-soft font-mono whitespace-nowrap">
                                    {cell === null ? <span className="text-ink-faint italic">null</span> : String(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })()
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {(q.options ?? []).map((opt, j) => (
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
          )}
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
