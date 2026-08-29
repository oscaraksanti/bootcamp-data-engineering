type Point = { label: string; value: number };

export function LineChart({
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
  const min = 0;
  const xStep = innerW / (points.length - 1);

  const coords = points.map((p, i) => ({
    x: padding.left + i * xStep,
    y: padding.top + innerH - ((p.value - min) / (max - min)) * innerH,
  }));

  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const areaPath = `${path} L${coords[coords.length - 1].x},${padding.top + innerH} L${coords[0].x},${padding.top + innerH} Z`;

  return (
    <figure className="my-5 border border-line bg-surface rounded-xl p-5">
      <figcaption className="mb-1">
        <span className="block font-semibold text-sm text-ink">{title}</span>
        {subtitle && <span className="block text-xs text-ink-faint mt-0.5">{subtitle}</span>}
      </figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto mt-2" role="img" aria-label={title}>
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerH * (1 - t)}
            y2={padding.top + innerH * (1 - t)}
            stroke="var(--line)"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill="var(--accent-soft)" />
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={i === coords.length - 1 ? 4 : 2.5}
            fill={i === coords.length - 1 ? "var(--accent)" : "var(--surface)"}
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
        ))}
        {points.map((p, i) => (
          <text
            key={p.label}
            x={coords[i].x}
            y={height - 8}
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-mono)"
            fill="var(--ink-faint)"
          >
            {p.label}
          </text>
        ))}
      </svg>
      {sourceNote && <p className="text-[11px] text-ink-faint mt-2">{sourceNote}</p>}
    </figure>
  );
}
