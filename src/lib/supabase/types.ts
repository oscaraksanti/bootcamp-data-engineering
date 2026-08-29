// Types hand-écrits pour matcher supabase/migrations/0001_init.sql.
// Une fois le projet Supabase connecté, régénère-les avec :
//   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
//
// Note : chaque table doit inclure `Relationships` et le schéma doit exposer
// `Tables`/`Views`/`Functions` pour satisfaire GenericSchema de postgrest-js —
// sans ça, TypeScript retombe silencieusement sur `never` pour chaque Row.

export type SubscriptionStatus = "free" | "active" | "past_due" | "cancelled";
export type ContentStatus = "draft" | "published";

type NoRelationships = { Relationships: [] };

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          streak_count: number;
          points: number;
          subscription_status: SubscriptionStatus;
          subscription_expires_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      } & NoRelationships;
      modules: {
        Row: {
          id: string;
          number: number;
          slug: string;
          title: string;
          hours_min: number;
          hours_max: number;
          is_free: boolean;
          status: ContentStatus;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["modules"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["modules"]["Row"]>;
      } & NoRelationships;
      lessons: {
        Row: {
          id: string;
          module_id: string;
          number: string;
          slug: string;
          title: string;
          body_content: Record<string, unknown>;
          video_id: string | null;
          duration_minutes: number;
          resources: unknown[];
          status: ContentStatus;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["lessons"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["lessons"]["Row"]>;
      } & NoRelationships;
      quiz_questions: {
        Row: {
          id: string;
          lesson_id: string | null;
          module_id: string | null;
          question: string;
          options: string[];
          correct_index: number;
          explain: string | null;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["quiz_questions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["quiz_questions"]["Row"]>;
      } & NoRelationships;
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string | null;
          module_id: string | null;
          score: number;
          total: number;
          passed: boolean;
          attempted_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["quiz_attempts"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["quiz_attempts"]["Row"]>;
      } & NoRelationships;
      progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["progress"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["progress"]["Row"]>;
      } & NoRelationships;
      certificates: {
        Row: {
          id: string;
          user_id: string;
          module_id: string | null;
          public_slug: string;
          issued_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["certificates"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["certificates"]["Row"]>;
      } & NoRelationships;
      notes: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          timestamp_seconds: number | null;
          body: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notes"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["notes"]["Row"]>;
      } & NoRelationships;
      payments: {
        Row: {
          id: string;
          user_id: string | null;
          chariow_order_id: string;
          amount: number | null;
          status: "paid" | "failed" | "cancelled";
          raw_payload: Record<string, unknown>;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
      } & NoRelationships;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
