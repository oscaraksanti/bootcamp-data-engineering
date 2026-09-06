const COLORS = ["#c97a1d", "#8d90a6", "#c9a13d"]; // bronze, argent(silver), or(gold) — dérivés des tokens existants

export function Medallion({ layers }: { layers: { name: string; description: string }[] }) {
  return (
    <div className="my-6 grid sm:grid-cols-3 gap-3">
      {layers.map((layer, i) => (
        <div key={layer.name} className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="w-3 h-3 rounded-full flex-none"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="font-display font-bold text-sm text-ink">{layer.name}</span>
          </div>
          <div className="border border-line bg-surface rounded-xl px-4 py-4 w-full flex-1">
            <p className="text-[12.5px] text-ink-soft leading-relaxed">{layer.description}</p>
          </div>
          {i < layers.length - 1 && (
            <div className="hidden sm:block text-ink-faint mt-2 text-lg">→</div>
          )}
        </div>
      ))}
    </div>
  );
}
