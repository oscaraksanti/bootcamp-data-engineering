"use client";

import { useState } from "react";

type ChoiceOption = { label: string; correct: boolean };

export function ExerciseChoice({
  title,
  scenario,
  options,
  feedback,
}: {
  title: string;
  scenario: string;
  options: ChoiceOption[];
  feedback: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="my-5 border border-line bg-surface-2 rounded-xl p-5">
      <div className="font-mono text-[11px] uppercase tracking-wide text-accent-ink mb-2">
        {title}
      </div>
      <p className="text-sm text-ink-soft mb-3">{scenario}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const showState = picked !== null;
          return (
            <button
              key={opt.label}
              onClick={() => setPicked(i)}
              disabled={picked !== null}
              className={`text-left text-sm rounded-lg border px-3.5 py-2.5 transition-colors ${
                showState && isPicked && opt.correct
                  ? "border-success bg-success-soft text-ink"
                  : showState && isPicked && !opt.correct
                    ? "border-danger bg-danger-soft text-ink"
                    : "border-line-strong bg-surface text-ink hover:border-accent"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="text-sm text-ink-soft mt-3 border-t border-line pt-3">{feedback}</p>
      )}
    </div>
  );
}

type JobItem = {
  text: string;
  options: string[];
  correctIndex: number;
};

export function JobMatchExercise({
  title,
  items,
}: {
  title: string;
  items: JobItem[];
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  return (
    <div className="my-5 border border-line bg-surface-2 rounded-xl p-5">
      <div className="font-mono text-[11px] uppercase tracking-wide text-accent-ink mb-3">
        {title}
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item, idx) => {
          const picked = answers[idx];
          const isCorrect = picked === item.correctIndex;
          return (
            <div key={idx} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
              <p className="text-sm text-ink-soft mb-2.5">{item.text}</p>
              <div className="flex flex-wrap gap-2">
                {item.options.map((opt, i) => {
                  const isPicked = picked === i;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers((a) => ({ ...a, [idx]: i }))}
                      disabled={picked !== undefined}
                      className={`text-xs font-medium rounded-full border px-3 py-1.5 transition-colors ${
                        picked !== undefined && isPicked && item.correctIndex === i
                          ? "border-success bg-success-soft text-ink"
                          : picked !== undefined && isPicked
                            ? "border-danger bg-danger-soft text-ink"
                            : "border-line-strong hover:border-accent text-ink"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {picked !== undefined && !isCorrect && (
                <p className="text-xs text-ink-faint mt-2">
                  Réponse attendue : {item.options[item.correctIndex]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Diagnostic({ title, items }: { title: string; items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setChecked((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const score = checked.size;
  const verdict =
    score >= 6
      ? "Ce métier semble taillé pour toi — fonce sur le Module 02."
      : score >= 3
        ? "C'est un bon point de départ. Le Module 02 (SQL) te donnera une réponse plus nette."
        : "Rien d'éliminatoire : beaucoup découvrent leur intérêt en pratiquant. Essaie au moins le Module 02 avant de trancher.";

  return (
    <div className="my-5 border border-line bg-surface-2 rounded-xl p-5">
      <div className="font-mono text-[11px] uppercase tracking-wide text-accent-ink mb-3">
        {title}
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <label key={i} className="flex items-start gap-2.5 text-sm text-ink-soft cursor-pointer">
            <input
              type="checkbox"
              checked={checked.has(i)}
              onChange={() => toggle(i)}
              className="mt-0.5 accent-[var(--accent)]"
            />
            {item}
          </label>
        ))}
      </div>
      <p className="text-sm text-ink border-t border-line mt-4 pt-3.5">
        <span className="font-mono text-accent-ink">{score}/8</span> — {verdict}
      </p>
    </div>
  );
}

export function Checklist({ title, items }: { title: string; items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setChecked((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="my-5 border border-line bg-surface-2 rounded-xl p-5">
      <div className="font-mono text-[11px] uppercase tracking-wide text-accent-ink mb-3">
        {title}
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <label key={i} className="flex items-start gap-2.5 text-sm text-ink-soft cursor-pointer">
            <input
              type="checkbox"
              checked={checked.has(i)}
              onChange={() => toggle(i)}
              className="mt-0.5 accent-[var(--accent)]"
            />
            <span className={checked.has(i) ? "line-through text-ink-faint" : ""}>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
