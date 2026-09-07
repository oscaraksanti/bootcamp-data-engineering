-- Le fil communauté et les commentaires de leçon affichent le nom de leur
-- auteur — jusqu'ici, un profil n'était lisible que par son propriétaire,
-- un admin, ou publiquement s'il détenait un certificat. On ajoute une
-- policy SELECT pour que tout utilisateur connecté puisse lire le profil
-- de n'importe quel autre apprenant connecté (les policies SELECT
-- s'additionnent en OR — celles déjà en place restent valables).

drop policy if exists "Les profils sont visibles par les connectés" on public.profiles;
create policy "Les profils sont visibles par les connectés"
  on public.profiles for select
  to authenticated
  using (true);
