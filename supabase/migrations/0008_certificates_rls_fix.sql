-- La policy INSERT d'origine (0001_init.sql) ne vérifiait que
-- `auth.uid() = user_id` — n'importe quel utilisateur connecté pouvait donc
-- s'auto-délivrer un certificat vérifiable publiquement pour n'importe quel
-- module, sans jamais avoir réussi le quiz. On exige désormais un
-- quiz_attempts réel et réussi pour ce module avant d'autoriser l'insertion.
--
-- Les certificats "finaux" (module_id null) restent réservés aux admins,
-- via la policy "for all" séparée (is_admin()) — aucun flux actuel n'en
-- crée automatiquement pour un apprenant.

drop policy if exists "Un utilisateur ne crée que ses propres certificats" on public.certificates;
create policy "Un utilisateur ne crée que ses propres certificats"
  on public.certificates for insert
  with check (
    auth.uid() = user_id
    and module_id is not null
    and exists (
      select 1 from public.quiz_attempts qa
      where qa.user_id = auth.uid()
        and qa.module_id = certificates.module_id
        and qa.passed = true
    )
  );
