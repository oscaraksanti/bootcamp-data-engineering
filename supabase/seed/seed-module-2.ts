/**
 * Seed le Module 02 — SQL & Modélisation des Données (10 leçons, ~40h) dans
 * Supabase. Fil rouge AfriPay, à pratiquer dans le bac à sable PGlite
 * (/app/sandbox ou intégré aux leçons via le bloc sql_sandbox).
 *
 * Usage : npm run seed:module2   (nécessite .env.local rempli)
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  console.log("→ Module 02…");
  const { data: mod, error: modErr } = await supabase
    .from("modules")
    .upsert(
      {
        number: 2,
        slug: "sql-et-modelisation-des-donnees",
        title: "SQL & Modélisation des Données",
        hours_min: 38,
        hours_max: 42,
        status: "published",
        sort_order: 2,
        certificate_blurb:
          "L'apprenant maîtrise le SQL avancé (fenêtrage, CTEs, JSON), la modélisation relationnelle et dimensionnelle (star schema, SCD), la construction d'un entrepôt de données en architecture Medallion avec chargement incrémental idempotent, l'optimisation de requêtes, et les fondations de dbt — démontré sur un projet complet, AfriPay Data Platform.",
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (modErr || !mod) throw modErr ?? new Error("Module 02 introuvable après upsert");

  const lessons = [
    // ============================================================
    // CHAPITRE 2.1 — REMISE EN CONTEXTE & ENVIRONNEMENT
    // ============================================================
    {
      number: "2.1",
      slug: "remise-en-contexte-environnement-postgresql",
      title: "Remise en contexte & environnement PostgreSQL",
      duration_minutes: 15,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Au Module 01, tu as vu qu'un système de données traverse cinq étapes : sources, ingestion, stockage, transformation, consommation. Ce module s'installe dans les deux étapes du milieu — stockage et transformation — et y reste pendant 40 heures, parce que c'est là que se joue la moitié du travail réel d'un data engineer.",
          },
          {
            type: "p",
            text: "Ce chapitre pose les fondations avant d'écrire la moindre requête sérieuse : pourquoi PostgreSQL, comment installer ton environnement de travail, comment fonctionne le bac à sable de DataLendo, et le contexte complet du fil rouge AfriPay que tu vas construire pendant tout ce module — et retrouver dans les modules suivants.",
          },
          {
            type: "checklist",
            title: "Les 10 leçons de ce chapitre",
            items: [
              "2.1.1 — Rappel express : où se situe ce module dans le métier de data engineer",
              "2.1.2 — Pourquoi PostgreSQL, face à MySQL, SQL Server, Oracle et au NoSQL",
              "2.1.3 — Installation PostgreSQL + VS Code",
              "2.1.4 — Anatomie d'un serveur PostgreSQL : cluster, base, schéma, table, rôle",
              "2.1.5 — Naviguer en ligne de commande avec psql",
              "2.1.6 — VS Code + SQLTools au quotidien, organiser ses fichiers SQL",
              "2.1.7 — Le bac à sable DataLendo, sous le capot",
              "2.1.8 — Découvrir AfriPay : le contexte métier du fil rouge",
              "2.1.9 — Explorer un schéma inconnu, méthodiquement",
              "2.1.10 — Atelier de synthèse du chapitre",
            ],
          },
        ],
      },
      quiz: [],
    },

    // ------------------------------------------------------------
    // 2.1.1 — RAPPEL EXPRESS
    // ------------------------------------------------------------
    {
      number: "2.1.1",
      slug: "rappel-express-pipeline-data",
      title: "Rappel express : où se situe ce module",
      parentSlug: "remise-en-contexte-environnement-postgresql",
      duration_minutes: 20,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Le Module 01 a posé un schéma en cinq étapes que tout système de données traverse : sources → ingestion → stockage → transformation → consommation. Chaque module de ce bootcamp approfondit une ou plusieurs de ces étapes. Ce Module 02 s'installe dans les deux du milieu, stockage et transformation, et n'en bouge plus pendant 40 heures.",
          },
          {
            type: "table",
            headers: ["Étape du pipeline", "Ce module s'en occupe ?", "Module qui l'approfondit"],
            rows: [
              ["Sources", "Non", "Module 03 — Ingestion & APIs"],
              ["Ingestion", "Non", "Module 03 — Ingestion & APIs"],
              ["Stockage", "Oui — cœur du module", "Module 06 — Lakehouse (à plus grande échelle)"],
              ["Transformation", "Oui — cœur du module", "Module 05 — Airflow (orchestrée), Module 09 — DataOps"],
              ["Consommation", "Effleuré (dbt, data marts)", "Module 09 — Analytics Engineering avancé"],
            ],
          },
          {
            type: "callout",
            title: "Pourquoi SQL reste la compétence n°1",
            text: "Avant Spark, avant Kafka, avant le cloud : un data engineer qui ne sait pas modéliser et interroger des données proprement en SQL ne peut pas faire le reste correctement non plus. Chaque moteur de traitement massif — Spark SQL, BigQuery, Snowflake — expose in fine une interface SQL. Ce module n'est donc pas \"une étape parmi d'autres\", c'est la fondation de tout ce qui suit.",
          },
          {
            type: "p",
            text: "Concrètement, à la fin de ce module, tu sauras concevoir la structure de données elle-même (modélisation), pas seulement écrire des requêtes dedans — et tu auras un projet complet, AfriPay Data Platform, à montrer en entretien.",
          },
          {
            type: "thinking_prompt",
            text: "Retiens cette phrase pour la suite du chapitre : tout ce que tu vas apprendre ici, tu vas immédiatement le pratiquer sur AfriPay — jamais un exercice jetable et déconnecté du reste.",
          },
        ],
      },
      quiz: [
        {
          question: "Sur quelles étapes du pipeline data ce Module 02 se concentre-t-il ?",
          options: ["Sources et ingestion", "Stockage et transformation", "Consommation uniquement"],
          correct_index: 1,
          explain: "Le Module 02 s'installe dans les deux étapes du milieu du pipeline vu au Module 01.",
        },
        {
          question: "Pourquoi SQL reste-t-il la compétence n°1 d'un data engineer, même à l'ère de Spark et du cloud ?",
          options: [
            "Parce que SQL est plus simple à apprendre",
            "Parce que la plupart des moteurs modernes (Spark SQL, BigQuery, Snowflake) exposent une interface SQL",
            "Parce que Spark et Kafka ne fonctionnent pas sans SQL",
          ],
          correct_index: 1,
          explain: "SQL est la couche d'interface commune à presque tous les moteurs de données modernes — la maîtriser transfère partout.",
        },
      ],
    },

    // ------------------------------------------------------------
    // 2.1.2 — POURQUOI POSTGRESQL
    // ------------------------------------------------------------
    {
      number: "2.1.2",
      slug: "pourquoi-postgresql-vs-alternatives",
      title: "Pourquoi PostgreSQL, face à MySQL, SQL Server, Oracle et au NoSQL",
      parentSlug: "remise-en-contexte-environnement-postgresql",
      duration_minutes: 30,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Choisir un moteur de base de données n'est jamais neutre — chacun a des forces réelles. Voici pourquoi PostgreSQL est le standard de ce bootcamp, et ce que tu perdrais avec un autre choix.",
          },
          {
            type: "table",
            headers: ["Moteur", "Licence", "Points forts", "Où il domine en entreprise"],
            rows: [
              ["PostgreSQL", "Open source (BSD)", "Extensible (JSONB, extensions), window functions et CTEs très complets, gratuit à tout niveau d'échelle", "Fintech, startups, la majorité des nouveaux projets analytiques"],
              ["MySQL / MariaDB", "Open source (GPL)", "Très répandu historiquement, simple à opérer", "Applications web CRUD classiques, WordPress/e-commerce"],
              ["SQL Server", "Propriétaire (Microsoft)", "Intégration profonde à l'écosystème Microsoft, outils BI natifs", "Grandes entreprises déjà sur stack Microsoft"],
              ["Oracle Database", "Propriétaire, coût élevé", "Fonctionnalités entreprise avancées (partitionnement, RAC)", "Grands comptes historiques (banques, télécoms)"],
              ["SQLite", "Open source, embarqué", "Zéro serveur, un seul fichier", "Applications mobiles, prototypage local"],
              ["MongoDB (NoSQL)", "Open source / SaaS", "Schéma flexible, scaling horizontal natif", "Documents très hétérogènes, pas de besoin de jointures fortes"],
            ],
          },
          { type: "h3", text: "SQL (relationnel) vs NoSQL — la vraie question à se poser" },
          {
            type: "p",
            text: "Ce n'est pas \"lequel est meilleur\" mais \"quelle est la forme de mes données et mes garanties nécessaires\". AfriPay a des transactions qui doivent référencer un client et un marchand qui existent réellement (intégrité référentielle), des montants qui ne doivent jamais se dupliquer silencieusement (ACID), et des relations complexes entre 7 tables — le terrain naturel d'un moteur relationnel.",
          },
          {
            type: "list",
            items: [
              "Choisis relationnel (PostgreSQL...) quand les relations entre entités sont fortes et que la cohérence des données est critique — cas de presque tout le reporting financier et opérationnel",
              "Choisis NoSQL (MongoDB, Cassandra...) quand le schéma change constamment, que le volume d'écriture est massif et distribué, ou que les documents sont naturellement imbriqués et rarement joints entre eux",
              "En pratique, une entreprise data-mature utilise souvent les deux, chacun sur son cas d'usage — ce n'est pas un choix exclusif",
            ],
          },
          {
            type: "callout",
            title: "Pourquoi PostgreSQL précisément, et pas juste \"un relationnel\"",
            text: "PostgreSQL est la base de données la plus utilisée et la plus désirée en entreprise depuis plusieurs années consécutives dans les enquêtes développeurs (Stack Overflow) — y compris dans les fintechs africaines. Il combine la rigueur relationnelle avec des fonctionnalités qu'on associe d'habitude au NoSQL (JSONB indexable et interrogeable, comme tu l'as vu avec channel_metadata). C'est aussi, très concrètement, ce qui fait tourner DataLendo elle-même.",
          },
          {
            type: "thinking_prompt",
            text: "En entretien, on te demandera peut-être \"pourquoi PostgreSQL plutôt que MongoDB pour ce projet ?\". La bonne réponse n'est jamais \"parce que c'est ce que j'ai appris\" — c'est \"parce que mes données ont telle forme et telles garanties de cohérence à respecter\".",
          },
        ],
      },
      quiz: [
        {
          question: "Quel critère doit surtout guider le choix entre un moteur relationnel et NoSQL ?",
          options: [
            "Lequel est le plus récent",
            "La forme des données et les garanties de cohérence nécessaires",
            "Lequel a le plus de utilisateurs sur GitHub",
          ],
          correct_index: 1,
          explain: "Relations fortes et cohérence critique → relationnel. Schéma très flexible et écriture massive distribuée → souvent NoSQL.",
        },
        {
          question: "Qu'est-ce qui distingue PostgreSQL d'un moteur relationnel plus classique comme SQL Server ou Oracle, pour ce bootcamp ?",
          options: [
            "Il est propriétaire et payant",
            "Il est open source, gratuit à toute échelle, et combine rigueur relationnelle et fonctionnalités type NoSQL (JSONB)",
            "Il ne supporte pas les jointures",
          ],
          correct_index: 1,
          explain: "PostgreSQL est gratuit, extensible, et gère nativement des types avancés comme JSONB — un vrai avantage pratique.",
        },
        {
          question: "Pourquoi AfriPay est-elle un bon cas d'usage pour un moteur relationnel plutôt que NoSQL ?",
          options: [
            "Parce que les transactions doivent référencer des clients/marchands existants et garantir la cohérence des montants",
            "Parce que NoSQL n'existe pas encore en Afrique",
            "Parce qu'il n'y a qu'une seule table",
          ],
          correct_index: 0,
          explain: "Intégrité référentielle et ACID sont exactement les garanties dont une fintech a besoin.",
        },
      ],
    },

    // ------------------------------------------------------------
    // 2.1.3 — INSTALLATION
    // ------------------------------------------------------------
    {
      number: "2.1.3",
      slug: "installation-postgresql-vscode",
      title: "Installation PostgreSQL + VS Code",
      parentSlug: "remise-en-contexte-environnement-postgresql",
      duration_minutes: 30,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "callout",
            title: "Tu n'as rien à installer pour t'exercer sur DataLendo",
            text: "Chaque atelier de ce module s'exécute directement dans ton navigateur, dans un vrai moteur PostgreSQL (pas une imitation) préchargé avec le jeu de données AfriPay — voir la leçon 2.1.7. L'installation ci-dessous sert pour les sessions live et pour ton futur poste de travail, pas pour avancer dans ce module.",
          },
          { type: "h3", text: "1. Installer PostgreSQL 16+" },
          {
            type: "code",
            text: "# macOS (Homebrew)\nbrew install postgresql@16\nbrew services start postgresql@16\n\n# Linux (Debian/Ubuntu)\nsudo apt update && sudo apt install postgresql postgresql-contrib\n\n# Windows\n# Télécharger l'installeur officiel sur postgresql.org et suivre l'assistant",
          },
          {
            type: "sql_code",
            text: "-- Vérifier que PostgreSQL tourne\npsql --version\n\n-- Se connecter à la base par défaut\npsql -U postgres -d postgres",
            caption: "Si psql se connecte et affiche une invite postgres=#, l'installation est réussie.",
          },
          { type: "h3", text: "2. VS Code + extension SQL" },
          {
            type: "list",
            items: [
              "VS Code (déjà installé au Module 01)",
              "Extension « SQLTools » + son driver « SQLTools PostgreSQL/Redshift Driver » — pour écrire et exécuter du SQL directement dans l'éditeur, avec autocomplétion",
              "pgAdmin (optionnel) — une interface graphique utile pour explorer visuellement un schéma, en complément de VS Code, pas à sa place",
            ],
          },
          { type: "h3", text: "3. Configurer une connexion dans SQLTools" },
          {
            type: "checklist",
            title: "Paramètres de connexion à renseigner",
            items: [
              "Connection name : afripay-local (un nom parlant, tu en auras plusieurs plus tard)",
              "Server / Host : localhost",
              "Port : 5432 (port par défaut de PostgreSQL)",
              "Database : postgres (ou une base que tu crées ensuite, ex. afripay)",
              "Username : postgres (ou ton utilisateur système sur Mac/Linux)",
              "Password : celui défini à l'installation — jamais commité en clair dans un fichier versionné",
            ],
          },
          {
            type: "callout",
            title: "Sécurité dès le premier jour",
            text: "Ne mets jamais un mot de passe de base de données en clair dans un fichier .sql suivi par Git. Utilise les fichiers de connexion locaux de SQLTools (non versionnés) ou des variables d'environnement — un réflexe que tu garderas toute ta carrière.",
          },
          {
            type: "thinking_prompt",
            text: "Pourquoi installer un vrai PostgreSQL local alors que le bac à sable du navigateur suffit pour ce module ? Parce que les sessions en direct du bootcamp l'utilisent, et parce que c'est exactement l'environnement que tu retrouveras en poste — apprendre à s'y connecter maintenant évite une friction plus tard.",
          },
        ],
      },
      quiz: [
        {
          question: "Sur quel port PostgreSQL écoute-t-il par défaut ?",
          options: ["3306", "5432", "8080"],
          correct_index: 1,
          explain: "5432 est le port par défaut de PostgreSQL (3306 est celui de MySQL).",
        },
        {
          question: "Faut-il installer PostgreSQL en local pour avancer dans les leçons de ce module ?",
          options: ["Oui, obligatoirement dès la 2.1.3", "Non — le bac à sable DataLendo tourne dans le navigateur", "Seulement à partir du Module 05"],
          correct_index: 1,
          explain: "L'installation locale sert aux sessions live et à ton futur poste ; le bac à sable suffit pour pratiquer ici.",
        },
        {
          question: "Où faut-il stocker un mot de passe de base de données dans un projet versionné par Git ?",
          options: [
            "Directement en clair dans le fichier .sql",
            "Jamais en clair dans un fichier suivi par Git — via une config locale non versionnée ou des variables d'environnement",
            "Dans le README du projet",
          ],
          correct_index: 1,
          explain: "Un secret commité en clair dans Git reste dans l'historique même après suppression — un réflexe de sécurité de base.",
        },
      ],
    },

    // ------------------------------------------------------------
    // 2.1.4 — ANATOMIE D'UN SERVEUR POSTGRESQL
    // ------------------------------------------------------------
    {
      number: "2.1.4",
      slug: "anatomie-serveur-postgresql",
      title: "Anatomie d'un serveur PostgreSQL : cluster, base, schéma, table, rôle",
      parentSlug: "remise-en-contexte-environnement-postgresql",
      duration_minutes: 30,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Avant d'écrire une seule requête, il faut savoir où elle s'exécute. PostgreSQL organise tout selon une hiérarchie précise — comprendre ces niveaux évite des questions comme \"pourquoi ma table n'apparaît pas ?\" qui sont en réalité des questions de portée, pas de syntaxe.",
          },
          {
            type: "table",
            headers: ["Niveau", "C'est quoi", "Exemple AfriPay"],
            rows: [
              ["Cluster (instance)", "Un serveur PostgreSQL en cours d'exécution, qui peut héberger plusieurs bases", "Ton serveur local, ou l'instance Supabase qui héberge DataLendo"],
              ["Database (base)", "Un espace de données isolé — une connexion cible toujours une seule base à la fois", "afripay (dédiée au projet fil rouge)"],
              ["Schema (schéma)", "Un espace de noms à l'intérieur d'une base, pour organiser les tables", "public (par défaut) ; on pourrait imaginer staging, marts en avançant dans le module"],
              ["Table", "La structure qui stocke réellement les lignes", "fact_transactions, dim_customer..."],
              ["Rôle (role)", "Un compte de connexion avec des permissions — peut être une personne ou un service", "un rôle app_readonly pour un tableau de bord, un rôle admin pour les migrations"],
            ],
          },
          {
            type: "callout",
            title: "Le piège classique du schéma implicite",
            text: "Quand tu écris `select * from dim_customer` sans préciser de schéma, PostgreSQL cherche dans le search_path — par défaut `public`. Si un jour deux schémas contiennent chacun une table dim_customer, la requête ne sera plus ambiguë pour toi mais elle le sera pour le moteur : toujours savoir quel schéma est réellement interrogé.",
          },
          {
            type: "sql_code",
            text: "-- Le schéma courant et le search_path actif\nshow search_path;\n\n-- Qualifier explicitement une table par son schéma\nselect * from public.dim_customer limit 5;",
          },
          { type: "h3", text: "Rôles et permissions — le strict nécessaire" },
          {
            type: "list",
            items: [
              "Un rôle peut avoir l'attribut LOGIN (une vraie connexion) ou non (un simple groupe de permissions)",
              "GRANT accorde une permission (SELECT, INSERT, UPDATE...) à un rôle sur un objet",
              "Principe du moindre privilège : un service qui ne fait que lire des rapports ne devrait jamais avoir de droit d'écriture",
            ],
          },
          {
            type: "sql_code",
            text: "-- Un rôle en lecture seule sur le schéma public (principe du moindre privilège)\ncreate role app_readonly login password '...';\ngrant usage on schema public to app_readonly;\ngrant select on all tables in schema public to app_readonly;",
          },
          {
            type: "thinking_prompt",
            text: "DataLendo utilise Row Level Security (RLS) sur Supabase — un mécanisme qui filtre les lignes visibles par rôle, plus fin qu'un simple GRANT au niveau table. Retiens le principe ici ; tu le retrouveras en pratique dans des modules plus avancés sur la gouvernance des données.",
          },
        ],
      },
      quiz: [
        {
          question: "Une connexion PostgreSQL cible :",
          options: ["Toutes les bases du cluster à la fois", "Une seule base à la fois", "Un seul schéma pour tout le cluster"],
          correct_index: 1,
          explain: "Il faut changer de connexion (ou utiliser dblink/fdw) pour accéder à une autre base du même cluster.",
        },
        {
          question: "Quel est le schéma utilisé par défaut quand aucun n'est précisé dans une requête ?",
          options: ["default", "public", "main"],
          correct_index: 1,
          explain: "public est le schéma par défaut de toute nouvelle base PostgreSQL.",
        },
        {
          question: "Le principe du moindre privilège recommande :",
          options: [
            "Donner tous les droits à tous les rôles pour simplifier",
            "N'accorder à un rôle que les permissions strictement nécessaires à son usage",
            "Ne jamais créer de rôle en dehors du superutilisateur",
          ],
          correct_index: 1,
          explain: "Un rôle de lecture seule ne devrait par exemple jamais avoir de droit d'écriture.",
        },
      ],
    },

    // ------------------------------------------------------------
    // 2.1.5 — PSQL
    // ------------------------------------------------------------
    {
      number: "2.1.5",
      slug: "naviguer-en-ligne-de-commande-psql",
      title: "Naviguer en ligne de commande avec psql",
      parentSlug: "remise-en-contexte-environnement-postgresql",
      duration_minutes: 30,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "psql est le client officiel en ligne de commande de PostgreSQL. Même si tu passes le plus clair de ton temps dans VS Code, savoir naviguer au clavier en psql est indispensable en session live et en diagnostic rapide sur un serveur distant.",
          },
          { type: "h3", text: "Les commandes meta essentielles (elles commencent par un backslash)" },
          {
            type: "table",
            headers: ["Commande", "Effet"],
            rows: [
              ["\\l", "Lister toutes les bases du cluster"],
              ["\\c afripay", "Se connecter à la base afripay"],
              ["\\dt", "Lister les tables du schéma courant"],
              ["\\d fact_transactions", "Décrire la structure d'une table (colonnes, types, contraintes)"],
              ["\\d+ fact_transactions", "Idem, avec plus de détails (taille, description)"],
              ["\\du", "Lister les rôles et leurs attributs"],
              ["\\dn", "Lister les schémas de la base courante"],
              ["\\x", "Basculer l'affichage en mode étendu (une colonne par ligne — utile pour les lignes larges)"],
              ["\\timing", "Afficher le temps d'exécution de chaque requête"],
              ["\\q", "Quitter psql"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Une session psql typique pour explorer AfriPay\n\\c afripay\n\\dt\n\\d fact_transactions\nselect count(*) from fact_transactions;",
          },
          {
            type: "callout",
            title: "Important : ces commandes n'existent que dans psql",
            text: "\\dt, \\d, \\l ne sont PAS du SQL — ce sont des raccourcis propres au client psql, qui traduisent en interne des requêtes sur le catalogue système. Dans le bac à sable de DataLendo (un moteur SQL pur, pas un terminal psql), l'équivalent est d'interroger directement information_schema — exactement ce que tu feras en leçon 2.1.9.",
          },
          {
            type: "sql_code",
            text: "-- L'équivalent SQL pur de \\dt (fonctionne partout, y compris dans le bac à sable)\nselect table_name from information_schema.tables\nwhere table_schema = 'public'\norder by table_name;",
          },
          {
            type: "sql_sandbox",
            prompt: "Exécute la requête équivalente à \\dt ci-dessus pour lister toutes les tables du jeu de données AfriPay.",
            starterQuery:
              "select table_name from information_schema.tables\nwhere table_schema = 'public'\norder by table_name;",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle commande psql liste les tables du schéma courant ?",
          options: ["\\l", "\\dt", "\\du"],
          correct_index: 1,
          explain: "\\l liste les bases, \\du les rôles, \\dt les tables.",
        },
        {
          question: "Les commandes psql comme \\dt fonctionnent-elles dans le bac à sable SQL de DataLendo ?",
          options: [
            "Oui, exactement pareil",
            "Non — ce sont des raccourcis du client psql, pas du SQL ; il faut interroger information_schema à la place",
            "Seulement \\q fonctionne",
          ],
          correct_index: 1,
          explain: "Le bac à sable exécute du SQL pur — l'équivalent portable de \\dt est une requête sur information_schema.tables.",
        },
      ],
    },

    // ------------------------------------------------------------
    // 2.1.6 — VS CODE + SQLTOOLS AU QUOTIDIEN
    // ------------------------------------------------------------
    {
      number: "2.1.6",
      slug: "vscode-sqltools-organisation-fichiers-sql",
      title: "VS Code + SQLTools au quotidien, organiser ses fichiers SQL",
      parentSlug: "remise-en-contexte-environnement-postgresql",
      duration_minutes: 25,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une fois connecté (leçon 2.1.3), l'enjeu devient l'hygiène de travail : comment organiser tes fichiers SQL pour qu'un projet reste lisible après cent requêtes, et pas seulement après les dix premières.",
          },
          { type: "h3", text: "Exécuter une requête depuis VS Code" },
          {
            type: "list",
            items: [
              "Sélectionner la requête (ou se placer dessus) puis Cmd+Enter / Ctrl+Enter (raccourci SQLTools) pour l'exécuter sur la connexion active",
              "Le résultat s'affiche dans un panneau dédié, exportable en CSV pour une vérification rapide",
              "Changer de connexion active dans la barre de statut avant d'exécuter — l'erreur la plus fréquente d'un débutant est d'exécuter une requête sur la mauvaise base",
            ],
          },
          { type: "h3", text: "Organiser ses fichiers SQL comme un projet, pas comme un brouillon" },
          {
            type: "code",
            text: "afripay-sql/\n├── 01_exploration/\n│   ├── 01_lister_tables.sql\n│   └── 02_compter_lignes.sql\n├── 02_modelisation/\n│   └── star_schema.sql\n├── 03_optimisation/\n│   └── explain_avant_apres.sql\n└── README.md",
          },
          {
            type: "list",
            items: [
              "Un fichier = un objectif clair (pas un fourre-tout de 50 requêtes sans rapport)",
              "Un commentaire en en-tête de fichier expliquant l'intention, pas juste la syntaxe",
              "Une numérotation qui reflète l'ordre logique d'exécution, utile en session live comme en revue de code",
            ],
          },
          {
            type: "sql_code",
            text: "-- 02_modelisation/star_schema.sql\n-- Objectif : vérifier le grain de fact_transactions avant de documenter le star schema (leçon 2.6)\nselect transaction_id, count(*)\nfrom fact_transactions\ngroup by transaction_id\nhaving count(*) > 1;",
          },
          {
            type: "callout",
            title: "Un fichier .sql versionné est un artefact professionnel",
            text: "En entretien ou en poste, ce sont ces fichiers qu'un collègue relira. Un dossier structuré et commenté raconte une histoire ; un fichier scratch.sql de 800 lignes n'en raconte aucune.",
          },
          {
            type: "thinking_prompt",
            text: "Cette discipline te semble peut-être excessive pour un simple exercice — mais c'est exactement la structure que tu réutiliseras telle quelle pour le capstone (leçon 2.10) et pour le dépôt final AfriPay Data Platform.",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle est l'erreur la plus fréquente d'un débutant avec SQLTools dans VS Code ?",
          options: [
            "Oublier le point-virgule",
            "Exécuter une requête sur la mauvaise connexion/base active",
            "Ne pas utiliser assez de majuscules",
          ],
          correct_index: 1,
          explain: "Toujours vérifier la connexion active dans la barre de statut avant d'exécuter, surtout avec plusieurs bases configurées.",
        },
        {
          question: "Pourquoi structurer ses fichiers SQL en dossiers numérotés par objectif plutôt qu'un seul gros fichier ?",
          options: [
            "Parce que PostgreSQL l'exige techniquement",
            "Parce que ça rend le projet lisible et relisible par quelqu'un d'autre (ou par toi, plus tard)",
            "Parce que les fichiers volumineux font planter VS Code",
          ],
          correct_index: 1,
          explain: "La discipline de fichiers est une compétence professionnelle, pas une contrainte technique du moteur.",
        },
      ],
    },

    // ------------------------------------------------------------
    // 2.1.7 — LE BAC À SABLE DATALENDO
    // ------------------------------------------------------------
    {
      number: "2.1.7",
      slug: "bac-a-sable-datalendo-sous-le-capot",
      title: "Le bac à sable DataLendo, sous le capot",
      parentSlug: "remise-en-contexte-environnement-postgresql",
      duration_minutes: 25,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Tu vas utiliser le bac à sable intégré à chaque leçon pendant tout ce module. Comprendre ce qui tourne réellement derrière change la façon dont tu lui fais confiance.",
          },
          {
            type: "callout",
            title: "Ce n'est pas une imitation de SQL — c'est un vrai PostgreSQL",
            text: "Le bac à sable embarque PGlite : PostgreSQL compilé en WebAssembly, exécuté entièrement dans ton navigateur. Ce n'est pas un moteur SQL simplifié ni une base type SQLite qui \"ressemble\" à PostgreSQL — c'est le même moteur, avec ses vraies fonctionnalités : window functions, JSONB, CTEs récursives, tout ce que tu vas apprendre fonctionne à l'identique en local.",
          },
          { type: "h3", text: "Où vivent tes données" },
          {
            type: "list",
            items: [
              "Le jeu de données AfriPay est chargé une première fois dans IndexedDB, le stockage local de ton navigateur — rien n'est envoyé à un serveur",
              "Tes requêtes s'exécutent localement, sans latence réseau : le \"▶ Exécuter\" ne fait pas d'appel à DataLendo, il parle à un PostgreSQL qui tourne dans ton onglet",
              "Ton avancement (données modifiées, tables créées dans un atelier) persiste entre deux visites sur le même navigateur, tant que tu ne vides pas les données du site",
            ],
          },
          {
            type: "callout",
            title: "Le bouton « Réinitialiser les données »",
            text: "Si un atelier te fait modifier des données (UPDATE, DELETE, ALTER TABLE) et que tu veux repartir de zéro, ce bouton recharge le jeu de données AfriPay dans son état d'origine — utile après avoir \"cassé\" volontairement quelque chose pour apprendre.",
          },
          {
            type: "list",
            items: [
              "Limite : le bac à sable est mono-utilisateur et local à ton navigateur — il ne simule pas la concurrence de plusieurs connexions (tu verras ça avec de vraies bases plus tard)",
              "Limite : pas d'accès réseau depuis le bac à sable — impossible d'y installer une extension PostgreSQL qui appelle l'extérieur",
              "Ce que ça n'empêche pas : tout le SQL de ce module — y compris les CTEs récursives et le partitionnement — fonctionne normalement",
            ],
          },
          {
            type: "thinking_prompt",
            text: "Ton environnement local (leçon 2.1.3) et le bac à sable de DataLendo font tourner exactement le même moteur. En production, ce sera aussi vrai entre ton poste et le serveur : si ça marche ici, ça doit marcher là-bas, sans mauvaise surprise de version.",
          },
        ],
      },
      quiz: [
        {
          question: "Le bac à sable SQL de DataLendo fait tourner :",
          options: [
            "Un moteur SQL simplifié propre à DataLendo",
            "Un vrai PostgreSQL compilé en WebAssembly (PGlite), exécuté dans le navigateur",
            "Une base SQLite qui imite la syntaxe PostgreSQL",
          ],
          correct_index: 1,
          explain: "PGlite est un vrai PostgreSQL — window functions, JSONB, CTEs récursives fonctionnent à l'identique.",
        },
        {
          question: "Où sont stockées les données du bac à sable pendant que tu travailles ?",
          options: [
            "Sur les serveurs de DataLendo",
            "Localement dans ton navigateur (IndexedDB)",
            "Nulle part, tout est recalculé à chaque requête",
          ],
          correct_index: 1,
          explain: "Tout s'exécute et se stocke localement — aucun appel réseau vers DataLendo pour exécuter une requête.",
        },
        {
          question: "Que fait le bouton « Réinitialiser les données » ?",
          options: [
            "Il supprime ton compte",
            "Il recharge le jeu de données AfriPay dans son état d'origine",
            "Il déconnecte ton navigateur d'internet",
          ],
          correct_index: 1,
          explain: "Utile après avoir volontairement modifié des données dans un atelier (UPDATE, ALTER TABLE...).",
        },
      ],
    },

    // ------------------------------------------------------------
    // 2.1.8 — DÉCOUVRIR AFRIPAY
    // ------------------------------------------------------------
    {
      number: "2.1.8",
      slug: "decouvrir-afripay-contexte-metier",
      title: "Découvrir AfriPay : le contexte métier du fil rouge",
      parentSlug: "remise-en-contexte-environnement-postgresql",
      duration_minutes: 30,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "AfriPay est une fintech pan-africaine fictive de mobile money et paiement marchand. Tu vas la modéliser, construire son entrepôt de données, l'optimiser — puis, dans les modules suivants, l'ingérer en temps réel, la traiter à l'échelle avec Spark, la migrer en lakehouse. Un seul projet qui grandit, pas dix exercices déconnectés.",
          },
          { type: "h3", text: "Le métier, en trois rôles" },
          {
            type: "table",
            headers: ["Rôle", "Ce qu'il fait", "Table associée"],
            rows: [
              ["Client (customer)", "Envoie de l'argent, paie un marchand, reçoit un transfert via mobile money", "dim_customer (200 clients)"],
              ["Marchand (merchant)", "Reçoit des paiements pour des biens ou services", "dim_merchant (50 marchands, par catégorie)"],
              ["Agent", "Fait le lien physique cash ↔ mobile money (dépôt/retrait), organisé en hiérarchie régionale", "dim_agent (responsables régionaux → agents de terrain → sous-agents)"],
            ],
          },
          { type: "h3", text: "Les 8 pays du fil rouge" },
          {
            type: "table",
            headers: ["Pays", "Devise", "Région"],
            rows: [
              ["République Démocratique du Congo", "CDF", "Afrique centrale"],
              ["Congo-Brazzaville", "XAF", "Afrique centrale"],
              ["Côte d'Ivoire", "XOF", "Afrique de l'Ouest"],
              ["Sénégal", "XOF", "Afrique de l'Ouest"],
              ["Mali", "XOF", "Afrique de l'Ouest"],
              ["Kenya", "KES", "Afrique de l'Est"],
              ["Maroc", "MAD", "Afrique du Nord"],
              ["Algérie", "DZD", "Afrique du Nord"],
            ],
          },
          {
            type: "callout",
            title: "Pourquoi plusieurs devises dès le premier jour",
            text: "Trois pays partagent le XOF, mais les cinq autres ont chacun leur propre devise. Ce détail, en apparence anodin, va justifier toute la leçon 2.4 sur l'as-of join : convertir un montant correctement suppose de connaître le taux de change EN VIGUEUR à la date de la transaction, pas le taux d'aujourd'hui.",
          },
          { type: "h3", text: "Les 8 tables du jeu de données" },
          {
            type: "table",
            headers: ["Table", "Contenu"],
            rows: [
              ["dim_country", "8 pays, devise, région, fuseau horaire"],
              ["dim_customer", "200 clients AfriPay"],
              ["dim_merchant", "50 marchands partenaires, par catégorie (Alimentation, Transport...)"],
              ["dim_agent", "réseau d'agents mobile money, hiérarchie manager_id"],
              ["dim_date", "calendrier complet, 2 ans, avec year/quarter/month/is_weekend"],
              ["fx_rates", "taux de change quotidiens par devise vers l'USD"],
              ["fact_transactions", "5 000 transactions (montant, canal, statut, métadonnées JSON)"],
              ["raw_transactions_bronze", "extraction volontairement sale (NULL, doublons, dates incohérentes) — pour la leçon 2.7"],
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Premier contact : compte le nombre de lignes de chaque table du jeu de données AfriPay.",
            starterQuery:
              "select 'dim_country' as table_name, count(*) from dim_country\nunion all select 'dim_customer', count(*) from dim_customer\nunion all select 'dim_merchant', count(*) from dim_merchant\nunion all select 'dim_agent', count(*) from dim_agent\nunion all select 'fact_transactions', count(*) from fact_transactions\nunion all select 'raw_transactions_bronze', count(*) from raw_transactions_bronze;",
          },
        ],
      },
      quiz: [
        {
          question: "Combien de pays couvre le fil rouge AfriPay ?",
          options: ["3", "8", "20"],
          correct_index: 1,
          explain: "RDC, Congo-Brazzaville, Côte d'Ivoire, Sénégal, Mali, Kenya, Maroc, Algérie.",
        },
        {
          question: "Pourquoi le fait que plusieurs devises coexistent est-il important pour la suite du module ?",
          options: [
            "Ça ne change rien techniquement",
            "Ça justifie la nécessité d'un as-of join pour convertir un montant au bon taux historique",
            "Parce que PostgreSQL ne supporte qu'une seule devise",
          ],
          correct_index: 1,
          explain: "Convertir un montant demande le taux en vigueur à la date de la transaction — vu en détail leçon 2.4.",
        },
        {
          question: "Quelle table modélise la hiérarchie du réseau d'agents mobile money ?",
          options: ["dim_merchant", "dim_agent", "fact_transactions"],
          correct_index: 1,
          explain: "dim_agent a une colonne manager_id qui référence agent_id de la même table — une hiérarchie.",
        },
      ],
    },

    // ------------------------------------------------------------
    // 2.1.9 — EXPLORER UN SCHÉMA INCONNU
    // ------------------------------------------------------------
    {
      number: "2.1.9",
      slug: "explorer-schema-inconnu-methodiquement",
      title: "Explorer un schéma inconnu, méthodiquement",
      parentSlug: "remise-en-contexte-environnement-postgresql",
      duration_minutes: 30,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "En poste, ton premier jour ressemblera rarement à une documentation à jour — plutôt à une base de données existante qu'il faut comprendre par toi-même. Voici la méthode, appliquée ici à AfriPay comme si tu la découvrais pour la première fois.",
          },
          { type: "h3", text: "Étape 1 — Lister les tables disponibles" },
          {
            type: "sql_code",
            text: "select table_name, table_type\nfrom information_schema.tables\nwhere table_schema = 'public'\norder by table_name;",
          },
          { type: "h3", text: "Étape 2 — Inspecter les colonnes d'une table qui t'intéresse" },
          {
            type: "sql_code",
            text: "select column_name, data_type, is_nullable\nfrom information_schema.columns\nwhere table_schema = 'public' and table_name = 'fact_transactions'\norder by ordinal_position;",
          },
          { type: "h3", text: "Étape 3 — Retrouver les clés primaires et étrangères" },
          {
            type: "sql_code",
            text: "-- Contraintes déclarées sur une table (PK, FK, UNIQUE, CHECK)\nselect constraint_name, constraint_type\nfrom information_schema.table_constraints\nwhere table_schema = 'public' and table_name = 'dim_agent';",
          },
          { type: "h3", text: "Étape 4 — Compter les lignes et repérer les tables vides ou énormes" },
          {
            type: "sql_code",
            text: "select 'dim_customer' as t, count(*) from dim_customer\nunion all select 'fact_transactions', count(*) from fact_transactions;",
          },
          { type: "h3", text: "Étape 5 — Échantillonner, jamais deviner" },
          {
            type: "sql_code",
            text: "-- Toujours regarder de vraies lignes avant de faire des hypothèses sur le contenu\nselect * from fact_transactions limit 20;",
          },
          {
            type: "callout",
            title: "Pourquoi cette méthode dans cet ordre précis",
            text: "Lister avant d'inspecter, inspecter avant de compter, compter avant d'échantillonner : chaque étape restreint et confirme la précédente. Sauter directement à \"select *\" sur une table inconnue de plusieurs millions de lignes, sans LIMIT, peut ralentir voire saturer une connexion partagée.",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Applique la méthode complète à la table raw_transactions_bronze que tu n'as pas encore explorée : liste ses colonnes, puis échantillonne 10 lignes.",
            starterQuery:
              "select column_name, data_type, is_nullable\nfrom information_schema.columns\nwhere table_schema = 'public' and table_name = 'raw_transactions_bronze'\norder by ordinal_position;",
          },
          {
            type: "thinking_prompt",
            text: "Remarque que raw_transactions_bronze a des colonnes typées `text` presque partout, contrairement à fact_transactions qui a des types précis (numeric, timestamptz...). Ce contraste n'est pas un hasard — retiens-le, il est au cœur de la leçon 2.7 sur la qualité des données.",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle vue système permet de lister toutes les tables d'un schéma en SQL pur, sans commande propre à un client ?",
          options: ["pg_stat_activity", "information_schema.tables", "dim_country"],
          correct_index: 1,
          explain: "information_schema.tables est portable — elle fonctionne dans tout client SQL, y compris le bac à sable.",
        },
        {
          question: "Dans la méthode d'exploration proposée, pourquoi échantillonner avec LIMIT plutôt que faire un SELECT * sans limite sur une table inconnue ?",
          options: [
            "LIMIT est obligatoire en SQL",
            "Sur une table de plusieurs millions de lignes, cela évite de ralentir voire saturer une connexion partagée",
            "Sans LIMIT, PostgreSQL refuse d'exécuter la requête",
          ],
          correct_index: 1,
          explain: "Prudence sur les tables de taille inconnue — un réflexe professionnel avant de savoir combien de lignes elle contient réellement.",
        },
        {
          question: "Quelle table du jeu de données AfriPay a des colonnes presque toutes typées en texte plutôt qu'en types précis ?",
          options: ["dim_country", "raw_transactions_bronze", "fact_transactions"],
          correct_index: 1,
          explain: "C'est volontaire — une extraction brute non nettoyée, sujet de la leçon 2.7.",
        },
      ],
    },

    // ------------------------------------------------------------
    // 2.1.10 — ATELIER DE SYNTHÈSE
    // ------------------------------------------------------------
    {
      number: "2.1.10",
      slug: "atelier-de-synthese-chapitre-2-1",
      title: "Atelier de synthèse du chapitre",
      parentSlug: "remise-en-contexte-environnement-postgresql",
      duration_minutes: 30,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Ce chapitre a posé le contexte (2.1.1), le choix du moteur (2.1.2), l'installation (2.1.3), l'anatomie d'un serveur (2.1.4), les deux façons de s'y connecter — psql (2.1.5) et VS Code (2.1.6) —, le fonctionnement du bac à sable (2.1.7), le contexte métier d'AfriPay (2.1.8) et une méthode d'exploration de schéma (2.1.9). Cet atelier fait la synthèse pratique de tout ça, en une seule session.",
          },
          {
            type: "checklist",
            title: "Tu es prêt·e pour le Chapitre 2.2 si tu peux répondre oui à chaque point",
            items: [
              "Je sais expliquer en une phrase pourquoi PostgreSQL est le bon choix pour AfriPay",
              "Je sais où trouver, dans mon environnement, de quoi me connecter à une base (psql ou VS Code)",
              "Je comprends que le bac à sable est un vrai PostgreSQL, pas une imitation, et pourquoi ça compte",
              "Je peux nommer les 8 tables d'AfriPay et le rôle de chacune sans les relire",
              "Je sais lister les tables et les colonnes d'un schéma que je ne connais pas encore, en SQL pur",
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 1 — Explore méthodiquement dim_merchant comme si tu la découvrais pour la première fois : liste ses colonnes.",
            starterQuery:
              "select column_name, data_type\nfrom information_schema.columns\nwhere table_schema = 'public' and table_name = 'dim_merchant'\norder by ordinal_position;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 2 — Une fois la structure connue, réponds à une vraie question métier : combien de marchands actifs par pays AfriPay compte-t-elle ?",
            starterQuery:
              "select country_code, count(*) as nb_marchands\nfrom dim_merchant\ngroup by country_code\norder by nb_marchands desc;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 3 — Combine deux tables : quel est le nombre de marchands par catégorie, avec le nom complet du pays plutôt que son code ?",
            starterQuery:
              "select m.category, c.country_name, count(*) as nb_marchands\nfrom dim_merchant m\njoin dim_country c on c.country_code = m.country_code\ngroup by m.category, c.country_name\norder by nb_marchands desc;",
          },
          {
            type: "thinking_prompt",
            text: "Cette dernière requête utilise déjà une jointure — sujet officiel du Chapitre 2.3 — sans que tu aies eu besoin d'un cours dessus pour la lire. C'est volontaire : le SQL s'apprend aussi par la pratique répétée avant la théorie formelle, pas seulement l'inverse.",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle est la bonne raison de choisir PostgreSQL pour un projet comme AfriPay ?",
          options: [
            "C'est le seul moteur qui existe",
            "Ses garanties relationnelles et sa richesse fonctionnelle (JSONB, window functions) correspondent aux besoins d'une fintech",
            "Il n'y a aucune raison particulière",
          ],
          correct_index: 1,
          explain: "Le choix se justifie par les besoins réels du projet, pas par défaut.",
        },
        {
          question: "Pourquoi le bac à sable DataLendo permet-il de pratiquer en confiance des fonctionnalités avancées (CTE récursive, window functions) ?",
          options: [
            "Parce que ces fonctionnalités sont désactivées de toute façon",
            "Parce que c'est un vrai PostgreSQL (PGlite) — tout ce qui fonctionne là fonctionnera en local ou en production",
            "Parce qu'il n'y a que 5 000 lignes de données",
          ],
          correct_index: 1,
          explain: "La fidélité du moteur, pas le volume de données, est ce qui garantit le transfert de compétence.",
        },
        {
          question: "Quelle méthode permet de découvrir les colonnes d'une table inconnue en SQL pur, sans documentation préalable ?",
          options: [
            "Deviner à partir du nom de la table",
            "Interroger information_schema.columns",
            "Demander à un collègue systématiquement",
          ],
          correct_index: 1,
          explain: "information_schema.columns fonctionne dans n'importe quel client SQL, y compris sans accès psql.",
        },
        {
          question: "Combien de tables compose le jeu de données AfriPay que tu vas utiliser pendant tout ce module ?",
          options: ["4", "8", "15"],
          correct_index: 1,
          explain: "dim_country, dim_customer, dim_merchant, dim_agent, dim_date, fx_rates, fact_transactions, raw_transactions_bronze.",
        },
      ],
    },

    // ============================================================
    // CHAPITRE 2.2 — SQL FOUNDATIONS
    // ============================================================
    {
      number: "2.2",
      slug: "sql-foundations-pour-data-engineers",
      title: "SQL Foundations pour Data Engineers",
      duration_minutes: 15,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Tu connais peut-être déjà SELECT/WHERE/GROUP BY. Ce chapitre ne les traite pas comme des bases isolées — il les traite comme elles seront traitées toute ta carrière : avec l'œil d'un data engineer qui pense en volumes, pas en lignes, et qui sait exactement ce que le moteur fait à chaque mot-clé.",
          },
          {
            type: "checklist",
            title: "Les 10 leçons de ce chapitre",
            items: [
              "2.2.1 — SELECT / FROM : anatomie d'une requête et ordre logique d'exécution",
              "2.2.2 — Types de données PostgreSQL",
              "2.2.3 — WHERE : opérateurs de comparaison, AND/OR/NOT",
              "2.2.4 — Filtrage avancé : IN, BETWEEN, LIKE/ILIKE, IS NULL",
              "2.2.5 — ORDER BY, LIMIT, OFFSET, DISTINCT",
              "2.2.6 — CASE WHEN, COALESCE, NULLIF",
              "2.2.7 — NULL et la logique à trois valeurs : le piège NOT IN",
              "2.2.8 — JSONB en pratique",
              "2.2.9 — GROUP BY et les fonctions d'agrégation",
              "2.2.10 — HAVING et atelier de synthèse du chapitre",
            ],
          },
        ],
      },
      quiz: [],
    },

    {
      number: "2.2.1",
      slug: "select-from-anatomie-requete",
      title: "SELECT / FROM : anatomie d'une requête et ordre logique d'exécution",
      parentSlug: "sql-foundations-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une requête SQL s'écrit dans un ordre, mais le moteur ne l'exécute PAS dans cet ordre. Comprendre la différence entre ordre d'écriture et ordre logique d'exécution explique la moitié des erreurs de débutant (\"pourquoi je ne peux pas utiliser cet alias ici ?\").",
          },
          {
            type: "table",
            headers: ["Ordre d'écriture", "Ordre logique d'exécution réel"],
            rows: [
              ["1. SELECT", "1. FROM (et les JOIN)"],
              ["2. FROM", "2. WHERE"],
              ["3. WHERE", "3. GROUP BY"],
              ["4. GROUP BY", "4. HAVING"],
              ["5. HAVING", "5. SELECT (les alias sont créés ICI)"],
              ["6. ORDER BY", "6. ORDER BY (peut utiliser les alias du SELECT)"],
              ["7. LIMIT", "7. LIMIT"],
            ],
          },
          {
            type: "callout",
            title: "Ce que ça explique concrètement",
            text: "C'est pour ça qu'un alias défini dans SELECT (ex. `count(*) as nb`) est utilisable dans ORDER BY mais jamais dans WHERE : au moment où WHERE s'exécute, SELECT n'a pas encore été évalué. Et c'est pour ça que HAVING peut filtrer sur un agrégat alors que WHERE ne le peut pas — HAVING s'exécute après GROUP BY, WHERE avant.",
          },
          {
            type: "sql_code",
            text: "-- Anatomie complète d'une requête sur AfriPay\nselect country_code, count(*) as nb_transactions          -- 5. calculé après le filtrage\nfrom fact_transactions                                     -- 1. la source\nwhere status = 'completed'                                 -- 2. filtre ligne par ligne, avant regroupement\ngroup by country_code                                      -- 3. regroupe\nhaving count(*) > 100                                      -- 4. filtre les groupes\norder by nb_transactions desc                              -- 6. peut utiliser l'alias nb_transactions\nlimit 5;                                                   -- 7. dernière étape",
          },
          {
            type: "sql_code",
            text: "-- ❌ Erreur : \"nb_transactions\" n'existe pas encore quand WHERE s'exécute\n-- select country_code, count(*) as nb_transactions\n-- from fact_transactions\n-- where nb_transactions > 100  -- WHERE ne connaît pas les alias du SELECT\n-- group by country_code;",
          },
          { type: "h3", text: "Qualifier ses colonnes dès le premier jour" },
          {
            type: "p",
            text: "Dès qu'une requête touche plus d'une table, préfixer chaque colonne par sa table (ou un alias court) lève toute ambiguïté et rend la requête lisible sans avoir à deviner d'où vient chaque champ.",
          },
          {
            type: "sql_code",
            text: "select t.transaction_id, t.amount_local, c.full_name\nfrom fact_transactions t\njoin dim_customer c on c.customer_id = t.customer_id\nlimit 10;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Écris une requête qui liste les transactions du canal 'mobile_money', triées par montant décroissant, en gardant seulement les 10 premières.",
            starterQuery:
              "select transaction_id, amount_local, channel\nfrom fact_transactions\nwhere channel = 'mobile_money'\norder by amount_local desc\nlimit 10;",
          },
        ],
      },
      quiz: [
        {
          question: "Un alias défini dans le SELECT (ex. `count(*) as nb`) peut être utilisé dans :",
          options: ["WHERE", "ORDER BY", "Les deux"],
          correct_index: 1,
          explain: "SELECT s'exécute logiquement avant ORDER BY mais après WHERE — d'où la différence.",
        },
        {
          question: "Quelle est la toute première étape de l'exécution logique d'une requête SELECT ... FROM ... WHERE ... ?",
          options: ["SELECT", "FROM", "WHERE"],
          correct_index: 1,
          explain: "Le moteur détermine d'abord la source des données (FROM/JOIN) avant de filtrer ou de projeter des colonnes.",
        },
      ],
    },

    {
      number: "2.2.2",
      slug: "types-de-donnees-postgresql",
      title: "Types de données PostgreSQL",
      parentSlug: "sql-foundations-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Choisir le bon type de colonne n'est pas un détail cosmétique : ça détermine l'espace de stockage, la vitesse des comparaisons, et surtout ce qui est possible de garantir automatiquement par le moteur (pas de texte dans une colonne numérique, pas de date invalide).",
          },
          {
            type: "table",
            headers: ["Type", "Exemple AfriPay", "Remarque"],
            rows: [
              ["integer / serial", "customer_id, merchant_id", "serial génère automatiquement une séquence auto-incrémentée pour les clés primaires"],
              ["numeric(p,s)", "amount_local", "Précision exacte — jamais d'arrondi flottant surprenant sur de l'argent, contrairement à float"],
              ["text / varchar", "full_name, merchant_name", "PostgreSQL ne pénalise pas text par rapport à varchar(n) — text est le choix par défaut recommandé"],
              ["boolean", "is_current (SCD)", "true/false/null — trois états possibles, pas deux"],
              ["date", "signup_date, onboarded_date", "Une date calendaire, sans heure"],
              ["timestamptz", "transaction_at", "Un instant absolu avec fuseau — toujours préférer à timestamp (sans fuseau) pour un système multi-pays"],
              ["jsonb", "channel_metadata", "JSON stocké en binaire, indexable et interrogeable directement en SQL"],
              ["uuid", "public_slug des certificats", "Identifiant globalement unique, imprévisible — utile pour des identifiants exposés publiquement"],
            ],
          },
          {
            type: "callout",
            title: "Pourquoi jamais `float` pour de l'argent",
            text: "Un float (réel en virgule flottante) ne peut pas représenter exactement la plupart des valeurs décimales — 0.1 + 0.2 ne vaut pas exactement 0.3 en binaire. Sur un système financier comme AfriPay, cette imprécision s'accumule. `numeric` garde une précision décimale exacte, au prix d'un calcul légèrement plus lent — un compromis toujours justifié pour de l'argent.",
          },
          {
            type: "sql_code",
            text: "-- Démonstration de l'imprécision du flottant (à éviter pour de l'argent)\nselect 0.1::float + 0.2::float as approx, 0.1::numeric + 0.2::numeric as exact;",
          },
          { type: "h3", text: "Cast explicite avec ::" },
          {
            type: "sql_code",
            text: "-- Convertir un texte en entier, une date en texte formaté\nselect '42'::int, transaction_at::date, amount_local::text\nfrom fact_transactions limit 5;",
          },
          {
            type: "sql_sandbox",
            prompt: "Vérifie le type réel de chaque colonne de fact_transactions via information_schema.",
            starterQuery:
              "select column_name, data_type\nfrom information_schema.columns\nwhere table_name = 'fact_transactions'\norder by ordinal_position;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi utiliser `numeric` plutôt que `float` pour stocker un montant d'argent ?",
          options: [
            "numeric est toujours plus rapide",
            "float ne peut pas représenter exactement la plupart des valeurs décimales, ce qui cause des erreurs d'arrondi",
            "float ne supporte pas les nombres négatifs",
          ],
          correct_index: 1,
          explain: "numeric garde une précision décimale exacte — essentiel pour des montants financiers.",
        },
        {
          question: "Pourquoi préférer `timestamptz` à `timestamp` pour transaction_at dans un système multi-pays comme AfriPay ?",
          options: [
            "timestamptz stocke un instant absolu, indépendant du fuseau, ce qui évite l'ambiguïté entre pays",
            "timestamp n'existe pas en PostgreSQL",
            "Ce n'est qu'une question de nommage, aucune différence réelle",
          ],
          correct_index: 0,
          explain: "Avec 8 pays et 8 fuseaux horaires potentiels, un instant absolu non ambigu est indispensable.",
        },
      ],
    },

    {
      number: "2.2.3",
      slug: "where-comparaison-and-or-not",
      title: "WHERE : opérateurs de comparaison, AND/OR/NOT",
      parentSlug: "sql-foundations-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "WHERE filtre les lignes une par une, avant tout regroupement. C'est l'outil le plus utilisé de tout SQL — et celui où une priorité d'opérateur mal comprise cause le plus de résultats silencieusement faux.",
          },
          {
            type: "table",
            headers: ["Opérateur", "Signification"],
            rows: [
              ["=, <>  (ou !=)", "Égal, différent"],
              ["<, >, <=, >=", "Comparaisons numériques ou de dates"],
              ["AND", "Les deux conditions doivent être vraies"],
              ["OR", "Au moins une des deux conditions est vraie"],
              ["NOT", "Inverse une condition"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Transactions complétées au Sénégal avec un montant significatif\nselect transaction_id, country_code, amount_local, status\nfrom fact_transactions\nwhere country_code = 'SN' and status = 'completed' and amount_local > 100;",
          },
          {
            type: "callout",
            title: "🪤 Le piège de priorité AND / OR",
            text: "AND est évalué avant OR, exactement comme la multiplication avant l'addition en arithmétique. `where country_code = 'SN' or country_code = 'CI' and status = 'completed'` ne filtre PAS \"SN ou CI, tous deux complétés\" — elle filtre \"tout le Sénégal (peu importe le statut) OU la Côte d'Ivoire complétée\". Sans parenthèses explicites, l'intention réelle disparaît.",
          },
          {
            type: "sql_code",
            text: "-- ⚠ Piège : AND est évalué avant OR — ceci inclut TOUT le Sénégal, complété ou non\nselect * from fact_transactions\nwhere country_code = 'SN' or country_code = 'CI' and status = 'completed';\n\n-- ✅ Version correcte et non ambiguë, avec des parenthèses explicites\nselect * from fact_transactions\nwhere (country_code = 'SN' or country_code = 'CI') and status = 'completed';",
          },
          {
            type: "thinking_prompt",
            text: "La règle pratique à retenir : dès qu'une requête mélange AND et OR, ajoute des parenthèses — même quand tu es sûr de la priorité. Un futur lecteur (ou toi dans six mois) ne devrait jamais avoir à recalculer mentalement les règles de précédence.",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Corrige le piège : liste les transactions du Kenya OU du Maroc qui sont toutes les deux à l'état 'completed'.",
            starterQuery:
              "select * from fact_transactions\nwhere (country_code = 'KE' or country_code = 'MA') and status = 'completed';",
          },
        ],
      },
      quiz: [
        {
          question: "Entre AND et OR, lequel est évalué en premier en l'absence de parenthèses ?",
          options: ["OR", "AND", "Ils ont la même priorité"],
          correct_index: 1,
          explain: "AND se comporte comme une multiplication, OR comme une addition — AND est prioritaire.",
        },
        {
          question: "Pourquoi ajouter des parenthèses explicites même quand on connaît la règle de priorité AND/OR ?",
          options: [
            "PostgreSQL l'exige pour s'exécuter",
            "Pour que l'intention reste sans ambiguïté pour tout futur lecteur du code",
            "Ça n'a aucun intérêt, juste une habitude inutile",
          ],
          correct_index: 1,
          explain: "La lisibilité et l'absence d'ambiguïté priment — surtout dans du SQL relu par une équipe.",
        },
      ],
    },

    {
      number: "2.2.4",
      slug: "filtrage-avance-in-between-like",
      title: "Filtrage avancé : IN, BETWEEN, LIKE/ILIKE, IS NULL",
      parentSlug: "sql-foundations-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Au-delà des comparaisons simples, quatre outils couvrent la grande majorité des filtres réels : l'appartenance à une liste, un intervalle, une correspondance de motif textuel, et l'absence de valeur.",
          },
          { type: "h3", text: "IN — appartenance à une liste" },
          {
            type: "sql_code",
            text: "-- Équivalent à une longue chaîne de OR, mais bien plus lisible\nselect * from dim_merchant\nwhere category in ('Alimentation', 'Transport', 'Santé');",
          },
          { type: "h3", text: "BETWEEN — un intervalle inclusif" },
          {
            type: "sql_code",
            text: "-- Inclut les deux bornes : transactions entre 50 et 200 (inclus)\nselect * from fact_transactions\nwhere amount_local between 50 and 200;\n\n-- Fonctionne aussi sur des dates\nselect * from fact_transactions\nwhere transaction_at::date between '2024-01-01' and '2024-01-31';",
          },
          { type: "h3", text: "LIKE / ILIKE — correspondance de motif" },
          {
            type: "table",
            headers: ["Symbole", "Signifie"],
            rows: [
              ["%", "Zéro, un ou plusieurs caractères quelconques"],
              ["_", "Exactement un caractère quelconque"],
            ],
          },
          {
            type: "sql_code",
            text: "-- LIKE est sensible à la casse, ILIKE ne l'est pas (spécifique PostgreSQL)\nselect merchant_name from dim_merchant where merchant_name like 'Marché%';   -- doit commencer PAR \"Marché\" exactement\nselect merchant_name from dim_merchant where merchant_name ilike '%marché%'; -- contient \"marché\", casse ignorée",
          },
          { type: "h3", text: "IS NULL / IS NOT NULL — jamais = NULL" },
          {
            type: "callout",
            title: "Pourquoi `= NULL` ne fonctionne jamais",
            text: "NULL représente une absence de valeur, pas une valeur comme les autres. Comparer quoi que ce soit à NULL avec = renvoie NULL (ni vrai ni faux) — jamais vrai, même si la colonne est elle-même NULL. Seuls IS NULL et IS NOT NULL testent correctement l'absence de valeur.",
          },
          {
            type: "sql_code",
            text: "-- ⚠ Ne renvoie JAMAIS de ligne, même si merchant_id est bien NULL quelque part\nselect * from raw_transactions_bronze where merchant_id = null;\n\n-- ✅ Le seul test correct\nselect * from raw_transactions_bronze where merchant_id is null;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Combine les quatre outils : trouve les marchands de catégorie 'Alimentation' ou 'Transport', dont le nom contient 'marché' (insensible à la casse).",
            starterQuery:
              "select merchant_name, category from dim_merchant\nwhere category in ('Alimentation', 'Transport')\n  and merchant_name ilike '%marché%';",
          },
        ],
      },
      quiz: [
        {
          question: "BETWEEN 50 AND 200 inclut-il les valeurs 50 et 200 elles-mêmes ?",
          options: ["Oui, les deux bornes sont incluses", "Non, aucune des deux bornes", "Seulement la borne basse"],
          correct_index: 0,
          explain: "BETWEEN est un intervalle fermé (inclusif) des deux côtés.",
        },
        {
          question: "Que renvoie `where colonne = null` dans PostgreSQL ?",
          options: ["Toutes les lignes où colonne est NULL", "Jamais aucune ligne, même si colonne est NULL", "Une erreur de syntaxe"],
          correct_index: 1,
          explain: "= NULL renvoie toujours NULL, jamais vrai — il faut IS NULL pour tester l'absence de valeur.",
        },
        {
          question: "Quelle différence entre LIKE et ILIKE en PostgreSQL ?",
          options: ["ILIKE est insensible à la casse, LIKE non", "LIKE est plus rapide", "Aucune différence"],
          correct_index: 0,
          explain: "ILIKE est une extension PostgreSQL de LIKE, insensible à la casse.",
        },
      ],
    },

    {
      number: "2.2.5",
      slug: "order-by-limit-offset-distinct",
      title: "ORDER BY, LIMIT, OFFSET, DISTINCT",
      parentSlug: "sql-foundations-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Trier, limiter et dédoublonner semblent triviaux — mais chacun a un coût de performance qu'il faut connaître avant de les utiliser sans réfléchir sur de gros volumes.",
          },
          { type: "h3", text: "ORDER BY : tri, et tri multi-colonnes" },
          {
            type: "sql_code",
            text: "-- Tri par pays, puis par montant décroissant à l'intérieur de chaque pays\nselect country_code, transaction_id, amount_local\nfrom fact_transactions\norder by country_code asc, amount_local desc;",
          },
          { type: "h3", text: "LIMIT et OFFSET — pagination naïve" },
          {
            type: "sql_code",
            text: "-- Page 3, 20 résultats par page (lignes 41 à 60)\nselect * from fact_transactions\norder by transaction_id\nlimit 20 offset 40;",
          },
          {
            type: "callout",
            title: "🪤 Pourquoi OFFSET devient un problème à grande échelle",
            text: "OFFSET 40 ne \"saute\" pas magiquement les 40 premières lignes : le moteur les lit puis les jette. Sur `page 5000` avec OFFSET 100000, PostgreSQL doit quand même parcourir 100 020 lignes pour n'en renvoyer que 20. La pagination par clé (keyset pagination, ex. `where transaction_id > dernier_id_vu`) reste rapide quelle que soit la profondeur de page — retiens ce nom, il revient en Leçon 2.8.",
          },
          { type: "h3", text: "DISTINCT — dédoublonner, à quel coût" },
          {
            type: "sql_code",
            text: "-- Quels canaux de paiement existent réellement dans les données ?\nselect distinct channel from fact_transactions;\n\n-- DISTINCT ON (PostgreSQL) : une ligne par valeur de la colonne indiquée, selon l'ORDER BY\nselect distinct on (customer_id) customer_id, transaction_id, amount_local\nfrom fact_transactions\norder by customer_id, amount_local desc;  -- garde la transaction la plus GRANDE par client",
          },
          {
            type: "p",
            text: "DISTINCT force un tri interne sur toutes les colonnes sélectionnées pour repérer les doublons. Sur une table de quelques milliers de lignes, invisible. Sur des dizaines de millions, un DISTINCT mal placé — par exemple sur une requête qui n'en a pas réellement besoin parce que la clé est déjà unique — peut multiplier inutilement le temps d'exécution.",
          },
          {
            type: "sql_sandbox",
            prompt: "Utilise DISTINCT ON pour trouver la transaction la plus récente de chaque pays.",
            starterQuery:
              "select distinct on (country_code) country_code, transaction_id, transaction_at\nfrom fact_transactions\norder by country_code, transaction_at desc;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi la pagination par OFFSET devient-elle lente sur de grandes pages (ex. OFFSET 100000) ?",
          options: [
            "PostgreSQL refuse les gros OFFSET",
            "Le moteur lit puis jette toutes les lignes avant l'offset demandé",
            "OFFSET ne fonctionne qu'avec ORDER BY",
          ],
          correct_index: 1,
          explain: "La pagination par clé (keyset) évite ce coût en filtrant directement à partir du dernier identifiant vu.",
        },
        {
          question: "Que fait `DISTINCT ON (customer_id)` combiné à un ORDER BY ?",
          options: [
            "Supprime la colonne customer_id du résultat",
            "Garde une seule ligne par customer_id, celle en tête selon l'ORDER BY",
            "Trie sans dédoublonner",
          ],
          correct_index: 1,
          explain: "DISTINCT ON est une extension PostgreSQL très utile pour \"la ligne représentative\" par groupe.",
        },
      ],
    },

    {
      number: "2.2.6",
      slug: "case-when-coalesce-nullif",
      title: "CASE WHEN, COALESCE, NULLIF",
      parentSlug: "sql-foundations-pour-data-engineers",
      duration_minutes: 20,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Trois outils pour de la logique conditionnelle directement dans une requête, sans avoir besoin de récupérer les données pour les transformer ailleurs.",
          },
          { type: "h3", text: "CASE WHEN — le if/else de SQL" },
          {
            type: "sql_code",
            text: "-- Classer chaque transaction en tranche de montant\nselect transaction_id, amount_local,\n  case\n    when amount_local < 20 then 'petite'\n    when amount_local < 100 then 'moyenne'\n    else 'grande'\n  end as tranche\nfrom fact_transactions\nlimit 10;",
          },
          { type: "h3", text: "COALESCE — la première valeur non nulle" },
          {
            type: "sql_code",
            text: "-- Si merchant_id est NULL dans une extraction imparfaite, afficher 'Inconnu' plutôt qu'un vide\nselect transaction_id, coalesce(merchant_id::text, 'Inconnu') as merchant\nfrom raw_transactions_bronze\nlimit 10;",
          },
          { type: "h3", text: "NULLIF — transformer une valeur spécifique en NULL" },
          {
            type: "sql_code",
            text: "-- Traiter une chaîne vide comme une absence de valeur, pas comme du texte\nselect transaction_id, nullif(merchant_id, '') as merchant_id_propre\nfrom raw_transactions_bronze;",
          },
          {
            type: "callout",
            title: "Un usage combiné fréquent en data engineering",
            text: "COALESCE et NULLIF s'utilisent souvent ensemble : NULLIF convertit une valeur \"sale\" (chaîne vide, 'N/A', -1 utilisé comme code d'erreur) en un vrai NULL, puis COALESCE fournit une valeur de repli propre à afficher. C'est exactement ce que fera la couche Silver du pipeline en Leçon 2.7.",
          },
          {
            type: "sql_code",
            text: "select transaction_id,\n  coalesce(nullif(merchant_id, ''), 'INCONNU') as merchant_propre\nfrom raw_transactions_bronze;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Classe chaque transaction en 'faible risque' (< 100), 'à surveiller' (100-500), 'à vérifier' (> 500) avec un CASE WHEN.",
            starterQuery:
              "select transaction_id, amount_local,\n  case\n    when amount_local < 100 then 'faible risque'\n    when amount_local <= 500 then 'à surveiller'\n    else 'à vérifier'\n  end as niveau\nfrom fact_transactions\nlimit 20;",
          },
        ],
      },
      quiz: [
        {
          question: "Que fait COALESCE(a, b, c) ?",
          options: [
            "Renvoie toujours a",
            "Renvoie la première valeur non nulle parmi a, b, c",
            "Renvoie NULL si l'une des trois est NULL",
          ],
          correct_index: 1,
          explain: "COALESCE parcourt la liste et s'arrête à la première valeur non nulle.",
        },
        {
          question: "À quoi sert NULLIF(valeur, 'sentinelle') ?",
          options: [
            "À transformer 'sentinelle' en NULL si valeur lui est égale",
            "À interdire les valeurs NULL",
            "À comparer deux colonnes uniquement",
          ],
          correct_index: 0,
          explain: "Utile pour convertir une valeur 'sale' connue (chaîne vide, code d'erreur) en un vrai NULL exploitable.",
        },
      ],
    },

    {
      number: "2.2.7",
      slug: "null-logique-trois-valeurs-piege-not-in",
      title: "NULL et la logique à trois valeurs : le piège NOT IN",
      parentSlug: "sql-foundations-pour-data-engineers",
      duration_minutes: 30,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "C'est probablement le piège SQL le plus coûteux en production — parce qu'il ne produit ni erreur ni avertissement. Il produit silencieusement zéro résultat, ou un résultat incomplet, et rien ne le signale.",
          },
          {
            type: "callout",
            title: "La logique à trois valeurs de SQL",
            text: "En SQL, une condition n'est pas vraie ou fausse — elle est vraie, fausse, ou inconnue (UNKNOWN) dès qu'un NULL est impliqué. `5 = NULL` n'est pas faux, il est inconnu. Et NOT (inconnu) reste inconnu — ce n'est PAS vrai. C'est cette règle, invisible dans l'usage courant, qui casse silencieusement NOT IN.",
          },
          {
            type: "sql_code",
            text: "-- raw_transactions_bronze.customer_id contient quelques valeurs NULL (extraction imparfaite, volontairement)\nselect count(*) filter (where customer_id is null) from raw_transactions_bronze;",
          },
          {
            type: "callout",
            title: "🪤 Le piège du NULL — testé sur nos vraies données",
            text: "La requête ci-dessous semble raisonnable : trouver les clients qui n'apparaissent jamais dans cette extraction brute. Mais dès qu'un NULL se glisse dans la liste comparée par NOT IN, la comparaison devient indéterminée pour CHAQUE ligne de la table externe — et la requête ne renvoie plus jamais rien, silencieusement.",
          },
          {
            type: "sql_code",
            text: "-- ⚠ Renvoie TOUJOURS zéro ligne à cause des NULL dans la sous-requête\nselect * from dim_customer\nwhere customer_id not in (select customer_id::int from raw_transactions_bronze);\n\n-- ✅ Option 1 : filtrer les NULL avant NOT IN (fonctionne, mais facile à oublier)\nselect * from dim_customer\nwhere customer_id not in (\n  select customer_id::int from raw_transactions_bronze where customer_id is not null\n);\n\n-- ✅ Option 2 (recommandée) : NOT EXISTS ignore proprement les NULL, sans piège possible\nselect c.* from dim_customer c\nwhere not exists (\n  select 1 from raw_transactions_bronze b\n  where b.customer_id is not null and b.customer_id::int = c.customer_id\n);",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Exécute d'abord la version NOT IN (elle renverra 0 ligne), puis la version NOT EXISTS. Compare les deux résultats.",
            starterQuery:
              "select count(*) from dim_customer\nwhere customer_id not in (select customer_id::int from raw_transactions_bronze);",
          },
          {
            type: "thinking_prompt",
            text: "Règle pratique à garder pour toute ta carrière : dès qu'une sous-requête peut contenir des NULL, préfère systématiquement NOT EXISTS à NOT IN. IN (positif) n'a pas ce problème — seul NOT IN (négatif) est piégé par la logique à trois valeurs.",
          },
        ],
      },
      quiz: [
        {
          question: "Combien d'états une condition peut-elle prendre en SQL dès qu'un NULL est impliqué ?",
          options: ["Deux : vrai ou faux", "Trois : vrai, faux, ou inconnu (UNKNOWN)", "Un seul : toujours faux"],
          correct_index: 1,
          explain: "C'est la logique à trois valeurs (three-valued logic) de SQL — la source du piège NOT IN.",
        },
        {
          question: "Pourquoi NOT IN renvoie-t-il zéro ligne dès qu'un NULL traîne dans sa sous-requête ?",
          options: [
            "Ce n'est pas vrai, NOT IN ignore les NULL automatiquement",
            "La comparaison devient indéterminée (UNKNOWN) pour chaque ligne testée, ce qui n'est jamais retenu",
            "PostgreSQL lève une erreur dans ce cas",
          ],
          correct_index: 1,
          explain: "NOT (UNKNOWN) reste UNKNOWN — jamais vrai — donc aucune ligne n'est jamais retenue.",
        },
        {
          question: "Quelle alternative à NOT IN est immunisée contre ce piège du NULL ?",
          options: ["NOT EXISTS", "IN", "DISTINCT"],
          correct_index: 0,
          explain: "NOT EXISTS teste une existence booléenne pure, sans jamais comparer directement à une valeur potentiellement NULL.",
        },
      ],
    },

    {
      number: "2.2.8",
      slug: "jsonb-en-pratique",
      title: "JSONB en pratique",
      parentSlug: "sql-foundations-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "fact_transactions.channel_metadata est une colonne JSONB — chaque transaction mobile money y stocke l'opérateur (Orange Money, M-Pesa, MTN MoMo...) et le système d'exploitation, sans avoir besoin d'une colonne dédiée par opérateur ni de modifier le schéma à chaque nouvel opérateur ajouté.",
          },
          {
            type: "table",
            headers: ["Opérateur", "Résultat"],
            rows: [
              ["->", "Un sous-objet ou tableau JSON (reste du JSON)"],
              ["->>", "Une valeur en texte brut, directement comparable/affichable"],
              ["#>", "Chemin JSON profond (tableau de clés), résultat en JSON"],
              ["#>>", "Chemin JSON profond, résultat en texte"],
              ["@>", "\"Contient\" — teste si un JSON en contient un autre"],
              ["?", "Teste si une clé existe au premier niveau"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Extraire l'opérateur et le système d'exploitation\nselect transaction_id,\n  channel_metadata->>'operator' as operator,\n  channel_metadata->>'device_os' as device_os\nfrom fact_transactions\nwhere channel = 'mobile_money'\nlimit 10;",
          },
          {
            type: "sql_code",
            text: "-- Filtrer directement sur un champ JSON, sans le sortir en colonne\nselect transaction_id, channel_metadata\nfrom fact_transactions\nwhere channel_metadata->>'operator' = 'Orange Money'\n  and channel_metadata->>'device_os' = 'android';",
          },
          {
            type: "sql_code",
            text: "-- Vérifier qu'une clé existe avant de l'utiliser (utile si le schéma JSON varie)\nselect transaction_id from fact_transactions\nwhere channel_metadata ? 'operator';",
          },
          {
            type: "callout",
            title: "Pourquoi JSONB (et pas JSON) est le bon choix par défaut",
            text: "PostgreSQL propose deux types : json (stocke le texte brut tel quel, préserve l'ordre des clés) et jsonb (stocke une représentation binaire décomposée). jsonb est presque toujours préférable : plus rapide à interroger, indexable (GIN), et permet les opérateurs ->, ->>, @>. Le seul cas pour json pur est de vouloir préserver le texte exact, whitespace inclus.",
          },
          {
            type: "sql_code",
            text: "-- Index GIN sur une colonne JSONB — accélère les recherches @> et ? à grande échelle\ncreate index idx_channel_metadata on fact_transactions using gin (channel_metadata);",
          },
          {
            type: "sql_sandbox",
            prompt: "Compte le nombre de transactions mobile_money par opérateur extrait du JSON.",
            starterQuery:
              "select channel_metadata->>'operator' as operator, count(*)\nfrom fact_transactions\nwhere channel = 'mobile_money'\ngroup by operator\norder by count(*) desc;",
          },
        ],
      },
      quiz: [
        {
          question: "Quel opérateur JSONB renvoie une valeur directement en texte, prête à comparer ?",
          options: ["->", "->>", "#>"],
          correct_index: 1,
          explain: "-> renvoie encore du JSON ; ->> renvoie du texte brut directement exploitable.",
        },
        {
          question: "Pourquoi préférer jsonb à json dans la quasi-totalité des cas ?",
          options: [
            "jsonb est plus rapide à interroger et peut être indexé (GIN)",
            "json n'existe plus dans PostgreSQL récent",
            "jsonb préserve l'ordre exact des clés, pas json",
          ],
          correct_index: 0,
          explain: "jsonb stocke une forme binaire décomposée qui accélère les requêtes et permet des index GIN.",
        },
      ],
    },

    {
      number: "2.2.9",
      slug: "group-by-fonctions-agregation",
      title: "GROUP BY et les fonctions d'agrégation",
      parentSlug: "sql-foundations-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "GROUP BY transforme des lignes individuelles en groupes, sur lesquels on peut ensuite calculer des agrégats. C'est l'outil qui répond à toutes les questions \"combien\", \"quelle moyenne\", \"quel total, par...\".",
          },
          {
            type: "table",
            headers: ["Fonction", "Calcule"],
            rows: [
              ["COUNT(*)", "Le nombre de lignes du groupe"],
              ["COUNT(colonne)", "Le nombre de lignes où colonne n'est PAS NULL"],
              ["SUM(colonne)", "La somme des valeurs"],
              ["AVG(colonne)", "La moyenne"],
              ["MIN / MAX(colonne)", "La plus petite / grande valeur"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Volume et montant moyen par pays\nselect country_code,\n  count(*) as nb_transactions,\n  sum(amount_local) as volume_total,\n  avg(amount_local) as montant_moyen,\n  min(amount_local) as plus_petite,\n  max(amount_local) as plus_grande\nfrom fact_transactions\ngroup by country_code\norder by volume_total desc;",
          },
          {
            type: "callout",
            title: "🪤 COUNT(*) vs COUNT(colonne) — pas le même résultat",
            text: "COUNT(*) compte toutes les lignes du groupe, sans exception. COUNT(colonne) ignore les lignes où cette colonne est NULL. Sur raw_transactions_bronze, `count(*)` et `count(customer_id)` donnent des chiffres différents précisément à cause des NULL volontaires dans cette table.",
          },
          {
            type: "sql_code",
            text: "-- Ces deux chiffres diffèrent — la différence EST le nombre de customer_id manquants\nselect count(*) as total_lignes, count(customer_id) as lignes_avec_client\nfrom raw_transactions_bronze;",
          },
          { type: "h3", text: "GROUP BY sur plusieurs colonnes" },
          {
            type: "sql_code",
            text: "-- Un groupe par combinaison unique (pays, canal)\nselect country_code, channel, count(*) as nb, sum(amount_local) as volume\nfrom fact_transactions\ngroup by country_code, channel\norder by country_code, volume desc;",
          },
          {
            type: "callout",
            title: "La règle d'or de GROUP BY",
            text: "Toute colonne apparaissant dans le SELECT sans être dans une fonction d'agrégat DOIT figurer dans le GROUP BY — sinon PostgreSQL refuse la requête (contrairement à certains autres moteurs plus permissifs). C'est une garantie de correction : le moteur t'empêche d'afficher une valeur qui n'a pas de sens unique pour le groupe.",
          },
          {
            type: "sql_sandbox",
            prompt: "Calcule le nombre de marchands par pays ET par catégorie.",
            starterQuery:
              "select country_code, category, count(*) as nb_marchands\nfrom dim_merchant\ngroup by country_code, category\norder by country_code, nb_marchands desc;",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle différence entre COUNT(*) et COUNT(customer_id) sur une table contenant des NULL dans customer_id ?",
          options: [
            "Aucune différence",
            "COUNT(*) compte toutes les lignes, COUNT(customer_id) ignore les lignes où customer_id est NULL",
            "COUNT(customer_id) provoque une erreur",
          ],
          correct_index: 1,
          explain: "C'est un excellent moyen de mesurer rapidement le taux de valeurs manquantes dans une colonne.",
        },
        {
          question: "Que se passe-t-il si une colonne du SELECT n'est ni agrégée ni présente dans le GROUP BY ?",
          options: [
            "PostgreSQL choisit une valeur arbitraire",
            "PostgreSQL refuse d'exécuter la requête",
            "Elle est automatiquement ignorée",
          ],
          correct_index: 1,
          explain: "PostgreSQL est strict sur ce point, contrairement à certains moteurs plus permissifs — c'est une garantie de correction.",
        },
      ],
    },

    {
      number: "2.2.10",
      slug: "having-atelier-synthese-chapitre-2-2",
      title: "HAVING et atelier de synthèse du chapitre",
      parentSlug: "sql-foundations-pour-data-engineers",
      duration_minutes: 30,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "HAVING est le dernier morceau manquant : un filtre, mais qui s'applique APRÈS le regroupement, sur les résultats agrégés — là où WHERE ne peut pas aller.",
          },
          {
            type: "sql_code",
            text: "-- Pays où le volume de transactions dépasse 500 lignes\nselect country_code, count(*) as nb_transactions, sum(amount_local) as volume\nfrom fact_transactions\ngroup by country_code\nhaving count(*) > 500\norder by nb_transactions desc;",
          },
          {
            type: "callout",
            title: "WHERE filtre les lignes, HAVING filtre les groupes",
            text: "`where count(*) > 500` est refusé par PostgreSQL — count(*) n'existe pas encore au moment où WHERE s'exécute (revoir la Leçon 2.2.1 sur l'ordre logique). HAVING existe précisément pour filtrer sur un résultat agrégé.",
          },
          {
            type: "thinking_prompt",
            text: "Cette requête retourne le bon résultat sur 5 000 lignes en quelques millisecondes — mais tiendrait-elle avec 50 millions de lignes ? WHERE filtre avant l'agrégation (donc sur les lignes brutes, réduisant le volume à agréger), HAVING filtre après (sur les groupes déjà calculés) : intervertir leur rôle par erreur — par exemple recalculer un agrégat que WHERE aurait pu éliminer plus tôt — peut faire scanner des dizaines de fois plus de données que nécessaire.",
          },
          { type: "h3", text: "Atelier de synthèse — tout le chapitre en une session" },
          {
            type: "checklist",
            title: "Tu es prêt·e pour le Chapitre 2.3 si tu peux répondre oui à chaque point",
            items: [
              "Je connais l'ordre logique d'exécution d'une requête (FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT)",
              "Je sais pourquoi `= NULL` ne fonctionne jamais et j'utilise IS NULL",
              "Je sais pourquoi NOT IN est dangereux avec une sous-requête pouvant contenir des NULL",
              "Je sais extraire un champ JSONB en texte avec ->>",
              "Je sais quand utiliser WHERE et quand utiliser HAVING",
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 1 — Pour chaque canal de paiement, calcule le nombre de transactions et le montant moyen, uniquement pour les canaux avec plus de 1000 transactions.",
            starterQuery:
              "select channel, count(*) as nb, avg(amount_local) as montant_moyen\nfrom fact_transactions\ngroup by channel\nhaving count(*) > 1000\norder by nb desc;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 2 — Combine tout : parmi les transactions 'completed' de plus de 50, quels pays ont un montant moyen supérieur à 80 ?",
            starterQuery:
              "select country_code, count(*) as nb, avg(amount_local) as montant_moyen\nfrom fact_transactions\nwhere status = 'completed' and amount_local > 50\ngroup by country_code\nhaving avg(amount_local) > 80\norder by montant_moyen desc;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi `where count(*) > 500` est-il refusé par PostgreSQL ?",
          options: [
            "count(*) n'est pas encore calculé au moment où WHERE s'exécute logiquement",
            "500 est trop grand pour WHERE",
            "Il manque un GROUP BY dans la requête",
          ],
          correct_index: 0,
          explain: "WHERE s'exécute avant l'agrégation — HAVING existe précisément pour filtrer après.",
        },
        {
          question: "Pourquoi est-il plus efficace de filtrer un maximum de lignes avec WHERE plutôt qu'avec HAVING quand c'est possible ?",
          options: [
            "Ce n'est jamais plus efficace",
            "WHERE réduit le volume de lignes à agréger, avant le travail de regroupement",
            "HAVING est interdit sur de grandes tables",
          ],
          correct_index: 1,
          explain: "Filtrer tôt (WHERE) réduit le travail que GROUP BY et les agrégats doivent ensuite effectuer.",
        },
        {
          question: "Quel est l'ordre logique correct d'exécution d'une requête complète ?",
          options: [
            "SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY",
            "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT",
            "WHERE, SELECT, FROM, ORDER BY, GROUP BY",
          ],
          correct_index: 1,
          explain: "C'est l'ordre vu en détail en Leçon 2.2.1 — la source d'abord, puis les filtres et regroupements, puis la projection finale.",
        },
      ],
    },

    // ============================================================
    // CHAPITRE 2.3 — JOINS, ENSEMBLES, SOUS-REQUÊTES, CTEs
    // ============================================================
    {
      number: "2.3",
      slug: "joins-ensembles-sous-requetes-ctes",
      title: "Joins, ensembles, sous-requêtes, CTEs",
      duration_minutes: 15,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Aucune donnée utile ne vit dans une seule table. Ce chapitre est celui où AfriPay cesse d'être huit tables isolées pour devenir un système cohérent — la compétence la plus utilisée au quotidien par un data engineer, tout de suite après SELECT/WHERE.",
          },
          {
            type: "checklist",
            title: "Les 10 leçons de ce chapitre",
            items: [
              "2.3.1 — INNER JOIN : combiner deux tables sur une correspondance",
              "2.3.2 — LEFT / RIGHT JOIN : garder les lignes sans correspondance",
              "2.3.3 — FULL JOIN et CROSS JOIN",
              "2.3.4 — SELF JOIN : une table jointe à elle-même",
              "2.3.5 — Cardinalité : pourquoi les lignes se multiplient",
              "2.3.6 — Jointures multiples : combiner 3 tables ou plus",
              "2.3.7 — UNION, INTERSECT, EXCEPT : les opérateurs d'ensembles",
              "2.3.8 — Sous-requêtes non-corrélées",
              "2.3.9 — Sous-requêtes corrélées et EXISTS",
              "2.3.10 — CTEs (WITH) et atelier de synthèse du chapitre",
            ],
          },
        ],
      },
      quiz: [],
    },

    {
      number: "2.3.1",
      slug: "inner-join-combiner-deux-tables",
      title: "INNER JOIN : combiner deux tables sur une correspondance",
      parentSlug: "joins-ensembles-sous-requetes-ctes",
      duration_minutes: 25,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une jointure combine les colonnes de deux tables sur une condition de correspondance. INNER JOIN — le type par défaut — ne garde que les lignes où cette correspondance existe des deux côtés.",
          },
          {
            type: "sql_code",
            text: "-- Chaque transaction avec le nom complet du pays (INNER — country_code est toujours renseigné)\nselect t.transaction_id, c.country_name, t.amount_local\nfrom fact_transactions t\njoin dim_country c on c.country_code = t.country_code\nlimit 20;",
            caption: "\"join\" seul est un raccourci de \"inner join\" en PostgreSQL — les deux s'écrivent, inner join est plus explicite.",
          },
          {
            type: "callout",
            title: "La ligne disparaît si la correspondance échoue",
            text: "Si une transaction avait un country_code qui n'existe dans aucune ligne de dim_country, INNER JOIN l'exclurait purement et simplement du résultat — sans erreur, sans avertissement. C'est la raison pour laquelle INNER JOIN n'est jamais le bon choix quand tu veux explicitement repérer les lignes SANS correspondance (voir Leçon 2.3.2).",
          },
          { type: "h3", text: "Toujours qualifier ses colonnes dans une jointure" },
          {
            type: "sql_code",
            text: "-- ❌ Ambigu dès que les deux tables ont une colonne du même nom\n-- select transaction_id, country_code from fact_transactions t join dim_country c on ...\n\n-- ✅ Toujours préfixer par l'alias de table\nselect t.transaction_id, t.country_code, c.country_name, c.region\nfrom fact_transactions t\njoin dim_country c on c.country_code = t.country_code;",
          },
          { type: "h3", text: "La condition ON — au-delà de l'égalité simple" },
          {
            type: "p",
            text: "ON accepte n'importe quelle condition, pas seulement une égalité de clé. C'est rare en pratique mais utile à savoir : une jointure peut par exemple combiner deux tables sur un intervalle de dates plutôt qu'une clé exacte.",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Joins fact_transactions à dim_merchant pour afficher le nom et la catégorie du marchand de chaque transaction, limité à 15 lignes.",
            starterQuery:
              "select t.transaction_id, m.merchant_name, m.category, t.amount_local\nfrom fact_transactions t\njoin dim_merchant m on m.merchant_id = t.merchant_id\nlimit 15;",
          },
        ],
      },
      quiz: [
        {
          question: "Que fait INNER JOIN si aucune ligne de la table de droite ne correspond à une ligne de gauche ?",
          options: [
            "Il inclut quand même la ligne de gauche avec des NULL",
            "Il exclut cette ligne du résultat, sans erreur",
            "Il lève une erreur",
          ],
          correct_index: 1,
          explain: "INNER JOIN ne garde que les correspondances des deux côtés — silencieusement.",
        },
        {
          question: "Pourquoi toujours qualifier ses colonnes (t.col, c.col) dans une requête avec jointure ?",
          options: [
            "PostgreSQL l'exige pour toute jointure",
            "Pour éviter toute ambiguïté quand deux tables partagent un nom de colonne",
            "Ça accélère l'exécution",
          ],
          correct_index: 1,
          explain: "Lisibilité et absence d'ambiguïté — surtout utile dès qu'on relit le code plus tard.",
        },
      ],
    },

    {
      number: "2.3.2",
      slug: "left-right-join",
      title: "LEFT / RIGHT JOIN : garder les lignes sans correspondance",
      parentSlug: "joins-ensembles-sous-requetes-ctes",
      duration_minutes: 25,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "LEFT JOIN garde TOUTES les lignes de la table de gauche, avec ou sans correspondance à droite — complétant de NULL les colonnes de droite en l'absence de correspondance. C'est l'outil numéro un pour répondre à \"qu'est-ce qui manque ?\".",
          },
          {
            type: "sql_code",
            text: "-- Chaque client, avec ses transactions si il en a — même s'il n'en a AUCUNE\nselect c.customer_id, c.full_name, t.transaction_id, t.amount_local\nfrom dim_customer c\nleft join fact_transactions t on t.customer_id = c.customer_id\norder by c.customer_id\nlimit 20;",
          },
          {
            type: "callout",
            title: "Le cas d'usage le plus rentable de LEFT JOIN : trouver ce qui manque",
            text: "Un LEFT JOIN suivi d'un `where <table_de_droite>.id is null` révèle exactement les lignes de gauche SANS correspondance — une des requêtes de diagnostic les plus utilisées en data engineering (clients sans transaction, marchands jamais utilisés, etc.).",
          },
          {
            type: "sql_code",
            text: "-- Clients AfriPay qui n'ont encore jamais fait de transaction\nselect c.customer_id, c.full_name\nfrom dim_customer c\nleft join fact_transactions t on t.customer_id = c.customer_id\nwhere t.transaction_id is null;",
          },
          { type: "h3", text: "RIGHT JOIN — l'inverse, rarement utilisé en pratique" },
          {
            type: "p",
            text: "RIGHT JOIN garde toutes les lignes de la table de DROITE. C'est mathématiquement identique à un LEFT JOIN avec les deux tables inversées — la convention en entreprise est presque toujours de réécrire en LEFT JOIN pour garder une seule direction de lecture cohérente dans tout le code de l'équipe.",
          },
          {
            type: "sql_code",
            text: "-- Ces deux requêtes sont strictement équivalentes\nselect * from dim_customer c right join fact_transactions t on t.customer_id = c.customer_id;\nselect * from fact_transactions t left join dim_customer c on t.customer_id = c.customer_id;",
          },
          {
            type: "sql_sandbox",
            prompt: "Trouve les marchands AfriPay qui n'ont jamais reçu de transaction (LEFT JOIN + IS NULL).",
            starterQuery:
              "select m.merchant_id, m.merchant_name\nfrom dim_merchant m\nleft join fact_transactions t on t.merchant_id = m.merchant_id\nwhere t.transaction_id is null;",
          },
        ],
      },
      quiz: [
        {
          question: "Que fait un LEFT JOIN quand aucune ligne de droite ne correspond ?",
          options: [
            "Il exclut la ligne de gauche",
            "Il garde la ligne de gauche, avec NULL pour les colonnes de droite",
            "Il lève une erreur",
          ],
          correct_index: 1,
          explain: "C'est la différence fondamentale avec INNER JOIN — LEFT JOIN ne perd jamais de lignes de gauche.",
        },
        {
          question: "Comment trouver les clients qui n'ont jamais fait de transaction ?",
          options: [
            "INNER JOIN puis WHERE amount_local = 0",
            "LEFT JOIN dim_customer vers fact_transactions, puis WHERE transaction_id IS NULL",
            "Ce n'est pas possible en SQL",
          ],
          correct_index: 1,
          explain: "Le LEFT JOIN garde les clients sans transaction avec des colonnes à droite toutes NULL — faciles à isoler ensuite.",
        },
      ],
    },

    {
      number: "2.3.3",
      slug: "full-join-cross-join",
      title: "FULL JOIN et CROSS JOIN",
      parentSlug: "joins-ensembles-sous-requetes-ctes",
      duration_minutes: 20,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Deux types de jointures plus rares, mais chacune a un cas d'usage précis qu'aucun autre JOIN ne couvre.",
          },
          { type: "h3", text: "FULL JOIN — l'union complète, correspondance ou non" },
          {
            type: "sql_code",
            text: "-- Tous les pays connus, avec leurs clients ET marchands s'ils existent — même sans correspondance d'un côté\nselect co.country_name, c.customer_id, m.merchant_id\nfrom dim_country co\nfull join dim_customer c on c.country_code = co.country_code\nfull join dim_merchant m on m.country_code = co.country_code\nlimit 20;",
          },
          {
            type: "p",
            text: "FULL JOIN combine le comportement de LEFT et RIGHT : rien n'est perdu d'aucun des deux côtés. Utile pour un rapprochement de deux sources qui devraient théoriquement se recouper, mais où on veut voir explicitement les écarts des deux côtés (ex. réconciliation comptable).",
          },
          { type: "h3", text: "CROSS JOIN — le produit cartésien" },
          {
            type: "callout",
            title: "Attention à la taille du résultat",
            text: "CROSS JOIN associe CHAQUE ligne de gauche à CHAQUE ligne de droite — sans aucune condition. 200 clients × 50 marchands = 10 000 lignes générées, même si aucune de ces combinaisons n'a de sens métier. Un CROSS JOIN accidentel (une jointure où on a oublié la condition ON) est une des causes les plus fréquentes de requêtes qui explosent en volume sans erreur visible.",
          },
          {
            type: "sql_code",
            text: "-- Cas d'usage légitime : générer toutes les combinaisons (pays × mois) pour un rapport complet, même sans données\nselect co.country_name, d.month\nfrom dim_country co\ncross join (select distinct month from dim_date where year = 2024) d\norder by co.country_name, d.month;",
          },
          {
            type: "sql_sandbox",
            prompt: "Génère toutes les combinaisons (pays × catégorie de marchand) pour repérer les combinaisons qui n'existent pas encore dans les données.",
            starterQuery:
              "select co.country_name, cat.category\nfrom dim_country co\ncross join (select distinct category from dim_merchant) cat\norder by co.country_name, cat.category;",
          },
        ],
      },
      quiz: [
        {
          question: "Que garde un FULL JOIN qu'un LEFT JOIN seul ne garde pas ?",
          options: [
            "Rien de plus",
            "Les lignes de la table de droite qui n'ont pas de correspondance à gauche",
            "Uniquement les lignes correspondantes",
          ],
          correct_index: 1,
          explain: "FULL JOIN combine LEFT et RIGHT — rien n'est perdu, d'aucun côté.",
        },
        {
          question: "Quel est le principal risque d'un CROSS JOIN non intentionnel (ON oublié) ?",
          options: [
            "Une erreur de syntaxe immédiate",
            "Un résultat qui explose en volume — chaque ligne de gauche combinée à chaque ligne de droite",
            "Aucun risque particulier",
          ],
          correct_index: 1,
          explain: "200 × 50 = 10 000 lignes générées sans qu'aucune erreur ne le signale — un piège classique en SQL.",
        },
      ],
    },

    {
      number: "2.3.4",
      slug: "self-join",
      title: "SELF JOIN : une table jointe à elle-même",
      parentSlug: "joins-ensembles-sous-requetes-ctes",
      duration_minutes: 25,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un SELF JOIN n'est pas un type de jointure différent techniquement — c'est n'importe quel JOIN (souvent LEFT) où une table est jointe à elle-même, avec deux alias différents. Le cas d'usage typique : une hiérarchie stockée dans une seule table.",
          },
          {
            type: "callout",
            title: "dim_agent : un cas d'usage réel de SELF JOIN",
            text: "dim_agent stocke des agents mobile money avec une colonne manager_id qui référence agent_id de la MÊME table — un responsable régional supervise des agents de terrain, qui recrutent parfois des sous-agents. Retrouver \"le nom du manager\" de chaque agent demande de joindre la table à elle-même.",
          },
          {
            type: "sql_code",
            text: "-- Chaque agent, avec le nom de SON manager (self join via deux alias : a et mgr)\nselect a.agent_name as agent, mgr.agent_name as manager\nfrom dim_agent a\nleft join dim_agent mgr on mgr.agent_id = a.manager_id\norder by a.agent_name;",
            caption: "LEFT JOIN, pas INNER : les responsables régionaux au sommet de la hiérarchie n'ont pas de manager (manager_id est NULL).",
          },
          {
            type: "sql_code",
            text: "-- Combien de sous-agents directs supervise chaque manager ?\nselect mgr.agent_name as manager, count(a.agent_id) as nb_supervises\nfrom dim_agent mgr\njoin dim_agent a on a.manager_id = mgr.agent_id\ngroup by mgr.agent_name\norder by nb_supervises desc;",
          },
          {
            type: "thinking_prompt",
            text: "Un SELF JOIN ne remonte qu'un seul niveau de hiérarchie à la fois (le manager direct). Pour remonter TOUS les niveaux (le manager du manager du manager...), un SELF JOIN ne suffit plus — il faut une CTE récursive, vue en détail au Chapitre 2.5.",
          },
          {
            type: "sql_sandbox",
            prompt: "Liste chaque agent de terrain avec le nom de son manager direct.",
            starterQuery:
              "select a.agent_name, a.role, mgr.agent_name as manager\nfrom dim_agent a\nleft join dim_agent mgr on mgr.agent_id = a.manager_id\nwhere a.role = 'field_agent'\norder by mgr.agent_name;",
          },
        ],
      },
      quiz: [
        {
          question: "Un SELF JOIN est utile pour modéliser :",
          options: [
            "Deux tables complètement indépendantes",
            "Une relation hiérarchique stockée dans une seule table (ex. manager_id référençant la même table)",
            "Uniquement des dates",
          ],
          correct_index: 1,
          explain: "C'est exactement le cas de dim_agent avec manager_id qui référence agent_id.",
        },
        {
          question: "Pourquoi utiliser LEFT JOIN plutôt que INNER JOIN pour le self join agent → manager ?",
          options: [
            "Parce que INNER JOIN n'est pas autorisé sur un self join",
            "Parce que les responsables régionaux au sommet n'ont pas de manager (manager_id NULL) et seraient exclus par INNER JOIN",
            "Aucune raison particulière",
          ],
          correct_index: 1,
          explain: "INNER JOIN exclurait silencieusement tous les agents sans manager — LEFT JOIN les garde avec un manager NULL.",
        },
      ],
    },

    {
      number: "2.3.5",
      slug: "cardinalite-multiplication-lignes",
      title: "Cardinalité : pourquoi les lignes se multiplient",
      parentSlug: "joins-ensembles-sous-requetes-ctes",
      duration_minutes: 25,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "La cardinalité d'une jointure — 1:1, 1:N, N:N — détermine combien de lignes le résultat va contenir. Se tromper de cardinalité produit un résultat qui s'exécute sans erreur mais qui ment silencieusement.",
          },
          {
            type: "table",
            headers: ["Cardinalité", "Exemple AfriPay", "Effet sur le nombre de lignes"],
            rows: [
              ["1:1", "dim_customer ↔ un futur dim_customer_profile", "Le nombre de lignes ne change pas après jointure"],
              ["1:N", "dim_customer (1) → fact_transactions (N)", "Le client apparaît une fois PAR transaction — multiplication attendue"],
              ["N:N", "dim_merchant ↔ dim_customer (via fact_transactions)", "Nécessite une table de liaison (ici, fact_transactions elle-même)"],
            ],
          },
          {
            type: "p",
            text: "Une jointure 1:N (un client, plusieurs transactions) multiplie les lignes du côté \"1\" par le nombre de correspondances. C'est voulu et attendu quand l'objectif est justement de lister les transactions. Le problème survient quand une jointure censée être 1:1 devient accidentellement 1:N — parce qu'une clé qu'on pensait unique ne l'est pas.",
          },
          {
            type: "sql_code",
            text: "-- Vérifier qu'une jointure ne va pas dupliquer des lignes : compare avant/après\nselect count(*) from fact_transactions; -- ligne de référence\n\nselect count(*) from fact_transactions t\njoin dim_customer c on c.customer_id = t.customer_id; -- doit renvoyer le même nombre (1:N respecté côté fact)",
          },
          {
            type: "callout",
            title: "🪤 Le piège classique : agréger un montant après une jointure 1:N mal maîtrisée",
            text: "Si tu joins fact_transactions à une table qui, par erreur, a PLUSIEURS lignes par merchant_id (au lieu d'une seule attendue), chaque transaction sera dupliquée autant de fois — et un SUM(amount_local) sur ce résultat sera silencieusement gonflé. C'est l'erreur de reporting la plus fréquente et la plus difficile à détecter sans vérifier explicitement la cardinalité.",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Vérifie que dim_merchant a bien un merchant_id unique (aucune ligne ne doit apparaître plus d'une fois) avant de t'y fier pour une jointure.",
            starterQuery:
              "select merchant_id, count(*) from dim_merchant\ngroup by merchant_id\nhaving count(*) > 1;",
          },
          {
            type: "thinking_prompt",
            text: "Si le nombre de lignes explose après une jointure que tu pensais 1:1, qu'est-ce que ça révèle ? Presque toujours : la colonne de jointure n'est pas réellement une clé unique côté droit — une hypothèse sur le modèle de données vient d'être invalidée par les faits, pas un bug du moteur SQL.",
          },
        ],
      },
      quiz: [
        {
          question: "Une jointure 1:N entre dim_customer et fact_transactions multiplie les lignes de quel côté ?",
          options: ["Du côté \"1\" (dim_customer)", "Du côté \"N\" (fact_transactions)", "Aucun côté ne change"],
          correct_index: 0,
          explain: "Chaque client apparaît une fois par transaction correspondante — le côté \"1\" se multiplie.",
        },
        {
          question: "Si une jointure que tu pensais 1:1 fait exploser le nombre de lignes, la cause la plus probable est :",
          options: [
            "Un bug du moteur SQL",
            "La colonne de jointure n'est pas réellement unique côté droit",
            "Il faut ajouter LIMIT",
          ],
          correct_index: 1,
          explain: "C'est un signal sur le modèle de données, pas sur le moteur — une hypothèse de cardinalité vient d'être invalidée.",
        },
        {
          question: "Pourquoi vérifier l'unicité d'une clé de jointure AVANT de faire un SUM() sur le résultat joint ?",
          options: [
            "Ce n'est jamais nécessaire",
            "Une clé non unique du côté censé être \"1\" duplique silencieusement les lignes et gonfle les agrégats",
            "SUM() vérifie automatiquement les doublons",
          ],
          correct_index: 1,
          explain: "C'est l'erreur de reporting la plus fréquente et la plus difficile à repérer sans cette vérification explicite.",
        },
      ],
    },

    {
      number: "2.3.6",
      slug: "jointures-multiples-trois-tables-ou-plus",
      title: "Jointures multiples : combiner 3 tables ou plus",
      parentSlug: "joins-ensembles-sous-requetes-ctes",
      duration_minutes: 25,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "En pratique, une question métier réelle demande rarement seulement deux tables. Chaîner les jointures est direct — à condition de garder chaque alias clair et chaque condition ON explicite.",
          },
          {
            type: "sql_code",
            text: "-- Chaque transaction : nom du client, nom du marchand, nom du pays — trois jointures\nselect\n  t.transaction_id,\n  c.full_name as client,\n  m.merchant_name as marchand,\n  co.country_name as pays,\n  t.amount_local\nfrom fact_transactions t\njoin dim_customer c on c.customer_id = t.customer_id\njoin dim_merchant m on m.merchant_id = t.merchant_id\njoin dim_country co on co.country_code = t.country_code\nlimit 20;",
          },
          {
            type: "callout",
            title: "L'ordre des jointures compte-t-il pour le résultat ?",
            text: "Non, PostgreSQL réordonne les jointures selon le plan qu'il juge le plus efficace (visible dans EXPLAIN, Chapitre 2.8) — le RÉSULTAT est identique quel que soit l'ordre d'écriture des JOIN, tant que la logique (INNER vs LEFT) reste cohérente. Mais l'ordre de LECTURE du code, lui, compte énormément pour la clarté : aller du plus \"central\" (fact_transactions) vers le plus périphérique aide un lecteur à suivre le raisonnement.",
          },
          {
            type: "p",
            text: "Mélanger LEFT JOIN et INNER JOIN dans une même chaîne demande de la vigilance : un INNER JOIN placé après un LEFT JOIN peut annuler l'effet du LEFT JOIN en filtrant de nouveau les lignes que celui-ci avait pris soin de garder.",
          },
          {
            type: "sql_code",
            text: "-- ⚠ Piège : ce INNER JOIN final ré-exclut les clients sans transaction que le LEFT JOIN avait gardés\nselect c.full_name, t.transaction_id, m.merchant_name\nfrom dim_customer c\nleft join fact_transactions t on t.customer_id = c.customer_id\njoin dim_merchant m on m.merchant_id = t.merchant_id;   -- si t.merchant_id est NULL, la ligne disparaît\n\n-- ✅ Garder l'intention \"tous les clients\" jusqu'au bout : LEFT JOIN partout après le premier\nselect c.full_name, t.transaction_id, m.merchant_name\nfrom dim_customer c\nleft join fact_transactions t on t.customer_id = c.customer_id\nleft join dim_merchant m on m.merchant_id = t.merchant_id;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Combine quatre tables : chaque transaction avec le nom du client, du marchand, le pays, et le nom de l'agent qui l'a traitée si applicable (fact_transactions n'a pas de agent_id direct — utilise merchant_id et customer_id seulement ici).",
            starterQuery:
              "select t.transaction_id, c.full_name as client, m.merchant_name, co.country_name\nfrom fact_transactions t\njoin dim_customer c on c.customer_id = t.customer_id\njoin dim_merchant m on m.merchant_id = t.merchant_id\njoin dim_country co on co.country_code = t.country_code\nlimit 20;",
          },
        ],
      },
      quiz: [
        {
          question: "L'ordre d'écriture des JOIN dans une requête change-t-il le résultat final (à logique INNER/LEFT égale) ?",
          options: [
            "Oui, toujours",
            "Non — PostgreSQL détermine son propre plan d'exécution, le résultat logique reste identique",
            "Seulement si plus de 3 tables sont impliquées",
          ],
          correct_index: 1,
          explain: "Le moteur réordonne les jointures pour l'efficacité ; seule la lisibilité du code change avec l'ordre d'écriture.",
        },
        {
          question: "Que se passe-t-il si un INNER JOIN suit un LEFT JOIN sur une colonne potentiellement NULL ?",
          options: [
            "Rien, l'effet du LEFT JOIN est préservé",
            "L'INNER JOIN peut ré-exclure les lignes que le LEFT JOIN avait justement gardées",
            "PostgreSQL refuse la requête",
          ],
          correct_index: 1,
          explain: "Il faut garder LEFT JOIN sur toute la chaîne si l'intention est de ne perdre aucune ligne de la table d'origine.",
        },
      ],
    },

    {
      number: "2.3.7",
      slug: "union-intersect-except",
      title: "UNION, INTERSECT, EXCEPT : les opérateurs d'ensembles",
      parentSlug: "joins-ensembles-sous-requetes-ctes",
      duration_minutes: 25,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Les opérateurs d'ensembles combinent le RÉSULTAT de deux requêtes (empilées verticalement), contrairement à JOIN qui combine des COLONNES de deux tables (côte à côte). Les deux requêtes combinées doivent avoir le même nombre de colonnes, avec des types compatibles.",
          },
          {
            type: "table",
            headers: ["Opérateur", "Résultat"],
            rows: [
              ["UNION", "Toutes les lignes des deux requêtes, doublons supprimés"],
              ["UNION ALL", "Toutes les lignes des deux requêtes, doublons conservés — plus rapide (pas de tri de déduplication)"],
              ["INTERSECT", "Uniquement les lignes présentes dans les DEUX requêtes"],
              ["EXCEPT", "Les lignes de la première requête qui n'apparaissent PAS dans la seconde"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Pays où AfriPay a des clients OU des marchands (UNION dédoublonne automatiquement)\nselect country_code from dim_customer\nunion\nselect country_code from dim_merchant;\n\n-- Pays présents dans les deux ensembles à la fois (INTERSECT)\nselect country_code from dim_customer\nintersect\nselect country_code from dim_merchant;\n\n-- Pays qui ont des clients MAIS aucun marchand (EXCEPT)\nselect country_code from dim_customer\nexcept\nselect country_code from dim_merchant;",
          },
          {
            type: "callout",
            title: "UNION vs UNION ALL : un choix de performance, pas seulement de style",
            text: "UNION fait un tri interne pour éliminer les doublons — un coût réel sur de gros volumes. Si tu sais déjà que les deux ensembles ne peuvent pas se recouper (ex. deux sources déjà mutuellement exclusives), UNION ALL est strictement équivalent en résultat mais plus rapide.",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Utilise UNION ALL pour construire une liste combinée de tous les country_code présents dans dim_customer et dim_merchant, avec une colonne indiquant la source.",
            starterQuery:
              "select country_code, 'client' as source from dim_customer\nunion all\nselect country_code, 'marchand' as source from dim_merchant\norder by country_code;",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle différence entre UNION et UNION ALL ?",
          options: [
            "UNION ALL est plus lent mais garde tout, UNION dédoublonne",
            "UNION dédoublonne (avec un coût de tri), UNION ALL garde tous les doublons et est plus rapide",
            "Aucune différence",
          ],
          correct_index: 1,
          explain: "Si tu sais que les ensembles ne se recoupent pas, UNION ALL évite un tri de déduplication inutile.",
        },
        {
          question: "EXCEPT entre deux requêtes A et B renvoie :",
          options: [
            "Les lignes présentes dans A et dans B",
            "Les lignes de A qui n'apparaissent PAS dans B",
            "Toutes les lignes des deux requêtes",
          ],
          correct_index: 1,
          explain: "EXCEPT est un \"A moins B\" — utile pour trouver ce qui manque d'un côté par rapport à l'autre.",
        },
      ],
    },

    {
      number: "2.3.8",
      slug: "sous-requetes-non-correlees",
      title: "Sous-requêtes non-corrélées",
      parentSlug: "joins-ensembles-sous-requetes-ctes",
      duration_minutes: 25,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une sous-requête non-corrélée s'exécute une seule fois, indépendamment de la requête externe — elle produit une valeur ou une liste de valeurs, ensuite utilisée par la requête principale.",
          },
          {
            type: "sql_code",
            text: "-- Sous-requête scalaire : une seule valeur, utilisable dans une comparaison\nselect * from fact_transactions\nwhere amount_local > (select avg(amount_local) from fact_transactions);",
          },
          {
            type: "sql_code",
            text: "-- Sous-requête qui renvoie une liste : utilisée avec IN\nselect * from dim_merchant\nwhere country_code in (\n  select country_code from dim_country where region = 'Afrique de l''Ouest'\n);",
          },
          { type: "h3", text: "Sous-requête dans le FROM (table dérivée)" },
          {
            type: "sql_code",
            text: "-- Le résultat d'une sous-requête peut lui-même être traité comme une table\nselect region, avg(volume_pays) as volume_moyen_region\nfrom (\n  select co.region, co.country_code, sum(t.amount_local) as volume_pays\n  from fact_transactions t\n  join dim_country co on co.country_code = t.country_code\n  group by co.region, co.country_code\n) as volumes_par_pays\ngroup by region;",
          },
          {
            type: "callout",
            title: "Sous-requête dans le FROM vs CTE (WITH)",
            text: "Une sous-requête dans le FROM fait exactement la même chose qu'une CTE (Leçon 2.3.10) — la différence est purement de lisibilité. Sur une requête complexe à plusieurs étapes, une CTE nommée (`with volumes_par_pays as (...)`) est presque toujours préférable : elle se lit de haut en bas, une sous-requête imbriquée dans le FROM se lit de l'intérieur vers l'extérieur.",
          },
          {
            type: "sql_sandbox",
            prompt: "Trouve les transactions dont le montant dépasse la moyenne globale.",
            starterQuery:
              "select transaction_id, amount_local\nfrom fact_transactions\nwhere amount_local > (select avg(amount_local) from fact_transactions)\norder by amount_local desc\nlimit 20;",
          },
        ],
      },
      quiz: [
        {
          question: "Une sous-requête non-corrélée s'exécute :",
          options: [
            "Une fois par ligne de la requête externe",
            "Une seule fois, indépendamment de la requête externe",
            "Jamais, c'est juste une syntaxe alternative à JOIN",
          ],
          correct_index: 1,
          explain: "C'est ce qui la distingue d'une sous-requête corrélée (Leçon 2.3.9), potentiellement bien plus coûteuse.",
        },
        {
          question: "Quelle est la principale différence pratique entre une sous-requête dans le FROM et une CTE (WITH) ?",
          options: [
            "Aucune différence fonctionnelle, seulement la lisibilité",
            "La CTE est toujours plus rapide",
            "La sous-requête dans le FROM ne peut pas utiliser GROUP BY",
          ],
          correct_index: 0,
          explain: "Les deux produisent le même résultat — la CTE se lit simplement de haut en bas, plus clair sur des requêtes à plusieurs étapes.",
        },
      ],
    },

    {
      number: "2.3.9",
      slug: "sous-requetes-correlees-exists",
      title: "Sous-requêtes corrélées et EXISTS",
      parentSlug: "joins-ensembles-sous-requetes-ctes",
      duration_minutes: 25,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une sous-requête corrélée référence une colonne de la requête externe — elle se ré-exécute potentiellement pour chaque ligne de cette requête externe, ce qui la rend plus coûteuse mais aussi plus expressive.",
          },
          {
            type: "sql_code",
            text: "-- Corrélée : la sous-requête référence m.merchant_id, donc elle se ré-exécute par marchand\nselect m.merchant_name,\n  (select count(*) from fact_transactions t where t.merchant_id = m.merchant_id) as nb_transactions\nfrom dim_merchant m;",
          },
          { type: "h3", text: "EXISTS — tester une existence, pas récupérer une valeur" },
          {
            type: "sql_code",
            text: "-- Marchands qui ont reçu AU MOINS une transaction (EXISTS s'arrête dès la première correspondance trouvée)\nselect m.merchant_name from dim_merchant m\nwhere exists (\n  select 1 from fact_transactions t where t.merchant_id = m.merchant_id\n);",
          },
          {
            type: "callout",
            title: "Pourquoi EXISTS est souvent préférable à IN pour tester une présence",
            text: "EXISTS s'arrête dès qu'une correspondance est trouvée (court-circuit) — il n'a pas besoin de matérialiser toute la liste de résultats comme IN. Sur de grands volumes, EXISTS est généralement plus performant qu'un IN équivalent, et surtout, NOT EXISTS est totalement immunisé contre le piège NULL de NOT IN vu en Leçon 2.2.7.",
          },
          {
            type: "sql_code",
            text: "-- NOT EXISTS : la version sûre et recommandée de \"absent d'une autre table\"\nselect c.full_name from dim_customer c\nwhere not exists (\n  select 1 from fact_transactions t where t.customer_id = c.customer_id\n);",
          },
          {
            type: "sql_sandbox",
            prompt: "Utilise EXISTS pour trouver les pays qui ont au moins un marchand de catégorie 'Santé'.",
            starterQuery:
              "select co.country_name from dim_country co\nwhere exists (\n  select 1 from dim_merchant m\n  where m.country_code = co.country_code and m.category = 'Santé'\n);",
          },
          {
            type: "thinking_prompt",
            text: "Compare mentalement : `where merchant_id in (select ...)` matérialise une liste puis compare. `where exists (select 1 from ... where correlation)` teste juste \"y a-t-il au moins une ligne ?\" sans jamais avoir besoin de connaître la valeur elle-même — d'où le `select 1` conventionnel, qui signale explicitement que la valeur récupérée n'a aucune importance.",
          },
        ],
      },
      quiz: [
        {
          question: "Une sous-requête corrélée se distingue d'une non-corrélée parce qu'elle :",
          options: [
            "S'exécute une seule fois pour toute la requête",
            "Référence une colonne de la requête externe et se ré-exécute potentiellement par ligne",
            "Ne peut jamais être utilisée dans un SELECT",
          ],
          correct_index: 1,
          explain: "C'est cette dépendance ligne par ligne qui la rend potentiellement coûteuse à grande échelle.",
        },
        {
          question: "Pourquoi préfère-t-on souvent EXISTS à IN pour simplement tester une présence ?",
          options: [
            "EXISTS peut s'arrêter dès la première correspondance trouvée (court-circuit), sans matérialiser toute une liste",
            "IN est interdit avec des sous-requêtes",
            "Aucune raison, c'est purement stylistique",
          ],
          correct_index: 0,
          explain: "Et NOT EXISTS est en plus immunisé contre le piège du NULL qui affecte NOT IN.",
        },
      ],
    },

    {
      number: "2.3.10",
      slug: "ctes-with-atelier-synthese-chapitre-2-3",
      title: "CTEs (WITH) et atelier de synthèse du chapitre",
      parentSlug: "joins-ensembles-sous-requetes-ctes",
      duration_minutes: 30,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une CTE (Common Table Expression, introduite par WITH) nomme une sous-requête pour la rendre réutilisable et lisible — la brique qui permet de découper une requête complexe en étapes nommées, comme un petit programme.",
          },
          {
            type: "sql_code",
            text: "with volume_par_pays as (\n  select country_code, sum(amount_local) as volume\n  from fact_transactions\n  group by country_code\n)\nselect c.country_name, v.volume\nfrom volume_par_pays v\njoin dim_country c on c.country_code = v.country_code\norder by v.volume desc;",
          },
          { type: "h3", text: "Plusieurs CTEs chaînées" },
          {
            type: "sql_code",
            text: "-- Une CTE peut référencer une CTE précédente — construire une requête étape par étape\nwith volume_par_pays as (\n  select country_code, sum(amount_local) as volume\n  from fact_transactions\n  group by country_code\n),\nvolume_moyen as (\n  select avg(volume) as moyenne from volume_par_pays\n)\nselect v.country_code, v.volume\nfrom volume_par_pays v, volume_moyen m\nwhere v.volume > m.moyenne\norder by v.volume desc;",
          },
          {
            type: "callout",
            title: "Astuce avancée à retenir : LATERAL",
            text: "Un LATERAL JOIN permet à une sous-requête de référencer les colonnes de la ligne en cours de la table de gauche — utile pour \"le top 3 de chaque groupe\" ou l'as-of join que tu verras au Chapitre 2.4 pour la conversion de devises. Retiens le nom, il revient très vite.",
          },
          { type: "h3", text: "Atelier de synthèse — tout le chapitre en une session" },
          {
            type: "checklist",
            title: "Tu es prêt·e pour le Chapitre 2.4 si tu peux répondre oui à chaque point",
            items: [
              "Je sais choisir entre INNER, LEFT, FULL et CROSS JOIN selon ce que je veux garder ou exclure",
              "Je sais utiliser un LEFT JOIN + IS NULL pour trouver ce qui manque",
              "Je vérifie la cardinalité (unicité de la clé) avant de faire confiance à un agrégat après jointure",
              "Je sais écrire un SELF JOIN pour une hiérarchie à un niveau",
              "Je sais choisir entre sous-requête, EXISTS, et CTE selon la lisibilité et la performance recherchées",
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Livrable — reconstitue la vue 360° d'un client AfriPay : son nom, son pays, le nombre total de ses transactions et le montant total dépensé, via une CTE. Commence par le client 1.",
            starterQuery:
              "with transactions_client as (\n  select customer_id, count(*) as nb_transactions, sum(amount_local) as total_depense\n  from fact_transactions\n  group by customer_id\n)\nselect c.full_name, co.country_name,\n  coalesce(t.nb_transactions, 0) as nb_transactions,\n  coalesce(t.total_depense, 0) as total_depense\nfrom dim_customer c\njoin dim_country co on co.country_code = c.country_code\nleft join transactions_client t on t.customer_id = c.customer_id\nwhere c.customer_id = 1;",
          },
        ],
      },
      quiz: [
        {
          question: "Quel est l'avantage principal d'une CTE (WITH) par rapport à une sous-requête imbriquée dans le FROM ?",
          options: [
            "Elle est toujours plus rapide à l'exécution",
            "Elle nomme chaque étape et se lit de haut en bas, plus lisible sur une requête à plusieurs étapes",
            "Elle est obligatoire dès qu'on utilise GROUP BY",
          ],
          correct_index: 1,
          explain: "Fonctionnellement équivalente à une sous-requête, mais bien plus claire à relire à plusieurs étapes.",
        },
        {
          question: "Une CTE peut-elle référencer une autre CTE définie juste avant elle dans le même WITH ?",
          options: ["Non, jamais", "Oui — c'est ce qui permet de chaîner les étapes d'une requête complexe", "Seulement avec LATERAL"],
          correct_index: 1,
          explain: "Chaque CTE peut s'appuyer sur les précédentes, comme des étapes successives d'un calcul.",
        },
        {
          question: "Qu'est-ce qu'un LATERAL JOIN permet de faire que les jointures classiques ne permettent pas ?",
          options: [
            "Référencer, dans la sous-requête de droite, une colonne de la ligne en cours de la table de gauche",
            "Joindre plus de deux tables à la fois",
            "Trier automatiquement les résultats",
          ],
          correct_index: 0,
          explain: "C'est ce qui rend possible \"le top 3 de chaque groupe\" ou l'as-of join du Chapitre 2.4.",
        },
      ],
    },

    // ============================================================
    // CHAPITRE 2.4 — WINDOW FUNCTIONS & SQL ANALYTIQUE
    // ============================================================
    {
      number: "2.4",
      slug: "window-functions-sql-analytique",
      title: "Window Functions & SQL analytique",
      duration_minutes: 15,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "GROUP BY écrase les lignes en groupes. Les window functions font l'inverse : elles calculent un agrégat tout en gardant chaque ligne individuelle visible. C'est la compétence qui distingue le plus nettement un SQL de débutant d'un SQL de data engineer — et l'une des plus demandées en entretien technique.",
          },
          {
            type: "checklist",
            title: "Les 10 leçons de ce chapitre",
            items: [
              "2.4.1 — OVER() : la syntaxe de base d'une window function",
              "2.4.2 — PARTITION BY : calculer par groupe sans regrouper",
              "2.4.3 — Le cadre de fenêtre (frame) et ROWS BETWEEN",
              "2.4.4 — ROW_NUMBER, RANK, DENSE_RANK",
              "2.4.5 — NTILE et les quantiles",
              "2.4.6 — LAG et LEAD : comparer à la ligne précédente/suivante",
              "2.4.7 — Running totals et cumul depuis le début de l'année (YTD)",
              "2.4.8 — Détection d'anomalies avec des statistiques de fenêtre",
              "2.4.9 — LATERAL JOIN et as-of join : le taux de change historique",
              "2.4.10 — Atelier de synthèse du chapitre",
            ],
          },
        ],
      },
      quiz: [],
    },

    {
      number: "2.4.1",
      slug: "over-syntaxe-de-base",
      title: "OVER() : la syntaxe de base d'une window function",
      parentSlug: "window-functions-sql-analytique",
      duration_minutes: 25,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une window function s'écrit comme une fonction d'agrégat classique, suivie de OVER(...). C'est ce OVER() qui change tout : au lieu d'écraser les lignes, le calcul s'affiche sur CHAQUE ligne individuelle.",
          },
          {
            type: "sql_code",
            text: "-- Comparaison directe : GROUP BY écrase, OVER() garde chaque ligne\n\n-- GROUP BY : une ligne PAR pays\nselect country_code, sum(amount_local) as total\nfrom fact_transactions\ngroup by country_code;\n\n-- OVER() : une ligne PAR TRANSACTION, avec le total de son pays affiché en plus\nselect transaction_id, country_code, amount_local,\n  sum(amount_local) over (partition by country_code) as total_pays\nfrom fact_transactions\nlimit 10;",
          },
          {
            type: "callout",
            title: "Ce que OVER() change concrètement",
            text: "Sans OVER(), sum(amount_local) est un agrégat classique qui nécessite un GROUP BY et réduit le nombre de lignes. Avec OVER(), la même fonction devient une window function : elle calcule sur un ensemble de lignes (la \"fenêtre\") mais renvoie une valeur pour CHAQUE ligne d'origine, sans en supprimer aucune.",
          },
          {
            type: "p",
            text: "OVER() peut rester vide — dans ce cas, la fenêtre est TOUTE la table.",
          },
          {
            type: "sql_code",
            text: "-- Chaque transaction avec le volume TOTAL de toutes les transactions (fenêtre = table entière)\nselect transaction_id, amount_local,\n  sum(amount_local) over () as volume_total_toutes_transactions\nfrom fact_transactions\nlimit 5;",
          },
          {
            type: "sql_sandbox",
            prompt: "Affiche chaque transaction avec le montant moyen de TOUTES les transactions, sans regrouper.",
            starterQuery:
              "select transaction_id, amount_local,\n  avg(amount_local) over () as moyenne_generale\nfrom fact_transactions\nlimit 10;",
          },
        ],
      },
      quiz: [
        {
          question: "Que fait OVER() ajouté à une fonction comme sum() ou avg() ?",
          options: [
            "Il transforme la fonction en window function, qui garde chaque ligne visible",
            "Il trie automatiquement le résultat",
            "Il ne fait rien de particulier",
          ],
          correct_index: 0,
          explain: "C'est la différence fondamentale avec un agrégat classique nécessitant GROUP BY.",
        },
        {
          question: "Que représente la fenêtre quand OVER() est laissé complètement vide ?",
          options: ["Aucune ligne", "Toute la table", "Uniquement la ligne courante"],
          correct_index: 1,
          explain: "Sans PARTITION BY, la fenêtre par défaut couvre l'ensemble des lignes du résultat.",
        },
      ],
    },

    {
      number: "2.4.2",
      slug: "partition-by-calculer-par-groupe",
      title: "PARTITION BY : calculer par groupe sans regrouper",
      parentSlug: "window-functions-sql-analytique",
      duration_minutes: 25,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "PARTITION BY découpe la fenêtre en sous-groupes — le calcul se réinitialise pour chaque valeur distincte de la colonne de partition, exactement comme GROUP BY le ferait, mais sans jamais réduire le nombre de lignes du résultat.",
          },
          {
            type: "sql_code",
            text: "-- Chaque transaction, avec le total de SON pays affiché sur CHAQUE ligne\nselect transaction_id, country_code, amount_local,\n  sum(amount_local) over (partition by country_code) as total_pays,\n  round(100.0 * amount_local / sum(amount_local) over (partition by country_code), 2) as pct_du_pays\nfrom fact_transactions\norder by country_code\nlimit 15;",
          },
          {
            type: "callout",
            title: "Un cas d'usage impossible avec GROUP BY seul",
            text: "Calculer \"quel pourcentage du volume total de son pays représente CETTE transaction\" exige de connaître à la fois la valeur de la ligne ET le total du groupe, sur la MÊME ligne. GROUP BY ne peut pas faire ça seul (il faudrait joindre le résultat groupé à la table d'origine) — PARTITION BY le fait nativement, en une seule passe.",
          },
          { type: "h3", text: "Partitionner sur plusieurs colonnes" },
          {
            type: "sql_code",
            text: "-- Le total PAR combinaison (pays, canal), affiché sur chaque ligne\nselect transaction_id, country_code, channel, amount_local,\n  sum(amount_local) over (partition by country_code, channel) as total_pays_canal\nfrom fact_transactions\nlimit 15;",
          },
          {
            type: "sql_sandbox",
            prompt: "Affiche chaque transaction avec le nombre total de transactions de son canal de paiement.",
            starterQuery:
              "select transaction_id, channel, amount_local,\n  count(*) over (partition by channel) as nb_transactions_du_canal\nfrom fact_transactions\nlimit 15;",
          },
        ],
      },
      quiz: [
        {
          question: "PARTITION BY, contrairement à GROUP BY :",
          options: [
            "Réduit le nombre de lignes du résultat",
            "Découpe la fenêtre en sous-groupes sans réduire le nombre de lignes",
            "Ne peut être utilisé qu'une seule fois par requête",
          ],
          correct_index: 1,
          explain: "C'est ce qui permet d'afficher \"la part du total\" sur chaque ligne individuelle.",
        },
        {
          question: "Peut-on partitionner sur plusieurs colonnes à la fois ?",
          options: ["Non, une seule colonne maximum", "Oui — PARTITION BY col1, col2", "Seulement avec ROW_NUMBER"],
          correct_index: 1,
          explain: "Exactement comme GROUP BY, PARTITION BY accepte plusieurs colonnes séparées par une virgule.",
        },
      ],
    },

    {
      number: "2.4.3",
      slug: "cadre-fenetre-rows-between",
      title: "Le cadre de fenêtre (frame) et ROWS BETWEEN",
      parentSlug: "window-functions-sql-analytique",
      duration_minutes: 25,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Quand une window function inclut un ORDER BY, elle n'opère plus forcément sur TOUTE la partition — elle opère sur un cadre (frame) : un sous-ensemble de lignes autour de la ligne courante, défini par ROWS BETWEEN.",
          },
          {
            type: "sql_code",
            text: "-- Par défaut, avec ORDER BY : le cadre va du début de la partition JUSQU'À la ligne courante\nselect transaction_id, transaction_at, amount_local,\n  sum(amount_local) over (order by transaction_at) as cumul_depuis_le_debut\nfrom fact_transactions\nwhere country_code = 'CI'\norder by transaction_at\nlimit 10;",
          },
          {
            type: "table",
            headers: ["Clause de cadre", "Signifie"],
            rows: [
              ["ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW", "Du début de la partition jusqu'à la ligne courante (le défaut avec ORDER BY)"],
              ["ROWS BETWEEN 2 PRECEDING AND CURRENT ROW", "Une fenêtre glissante des 2 lignes précédentes + la ligne courante"],
              ["ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING", "De la ligne courante jusqu'à la fin de la partition"],
              ["ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING", "Toute la partition, peu importe la ligne courante (équivalent à sans ORDER BY)"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Moyenne glissante sur les 3 dernières transactions (la courante + les 2 précédentes)\nselect transaction_id, transaction_at, amount_local,\n  avg(amount_local) over (\n    order by transaction_at\n    rows between 2 preceding and current row\n  ) as moyenne_glissante_3\nfrom fact_transactions\nwhere country_code = 'CI'\norder by transaction_at\nlimit 15;",
          },
          {
            type: "thinking_prompt",
            text: "Une moyenne glissante (rolling average) lisse les variations ponctuelles pour révéler une tendance — très utilisé en détection de fraude et en monitoring : une transaction isolée inhabituelle compte moins qu'une dérive progressive sur plusieurs jours.",
          },
          {
            type: "sql_sandbox",
            prompt: "Calcule une moyenne glissante sur 5 transactions pour les paiements marchands au Sénégal.",
            starterQuery:
              "select transaction_id, transaction_at, amount_local,\n  avg(amount_local) over (\n    order by transaction_at\n    rows between 4 preceding and current row\n  ) as moyenne_glissante_5\nfrom fact_transactions\nwhere country_code = 'SN'\norder by transaction_at\nlimit 20;",
          },
        ],
      },
      quiz: [
        {
          question: "Quel est le cadre par défaut d'une window function qui utilise ORDER BY sans préciser ROWS BETWEEN ?",
          options: [
            "Toute la partition, sans distinction",
            "Du début de la partition jusqu'à la ligne courante",
            "Seulement la ligne courante",
          ],
          correct_index: 1,
          explain: "C'est ce qui rend les cumuls (running totals) possibles simplement en ajoutant un ORDER BY.",
        },
        {
          question: "À quoi sert une moyenne glissante (rolling average) sur les N dernières lignes ?",
          options: [
            "À supprimer les valeurs aberrantes définitivement",
            "À lisser les variations ponctuelles et révéler une tendance",
            "À trier les données par ordre alphabétique",
          ],
          correct_index: 1,
          explain: "Utile en détection d'anomalies : une dérive progressive ressort mieux qu'un pic isolé.",
        },
      ],
    },

    {
      number: "2.4.4",
      slug: "row-number-rank-dense-rank",
      title: "ROW_NUMBER, RANK, DENSE_RANK",
      parentSlug: "window-functions-sql-analytique",
      duration_minutes: 25,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Trois fonctions de classement, qui se comportent différemment uniquement en cas d'ex-æquo — une nuance qui change complètement le résultat d'un \"top N par groupe\".",
          },
          {
            type: "table",
            headers: ["Fonction", "En cas d'ex-æquo", "Après un ex-æquo"],
            rows: [
              ["ROW_NUMBER()", "Attribue quand même des numéros différents (1, 2, 3...)", "Continue normalement (4, 5...)"],
              ["RANK()", "Attribue le même rang aux ex-æquo (1, 1, 3...)", "Saute les rangs sautés (3, pas 2)"],
              ["DENSE_RANK()", "Attribue le même rang aux ex-æquo (1, 1, 2...)", "Ne saute AUCUN rang (2, pas 3)"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Le marchand n°1 par volume, dans CHAQUE pays (pas un top global)\nwith classement as (\n  select m.merchant_name, t.country_code, sum(t.amount_local) as volume,\n    rank() over (partition by t.country_code order by sum(t.amount_local) desc) as rang\n  from fact_transactions t\n  join dim_merchant m on m.merchant_id = t.merchant_id\n  group by m.merchant_name, t.country_code\n)\nselect * from classement where rang = 1;",
          },
          {
            type: "callout",
            title: "🪤 Pourquoi le choix de la fonction change le résultat d'un \"top 1\"",
            text: "Si deux marchands d'un même pays ont EXACTEMENT le même volume, RANK() et DENSE_RANK() leur donneront TOUS LES DEUX le rang 1 — un `where rang = 1` renverrait alors deux lignes pour ce pays, pas une seule. ROW_NUMBER() départagerait arbitrairement (selon l'ordre interne), garantissant toujours une seule ligne — mais en cachant l'ex-æquo réel. Le bon choix dépend de si l'ex-æquo doit être visible ou non.",
          },
          {
            type: "sql_code",
            text: "-- Comparaison côte à côte des trois fonctions sur les mêmes données\nselect merchant_name, volume,\n  row_number() over (order by volume desc) as rn,\n  rank() over (order by volume desc) as rk,\n  dense_rank() over (order by volume desc) as drk\nfrom (\n  select m.merchant_name, sum(t.amount_local) as volume\n  from fact_transactions t join dim_merchant m on m.merchant_id = t.merchant_id\n  group by m.merchant_name\n) as volumes\norder by volume desc\nlimit 10;",
          },
          {
            type: "sql_sandbox",
            prompt: "Trouve le TOP 3 des marchands par volume, dans chaque pays, avec ROW_NUMBER.",
            starterQuery:
              "with classement as (\n  select m.merchant_name, t.country_code, sum(t.amount_local) as volume,\n    row_number() over (partition by t.country_code order by sum(t.amount_local) desc) as rang\n  from fact_transactions t\n  join dim_merchant m on m.merchant_id = t.merchant_id\n  group by m.merchant_name, t.country_code\n)\nselect * from classement where rang <= 3\norder by country_code, rang;",
          },
        ],
      },
      quiz: [
        {
          question: "En cas d'ex-æquo, quelle est la différence entre RANK() et DENSE_RANK() ?",
          options: [
            "Aucune différence",
            "RANK() saute des rangs après un ex-æquo, DENSE_RANK() n'en saute aucun",
            "DENSE_RANK() ne fonctionne pas avec PARTITION BY",
          ],
          correct_index: 1,
          explain: "Après deux lignes classées 1, RANK() donne 3 à la suivante, DENSE_RANK() donne 2.",
        },
        {
          question: "Pourquoi ROW_NUMBER() garantit-il toujours exactement une ligne par `where rang = 1`, contrairement à RANK() ?",
          options: [
            "ROW_NUMBER() attribue toujours des numéros distincts, même en cas d'ex-æquo réel",
            "ROW_NUMBER() ignore les ex-æquo et les supprime",
            "Ce n'est pas vrai, le comportement est identique",
          ],
          correct_index: 0,
          explain: "RANK() donnerait le même rang 1 à plusieurs lignes ex-æquo — ROW_NUMBER() les départage toujours arbitrairement.",
        },
      ],
    },

    {
      number: "2.4.5",
      slug: "ntile-quantiles",
      title: "NTILE et les quantiles",
      parentSlug: "window-functions-sql-analytique",
      duration_minutes: 20,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "NTILE(n) répartit les lignes ordonnées en n groupes de taille aussi égale que possible — l'outil direct pour des quantiles : quartiles (NTILE(4)), déciles (NTILE(10)), etc.",
          },
          {
            type: "sql_code",
            text: "-- Répartir les clients en 4 quartiles selon leur montant total dépensé\nwith total_client as (\n  select customer_id, sum(amount_local) as total_depense\n  from fact_transactions\n  group by customer_id\n)\nselect customer_id, total_depense,\n  ntile(4) over (order by total_depense desc) as quartile\nfrom total_client\norder by total_depense desc;",
          },
          {
            type: "callout",
            title: "Cas d'usage typique : identifier le top 25% des clients",
            text: "`ntile(4)` avec `order by total_depense desc` place les plus gros clients dans le quartile 1 — un filtre `where quartile = 1` isole immédiatement le top 25%, sans avoir à calculer un seuil de montant manuellement. Très utilisé en segmentation marketing et en priorisation commerciale.",
          },
          {
            type: "sql_code",
            text: "-- Isoler le top 25% des clients par dépense\nwith total_client as (\n  select customer_id, sum(amount_local) as total_depense\n  from fact_transactions group by customer_id\n),\nquartiles as (\n  select customer_id, total_depense,\n    ntile(4) over (order by total_depense desc) as quartile\n  from total_client\n)\nselect c.full_name, q.total_depense\nfrom quartiles q\njoin dim_customer c on c.customer_id = q.customer_id\nwhere q.quartile = 1\norder by q.total_depense desc;",
          },
          {
            type: "sql_sandbox",
            prompt: "Répartis les marchands en 5 groupes (quintiles) selon leur volume total de transactions reçues.",
            starterQuery:
              "with volume_marchand as (\n  select merchant_id, sum(amount_local) as volume\n  from fact_transactions group by merchant_id\n)\nselect merchant_id, volume,\n  ntile(5) over (order by volume desc) as quintile\nfrom volume_marchand\norder by volume desc;",
          },
        ],
      },
      quiz: [
        {
          question: "Que fait NTILE(4) combiné à un ORDER BY ?",
          options: [
            "Il classe chaque ligne avec un numéro unique",
            "Il répartit les lignes ordonnées en 4 groupes de taille à peu près égale",
            "Il calcule une moyenne sur 4 lignes"
          ],
          correct_index: 1,
          explain: "C'est l'outil direct pour des quartiles, déciles, ou tout autre découpage en n parts égales.",
        },
        {
          question: "Pour isoler le top 25% des clients par dépense, quelle combinaison utiliser ?",
          options: [
            "NTILE(4) avec ORDER BY total_depense DESC, puis filtrer quartile = 1",
            "RANK() avec un LIMIT 25",
            "GROUP BY sans window function",
          ],
          correct_index: 0,
          explain: "Le quartile 1 (avec un ORDER BY décroissant) contient automatiquement les plus gros dépensiers.",
        },
      ],
    },

    {
      number: "2.4.6",
      slug: "lag-lead-valeurs-relatives",
      title: "LAG et LEAD : comparer à la ligne précédente/suivante",
      parentSlug: "window-functions-sql-analytique",
      duration_minutes: 25,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "LAG regarde en arrière dans la fenêtre ordonnée, LEAD regarde en avant — sans jamais avoir besoin d'un self-join sur des dates décalées, une technique bien plus lourde utilisée avant l'existence des window functions.",
          },
          {
            type: "sql_code",
            text: "-- Évolution du volume mensuel par pays, mois précédent inclus sur la même ligne\nwith mensuel as (\n  select country_code, date_trunc('month', transaction_at) as mois, sum(amount_local) as volume\n  from fact_transactions\n  group by 1, 2\n)\nselect country_code, mois, volume,\n  lag(volume) over (partition by country_code order by mois) as volume_mois_precedent,\n  round(100.0 * (volume - lag(volume) over (partition by country_code order by mois))\n    / lag(volume) over (partition by country_code order by mois), 1) as variation_pct\nfrom mensuel\norder by country_code, mois;",
          },
          {
            type: "callout",
            title: "Le premier mois n'a pas de \"précédent\" — LAG renvoie NULL",
            text: "Pour la toute première ligne de chaque partition, il n'existe rien avant elle : LAG renvoie NULL par défaut. Un deuxième argument optionnel — `lag(volume, 1, 0)` — permet de fournir une valeur de repli plutôt que NULL, utile pour éviter des NULL en cascade dans un calcul de variation.",
          },
          {
            type: "sql_code",
            text: "-- LEAD : voir la valeur SUIVANTE — utile pour calculer un intervalle entre deux dates\nselect customer_id, transaction_at,\n  lead(transaction_at) over (partition by customer_id order by transaction_at) as prochaine_transaction,\n  lead(transaction_at) over (partition by customer_id order by transaction_at) - transaction_at as delai\nfrom fact_transactions\norder by customer_id, transaction_at\nlimit 15;",
          },
          {
            type: "sql_sandbox",
            prompt: "Calcule, pour chaque client, le délai entre deux transactions consécutives.",
            starterQuery:
              "select customer_id, transaction_at,\n  transaction_at - lag(transaction_at) over (partition by customer_id order by transaction_at) as delai_depuis_precedente\nfrom fact_transactions\norder by customer_id, transaction_at\nlimit 20;",
          },
        ],
      },
      quiz: [
        {
          question: "Que renvoie LAG(colonne) pour la toute première ligne d'une partition ?",
          options: ["Une erreur", "NULL par défaut", "0 par défaut"],
          correct_index: 1,
          explain: "Un deuxième et troisième argument optionnels de LAG permettent de fournir une valeur de repli différente de NULL.",
        },
        {
          question: "LEAD(transaction_at) sur une fenêtre ordonnée par date, partitionnée par client, renvoie :",
          options: [
            "La date de la transaction précédente du même client",
            "La date de la PROCHAINE transaction du même client",
            "La date actuelle du système",
          ],
          correct_index: 1,
          explain: "LEAD regarde en avant dans l'ordre défini par la fenêtre — LAG regarde en arrière.",
        },
      ],
    },

    {
      number: "2.4.7",
      slug: "running-totals-cumul-ytd",
      title: "Running totals et cumul depuis le début de l'année (YTD)",
      parentSlug: "window-functions-sql-analytique",
      duration_minutes: 25,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un running total (cumul progressif) répond à \"combien au total jusqu'ici\" — une métrique business extrêmement courante en reporting financier, exactement le genre de calcul qu'AfriPay veut suivre mois après mois.",
          },
          {
            type: "sql_code",
            text: "-- Cumul YTD (year-to-date) : le total accumulé depuis janvier de la même année, par pays\nselect country_code, date_trunc('month', transaction_at) as mois,\n  sum(sum(amount_local)) over (\n    partition by country_code, extract(year from transaction_at)\n    order by date_trunc('month', transaction_at)\n  ) as cumul_ytd\nfrom fact_transactions\ngroup by 1, 2, extract(year from transaction_at)\norder by 1, 2;",
          },
          {
            type: "callout",
            title: "Pourquoi sum(sum(...)) — un agrégat DANS une window function",
            text: "La requête calcule d'abord un GROUP BY classique (le volume mensuel), PUIS applique une window function sur ce résultat déjà agrégé. C'est la combinaison agrégat + fenêtre : le sum() intérieur est l'agrégat par groupe (mois), le sum() over() extérieur est le cumul progressif sur ces groupes déjà résumés.",
          },
          {
            type: "p",
            text: "PARTITION BY inclut extract(year from transaction_at) : le cumul se réinitialise à zéro à chaque nouvelle année — sans quoi le YTD de janvier 2025 continuerait le cumul de décembre 2024, ce qui n'aurait aucun sens business.",
          },
          {
            type: "sql_sandbox",
            prompt: "Calcule le cumul du nombre de transactions (pas du montant) mois par mois pour le Maroc.",
            starterQuery:
              "select date_trunc('month', transaction_at) as mois, count(*) as nb_mensuel,\n  sum(count(*)) over (order by date_trunc('month', transaction_at)) as cumul\nfrom fact_transactions\nwhere country_code = 'MA'\ngroup by 1\norder by 1;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi PARTITION BY doit-il inclure l'année dans un calcul de cumul YTD ?",
          options: [
            "Ce n'est pas nécessaire",
            "Pour que le cumul se réinitialise à zéro à chaque nouvelle année plutôt que de continuer indéfiniment",
            "Parce que PARTITION BY exige toujours au moins deux colonnes",
          ],
          correct_index: 1,
          explain: "Sans ça, janvier 2025 continuerait le cumul de décembre 2024 — incohérent pour un indicateur \"depuis le début de l'année\".",
        },
        {
          question: "Dans `sum(sum(amount_local)) over (...)`, à quoi sert le sum() intérieur ?",
          options: [
            "Rien, c'est redondant",
            "C'est l'agrégat GROUP BY classique (par mois), sur lequel la window function calcule ensuite le cumul",
            "Il annule l'effet du sum() extérieur",
          ],
          correct_index: 1,
          explain: "On combine ici un agrégat classique et une window function sur son résultat.",
        },
      ],
    },

    {
      number: "2.4.8",
      slug: "detection-anomalies-statistiques-fenetre",
      title: "Détection d'anomalies avec des statistiques de fenêtre",
      parentSlug: "window-functions-sql-analytique",
      duration_minutes: 30,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "thinking_prompt",
            text: "Comment détecter une transaction suspecte sans écrire une boucle procédurale ? Compare chaque montant à la moyenne (et l'écart-type) des transactions du même client — une window function le fait en une seule requête, là où un langage procédural écrirait une boucle par client.",
          },
          {
            type: "sql_code",
            text: "-- Transactions dont le montant dépasse 3x la moyenne DU MÊME CLIENT\nwith stats_client as (\n  select transaction_id, amount_local, customer_id,\n    avg(amount_local) over (partition by customer_id) as moyenne_client\n  from fact_transactions\n)\nselect * from stats_client where amount_local > 3 * moyenne_client;",
          },
          {
            type: "callout",
            title: "Pourquoi comparer au client, et pas à la moyenne globale",
            text: "Un client qui dépense typiquement 500 par transaction et un autre qui dépense typiquement 10 n'ont pas le même seuil d'anomalie. Comparer chaque transaction à SON PROPRE historique (via PARTITION BY customer_id) détecte des écarts individuels que la moyenne globale masquerait complètement.",
          },
          { type: "h3", text: "Aller plus loin : l'écart-type (STDDEV)" },
          {
            type: "sql_code",
            text: "-- Un score de déviation plus rigoureux : combien d'écarts-types du montant habituel ?\nwith stats_client as (\n  select transaction_id, amount_local, customer_id,\n    avg(amount_local) over (partition by customer_id) as moyenne,\n    stddev(amount_local) over (partition by customer_id) as ecart_type\n  from fact_transactions\n)\nselect transaction_id, customer_id, amount_local, moyenne,\n  round((amount_local - moyenne) / nullif(ecart_type, 0), 2) as score_z\nfrom stats_client\nwhere ecart_type > 0\norder by abs((amount_local - moyenne) / nullif(ecart_type, 0)) desc\nlimit 20;",
            caption: "Un score-z (z-score) au-delà de ±2 ou ±3 signale statistiquement une valeur inhabituelle — nullif évite une division par zéro si un client n'a qu'une seule transaction.",
          },
          {
            type: "sql_sandbox",
            prompt: "Trouve les transactions dont le montant dépasse 2 écarts-types de la moyenne de leur marchand.",
            starterQuery:
              "with stats_marchand as (\n  select transaction_id, merchant_id, amount_local,\n    avg(amount_local) over (partition by merchant_id) as moyenne,\n    stddev(amount_local) over (partition by merchant_id) as ecart_type\n  from fact_transactions\n)\nselect * from stats_marchand\nwhere ecart_type > 0 and abs(amount_local - moyenne) > 2 * ecart_type\norder by amount_local desc;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi partitionner par customer_id plutôt que comparer à la moyenne globale pour détecter une anomalie ?",
          options: [
            "Chaque client a un comportement de dépense différent — un seuil global masquerait les écarts individuels",
            "PARTITION BY est obligatoire pour utiliser AVG()",
            "Cela n'a aucune importance pratique",
          ],
          correct_index: 0,
          explain: "Un montant normal pour un gros client pourrait être une anomalie flagrante pour un petit client.",
        },
        {
          question: "À quoi sert NULLIF(ecart_type, 0) dans un calcul de score-z ?",
          options: [
            "À arrondir le résultat",
            "À éviter une division par zéro quand un client n'a qu'une seule transaction (écart-type = 0)",
            "À trier les résultats",
          ],
          correct_index: 1,
          explain: "Sans ce garde-fou, une division par un écart-type nul provoquerait une erreur d'exécution.",
        },
      ],
    },

    {
      number: "2.4.9",
      slug: "lateral-join-as-of-join-taux-change",
      title: "LATERAL JOIN et as-of join : le taux de change historique",
      parentSlug: "window-functions-sql-analytique",
      duration_minutes: 30,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "callout",
            title: "Le piège qui coûte cher en production",
            text: "fx_rates contient un taux différent CHAQUE JOUR. Joindre naïvement une transaction au taux \"le plus récent\" plutôt qu'au taux en vigueur À SA DATE fausse silencieusement tout l'historique de conversion — une erreur réelle et fréquente en fintech, invisible tant qu'on ne compare pas au bon référentiel.",
          },
          {
            type: "p",
            text: "Un as-of join répond à \"quelle était la valeur en vigueur à CETTE date précise ?\". Ni un JOIN classique (qui exigerait une correspondance exacte de date, rarissime) ni une simple sous-requête scalaire (qui ne peut référencer qu'UNE seule ligne externe à la fois) ne suffisent — il faut un LATERAL JOIN.",
          },
          {
            type: "sql_code",
            text: "-- As-of join via LATERAL : le taux en vigueur À LA DATE de la transaction, pas celui d'aujourd'hui\nselect t.transaction_id, t.transaction_at, t.amount_local, t.currency_code,\n  fx.rate_to_usd,\n  round(t.amount_local / fx.rate_to_usd, 2) as amount_usd\nfrom fact_transactions t\njoin lateral (\n  select rate_to_usd\n  from fx_rates\n  where fx_rates.currency_code = t.currency_code\n    and fx_rates.rate_date <= t.transaction_at::date\n  order by rate_date desc\n  limit 1\n) fx on true\nlimit 20;",
            caption: "Alternative équivalente : DISTINCT ON (t.transaction_id) avec un ORDER BY rate_date desc.",
          },
          {
            type: "callout",
            title: "Pourquoi LATERAL, précisément",
            text: "LATERAL autorise la sous-requête de droite à référencer une colonne de la ligne COURANTE de la table de gauche (ici, t.currency_code et t.transaction_at) — un JOIN ou une sous-requête classique ne le permet pas. C'est ce qui rend possible \"pour CETTE transaction précise, trouve le taux le plus récent avant SA date\", répété pour chaque ligne.",
          },
          {
            type: "sql_code",
            text: "-- Sans LATERAL, cette référence à t.currency_code serait invalide dans une sous-requête classique\n-- select t.*, (select rate_to_usd from fx_rates where currency_code = t.currency_code ...) -- fonctionne en fait pour une sous-requête corrélée scalaire simple,\n-- mais LATERAL devient indispensable dès qu'on a besoin de plusieurs colonnes ou de LIMIT/ORDER BY comme ici.",
          },
          {
            type: "sql_sandbox",
            prompt: "Convertis les 20 premières transactions du Kenya en USD via l'as-of join.",
            starterQuery:
              "select t.transaction_id, t.transaction_at, t.amount_local, t.currency_code,\n  fx.rate_to_usd, round(t.amount_local / fx.rate_to_usd, 2) as amount_usd\nfrom fact_transactions t\njoin lateral (\n  select rate_to_usd from fx_rates\n  where fx_rates.currency_code = t.currency_code and fx_rates.rate_date <= t.transaction_at::date\n  order by rate_date desc limit 1\n) fx on true\nwhere t.country_code = 'KE'\nlimit 20;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi un as-of join est-il nécessaire pour convertir un montant en devise ?",
          options: [
            "Ce n'est jamais nécessaire",
            "Le taux de change change chaque jour ; il faut le taux en vigueur à la date de la transaction",
            "PostgreSQL l'exige par défaut",
          ],
          correct_index: 1,
          explain: "Joindre au taux \"le plus récent\" plutôt qu'au taux historique fausse toutes les conversions passées.",
        },
        {
          question: "Qu'est-ce qu'un LATERAL JOIN permet, que ni un JOIN classique ni une sous-requête simple ne permettent ?",
          options: [
            "Référencer une colonne de la ligne courante de la table de gauche à l'intérieur de la sous-requête de droite",
            "Trier automatiquement le résultat final",
            "Éviter d'utiliser ORDER BY",
          ],
          correct_index: 0,
          explain: "C'est cette référence croisée qui rend possible \"le taux en vigueur à CETTE date précise, pour CETTE ligne\".",
        },
      ],
    },

    {
      number: "2.4.10",
      slug: "atelier-de-synthese-chapitre-2-4",
      title: "Atelier de synthèse du chapitre",
      parentSlug: "window-functions-sql-analytique",
      duration_minutes: 30,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Ce chapitre a couvert OVER()/PARTITION BY (2.4.1-2.4.2), les cadres de fenêtre (2.4.3), les fonctions de classement (2.4.4-2.4.5), les valeurs relatives et cumuls (2.4.6-2.4.7), la détection d'anomalies (2.4.8) et l'as-of join (2.4.9). Cet atelier combine plusieurs de ces techniques dans un seul livrable, proche de ce qu'un vrai tableau de bord AfriPay demanderait.",
          },
          {
            type: "checklist",
            title: "Tu es prêt·e pour le Chapitre 2.5 si tu peux répondre oui à chaque point",
            items: [
              "Je sais expliquer la différence entre GROUP BY et une window function à quelqu'un qui débute",
              "Je choisis correctement entre ROW_NUMBER, RANK et DENSE_RANK selon le traitement voulu des ex-æquo",
              "Je sais écrire un cumul progressif (running total) avec sum() over (order by ...)",
              "Je sais pourquoi une comparaison d'anomalie doit se faire par groupe (PARTITION BY), pas globalement",
              "Je comprends pourquoi LATERAL est nécessaire pour un as-of join",
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 1 — Top 3 des marchands par volume dans chaque pays (RANK ou ROW_NUMBER, ton choix).",
            starterQuery:
              "with classement as (\n  select m.merchant_name, t.country_code, sum(t.amount_local) as volume,\n    row_number() over (partition by t.country_code order by sum(t.amount_local) desc) as rang\n  from fact_transactions t\n  join dim_merchant m on m.merchant_id = t.merchant_id\n  group by m.merchant_name, t.country_code\n)\nselect * from classement where rang <= 3 order by country_code, rang;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 2 — Pour le pays 'CI', calcule le cumul mensuel du volume de transactions (running total).",
            starterQuery:
              "select date_trunc('month', transaction_at) as mois, sum(amount_local) as volume_mensuel,\n  sum(sum(amount_local)) over (order by date_trunc('month', transaction_at)) as cumul\nfrom fact_transactions\nwhere country_code = 'CI'\ngroup by 1\norder by 1;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 3 — Livrable final : les 20 premières transactions du Sénégal, converties en USD au bon taux historique via l'as-of join.",
            starterQuery:
              "select t.transaction_id, t.transaction_at, t.amount_local, t.currency_code,\n  fx.rate_to_usd, round(t.amount_local / fx.rate_to_usd, 2) as amount_usd\nfrom fact_transactions t\njoin lateral (\n  select rate_to_usd from fx_rates\n  where fx_rates.currency_code = t.currency_code and fx_rates.rate_date <= t.transaction_at::date\n  order by rate_date desc limit 1\n) fx on true\nwhere t.country_code = 'SN'\nlimit 20;",
          },
        ],
      },
      quiz: [
        {
          question: "Une window function, contrairement à GROUP BY :",
          options: [
            "Écrase les lignes en groupes",
            "Calcule un agrégat tout en gardant chaque ligne individuelle",
            "Ne fonctionne qu'avec ORDER BY",
          ],
          correct_index: 1,
          explain: "C'est la différence fondamentale — GROUP BY réduit le nombre de lignes, OVER() non.",
        },
        {
          question: "Quelle fonction renvoie la valeur de la ligne PRÉCÉDENTE dans une fenêtre ordonnée ?",
          options: ["LEAD", "LAG", "RANK"],
          correct_index: 1,
          explain: "LAG regarde en arrière, LEAD regarde en avant.",
        },
        {
          question: "Pour un running total (cumul progressif), quelle clause faut-il obligatoirement inclure dans OVER() ?",
          options: ["PARTITION BY seul suffit", "ORDER BY, qui définit le cadre cumulatif par défaut", "NTILE"],
          correct_index: 1,
          explain: "Sans ORDER BY, la fenêtre entière serait agrégée d'un coup, sans notion de progression.",
        },
      ],
    },

    // ============================================================
    // CHAPITRE 2.5 — SQL AVANCÉ
    // ============================================================
    {
      number: "2.5",
      slug: "sql-avance-pour-data-engineers",
      title: "SQL avancé pour Data Engineers",
      duration_minutes: 15,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Ce chapitre rassemble les compétences qui séparent \"je sais écrire des requêtes\" de \"je peux concevoir un système sur lequel d'autres s'appuient\" : contraintes, transactions, vues, récursivité, upsert et fuseaux horaires.",
          },
          {
            type: "checklist",
            title: "Les 10 leçons de ce chapitre",
            items: [
              "2.5.1 — DDL avancé : ALTER TABLE et contraintes en détail",
              "2.5.2 — Transactions et ACID",
              "2.5.3 — Vues (CREATE VIEW) : abstraction et sécurité",
              "2.5.4 — Vues matérialisées : figer un résultat coûteux",
              "2.5.5 — CTE récursive : concept et syntaxe de base",
              "2.5.6 — CTE récursive appliquée : la hiérarchie d'agents AfriPay",
              "2.5.7 — CTAS et tables temporaires",
              "2.5.8 — Construire du JSON en SQL : jsonb_build_object, jsonb_agg",
              "2.5.9 — UPSERT : INSERT ... ON CONFLICT en profondeur",
              "2.5.10 — Fuseaux horaires multi-pays et atelier de synthèse",
            ],
          },
        ],
      },
      quiz: [],
    },

    {
      number: "2.5.1",
      slug: "ddl-avance-alter-table-contraintes",
      title: "DDL avancé : ALTER TABLE et contraintes en détail",
      parentSlug: "sql-avance-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une contrainte n'est pas de la documentation — c'est une garantie appliquée par le moteur lui-même, à chaque insertion et mise à jour, sans exception possible.",
          },
          {
            type: "table",
            headers: ["Contrainte", "Garantit"],
            rows: [
              ["PRIMARY KEY", "Unicité + non-nullité — identifie une ligne de façon unique"],
              ["FOREIGN KEY", "La valeur référencée existe réellement dans la table pointée"],
              ["UNIQUE", "Aucune autre ligne n'a la même valeur (peut être NULL, contrairement à PK)"],
              ["NOT NULL", "La colonne ne peut jamais être vide"],
              ["CHECK", "Une condition arbitraire doit être vraie pour chaque ligne"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Contraintes déjà présentes dans le schéma AfriPay\n-- dim_agent.role a un CHECK : role in ('regional_manager','field_agent','sub_agent')\n-- fact_transactions.customer_id référence dim_customer(customer_id) — une FOREIGN KEY\n\n-- Ajouter une colonne avec une contrainte, sur une table existante\nalter table dim_merchant add column is_active boolean not null default true;\n\n-- Ajouter une contrainte CHECK après coup\nalter table dim_merchant add constraint chk_category\n  check (category in ('Alimentation', 'Transport', 'Santé', 'Éducation', 'Autre'));",
          },
          {
            type: "callout",
            title: "🪤 Ajouter NOT NULL sur une table qui contient déjà des données",
            text: "`alter table ... add column x not null` échoue si la table contient déjà des lignes, sauf si un DEFAULT est fourni pour remplir rétroactivement les lignes existantes. C'est pour ça que la ligne ci-dessus fonctionne : `default true` donne une valeur à toutes les lignes déjà présentes au moment de l'ALTER.",
          },
          {
            type: "sql_code",
            text: "-- Vérifier les contraintes existantes d'une table\nselect constraint_name, constraint_type\nfrom information_schema.table_constraints\nwhere table_name = 'fact_transactions';",
          },
          {
            type: "sql_sandbox",
            prompt: "Liste toutes les contraintes existantes sur dim_customer.",
            starterQuery:
              "select constraint_name, constraint_type\nfrom information_schema.table_constraints\nwhere table_name = 'dim_customer';",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle est la différence entre UNIQUE et PRIMARY KEY ?",
          options: [
            "Aucune différence",
            "UNIQUE peut accepter une valeur NULL, PRIMARY KEY jamais",
            "PRIMARY KEY ne s'applique qu'aux entiers",
          ],
          correct_index: 1,
          explain: "PRIMARY KEY combine unicité ET non-nullité — UNIQUE seul garantit uniquement l'unicité.",
        },
        {
          question: "Pourquoi `alter table ... add column x not null` peut-il échouer sur une table déjà remplie ?",
          options: [
            "Ce n'est jamais possible d'ajouter une colonne à une table remplie",
            "Sans DEFAULT, les lignes déjà existantes n'auraient aucune valeur pour cette nouvelle colonne obligatoire",
            "PostgreSQL limite le nombre de colonnes",
          ],
          correct_index: 1,
          explain: "Fournir un DEFAULT permet de remplir rétroactivement toutes les lignes existantes.",
        },
      ],
    },

    {
      number: "2.5.2",
      slug: "transactions-et-acid",
      title: "Transactions et ACID",
      parentSlug: "sql-avance-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "BEGIN ouvre une transaction, COMMIT la valide définitivement, ROLLBACK l'annule entièrement, comme si rien ne s'était produit. Sur un pipeline qui insère 5000 lignes, une transaction garantit qu'une erreur à la ligne 4999 n'en laisse pas 4998 orphelines en base.",
          },
          {
            type: "sql_code",
            text: "begin;\nupdate dim_merchant set is_active = false where merchant_id = 12;\ninsert into fx_rates (currency_code, rate_date, rate_to_usd) values ('XOF', current_date, 610.5);\n-- si une erreur survient à cette ligne, RIEN de ce qui précède dans la transaction n'est appliqué\ncommit;",
          },
          { type: "h3", text: "ACID : les quatre garanties" },
          {
            type: "table",
            headers: ["Garantie", "Signifie"],
            rows: [
              ["Atomicité", "Tout ou rien — une transaction ne s'applique jamais partiellement"],
              ["Cohérence", "La base passe d'un état valide à un autre état valide (les contraintes restent respectées)"],
              ["Isolation", "Une transaction en cours n'expose pas ses changements intermédiaires aux autres connexions"],
              ["Durabilité", "Une fois COMMIT confirmé, les données survivent même à une panne serveur immédiate"],
            ],
          },
          {
            type: "sql_code",
            text: "-- ROLLBACK explicite : annuler volontairement une transaction en cours\nbegin;\ndelete from fact_transactions where country_code = 'XX'; -- test, pas encore sûr\nrollback; -- annule tout, comme si le DELETE n'avait jamais eu lieu",
          },
          {
            type: "callout",
            title: "SAVEPOINT — un point de reprise partiel dans une transaction",
            text: "Une transaction longue peut définir des SAVEPOINT intermédiaires : `rollback to savepoint x` annule seulement ce qui suit ce point, sans annuler toute la transaction. Utile pour un batch qui traite plusieurs étapes indépendantes, où l'échec d'une étape ne doit pas obligatoirement annuler les précédentes.",
          },
          {
            type: "sql_sandbox",
            prompt: "Ouvre une transaction, modifie une donnée test, puis annule-la avec ROLLBACK — vérifie que rien n'a changé.",
            starterQuery:
              "begin;\nupdate dim_merchant set is_active = false where merchant_id = 1;\nselect merchant_id, is_active from dim_merchant where merchant_id = 1;\nrollback;",
          },
        ],
      },
      quiz: [
        {
          question: "Que garantit une transaction (BEGIN/COMMIT/ROLLBACK) sur un batch de 5000 insertions ?",
          options: [
            "Que ça va plus vite",
            "Qu'une erreur en cours de route n'en laisse pas une partie appliquée",
            "Rien de particulier",
          ],
          correct_index: 1,
          explain: "C'est l'atomicité : tout ou rien.",
        },
        {
          question: "Que garantit la \"durabilité\" (le D de ACID) ?",
          options: [
            "Que la requête s'exécute plus vite",
            "Qu'une fois COMMIT confirmé, les données survivent même à une panne serveur immédiate",
            "Que la base ne peut jamais planter",
          ],
          correct_index: 1,
          explain: "PostgreSQL écrit sur disque de façon durable avant de confirmer un COMMIT au client.",
        },
      ],
    },

    {
      number: "2.5.3",
      slug: "vues-create-view-abstraction-securite",
      title: "Vues (CREATE VIEW) : abstraction et sécurité",
      parentSlug: "sql-avance-pour-data-engineers",
      duration_minutes: 20,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une vue est une requête nommée et sauvegardée — chaque lecture réexécute la requête sous-jacente. Elle sert deux objectifs distincts : simplifier une requête complexe réutilisée souvent, et restreindre l'accès à des données sensibles.",
          },
          {
            type: "sql_code",
            text: "create view v_volume_par_pays as\nselect co.country_name, count(*) as nb_transactions, sum(t.amount_local) as volume\nfrom fact_transactions t\njoin dim_country co on co.country_code = t.country_code\ngroup by co.country_name;\n\n-- Interroger la vue comme une table normale\nselect * from v_volume_par_pays order by volume desc;",
          },
          {
            type: "callout",
            title: "Vues et sécurité : cacher des colonnes sensibles",
            text: "Une vue peut exposer uniquement un sous-ensemble de colonnes d'une table — un rôle avec accès uniquement à la vue (et pas à la table sous-jacente) ne peut jamais voir les colonnes exclues. C'est une façon simple de partager des données agrégées ou filtrées sans exposer le détail sensible.",
          },
          {
            type: "sql_code",
            text: "-- Une vue qui expose les clients sans leurs informations les plus sensibles\ncreate view v_clients_public as\nselect customer_id, country_code, segment, signup_date\nfrom dim_customer;\n-- full_name n'apparaît volontairement pas ici",
          },
          {
            type: "p",
            text: "CREATE OR REPLACE VIEW permet de modifier la définition d'une vue existante sans avoir à la supprimer d'abord — utile en migration progressive d'un schéma.",
          },
          {
            type: "sql_sandbox",
            prompt: "Crée une vue qui résume le nombre de marchands par pays et catégorie, puis interroge-la.",
            starterQuery:
              "create or replace view v_marchands_par_pays_categorie as\nselect country_code, category, count(*) as nb_marchands\nfrom dim_merchant\ngroup by country_code, category;\n\nselect * from v_marchands_par_pays_categorie order by nb_marchands desc;",
          },
        ],
      },
      quiz: [
        {
          question: "Une vue simple (CREATE VIEW, pas matérialisée) stocke-t-elle physiquement le résultat de sa requête ?",
          options: ["Oui, en permanence", "Non — elle réexécute la requête sous-jacente à chaque lecture", "Seulement le premier jour"],
          correct_index: 1,
          explain: "C'est ce qui la distingue d'une vue matérialisée (Leçon 2.5.4), qui elle stocke le résultat.",
        },
        {
          question: "Comment une vue peut-elle servir la sécurité des données ?",
          options: [
            "En chiffrant automatiquement les données",
            "En exposant uniquement certaines colonnes, cachant les colonnes sensibles à qui n'a accès qu'à la vue",
            "Une vue n'a aucun rapport avec la sécurité",
          ],
          correct_index: 1,
          explain: "Un rôle limité à la vue ne peut jamais accéder aux colonnes exclues de sa définition.",
        },
      ],
    },

    {
      number: "2.5.4",
      slug: "vues-materialisees-figer-resultat",
      title: "Vues matérialisées : figer un résultat coûteux",
      parentSlug: "sql-avance-pour-data-engineers",
      duration_minutes: 20,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une vue matérialisée exécute sa requête UNE FOIS et stocke physiquement le résultat sur disque — les lectures suivantes sont ensuite instantanées, jusqu'au prochain rafraîchissement explicite.",
          },
          {
            type: "sql_code",
            text: "-- Une vue matérialisée fige le résultat — à rafraîchir explicitement\ncreate materialized view mv_volume_par_pays as\nselect co.country_name, count(*) as nb_transactions, sum(t.amount_local) as volume\nfrom fact_transactions t\njoin dim_country co on co.country_code = t.country_code\ngroup by co.country_name;\n\n-- Lecture instantanée, sans recalcul\nselect * from mv_volume_par_pays order by volume desc;\n\n-- Rafraîchir après que de nouvelles transactions soient arrivées\nrefresh materialized view mv_volume_par_pays;",
          },
          {
            type: "callout",
            title: "Vue vs vue matérialisée — le bon choix dépend d'un seul arbitrage",
            text: "Une vue simple recalcule sa requête à chaque lecture — toujours à jour (fraîcheur maximale), mais potentiellement lente sur une requête coûteuse. Une vue matérialisée stocke le résultat — rapide à lire, mais périmée tant qu'on ne la rafraîchit pas explicitement. Le choix dépend uniquement de si la fraîcheur ou la vitesse de lecture compte le plus pour ce cas d'usage précis.",
          },
          {
            type: "sql_code",
            text: "-- REFRESH ... CONCURRENTLY : rafraîchit sans bloquer les lectures en cours (nécessite un index UNIQUE sur la vue)\ncreate unique index on mv_volume_par_pays (country_name);\nrefresh materialized view concurrently mv_volume_par_pays;",
          },
          {
            type: "thinking_prompt",
            text: "Un tableau de bord consulté 10 000 fois par jour, dont la donnée sous-jacente ne change qu'une fois par nuit, est le cas d'usage idéal d'une vue matérialisée rafraîchie une fois par jour — inutile de recalculer la même requête coûteuse à chaque clic.",
          },
          {
            type: "sql_sandbox",
            prompt: "Crée une vue matérialisée du volume total par marchand, puis interroge-la.",
            starterQuery:
              "create materialized view if not exists mv_volume_marchand as\nselect merchant_id, sum(amount_local) as volume, count(*) as nb_transactions\nfrom fact_transactions\ngroup by merchant_id;\n\nselect * from mv_volume_marchand order by volume desc limit 10;",
          },
        ],
      },
      quiz: [
        {
          question: "Qu'est-ce qui distingue une vue matérialisée d'une vue simple ?",
          options: [
            "Elle stocke physiquement le résultat, qui reste figé jusqu'au prochain REFRESH",
            "Elle ne peut contenir aucune jointure",
            "Elle se rafraîchit automatiquement à chaque écriture",
          ],
          correct_index: 0,
          explain: "C'est ce compromis fraîcheur/vitesse qui détermine le bon choix entre les deux.",
        },
        {
          question: "Que faut-il pour utiliser REFRESH MATERIALIZED VIEW CONCURRENTLY sans bloquer les lectures ?",
          options: ["Rien de particulier", "Un index UNIQUE sur la vue matérialisée", "Que la vue soit vide"],
          correct_index: 1,
          explain: "CONCURRENTLY a besoin d'un index unique pour comparer ancien et nouveau contenu ligne par ligne.",
        },
      ],
    },

    {
      number: "2.5.5",
      slug: "cte-recursive-concept-syntaxe",
      title: "CTE récursive : concept et syntaxe de base",
      parentSlug: "sql-avance-pour-data-engineers",
      duration_minutes: 30,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une CTE récursive (WITH RECURSIVE) se référence elle-même — le seul mécanisme SQL natif pour parcourir une profondeur inconnue à l'avance : une hiérarchie, un arbre, un graphe de dépendances.",
          },
          {
            type: "table",
            headers: ["Partie", "Rôle"],
            rows: [
              ["Terme d'ancrage (avant UNION ALL)", "Le point de départ — s'exécute une seule fois"],
              ["UNION ALL", "Combine chaque nouvelle \"couche\" trouvée avec les précédentes"],
              ["Terme récursif (après UNION ALL)", "Se référence lui-même — répété jusqu'à ce qu'aucune nouvelle ligne n'apparaisse"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Exemple minimal, sans lien avec AfriPay : compter de 1 à 5\nwith recursive compteur as (\n  select 1 as n              -- terme d'ancrage : le point de départ\n  union all\n  select n + 1 from compteur where n < 5   -- terme récursif : se référence lui-même\n)\nselect * from compteur;",
          },
          {
            type: "callout",
            title: "Comment la récursion s'arrête",
            text: "PostgreSQL répète le terme récursif jusqu'à ce qu'une itération ne produise PLUS AUCUNE nouvelle ligne. Dans l'exemple ci-dessus, la condition `where n < 5` finit par n'avoir aucune ligne qui la satisfait — la récursion s'arrête d'elle-même. Sans condition d'arrêt correcte, une CTE récursive peut boucler indéfiniment (PostgreSQL a une limite de sécurité, mais mieux vaut ne jamais compter dessus).",
          },
          {
            type: "sql_code",
            text: "-- ⚠ Dangereux : aucune condition d'arrêt naturelle — évite ce pattern\n-- with recursive infini as (\n--   select 1 as n union all select n + 1 from infini\n-- ) select * from infini;",
          },
          {
            type: "sql_sandbox",
            prompt: "Génère la table de multiplication de 7, de 7×1 à 7×10, avec une CTE récursive.",
            starterQuery:
              "with recursive table_7 as (\n  select 1 as multiplicateur, 7 as resultat\n  union all\n  select multiplicateur + 1, (multiplicateur + 1) * 7\n  from table_7\n  where multiplicateur < 10\n)\nselect * from table_7;",
          },
        ],
      },
      quiz: [
        {
          question: "Quel type de structure de données une CTE récursive est-elle spécifiquement conçue pour parcourir ?",
          options: [
            "Une simple liste plate de valeurs",
            "Une profondeur inconnue à l'avance — hiérarchie, arbre, graphe de dépendances",
            "Uniquement des dates",
          ],
          correct_index: 1,
          explain: "C'est le seul mécanisme SQL natif capable de parcourir un nombre de niveaux non fixé d'avance.",
        },
        {
          question: "Comment une CTE récursive s'arrête-t-elle normalement ?",
          options: [
            "Après exactement 10 itérations toujours",
            "Quand une itération du terme récursif ne produit plus aucune nouvelle ligne",
            "Elle ne s'arrête jamais automatiquement",
          ],
          correct_index: 1,
          explain: "D'où l'importance d'une condition d'arrêt correcte dans le terme récursif (ex. WHERE n < 5).",
        },
      ],
    },

    {
      number: "2.5.6",
      slug: "cte-recursive-hierarchie-agents-afripay",
      title: "CTE récursive appliquée : la hiérarchie d'agents AfriPay",
      parentSlug: "sql-avance-pour-data-engineers",
      duration_minutes: 30,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "dim_agent modélise le réseau d'agents mobile money : des responsables régionaux, qui supervisent des agents de terrain, qui recrutent parfois des sous-agents. C'est une hiérarchie à profondeur variable — exactement le cas d'usage réel d'une CTE récursive, là où le SELF JOIN du Chapitre 2.3 ne remontait qu'un seul niveau.",
          },
          {
            type: "sql_code",
            text: "-- Tous les agents sous le responsable régional de Côte d'Ivoire, avec leur profondeur dans la hiérarchie\nwith recursive hierarchie as (\n  select agent_id, agent_name, manager_id, role, 1 as profondeur\n  from dim_agent\n  where role = 'regional_manager' and country_code = 'CI'\n\n  union all\n\n  select a.agent_id, a.agent_name, a.manager_id, a.role, h.profondeur + 1\n  from dim_agent a\n  join hierarchie h on a.manager_id = h.agent_id\n)\nselect * from hierarchie order by profondeur, agent_name;",
          },
          {
            type: "callout",
            title: "Comment lire cette requête pas à pas",
            text: "Le terme d'ancrage sélectionne le sommet (le responsable régional) avec profondeur = 1. Le terme récursif rejoint dim_agent à la CTE elle-même (hierarchie h) sur `a.manager_id = h.agent_id` : à chaque itération, il trouve les agents dont le manager vient d'être ajouté à la couche précédente, et incrémente la profondeur. La récursion s'arrête quand plus aucun agent n'a un manager dans la dernière couche trouvée.",
          },
          {
            type: "sql_code",
            text: "-- Variante utile : le chemin complet depuis la racine, construit au fil de la récursion\nwith recursive hierarchie as (\n  select agent_id, agent_name, manager_id, 1 as profondeur, agent_name::text as chemin\n  from dim_agent\n  where role = 'regional_manager' and country_code = 'KE'\n\n  union all\n\n  select a.agent_id, a.agent_name, a.manager_id, h.profondeur + 1,\n    h.chemin || ' > ' || a.agent_name\n  from dim_agent a\n  join hierarchie h on a.manager_id = h.agent_id\n)\nselect agent_name, profondeur, chemin from hierarchie order by profondeur, agent_name;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Trouve tous les agents sous le responsable régional du Kenya, avec leur profondeur.",
            starterQuery:
              "with recursive hierarchie as (\n  select agent_id, agent_name, manager_id, role, 1 as profondeur\n  from dim_agent where role = 'regional_manager' and country_code = 'KE'\n  union all\n  select a.agent_id, a.agent_name, a.manager_id, a.role, h.profondeur + 1\n  from dim_agent a join hierarchie h on a.manager_id = h.agent_id\n)\nselect * from hierarchie order by profondeur, agent_name;",
          },
        ],
      },
      quiz: [
        {
          question: "Une CTE récursive est adaptée pour modéliser :",
          options: ["Une liste plate de clients", "Une hiérarchie (managers, sous-agents...)", "Un taux de change"],
          correct_index: 1,
          explain: "C'est exactement le cas de dim_agent : manager_id qui référence agent_id de la même table.",
        },
        {
          question: "Pourquoi une CTE récursive est-elle nécessaire ici plutôt qu'un simple SELF JOIN (Chapitre 2.3) ?",
          options: [
            "Le SELF JOIN ne remonte qu'un seul niveau ; la hiérarchie AfriPay a une profondeur variable",
            "Le SELF JOIN n'existe pas en PostgreSQL",
            "Aucune raison, les deux sont strictement équivalents",
          ],
          correct_index: 0,
          explain: "Un self join simple ne peut pas parcourir un nombre inconnu de niveaux hiérarchiques.",
        },
      ],
    },

    {
      number: "2.5.7",
      slug: "ctas-tables-temporaires",
      title: "CTAS et tables temporaires",
      parentSlug: "sql-avance-pour-data-engineers",
      duration_minutes: 20,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "CREATE TABLE AS SELECT (CTAS) matérialise un résultat de requête en une VRAIE table, indépendante — contrairement à une vue, elle ne se recalcule jamais toute seule et peut être indexée, modifiée, ou droppée comme n'importe quelle table.",
          },
          {
            type: "sql_code",
            text: "-- CTAS — matérialise un résultat en vraie table, figée à cet instant\ncreate table stg_volume_2024 as\nselect country_code, sum(amount_local) as volume\nfrom fact_transactions\nwhere extract(year from transaction_at) = 2024\ngroup by country_code;\n\nselect * from stg_volume_2024;",
          },
          {
            type: "callout",
            title: "CTAS vs vue matérialisée : quand utiliser laquelle",
            text: "Les deux figent un résultat, mais une vue matérialisée reste liée conceptuellement à sa requête d'origine (REFRESH la recalcule), alors qu'une table issue de CTAS est complètement indépendante — c'est un instantané ponctuel, souvent utilisé pour une étape intermédiaire d'un pipeline (staging), pas pour un tableau de bord qu'on rafraîchit régulièrement.",
          },
          { type: "h3", text: "Tables temporaires" },
          {
            type: "sql_code",
            text: "-- TEMP TABLE : existe seulement pour la durée de la session, disparaît automatiquement ensuite\ncreate temp table calcul_intermediaire as\nselect customer_id, sum(amount_local) as total\nfrom fact_transactions\ngroup by customer_id;\n\n-- Utilisable normalement pendant la session\nselect * from calcul_intermediaire where total > 500;",
          },
          {
            type: "p",
            text: "Une table temporaire est utile pour un calcul intermédiaire complexe qu'on veut réutiliser plusieurs fois dans un script, sans polluer le schéma permanent de la base — elle se nettoie automatiquement à la fin de la session.",
          },
          {
            type: "sql_sandbox",
            prompt: "Crée une table temporaire des marchands actifs, puis interroge-la.",
            starterQuery:
              "create temp table if not exists tmp_marchands_actifs as\nselect merchant_id, merchant_name, category\nfrom dim_merchant;\n\nselect category, count(*) from tmp_marchands_actifs group by category;",
          },
        ],
      },
      quiz: [
        {
          question: "Que produit CREATE TABLE AS SELECT (CTAS), contrairement à une vue ?",
          options: [
            "Une vraie table indépendante, figée à l'instant de la création",
            "Une requête recalculée à chaque lecture",
            "Rien de différent d'une vue simple",
          ],
          correct_index: 0,
          explain: "Une table CTAS ne se recalcule jamais toute seule — c'est un instantané ponctuel.",
        },
        {
          question: "Quand une table temporaire (TEMP TABLE) disparaît-elle ?",
          options: ["Jamais automatiquement", "À la fin de la session courante", "Après exactement 24 heures"],
          correct_index: 1,
          explain: "Elle est automatiquement nettoyée en fin de session — utile pour du calcul intermédiaire sans polluer le schéma permanent.",
        },
      ],
    },

    {
      number: "2.5.8",
      slug: "construire-json-jsonb-build-agg",
      title: "Construire du JSON en SQL : jsonb_build_object, jsonb_agg",
      parentSlug: "sql-avance-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Le Chapitre 2.2 a couvert l'EXTRACTION de JSON existant (->>, ->). Ici, l'opération inverse : CONSTRUIRE du JSON à partir de colonnes SQL classiques — utile pour préparer une réponse d'API ou exporter un document structuré depuis une table relationnelle.",
          },
          {
            type: "sql_code",
            text: "-- Construire un objet JSON à partir de colonnes\nselect jsonb_build_object(\n  'transaction_id', transaction_id,\n  'montant', amount_local,\n  'devise', currency_code,\n  'canal', channel\n) as transaction_json\nfrom fact_transactions\nlimit 5;",
          },
          {
            type: "sql_code",
            text: "-- jsonb_agg : regrouper plusieurs lignes en un seul tableau JSON\nselect m.merchant_name,\n  jsonb_agg(jsonb_build_object('transaction_id', t.transaction_id, 'montant', t.amount_local)) as transactions\nfrom dim_merchant m\njoin fact_transactions t on t.merchant_id = m.merchant_id\ngroup by m.merchant_name\nlimit 5;",
          },
          {
            type: "callout",
            title: "Cas d'usage réel : préparer une réponse d'API directement en SQL",
            text: "Une route API qui doit renvoyer \"chaque marchand avec la liste de ses transactions\" peut construire ce JSON directement en base avec jsonb_agg, plutôt que de récupérer des lignes plates et les réassembler ensuite côté application — moins de code, et souvent plus rapide qu'un assemblage manuel en dehors de la base.",
          },
          {
            type: "sql_code",
            text: "-- Combiner build_object et agg : un objet complet par groupe\nselect co.country_name,\n  jsonb_build_object(\n    'nb_transactions', count(*),\n    'volume_total', sum(t.amount_local)\n  ) as resume\nfrom fact_transactions t\njoin dim_country co on co.country_code = t.country_code\ngroup by co.country_name;",
          },
          {
            type: "sql_sandbox",
            prompt: "Construis un objet JSON récapitulatif (nb transactions, volume) par canal de paiement.",
            starterQuery:
              "select channel, jsonb_build_object('nb', count(*), 'volume', sum(amount_local)) as resume\nfrom fact_transactions\ngroup by channel;",
          },
        ],
      },
      quiz: [
        {
          question: "Que fait jsonb_build_object('a', valeur_a, 'b', valeur_b) ?",
          options: [
            "Il extrait un champ JSON existant",
            "Il construit un nouvel objet JSON à partir de colonnes ou valeurs SQL",
            "Il valide un schéma JSON",
          ],
          correct_index: 1,
          explain: "C'est l'opération inverse de ->/->> : construire du JSON plutôt que l'extraire.",
        },
        {
          question: "Quel est l'intérêt de jsonb_agg combiné à un GROUP BY ?",
          options: [
            "Il trie les résultats",
            "Il regroupe plusieurs lignes d'un même groupe en un seul tableau JSON",
            "Il supprime les doublons automatiquement",
          ],
          correct_index: 1,
          explain: "Utile pour préparer une structure imbriquée (ex. un marchand avec la liste de ses transactions) directement en SQL.",
        },
      ],
    },

    {
      number: "2.5.9",
      slug: "upsert-insert-on-conflict-approfondi",
      title: "UPSERT : INSERT ... ON CONFLICT en profondeur",
      parentSlug: "sql-avance-pour-data-engineers",
      duration_minutes: 25,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un upsert (\"update\" + \"insert\") insère une ligne, ou la met à jour si elle existe déjà selon une clé donnée — sans jamais avoir besoin de vérifier manuellement au préalable si la ligne existe.",
          },
          {
            type: "sql_code",
            text: "-- Insère, ou met à jour si le taux du jour existe déjà (rejouable sans dupliquer)\ninsert into fx_rates (currency_code, rate_date, rate_to_usd)\nvalues ('XOF', current_date, 610.5)\non conflict (currency_code, rate_date)\ndo update set rate_to_usd = excluded.rate_to_usd;",
          },
          {
            type: "callout",
            title: "Le mot-clé EXCLUDED",
            text: "Dans la clause DO UPDATE, `excluded` fait référence à la ligne qu'on essayait d'insérer (celle qui a causé le conflit) — pas à la ligne déjà en base. `set rate_to_usd = excluded.rate_to_usd` signifie donc \"remplace l'ancienne valeur par la nouvelle qu'on vient de proposer\".",
          },
          {
            type: "sql_code",
            text: "-- ON CONFLICT DO NOTHING : ignorer silencieusement les doublons, sans mise à jour\ninsert into fx_rates (currency_code, rate_date, rate_to_usd)\nvalues ('KES', current_date, 129.4)\non conflict (currency_code, rate_date) do nothing;",
          },
          {
            type: "p",
            text: "ON CONFLICT nécessite une contrainte UNIQUE ou PRIMARY KEY existante sur les colonnes indiquées — c'est cette contrainte qui définit ce qu'est \"un conflit\". Sans elle, PostgreSQL refuse la clause ON CONFLICT.",
          },
          {
            type: "sql_code",
            text: "-- ON CONFLICT peut aussi mettre à jour plusieurs colonnes, et référencer l'ancienne valeur\ninsert into dim_merchant (merchant_id, merchant_name, category, country_code, onboarded_date)\nvalues (1, 'Marché Central', 'Alimentation', 'CI', '2023-01-01')\non conflict (merchant_id) do update\n  set merchant_name = excluded.merchant_name,\n      category = excluded.category;",
          },
          {
            type: "sql_sandbox",
            prompt: "Simule un upsert : insère un taux de change pour aujourd'hui, en mettant à jour s'il existe déjà.",
            starterQuery:
              "insert into fx_rates (currency_code, rate_date, rate_to_usd)\nvalues ('MAD', current_date, 10.1)\non conflict (currency_code, rate_date)\ndo update set rate_to_usd = excluded.rate_to_usd\nreturning *;",
          },
        ],
      },
      quiz: [
        {
          question: "INSERT ... ON CONFLICT DO UPDATE sert principalement à :",
          options: [
            "Accélérer les insertions",
            "Rendre un script d'insertion rejouable sans dupliquer les données",
            "Supprimer des lignes",
          ],
          correct_index: 1,
          explain: "C'est le mécanisme SQL de l'upsert — la base d'un chargement idempotent.",
        },
        {
          question: "Dans `on conflict (...) do update set col = excluded.col`, que représente `excluded` ?",
          options: [
            "La ligne déjà présente en base avant le conflit",
            "La nouvelle ligne qu'on essayait d'insérer, à l'origine du conflit",
            "Une table système vide",
          ],
          correct_index: 1,
          explain: "excluded contient les valeurs proposées par l'INSERT qui a déclenché le conflit.",
        },
        {
          question: "Que faut-il obligatoirement pour utiliser ON CONFLICT (colonne) ?",
          options: [
            "Rien de particulier",
            "Une contrainte UNIQUE ou PRIMARY KEY existante sur cette colonne",
            "Que la table soit vide",
          ],
          correct_index: 1,
          explain: "C'est cette contrainte qui définit précisément ce que le moteur considère comme \"un conflit\".",
        },
      ],
    },

    {
      number: "2.5.10",
      slug: "fuseaux-horaires-multi-pays-atelier-synthese",
      title: "Fuseaux horaires multi-pays et atelier de synthèse",
      parentSlug: "sql-avance-pour-data-engineers",
      duration_minutes: 30,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "fact_transactions.transaction_at est un timestamptz — un instant absolu, indépendant du fuseau. Mais \"le jour de la transaction\" dépend d'où l'on se trouve : 23h50 à Nairobi (UTC+3) et 23h50 à Rabat (UTC+1) ne tombent pas nécessairement le même jour une fois converti en UTC.",
          },
          {
            type: "sql_code",
            text: "-- L'heure locale réelle de chaque transaction, selon le fuseau de son pays\nselect t.transaction_id, t.transaction_at,\n  t.transaction_at at time zone c.timezone as heure_locale,\n  (t.transaction_at at time zone c.timezone)::date as jour_local\nfrom fact_transactions t\njoin dim_country c on c.country_code = t.country_code\nlimit 10;",
          },
          {
            type: "callout",
            title: "🪤 Pourquoi \"le jour de la transaction\" est ambigu sans préciser le fuseau",
            text: "Une transaction à 23h50 heure de Nairobi (UTC+3) correspond à 20h50 en UTC — encore le même jour calendaire en UTC. Mais une transaction à 23h50 heure du Cap-Vert (UTC-1, hypothétique) correspondrait déjà au lendemain en UTC. Sur un système multi-pays, agréger \"par jour\" sans convertir dans le bon fuseau local peut regrouper incorrectement des transactions dans la mauvaise journée business.",
          },
          {
            type: "sql_code",
            text: "-- Agrégation quotidienne CORRECTE : le jour est calculé dans le fuseau LOCAL du pays, pas en UTC\nselect co.country_name,\n  (t.transaction_at at time zone co.timezone)::date as jour_local,\n  sum(t.amount_local) as volume\nfrom fact_transactions t\njoin dim_country co on co.country_code = t.country_code\ngroup by co.country_name, jour_local\norder by co.country_name, jour_local;",
          },
          { type: "h3", text: "Atelier de synthèse — tout le chapitre en une session" },
          {
            type: "checklist",
            title: "Tu es prêt·e pour le Chapitre 2.6 si tu peux répondre oui à chaque point",
            items: [
              "Je sais ajouter une contrainte CHECK ou NOT NULL sur une table existante, avec un DEFAULT si besoin",
              "Je sais quand utiliser une transaction explicite (BEGIN/COMMIT/ROLLBACK)",
              "Je sais choisir entre vue, vue matérialisée, et table CTAS selon fraîcheur vs vitesse",
              "Je sais écrire une CTE récursive pour une hiérarchie à profondeur variable",
              "Je sais rendre un script d'insertion idempotent avec ON CONFLICT",
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Livrable — calcule le volume quotidien de transactions pour le Kenya, en agrégeant par jour LOCAL (pas UTC).",
            starterQuery:
              "select (t.transaction_at at time zone co.timezone)::date as jour_local,\n  count(*) as nb_transactions, sum(t.amount_local) as volume\nfrom fact_transactions t\njoin dim_country co on co.country_code = t.country_code\nwhere co.country_code = 'KE'\ngroup by jour_local\norder by jour_local;",
          },
        ],
      },
      quiz: [
        {
          question: "Que fait `transaction_at at time zone c.timezone` ?",
          options: [
            "Rien, c'est une erreur de syntaxe",
            "Convertit un instant absolu en heure locale du fuseau donné",
            "Supprime le fuseau horaire définitivement",
          ],
          correct_index: 1,
          explain: "AT TIME ZONE convertit un timestamptz en l'heure murale locale de la zone indiquée.",
        },
        {
          question: "Pourquoi agréger \"par jour\" en UTC peut-il être incorrect sur un système multi-pays ?",
          options: [
            "Ce n'est jamais incorrect",
            "Le jour calendaire local peut différer du jour en UTC selon le fuseau, décalant certaines transactions vers le mauvais jour business",
            "UTC n'existe pas dans PostgreSQL",
          ],
          correct_index: 1,
          explain: "Il faut convertir dans le fuseau LOCAL du pays avant de tronquer en jour, pas agréger directement sur l'instant UTC.",
        },
      ],
    },

    // ============================================================
    // CHAPITRE 2.6 — MODÉLISATION DE DONNÉES ⭐
    // ============================================================
    {
      number: "2.6",
      slug: "modelisation-de-donnees",
      title: "⭐ Modélisation de données",
      duration_minutes: 15,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "C'est le cœur de ce module, et probablement la compétence la plus rentable de tout le bootcamp en entretien d'embauche. N'importe qui peut apprendre la syntaxe SQL en une semaine ; savoir concevoir le bon schéma pour le bon problème, c'est ce qui distingue un data engineer confirmé.",
          },
          {
            type: "checklist",
            title: "Les 10 leçons de ce chapitre",
            items: [
              "2.6.1 — Pourquoi modéliser : du problème métier aux tables",
              "2.6.2 — MCD et MLD : entités, relations, cardinalités",
              "2.6.3 — Normalisation 1NF → 3NF",
              "2.6.4 — Dénormalisation raisonnée : OLTP vs analytique",
              "2.6.5 — Modélisation dimensionnelle (Kimball) : la fact table et ses types",
              "2.6.6 — Dimensions et dimensions conformées",
              "2.6.7 — Star Schema vs Snowflake vs One Big Table (OBT)",
              "2.6.8 — Le grain et les clés de substitution (surrogate keys)",
              "2.6.9 — Slowly Changing Dimensions (SCD) : types 0, 1, 2, 3, 6",
              "2.6.10 — Atelier de synthèse : modéliser et vérifier le grain d'AfriPay",
            ],
          },
        ],
      },
      quiz: [],
    },

    {
      number: "2.6.1",
      slug: "pourquoi-modeliser-probleme-metier-tables",
      title: "Pourquoi modéliser : du problème métier aux tables",
      parentSlug: "modelisation-de-donnees",
      duration_minutes: 25,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Modéliser, c'est traduire une question métier — « quel est le revenu d'AfriPay par pays et par mois ? » — en une structure de tables qui rend cette question facile, rapide et fiable à répondre. Pas juste possible : n'importe quel schéma mal pensé permet techniquement de répondre à presque tout, au prix de requêtes fragiles et lentes.",
          },
          {
            type: "callout",
            title: "Un mauvais modèle ne se voit pas tout de suite",
            text: "Un schéma mal pensé fonctionne parfaitement en développement, avec 5 000 lignes de test. Le problème apparaît en production, six mois plus tard, quand une requête censée prendre 200ms en prend 8 secondes parce que le modèle sous-jacent n'a jamais été pensé pour ce type de question. Modéliser, c'est anticiper l'usage réel, pas juste stocker ce qu'on a sous la main.",
          },
          {
            type: "p",
            text: "Deux questions à se poser avant de dessiner la moindre table : \"quelles questions métier ce système doit-il répondre, aujourd'hui ET dans six mois ?\" et \"à quelle fréquence et quel volume ces questions seront-elles posées ?\". Les réponses déterminent si un modèle 3NF classique suffit, ou si un entrepôt analytique dédié devient nécessaire — c'est tout l'objet de ce chapitre.",
          },
          {
            type: "table",
            headers: ["Question métier AfriPay", "Ce qu'elle exige du modèle"],
            rows: [
              ["Quel est le solde d'un compte MAINTENANT ?", "Un système OLTP à jour à la seconde près, cohérence stricte"],
              ["Quel a été le revenu mensuel par pays sur 2 ans ?", "Un entrepôt analytique optimisé pour scanner de gros volumes vite"],
              ["Qui était le manager de cet agent il y a 6 mois ?", "Une dimension avec historique (SCD Type 2, Leçon 2.6.9)"],
            ],
          },
          {
            type: "thinking_prompt",
            text: "Le reste de ce chapitre n'est pas une liste de techniques déconnectées — chacune répond à une des questions ci-dessus. Garde-les en tête : elles justifient chaque concept qui suit.",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi un mauvais modèle de données ne se révèle-t-il souvent pas immédiatement ?",
          options: [
            "Parce que PostgreSQL corrige les erreurs de modélisation automatiquement",
            "Parce qu'il fonctionne bien sur un petit volume de test, et ne montre ses limites qu'à l'échelle réelle",
            "Un mauvais modèle provoque toujours une erreur immédiate",
          ],
          correct_index: 1,
          explain: "C'est justement pour ça que la modélisation doit anticiper l'usage réel, pas seulement le cas de test.",
        },
        {
          question: "Modéliser des données consiste avant tout à :",
          options: [
            "Créer le plus de tables possible",
            "Traduire des questions métier en une structure qui les rend rapides et fiables à répondre",
            "Suivre une checklist technique sans lien avec l'usage",
          ],
          correct_index: 1,
          explain: "Le bon modèle dépend toujours des questions posées et de leur fréquence — jamais d'une règle universelle.",
        },
      ],
    },

    {
      number: "2.6.2",
      slug: "mcd-mld-entites-relations-cardinalites",
      title: "MCD et MLD : entités, relations, cardinalités",
      parentSlug: "modelisation-de-donnees",
      duration_minutes: 25,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Avant d'écrire le moindre CREATE TABLE, un modèle se pense à deux niveaux d'abstraction croissants : le conceptuel (MCD), puis le logique (MLD).",
          },
          {
            type: "table",
            headers: ["Niveau", "Répond à", "Exemple AfriPay"],
            rows: [
              ["MCD (conceptuel)", "Quelles sont les entités du métier, et comment se relient-elles ?", "Client, Marchand, Transaction, Pays — sans se soucier du type de base de données"],
              ["MLD (logique)", "Comment ces entités deviennent-elles des tables, colonnes, clés ?", "dim_customer, dim_merchant, fact_transactions, dim_country — indépendant du moteur SQL précis"],
              ["Physique", "Comment ça s'implémente réellement dans CE moteur ?", "Les CREATE TABLE PostgreSQL exacts, avec types et index"],
            ],
          },
          { type: "h3", text: "Cardinalités — le vocabulaire des relations" },
          {
            type: "table",
            headers: ["Cardinalité", "Signifie", "Exemple AfriPay"],
            rows: [
              ["1:1", "Une entité A correspond à exactement une entité B", "Un client, un profil de vérification KYC (hypothétique)"],
              ["1:N", "Une entité A peut correspondre à plusieurs entités B", "Un client (1), plusieurs transactions (N)"],
              ["N:N", "Plusieurs entités A correspondent à plusieurs entités B", "Marchands ↔ Clients — nécessite une table de liaison (ici, fact_transactions elle-même joue ce rôle)"],
            ],
          },
          {
            type: "callout",
            title: "Pourquoi une relation N:N a toujours besoin d'une table intermédiaire",
            text: "Une relation N:N ne peut pas se stocker directement avec une simple clé étrangère d'un côté — il faudrait une colonne qui contienne plusieurs valeurs, ce qui violerait la 1NF (Leçon 2.6.3). fact_transactions résout implicitement le N:N entre clients et marchands : chaque ligne associe UN client à UN marchand, et la relation N:N émerge de l'ensemble des lignes.",
          },
          {
            type: "sql_sandbox",
            prompt: "Vérifie la cardinalité réelle client ↔ transaction : un client peut-il avoir plusieurs transactions ?",
            starterQuery:
              "select customer_id, count(*) as nb_transactions\nfrom fact_transactions\ngroup by customer_id\norder by nb_transactions desc\nlimit 10;",
          },
        ],
      },
      quiz: [
        {
          question: "Que représente le MCD (modèle conceptuel de données) ?",
          options: [
            "Les tables SQL exactes avec leurs types",
            "Les entités du métier et leurs relations, indépendamment de toute base de données",
            "Le plan d'exécution d'une requête",
          ],
          correct_index: 1,
          explain: "Le MCD reste au niveau du métier — sa traduction en tables vient ensuite, au niveau MLD.",
        },
        {
          question: "Pourquoi une relation N:N ne peut-elle pas se modéliser avec une simple clé étrangère d'un seul côté ?",
          options: [
            "Ce serait au contraire la bonne approche",
            "Il faudrait qu'une colonne contienne plusieurs valeurs à la fois, ce qui violerait la 1NF",
            "SQL ne supporte pas les relations N:N du tout",
          ],
          correct_index: 1,
          explain: "Une table intermédiaire (ou une fact table qui joue ce rôle) est nécessaire pour respecter l'atomicité des colonnes.",
        },
      ],
    },

    {
      number: "2.6.3",
      slug: "normalisation-1nf-2nf-3nf",
      title: "Normalisation 1NF → 3NF",
      parentSlug: "modelisation-de-donnees",
      duration_minutes: 30,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Normaliser un schéma, c'est éliminer la redondance et les incohérences potentielles, forme par forme. Chaque niveau ajoute une garantie supplémentaire sur la structure des données.",
          },
          {
            type: "table",
            headers: ["Forme normale", "Règle", "Exemple AfriPay"],
            rows: [
              ["1NF", "Chaque cellule contient une seule valeur atomique", "Pas de liste de canaux dans une seule colonne — channel_metadata reste un objet JSON structuré, pas une liste de valeurs mélangées dans du texte"],
              ["2NF", "Chaque colonne dépend de la clé primaire ENTIÈRE (s'applique aux clés composées)", "merchant_name ne doit pas être répété dans fact_transactions — il dépend de merchant_id, pas de transaction_id"],
              ["3NF", "Aucune colonne ne dépend d'une autre colonne non-clé", "country_name doit vivre dans dim_country, pas être dupliqué partout où country_code apparaît"],
            ],
          },
          {
            type: "callout",
            title: "🪤 Ce qui casse si country_name était dupliqué dans fact_transactions",
            text: "Si country_name était stocké directement dans fact_transactions (plutôt que juste country_code, avec une jointure vers dim_country), renommer un pays demanderait de mettre à jour des milliers de lignes. Pire : un bug pourrait laisser deux orthographes différentes du même pays coexister — une anomalie de mise à jour, exactement ce que la 3NF empêche structurellement.",
          },
          {
            type: "sql_code",
            text: "-- Le schéma AfriPay respecte déjà la 3NF pour ses tables OLTP-like\n-- country_name vit UNIQUEMENT dans dim_country\nselect country_code, country_name from dim_country;\n\n-- fact_transactions ne stocke QUE le code, jamais le nom complet\nselect country_code from fact_transactions limit 1;",
          },
          {
            type: "sql_sandbox",
            prompt: "Vérifie qu'aucune information de pays n'est dupliquée directement dans fact_transactions (colonnes disponibles).",
            starterQuery:
              "select column_name from information_schema.columns\nwhere table_name = 'fact_transactions'\norder by ordinal_position;",
          },
        ],
      },
      quiz: [
        {
          question: "La 1NF exige que :",
          options: [
            "Chaque cellule contienne une seule valeur atomique",
            "Chaque table ait exactement 5 colonnes",
            "Aucune table ne dépasse 1000 lignes",
          ],
          correct_index: 0,
          explain: "C'est la forme normale de base — pas de listes ou de valeurs composites dans une seule cellule.",
        },
        {
          question: "Que garantit la 3NF concrètement pour country_name dans AfriPay ?",
          options: [
            "Rien de particulier",
            "country_name vit uniquement dans dim_country, jamais dupliqué ailleurs — évitant les anomalies de mise à jour",
            "country_name doit être stocké dans chaque table qui en a besoin",
          ],
          correct_index: 1,
          explain: "Dupliquer country_name créerait un risque d'incohérence si le nom devait un jour être corrigé.",
        },
      ],
    },

    {
      number: "2.6.4",
      slug: "denormalisation-raisonnee-oltp-vs-analytique",
      title: "Dénormalisation raisonnée : OLTP vs analytique",
      parentSlug: "modelisation-de-donnees",
      duration_minutes: 25,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "La normalisation n'est pas une fin en soi — c'est un compromis. Un système transactionnel (OLTP) vise la 3NF : zéro redondance, cohérence garantie à chaque écriture. Un entrepôt analytique dénormalise volontairement, parce que la vitesse de LECTURE compte plus que l'absence totale de redondance.",
          },
          {
            type: "table",
            headers: ["", "OLTP (transactionnel)", "Analytique (entrepôt)"],
            rows: [
              ["Objectif principal", "Écritures fréquentes, cohérence stricte", "Lectures massives, agrégations rapides"],
              ["Niveau de normalisation typique", "3NF", "Dénormalisé (star schema, Leçon 2.6.7)"],
              ["Exemple AfriPay", "L'application mobile qui enregistre une transaction", "Le tableau de bord qui agrège le revenu par pays et par mois"],
            ],
          },
          {
            type: "callout",
            title: "Pourquoi dénormaliser accélère vraiment les lectures analytiques",
            text: "Une requête analytique qui doit joindre 6 tables normalisées pour reconstituer \"le nom du pays, le nom du marchand, la catégorie\" à chaque ligne coûte plus cher qu'une requête sur une seule table qui contient déjà ces informations dupliquées. Le prix payé : plus d'espace disque, et une donnée dupliquée à maintenir cohérente lors des mises à jour — un compromis acceptable pour un entrepôt où les écritures sont rares (chargement par lot) et les lectures fréquentes.",
          },
          {
            type: "p",
            text: "AfriPay illustre les deux mondes : dim_customer/dim_merchant/dim_country restent relativement normalisées (chacune sa responsabilité), mais fact_transactions dénormalise déjà en stockant channel_metadata en JSONB plutôt que dans une table séparée — un choix pragmatique pour un attribut rarement interrogé seul.",
          },
          {
            type: "thinking_prompt",
            text: "Est-ce que je modélise pour la robustesse transactionnelle (3NF, zéro redondance) ou pour la vitesse analytique (star schema, redondance assumée) ? Les deux réponses ne produisent jamais les mêmes tables — et confondre les deux objectifs est l'erreur de modélisation la plus fréquente chez les débutants.",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi un entrepôt analytique dénormalise-t-il volontairement ses données ?",
          options: [
            "Par erreur de conception",
            "Parce que la vitesse de lecture prime sur l'absence totale de redondance, dans un contexte de lectures fréquentes et d'écritures rares",
            "Parce que PostgreSQL l'exige pour les gros volumes",
          ],
          correct_index: 1,
          explain: "C'est un compromis assumé, pas un défaut — l'inverse exact des priorités d'un système OLTP.",
        },
        {
          question: "Quelle est l'erreur de modélisation la plus fréquente chez les débutants selon ce chapitre ?",
          options: [
            "Utiliser trop d'index",
            "Confondre l'objectif de robustesse transactionnelle (3NF) avec l'objectif de vitesse analytique (dénormalisé)",
            "Utiliser des CTE plutôt que des sous-requêtes",
          ],
          correct_index: 1,
          explain: "Ces deux objectifs produisent des schémas radicalement différents — il faut choisir consciemment lequel prime pour le cas d'usage.",
        },
      ],
    },

    {
      number: "2.6.5",
      slug: "modelisation-dimensionnelle-kimball-fact-table",
      title: "Modélisation dimensionnelle (Kimball) : la fact table et ses types",
      parentSlug: "modelisation-de-donnees",
      duration_minutes: 30,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "La modélisation dimensionnelle (méthode Kimball) organise un entrepôt analytique autour de deux types de tables : des fact tables (les faits mesurables) et des dimensions (leur contexte descriptif). C'est le standard de l'industrie pour construire un entrepôt de données lisible et performant.",
          },
          {
            type: "table",
            headers: ["Type de fact table", "Principe", "Exemple"],
            rows: [
              ["Fact transactionnelle", "Une ligne par événement individuel, jamais modifiée après insertion", "fact_transactions — une ligne par transaction AfriPay"],
              ["Fact snapshot (périodique)", "Une photo de l'état à intervalle régulier, même si rien n'a changé", "Le solde de chaque compte agent, capturé chaque nuit"],
              ["Fact accumulating (cumulative)", "Une seule ligne par processus, mise à jour au fil de ses étapes", "Un onboarding marchand : une ligne créée à la demande, mise à jour à chaque étape jusqu'à l'activation"],
            ],
          },
          {
            type: "callout",
            title: "Pourquoi fact_transactions est une fact transactionnelle, pas autre chose",
            text: "Chaque transaction AfriPay est un événement instantané et immuable une fois complété — le grain naturel est \"une ligne par transaction\", jamais retouchée. Un fact snapshot conviendrait plutôt à \"le solde du compte à la fin de chaque journée\" — une donnée d'état, pas un événement.",
          },
          {
            type: "sql_code",
            text: "-- fact_transactions : structure typique d'une fact transactionnelle\n-- Clés étrangères vers les dimensions + mesures numériques\nselect transaction_id,        -- clé de la fact\n  customer_id, merchant_id, country_code,  -- clés étrangères vers les dimensions\n  amount_local, status, channel             -- mesures et attributs dégénérés\nfrom fact_transactions limit 5;",
          },
          {
            type: "sql_sandbox",
            prompt: "Vérifie que chaque transaction référence bien un customer_id et un merchant_id existants (intégrité référentielle).",
            starterQuery:
              "select count(*) as transactions_orphelines\nfrom fact_transactions t\nleft join dim_customer c on c.customer_id = t.customer_id\nwhere c.customer_id is null;",
          },
        ],
      },
      quiz: [
        {
          question: "Quel type de fact table correspond à \"une ligne par transaction, jamais modifiée après coup\" ?",
          options: ["Fact snapshot", "Fact transactionnelle", "Fact accumulating"],
          correct_index: 1,
          explain: "C'est exactement le cas de fact_transactions dans AfriPay.",
        },
        {
          question: "Un fact accumulating (cumulative) se distingue par :",
          options: [
            "Une nouvelle ligne à chaque événement",
            "Une seule ligne par processus, mise à jour au fil de ses étapes successives",
            "L'absence totale de clés étrangères",
          ],
          correct_index: 1,
          explain: "Utile pour suivre un processus qui progresse dans le temps, comme un onboarding marchand.",
        },
      ],
    },

    {
      number: "2.6.6",
      slug: "dimensions-dimensions-conformees",
      title: "Dimensions et dimensions conformées",
      parentSlug: "modelisation-de-donnees",
      duration_minutes: 25,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une dimension fournit le contexte descriptif d'un fait — le \"qui, quoi, où, quand\" qui donne du sens à une mesure brute. Sans dimension, \"5000 lignes, 250 000 de volume\" ne raconte rien d'exploitable.",
          },
          {
            type: "table",
            headers: ["Dimension AfriPay", "Contexte qu'elle apporte"],
            rows: [
              ["dim_customer", "QUI a fait la transaction"],
              ["dim_merchant", "OÙ (chez quel marchand) la transaction a eu lieu"],
              ["dim_country", "OÙ géographiquement, avec quelle devise et quel fuseau"],
              ["dim_date", "QUAND, avec des attributs prêts à l'emploi (trimestre, semaine, jour férié...)"],
            ],
          },
          {
            type: "star_schema",
            factTable: "fact_transactions",
            factColumns: ["transaction_id", "amount_local", "channel", "status"],
            dimensions: ["dim_customer", "dim_merchant", "dim_country", "dim_date"],
          },
          {
            type: "callout",
            title: "Dimensions conformées : la clé pour éviter des schémas incohérents entre équipes",
            text: "Une dimension conformée est PARTAGÉE et identique entre plusieurs schémas en étoile de l'entreprise — la même dim_date, la même dim_country, réutilisées que ce soit pour analyser les transactions, les onboardings d'agents, ou un futur module de fraude. Sans cette discipline, deux équipes finissent par avoir chacune \"leur\" dim_date légèrement différente, rendant impossible de comparer leurs rapports de façon fiable.",
          },
          {
            type: "p",
            text: "dim_date en particulier est presque toujours construite une seule fois pour toute l'entreprise, avec des années à l'avance déjà générées — exactement l'approche prise pour AfriPay (2 ans de calendrier déjà en place).",
          },
          {
            type: "sql_sandbox",
            prompt: "Explore dim_date : quels attributs prêts à l'emploi contient-elle ?",
            starterQuery:
              "select * from dim_date limit 5;",
          },
        ],
      },
      quiz: [
        {
          question: "Le rôle d'une dimension dans un schéma dimensionnel est de :",
          options: [
            "Stocker les mesures numériques principales",
            "Fournir le contexte descriptif (qui, quoi, où, quand) qui donne du sens aux faits",
            "Remplacer entièrement la fact table",
          ],
          correct_index: 1,
          explain: "Sans dimension, une mesure brute comme \"5000 lignes\" ne dit rien d'exploitable seule.",
        },
        {
          question: "Pourquoi une dimension conformée (comme dim_date) doit-elle être partagée entre équipes plutôt que dupliquée ?",
          options: [
            "Pour économiser de l'espace disque uniquement",
            "Pour garantir que les rapports de différentes équipes restent comparables entre eux",
            "PostgreSQL interdit les dimensions dupliquées",
          ],
          correct_index: 1,
          explain: "Deux versions légèrement différentes de dim_date rendraient les comparaisons entre équipes non fiables.",
        },
      ],
    },

    {
      number: "2.6.7",
      slug: "star-schema-vs-snowflake-vs-obt",
      title: "Star Schema vs Snowflake vs One Big Table (OBT)",
      parentSlug: "modelisation-de-donnees",
      duration_minutes: 30,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Trois façons d'organiser un entrepôt dimensionnel, avec un arbitrage différent entre simplicité de requête, redondance de stockage, et coût de jointure.",
          },
          {
            type: "table",
            headers: ["Modèle", "Principe", "Compromis"],
            rows: [
              ["Star Schema", "Une fact table, des dimensions dénormalisées directement reliées", "Simple à interroger, quelques Mo de redondance — le standard AfriPay"],
              ["Snowflake Schema", "Les dimensions sont elles-mêmes normalisées (dim_country éclatée en dim_region + dim_country)", "Moins de redondance, mais plus de jointures à chaque requête"],
              ["One Big Table (OBT)", "Fact et dimensions pré-jointes en une seule table large", "Lectures très rapides, mais duplication importante et mises à jour coûteuses"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Version star schema (l'actuelle d'AfriPay) : une jointure par dimension nécessaire\nselect t.transaction_id, c.full_name, m.merchant_name, co.country_name\nfrom fact_transactions t\njoin dim_customer c on c.customer_id = t.customer_id\njoin dim_merchant m on m.merchant_id = t.merchant_id\njoin dim_country co on co.country_code = t.country_code;\n\n-- Version OBT (hypothétique) : tout est déjà pré-joint, zéro JOIN nécessaire à la lecture\n-- select transaction_id, client_nom, marchand_nom, pays_nom from obt_transactions_completes;",
          },
          {
            type: "callout",
            title: "L'arbitrage moderne",
            text: "Avec le stockage colonnaire (Parquet, BigQuery, Snowflake) devenu très bon marché, l'OBT gagne du terrain pour les tableaux de bord à très forte lecture, où chaque milliseconde de jointure compte. Le star schema reste le standard par défaut de l'industrie : équilibre entre simplicité, gouvernance (une seule source de vérité par dimension) et coût de stockage raisonnable.",
          },
          {
            type: "p",
            text: "Le Snowflake Schema, lui, reste plus rare en pratique — le gain de redondance qu'il apporte compense rarement le coût de jointures supplémentaires, sauf sur des dimensions extrêmement volumineuses partagées par des centaines de fact tables.",
          },
          {
            type: "sql_sandbox",
            prompt: "Simule une requête OBT en pré-joignant toi-même fact_transactions à ses trois dimensions dans une CTE.",
            starterQuery:
              "with obt_simulee as (\n  select t.transaction_id, t.amount_local, c.full_name, m.merchant_name, co.country_name\n  from fact_transactions t\n  join dim_customer c on c.customer_id = t.customer_id\n  join dim_merchant m on m.merchant_id = t.merchant_id\n  join dim_country co on co.country_code = t.country_code\n)\nselect * from obt_simulee limit 20;",
          },
        ],
      },
      quiz: [
        {
          question: "Dans un schéma en étoile, les dimensions sont typiquement :",
          options: ["Normalisées en 3NF", "Dénormalisées, reliées directement à la fact table", "Interdites"],
          correct_index: 1,
          explain: "C'est ce qui rend le star schema simple à interroger — au prix d'une redondance assumée.",
        },
        {
          question: "Le One Big Table (OBT) gagne du terrain aujourd'hui principalement parce que :",
          options: [
            "Le stockage colonnaire l'a rendu bon marché malgré la redondance",
            "Il est plus normalisé qu'un star schema",
            "Il n'existe plus de dimensions à gérer",
          ],
          correct_index: 0,
          explain: "Avec Parquet/BigQuery/Snowflake, le coût de la redondance a fortement baissé, rendant l'OBT viable pour la lecture pure.",
        },
        {
          question: "Un Snowflake Schema se distingue d'un Star Schema par :",
          options: [
            "L'absence totale de fact table",
            "Des dimensions elles-mêmes normalisées, ajoutant des jointures supplémentaires",
            "L'utilisation exclusive de JSON",
          ],
          correct_index: 1,
          explain: "Moins de redondance de stockage, mais un coût de jointure plus élevé à chaque requête.",
        },
      ],
    },

    {
      number: "2.6.8",
      slug: "grain-cles-substitution-surrogate-keys",
      title: "Le grain et les clés de substitution (surrogate keys)",
      parentSlug: "modelisation-de-donnees",
      duration_minutes: 25,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Le grain d'une table, c'est la réponse à la question « que représente une seule ligne ? ». C'est la toute première décision à prendre en modélisant une fact table — et l'une des plus difficiles à corriger après coup.",
          },
          {
            type: "callout",
            title: "Se tromper de grain casse silencieusement tout ce qui est construit dessus",
            text: "Si fact_transactions avait, par erreur, le grain \"un client\" (une ligne par client, montant déjà agrégé) plutôt que \"une transaction\", il deviendrait impossible de répondre à \"quel a été le montant de LA transaction du 5 janvier ?\" — l'information a été perdue à l'agrégation, sans qu'aucune erreur ne le signale au moment de la conception.",
          },
          {
            type: "sql_code",
            text: "-- Le grain de fact_transactions EST \"une transaction\" — vérifiable : chaque transaction_id doit être unique\nselect transaction_id, count(*)\nfrom fact_transactions\ngroup by transaction_id\nhaving count(*) > 1;   -- doit renvoyer zéro ligne si le grain est respecté",
          },
          { type: "h3", text: "Clés de substitution (surrogate keys)" },
          {
            type: "p",
            text: "Une clé de substitution (surrogate key) est un identifiant généré par le système (souvent un entier auto-incrémenté ou un UUID), indépendant de toute clé métier — elle ne change jamais, même si la clé métier évolue ou se révèle un jour non fiable.",
          },
          {
            type: "table",
            headers: ["Type de clé", "Exemple", "Fragilité"],
            rows: [
              ["Clé métier (natural key)", "Un numéro de téléphone comme identifiant client", "Peut changer, être réutilisé, ou différer entre systèmes sources"],
              ["Clé de substitution (surrogate key)", "customer_id (serial) dans dim_customer", "Stable par construction — jamais réutilisée, jamais modifiée"],
            ],
          },
          {
            type: "callout",
            title: "Pourquoi une fintech panafricaine a particulièrement besoin de surrogate keys",
            text: "Un numéro de téléphone (clé métier naturelle pour un client mobile money) peut être réattribué à une autre personne après résiliation dans certains pays, ou changer de format d'un pays à l'autre. S'appuyer sur customer_id — une clé de substitution stable, indépendante du téléphone — protège tout l'entrepôt de ces changements externes.",
          },
          {
            type: "sql_sandbox",
            prompt: "Vérifie que customer_id (la clé de substitution) est bien unique dans dim_customer.",
            starterQuery:
              "select customer_id, count(*)\nfrom dim_customer\ngroup by customer_id\nhaving count(*) > 1;",
          },
        ],
      },
      quiz: [
        {
          question: "Le \"grain\" d'une table de faits désigne :",
          options: ["Sa taille en Go", "Ce que représente une seule ligne", "Le nombre de dimensions qui lui sont reliées"],
          correct_index: 1,
          explain: "Se tromper de grain casse silencieusement toutes les analyses construites dessus.",
        },
        {
          question: "Pourquoi préférer une clé de substitution (surrogate key) à une clé métier naturelle (ex. numéro de téléphone) ?",
          options: [
            "Les clés de substitution sont toujours plus courtes",
            "Une clé métier peut changer, être réutilisée ou différer entre systèmes — la clé de substitution reste stable",
            "PostgreSQL n'accepte pas les clés métier comme clé primaire",
          ],
          correct_index: 1,
          explain: "C'est particulièrement critique pour des identifiants externes comme un numéro de téléphone, potentiellement réattribués.",
        },
      ],
    },

    {
      number: "2.6.9",
      slug: "scd-slowly-changing-dimensions",
      title: "Slowly Changing Dimensions (SCD) : types 0, 1, 2, 3, 6",
      parentSlug: "modelisation-de-donnees",
      duration_minutes: 30,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une dimension change rarement, mais elle change quand même — un client déménage, change de segment, un marchand se renomme. Les Slowly Changing Dimensions (SCD) sont les stratégies standard pour gérer ces changements, chacune avec un compromis différent entre simplicité et conservation de l'historique.",
          },
          {
            type: "table",
            headers: ["Type", "Comportement", "Cas AfriPay"],
            rows: [
              ["Type 0", "Jamais modifié après création — figé pour toujours", "Date de signup d'un client"],
              ["Type 1", "Écrase l'ancienne valeur, aucun historique conservé", "Corriger une simple faute de frappe dans un nom"],
              ["Type 2", "Nouvelle ligne à chaque changement, avec valid_from/valid_to/is_current", "Un client déménage de pays — on garde l'historique de qui il était et depuis quand"],
              ["Type 3", "Une colonne dédiée \"valeur précédente\" en plus de la valeur actuelle", "Garder uniquement l'AVANT-dernier segment, pas tout l'historique"],
              ["Type 6", "Combinaison de 1 + 2 + 3 — cas avancé, rarement nécessaire en pratique", "Cas d'entreprise avec des besoins de reporting très spécifiques"],
            ],
          },
          {
            type: "sql_code",
            text: "-- dim_customer en SCD Type 2 : ajouter les colonnes de suivi de validité\nalter table dim_customer\n  add column valid_from date not null default '2024-01-01',\n  add column valid_to date,\n  add column is_current boolean not null default true;\n\n-- Un client change de pays : on clôture l'ancienne ligne, on en insère une nouvelle\nupdate dim_customer set valid_to = current_date, is_current = false where customer_id = 42 and is_current;\ninsert into dim_customer (customer_id, full_name, country_code, signup_date, segment, valid_from, is_current)\nselect customer_id, full_name, 'KE', signup_date, segment, current_date, true\nfrom dim_customer where customer_id = 42 and is_current = false order by valid_to desc limit 1;",
          },
          {
            type: "callout",
            title: "Le piège du Type 2 : toujours filtrer sur is_current pour l'état ACTUEL",
            text: "Une fois une dimension passée en SCD Type 2, une requête qui oublie `where is_current = true` récupère TOUTES les versions historiques d'un client — dupliquant potentiellement les résultats d'une jointure. Le Type 2 est puissant mais demande une discipline systématique côté requêtes.",
          },
          {
            type: "exercise_choice",
            title: "Exercice — quelle SCD ?",
            scenario:
              "Un client change de segment (particulier → premium). Le service marketing veut savoir, pour chaque campagne passée, quel segment avait réellement le client à ce moment-là — pas son segment actuel.",
            options: [
              { label: "Type 0", correct: false },
              { label: "Type 1", correct: false },
              { label: "Type 2", correct: true },
            ],
            feedback:
              "Type 2 : il faut conserver l'historique complet, avec une nouvelle ligne et des dates de validité — exactement le cas d'usage qui justifie ce type.",
          },
          {
            type: "sql_sandbox",
            prompt: "Simule une requête qui ne récupère QUE la version actuelle de chaque client, en environnement SCD Type 2.",
            starterQuery:
              "-- Si dim_customer était en SCD Type 2, la requête correcte serait :\n-- select * from dim_customer where is_current = true;\nselect customer_id, full_name, segment from dim_customer limit 10;",
          },
        ],
      },
      quiz: [
        {
          question: "Un client change de pays et l'entreprise doit garder l'historique de qui il était avant. Quelle SCD ?",
          options: ["Type 0", "Type 1", "Type 2"],
          correct_index: 2,
          explain: "Type 2 ajoute une nouvelle ligne avec valid_from/valid_to — l'historique est préservé.",
        },
        {
          question: "Quel est le risque principal d'une dimension en SCD Type 2 sans discipline de requête ?",
          options: [
            "Aucun risque particulier",
            "Oublier `where is_current = true` peut faire remonter toutes les versions historiques d'une même entité, dupliquant les résultats",
            "Le Type 2 empêche toute jointure",
          ],
          correct_index: 1,
          explain: "C'est le compromis du Type 2 : puissant pour l'historique, mais exigeant une discipline systématique.",
        },
        {
          question: "Le SCD Type 1 se caractérise par :",
          options: [
            "La conservation de tout l'historique",
            "L'écrasement de l'ancienne valeur, sans aucun historique conservé",
            "Une colonne dédiée à la valeur précédente uniquement",
          ],
          correct_index: 1,
          explain: "Utile pour une simple correction (faute de frappe) où l'historique n'a aucune valeur métier.",
        },
      ],
    },

    {
      number: "2.6.10",
      slug: "atelier-modeliser-verifier-grain-afripay",
      title: "Atelier de synthèse : modéliser et vérifier le grain d'AfriPay",
      parentSlug: "modelisation-de-donnees",
      duration_minutes: 30,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Ce chapitre a couvert le pourquoi de la modélisation (2.6.1), MCD/MLD (2.6.2), la normalisation et son compromis analytique (2.6.3-2.6.4), la modélisation dimensionnelle complète — facts, dimensions, star schema (2.6.5-2.6.7) —, le grain et les surrogate keys (2.6.8), et les SCD (2.6.9). Cet atelier vérifie que le modèle AfriPay respecte réellement tout ce que tu viens d'apprendre.",
          },
          {
            type: "checklist",
            title: "Tu es prêt·e pour le Chapitre 2.7 si tu peux répondre oui à chaque point",
            items: [
              "Je sais expliquer la différence entre MCD et MLD à quelqu'un qui débute",
              "Je sais dire pourquoi un entrepôt analytique dénormalise volontairement",
              "Je sais identifier le grain d'une fact table et vérifier qu'il est respecté",
              "Je sais pourquoi une surrogate key est préférable à une clé métier naturelle",
              "Je sais choisir la bonne SCD selon le besoin réel de conservation d'historique",
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 1 — Vérifie le grain de fact_transactions : une ligne = une transaction. Compte les transaction_id en double (il ne doit y en avoir aucun).",
            starterQuery:
              "select transaction_id, count(*)\nfrom fact_transactions\ngroup by transaction_id\nhaving count(*) > 1;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 2 — Vérifie l'intégrité référentielle complète : chaque transaction référence-t-elle un client, un marchand et un pays qui existent réellement ?",
            starterQuery:
              "select count(*) as transactions_orphelines\nfrom fact_transactions t\nleft join dim_customer c on c.customer_id = t.customer_id\nleft join dim_merchant m on m.merchant_id = t.merchant_id\nleft join dim_country co on co.country_code = t.country_code\nwhere c.customer_id is null or m.merchant_id is null or co.country_code is null;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Étape 3 — Livrable : reconstitue le star schema complet en une seule requête, prête pour un tableau de bord (les 20 premières lignes).",
            starterQuery:
              "select t.transaction_id, c.full_name as client, m.merchant_name, co.country_name, t.amount_local, t.channel, t.status\nfrom fact_transactions t\njoin dim_customer c on c.customer_id = t.customer_id\njoin dim_merchant m on m.merchant_id = t.merchant_id\njoin dim_country co on co.country_code = t.country_code\nlimit 20;",
          },
        ],
      },
      quiz: [
        {
          question: "Que doit obligatoirement montrer une vérification du grain de fact_transactions ?",
          options: [
            "Qu'il existe des transaction_id en double",
            "Qu'aucun transaction_id n'apparaît plus d'une fois",
            "Que la table est vide",
          ],
          correct_index: 1,
          explain: "Le grain \"une ligne = une transaction\" n'est respecté que si transaction_id est réellement unique.",
        },
        {
          question: "Une transaction \"orpheline\" (sans client, marchand ou pays correspondant) signale :",
          options: [
            "Un comportement normal et attendu",
            "Un problème d'intégrité référentielle à corriger",
            "Une fonctionnalité recherchée du modèle",
          ],
          correct_index: 1,
          explain: "Un modèle dimensionnel bien conçu garantit que chaque clé étrangère référence une ligne existante.",
        },
        {
          question: "Ce chapitre a-t-il pour objectif de figer un modèle unique valable pour tous les cas ?",
          options: [
            "Oui, un seul modèle s'applique toujours",
            "Non — le bon modèle dépend des questions métier et de l'arbitrage lecture/écriture recherché",
            "La modélisation n'a aucun impact réel",
          ],
          correct_index: 1,
          explain: "C'est le message central du chapitre depuis la Leçon 2.6.1 : modéliser, c'est répondre à des questions métier précises, pas suivre une recette universelle.",
        },
      ],
    },

    // ============================================================
    // CHAPITRE 2.7 — DATA WAREHOUSE, PIPELINES & QUALITÉ
    // ============================================================
    {
      number: "2.7",
      slug: "data-warehouse-pipelines-qualite",
      title: "Data Warehouse, pipelines & qualité",
      duration_minutes: 15,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Modéliser un schéma sur le papier est une chose. Construire le pipeline qui l'alimente chaque jour, sans jamais dupliquer ni perdre une donnée, en est une autre. C'est l'objet de ce chapitre — et la porte d'entrée vers l'orchestration (Module 05) et la qualité des données en production (Module 09).",
          },
          {
            type: "checklist",
            title: "Les 10 leçons de ce chapitre",
            items: [
              "2.7.1 — Architecture Medallion : Bronze → Silver → Gold",
              "2.7.2 — La couche Bronze : ingérer sans juger la donnée",
              "2.7.3 — Full load vs incremental load, watermarking",
              "2.7.4 — Idempotence : le concept qui protège tout pipeline",
              "2.7.5 — CDC via MERGE / ON CONFLICT en SQL pur",
              "2.7.6 — Data Quality : NULL et doublons",
              "2.7.7 — Data Quality : dates invalides et formats incohérents",
              "2.7.8 — Data Quality : intégrité référentielle",
              "2.7.9 — Construire la couche Silver : nettoyer raw_transactions_bronze",
              "2.7.10 — La couche Gold et atelier de synthèse du chapitre",
            ],
          },
        ],
      },
      quiz: [],
    },

    {
      number: "2.7.1",
      slug: "architecture-medallion-bronze-silver-gold",
      title: "Architecture Medallion : Bronze → Silver → Gold",
      parentSlug: "data-warehouse-pipelines-qualite",
      duration_minutes: 20,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "L'architecture Medallion organise un pipeline de données en trois couches successives, chacune avec une responsabilité claire — une donnée ne saute jamais directement de la source au reporting sans passer par ces étapes de confiance croissante.",
          },
          {
            type: "medallion",
            layers: [
              { name: "Bronze", description: "La donnée brute, telle qu'extraite de la source — raw_transactions_bronze : sale, mais fidèle à l'original." },
              { name: "Silver", description: "Nettoyée et conformée : types corrects, doublons retirés, clés validées — prête à être jointe en confiance." },
              { name: "Gold", description: "Modélisée pour le métier : le star schema AfriPay (fact_transactions + dimensions), prêt pour le reporting." },
            ],
          },
          {
            type: "callout",
            title: "Pourquoi ne pas nettoyer directement à l'ingestion",
            text: "Conserver la donnée brute en Bronze (même sale) permet de rejouer tout le pipeline depuis le début si une règle de nettoyage se révèle plus tard erronée — sans Bronze, une erreur dans la logique de Silver serait irréversible : la donnée d'origine aurait déjà été perdue ou transformée.",
          },
          {
            type: "p",
            text: "Ce découpage en trois couches distinctes correspond très exactement à trois tables/zones du modèle AfriPay que tu connais déjà : raw_transactions_bronze (Bronze), une future table nettoyée (Silver, construite en 2.7.9), et fact_transactions + les dimensions (Gold, déjà en place depuis le Chapitre 2.6).",
          },
          {
            type: "sql_sandbox",
            prompt: "Compare le nombre de lignes en Bronze (brut) à celui déjà présent en Gold (fact_transactions).",
            starterQuery:
              "select 'bronze (raw)' as couche, count(*) from raw_transactions_bronze\nunion all\nselect 'gold (fact)', count(*) from fact_transactions;",
          },
        ],
      },
      quiz: [
        {
          question: "Dans l'architecture Medallion, la couche Silver a pour rôle :",
          options: [
            "Stocker la donnée brute non modifiée",
            "Nettoyer et conformer la donnée, sans encore la modéliser pour le métier",
            "Servir directement les tableaux de bord finaux",
          ],
          correct_index: 1,
          explain: "Bronze = brut, Silver = nettoyé/conforme, Gold = modélisé pour le business.",
        },
        {
          question: "Pourquoi garder la donnée brute en Bronze plutôt que de la nettoyer immédiatement à l'ingestion ?",
          options: [
            "Ça n'a aucune importance",
            "Pour pouvoir rejouer tout le pipeline depuis le début si une règle de nettoyage se révèle plus tard erronée",
            "Parce que PostgreSQL l'exige",
          ],
          correct_index: 1,
          explain: "Sans la donnée brute conservée, une erreur de logique en Silver deviendrait irréversible.",
        },
      ],
    },

    {
      number: "2.7.2",
      slug: "couche-bronze-ingerer-sans-juger",
      title: "La couche Bronze : ingérer sans juger la donnée",
      parentSlug: "data-warehouse-pipelines-qualite",
      duration_minutes: 20,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "La règle d'or de la couche Bronze : accepter la donnée telle quelle, sans aucune tentative de correction — même une donnée visiblement fausse doit être ingérée intacte, jamais rejetée ni corrigée silencieusement à ce stade.",
          },
          {
            type: "sql_code",
            text: "-- raw_transactions_bronze : TOUT est stocké en texte, y compris ce qui devrait être numérique ou une date\nselect column_name, data_type\nfrom information_schema.columns\nwhere table_name = 'raw_transactions_bronze'\norder by ordinal_position;",
          },
          {
            type: "callout",
            title: "Pourquoi tout stocker en texte en Bronze, même les nombres et les dates",
            text: "Si une valeur source est '12,5' (virgule) plutôt que '12.5' (point), une colonne numérique refuserait purement et simplement l'insertion — la ligne serait perdue avant même d'atteindre Bronze. En stockant tout en texte, Bronze accepte TOUT ce qui arrive de la source, permettant de diagnostiquer et corriger le problème en Silver, avec la donnée d'origine toujours disponible pour comparaison.",
          },
          {
            type: "sql_sandbox",
            prompt: "Observe des exemples réels de valeurs \"sales\" dans amount_local telles qu'elles arrivent en Bronze.",
            starterQuery:
              "select transaction_id, amount_local, transaction_at_raw\nfrom raw_transactions_bronze\nlimit 15;",
          },
          {
            type: "thinking_prompt",
            text: "Une équipe qui \"nettoie un peu\" dès l'ingestion perd la capacité de savoir, six mois plus tard, ce que la source a RÉELLEMENT envoyé ce jour-là — un problème classique de traçabilité (lineage) en data engineering, que la couche Bronze existe précisément pour éviter.",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi raw_transactions_bronze stocke-t-elle presque toutes ses colonnes en type texte ?",
          options: [
            "Par erreur de conception",
            "Pour accepter n'importe quelle valeur source sans risquer un rejet d'insertion, même si elle est mal formée",
            "PostgreSQL ne supporte pas d'autres types pour cette table",
          ],
          correct_index: 1,
          explain: "Un type strict (numeric, date) rejetterait une valeur mal formée avant même son arrivée en Bronze.",
        },
        {
          question: "Que risque-t-on à nettoyer la donnée dès l'ingestion, sans passer par une couche Bronze brute ?",
          options: [
            "Rien de particulier",
            "Perdre la capacité de savoir ce que la source a réellement envoyé (traçabilité/lineage)",
            "Un gain de performance systématique",
          ],
          correct_index: 1,
          explain: "C'est un problème classique de lineage — Bronze préserve la vérité d'origine pour tout diagnostic futur.",
        },
      ],
    },

    {
      number: "2.7.3",
      slug: "full-load-vs-incremental-watermarking",
      title: "Full load vs incremental load, watermarking",
      parentSlug: "data-warehouse-pipelines-qualite",
      duration_minutes: 25,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un chargement complet (full load) retraite TOUTES les données à chaque exécution — simple à raisonner, mais coûteux et de plus en plus lent à mesure que le volume grandit. Un chargement incrémental ne traite que ce qui a changé depuis la dernière exécution.",
          },
          {
            type: "table",
            headers: ["Stratégie", "Principe", "Coût"],
            rows: [
              ["Full load", "Retraite l'intégralité de la source à chaque exécution", "Simple, mais le temps d'exécution grandit avec le volume total"],
              ["Incremental load", "Ne traite que les lignes nouvelles/modifiées depuis le dernier watermark", "Rapide et stable dans le temps, mais demande de suivre précisément ce qui a déjà été traité"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Chargement incrémental : uniquement les lignes plus récentes que le dernier watermark enregistré\nselect * from raw_transactions_bronze\nwhere transaction_at_raw > (\n  select coalesce(max(derniere_valeur), '1900-01-01')\n  from watermarks where pipeline = 'bronze_to_silver'\n);",
          },
          {
            type: "callout",
            title: "Le watermark doit être mis à jour APRÈS un traitement réussi, jamais avant",
            text: "Si le watermark était avancé avant que le traitement ne se termine, un échec en cours de route ferait croire au pipeline que ces lignes ont déjà été traitées — elles seraient silencieusement perdues, jamais retraitées. Le watermark ne doit avancer qu'une fois le COMMIT du traitement confirmé.",
          },
          {
            type: "sql_code",
            text: "-- Mettre à jour le watermark seulement APRÈS le traitement, dans la même transaction que l'écriture\nbegin;\n-- ... insertion des nouvelles lignes en Silver ...\ninsert into watermarks (pipeline, derniere_valeur)\nvalues ('bronze_to_silver', now())\non conflict (pipeline) do update set derniere_valeur = excluded.derniere_valeur;\ncommit;",
          },
          {
            type: "sql_sandbox",
            prompt: "Simule un chargement incrémental : sélectionne uniquement les transactions de raw_transactions_bronze plus récentes qu'une date donnée.",
            starterQuery:
              "select * from raw_transactions_bronze\nwhere transaction_at_raw > '2024-06-01'\nlimit 20;",
          },
        ],
      },
      quiz: [
        {
          question: "Quel est le principal inconvénient d'un chargement complet (full load) à mesure que le volume grandit ?",
          options: [
            "Il devient de plus en plus difficile à écrire",
            "Le temps d'exécution grandit avec le volume total, même si seule une petite partie a réellement changé",
            "Il ne fonctionne qu'une seule fois",
          ],
          correct_index: 1,
          explain: "C'est ce qui justifie le passage à un chargement incrémental à mesure que les données grossissent.",
        },
        {
          question: "Pourquoi le watermark doit-il être mis à jour APRÈS un traitement réussi, jamais avant ?",
          options: [
            "Ça n'a pas d'importance",
            "Sinon un échec en cours de route ferait croire à tort que ces lignes ont déjà été traitées, les perdant silencieusement",
            "PostgreSQL l'exige techniquement",
          ],
          correct_index: 1,
          explain: "Avancer le watermark trop tôt casse la garantie qu'aucune donnée n'est perdue en cas d'échec partiel.",
        },
      ],
    },

    {
      number: "2.7.4",
      slug: "idempotence-concept-protege-pipeline",
      title: "Idempotence : le concept qui protège tout pipeline",
      parentSlug: "data-warehouse-pipelines-qualite",
      duration_minutes: 25,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un traitement est idempotent si le relancer plusieurs fois produit exactement le même résultat que le lancer une seule fois. Sans idempotence, un pipeline qui échoue à mi-chemin et qu'on relance duplique silencieusement des données — l'une des causes les plus fréquentes d'incidents de qualité de données en production.",
          },
          {
            type: "sql_code",
            text: "-- ❌ Non idempotent : relancer ce script deux fois insère DEUX FOIS les mêmes transactions\ninsert into fact_transactions (transaction_id, customer_id, amount_local)\nselect transaction_id::int, customer_id::int, amount_local::numeric\nfrom raw_transactions_bronze where customer_id is not null;\n\n-- ✅ Idempotent : ON CONFLICT garantit qu'une même transaction n'est jamais dupliquée, peu importe le nombre de relances\ninsert into fact_transactions (transaction_id, customer_id, amount_local)\nselect transaction_id::int, customer_id::int, amount_local::numeric\nfrom raw_transactions_bronze where customer_id is not null\non conflict (transaction_id) do update set amount_local = excluded.amount_local;",
          },
          {
            type: "thinking_prompt",
            text: "Que se passe-t-il si ce pipeline s'arrête au milieu de son exécution ? Est-ce que je peux le relancer sans tout casser ? Si la réponse n'est pas un « oui » immédiat, le pipeline n'est pas encore prêt pour la production — quelle que soit la qualité du reste de son code.",
          },
          {
            type: "callout",
            title: "L'idempotence n'est pas optionnelle en production",
            text: "En production, un pipeline échoue tôt ou tard — un timeout réseau, une base momentanément indisponible, un déploiement en plein milieu d'une exécution planifiée. La question n'est jamais \"si\" mais \"quand\". Un pipeline idempotent transforme un échec en simple relance sans conséquence ; un pipeline non idempotent transforme le même échec en incident de données à corriger manuellement.",
          },
          {
            type: "sql_sandbox",
            prompt: "Exécute deux fois de suite la version idempotente ci-dessus et vérifie que le nombre de lignes ne double pas.",
            starterQuery:
              "insert into fact_transactions (transaction_id, customer_id, merchant_id, country_code, transaction_at, amount_local, currency_code, channel, status)\nselect b.transaction_id::int, b.customer_id::int, b.merchant_id::int, b.country_code,\n       b.transaction_at_raw::timestamptz, b.amount_local::numeric, b.currency_code, b.channel, b.status\nfrom raw_transactions_bronze b\nwhere b.customer_id is not null and b.merchant_id::int in (select merchant_id from dim_merchant)\non conflict (transaction_id) do update set status = excluded.status;\n\nselect count(*) from fact_transactions;",
          },
        ],
      },
      quiz: [
        {
          question: "Un traitement idempotent garantit que :",
          options: [
            "Il s'exécute plus vite à chaque relance",
            "Le relancer plusieurs fois produit le même résultat qu'une seule exécution",
            "Il ne peut jamais échouer",
          ],
          correct_index: 1,
          explain: "C'est la propriété qui rend un pipeline sûr à relancer après un échec partiel.",
        },
        {
          question: "Pourquoi l'idempotence n'est-elle pas un \"nice-to-have\" mais une nécessité en production ?",
          options: [
            "Parce qu'un pipeline échoue tôt ou tard, et un pipeline non idempotent transforme cet échec en incident de données",
            "Parce que PostgreSQL refuse d'exécuter des pipelines non idempotents",
            "Ce n'est utile qu'en environnement de test",
          ],
          correct_index: 0,
          explain: "La question n'est jamais \"si\" un pipeline échouera, mais \"quand\" — l'idempotence détermine la gravité de cet échec.",
        },
      ],
    },

    {
      number: "2.7.5",
      slug: "cdc-merge-on-conflict-sql-pur",
      title: "CDC via MERGE / ON CONFLICT en SQL pur",
      parentSlug: "data-warehouse-pipelines-qualite",
      duration_minutes: 25,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Change Data Capture (CDC) désigne le fait de ne propager QUE les changements (insertions, mises à jour) plutôt que de retraiter l'intégralité d'une table à chaque fois. En SQL pur, INSERT ... ON CONFLICT est l'implémentation la plus directe de ce principe.",
          },
          {
            type: "sql_code",
            text: "-- Chaque exécution ne fait qu'insérer les nouvelles lignes ou mettre à jour les existantes — jamais dupliquer\ninsert into fact_transactions (transaction_id, customer_id, merchant_id, country_code, transaction_at, amount_local, currency_code, channel, status)\nselect b.transaction_id::int, b.customer_id::int, b.merchant_id::int, b.country_code,\n       b.transaction_at_raw::timestamptz, b.amount_local::numeric, b.currency_code, b.channel, b.status\nfrom raw_transactions_bronze b\nwhere b.customer_id is not null\non conflict (transaction_id) do update\n  set status = excluded.status;",
            caption: "Seul status est mis à jour ici — une transaction 'pending' devenue 'completed' entre deux exécutions doit se refléter, sans retraiter toute la ligne inutilement.",
          },
          {
            type: "callout",
            title: "Pourquoi seulement status est mis à jour, pas toutes les colonnes",
            text: "Une transaction déjà en Gold ne devrait normalement jamais changer de montant ou de client une fois créée — seul son statut évolue légitimement (pending → completed → failed). Limiter le DO UPDATE aux colonnes qui peuvent réellement changer est une protection supplémentaire : si la source envoyait accidentellement un montant corrompu pour une transaction déjà traitée, cette clause ON CONFLICT ne l'écraserait pas.",
          },
          {
            type: "p",
            text: "PostgreSQL 15+ propose aussi la commande MERGE, syntaxe SQL standard plus proche d'autres moteurs (SQL Server, Oracle) — ON CONFLICT reste cependant plus concis et largement suffisant pour la plupart des cas d'upsert.",
          },
          {
            type: "sql_sandbox",
            prompt: "Simule un changement de statut : une transaction bronze passe de 'pending' à 'completed', puis vérifie que seul son statut change en Gold.",
            starterQuery:
              "select transaction_id, status from fact_transactions\nwhere status = 'pending'\nlimit 10;",
          },
        ],
      },
      quiz: [
        {
          question: "ON CONFLICT DO UPDATE, dans un chargement CDC, sert à :",
          options: [
            "Empêcher toute mise à jour",
            "Insérer les nouvelles lignes et mettre à jour les existantes en une seule requête, sans dupliquer",
            "Supprimer les lignes en conflit",
          ],
          correct_index: 1,
          explain: "C'est le mécanisme SQL qui rend un chargement incrémental idempotent.",
        },
        {
          question: "Pourquoi limiter le DO UPDATE à quelques colonnes précises (ex. status) plutôt qu'à toutes ?",
          options: [
            "Pour des raisons de performance uniquement",
            "Pour éviter qu'une donnée déjà validée (montant, client) soit accidentellement écrasée par une valeur corrompue de la source",
            "PostgreSQL limite le nombre de colonnes modifiables",
          ],
          correct_index: 1,
          explain: "C'est une protection délibérée contre une régression accidentelle sur des colonnes qui ne devraient plus changer.",
        },
      ],
    },

    {
      number: "2.7.6",
      slug: "data-quality-null-doublons",
      title: "Data Quality : NULL et doublons",
      parentSlug: "data-warehouse-pipelines-qualite",
      duration_minutes: 25,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Avant de faire confiance à une extraction, il faut la mesurer. Deux vérifications systématiques : combien de valeurs manquent, et combien de lignes sont des doublons exacts.",
          },
          {
            type: "sql_code",
            text: "-- Combien de lignes ont un customer_id ou un amount_local manquant ?\nselect count(*) filter (where customer_id is null) as customer_manquant,\n       count(*) filter (where amount_local is null) as montant_manquant,\n       count(*) as total_lignes\nfrom raw_transactions_bronze;",
          },
          {
            type: "sql_code",
            text: "-- Doublons exacts dans l'extraction brute — un même transaction_id apparaissant plusieurs fois\nselect transaction_id, count(*)\nfrom raw_transactions_bronze\ngroup by transaction_id\nhaving count(*) > 1;",
          },
          {
            type: "callout",
            title: "Ces problèmes existent réellement dans nos données",
            text: "raw_transactions_bronze n'est pas un exemple inventé pour l'occasion : elle contient de vrais NULL et de vrais doublons — exactement ce qu'une extraction quotidienne mal maîtrisée produit dans une vraie entreprise, volontairement injecté dans ce jeu de données pour que tu t'entraînes sur un cas réaliste.",
          },
          {
            type: "p",
            text: "Un pourcentage de valeurs manquantes calculé une fois ne suffit pas — le suivre dans le temps (est-ce que ça empire ?) est ce qui distingue un contrôle qualité ponctuel d'une vraie surveillance de production, sujet approfondi au Module 09 (DataOps).",
          },
          {
            type: "sql_sandbox",
            prompt: "Calcule le pourcentage de lignes avec un customer_id manquant dans raw_transactions_bronze.",
            starterQuery:
              "select round(100.0 * count(*) filter (where customer_id is null) / count(*), 2) as pct_manquant\nfrom raw_transactions_bronze;",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle requête permet de détecter des doublons exacts sur transaction_id ?",
          options: [
            "select distinct transaction_id from raw_transactions_bronze",
            "select transaction_id, count(*) from raw_transactions_bronze group by transaction_id having count(*) > 1",
            "select * from raw_transactions_bronze limit 1",
          ],
          correct_index: 1,
          explain: "GROUP BY + HAVING count(*) > 1 isole précisément les valeurs qui apparaissent plus d'une fois.",
        },
        {
          question: "Pourquoi suivre le taux de valeurs manquantes DANS LE TEMPS plutôt qu'une seule fois ?",
          options: [
            "Ça n'apporte rien de plus",
            "Pour détecter une dégradation progressive de la qualité de la source, pas seulement un état ponctuel",
            "Parce qu'un contrôle ponctuel est interdit par les bonnes pratiques",
          ],
          correct_index: 1,
          explain: "C'est ce qui distingue un contrôle qualité ponctuel d'une vraie surveillance de production (Module 09).",
        },
      ],
    },

    {
      number: "2.7.7",
      slug: "data-quality-dates-invalides-formats",
      title: "Data Quality : dates invalides et formats incohérents",
      parentSlug: "data-warehouse-pipelines-qualite",
      duration_minutes: 25,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une extraction brute multi-source mélange souvent plusieurs formats de date pour le même champ — un problème invisible tant qu'on n'essaie pas de convertir explicitement la colonne en type date.",
          },
          {
            type: "sql_code",
            text: "-- Formats de date incohérents (certains 'YYYY-MM-DD', d'autres 'DD/MM/YYYY', d'autres ISO complet)\nselect distinct transaction_at_raw from raw_transactions_bronze\nwhere transaction_at_raw !~ '^\\d{4}-\\d{2}-\\d{2}'\nlimit 10;",
          },
          {
            type: "callout",
            title: "🪤 Pourquoi un CAST direct vers timestamptz est risqué sur cette colonne",
            text: "`transaction_at_raw::timestamptz` fonctionnera pour certaines lignes et échouera bruyamment (erreur d'exécution qui arrête TOUTE la requête) dès qu'il rencontre un format qu'il ne reconnaît pas. Une conversion prudente doit d'abord identifier les formats présents, avant de choisir une stratégie de parsing qui les gère tous — ou de rejeter explicitement les formats non reconnus vers une file d'erreurs plutôt que de planter tout le pipeline.",
          },
          {
            type: "sql_code",
            text: "-- Une approche défensive : essayer plusieurs formats connus avec to_timestamp(), à la place d'un cast direct\nselect transaction_at_raw,\n  case\n    when transaction_at_raw ~ '^\\d{4}-\\d{2}-\\d{2}' then transaction_at_raw::timestamptz\n    when transaction_at_raw ~ '^\\d{2}/\\d{2}/\\d{4}' then to_timestamp(transaction_at_raw, 'DD/MM/YYYY')\n    else null  -- format non reconnu : NULL plutôt qu'un plantage, à investiguer séparément\n  end as transaction_at_parsee\nfrom raw_transactions_bronze\nlimit 20;",
          },
          {
            type: "sql_sandbox",
            prompt: "Compte combien de lignes ont un format de date non reconnu (candidat à investiguer avant le passage en Silver).",
            starterQuery:
              "select count(*) as format_non_reconnu\nfrom raw_transactions_bronze\nwhere transaction_at_raw !~ '^\\d{4}-\\d{2}-\\d{2}' and transaction_at_raw !~ '^\\d{2}/\\d{2}/\\d{4}';",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi un simple `colonne::timestamptz` est-il risqué sur une colonne multi-format ?",
          options: [
            "Ce n'est jamais risqué",
            "Le cast échoue bruyamment (erreur) dès qu'il rencontre un format non reconnu, arrêtant toute la requête",
            "PostgreSQL ignore silencieusement les formats non reconnus",
          ],
          correct_index: 1,
          explain: "Une approche défensive (CASE + to_timestamp, ou NULL en repli) évite qu'une seule ligne mal formée fasse tout planter.",
        },
        {
          question: "Que faire des lignes dont le format de date n'est reconnu par AUCUNE règle de parsing ?",
          options: [
            "Les ignorer silencieusement pour toujours",
            "Les marquer (ex. NULL) et les investiguer séparément, plutôt que de planter tout le pipeline",
            "Forcer un cast qui échouera",
          ],
          correct_index: 1,
          explain: "Isoler l'anomalie permet de continuer à traiter le reste du batch tout en gardant trace du problème.",
        },
      ],
    },

    {
      number: "2.7.8",
      slug: "data-quality-integrite-referentielle",
      title: "Data Quality : intégrité référentielle",
      parentSlug: "data-warehouse-pipelines-qualite",
      duration_minutes: 25,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une extraction brute n'a généralement AUCUNE contrainte de clé étrangère appliquée (contrairement aux tables Gold, protégées par le moteur) — vérifier l'intégrité référentielle devient donc une étape manuelle explicite avant de faire confiance à une jointure.",
          },
          {
            type: "sql_code",
            text: "-- Intégrité référentielle : merchant_id de la source qui n'existe pas dans dim_merchant\nselect distinct b.merchant_id\nfrom raw_transactions_bronze b\nleft join dim_merchant m on m.merchant_id = b.merchant_id::int\nwhere m.merchant_id is null;",
          },
          {
            type: "callout",
            title: "D'où viennent des merchant_id orphelins dans une vraie entreprise",
            text: "Un marchand supprimé de dim_merchant après désactivation, un délai de synchronisation entre deux systèmes sources, ou simplement une erreur de saisie côté application — les causes réelles sont multiples, mais le symptôme (une clé étrangère qui ne référence plus rien) est toujours détectable de la même façon.",
          },
          {
            type: "sql_code",
            text: "-- Quantifier l'ampleur du problème avant de décider quoi en faire\nselect\n  count(*) as total_lignes,\n  count(*) filter (\n    where merchant_id::int not in (select merchant_id from dim_merchant)\n  ) as lignes_merchant_orphelin\nfrom raw_transactions_bronze\nwhere merchant_id is not null;",
          },
          {
            type: "p",
            text: "Face à des lignes orphelines, trois options existent : les exclure (perte de données, mais Silver reste propre), les charger avec une valeur \"marchand inconnu\" par défaut (conserve le volume, perd le détail), ou bloquer le pipeline pour investigation manuelle (le plus sûr, le plus lent). Le bon choix dépend de la criticité métier — AfriPay choisit ici de les exclure en Silver (Leçon 2.7.9).",
          },
          {
            type: "sql_sandbox",
            prompt: "Vérifie s'il existe des customer_id dans raw_transactions_bronze qui n'existent pas dans dim_customer.",
            starterQuery:
              "select distinct b.customer_id\nfrom raw_transactions_bronze b\nleft join dim_customer c on c.customer_id = b.customer_id::int\nwhere b.customer_id is not null and c.customer_id is null;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi l'intégrité référentielle doit-elle être vérifiée manuellement sur une extraction brute ?",
          options: [
            "Elle est automatiquement garantie par PostgreSQL",
            "Une table brute n'a généralement aucune contrainte de clé étrangère appliquée, contrairement aux tables Gold",
            "Ce n'est jamais nécessaire",
          ],
          correct_index: 1,
          explain: "Les contraintes FK protègent les tables Gold, mais une extraction Bronze accepte tout, y compris des références invalides.",
        },
        {
          question: "Face à des lignes avec un merchant_id orphelin, quelle option préserve le volume tout en documentant le problème ?",
          options: [
            "Les exclure silencieusement sans laisser de trace",
            "Les charger avec une valeur 'marchand inconnu' par défaut plutôt que de les perdre complètement",
            "Planter le pipeline systématiquement",
          ],
          correct_index: 1,
          explain: "Le bon choix dépend du contexte métier — mais documenter le compromis choisi est toujours nécessaire.",
        },
      ],
    },

    {
      number: "2.7.9",
      slug: "construire-couche-silver-nettoyer-bronze",
      title: "Construire la couche Silver : nettoyer raw_transactions_bronze",
      parentSlug: "data-warehouse-pipelines-qualite",
      duration_minutes: 30,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Silver applique, en une seule requête cohérente, toutes les règles de qualité vues dans ce chapitre : retirer les NULL critiques, garder uniquement les clés étrangères valides, et convertir les types proprement.",
          },
          {
            type: "sql_code",
            text: "-- Construction de la couche Silver : chaque règle de qualité appliquée explicitement\ncreate table if not exists stg_transactions_silver as\nselect\n  b.transaction_id::int as transaction_id,\n  b.customer_id::int as customer_id,\n  b.merchant_id::int as merchant_id,\n  b.country_code,\n  b.transaction_at_raw::timestamptz as transaction_at,\n  b.amount_local::numeric as amount_local,\n  b.currency_code,\n  b.channel,\n  b.status\nfrom raw_transactions_bronze b\nwhere b.customer_id is not null                                          -- retire les clients manquants (Leçon 2.7.6)\n  and b.amount_local is not null                                         -- retire les montants manquants (Leçon 2.7.6)\n  and b.transaction_at_raw ~ '^\\d{4}-\\d{2}-\\d{2}'                        -- garde uniquement les dates au format reconnu (Leçon 2.7.7)\n  and b.merchant_id::int in (select merchant_id from dim_merchant);       -- garde uniquement les merchant_id valides (Leçon 2.7.8)",
          },
          {
            type: "callout",
            title: "Chaque ligne de WHERE documente une décision de qualité, pas juste un filtre",
            text: "Un futur lecteur de ce script doit comprendre POURQUOI chaque condition existe, pas seulement CE QU'elle fait — c'est pour ça que les commentaires inline référencent explicitement quelle règle de qualité chaque ligne applique.",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Compare le nombre de lignes brutes au nombre de lignes qui passeraient les critères de la couche Silver.",
            starterQuery:
              "select count(*) as lignes_brutes,\n  count(*) filter (\n    where customer_id is not null\n    and amount_local is not null\n    and transaction_at_raw ~ '^\\d{4}-\\d{2}-\\d{2}'\n    and merchant_id::int in (select merchant_id from dim_merchant)\n  ) as lignes_propres_silver\nfrom raw_transactions_bronze;",
          },
          {
            type: "thinking_prompt",
            text: "Si 4% des lignes brutes sont rejetées en Silver, est-ce acceptable ? La réponse dépend entièrement du contexte métier — 4% de transactions financières perdues silencieusement peut être un incident grave, alors que 4% de logs d'un système non critique peut être un bruit de fond normal. Le chiffre seul ne dit rien sans ce contexte.",
          },
        ],
      },
      quiz: [
        {
          question: "Que fait la couche Silver de raw_transactions_bronze par rapport à Bronze ?",
          options: [
            "Elle garde exactement les mêmes lignes, sans aucun filtre",
            "Elle applique les règles de qualité (NULL, formats, intégrité référentielle) pour ne garder que les lignes fiables",
            "Elle supprime toutes les lignes"
          ],
          correct_index: 1,
          explain: "C'est la définition même de Silver : nettoyée et conformée, prête à être jointe en confiance.",
        },
        {
          question: "Pourquoi documenter dans le SQL POURQUOI chaque condition WHERE existe, pas seulement ce qu'elle fait ?",
          options: [
            "Pour respecter une convention arbitraire",
            "Pour qu'un futur lecteur comprenne la décision de qualité derrière chaque filtre, pas juste son effet mécanique",
            "PostgreSQL l'exige pour exécuter la requête",
          ],
          correct_index: 1,
          explain: "Un WHERE sans contexte devient un mystère six mois plus tard — le commentaire préserve l'intention.",
        },
      ],
    },

    {
      number: "2.7.10",
      slug: "couche-gold-atelier-synthese-chapitre-2-7",
      title: "La couche Gold et atelier de synthèse du chapitre",
      parentSlug: "data-warehouse-pipelines-qualite",
      duration_minutes: 30,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "La couche Gold, tu la connais déjà : c'est le star schema AfriPay construit au Chapitre 2.6 (fact_transactions + dimensions). Ce qui change ici, c'est de comprendre COMMENT elle est alimentée depuis Silver — via exactement le chargement idempotent (CDC/ON CONFLICT) vu en 2.7.4-2.7.5.",
          },
          {
            type: "p",
            text: "dim_date, déjà en place avec year/quarter/month/week/is_weekend pour chaque jour sur 2 ans, illustre bien une dimension Gold : elle n'a besoin d'aucun pipeline récurrent, car son contenu est entièrement déterministe et peut être généré une fois pour plusieurs années à l'avance.",
          },
          {
            type: "sql_sandbox",
            prompt: "Explore dim_date pour confirmer qu'elle couvre bien 2 années complètes.",
            starterQuery:
              "select min(date) as premiere_date, max(date) as derniere_date, count(*) as nb_jours\nfrom dim_date;",
          },
          { type: "h3", text: "Atelier de synthèse — tout le chapitre en une session" },
          {
            type: "checklist",
            title: "Tu es prêt·e pour le Chapitre 2.8 si tu peux répondre oui à chaque point",
            items: [
              "Je sais expliquer la responsabilité de chacune des trois couches Bronze/Silver/Gold",
              "Je sais pourquoi un pipeline DOIT être idempotent avant d'aller en production",
              "Je sais écrire un ON CONFLICT DO UPDATE qui ne met à jour que les colonnes pertinentes",
              "Je sais détecter des NULL, des doublons, des dates invalides et des références orphelines",
              "Je sais documenter dans le SQL lui-même pourquoi chaque règle de qualité existe",
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Livrable — construis la couche Silver complète (nettoie raw_transactions_bronze selon toutes les règles vues), et compare le nombre de lignes conservées à l'original.",
            starterQuery:
              "select count(*) as lignes_brutes,\n  count(*) filter (\n    where customer_id is not null\n    and amount_local is not null\n    and transaction_at_raw ~ '^\\d{4}-\\d{2}-\\d{2}'\n    and merchant_id::int in (select merchant_id from dim_merchant)\n  ) as lignes_propres\nfrom raw_transactions_bronze;",
          },
        ],
      },
      quiz: [
        {
          question: "Comment la couche Gold (fact_transactions + dimensions) est-elle alimentée depuis Silver ?",
          options: [
            "Par un simple DELETE puis INSERT complet à chaque exécution",
            "Via un chargement idempotent (CDC/ON CONFLICT) qui n'insère ou ne met à jour que ce qui a changé",
            "Manuellement, ligne par ligne",
          ],
          correct_index: 1,
          explain: "C'est la combinaison de tout ce chapitre : Bronze brut → Silver nettoyé → Gold via chargement idempotent.",
        },
        {
          question: "Pourquoi dim_date n'a-t-elle pas besoin d'un pipeline récurrent quotidien ?",
          options: [
            "Parce qu'elle est vide",
            "Parce que son contenu est entièrement déterministe et peut être généré à l'avance pour plusieurs années",
            "Parce qu'elle n'est jamais utilisée"
          ],
          correct_index: 1,
          explain: "Une date, son trimestre, son mois : rien de tout ça ne change une fois calculé — contrairement aux faits transactionnels.",
        },
        {
          question: "Un traitement idempotent garantit que :",
          options: [
            "Il s'exécute plus vite à chaque relance",
            "Le relancer plusieurs fois produit le même résultat qu'une seule exécution",
            "Il ne peut jamais échouer",
          ],
          correct_index: 1,
          explain: "C'est la propriété qui rend un pipeline sûr à relancer après un échec partiel — le fil conducteur de tout ce chapitre.",
        },
      ],
    },

    // ============================================================
    // CHAPITRE 2.8 — PERFORMANCE & TUNING
    // ============================================================
    {
      number: "2.8",
      slug: "performance-et-tuning",
      title: "Performance & tuning",
      duration_minutes: 15,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une requête correcte qui met douze secondes au lieu de douze millisecondes n'est pas juste lente — à l'échelle d'un pipeline de production qui l'exécute des milliers de fois par jour, c'est une facture cloud qui explose et des utilisateurs qui attendent.",
          },
          {
            type: "checklist",
            title: "Les 10 leçons de ce chapitre",
            items: [
              "2.8.1 — Index B-tree simple : accélérer une recherche",
              "2.8.2 — Index composite : l'ordre des colonnes compte",
              "2.8.3 — Index partiel : cibler un sous-ensemble",
              "2.8.4 — Quand NE PAS indexer",
              "2.8.5 — Lire un plan EXPLAIN ANALYZE",
              "2.8.6 — Seq Scan vs Index Scan",
              "2.8.7 — Hash Join, Nested Loop, Merge Join",
              "2.8.8 — Partitionnement par plage de dates",
              "2.8.9 — Anti-patterns courants (SELECT *, cast implicite)",
              "2.8.10 — Pagination par clé (keyset) et atelier de synthèse",
            ],
          },
        ],
      },
      quiz: [],
    },

    {
      number: "2.8.1",
      slug: "index-btree-simple",
      title: "Index B-tree simple : accélérer une recherche",
      parentSlug: "performance-et-tuning",
      duration_minutes: 25,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un index B-tree (le type par défaut en PostgreSQL) fonctionne comme l'index d'un livre : plutôt que de parcourir chaque page une par une, le moteur consulte une structure triée qui pointe directement vers les lignes recherchées.",
          },
          {
            type: "sql_code",
            text: "-- Index simple — accélère les recherches et filtres par country_code\ncreate index idx_transactions_country on fact_transactions(country_code);\n\n-- Une recherche par country_code peut désormais éviter de scanner toute la table\nselect * from fact_transactions where country_code = 'SN';",
          },
          {
            type: "callout",
            title: "Un index accélère les WHERE, JOIN et ORDER BY sur la colonne indexée",
            text: "Un index B-tree sert trois usages : une recherche par égalité (WHERE col = valeur), une comparaison d'intervalle (WHERE col BETWEEN ...), et un tri déjà ordonné (ORDER BY col) sans recalcul. Sans index, chacun de ces trois cas oblige potentiellement à lire toute la table.",
          },
          {
            type: "p",
            text: "PRIMARY KEY et UNIQUE créent automatiquement un index B-tree en arrière-plan — c'est ce qui rend une recherche par clé primaire quasi instantanée même sur une table de plusieurs millions de lignes, sans qu'aucun index explicite n'ait été créé manuellement.",
          },
          {
            type: "sql_sandbox",
            prompt: "Liste les index déjà existants sur fact_transactions (y compris ceux créés automatiquement par les contraintes).",
            starterQuery:
              "select indexname, indexdef\nfrom pg_indexes\nwhere tablename = 'fact_transactions';",
          },
        ],
      },
      quiz: [
        {
          question: "Quel est le type d'index par défaut en PostgreSQL ?",
          options: ["Hash", "B-tree", "GIN"],
          correct_index: 1,
          explain: "B-tree convient à la grande majorité des cas : égalité, intervalle, tri.",
        },
        {
          question: "Une contrainte PRIMARY KEY crée-t-elle automatiquement un index ?",
          options: ["Non, jamais", "Oui — c'est ce qui rend une recherche par clé primaire quasi instantanée", "Seulement sur demande explicite"],
          correct_index: 1,
          explain: "PRIMARY KEY et UNIQUE créent toujours un index B-tree en arrière-plan.",
        },
      ],
    },

    {
      number: "2.8.2",
      slug: "index-composite-ordre-colonnes",
      title: "Index composite : l'ordre des colonnes compte",
      parentSlug: "performance-et-tuning",
      duration_minutes: 25,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un index composite couvre plusieurs colonnes à la fois — utile quand des requêtes filtrent régulièrement sur la MÊME combinaison de colonnes. Mais l'ordre dans lequel elles sont déclarées n'est pas arbitraire : il détermine quelles requêtes peuvent réellement en profiter.",
          },
          {
            type: "sql_code",
            text: "-- Index composite — utile si les requêtes filtrent country_code ET channel ensemble\ncreate index idx_transactions_country_channel on fact_transactions(country_code, channel);\n\n-- Profite pleinement de l'index (utilise les deux colonnes, dans l'ordre)\nselect * from fact_transactions where country_code = 'CI' and channel = 'mobile_money';\n\n-- Profite PARTIELLEMENT de l'index (utilise seulement la première colonne)\nselect * from fact_transactions where country_code = 'CI';",
          },
          {
            type: "callout",
            title: "🪤 Un filtre sur la SEULE deuxième colonne n'utilise généralement pas l'index",
            text: "`where channel = 'mobile_money'` seul (sans country_code) ne peut généralement PAS utiliser idx_transactions_country_channel efficacement — un index composite se comporte comme l'index d'un annuaire téléphonique trié par (nom, prénom) : chercher par prénom seul ne permet pas de sauter directement au bon endroit, il faut parcourir l'ensemble.",
          },
          {
            type: "p",
            text: "Règle pratique : place en premier la colonne la plus souvent filtrée SEULE ou avec la plus forte sélectivité (celle qui élimine le plus de lignes), et les colonnes complémentaires ensuite, dans l'ordre de fréquence d'utilisation combinée.",
          },
          {
            type: "sql_sandbox",
            prompt: "Crée un index composite sur (channel, status) et vérifie qu'il apparaît bien dans pg_indexes.",
            starterQuery:
              "create index if not exists idx_transactions_channel_status on fact_transactions(channel, status);\n\nselect indexname, indexdef from pg_indexes where tablename = 'fact_transactions';",
          },
        ],
      },
      quiz: [
        {
          question: "Un index composite sur (country_code, channel) profite-t-il pleinement à un filtre sur channel SEUL ?",
          options: ["Oui, exactement de la même façon", "Généralement non — il faut inclure la première colonne pour en profiter pleinement", "Cela dépend uniquement de la taille de la table"],
          correct_index: 1,
          explain: "L'ordre des colonnes d'un index composite détermine quelles requêtes peuvent réellement l'exploiter.",
        },
        {
          question: "Quelle colonne place-t-on généralement en premier dans un index composite ?",
          options: [
            "La colonne la plus souvent filtrée seule ou avec la plus forte sélectivité",
            "Toujours la colonne la plus courte en taille",
            "Peu importe, l'ordre n'a aucun effet",
          ],
          correct_index: 0,
          explain: "C'est ce qui maximise le nombre de requêtes différentes capables de profiter de l'index.",
        },
      ],
    },

    {
      number: "2.8.3",
      slug: "index-partiel-cibler-sous-ensemble",
      title: "Index partiel : cibler un sous-ensemble",
      parentSlug: "performance-et-tuning",
      duration_minutes: 20,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un index partiel n'indexe qu'un SOUS-ENSEMBLE des lignes d'une table, défini par une condition WHERE dans sa propre déclaration — plus petit, plus rapide à maintenir, et souvent suffisant quand seule une minorité de lignes est réellement interrogée fréquemment.",
          },
          {
            type: "sql_code",
            text: "-- Index partiel — ne couvre que les transactions échouées, minuscule et ciblé\ncreate index idx_transactions_failed on fact_transactions(transaction_id) where status = 'failed';\n\n-- Ce filtre profite pleinement de l'index partiel, car sa condition correspond exactement\nselect * from fact_transactions where status = 'failed' and transaction_id = 4210;",
          },
          {
            type: "callout",
            title: "Le cas d'usage typique : une file de traitement ou un état minoritaire",
            text: "Si 99% des transactions ont le statut 'completed' et seulement 1% 'failed', un index PARTIEL sur les transactions échouées est bien plus léger qu'un index complet sur toute la colonne status — utile par exemple pour une équipe support qui interroge quasi exclusivement les transactions en échec.",
          },
          {
            type: "p",
            text: "La condition WHERE de l'index partiel doit correspondre (ou être un sous-ensemble compatible) à la condition WHERE de la requête pour que l'index soit utilisé — un index partiel `where status = 'failed'` ne sert à rien pour une requête qui filtre sur `status = 'completed'`.",
          },
          {
            type: "sql_sandbox",
            prompt: "Crée un index partiel sur les transactions de plus de 1000 (potentiellement à surveiller), puis vérifie sa définition.",
            starterQuery:
              "create index if not exists idx_transactions_high_value on fact_transactions(transaction_id) where amount_local > 1000;\n\nselect indexname, indexdef from pg_indexes where indexname = 'idx_transactions_high_value';",
          },
        ],
      },
      quiz: [
        {
          question: "Qu'est-ce qui distingue un index partiel d'un index classique ?",
          options: [
            "Il indexe toutes les colonnes de la table",
            "Il n'indexe qu'un sous-ensemble de lignes, défini par une condition WHERE propre à l'index",
            "Il ne peut jamais être utilisé pour une recherche"
          ],
          correct_index: 1,
          explain: "Plus petit et plus rapide à maintenir qu'un index complet, tant que la requête cible ce même sous-ensemble.",
        },
        {
          question: "Un index partiel `where status = 'failed'` est-il utile pour une requête qui filtre sur `status = 'completed'` ?",
          options: [
            "Oui, toujours",
            "Non — la condition de l'index ne correspond pas à celle de la requête",
            "Seulement si la table est petite",
          ],
          correct_index: 1,
          explain: "La condition WHERE de l'index doit être compatible avec celle de la requête pour être exploitée.",
        },
      ],
    },

    {
      number: "2.8.4",
      slug: "quand-ne-pas-indexer",
      title: "Quand NE PAS indexer",
      parentSlug: "performance-et-tuning",
      duration_minutes: 20,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "callout",
            title: "Chaque index a un coût, pas seulement un bénéfice",
            text: "Un index accélère les LECTURES mais ralentit chaque ÉCRITURE (l'index doit être mis à jour à chaque INSERT/UPDATE/DELETE) et consomme de l'espace disque supplémentaire. Indexer une colonne rarement filtrée, ou une table qui reçoit énormément d'écritures et peu de lectures, coûte souvent plus qu'il ne rapporte.",
          },
          {
            type: "table",
            headers: ["Situation", "Indexer ou non ?"],
            rows: [
              ["Colonne filtrée dans la majorité des requêtes lues", "Oui — le gain de lecture dépasse largement le coût d'écriture"],
              ["Colonne quasiment jamais utilisée dans un WHERE/JOIN/ORDER BY", "Non — coût de maintenance sans aucun bénéfice"],
              ["Table à très fort volume d'écriture, peu de lectures (ex. table de logs bruts)", "Réfléchir à deux fois — chaque index ralentit chaque écriture"],
              ["Colonne à très faible cardinalité (ex. boolean avec 90% de 'true')", "Souvent inutile — le moteur préfère parfois un Seq Scan de toute façon"],
            ],
          },
          {
            type: "sql_code",
            text: "-- Vérifier si un index existant est réellement utilisé (statistiques d'usage)\nselect indexrelname, idx_scan\nfrom pg_stat_user_indexes\nwhere relname = 'fact_transactions';",
            caption: "idx_scan proche de zéro après une période d'usage normale signale un index candidat à la suppression.",
          },
          {
            type: "thinking_prompt",
            text: "Un index jamais utilisé n'est pas neutre — il continue de coûter de l'espace et de ralentir chaque écriture, sans jamais rien apporter en retour. Vérifier périodiquement l'usage réel des index (pg_stat_user_indexes) fait partie de la maintenance normale d'une base en production.",
          },
          {
            type: "sql_sandbox",
            prompt: "Vérifie l'usage réel de tous les index existants sur fact_transactions.",
            starterQuery:
              "select indexrelname, idx_scan, idx_tup_read\nfrom pg_stat_user_indexes\nwhere relname = 'fact_transactions'\norder by idx_scan;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi ne faut-il pas indexer systématiquement toutes les colonnes ?",
          options: [
            "PostgreSQL limite le nombre d'index",
            "Chaque index ralentit les écritures et consomme de l'espace",
            "Les index ne fonctionnent qu'une fois",
          ],
          correct_index: 1,
          explain: "Un index a un coût de maintenance à chaque écriture — il faut qu'il soit rentabilisé par des lectures fréquentes.",
        },
        {
          question: "Comment vérifier si un index existant est réellement utilisé en pratique ?",
          options: [
            "Il n'existe aucun moyen de le savoir",
            "En consultant pg_stat_user_indexes et son compteur idx_scan",
            "En comptant le nombre de colonnes de la table",
          ],
          correct_index: 1,
          explain: "Un idx_scan proche de zéro après une période normale d'usage signale un index candidat à la suppression.",
        },
      ],
    },

    {
      number: "2.8.5",
      slug: "lire-plan-explain-analyze",
      title: "Lire un plan EXPLAIN ANALYZE",
      parentSlug: "performance-et-tuning",
      duration_minutes: 25,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "EXPLAIN ANALYZE ne devine pas — il EXÉCUTE réellement la requête et rapporte ce que le moteur a fait à chaque étape : quelle méthode d'accès, combien de lignes réellement traitées, et combien de temps chaque étape a pris.",
          },
          {
            type: "sql_code",
            text: "explain analyze\nselect * from fact_transactions where country_code = 'CI' and channel = 'mobile_money';",
          },
          {
            type: "callout",
            title: "EXPLAIN seul vs EXPLAIN ANALYZE — une différence importante",
            text: "EXPLAIN (sans ANALYZE) montre le plan PRÉVU par le moteur, sans exécuter la requête — rapide, mais basé sur des estimations statistiques qui peuvent être fausses. EXPLAIN ANALYZE exécute réellement la requête et compare le prévu au réel — plus lent (la requête tourne pour de vrai), mais bien plus fiable pour diagnostiquer un problème de performance réel.",
          },
          {
            type: "p",
            text: "Deux chiffres à toujours comparer dans un plan EXPLAIN ANALYZE : le nombre de lignes ESTIMÉ par le planificateur (rows=...) versus le nombre de lignes RÉELLEMENT obtenu (actual rows=...). Un grand écart entre les deux signale des statistiques périmées, souvent corrigeable par un ANALYZE explicite sur la table.",
          },
          {
            type: "sql_code",
            text: "-- Rafraîchir les statistiques utilisées par le planificateur, si elles semblent périmées\nanalyze fact_transactions;",
          },
          {
            type: "sql_sandbox",
            prompt: "Compare EXPLAIN et EXPLAIN ANALYZE sur la même requête.",
            starterQuery:
              "explain select * from fact_transactions where country_code = 'MA';",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle différence essentielle entre EXPLAIN seul et EXPLAIN ANALYZE ?",
          options: [
            "Aucune différence",
            "EXPLAIN ANALYZE exécute réellement la requête et compare l'estimé au réel ; EXPLAIN seul ne fait qu'estimer",
            "EXPLAIN ANALYZE ne fonctionne que sur de petites tables",
          ],
          correct_index: 1,
          explain: "C'est ce qui rend EXPLAIN ANALYZE plus fiable pour diagnostiquer un vrai problème de performance.",
        },
        {
          question: "Un grand écart entre rows (estimé) et actual rows (réel) dans un plan signale généralement :",
          options: [
            "Une erreur de syntaxe",
            "Des statistiques périmées du planificateur, corrigeables par un ANALYZE explicite",
            "Un index manquant obligatoirement",
          ],
          correct_index: 1,
          explain: "ANALYZE rafraîchit les statistiques que le planificateur utilise pour estimer le coût des différents plans possibles.",
        },
      ],
    },

    {
      number: "2.8.6",
      slug: "seq-scan-vs-index-scan",
      title: "Seq Scan vs Index Scan",
      parentSlug: "performance-et-tuning",
      duration_minutes: 25,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Ce sont les deux façons fondamentales dont PostgreSQL peut accéder aux lignes d'une table — comprendre lequel un plan choisit, et pourquoi, est la compétence de base du tuning de requêtes.",
          },
          {
            type: "table",
            headers: ["Méthode d'accès", "Comportement", "Situation typique"],
            rows: [
              ["Seq Scan", "Lit la table entière, ligne par ligne, du début à la fin", "Normal sur une petite table ; potentiellement coûteux sur des millions de lignes sans filtre sélectif"],
              ["Index Scan", "Utilise un index pour sauter directement aux lignes pertinentes, puis va chercher chaque ligne dans la table", "Efficace quand peu de lignes correspondent au filtre (haute sélectivité)"],
              ["Index Only Scan", "Comme Index Scan, mais sans jamais toucher la table — toutes les colonnes demandées sont déjà dans l'index", "Le plus rapide des trois, mais rare (nécessite un index qui couvre TOUTES les colonnes du SELECT)"],
            ],
          },
          {
            type: "callout",
            title: "Un Seq Scan n'est pas toujours un problème",
            text: "Sur une petite table (quelques milliers de lignes), un Seq Scan est souvent PLUS rapide qu'un Index Scan — le coût de consulter l'index puis d'aller chercher chaque ligne dans la table peut dépasser le coût de tout lire directement. Le planificateur PostgreSQL choisit généralement le bon plan automatiquement ; le vrai signal d'alerte est un Seq Scan sur une GRANDE table avec un filtre très sélectif qui devrait normalement utiliser un index existant.",
          },
          {
            type: "sql_code",
            text: "-- Forcer artificiellement la comparaison (à des fins pédagogiques uniquement, jamais en production)\nset enable_seqscan = off;\nexplain select * from fact_transactions where country_code = 'CI';\nset enable_seqscan = on;  -- toujours réactiver ensuite",
          },
          {
            type: "sql_sandbox",
            prompt: "Observe le plan d'exécution sur fact_transactions filtré par country_code, avec l'index déjà créé en 2.8.1.",
            starterQuery:
              "explain analyze select * from fact_transactions where country_code = 'CI';",
          },
        ],
      },
      quiz: [
        {
          question: "Dans un plan EXPLAIN ANALYZE, un Seq Scan signifie :",
          options: [
            "Une erreur de requête",
            "Le moteur lit la table entière, ligne par ligne",
            "Un index a été utilisé avec succès",
          ],
          correct_index: 1,
          explain: "Normal sur une petite table ; potentiellement coûteux à grande échelle si un index aurait pu être utilisé.",
        },
        {
          question: "Qu'est-ce qui rend un Index Only Scan encore plus rapide qu'un Index Scan classique ?",
          options: [
            "Il ne touche jamais la table elle-même, si l'index couvre déjà toutes les colonnes demandées",
            "Il ignore les conditions WHERE",
            "Aucune différence réelle entre les deux"
          ],
          correct_index: 0,
          explain: "L'Index Scan classique doit encore aller chercher les colonnes non couvertes dans la table elle-même — l'Index Only Scan évite complètement cette étape.",
        },
      ],
    },

    {
      number: "2.8.7",
      slug: "hash-join-nested-loop-merge-join",
      title: "Hash Join, Nested Loop, Merge Join",
      parentSlug: "performance-et-tuning",
      duration_minutes: 25,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une jointure peut s'exécuter physiquement de trois façons différentes — le choix appartient entièrement au planificateur PostgreSQL, selon la taille des tables et les index disponibles.",
          },
          {
            type: "table",
            headers: ["Algorithme", "Fonctionnement", "Efficace quand"],
            rows: [
              ["Hash Join", "Construit une table de hachage en mémoire pour l'un des deux côtés (le plus petit), puis parcourt l'autre côté en cherchant les correspondances", "Un des deux côtés tient confortablement en mémoire — le cas le plus fréquent sur des jointures de taille moyenne"],
              ["Nested Loop", "Compare chaque ligne d'un côté à chaque ligne de l'autre, dans une double boucle", "Efficace seulement sur de très petits volumes, ou quand un index permet d'éviter la boucle complète côté droit"],
              ["Merge Join", "Fusionne deux ensembles déjà triés sur la clé de jointure, comme fusionner deux piles de cartes déjà ordonnées", "Les deux côtés sont déjà triés (ou un tri est peu coûteux) sur la colonne de jointure"],
            ],
          },
          {
            type: "sql_code",
            text: "explain analyze\nselect t.transaction_id, m.merchant_name\nfrom fact_transactions t\njoin dim_merchant m on m.merchant_id = t.merchant_id;",
            caption: "dim_merchant est petite (50 lignes) — le planificateur choisit très probablement un Hash Join, la table de hachage tenant facilement en mémoire.",
          },
          {
            type: "callout",
            title: "Pourquoi Nested Loop n'est pas \"le mauvais\" algorithme",
            text: "Un Nested Loop sur une jointure où la table de droite a un index sur sa colonne de jointure peut être TRÈS rapide — chaque ligne de gauche va chercher directement sa correspondance via l'index, sans jamais parcourir toute la table de droite. Le problème survient uniquement quand Nested Loop est choisi SANS index disponible, sur de gros volumes des deux côtés — alors chaque comparaison devient un Seq Scan répété.",
          },
          {
            type: "sql_sandbox",
            prompt: "Observe quel algorithme de jointure le planificateur choisit pour joindre fact_transactions à dim_merchant.",
            starterQuery:
              "explain analyze\nselect t.transaction_id, m.merchant_name\nfrom fact_transactions t\njoin dim_merchant m on m.merchant_id = t.merchant_id\nlimit 100;",
          },
        ],
      },
      quiz: [
        {
          question: "Un Hash Join construit une table de hachage en mémoire pour :",
          options: ["Les deux côtés de la jointure toujours", "Un seul côté, généralement le plus petit", "Aucun des deux côtés"],
          correct_index: 1,
          explain: "C'est ce qui rend le Hash Join efficace quand un côté tient confortablement en mémoire.",
        },
        {
          question: "Un Nested Loop peut-il être rapide, même sur un volume important d'un côté ?",
          options: [
            "Non, jamais",
            "Oui — si la table de droite a un index sur sa colonne de jointure, évitant un parcours complet à chaque itération",
            "Seulement si les deux tables sont vides",
          ],
          correct_index: 1,
          explain: "Le problème n'est pas Nested Loop en soi, mais son usage SANS index disponible sur de gros volumes.",
        },
      ],
    },

    {
      number: "2.8.8",
      slug: "partitionnement-plage-dates",
      title: "Partitionnement par plage de dates",
      parentSlug: "performance-et-tuning",
      duration_minutes: 25,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Le partitionnement découpe physiquement une grande table en plusieurs tables plus petites (des partitions), tout en la présentant comme une seule table logique aux requêtes — une technique essentielle quand une table dépasse plusieurs dizaines de millions de lignes.",
          },
          {
            type: "sql_code",
            text: "-- Partitionnement par plage de dates — chaque requête filtrée par date ne scanne qu'une partition\ncreate table fact_transactions_partitioned (like fact_transactions)\n  partition by range (transaction_at);\n\ncreate table fact_transactions_2024 partition of fact_transactions_partitioned\n  for values from ('2024-01-01') to ('2025-01-01');\n\ncreate table fact_transactions_2025 partition of fact_transactions_partitioned\n  for values from ('2025-01-01') to ('2026-01-01');",
          },
          {
            type: "callout",
            title: "Partition pruning : l'avantage principal du partitionnement",
            text: "Le partition pruning permet au moteur d'IGNORER ENTIÈREMENT les partitions hors du filtre de date, sans même les ouvrir. Une requête sur \"le mois dernier\" n'a jamais besoin de toucher les partitions des années précédentes — contrairement à une table non partitionnée, où un index doit être parcouru même s'il exclut rapidement les lignes non pertinentes.",
          },
          {
            type: "p",
            text: "Le partitionnement facilite aussi la maintenance : archiver ou supprimer \"toutes les transactions de 2022\" devient un simple DROP TABLE sur la partition correspondante — quasi instantané, contrairement à un DELETE massif sur une table non partitionnée qui devrait parcourir et verrouiller des millions de lignes une par une.",
          },
          {
            type: "sql_code",
            text: "-- Vérifier quelles partitions une requête va réellement toucher (partition pruning visible dans EXPLAIN)\nexplain select * from fact_transactions_partitioned\nwhere transaction_at >= '2024-06-01' and transaction_at < '2024-07-01';",
          },
          {
            type: "sql_sandbox",
            prompt: "Liste les partitions existantes de fact_transactions_partitioned.",
            starterQuery:
              "select inhrelid::regclass as partition\nfrom pg_inherits\nwhere inhparent = 'fact_transactions_partitioned'::regclass;",
          },
        ],
      },
      quiz: [
        {
          question: "Quel est le principal avantage du partition pruning ?",
          options: [
            "Il trie automatiquement les données",
            "Le moteur ignore entièrement les partitions hors du filtre, sans même les ouvrir",
            "Il supprime automatiquement les anciennes données"
          ],
          correct_index: 1,
          explain: "Une requête sur \"le mois dernier\" n'a jamais besoin de toucher les partitions des années précédentes.",
        },
        {
          question: "Pourquoi le partitionnement facilite-t-il l'archivage de données anciennes ?",
          options: [
            "Il ne facilite rien de particulier",
            "Supprimer une partition entière (DROP TABLE) est quasi instantané, contrairement à un DELETE massif ligne par ligne",
            "Le partitionnement empêche toute suppression de données"
          ],
          correct_index: 1,
          explain: "DROP TABLE sur une partition évite le coût d'un DELETE qui devrait parcourir et verrouiller des millions de lignes.",
        },
      ],
    },

    {
      number: "2.8.9",
      slug: "anti-patterns-select-star-cast-implicite",
      title: "Anti-patterns courants (SELECT *, cast implicite)",
      parentSlug: "performance-et-tuning",
      duration_minutes: 25,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Certaines habitudes d'écriture SQL, sans être des erreurs de syntaxe, dégradent silencieusement la performance ou empêchent des optimisations que le moteur aurait pu appliquer.",
          },
          { type: "h3", text: "SELECT * en production" },
          {
            type: "callout",
            title: "Pourquoi SELECT * coûte plus cher qu'il n'y paraît",
            text: "SELECT * récupère TOUTES les colonnes, y compris celles jamais utilisées par l'application — plus de données à transférer, et surtout, ça empêche un Index Only Scan (Leçon 2.8.6) dès que l'index ne couvre pas la totalité des colonnes de la table. Nommer explicitement les colonnes nécessaires permet au moteur d'exploiter des optimisations invisibles avec SELECT *.",
          },
          {
            type: "sql_code",
            text: "-- ❌ Récupère toutes les colonnes, même channel_metadata (JSONB, potentiellement volumineux) inutilisé ici\nselect * from fact_transactions where country_code = 'CI' limit 100;\n\n-- ✅ Ne demande que ce qui est réellement utilisé\nselect transaction_id, amount_local, status from fact_transactions where country_code = 'CI' limit 100;",
          },
          { type: "h3", text: "Cast implicite dans un WHERE" },
          {
            type: "sql_code",
            text: "-- ⚠ merchant_id est un entier ; comparer à une chaîne '12' force un cast implicite qui peut désactiver un index\nselect * from fact_transactions where merchant_id = '12';\n\n-- ✅ Comparer avec le bon type dès le départ évite toute ambiguïté de cast\nselect * from fact_transactions where merchant_id = 12;",
          },
          {
            type: "callout",
            title: "Pourquoi un cast implicite peut désactiver un index",
            text: "Selon le type exact et l'index en place, PostgreSQL doit parfois convertir CHAQUE VALEUR de la colonne indexée pour comparer, ce qui rend l'index inutilisable pour cette requête précise — le moteur bascule alors vers un Seq Scan complet. Écrire directement le bon type dans la requête évite ce problème à la source.",
          },
          {
            type: "sql_sandbox",
            prompt: "Compare les colonnes réellement nécessaires vs SELECT * pour une requête de reporting simple.",
            starterQuery:
              "select country_code, count(*), sum(amount_local)\nfrom fact_transactions\ngroup by country_code;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi SELECT * peut-il empêcher un Index Only Scan ?",
          options: [
            "Ce n'est jamais le cas",
            "Parce qu'il demande toutes les colonnes, y compris celles non couvertes par l'index, forçant un accès à la table",
            "SELECT * est interdit en PostgreSQL",
          ],
          correct_index: 1,
          explain: "Nommer explicitement les colonnes nécessaires permet parfois de rester entièrement dans l'index.",
        },
        {
          question: "Pourquoi comparer une colonne entière à une chaîne de caractères (ex. merchant_id = '12') peut-il désactiver un index ?",
          options: [
            "Ça n'a aucun effet",
            "Le cast implicite nécessaire peut empêcher le moteur d'utiliser l'index existant sur cette colonne",
            "PostgreSQL refuse d'exécuter une telle comparaison",
          ],
          correct_index: 1,
          explain: "Écrire directement le bon type évite ce problème et permet au planificateur d'utiliser l'index normalement.",
        },
      ],
    },

    {
      number: "2.8.10",
      slug: "pagination-par-cle-keyset-atelier-synthese",
      title: "Pagination par clé (keyset) et atelier de synthèse",
      parentSlug: "performance-et-tuning",
      duration_minutes: 30,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "callout",
            title: "🪤 Pourquoi la pagination par OFFSET devient un problème à grande échelle",
            text: "`LIMIT 20 OFFSET 100000` ne \"saute\" pas magiquement les 100 000 premières lignes : le moteur les lit puis les jette. Sur une page profonde, PostgreSQL doit quand même parcourir 100 020 lignes pour n'en renvoyer que 20 — le coût grandit linéairement avec la profondeur de page, peu importe l'index en place.",
          },
          {
            type: "sql_code",
            text: "-- ❌ Pagination par OFFSET : coûteuse sur les pages profondes\nselect * from fact_transactions order by transaction_id limit 20 offset 100000;\n\n-- ✅ Pagination par clé (keyset) : reste rapide quelle que soit la profondeur de page\nselect * from fact_transactions\nwhere transaction_id > 100000   -- le dernier id vu sur la page précédente\norder by transaction_id\nlimit 20;",
          },
          {
            type: "p",
            text: "La pagination par clé exige simplement de retenir le dernier identifiant vu (ou la dernière valeur de tri) entre deux appels — l'application garde ce curseur, plutôt que de demander au moteur de recompter depuis le début à chaque page.",
          },
          { type: "h3", text: "Atelier de synthèse — tout le chapitre en une session" },
          {
            type: "checklist",
            title: "Tu es prêt·e pour le Chapitre 2.9 si tu peux répondre oui à chaque point",
            items: [
              "Je sais créer un index B-tree, composite, et partiel selon le besoin réel",
              "Je sais lire un plan EXPLAIN ANALYZE et repérer Seq Scan vs Index Scan",
              "Je sais qu'un index a un coût d'écriture, pas seulement un bénéfice de lecture",
              "Je sais pourquoi le partitionnement accélère les requêtes filtrées par date",
              "Je sais éviter SELECT * et le cast implicite, et préférer une pagination par clé",
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Livrable — compare le plan d'exécution avant/après un index sur channel, pour une requête de reporting fréquente.",
            starterQuery:
              "explain analyze\nselect channel, count(*), sum(amount_local)\nfrom fact_transactions\nwhere channel = 'mobile_money'\ngroup by channel;",
          },
          {
            type: "thinking_prompt",
            text: "Cette requête met 12 secondes. Le goulot est-il l'absence d'index, une jointure mal ordonnée, ou simplement le volume de données ? EXPLAIN ANALYZE ne donne pas juste un chiffre — il donne la réponse, étape par étape, exactement comme tu l'as pratiqué tout au long de ce chapitre.",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi la pagination par OFFSET devient-elle problématique à grande échelle ?",
          options: [
            "Elle n'est pas supportée par PostgreSQL",
            "Le moteur doit lire puis jeter toutes les lignes avant l'offset demandé",
            "Elle ne fonctionne qu'avec ORDER BY"
          ],
          correct_index: 1,
          explain: "La pagination par clé (keyset) évite ce coût en filtrant directement à partir du dernier identifiant vu.",
        },
        {
          question: "Que doit retenir une application pour implémenter une pagination par clé (keyset) ?",
          options: [
            "Le numéro de la page actuelle uniquement",
            "Le dernier identifiant (ou valeur de tri) vu sur la page précédente",
            "Rien, c'est automatique"
          ],
          correct_index: 1,
          explain: "Ce curseur remplace le besoin de recompter les lignes depuis le début à chaque nouvelle page.",
        },
      ],
    },

    // ============================================================
    // CHAPITRE 2.9 — DBT & ORCHESTRATION
    // ============================================================
    {
      number: "2.9",
      slug: "dbt-et-orchestration",
      title: "Analytics Engineering : dbt & orchestration",
      duration_minutes: 15,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Écrire du SQL qui fonctionne est une chose. Le rendre versionné, testé et documenté — pour qu'une équipe entière puisse s'y fier sans relire chaque requête — en est une autre. C'est le rôle de dbt, et de l'orchestration qui l'entoure.",
          },
          {
            type: "checklist",
            title: "Les 10 leçons de ce chapitre",
            items: [
              "2.9.1 — Pourquoi dbt : gérer le SQL comme du code",
              "2.9.2 — Structure de projet dbt : staging, intermediate, marts",
              "2.9.3 — ref() et le graphe de dépendances",
              "2.9.4 — Tests dbt génériques : unique, not_null, relationships",
              "2.9.5 — Tests dbt personnalisés (singular tests)",
              "2.9.6 — Modèles incrémentaux dbt",
              "2.9.7 — Documentation dbt : schema.yml et dbt docs",
              "2.9.8 — Orchestration : le concept de DAG et de scheduling",
              "2.9.9 — Alerting et échecs silencieux",
              "2.9.10 — Périmètre du module et atelier de synthèse",
            ],
          },
        ],
      },
      quiz: [],
    },

    {
      number: "2.9.1",
      slug: "pourquoi-dbt-sql-comme-du-code",
      title: "Pourquoi dbt : gérer le SQL comme du code",
      parentSlug: "dbt-et-orchestration",
      duration_minutes: 20,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "dbt (data build tool) transforme des fichiers .sql en modèles gérés comme du code : versionnés dans Git, testables automatiquement, documentés, avec un graphe de dépendances explicite entre eux — exactement ce qui manque à un script SQL isolé exécuté manuellement.",
          },
          {
            type: "callout",
            title: "Ce que dbt NE fait PAS",
            text: "dbt ne se connecte à aucune source externe et n'ingère rien — c'est un outil de TRANSFORMATION uniquement. Il prend des données déjà présentes dans l'entrepôt (le T de ELT) et les transforme en modèles propres et testés. L'ingestion (le EL) reste le travail d'autres outils, vus au Module 03.",
          },
          {
            type: "table",
            headers: ["Sans dbt", "Avec dbt"],
            rows: [
              ["Des scripts .sql isolés, exécutés manuellement ou par cron", "Des modèles versionnés, avec un ordre d'exécution géré automatiquement"],
              ["Aucun test automatique de la qualité des résultats", "Des tests exécutés à chaque run (unique, not_null, relationships...)"],
              ["Documentation à jour \"si quelqu'un pense à la maintenir\"", "Documentation générée directement depuis le code (dbt docs)"],
              ["Dépendances entre requêtes gérées manuellement (\"lance ce script après celui-là\")", "Un graphe de dépendances explicite, résolu automatiquement via ref()"],
            ],
          },
          {
            type: "thinking_prompt",
            text: "Tout ce que tu as appris depuis le Chapitre 2.7 (Bronze/Silver/Gold, idempotence, data quality) reste vrai avec dbt — dbt ne remplace pas ces concepts, il leur donne un cadre professionnel : versionné, testé, documenté, reproductible par toute une équipe.",
          },
        ],
      },
      quiz: [
        {
          question: "Le rôle principal de dbt est de :",
          options: [
            "Remplacer PostgreSQL",
            "Gérer des transformations SQL comme du code : versionné, testé, documenté",
            "Ingérer des données depuis des APIs",
          ],
          correct_index: 1,
          explain: "dbt n'ingère rien — il transforme, teste et documente ce qui est déjà dans l'entrepôt.",
        },
        {
          question: "dbt se connecte-t-il directement à des sources de données externes (APIs, fichiers) ?",
          options: [
            "Oui, c'est sa fonction principale",
            "Non — il transforme des données déjà présentes dans l'entrepôt, l'ingestion reste un autre outil",
            "Seulement pour les fichiers CSV",
          ],
          correct_index: 1,
          explain: "dbt couvre le T (transform) de ELT, pas le EL (extract-load), vu au Module 03.",
        },
      ],
    },

    {
      number: "2.9.2",
      slug: "structure-projet-dbt-staging-intermediate-marts",
      title: "Structure de projet dbt : staging, intermediate, marts",
      parentSlug: "dbt-et-orchestration",
      duration_minutes: 20,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un projet dbt organise ses modèles SQL en dossiers qui reflètent directement l'architecture Medallion du Chapitre 2.7 — chaque couche a un rôle et un dossier dédié.",
          },
          {
            type: "code",
            text: "models/\n  staging/\n    stg_transactions.sql      -- nettoyage minimal depuis la source (≈ Silver, Chapitre 2.7)\n  intermediate/\n    int_transactions_usd.sql -- as-of join vers fx_rates (≈ transformation métier intermédiaire)\n  marts/\n    fct_transactions.sql     -- la fact table finale, prête pour le BI (≈ Gold, Chapitre 2.6)",
          },
          {
            type: "table",
            headers: ["Dossier dbt", "Rôle", "Équivalent Medallion"],
            rows: [
              ["staging", "Renommage de colonnes, cast de types, nettoyage minimal — un modèle par table source", "Silver (Chapitre 2.7)"],
              ["intermediate", "Logique métier intermédiaire réutilisée par plusieurs marts (jointures, calculs communs)", "Entre Silver et Gold"],
              ["marts", "Les tables finales consommées par le BI ou les analystes — souvent organisées par domaine métier", "Gold (Chapitre 2.6)"],
            ],
          },
          {
            type: "callout",
            title: "Un modèle staging par table source, jamais plus",
            text: "La convention dbt est stricte : chaque modèle staging correspond à EXACTEMENT une table source, avec un nommage cohérent (stg_<nom_source>). Toute logique de combinaison entre plusieurs sources appartient à la couche intermediate, jamais à staging — cette discipline évite que les modèles staging deviennent des fourre-tout impossibles à réutiliser proprement.",
          },
          {
            type: "sql_code",
            text: "-- models/staging/stg_transactions.sql — nettoyage minimal, un modèle pour une seule source\nselect\n  transaction_id::int as transaction_id,\n  customer_id::int as customer_id,\n  merchant_id::int as merchant_id,\n  transaction_at_raw::timestamptz as transaction_at,\n  amount_local::numeric as amount_local,\n  currency_code,\n  channel,\n  status\nfrom {{ source('raw', 'transactions_bronze') }}\nwhere customer_id is not null",
          },
        ],
      },
      quiz: [
        {
          question: "À quoi correspond approximativement le dossier 'marts' dans l'architecture Medallion vue au Chapitre 2.7 ?",
          options: ["Bronze", "Silver", "Gold"],
          correct_index: 2,
          explain: "marts contient les tables finales, prêtes pour le BI — exactement le rôle de la couche Gold.",
        },
        {
          question: "Combien de tables sources un modèle staging doit-il typiquement couvrir ?",
          options: ["Exactement une", "Toujours toutes les sources à la fois", "Un nombre variable selon la complexité"],
          correct_index: 0,
          explain: "Toute combinaison de plusieurs sources appartient à la couche intermediate, pas à staging.",
        },
      ],
    },

    {
      number: "2.9.3",
      slug: "ref-graphe-dependances",
      title: "ref() et le graphe de dépendances",
      parentSlug: "dbt-et-orchestration",
      duration_minutes: 20,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "ref() est la fonction la plus importante de dbt — elle référence un AUTRE modèle dbt par son nom, jamais par un nom de table en dur, ce qui permet à dbt de construire automatiquement le graphe complet des dépendances entre modèles.",
          },
          {
            type: "sql_code",
            text: "-- models/marts/fct_transactions.sql\nselect *\nfrom {{ ref('int_transactions_usd') }}\nwhere status = 'completed'",
            caption: "ref() résout automatiquement la dépendance et l'ordre d'exécution — jamais de nom de table en dur.",
          },
          {
            type: "callout",
            title: "Pourquoi jamais de nom de table en dur",
            text: "Écrire directement `from int_transactions_usd` (sans ref()) fonctionnerait, mais dbt ne saurait alors PAS que fct_transactions dépend de int_transactions_usd — il pourrait les exécuter dans le mauvais ordre, ou ne pas comprendre l'impact d'un changement sur int_transactions_usd. ref() rend cette dépendance explicite et exploitable par l'outil lui-même.",
          },
          {
            type: "p",
            text: "À partir de tous les ref() du projet, dbt construit un DAG (graphe orienté acyclique) complet — visible via `dbt docs generate` puis `dbt docs serve` — qui montre visuellement quel modèle dépend de quel autre, sur l'ensemble du projet.",
          },
          {
            type: "sql_code",
            text: "-- models/intermediate/int_transactions_usd.sql — dépend lui-même du staging via ref()\nselect\n  t.*,\n  fx.rate_to_usd,\n  round(t.amount_local / fx.rate_to_usd, 2) as amount_usd\nfrom {{ ref('stg_transactions') }} t\njoin lateral (\n  select rate_to_usd from {{ source('raw', 'fx_rates') }}\n  where currency_code = t.currency_code and rate_date <= t.transaction_at::date\n  order by rate_date desc limit 1\n) fx on true",
          },
          {
            type: "thinking_prompt",
            text: "Reconnais-tu cette logique ? C'est exactement l'as-of join vu au Chapitre 2.4 — dbt ne réinvente pas le SQL, il orchestre et versionne le SQL que tu sais déjà écrire.",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi utiliser ref('modele') plutôt que le nom de table en dur dans un modèle dbt ?",
          options: [
            "ref() est plus rapide à l'exécution",
            "ref() rend la dépendance explicite, permettant à dbt de déterminer automatiquement l'ordre d'exécution",
            "Le nom en dur est interdit par PostgreSQL"
          ],
          correct_index: 1,
          explain: "Sans ref(), dbt ne peut ni connaître ni garantir l'ordre correct d'exécution entre modèles dépendants.",
        },
        {
          question: "Que construit dbt à partir de l'ensemble des ref() d'un projet ?",
          options: [
            "Un rapport de facturation",
            "Un DAG (graphe de dépendances) complet entre tous les modèles",
            "Une sauvegarde de la base"
          ],
          correct_index: 1,
          explain: "Visible via dbt docs — ce graphe montre quel modèle dépend de quel autre sur l'ensemble du projet.",
        },
      ],
    },

    {
      number: "2.9.4",
      slug: "tests-dbt-generiques",
      title: "Tests dbt génériques : unique, not_null, relationships",
      parentSlug: "dbt-et-orchestration",
      duration_minutes: 25,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "dbt fournit quatre tests génériques prêts à l'emploi, déclarés en YAML plutôt qu'en SQL — ils couvrent exactement les problèmes de qualité manuels vus au Chapitre 2.7, mais automatisés et exécutés à chaque run.",
          },
          {
            type: "code",
            text: "# models/marts/schema.yml\nmodels:\n  - name: fct_transactions\n    columns:\n      - name: transaction_id\n        tests: [unique, not_null]\n      - name: customer_id\n        tests:\n          - relationships:\n              to: ref('dim_customer')\n              field: customer_id\n      - name: status\n        tests:\n          - accepted_values:\n              values: ['pending', 'completed', 'failed']",
            caption: "unique/not_null/relationships couvrent exactement les problèmes de qualité vus au Chapitre 2.7 — mais automatisés, à chaque exécution.",
          },
          {
            type: "table",
            headers: ["Test générique", "Vérifie", "Équivalent SQL manuel"],
            rows: [
              ["unique", "Aucune valeur dupliquée dans la colonne", "GROUP BY ... HAVING count(*) > 1 (Leçon 2.7.6)"],
              ["not_null", "Aucune valeur NULL dans la colonne", "count(*) filter (where col is null) (Leçon 2.7.6)"],
              ["relationships", "Chaque valeur référence bien une ligne existante dans une autre table", "LEFT JOIN ... WHERE ... IS NULL (Leçon 2.7.8)"],
              ["accepted_values", "La colonne ne contient que des valeurs d'une liste autorisée", "WHERE col NOT IN (liste autorisée)"],
            ],
          },
          {
            type: "callout",
            title: "Le vrai gain : ces tests s'exécutent à CHAQUE run, automatiquement",
            text: "La différence n'est pas le SQL sous-jacent (tu sais déjà l'écrire depuis le Chapitre 2.7) — c'est que `dbt test` exécute systématiquement ces vérifications à chaque déploiement, sans qu'un humain ait besoin de s'en souvenir. Un test qui échoue peut bloquer automatiquement la suite du pipeline (Leçon 2.9.9).",
          },
          {
            type: "p",
            text: "`dbt test` exécute tous les tests déclarés et rapporte précisément lesquels échouent — un test échoué produit un message clair identifiant le modèle et la colonne concernés, pas juste un échec générique.",
          },
        ],
      },
      quiz: [
        {
          question: "Le test dbt `relationships` vérifie :",
          options: [
            "Qu'une colonne n'a jamais de valeurs dupliquées",
            "Qu'une clé étrangère correspond bien à une ligne existante dans la table référencée",
            "Que la table est vide",
          ],
          correct_index: 1,
          explain: "C'est un test d'intégrité référentielle automatisé — équivalent à la requête manuelle du Chapitre 2.7.",
        },
        {
          question: "Quel est le principal avantage des tests dbt par rapport aux mêmes vérifications faites manuellement en SQL ?",
          options: [
            "Ils sont plus rapides à exécuter",
            "Ils s'exécutent systématiquement à chaque run, sans qu'un humain ait besoin de s'en souvenir",
            "Ils remplacent le besoin de comprendre le SQL sous-jacent",
          ],
          correct_index: 1,
          explain: "Le SQL sous-jacent est le même que celui vu au Chapitre 2.7 — c'est l'automatisation systématique qui change tout.",
        },
      ],
    },

    {
      number: "2.9.5",
      slug: "tests-dbt-personnalises-singular",
      title: "Tests dbt personnalisés (singular tests)",
      parentSlug: "dbt-et-orchestration",
      duration_minutes: 20,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Les quatre tests génériques (Leçon 2.9.4) ne couvrent pas toutes les règles métier possibles. Un test singulier (singular test) est un simple fichier .sql qui définit sa propre logique — le test ÉCHOUE si la requête renvoie AU MOINS UNE ligne.",
          },
          {
            type: "sql_code",
            text: "-- tests/assert_montants_positifs.sql\n-- Ce test échoue s'il existe ne serait-ce qu'UNE transaction avec un montant négatif ou nul\nselect transaction_id, amount_local\nfrom {{ ref('fct_transactions') }}\nwhere amount_local <= 0",
          },
          {
            type: "callout",
            title: "La logique inversée des tests dbt : succès = zéro ligne renvoyée",
            text: "Contrairement à une requête SQL normale où on cherche des résultats, un test dbt réussit précisément quand il ne trouve AUCUNE ligne — la requête exprime littéralement \"les lignes qui ne devraient jamais exister\". C'est ce renversement logique qu'il faut intérioriser pour écrire un test singulier correct.",
          },
          {
            type: "sql_code",
            text: "-- tests/assert_conversion_usd_coherente.sql\n-- Vérifie qu'aucune transaction n'a un montant USD anormalement différent du montant local\nselect transaction_id, amount_local, amount_usd, rate_to_usd\nfrom {{ ref('int_transactions_usd') }}\nwhere amount_usd > amount_local  -- un montant USD ne devrait jamais dépasser le montant local, vu les devises AfriPay",
          },
          {
            type: "p",
            text: "Un test singulier est utile pour une règle métier spécifique à l'entreprise, qu'aucun des quatre tests génériques ne peut exprimer — typiquement une contrainte sur plusieurs colonnes à la fois, ou une logique conditionnelle propre au domaine.",
          },
        ],
      },
      quiz: [
        {
          question: "Un test singulier dbt réussit quand sa requête renvoie :",
          options: ["Au moins une ligne", "Exactement zéro ligne", "Un nombre pair de lignes"],
          correct_index: 1,
          explain: "La requête d'un test singulier exprime les lignes qui NE DEVRAIENT JAMAIS exister — succès = aucune trouvée.",
        },
        {
          question: "Quand utiliser un test singulier plutôt qu'un test générique (unique, not_null...) ?",
          options: [
            "Toujours, les tests génériques sont dépréciés",
            "Pour une règle métier spécifique qu'aucun test générique ne peut exprimer",
            "Jamais, les tests singuliers ne fonctionnent pas en production",
          ],
          correct_index: 1,
          explain: "Les tests génériques couvrent les cas standards ; les tests singuliers couvrent une logique métier propre au domaine.",
        },
      ],
    },

    {
      number: "2.9.6",
      slug: "modeles-incrementaux-dbt",
      title: "Modèles incrémentaux dbt",
      parentSlug: "dbt-et-orchestration",
      duration_minutes: 25,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un modèle incrémental dbt applique le même principe que le watermarking vu au Chapitre 2.7 (full load vs incremental load), mais géré directement par dbt via une macro dédiée : is_incremental().",
          },
          {
            type: "sql_code",
            text: "-- models/staging/stg_transactions.sql\n{{ config(materialized='incremental', unique_key='transaction_id') }}\n\nselect * from {{ source('raw', 'transactions_bronze') }}\n{% if is_incremental() %}\nwhere transaction_at_raw > (select max(transaction_at) from {{ this }})\n{% endif %}",
            caption: "is_incremental() ne retraite que les nouvelles lignes lors des exécutions suivantes — le même principe que le watermarking du Chapitre 2.7, mais géré par dbt.",
          },
          {
            type: "callout",
            title: "Comment is_incremental() se comporte différemment au premier run",
            text: "Au tout premier `dbt run`, la table n'existe pas encore — is_incremental() renvoie FALSE, et la condition `{% if %}` est ignorée : TOUTES les lignes sont chargées (comportement identique à un full load). Aux exécutions suivantes, la table `{{ this }}` existe déjà — is_incremental() renvoie TRUE, et seules les lignes plus récentes que le max déjà chargé sont traitées.",
          },
          {
            type: "p",
            text: "`{{ this }}` est une référence spéciale dbt vers la table du modèle EN COURS de construction — utile précisément pour interroger \"ce qui a déjà été chargé\" avant de décider quoi charger de plus.",
          },
          {
            type: "sql_code",
            text: "-- unique_key='transaction_id' + ON CONFLICT géré automatiquement par dbt en arrière-plan\n-- garantit l'idempotence du modèle incrémental, exactement comme au Chapitre 2.7.4-2.7.5",
          },
          {
            type: "thinking_prompt",
            text: "unique_key dans la config incrémentale joue exactement le même rôle que la colonne cible d'un ON CONFLICT — dbt génère en interne la logique d'upsert appropriée pour l'entrepôt cible, sans que tu aies à l'écrire manuellement à chaque fois.",
          },
        ],
      },
      quiz: [
        {
          question: "Que se passe-t-il lors du tout premier `dbt run` d'un modèle incrémental ?",
          options: [
            "Une erreur, car la table n'existe pas encore",
            "is_incremental() renvoie FALSE et toutes les lignes sont chargées (comme un full load)",
            "Rien n'est chargé du tout"
          ],
          correct_index: 1,
          explain: "La condition {% if is_incremental() %} n'est active qu'à partir du moment où la table cible existe déjà.",
        },
        {
          question: "Quel est l'équivalent du unique_key d'un modèle incrémental dbt dans le SQL brut du Chapitre 2.7 ?",
          options: [
            "La colonne cible d'un ON CONFLICT, pour garantir l'idempotence",
            "Le nom du schéma",
            "Une simple colonne de tri"
          ],
          correct_index: 0,
          explain: "dbt génère en interne la logique d'upsert correspondante à partir de unique_key.",
        },
      ],
    },

    {
      number: "2.9.7",
      slug: "documentation-dbt-schema-yml-docs",
      title: "Documentation dbt : schema.yml et dbt docs",
      parentSlug: "dbt-et-orchestration",
      duration_minutes: 20,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "La documentation dbt vit à côté du code, dans les mêmes fichiers schema.yml qui déclarent les tests — elle ne se périme jamais silencieusement dans un wiki externe déconnecté du code réel.",
          },
          {
            type: "code",
            text: "# models/marts/schema.yml\nmodels:\n  - name: fct_transactions\n    description: \"Fact table transactionnelle AfriPay — une ligne par transaction, grain vérifié au Chapitre 2.6\"\n    columns:\n      - name: transaction_id\n        description: \"Identifiant unique de la transaction, clé de substitution\"\n        tests: [unique, not_null]\n      - name: amount_usd\n        description: \"Montant converti en USD via as-of join sur fx_rates (Chapitre 2.4)\"",
          },
          {
            type: "callout",
            title: "dbt docs generate + dbt docs serve",
            text: "Ces deux commandes génèrent un site de documentation interactif complet : chaque modèle, sa description, ses colonnes, ses tests, ET le DAG visuel de dépendances (vu en Leçon 2.9.3) — navigable par toute l'équipe, sans jamais avoir à ouvrir le code SQL brut pour comprendre la structure du projet.",
          },
          {
            type: "p",
            text: "Documenter directement dans schema.yml a un avantage discipline : la description vit à CÔTÉ du test et de la colonne qu'elle décrit — un changement de colonne dans le SQL rappelle visuellement qu'il faut aussi mettre à jour sa description, contrairement à une documentation externe facilement oubliée.",
          },
        ],
      },
      quiz: [
        {
          question: "Où vit la documentation d'un modèle dbt ?",
          options: [
            "Dans un wiki externe séparé du code",
            "Dans le même fichier schema.yml que ses tests, à côté du code",
            "Uniquement dans des commentaires SQL"
          ],
          correct_index: 1,
          explain: "C'est ce qui évite qu'elle se périme silencieusement, déconnectée du code réel.",
        },
        {
          question: "Que produit la combinaison `dbt docs generate` + `dbt docs serve` ?",
          options: [
            "Un export CSV des données",
            "Un site de documentation interactif avec le DAG visuel de dépendances",
            "Une sauvegarde de la base de données"
          ],
          correct_index: 1,
          explain: "Navigable par toute l'équipe, incluant modèles, colonnes, tests, et graphe de dépendances.",
        },
      ],
    },

    {
      number: "2.9.8",
      slug: "orchestration-concept-dag-scheduling",
      title: "Orchestration : le concept de DAG et de scheduling",
      parentSlug: "dbt-et-orchestration",
      duration_minutes: 25,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Orchestrer un pipeline, c'est décider QUAND chaque étape s'exécute, dans quel ORDRE, et QUOI FAIRE si une étape échoue — dbt gère l'intérieur des transformations, mais pas leur déclenchement dans le temps.",
          },
          {
            type: "timeline",
            title: "DAG conceptuel — pipeline quotidien AfriPay",
            steps: [
              { time: "02h00", activity: "Extraction : copier les nouvelles lignes de la source vers raw_transactions_bronze" },
              { time: "02h15", activity: "dbt run --select staging : nettoyage et conformité (Bronze → Silver)" },
              { time: "02h30", activity: "dbt test : vérifier unique/not_null/relationships avant de continuer" },
              { time: "02h35", activity: "dbt run --select marts : construction du star schema (Silver → Gold)" },
              { time: "02h45", activity: "Si un test échoue : alerter l'équipe, ne PAS publier les données en aval" },
            ],
          },
          {
            type: "callout",
            title: "Pourquoi \"dbt test\" doit bloquer la suite en cas d'échec",
            text: "Si dbt test échoue à 02h30 mais que le pipeline continue quand même vers 02h35, des données potentiellement incorrectes (doublons, valeurs orphelines) seraient publiées en Gold — visibles par les analystes et les tableaux de bord AVANT même qu'un humain ne soit alerté. Un orchestrateur bien configuré arrête la chaîne au premier échec critique.",
          },
          {
            type: "table",
            headers: ["Concept d'orchestration", "Signifie"],
            rows: [
              ["DAG (graphe orienté acyclique)", "L'ensemble des étapes et leurs dépendances — jamais de boucle, toujours un ordre déterminé"],
              ["Scheduling", "Quand chaque DAG se déclenche (ex. tous les jours à 02h00)"],
              ["Retry", "Combien de fois retenter une étape échouée avant d'abandonner et d'alerter"],
              ["Backfill", "Rejouer le DAG pour des dates passées (ex. après correction d'un bug)"],
            ],
          },
          {
            type: "thinking_prompt",
            text: "Si ce pipeline tourne chaque nuit sans surveillance humaine, qu'est-ce qui doit être automatisé — et qu'est-ce qui doit alerter quelqu'un ? Un test dbt qui échoue silencieusement est pire qu'un pipeline qui plante bruyamment : le second se voit, le premier corrompt la confiance dans les données sans que personne ne le sache.",
          },
        ],
      },
      quiz: [
        {
          question: "Que garantit la structure en DAG (graphe orienté acyclique) d'un pipeline orchestré ?",
          options: [
            "Qu'il n'y a jamais de dépendance circulaire entre étapes",
            "Qu'il s'exécute toujours plus vite",
            "Qu'aucune étape ne peut jamais échouer"
          ],
          correct_index: 0,
          explain: "\"Acyclique\" signifie précisément l'absence de boucle — un ordre d'exécution toujours déterminable.",
        },
        {
          question: "Pourquoi un échec de dbt test doit-il bloquer la suite du pipeline plutôt que de continuer ?",
          options: [
            "Ça n'a aucune importance",
            "Sinon des données potentiellement incorrectes seraient publiées en aval avant qu'un humain ne soit alerté",
            "PostgreSQL l'exige techniquement"
          ],
          correct_index: 1,
          explain: "C'est le principe du \"fail fast\" appliqué à la qualité des données — ne jamais laisser une erreur se propager silencieusement.",
        },
      ],
    },

    {
      number: "2.9.9",
      slug: "alerting-echecs-silencieux",
      title: "Alerting et échecs silencieux",
      parentSlug: "dbt-et-orchestration",
      duration_minutes: 20,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Un pipeline qui plante bruyamment (erreur visible, statut 'failed' dans l'orchestrateur) est un problème facile à traiter — quelqu'un le voit tout de suite. Le vrai danger est l'échec SILENCIEUX : un pipeline qui \"réussit\" techniquement tout en produisant des données fausses ou incomplètes.",
          },
          {
            type: "callout",
            title: "🪤 Un échec silencieux typique en data engineering",
            text: "Une source externe cesse d'envoyer des données (panne côté partenaire) — le pipeline d'extraction \"réussit\" en récupérant zéro nouvelle ligne, sans erreur. Les tables restent simplement figées à leur état d'hier. Sans une alerte spécifique sur \"volume anormalement bas\", personne ne s'en aperçoit avant qu'un analyste ne remarque, des jours plus tard, que le tableau de bord n'a plus bougé.",
          },
          {
            type: "table",
            headers: ["Type d'alerte", "Détecte"],
            rows: [
              ["Échec d'exécution", "Le pipeline a planté (erreur SQL, connexion perdue...)"],
              ["Échec de test dbt", "Une règle de qualité déclarée est violée (unique, not_null, relationships...)"],
              ["Anomalie de volume", "Le nombre de lignes chargées est anormalement bas ou élevé par rapport à l'historique"],
              ["Anomalie de fraîcheur (freshness)", "La donnée source n'a pas été mise à jour depuis un délai anormalement long"],
            ],
          },
          {
            type: "p",
            text: "dbt propose un test de fraîcheur intégré (`dbt source freshness`) qui vérifie précisément ce dernier point : combien de temps s'est écoulé depuis la dernière mise à jour d'une source, alertant si ce délai dépasse un seuil configuré.",
          },
          {
            type: "thinking_prompt",
            text: "La détection d'anomalie de volume rejoint directement la détection d'anomalie vue au Chapitre 2.4 (window functions, stats par groupe) — comparer le volume du jour à la moyenne des jours précédents est littéralement le même calcul, appliqué à la SANTÉ du pipeline plutôt qu'aux transactions elles-mêmes.",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi un échec silencieux est-il plus dangereux qu'un pipeline qui plante bruyamment ?",
          options: [
            "Ce n'est pas plus dangereux",
            "Personne n'est alerté — le pipeline \"réussit\" tout en produisant des données fausses ou figées",
            "Un échec silencieux corrige automatiquement le problème"
          ],
          correct_index: 1,
          explain: "C'est le cas le plus insidieux : la confiance dans les données se corrompt sans qu'aucune erreur ne le signale.",
        },
        {
          question: "Que vérifie un test de fraîcheur (freshness) dans dbt ?",
          options: [
            "Que les données sont triées",
            "Combien de temps s'est écoulé depuis la dernière mise à jour d'une source",
            "Que la table est vide"
          ],
          correct_index: 1,
          explain: "Utile pour détecter qu'une source a cessé d'envoyer des données, sans qu'aucune erreur d'exécution ne se produise.",
        },
      ],
    },

    {
      number: "2.9.10",
      slug: "perimetre-module-atelier-synthese-chapitre-2-9",
      title: "Périmètre du module et atelier de synthèse",
      parentSlug: "dbt-et-orchestration",
      duration_minutes: 25,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "callout",
            title: "Ce que ce module ne couvre pas — et pourquoi",
            text: "Airflow, le vrai outil d'orchestration de production, est tout le Module 05. Ici, tu comprends le CONCEPT (DAG, dépendances, scheduling, retry, alerte) pour ne pas arriver au Module 05 les mains vides — pas pour construire un Airflow complet en double. De même, dbt Cloud, les macros Jinja avancées, et les packages dbt communautaires restent hors du périmètre volontaire de ce chapitre d'introduction.",
          },
          {
            type: "p",
            text: "Ce chapitre a couvert pourquoi dbt existe (2.9.1), sa structure de projet (2.9.2), ref() et le graphe de dépendances (2.9.3), les tests génériques et singuliers (2.9.4-2.9.5), les modèles incrémentaux (2.9.6), la documentation (2.9.7), et le concept d'orchestration avec ses alertes (2.9.8-2.9.9).",
          },
          { type: "h3", text: "Atelier de synthèse — tout le chapitre en une session" },
          {
            type: "checklist",
            title: "Tu es prêt·e pour le Chapitre 2.10 (Capstone) si tu peux répondre oui à chaque point",
            items: [
              "Je sais expliquer pourquoi dbt gère le SQL \"comme du code\", pas juste comme des requêtes",
              "Je sais organiser un projet dbt en staging/intermediate/marts",
              "Je sais pourquoi ref() est préférable à un nom de table en dur",
              "Je sais déclarer les quatre tests génériques dbt et écrire un test singulier simple",
              "Je sais faire la différence entre un échec bruyant et un échec silencieux, et pourquoi le second est plus dangereux",
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Livrable — simule ce que ferait le test générique 'relationships' de dbt sur customer_id : trouve les transactions dont le client n'existe pas dans dim_customer.",
            starterQuery:
              "select t.transaction_id, t.customer_id\nfrom fact_transactions t\nleft join dim_customer c on c.customer_id = t.customer_id\nwhere c.customer_id is null;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi ce module ne construit-il pas un pipeline Airflow complet ?",
          options: [
            "Airflow n'existe pas encore",
            "C'est tout l'objet du Module 05 — éviter le doublon",
            "Airflow ne fonctionne pas avec PostgreSQL",
          ],
          correct_index: 1,
          explain: "Ce module donne le concept d'orchestration ; le Module 05 construit le vrai outil en profondeur.",
        },
        {
          question: "Ce chapitre a-t-il couvert dbt Cloud et les packages communautaires dbt en détail ?",
          options: [
            "Oui, intégralement",
            "Non — volontairement hors périmètre de ce chapitre d'introduction",
            "Ce sujet n'existe pas dans dbt"
          ],
          correct_index: 1,
          explain: "Le périmètre de ce chapitre reste les fondations : structure de projet, ref(), tests, modèles incrémentaux, orchestration conceptuelle.",
        },
      ],
    },

    // ============================================================
    // CHAPITRE 2.10 — CAPSTONE
    // ============================================================
    {
      number: "2.10",
      slug: "capstone-afripay-data-platform",
      title: "Capstone — AfriPay Data Platform",
      duration_minutes: 15,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Ce module ne s'est jamais dispersé en exercices déconnectés : depuis le Chapitre 2.6, tu construis progressivement une seule et même plateforme de données. Ce dernier chapitre est la consolidation et la restitution — pas un nouveau départ, et volontairement AUCUN nouveau concept SQL n'y est introduit.",
          },
          {
            type: "checklist",
            title: "Les 10 leçons de ce chapitre — chacune une étape du livrable final",
            items: [
              "2.10.1 — Cahier des charges du capstone : ce qui est attendu",
              "2.10.2 — Étape 1 : vérifier et documenter le modèle Gold",
              "2.10.3 — Étape 2 : construire et vérifier la couche Silver complète",
              "2.10.4 — Étape 3 : rendre le chargement Gold idempotent",
              "2.10.5 — Étape 4 : ajouter les tests de qualité",
              "2.10.6 — Étape 5 : indexer et vérifier la performance des requêtes clés",
              "2.10.7 — Étape 6 : construire le data mart final",
              "2.10.8 — Étape 7 : documenter le projet (structure du dépôt, README)",
              "2.10.9 — Étape 8 : préparer la restitution orale",
              "2.10.10 — Revue finale complète et quiz de validation du module",
            ],
          },
        ],
      },
      quiz: [],
    },

    {
      number: "2.10.1",
      slug: "cahier-des-charges-capstone",
      title: "Cahier des charges du capstone : ce qui est attendu",
      parentSlug: "capstone-afripay-data-platform",
      duration_minutes: 20,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Le capstone AfriPay Data Platform n'est pas un exercice de plus — c'est le livrable que tu montreras en entretien technique. Il rassemble, en un seul projet cohérent, tout ce que les Chapitres 2.1 à 2.9 t'ont appris.",
          },
          {
            type: "checklist",
            title: "Ce que le livrable final doit contenir",
            items: [
              "Un modèle Gold (star schema) avec un grain documenté pour chaque table — Chapitre 2.6",
              "Une couche Silver qui applique des règles de qualité vérifiables — Chapitre 2.7",
              "Un chargement Bronze → Silver → Gold idempotent, rejouable sans dupliquer — Chapitre 2.7",
              "Au moins un test de qualité automatisé (SQL pur ou dbt) par risque identifié — Chapitre 2.9",
              "Au moins une requête analytique utilisant une window function ou un as-of join — Chapitre 2.4",
              "Un data mart final répondant à une vraie question business — toutes les compétences combinées",
              "Une documentation qui explique le POURQUOI des choix, pas seulement le COMMENT",
            ],
          },
          {
            type: "callout",
            title: "Pourquoi ce chapitre n'introduit aucun nouveau concept SQL",
            text: "Le capstone teste ta capacité à COMBINER ce que tu sais déjà, pas à apprendre encore plus de syntaxe. Un recruteur ne cherche pas quelqu'un qui connaît 200 fonctions SQL par cœur — il cherche quelqu'un capable d'assembler un nombre plus restreint de concepts solides en un système cohérent et défendable.",
          },
          {
            type: "thinking_prompt",
            text: "Avant de commencer, relis mentalement chaque titre de chapitre depuis 2.1 — si l'un d'eux te semble flou, c'est le moment d'y retourner rapidement, PAS pendant la construction du capstone lui-même.",
          },
        ],
      },
      quiz: [
        {
          question: "Le capstone AfriPay Data Platform a-t-il pour but d'introduire de nouveaux concepts SQL ?",
          options: [
            "Oui, plusieurs concepts avancés supplémentaires",
            "Non — il combine et applique tout ce qui a été appris depuis le Chapitre 2.1",
            "Seulement des concepts de sécurité"
          ],
          correct_index: 1,
          explain: "Le capstone teste la capacité à assembler des compétences déjà acquises, pas à en apprendre de nouvelles.",
        },
        {
          question: "Qu'est-ce qui distingue le plus un bon capstone d'un simple exercice technique ?",
          options: [
            "Le nombre de lignes de code",
            "Une documentation qui explique le POURQUOI des choix, pas seulement le COMMENT",
            "L'absence totale de commentaires"
          ],
          correct_index: 1,
          explain: "C'est exactement ce qu'un recruteur évalue : la capacité à justifier des décisions, pas juste à produire du code qui fonctionne.",
        },
      ],
    },

    {
      number: "2.10.2",
      slug: "etape-1-verifier-documenter-modele-gold",
      title: "Étape 1 : vérifier et documenter le modèle Gold",
      parentSlug: "capstone-afripay-data-platform",
      duration_minutes: 25,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Premier livrable : prouver que le star schema AfriPay respecte réellement les principes du Chapitre 2.6 — pas juste l'affirmer, le VÉRIFIER par requête.",
          },
          {
            type: "sql_sandbox",
            prompt: "Vérifie le grain de fact_transactions (Chapitre 2.6.8) : aucun transaction_id ne doit apparaître en double.",
            starterQuery:
              "select transaction_id, count(*)\nfrom fact_transactions\ngroup by transaction_id\nhaving count(*) > 1;",
          },
          {
            type: "sql_sandbox",
            prompt: "Vérifie l'intégrité référentielle complète (Chapitre 2.6.10) : chaque transaction référence un client, un marchand et un pays existants.",
            starterQuery:
              "select count(*) as transactions_orphelines\nfrom fact_transactions t\nleft join dim_customer c on c.customer_id = t.customer_id\nleft join dim_merchant m on m.merchant_id = t.merchant_id\nleft join dim_country co on co.country_code = t.country_code\nwhere c.customer_id is null or m.merchant_id is null or co.country_code is null;",
          },
          {
            type: "callout",
            title: "Documenter le grain, pas seulement le vérifier",
            text: "Pour le livrable final, chaque table Gold doit avoir une ligne de documentation qui répond explicitement à \"que représente une seule ligne ?\" — exactement la question du grain vue au Chapitre 2.6.8. Cette phrase, écrite noir sur blanc, évite qu'un futur collègue (ou toi dans six mois) ne fasse une hypothèse erronée sur le grain.",
          },
          {
            type: "sql_sandbox",
            prompt: "Documente rapidement chaque dimension : combien de lignes contient-elle actuellement ?",
            starterQuery:
              "select 'dim_customer' as table_name, count(*) from dim_customer\nunion all select 'dim_merchant', count(*) from dim_merchant\nunion all select 'dim_country', count(*) from dim_country\nunion all select 'dim_agent', count(*) from dim_agent\nunion all select 'dim_date', count(*) from dim_date;",
          },
        ],
      },
      quiz: [
        {
          question: "Comment prouve-t-on concrètement que le grain de fact_transactions est respecté ?",
          options: [
            "En l'affirmant dans la documentation sans vérification",
            "En vérifiant par requête qu'aucun transaction_id n'apparaît en double",
            "En comptant le nombre de colonnes de la table",
          ],
          correct_index: 1,
          explain: "Une affirmation non vérifiée n'a aucune valeur en entretien — la preuve par requête est ce qui compte.",
        },
        {
          question: "Pourquoi documenter explicitement le grain de chaque table Gold ?",
          options: [
            "Ce n'est pas nécessaire si le schéma est correct",
            "Pour éviter qu'un futur lecteur fasse une hypothèse erronée sur ce que représente une ligne",
            "Uniquement pour respecter une convention arbitraire"
          ],
          correct_index: 1,
          explain: "C'est exactement le risque identifié au Chapitre 2.6.8 : se tromper de grain casse silencieusement toute analyse future.",
        },
      ],
    },

    {
      number: "2.10.3",
      slug: "etape-2-construire-verifier-couche-silver",
      title: "Étape 2 : construire et vérifier la couche Silver complète",
      parentSlug: "capstone-afripay-data-platform",
      duration_minutes: 25,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Deuxième livrable : la couche Silver complète, construite avec TOUTES les règles de qualité vues au Chapitre 2.7 — pas une version partielle qui ne traite qu'un seul type de problème.",
          },
          {
            type: "sql_sandbox",
            prompt: "Reconstruis la couche Silver complète (NULL, dates invalides, merchant_id orphelins) et compare au volume brut.",
            starterQuery:
              "select count(*) as lignes_brutes,\n  count(*) filter (\n    where customer_id is not null\n    and amount_local is not null\n    and transaction_at_raw ~ '^\\d{4}-\\d{2}-\\d{2}'\n    and merchant_id::int in (select merchant_id from dim_merchant)\n  ) as lignes_propres_silver\nfrom raw_transactions_bronze;",
          },
          {
            type: "callout",
            title: "Un chiffre seul ne suffit pas — explique le taux de rejet",
            text: "\"3% des lignes rejetées\" n'a de valeur que si tu peux expliquer POURQUOI : combien à cause de NULL, combien à cause de dates invalides, combien à cause de références orphelines. Cette ventilation, présentée en entretien, démontre une vraie maîtrise de la donnée — pas juste l'exécution d'un script.",
          },
          {
            type: "sql_sandbox",
            prompt: "Ventile précisément les causes de rejet, une par une.",
            starterQuery:
              "select\n  count(*) filter (where customer_id is null) as rejet_customer_null,\n  count(*) filter (where amount_local is null) as rejet_montant_null,\n  count(*) filter (where transaction_at_raw !~ '^\\d{4}-\\d{2}-\\d{2}') as rejet_date_invalide,\n  count(*) filter (where merchant_id::int not in (select merchant_id from dim_merchant)) as rejet_merchant_orphelin\nfrom raw_transactions_bronze;",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi un simple pourcentage de rejet (\"3% rejetés\") ne suffit-il pas en entretien ?",
          options: [
            "Le pourcentage n'a aucune importance",
            "Sans ventilation des causes (NULL, dates, orphelins), il ne démontre pas une vraie compréhension de la donnée",
            "Il faut toujours viser 0% de rejet"
          ],
          correct_index: 1,
          explain: "La ventilation par cause démontre que tu comprends précisément ce qui a été filtré et pourquoi.",
        },
      ],
    },

    {
      number: "2.10.4",
      slug: "etape-3-chargement-gold-idempotent",
      title: "Étape 3 : rendre le chargement Gold idempotent",
      parentSlug: "capstone-afripay-data-platform",
      duration_minutes: 25,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Troisième livrable : prouver — pas juste affirmer — que le chargement Silver → Gold peut être relancé sans jamais dupliquer de données, exactement le principe d'idempotence du Chapitre 2.7.4.",
          },
          {
            type: "sql_sandbox",
            prompt: "Relance deux fois de suite le chargement idempotent (ON CONFLICT) et vérifie que le compte de lignes ne bouge pas entre les deux exécutions.",
            starterQuery:
              "insert into fact_transactions (transaction_id, customer_id, merchant_id, country_code, transaction_at, amount_local, currency_code, channel, status)\nselect b.transaction_id::int, b.customer_id::int, b.merchant_id::int, b.country_code,\n       b.transaction_at_raw::timestamptz, b.amount_local::numeric, b.currency_code, b.channel, b.status\nfrom raw_transactions_bronze b\nwhere b.customer_id is not null and b.merchant_id::int in (select merchant_id from dim_merchant)\non conflict (transaction_id) do update set status = excluded.status;\n\nselect count(*) from fact_transactions;",
          },
          {
            type: "callout",
            title: "La preuve d'idempotence, ce n'est pas \"ça n'a pas planté\"",
            text: "La vraie preuve d'idempotence est un COMPTE DE LIGNES IDENTIQUE avant et après une relance — pas simplement l'absence d'erreur. Documente ce test dans ton dépôt final : \"exécuté deux fois, le compte reste à N lignes\" est une phrase bien plus convaincante en entretien qu'une simple affirmation.",
          },
          {
            type: "thinking_prompt",
            text: "Peux-tu expliquer, sans regarder le code, pourquoi ON CONFLICT (transaction_id) DO UPDATE garantit cette propriété ? Si la réponse ne vient pas immédiatement, c'est le signal de retourner brièvement au Chapitre 2.5.9 avant de continuer.",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle est la vraie preuve qu'un chargement est idempotent ?",
          options: [
            "L'absence d'erreur lors de l'exécution",
            "Un compte de lignes identique avant et après une relance du même chargement",
            "Le temps d'exécution qui diminue à chaque relance"
          ],
          correct_index: 1,
          explain: "L'absence d'erreur ne prouve rien sur la duplication éventuelle — seul le compte de lignes le confirme.",
        },
      ],
    },

    {
      number: "2.10.5",
      slug: "etape-4-ajouter-tests-qualite",
      title: "Étape 4 : ajouter les tests de qualité",
      parentSlug: "capstone-afripay-data-platform",
      duration_minutes: 25,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Quatrième livrable : au moins un test de qualité automatisé par risque identifié — en SQL pur (comme au Chapitre 2.7) ou via dbt (Chapitre 2.9), selon l'outillage choisi pour ton projet.",
          },
          {
            type: "sql_sandbox",
            prompt: "Écris (en SQL pur) l'équivalent du test dbt 'unique' pour transaction_id.",
            starterQuery:
              "select transaction_id, count(*) as occurrences\nfrom fact_transactions\ngroup by transaction_id\nhaving count(*) > 1;\n-- Un test 'unique' réussit si cette requête renvoie ZÉRO ligne",
          },
          {
            type: "sql_sandbox",
            prompt: "Écris l'équivalent du test dbt 'relationships' pour merchant_id.",
            starterQuery:
              "select t.transaction_id, t.merchant_id\nfrom fact_transactions t\nleft join dim_merchant m on m.merchant_id = t.merchant_id\nwhere m.merchant_id is null;\n-- Un test 'relationships' réussit si cette requête renvoie ZÉRO ligne",
          },
          {
            type: "callout",
            title: "Un test qui ne s'exécute jamais automatiquement n'est pas un vrai test",
            text: "Une requête de vérification exécutée manuellement une fois n'a que la valeur du jour où elle a été lancée. Pour un vrai livrable de production, documente comment CE test serait exécuté systématiquement (un script cron, un `dbt test`, une étape CI) — même si tu ne mets pas nécessairement en place l'automatisation complète dans le cadre du capstone.",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle est la différence entre une requête de vérification manuelle et un vrai test de qualité de données ?",
          options: [
            "Aucune différence réelle",
            "Un vrai test s'exécute systématiquement (automatisé), pas seulement une fois manuellement",
            "Un test doit toujours être écrit en dbt, jamais en SQL pur"
          ],
          correct_index: 1,
          explain: "La requête SQL peut être identique — c'est l'automatisation systématique qui transforme une vérification ponctuelle en un vrai test.",
        },
      ],
    },

    {
      number: "2.10.6",
      slug: "etape-5-indexer-verifier-performance",
      title: "Étape 5 : indexer et vérifier la performance des requêtes clés",
      parentSlug: "capstone-afripay-data-platform",
      duration_minutes: 25,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Cinquième livrable : identifier les 2-3 requêtes les plus fréquentes de ton data mart final (Leçon 2.10.7), et prouver — via EXPLAIN ANALYZE, Chapitre 2.8 — qu'elles sont correctement optimisées.",
          },
          {
            type: "sql_sandbox",
            prompt: "Observe le plan d'exécution d'une requête de reporting fréquente, avant d'ajouter un index dessus.",
            starterQuery:
              "explain analyze\nselect country_code, count(*), sum(amount_local)\nfrom fact_transactions\nwhere status = 'completed'\ngroup by country_code;",
          },
          {
            type: "sql_sandbox",
            prompt: "Crée un index partiel ciblé sur les transactions complétées, puis observe si le plan change.",
            starterQuery:
              "create index if not exists idx_transactions_completed on fact_transactions(country_code) where status = 'completed';\n\nexplain analyze\nselect country_code, count(*), sum(amount_local)\nfrom fact_transactions\nwhere status = 'completed'\ngroup by country_code;",
          },
          {
            type: "callout",
            title: "Documente le AVANT/APRÈS, pas juste l'index final",
            text: "En entretien, montrer le plan EXPLAIN ANALYZE avant ET après un changement d'index démontre une vraie démarche d'optimisation basée sur des preuves — bien plus convaincant que de simplement lister les index créés sans justification mesurée.",
          },
        ],
      },
      quiz: [
        {
          question: "Que doit démontrer la partie \"performance\" du capstone, au-delà de la simple création d'index ?",
          options: [
            "Le nombre total d'index créés",
            "Une comparaison AVANT/APRÈS via EXPLAIN ANALYZE, prouvant l'effet réel du changement",
            "Rien de particulier, la création suffit"
          ],
          correct_index: 1,
          explain: "C'est la preuve mesurée qui distingue une vraie démarche d'optimisation d'une simple liste d'index.",
        },
      ],
    },

    {
      number: "2.10.7",
      slug: "etape-6-construire-data-mart-final",
      title: "Étape 6 : construire le data mart final",
      parentSlug: "capstone-afripay-data-platform",
      duration_minutes: 25,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Sixième livrable : LE tableau de bord final — une requête qui combine tout ce que tu as appris (jointures, as-of join, agrégats) pour répondre à une vraie question business AfriPay.",
          },
          {
            type: "sql_code",
            text: "-- Le tableau de bord final : revenu par pays, en USD, avec le taux du bon jour\nwith conversion as (\n  select t.*, fx.rate_to_usd,\n    round(t.amount_local / fx.rate_to_usd, 2) as amount_usd\n  from fact_transactions t\n  join lateral (\n    select rate_to_usd from fx_rates\n    where fx_rates.currency_code = t.currency_code and fx_rates.rate_date <= t.transaction_at::date\n    order by rate_date desc limit 1\n  ) fx on true\n  where t.status = 'completed'\n)\nselect co.country_name,\n  count(*) as nb_transactions,\n  round(sum(amount_usd), 2) as revenu_usd,\n  round(avg(amount_usd), 2) as panier_moyen_usd\nfrom conversion c\njoin dim_country co on co.country_code = c.country_code\ngroup by co.country_name\norder by revenu_usd desc;",
          },
          {
            type: "callout",
            title: "Pourquoi cette seule requête résume tout le module",
            text: "Elle utilise un LATERAL JOIN pour un as-of join (Chapitre 2.4), une jointure vers une dimension (Chapitre 2.3), un filtre sur le statut (Chapitre 2.2), et un GROUP BY avec agrégats (Chapitre 2.2) — le tout construit sur un modèle Gold vérifié (Chapitre 2.6) et alimenté par un pipeline idempotent (Chapitre 2.7). Une seule requête, tout un module.",
          },
          {
            type: "sql_sandbox",
            prompt: "Étends le data mart : ajoute la ventilation par canal de paiement en plus du pays.",
            starterQuery:
              "with conversion as (\n  select t.*, fx.rate_to_usd,\n    round(t.amount_local / fx.rate_to_usd, 2) as amount_usd\n  from fact_transactions t\n  join lateral (\n    select rate_to_usd from fx_rates\n    where fx_rates.currency_code = t.currency_code and fx_rates.rate_date <= t.transaction_at::date\n    order by rate_date desc limit 1\n  ) fx on true\n  where t.status = 'completed'\n)\nselect co.country_name, c.channel,\n  count(*) as nb_transactions,\n  round(sum(amount_usd), 2) as revenu_usd\nfrom conversion c\njoin dim_country co on co.country_code = c.country_code\ngroup by co.country_name, c.channel\norder by co.country_name, revenu_usd desc;",
          },
        ],
      },
      quiz: [
        {
          question: "Dans le data mart final, pourquoi utilise-t-on un as-of join sur fx_rates avant d'agréger le revenu ?",
          options: [
            "Ce n'est pas nécessaire",
            "Pour convertir chaque transaction au taux de change en vigueur à SA date, pas au taux du jour",
            "Pour trier les résultats"
          ],
          correct_index: 1,
          explain: "Sans as-of join, tout l'historique de revenu serait faussé par le taux de change actuel appliqué rétroactivement.",
        },
        {
          question: "Combien de compétences distinctes du module la requête finale du data mart combine-t-elle ?",
          options: [
            "Une seule (l'agrégation)",
            "Plusieurs : LATERAL/as-of join, jointure de dimension, filtrage, GROUP BY sur un modèle Gold vérifié",
            "Aucune, c'est une requête triviale"
          ],
          correct_index: 1,
          explain: "C'est précisément ce qui en fait une bonne synthèse : elle mobilise des concepts de presque tous les chapitres précédents.",
        },
      ],
    },

    {
      number: "2.10.8",
      slug: "etape-7-documenter-projet-readme",
      title: "Étape 7 : documenter le projet (structure du dépôt, README)",
      parentSlug: "capstone-afripay-data-platform",
      duration_minutes: 20,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "code",
            text: "afripay-data-platform/\n├── README.md\n├── sql/\n│   ├── ddl/              -- création des tables\n│   ├── modeling/         -- MCD, MLD, star schema\n│   └── optimization/     -- index, requêtes EXPLAIN avant/après\n├── warehouse/\n│   ├── bronze/\n│   ├── silver/\n│   └── gold/\n├── dbt/\n│   ├── models/\n│   └── tests/\n└── documentation/\n    └── architecture.png",
          },
          {
            type: "callout",
            title: "Un recruteur lit un README en cinq minutes maximum",
            text: "Un recruteur qui ouvre ce dépôt doit comprendre en cinq minutes ce que fait le projet, pourquoi ces choix de modélisation, et voir que le pipeline a été pensé pour la production — pas juste pour \"marcher une fois\". Un README qui ne répond pas à \"pourquoi ce projet existe\" en trois phrases perd déjà l'attention.",
          },
          {
            type: "checklist",
            title: "Ce qu'un bon README AfriPay Data Platform doit contenir",
            items: [
              "En 2-3 phrases : le problème métier résolu (pas une liste de technologies utilisées)",
              "Un schéma ou une description du star schema Gold",
              "Comment relancer le pipeline localement (commandes exactes)",
              "Les décisions de modélisation clés et leur justification (star schema vs OBT, SCD choisie...)",
              "Ce qui a été laissé de côté volontairement, et pourquoi (périmètre assumé, pas oublié)",
            ],
          },
          {
            type: "thinking_prompt",
            text: "\"Ce qui a été laissé de côté et pourquoi\" est souvent la section la plus impressionnante d'un README technique — elle démontre une conscience claire du périmètre du projet, exactement l'attitude qu'un employeur recherche chez un data engineer junior.",
          },
        ],
      },
      quiz: [
        {
          question: "Quelle information un bon README doit-il donner en priorité ?",
          options: [
            "La liste exhaustive de toutes les technologies utilisées",
            "Le problème métier résolu, en 2-3 phrases claires",
            "Le nombre total de lignes de code du projet"
          ],
          correct_index: 1,
          explain: "Un recruteur doit comprendre le POURQUOI du projet avant tout détail technique.",
        },
        {
          question: "Pourquoi documenter explicitement \"ce qui a été laissé de côté\" dans le README ?",
          options: [
            "Ça n'a aucun intérêt et affaiblit le projet",
            "Ça démontre une conscience claire et assumée du périmètre du projet",
            "C'est une obligation légale"
          ],
          correct_index: 1,
          explain: "Un périmètre assumé et documenté est perçu très différemment d'un oubli non mentionné.",
        },
      ],
    },

    {
      number: "2.10.9",
      slug: "etape-8-preparer-restitution-orale",
      title: "Étape 8 : préparer la restitution orale",
      parentSlug: "capstone-afripay-data-platform",
      duration_minutes: 25,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Présente ton projet comme en entretien technique : le problème métier, le modèle choisi et pourquoi, une requête qui t'a posé un vrai défi, et ce que tu ferais différemment avec plus de temps.",
          },
          {
            type: "table",
            headers: ["Partie du pitch", "Ce qu'elle doit couvrir", "Durée indicative"],
            rows: [
              ["Le problème", "Quelle question métier AfriPay ce projet résout-il ?", "30 secondes"],
              ["Le modèle", "Star schema choisi, grain de fact_transactions, pourquoi ce choix plutôt qu'un autre", "1-2 minutes"],
              ["Le défi technique", "Une requête ou une décision qui n'était pas évidente (ex. l'as-of join, un piège NULL rencontré)", "1-2 minutes"],
              ["Les limites assumées", "Ce que tu ferais différemment avec plus de temps ou plus de données", "30 secondes à 1 minute"],
            ],
          },
          {
            type: "callout",
            title: "La dernière question distingue un candidat qui a compris d'un candidat qui a suivi un tutoriel",
            text: "\"Qu'est-ce que tu ferais différemment avec plus de temps ?\" est une question fréquente en entretien technique. Un candidat qui a simplement suivi des instructions n'a pas de réponse construite ; un candidat qui a vraiment compris les compromis de son propre modèle (star vs OBT, SCD choisie, index posés) a toujours quelque chose de précis à répondre.",
          },
          {
            type: "thinking_prompt",
            text: "Entraîne-toi à répondre à \"pourquoi un star schema plutôt qu'un OBT ici précisément\" sans relire tes notes — si la réponse ne vient pas naturellement, c'est le signal de retourner brièvement à la Leçon 2.6.7 avant l'entretien réel.",
          },
        ],
      },
      quiz: [
        {
          question: "Pourquoi la question \"qu'est-ce que tu ferais différemment avec plus de temps ?\" est-elle si révélatrice en entretien ?",
          options: [
            "Elle n'a aucune importance particulière",
            "Elle distingue un candidat qui a vraiment compris les compromis de son projet d'un candidat qui a suivi des instructions",
            "C'est une question piège sans bonne réponse"
          ],
          correct_index: 1,
          explain: "Une réponse précise démontre une compréhension réelle des choix de modélisation et de leurs compromis.",
        },
      ],
    },

    {
      number: "2.10.10",
      slug: "revue-finale-quiz-validation-module",
      title: "Revue finale complète et quiz de validation du module",
      parentSlug: "capstone-afripay-data-platform",
      duration_minutes: 30,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Dix chapitres, une centaine de leçons, un seul projet qui a grandi du premier SELECT jusqu'à une plateforme de données complète. Cette dernière leçon fait le lien final avant le quiz de validation du module.",
          },
          {
            type: "checklist",
            title: "Le parcours complet du Module 02, chapitre par chapitre",
            items: [
              "2.1 — Environnement PostgreSQL et contexte du fil rouge AfriPay",
              "2.2 — SQL Foundations : SELECT à HAVING, en comprenant l'ordre logique d'exécution",
              "2.3 — Joins, ensembles, sous-requêtes, CTEs",
              "2.4 — Window functions, cumuls, détection d'anomalies, as-of join",
              "2.5 — SQL avancé : transactions, vues, CTE récursive, upsert, fuseaux horaires",
              "2.6 — Modélisation dimensionnelle complète : star schema, grain, SCD",
              "2.7 — Pipeline Bronze/Silver/Gold, idempotence, data quality",
              "2.8 — Index, EXPLAIN ANALYZE, partitionnement, anti-patterns",
              "2.9 — dbt et le concept d'orchestration",
              "2.10 — La consolidation en un seul projet défendable en entretien",
            ],
          },
          {
            type: "callout",
            title: "Ce module se termine, le fil rouge AfriPay continue",
            text: "AfriPay ne disparaît pas à la fin de ce module — le Module 03 l'ingère en temps réel, un module ultérieur la traite à l'échelle avec Spark, un autre la migre en lakehouse. Le star schema que tu as vérifié en 2.10.2 devient la fondation de tout ce qui suit dans le bootcamp.",
          },
          {
            type: "sql_sandbox",
            prompt: "Dernière requête du module — reconstitue le tableau de bord complet une dernière fois, comme preuve finale de maîtrise.",
            starterQuery:
              "with conversion as (\n  select t.*, fx.rate_to_usd,\n    round(t.amount_local / fx.rate_to_usd, 2) as amount_usd\n  from fact_transactions t\n  join lateral (\n    select rate_to_usd from fx_rates\n    where fx_rates.currency_code = t.currency_code and fx_rates.rate_date <= t.transaction_at::date\n    order by rate_date desc limit 1\n  ) fx on true\n  where t.status = 'completed'\n)\nselect co.country_name, count(*) as nb_transactions, round(sum(amount_usd), 2) as revenu_usd\nfrom conversion c\njoin dim_country co on co.country_code = c.country_code\ngroup by co.country_name\norder by revenu_usd desc;",
          },
          {
            type: "p",
            text: "Le quiz final du module (20 questions, ci-dessous) couvre l'ensemble des dix chapitres — 80% de réussite débloquent ton certificat du Module 02.",
          },
        ],
      },
      quiz: [
        {
          question: "Le dépôt GitHub final d'AfriPay Data Platform doit permettre à un recruteur de :",
          options: [
            "Voir uniquement le nombre de lignes de code",
            "Comprendre en quelques minutes le problème, les choix de modélisation et la robustesse du pipeline",
            "Rien de particulier, le code suffit"
          ],
          correct_index: 1,
          explain: "La documentation et la structure comptent autant que le SQL lui-même en entretien.",
        },
        {
          question: "Que devient le jeu de données AfriPay après ce module ?",
          options: [
            "Il n'est plus jamais utilisé dans le bootcamp",
            "Il continue d'être le fil rouge des modules suivants (ingestion temps réel, Spark, lakehouse)",
            "Il est remplacé par un nouveau jeu de données à chaque module"
          ],
          correct_index: 1,
          explain: "Le star schema construit ici devient la fondation réutilisée par les modules suivants du bootcamp.",
        },
      ],
    },
  ];

  const slugToId = new Map<string, string>();

  for (const lesson of lessons) {
    console.log(`  → Leçon ${lesson.number} — ${lesson.title}`);
    const { quiz, parentSlug, ...lessonRow } = lesson as typeof lesson & { parentSlug?: string };
    const parentId = parentSlug ? slugToId.get(parentSlug) ?? null : null;
    if (parentSlug && !parentId) throw new Error(`Parent introuvable pour ${lesson.slug} (parentSlug=${parentSlug})`);

    const { data: savedLesson, error: lessonErr } = await supabase
      .from("lessons")
      .upsert(
        {
          module_id: mod.id,
          parent_lesson_id: parentId,
          number: lessonRow.number,
          slug: lessonRow.slug,
          title: lessonRow.title,
          body_content: lessonRow.body_content,
          duration_minutes: lessonRow.duration_minutes,
          sort_order: lessonRow.sort_order,
          status: "published",
        },
        { onConflict: "module_id,slug" }
      )
      .select()
      .single();

    if (lessonErr || !savedLesson) throw lessonErr ?? new Error("Leçon introuvable après upsert");
    slugToId.set(lesson.slug, savedLesson.id);

    await supabase.from("quiz_questions").delete().eq("lesson_id", savedLesson.id);
    if (quiz.length > 0) {
      await supabase.from("quiz_questions").insert(
        quiz.map((q, i) => ({
          lesson_id: savedLesson.id,
          question: q.question,
          options: q.options,
          correct_index: q.correct_index,
          explain: q.explain,
          sort_order: i,
        }))
      );
    }
  }

  // Nettoyage des leçons d'une version antérieure du seed
  const currentSlugs = lessons.map((l) => l.slug);
  await supabase
    .from("lessons")
    .delete()
    .eq("module_id", mod.id)
    .not("slug", "in", `(${currentSlugs.join(",")})`);

  // Quiz final du module — 20 questions couvrant les 10 leçons
  console.log("  → Quiz final du module…");
  const finalQuiz = [
    { question: "Quel outil VS Code recommandé pour écrire du SQL directement dans l'éditeur ?", options: ["SQLTools", "Prettier", "ESLint"], correct_index: 0 },
    { question: "NOT IN avec une sous-requête contenant un NULL renvoie :", options: ["Une erreur", "Toujours zéro ligne", "Toutes les lignes"], correct_index: 1 },
    { question: "L'opérateur ->> sur une colonne JSONB renvoie :", options: ["Du texte", "Un tableau", "Toujours NULL"], correct_index: 0 },
    { question: "Une jointure 1:1 qui multiplie les lignes de façon inattendue révèle :", options: ["Un bug PostgreSQL", "Une clé qu'on pensait unique ne l'est pas", "Rien d'anormal"], correct_index: 1 },
    { question: "Une window function, contrairement à GROUP BY, garde :", options: ["Chaque ligne individuelle visible", "Uniquement les agrégats", "Aucune donnée"], correct_index: 0 },
    { question: "Un as-of join sur fx_rates sert à :", options: ["Trier les devises", "Joindre au taux en vigueur à la date de la transaction", "Supprimer les doublons"], correct_index: 1 },
    { question: "LAG() regarde :", options: ["La ligne suivante", "La ligne précédente", "Toutes les lignes en même temps"], correct_index: 1 },
    { question: "Une transaction SQL (BEGIN/COMMIT/ROLLBACK) garantit :", options: ["La vitesse", "L'atomicité — tout ou rien", "Rien de précis"], correct_index: 1 },
    { question: "Une CTE récursive est adaptée pour modéliser :", options: ["Une hiérarchie", "Un simple filtre", "Une devise"], correct_index: 0 },
    { question: "Dans un star schema, les dimensions sont typiquement :", options: ["Normalisées en 3NF", "Dénormalisées", "Absentes"], correct_index: 1 },
    { question: "Le grain d'une table de faits désigne :", options: ["Sa taille physique", "Ce que représente une seule ligne", "Le nombre de colonnes"], correct_index: 1 },
    { question: "Pour garder l'historique complet d'un attribut qui change, on utilise :", options: ["SCD Type 0", "SCD Type 1", "SCD Type 2"], correct_index: 2 },
    { question: "Dans l'architecture Medallion, Bronze désigne :", options: ["La donnée brute non modifiée", "La donnée prête pour le business", "Un type d'index"], correct_index: 0 },
    { question: "Un traitement idempotent garantit que :", options: ["Il va plus vite à chaque fois", "Le relancer produit le même résultat qu'une seule exécution", "Il ne peut jamais échouer"], correct_index: 1 },
    { question: "ON CONFLICT DO UPDATE sert principalement à :", options: ["Rendre un chargement rejouable sans dupliquer", "Supprimer des lignes", "Créer un index"], correct_index: 0 },
    { question: "Pourquoi ne pas indexer systématiquement toutes les colonnes ?", options: ["PostgreSQL l'interdit", "Chaque index ralentit les écritures et coûte de l'espace", "Ce n'est pas possible techniquement"], correct_index: 1 },
    { question: "Un Seq Scan dans un plan EXPLAIN signifie :", options: ["Une erreur", "Le moteur lit la table entière ligne par ligne", "Un index a été utilisé"], correct_index: 1 },
    { question: "Le rôle principal de dbt est de :", options: ["Ingérer des données depuis des APIs", "Gérer des transformations SQL versionnées, testées, documentées", "Remplacer PostgreSQL"], correct_index: 1 },
    { question: "Ce module construit-il un Airflow complet ?", options: ["Oui, en profondeur", "Non — juste le concept, Airflow est le Module 05", "Ce n'est pas mentionné"], correct_index: 1 },
    { question: "Le seuil de réussite du quiz final chez DataLendo est de :", options: ["50%", "80%", "100%"], correct_index: 1 },
  ];
  await supabase.from("quiz_questions").delete().eq("module_id", mod.id);
  await supabase.from("quiz_questions").insert(
    finalQuiz.map((q, i) => ({
      module_id: mod.id,
      question: q.question,
      options: q.options,
      correct_index: q.correct_index,
      sort_order: i,
    }))
  );

  console.log("✓ Module 02 seedé avec succès (10 leçons).");
}

main().catch((err) => {
  console.error("✗ Échec du seed :", err);
  process.exit(1);
});
