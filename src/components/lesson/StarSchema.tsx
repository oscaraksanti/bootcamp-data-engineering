export function StarSchema({
  factTable,
  factColumns,
  dimensions,
}: {
  factTable: string;
  factColumns: string[];
  dimensions: string[];
}) {
  return (
    <div className="my-6 flex flex-col items-center">
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        {/* Lignes vers chaque dimension, positionnées en cercle */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          {dimensions.map((_, i) => {
            const angle = (i / dimensions.length) * 2 * Math.PI - Math.PI / 2;
            const x = 200 + Math.cos(angle) * 150;
            const y = 200 + Math.sin(angle) * 150;
            return (
              <line
                key={i}
                x1="200"
                y1="200"
                x2={x}
                y2={y}
                stroke="var(--line-strong)"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* Table de faits, au centre */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 border-2 border-accent bg-accent-soft rounded-xl px-4 py-3 text-center w-40 shadow-[0_8px_24px_-8px_rgba(108,92,231,0.4)]">
          <div className="font-mono text-[11px] font-bold text-accent-ink mb-1">{factTable}</div>
          <div className="font-mono text-[9.5px] text-accent-ink/80 leading-tight">
            {factColumns.map((c) => (
              <div key={c}>{c}</div>
            ))}
          </div>
        </div>

        {/* Dimensions, en cercle autour */}
        {dimensions.map((dim, i) => {
          const angle = (i / dimensions.length) * 2 * Math.PI - Math.PI / 2;
          const x = 50 + Math.cos(angle) * 37.5;
          const y = 50 + Math.sin(angle) * 37.5;
          return (
            <div
              key={dim}
              className="absolute z-10 border border-line-strong bg-surface rounded-lg px-3 py-2 text-center -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="font-mono text-[10.5px] font-semibold text-ink whitespace-nowrap">{dim}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
