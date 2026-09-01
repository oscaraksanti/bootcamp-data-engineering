-- DataLendo — Phase 2 : rôles, multi-programmes, entitlements, paiement réel.
-- S'exécute après 0001_init.sql.

-- ============================================================
-- PROFILES — rôle + visibilité publique
-- ============================================================
alter table public.profiles
  add column if not exists role text not null default 'learner' check (role in ('learner', 'admin')),
  add column if not exists is_public boolean not null default true;

-- ============================================================
-- PROGRAMS — un programme par sous-domaine (data-engineering, data-analysis, ...)
-- ============================================================
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,       -- "data-engineering"
  subdomain text not null unique,  -- "data-engineering" (utilisé pour <subdomain>.datalendo.com)
  title text not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

alter table public.programs enable row level security;

drop policy if exists "Programmes publiés visibles par tous" on public.programs;
create policy "Programmes publiés visibles par tous"
  on public.programs for select
  using (status = 'published');

insert into public.programs (slug, subdomain, title, status)
values ('data-engineering', 'data-engineering', 'Data Engineering', 'published')
on conflict (slug) do nothing;

alter table public.modules
  add column if not exists program_id uuid references public.programs(id) on delete cascade;

update public.modules
  set program_id = (select id from public.programs where slug = 'data-engineering')
  where program_id is null;

-- ============================================================
-- ENTITLEMENTS — ce qu'un utilisateur a le droit de voir
-- scope_module_id null = accès complet (offre 297$/an) ; sinon accès à ce module précis (30$, à vie)
-- ============================================================
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scope_module_id uuid references public.modules(id) on delete cascade,
  source text not null check (source in ('free', 'module_purchase', 'subscription', 'admin_grant')),
  granted_at timestamptz not null default now(),
  expires_at timestamptz, -- null = à vie / jamais expiré
  unique (user_id, scope_module_id)
);

alter table public.entitlements enable row level security;

drop policy if exists "Un utilisateur voit ses propres accès" on public.entitlements;
create policy "Un utilisateur voit ses propres accès"
  on public.entitlements for select
  using (auth.uid() = user_id);
-- Pas de policy insert/update pour les utilisateurs : les entitlements ne sont
-- créés que par le webhook Chariow ou l'admin, via le client service-role.

-- ============================================================
-- PAYMENTS — deux types de produit (module à la carte vs accès complet)
-- ============================================================
alter table public.payments
  add column if not exists product_type text check (product_type in ('module', 'full_access')),
  add column if not exists module_id uuid references public.modules(id) on delete set null;

-- ============================================================
-- ACCÈS RÉEL AUX LEÇONS ET QUIZ — remplace les policies 0001 qui ne
-- vérifiaient que le statut publié, pas les droits d'accès payants.
-- Sans ça, un utilisateur pourrait lire le contenu d'un module verrouillé
-- directement via l'API Supabase (clé anon), en contournant l'UI.
-- ============================================================
drop policy if exists "Leçons publiées visibles par tous les connectés" on public.lessons;
create policy "Leçons accessibles selon les droits d'accès"
  on public.lessons for select
  to authenticated
  using (
    status = 'published'
    and (
      exists (select 1 from public.modules m where m.id = lessons.module_id and m.is_free)
      or exists (
        select 1 from public.entitlements e
        where e.user_id = auth.uid()
          and (e.expires_at is null or e.expires_at > now())
          and (e.scope_module_id is null or e.scope_module_id = lessons.module_id)
      )
    )
  );

drop policy if exists "Questions visibles par tous les connectés" on public.quiz_questions;
create policy "Questions accessibles selon les droits d'accès"
  on public.quiz_questions for select
  to authenticated
  using (
    exists (
      select 1 from public.modules m
      where m.id = coalesce(
        quiz_questions.module_id,
        (select l.module_id from public.lessons l where l.id = quiz_questions.lesson_id)
      )
      and (
        m.is_free
        or exists (
          select 1 from public.entitlements e
          where e.user_id = auth.uid()
            and (e.expires_at is null or e.expires_at > now())
            and (e.scope_module_id is null or e.scope_module_id = m.id)
        )
      )
    )
  );

-- ============================================================
-- LESSON COMMENTS — discussion/Q&A par leçon
-- ============================================================
create table if not exists public.lesson_comments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.lesson_comments(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.lesson_comments enable row level security;

drop policy if exists "Les commentaires de leçon sont visibles par les connectés" on public.lesson_comments;
create policy "Les commentaires de leçon sont visibles par les connectés"
  on public.lesson_comments for select
  to authenticated
  using (true);

drop policy if exists "Un utilisateur poste ses propres commentaires" on public.lesson_comments;
create policy "Un utilisateur poste ses propres commentaires"
  on public.lesson_comments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Un utilisateur gère ses propres commentaires" on public.lesson_comments;
create policy "Un utilisateur gère ses propres commentaires"
  on public.lesson_comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Un utilisateur supprime ses propres commentaires" on public.lesson_comments;
create policy "Un utilisateur supprime ses propres commentaires"
  on public.lesson_comments for delete
  using (auth.uid() = user_id);

-- ============================================================
-- POSTS — fil communauté (annonces, questions, entraide)
-- ============================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  category text not null default 'discussion' check (category in ('annonce', 'question', 'entraide', 'discussion')),
  title text not null,
  body text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

drop policy if exists "Les posts sont visibles par les connectés" on public.posts;
create policy "Les posts sont visibles par les connectés"
  on public.posts for select
  to authenticated
  using (true);

drop policy if exists "Un utilisateur poste ses propres messages" on public.posts;
create policy "Un utilisateur poste ses propres messages"
  on public.posts for insert
  with check (auth.uid() = author_id);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.post_comments enable row level security;

drop policy if exists "Les réponses aux posts sont visibles par les connectés" on public.post_comments;
create policy "Les réponses aux posts sont visibles par les connectés"
  on public.post_comments for select
  to authenticated
  using (true);

drop policy if exists "Un utilisateur répond avec son propre compte" on public.post_comments;
create policy "Un utilisateur répond avec son propre compte"
  on public.post_comments for insert
  with check (auth.uid() = author_id);

-- ============================================================
-- EVENTS — lives / webinaires
-- ============================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  join_url text,
  replay_url text,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "Les événements sont visibles par les connectés" on public.events;
create policy "Les événements sont visibles par les connectés"
  on public.events for select
  to authenticated
  using (true);

-- ============================================================
-- JOBS — offres d'emploi, gérées par l'admin
-- ============================================================
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text,
  remote boolean not null default false,
  apply_url text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'expired')),
  posted_at timestamptz not null default now(),
  expires_at timestamptz
);

alter table public.jobs enable row level security;

drop policy if exists "Les offres sont visibles par les connectés" on public.jobs;
create policy "Les offres sont visibles par les connectés"
  on public.jobs for select
  to authenticated
  using (true);
