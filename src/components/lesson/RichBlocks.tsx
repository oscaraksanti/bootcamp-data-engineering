const COLOR_MAP = {
  accent: { bg: "bg-accent-soft", text: "text-accent-ink", dot: "bg-accent" },
  cyan: { bg: "bg-cyan-soft", text: "text-cyan", dot: "bg-cyan" },
  amber: { bg: "bg-amber-soft", text: "text-amber", dot: "bg-amber" },
  success: { bg: "bg-success-soft", text: "text-success", dot: "bg-success" },
} as const;

export function RoleCards({
  roles,
}: {
  roles: {
    name: string;
    color: keyof typeof COLOR_MAP;
    mission: string;
    tools: string;
    deliverable: string;
    salaryHint: string;
  }[];
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-3.5 my-5">
      {roles.map((r) => {
        const c = COLOR_MAP[r.color] ?? COLOR_MAP.accent;
        return (
          <div key={r.name} className="border border-line bg-surface rounded-xl p-4.5">
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
              <span className="font-display font-bold text-[15px] text-ink">{r.name}</span>
            </div>
            <p className="text-[13px] text-ink-soft mb-3">{r.mission}</p>
            <div className={`inline-block font-mono text-[10.5px] ${c.bg} ${c.text} rounded-full px-2.5 py-1 mb-2.5`}>
              {r.tools}
            </div>
            <p className="text-[12px] text-ink-faint mb-1.5">{r.deliverable}</p>
            <p className="text-[12px] font-medium text-ink">{r.salaryHint}</p>
          </div>
        );
      })}
    </div>
  );
}

export function ToolsGrid({
  categories,
}: {
  categories: { category: string; tools: { name: string; note: string }[] }[];
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-3.5 my-5">
      {categories.map((cat) => (
        <div key={cat.category} className="border border-line bg-surface-2 rounded-xl p-4.5">
          <div className="font-mono text-[10.5px] uppercase tracking-wide text-ink-faint mb-2.5">
            {cat.category}
          </div>
          <div className="flex flex-col gap-1.5">
            {cat.tools.map((t) => (
              <div key={t.name} className="flex items-baseline gap-2 text-[13px]">
                <span className="font-semibold text-ink">{t.name}</span>
                <span className="text-ink-faint text-[12px]">{t.note}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Timeline({
  title,
  steps,
}: {
  title?: string;
  steps: { time: string; activity: string }[];
}) {
  return (
    <div className="my-5">
      {title && <div className="font-mono text-[11px] uppercase tracking-wide text-ink-faint mb-3">{title}</div>}
      <div className="relative pl-6">
        <div className="absolute left-[5px] top-1 bottom-1 w-px bg-line-strong" />
        <div className="flex flex-col gap-4">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-accent border-2 border-surface" />
              <span className="font-mono text-[11px] text-accent-ink">{s.time}</span>
              <p className="text-[13.5px] text-ink-soft mt-0.5">{s.activity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatGrid({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
      {stats.map((s, i) => (
        <div key={i} className="border border-line bg-surface rounded-xl px-3.5 py-3.5 text-center">
          <div className="font-mono font-semibold text-lg text-accent-ink">{s.value}</div>
          <div className="text-[11px] text-ink-faint mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function CaseStudy({
  company,
  challenge,
  solution,
  outcome,
}: {
  company: string;
  challenge: string;
  solution: string;
  outcome: string;
}) {
  return (
    <div className="my-5 border-l-2 border-accent bg-surface-2 rounded-r-xl px-5 py-4">
      <div className="font-display font-bold text-sm text-ink mb-2.5">Étude de cas — {company}</div>
      <p className="text-[13px] text-ink-soft mb-2"><b className="text-ink">Défi.</b> {challenge}</p>
      <p className="text-[13px] text-ink-soft mb-2"><b className="text-ink">Solution.</b> {solution}</p>
      <p className="text-[13px] text-ink-soft"><b className="text-ink">Résultat.</b> {outcome}</p>
    </div>
  );
}

export function ModuleRoadmap({
  modules,
}: {
  modules: { number: number; title: string; note: string }[];
}) {
  return (
    <div className="flex flex-col gap-2 my-5">
      {modules.map((m) => (
        <div key={m.number} className="flex gap-3.5 border border-line bg-surface rounded-lg px-4 py-3">
          <span className="font-mono text-[11px] text-ink-faint flex-none w-8 pt-0.5">
            {String(m.number).padStart(2, "0")}
          </span>
          <div>
            <div className="font-semibold text-[13.5px] text-ink">{m.title}</div>
            <div className="text-[12px] text-ink-faint mt-0.5">{m.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
