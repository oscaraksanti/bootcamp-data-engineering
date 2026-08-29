const STAGES = [
  { label: "Sources", detail: "APIs, bases, fichiers" },
  { label: "Ingestion", detail: "batch / streaming" },
  { label: "Stockage", detail: "data lake, warehouse" },
  { label: "Transformation", detail: "SQL, Spark, dbt" },
  { label: "Consommation", detail: "dashboards, IA" },
];

export function Pipeline() {
  return (
    <div
      className="my-5 flex flex-wrap items-stretch gap-2"
      role="img"
      aria-label="Pipeline de données : sources, ingestion, stockage, transformation, consommation"
    >
      {STAGES.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          <div className="border border-line bg-surface rounded-lg px-4 py-3 min-w-[110px]">
            <div className="font-mono text-[10px] text-ink-faint">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="font-semibold text-sm text-ink mt-0.5">{s.label}</div>
            <div className="text-[11px] text-ink-faint mt-0.5">{s.detail}</div>
          </div>
          {i < STAGES.length - 1 && (
            <span className="text-accent-ink" aria-hidden>
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
