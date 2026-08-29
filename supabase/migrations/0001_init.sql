-- DataLendo — schéma initial (Phase 0/1)
-- Couvre : profils, modules, leçons, quiz, tentatives, progression, certificats.
-- Les tables communauté (posts/comments) arrivent en Phase 4, pas ici.

-- ============================================================
-- PROFILES — un profil par utilisateur Supabase Auth
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  streak_count int not null default 0,
  points int not null default 0,
  subscription_status text not null default 'free' check (subscription_status in ('free', 'active', 'past_due', 'cancelled')),
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Un utilisateur voit et modifie son propre profil" on public.profiles;
create policy "Un utilisateur voit et modifie son propre profil"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Crée automatiquement un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- MODULES
-- ============================================================
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  slug text not null unique,
  title text not null,
  hours_min numeric not null,
  hours_max numeric not null,
  is_free boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null,
  created_at timestamptz not null default now()
);

alter table public.modules enable row level security;

-- Titres de modules publics (utile pour la page de certificat, visible sans compte)
drop policy if exists "Modules publiés visibles publiquement" on public.modules;
create policy "Modules publiés visibles publiquement"
  on public.modules for select
  using (status = 'published');

-- ============================================================
-- LESSONS
-- ============================================================
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  number text not null, -- ex. "1.2"
  slug text not null,
  title text not null,
  body_content jsonb not null default '{}'::jsonb, -- blocs de contenu (texte, graphique, exercice)
  video_id text, -- id Bunny Stream, nullable tant que la vidéo n'est pas produite
  duration_minutes int not null default 0,
  resources jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null,
  created_at timestamptz not null default now(),
  unique (module_id, slug)
);

alter table public.lessons enable row level security;

drop policy if exists "Leçons publiées visibles par tous les connectés" on public.lessons;
create policy "Leçons publiées visibles par tous les connectés"
  on public.lessons for select
  to authenticated
  using (status = 'published');

-- ============================================================
-- QUIZ QUESTIONS — rattachées soit à une leçon, soit au quiz final d'un module
-- ============================================================
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade, -- non-null = quiz final du module
  question text not null,
  options jsonb not null, -- ["option A", "option B", "option C"]
  correct_index int not null,
  explain text,
  sort_order int not null default 0,
  check (
    (lesson_id is not null and module_id is null) or
    (lesson_id is null and module_id is not null)
  )
);

alter table public.quiz_questions enable row level security;

drop policy if exists "Questions visibles par tous les connectés" on public.quiz_questions;
create policy "Questions visibles par tous les connectés"
  on public.quiz_questions for select
  to authenticated
  using (true);

-- ============================================================
-- QUIZ ATTEMPTS
-- ============================================================
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  score int not null,
  total int not null,
  passed boolean not null,
  attempted_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

drop policy if exists "Un utilisateur gère ses propres tentatives" on public.quiz_attempts;
create policy "Un utilisateur gère ses propres tentatives"
  on public.quiz_attempts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- PROGRESS — leçons marquées terminées
-- ============================================================
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.progress enable row level security;

drop policy if exists "Un utilisateur gère sa propre progression" on public.progress;
create policy "Un utilisateur gère sa propre progression"
  on public.progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- CERTIFICATES — publiquement lisibles via leur slug (page de vérification)
-- ============================================================
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null, -- null = certificat final du programme
  public_slug text not null unique,
  issued_at timestamptz not null default now()
);

alter table public.certificates enable row level security;

drop policy if exists "Un certificat est lisible par tout le monde via son slug" on public.certificates;
create policy "Un certificat est lisible par tout le monde via son slug"
  on public.certificates for select
  using (true);

drop policy if exists "Un utilisateur ne crée que ses propres certificats" on public.certificates;
create policy "Un utilisateur ne crée que ses propres certificats"
  on public.certificates for insert
  with check (auth.uid() = user_id);

-- Un profil devient lisible publiquement s'il détient au moins un certificat —
-- nécessaire pour que la page /certificat/[slug] affiche le nom du titulaire
-- sans que le visiteur soit connecté. Placée ici (et pas plus haut, à côté de
-- la table profiles) car elle référence public.certificates, créée juste au-dessus.
drop policy if exists "Profil visible publiquement s'il a un certificat" on public.profiles;
create policy "Profil visible publiquement s'il a un certificat"
  on public.profiles for select
  using (exists (select 1 from public.certificates c where c.user_id = profiles.id));

-- ============================================================
-- NOTES — notes horodatées prises pendant une leçon
-- ============================================================
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  timestamp_seconds int,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.notes enable row level security;

drop policy if exists "Un utilisateur gère ses propres notes" on public.notes;
create policy "Un utilisateur gère ses propres notes"
  on public.notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- PAYMENTS — trace des événements Chariow (Phase 2)
-- ============================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  chariow_order_id text not null unique,
  amount numeric,
  status text not null check (status in ('paid', 'failed', 'cancelled')),
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

drop policy if exists "Un utilisateur voit ses propres paiements" on public.payments;
create policy "Un utilisateur voit ses propres paiements"
  on public.payments for select
  using (auth.uid() = user_id);
-- Aucune policy insert/update : les paiements ne sont écrits que par le
-- webhook Chariow via le client service-role, qui contourne RLS.
