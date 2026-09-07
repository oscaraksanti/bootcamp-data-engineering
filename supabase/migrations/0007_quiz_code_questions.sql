-- Ajoute un type de question "code" aux quiz : l'apprenant écrit une vraie
-- requête SQL, exécutée dans son propre bac à sable PGlite et comparée au
-- résultat d'une requête de référence (expected_query) — pas un simple QCM.

alter table public.quiz_questions
  add column if not exists question_type text not null default 'multiple_choice',
  add column if not exists starter_query text,
  add column if not exists expected_query text;

alter table public.quiz_questions
  drop constraint if exists quiz_questions_question_type_check;
alter table public.quiz_questions
  add constraint quiz_questions_question_type_check
    check (question_type in ('multiple_choice', 'code'));

-- Les questions QCM existantes ont déjà options/correct_index ; les
-- questions "code" n'en ont pas besoin — on assouplit les NOT NULL d'origine.
alter table public.quiz_questions alter column options drop not null;
alter table public.quiz_questions alter column correct_index drop not null;

alter table public.quiz_questions
  drop constraint if exists quiz_questions_type_fields_check;
alter table public.quiz_questions
  add constraint quiz_questions_type_fields_check
    check (
      (question_type = 'multiple_choice' and options is not null and correct_index is not null)
      or
      (question_type = 'code' and expected_query is not null)
    );
