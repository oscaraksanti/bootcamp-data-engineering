-- Ajoute un 3e niveau de hiérarchie : Module → Chapitre → Leçon.
-- Une leçon avec parent_lesson_id = null est soit un chapitre (si elle a des
-- enfants), soit une leçon autonome de plain-pied (si elle n'en a pas) —
-- rétro-compatible avec tout le contenu déjà en place (Modules 01 et 02).

alter table public.lessons
  add column if not exists parent_lesson_id uuid references public.lessons(id) on delete cascade;

create index if not exists idx_lessons_parent on public.lessons(parent_lesson_id);
