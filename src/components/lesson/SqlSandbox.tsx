"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { useSandbox, type QueryResult } from "@/components/lesson/SandboxProvider";

export function SqlSandbox({ prompt, starterQuery }: { prompt: string; starterQuery?: string }) {
  const { status, error, runQuery, reset, retry } = useSandbox();
  const [query, setQuery] = useState(starterQuery ?? "select * from fact_transactions limit 10;");
  const [result, setResult] = useState<QueryResult | { error: string } | null>(null);
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    const res = await runQuery(query);
    setResult(res);
    setRunning(false);
  }

  return (
    <div className="my-5 border border-line rounded-xl overflow-hidden bg-surface">
      <div className="px-4 py-3 border-b border-line bg-surface-2">
        <p className="text-[13px] text-ink-soft">{prompt}</p>
      </div>

      <div className="border-b border-line">
        <CodeMirror
          value={query}
          onChange={setQuery}
          extensions={[sql({ dialect: PostgreSQL })]}
          basicSetup={{ lineNumbers: true, foldGutter: false }}
          height="140px"
          style={{ fontSize: 13 }}
        />
      </div>

      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-line">
        <button
          onClick={handleRun}
          disabled={status !== "ready" || running}
          className="text-xs font-semibold text-white bg-accent hover:bg-accent-strong rounded-md px-3.5 py-1.5 disabled:opacity-50"
        >
          {running ? "Exécution…" : "▶ Exécuter"}
        </button>
        <button
          onClick={reset}
          disabled={status !== "ready"}
          className="text-xs font-medium text-ink-faint hover:text-ink disabled:opacity-50"
        >
          Réinitialiser les données
        </button>
        {status === "loading" && (
          <span className="font-mono text-[11px] text-ink-faint ml-auto">
            Initialisation de PostgreSQL dans le navigateur…
          </span>
        )}
        {status === "error" && (
          <span className="font-mono text-[11px] text-danger ml-auto flex items-center gap-2">
            {error}
            <button onClick={retry} className="underline">Réessayer</button>
          </span>
        )}
      </div>

      {result && (
        <div className="max-h-72 overflow-auto">
          {"error" in result ? (
            <pre className="px-4 py-3 text-[12.5px] font-mono text-danger whitespace-pre-wrap">{result.error}</pre>
          ) : result.rows.length === 0 ? (
            <p className="px-4 py-3 text-[12.5px] text-ink-faint">
              Requête exécutée — {result.rowCount === 0 ? "aucune ligne retournée" : `${result.rowCount} ligne(s) affectée(s)`}.
            </p>
          ) : (
            <table className="w-full text-[12px] border-collapse">
              <thead className="sticky top-0 bg-surface-2">
                <tr>
                  {result.columns.map((c) => (
                    <th key={c} className="text-left font-mono font-medium text-ink-faint px-3 py-2 border-b border-line whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-1.5 text-ink-soft font-mono whitespace-nowrap">
                        {cell === null ? <span className="text-ink-faint italic">null</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
