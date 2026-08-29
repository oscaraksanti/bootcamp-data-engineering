import type { LessonBlock, LessonBodyContent } from "@/lib/lesson-blocks";
import { Pipeline } from "@/components/lesson/Pipeline";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import {
  Checklist,
  Diagnostic,
  ExerciseChoice,
  JobMatchExercise,
} from "@/components/lesson/Exercises";
import {
  CaseStudy,
  ModuleRoadmap,
  RoleCards,
  StatGrid,
  Timeline,
  ToolsGrid,
} from "@/components/lesson/RichBlocks";

export function LessonBody({ content }: { content: LessonBodyContent }) {
  return (
    <div className="flex flex-col">
      {content.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-[15px] leading-relaxed text-ink-soft mb-4 max-w-[68ch]">{block.text}</p>;

    case "h3":
      return (
        <h3 className="font-display font-bold text-lg text-ink mt-7 mb-3 first:mt-0">
          {block.text}
        </h3>
      );

    case "list":
      return (
        <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5 text-[15px] text-ink-soft max-w-[68ch]">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "table":
      return (
        <div className="overflow-x-auto my-5 border border-line rounded-xl">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-surface-2">
                {block.headers.map((h) => (
                  <th key={h} className="text-left font-mono text-[10.5px] uppercase tracking-wide text-ink-faint px-3.5 py-2.5 border-b border-line">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3.5 py-2.5 text-ink-soft align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "code":
      return (
        <pre className="my-4 bg-surface-2 border border-line rounded-lg px-4 py-3 overflow-x-auto">
          <code className="font-mono text-[13px] text-ink whitespace-pre">{block.text}</code>
        </pre>
      );

    case "callout":
      return (
        <div className="my-5 border border-line bg-amber-soft rounded-xl px-5 py-4">
          <div className="font-mono text-[11px] uppercase tracking-wide text-amber mb-1.5">
            {block.title}
          </div>
          <p className="text-sm text-ink-soft">{block.text}</p>
        </div>
      );

    case "pipeline":
      return <Pipeline />;

    case "chart_line":
      return (
        <LineChart
          title={block.title}
          subtitle={block.subtitle}
          points={block.points}
          sourceNote={block.sourceNote}
        />
      );

    case "chart_bar":
      return (
        <BarChart
          title={block.title}
          subtitle={block.subtitle}
          points={block.points}
          sourceNote={block.sourceNote}
        />
      );

    case "exercise_choice":
      return (
        <ExerciseChoice
          title={block.title}
          scenario={block.scenario}
          options={block.options}
          feedback={block.feedback}
        />
      );

    case "job_match_exercise":
      return <JobMatchExercise title={block.title} items={block.items} />;

    case "diagnostic":
      return <Diagnostic title={block.title} items={block.items} />;

    case "checklist":
      return <Checklist title={block.title} items={block.items} />;

    case "role_cards":
      return <RoleCards roles={block.roles} />;

    case "tools_grid":
      return <ToolsGrid categories={block.categories} />;

    case "timeline":
      return <Timeline title={block.title} steps={block.steps} />;

    case "stat_grid":
      return <StatGrid stats={block.stats} />;

    case "case_study":
      return (
        <CaseStudy
          company={block.company}
          challenge={block.challenge}
          solution={block.solution}
          outcome={block.outcome}
        />
      );

    case "module_roadmap":
      return <ModuleRoadmap modules={block.modules} />;

    default:
      return null;
  }
}
