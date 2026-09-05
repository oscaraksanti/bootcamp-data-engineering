-- Corrige une récursion infinie RLS : les policies 0003 vérifiaient le rôle
-- admin via `exists (select ... from public.profiles where ...)` DANS une
-- policy sur `profiles` elle-même (et, par ricochet, dans toute policy sur
-- une autre table qui consultait profiles) — Postgres doit ré-appliquer RLS
-- pour évaluer cette sous-requête, ce qui réévalue la même policy à l'infini.
--
-- Le correctif standard : une fonction SECURITY DEFINER, qui s'exécute avec
-- les droits de son propriétaire et n'est donc pas soumise à RLS pour sa
-- propre requête interne — plus de cycle.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- ============================================================
-- Remplace chaque policy admin par la version basée sur is_admin()
-- ============================================================
drop policy if exists "Les admins voient tous les profils" on public.profiles;
create policy "Les admins voient tous les profils"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Les admins gèrent tous les modules" on public.modules;
create policy "Les admins gèrent tous les modules"
  on public.modules for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Les admins gèrent toutes les leçons" on public.lessons;
create policy "Les admins gèrent toutes les leçons"
  on public.lessons for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Les admins gèrent toutes les questions" on public.quiz_questions;
create policy "Les admins gèrent toutes les questions"
  on public.quiz_questions for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Les admins gèrent les entitlements" on public.entitlements;
create policy "Les admins gèrent les entitlements"
  on public.entitlements for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Les admins voient toute la progression" on public.progress;
create policy "Les admins voient toute la progression"
  on public.progress for select
  using (public.is_admin());

drop policy if exists "Les admins voient toutes les tentatives" on public.quiz_attempts;
create policy "Les admins voient toutes les tentatives"
  on public.quiz_attempts for select
  using (public.is_admin());

drop policy if exists "Les admins voient tous les certificats" on public.certificates;
create policy "Les admins voient tous les certificats"
  on public.certificates for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Les admins voient tous les paiements" on public.payments;
create policy "Les admins voient tous les paiements"
  on public.payments for select
  using (public.is_admin());

drop policy if exists "Seuls les admins lisent les réglages" on public.platform_settings;
create policy "Seuls les admins lisent les réglages"
  on public.platform_settings for select
  using (public.is_admin());

drop policy if exists "Seuls les admins modifient les réglages" on public.platform_settings;
create policy "Seuls les admins modifient les réglages"
  on public.platform_settings for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Les admins uploadent des médias de leçon" on storage.objects;
create policy "Les admins uploadent des médias de leçon"
  on storage.objects for insert
  with check (bucket_id = 'lesson-media' and public.is_admin());

-- Les policies "accès selon les droits" (lessons, quiz_questions) de 0002 ne
-- consultaient pas profiles — pas de récursion là, rien à changer.
