# DataLendo

Bootcamp Data Engineer francophone — plateforme réelle (Phase 0/1 : scaffolding
+ Module 01 en ligne, gratuit, avec quiz notés et certificat).

## Stack

Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4 + Supabase
(Postgres + Auth + Storage + RLS).

## Démarrer en local

1. **Connecter Supabase**
   - Dans ton projet Supabase → *SQL Editor*, colle et exécute le contenu de
     [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   - Dans *Project Settings → API*, récupère l'URL du projet, la clé `anon`
     et la clé `service_role`.
   - Copie-les dans `.env.local` (déjà créé à partir de `.env.local.example`,
     jamais commité) :
     ```
     NEXT_PUBLIC_SUPABASE_URL=...
     NEXT_PUBLIC_SUPABASE_ANON_KEY=...
     SUPABASE_SERVICE_ROLE_KEY=...
     ```

2. **Installer et seeder le contenu du Module 01**
   ```bash
   npm install
   npm run seed:module1
   ```
   Ce script remplit les tables `modules`, `lessons` et `quiz_questions` avec
   le contenu réel du Module 01 (4 leçons, quiz par leçon, quiz final). Il est
   idempotent — tu peux le relancer après avoir modifié le contenu.

3. **Lancer le serveur de dev**
   ```bash
   npm run dev
   ```
   Ouvre [http://localhost:3000](http://localhost:3000) : vitrine publique,
   `/inscription` pour créer un compte, `/app` pour le tableau de bord.

## Parcours de vérification (Phase 1)

1. Créer un compte sur `/inscription`.
2. Depuis `/app`, ouvrir le Module 01 → suivre les 4 leçons, répondre aux
   quiz de leçon, cliquer *Marquer terminé & continuer*.
3. Sur la dernière leçon, réussir le quiz final du module (≥ 80%) → un lien
   *Voir mon certificat* apparaît, menant à `/certificat/[slug]` — une page
   publique, consultable sans être connecté.

## Ce qui n'est pas encore construit

- **Paiement Chariow** (Phase 2) — le Module 01 est gratuit (`is_free`), les
  modules suivants n'existent pas encore en base.
- **Admin/CMS** (Phase 3) — le contenu se seed aujourd'hui via script, pas
  via interface.
- **Hub communauté** (Phase 4) — fil d'actualité, classement, calendrier.
- **Vidéo** — les leçons sont actuellement texte + graphiques + exercices
  interactifs ; l'intégration Bunny Stream arrivera avec les premières vidéos
  produites.

Voir le plan complet : `/Users/apple/.claude/plans/frolicking-questing-sonnet.md`.
