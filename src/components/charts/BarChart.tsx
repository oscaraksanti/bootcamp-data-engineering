type Point = { label: string; value: number };

export function BarChart({
  title,
  subtitle,
  points,
  sourceNote,
}: {
  title: string;
  subtitle?: string;
  points: Point[];
  sourceNote?: string;
}) {
  const width = 560;
  const height = 220;
  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(...points.map((p) => p.value));

  const gap = 12;
  const barW = (innerW - gap * (points.length - 1)) / points.length;

  return (
    <figure className="my-5 border border-line bg-surface rounded-xl p-5">
      <figcaption className="mb-1">
        <span className="block font-semibold text-sm text-ink">{title}</span>
        {subtitle && <span className="block text-xs text-ink-faint mt-0.5">{subtitle}</span>}
      </figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto mt-2" role="img" aria-label={title}>
        {points.map((p, i) => {
          const barH = (p.value / max) * innerH;
          const x = padding.left + i * (barW + gap);
          const y = padding.top + innerH - barH;
          const isLast = i === points.length - 1;
          return (
            <g key={p.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={4}
                fill={isLast ? "var(--accent)" : "var(--accent-soft)"}
              />
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="var(--ink-soft)"
              >
                {p.value}
              </text>
              <text
                x={x + barW / 2}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="var(--ink-faint)"
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
      {sourceNote && <p className="text-[11px] text-ink-faint mt-2">{sourceNote}</p>}
    </figure>
  );
}
