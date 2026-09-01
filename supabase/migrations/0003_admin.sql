-- DataLendo — Espace administrateur (Admin 1) : réglages plateforme,
-- rattachement Chariow par module, contenu de leçon en texte riche.

alter table public.modules
  add column if not exists chariow_product_id text;

alter table public.lessons
  add column if not exists body_html text;

-- ============================================================
-- PLATFORM_SETTINGS — ligne unique, réglages globaux modifiables sans redéploiement
-- ============================================================
create table if not exists public.platform_settings (
  id boolean primary key default true check (id), -- force une seule ligne
  chariow_api_key text,
  chariow_webhook_secret text,
  chariow_module_product_id text,
  chariow_full_access_product_id text,
  brand_name text not null default 'DataLendo',
  brand_accent_color text,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (id) values (true) on conflict (id) do nothing;

alter table public.platform_settings enable row level security;

drop policy if exists "Seuls les admins lisent les réglages" on public.platform_settings;
create policy "Seuls les admins lisent les réglages"
  on public.platform_settings for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Seuls les admins modifient les réglages" on public.platform_settings;
create policy "Seuls les admins modifient les réglages"
  on public.platform_settings for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============================================================
-- Admin : accès en lecture/écriture élargi sur le contenu et les apprenants.
-- Les policies 0001/0002 restent pour les apprenants ; celles-ci s'y ajoutent.
-- ============================================================
drop policy if exists "Les admins gèrent tous les modules" on public.modules;
create policy "Les admins gèrent tous les modules"
  on public.modules for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Les admins gèrent toutes les leçons" on public.lessons;
create policy "Les admins gèrent toutes les leçons"
  on public.lessons for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Les admins gèrent toutes les questions" on public.quiz_questions;
create policy "Les admins gèrent toutes les questions"
  on public.quiz_questions for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Les admins voient tous les profils" on public.profiles;
create policy "Les admins voient tous les profils"
  on public.profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Les admins gèrent les entitlements" on public.entitlements;
create policy "Les admins gèrent les entitlements"
  on public.entitlements for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Les admins voient toute la progression" on public.progress;
create policy "Les admins voient toute la progression"
  on public.progress for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Les admins voient toutes les tentatives" on public.quiz_attempts;
create policy "Les admins voient toutes les tentatives"
  on public.quiz_attempts for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Les admins voient tous les certificats" on public.certificates;
create policy "Les admins voient tous les certificats"
  on public.certificates for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Les admins voient tous les paiements" on public.payments;
create policy "Les admins voient tous les paiements"
  on public.payments for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============================================================
-- STORAGE — bucket public pour les images insérées dans les leçons
-- ============================================================
insert into storage.buckets (id, name, public)
values ('lesson-media', 'lesson-media', true)
on conflict (id) do nothing;

drop policy if exists "Lecture publique des médias de leçon" on storage.objects;
create policy "Lecture publique des médias de leçon"
  on storage.objects for select
  using (bucket_id = 'lesson-media');

drop policy if exists "Les admins uploadent des médias de leçon" on storage.objects;
create policy "Les admins uploadent des médias de leçon"
  on storage.objects for insert
  with check (
    bucket_id = 'lesson-media'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
