// Types hand-écrits pour matcher supabase/migrations/0001_init.sql + 0002_platform.sql.
// Une fois le projet Supabase connecté, régénère-les avec :
//   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
//
// Note : chaque table doit inclure `Relationships` et le schéma doit exposer
// `Tables`/`Views`/`Functions` pour satisfaire GenericSchema de postgrest-js —
// sans ça, TypeScript retombe silencieusement sur `never` pour chaque Row.

export type SubscriptionStatus = "free" | "active" | "past_due" | "cancelled";
export type ContentStatus = "draft" | "published";
export type ProfileRole = "learner" | "admin";
export type EntitlementSource = "free" | "module_purchase" | "subscription" | "admin_grant";
export type PaymentProductType = "module" | "full_access";
export type PostCategory = "annonce" | "question" | "entraide" | "discussion";
export type JobStatus = "active" | "expired";

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
          role: ProfileRole;
          is_public: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      } & NoRelationships;
      programs: {
        Row: {
          id: string;
          slug: string;
          subdomain: string;
          title: string;
          status: ContentStatus;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["programs"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["programs"]["Row"]>;
      } & NoRelationships;
      modules: {
        Row: {
          id: string;
          program_id: string | null;
          number: number;
          slug: string;
          title: string;
          hours_min: number;
          hours_max: number;
          is_free: boolean;
          status: ContentStatus;
          sort_order: number;
          chariow_product_id: string | null;
          certificate_blurb: string | null;
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
          body_html: string | null;
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
          product_type: PaymentProductType | null;
          module_id: string | null;
          raw_payload: Record<string, unknown>;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
      } & NoRelationships;
      entitlements: {
        Row: {
          id: string;
          user_id: string;
          scope_module_id: string | null;
          source: EntitlementSource;
          granted_at: string;
          expires_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["entitlements"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["entitlements"]["Row"]>;
      } & NoRelationships;
      lesson_comments: {
        Row: {
          id: string;
          lesson_id: string;
          user_id: string;
          parent_id: string | null;
          body: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["lesson_comments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["lesson_comments"]["Row"]>;
      } & NoRelationships;
      posts: {
        Row: {
          id: string;
          author_id: string;
          program_id: string | null;
          category: PostCategory;
          title: string;
          body: string;
          pinned: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
      } & NoRelationships;
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          body: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["post_comments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["post_comments"]["Row"]>;
      } & NoRelationships;
      events: {
        Row: {
          id: string;
          program_id: string | null;
          title: string;
          description: string | null;
          starts_at: string;
          join_url: string | null;
          replay_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["events"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
      } & NoRelationships;
      platform_settings: {
        Row: {
          id: true;
          chariow_api_key: string | null;
          chariow_webhook_secret: string | null;
          chariow_module_product_id: string | null;
          chariow_full_access_product_id: string | null;
          brand_name: string;
          brand_accent_color: string | null;
          certificate_location: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["platform_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["platform_settings"]["Row"]>;
      } & NoRelationships;
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string | null;
          remote: boolean;
          apply_url: string;
          description: string | null;
          status: JobStatus;
          posted_at: string;
          expires_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["jobs"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["jobs"]["Row"]>;
      } & NoRelationships;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
