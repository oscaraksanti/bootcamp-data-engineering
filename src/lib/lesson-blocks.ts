// Schéma des blocs de contenu stockés dans lessons.body_content (jsonb).
// Un nouveau type de bloc = un nouveau cas dans components/lesson/LessonBody.tsx.

export type LessonBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; text: string }
  | { type: "callout"; title: string; text: string }
  | { type: "pipeline" }
  | {
      type: "chart_line" | "chart_bar";
      title: string;
      subtitle?: string;
      points: { label: string; value: number }[];
      sourceNote?: string;
    }
  | {
      type: "exercise_choice";
      title: string;
      scenario: string;
      options: { label: string; correct: boolean }[];
      feedback: string;
    }
  | {
      type: "job_match_exercise";
      title: string;
      items: { text: string; options: string[]; correctIndex: number }[];
    }
  | { type: "diagnostic"; title: string; items: string[] }
  | { type: "checklist"; title: string; items: string[] }
  | {
      type: "role_cards";
      roles: {
        name: string;
        color: "accent" | "cyan" | "amber" | "success";
        mission: string;
        tools: string;
        deliverable: string;
        salaryHint: string;
      }[];
    }
  | {
      type: "tools_grid";
      categories: {
        category: string;
        tools: { name: string; note: string }[];
      }[];
    }
  | {
      type: "timeline";
      title?: string;
      steps: { time: string; activity: string }[];
    }
  | {
      type: "stat_grid";
      stats: { value: string; label: string }[];
    }
  | {
      type: "case_study";
      company: string;
      challenge: string;
      solution: string;
      outcome: string;
    }
  | {
      type: "module_roadmap";
      modules: { number: number; title: string; note: string }[];
    }
  | { type: "thinking_prompt"; text: string }
  | { type: "sql_code"; text: string; caption?: string }
  | { type: "sql_sandbox"; prompt: string; starterQuery?: string };

export interface LessonBodyContent {
  blocks: LessonBlock[];
}
