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
        is_free: false,
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
    // 2.2 — SQL FOUNDATIONS
    // ============================================================
    {
      number: "2.2",
      slug: "sql-foundations-pour-data-engineers",
      title: "SQL Foundations pour Data Engineers",
      duration_minutes: 240,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Tu connais peut-être déjà SELECT/WHERE/GROUP BY. Cette leçon ne les traite pas comme des bases isolées — elle les traite comme les bases seront traitées toute ta carrière : avec l'œil d'un data engineer qui pense en volumes, pas en lignes.",
          },
          { type: "h3", text: "SELECT, FROM, WHERE, ORDER BY, LIMIT, DISTINCT" },
          {
            type: "sql_code",
            text: "-- Les 500 transactions les plus récentes au Kenya\nselect transaction_id, transaction_at, amount_local, channel\nfrom fact_transactions\nwhere country_code = 'KE'\norder by transaction_at desc\nlimit 500;",
          },
          {
            type: "p",
            text: "DISTINCT dédoublonne — mais il recalcule un tri interne sur toutes les colonnes sélectionnées à chaque exécution. Sur une table de quelques milliers de lignes, invisible. Sur des dizaines de millions, un DISTINCT mal placé peut multiplier le temps d'exécution par dix.",
          },
          {
            type: "sql_code",
            text: "-- Quels canaux de paiement existent réellement dans les données ?\nselect distinct channel from fact_transactions;",
          },
          { type: "h3", text: "Types de données, dont JSONB" },
          {
            type: "p",
            text: "fact_transactions.channel_metadata est une colonne JSONB — chaque transaction mobile money y stocke l'opérateur (Orange Money, M-Pesa, MTN MoMo...) et le système d'exploitation, sans avoir besoin d'une colonne dédiée par opérateur.",
          },
          {
            type: "sql_code",
            text: "-- Extraire un champ JSON avec l'opérateur ->> (retourne du texte)\nselect transaction_id, channel_metadata->>'operator' as operator\nfrom fact_transactions\nwhere channel = 'mobile_money'\nlimit 10;",
          },
          { type: "h3", text: "Filtrage avancé" },
          {
            type: "list",
            items: [
              "IN / NOT IN — appartenance à une liste",
              "BETWEEN — un intervalle inclusif",
              "LIKE / ILIKE — correspondance de motif (ILIKE ignore la casse)",
              "IS NULL / IS NOT NULL — jamais = NULL, qui ne renvoie jamais vrai",
            ],
          },
          {
            type: "sql_code",
            text: "select * from dim_merchant\nwhere category in ('Alimentation', 'Transport')\n  and merchant_name ilike '%marché%';",
          },
          { type: "h3", text: "CASE, et le piège du NULL en logique à trois valeurs" },
          {
            type: "p",
            text: "COALESCE renvoie la première valeur non nulle d'une liste ; NULLIF renvoie NULL si deux valeurs sont égales. Utiles — mais le vrai piège n'est pas là. Il est dans NOT IN.",
          },
          {
            type: "callout",
            title: "🪤 Le piège du NULL — testé sur nos vraies données",
            text: "raw_transactions_bronze.customer_id contient quelques valeurs NULL (extraction imparfaite, volontairement). La requête ci-dessous semble raisonnable : trouver les clients qui n'apparaissent jamais dans cette extraction. En SQL, dès qu'un NULL se glisse dans la liste de NOT IN, la comparaison devient indéterminée pour CHAQUE ligne — et la requête ne renvoie plus jamais rien, silencieusement.",
          },
          {
            type: "sql_code",
            text: "-- ⚠ Renvoie TOUJOURS zéro ligne à cause des NULL dans la sous-requête\nselect * from dim_customer\nwhere customer_id not in (select customer_id::int from raw_transactions_bronze);\n\n-- ✅ La version correcte : NOT EXISTS ignore proprement les NULL\nselect c.* from dim_customer c\nwhere not exists (\n  select 1 from raw_transactions_bronze b\n  where b.customer_id is not null and b.customer_id::int = c.customer_id\n);",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Exécute d'abord la version NOT IN (elle renverra 0 ligne), puis la version NOT EXISTS. Compare.",
            starterQuery:
              "select count(*) from dim_customer\nwhere customer_id not in (select customer_id::int from raw_transactions_bronze);",
          },
          { type: "h3", text: "Agrégats : GROUP BY et HAVING" },
          {
            type: "sql_code",
            text: "-- Pays où le volume de transactions dépasse 500\nselect country_code, count(*) as nb_transactions, sum(amount_local) as volume\nfrom fact_transactions\ngroup by country_code\nhaving count(*) > 500\norder by nb_transactions desc;",
          },
          {
            type: "thinking_prompt",
            text: "Cette requête retourne le bon résultat sur 5 000 lignes en quelques millisecondes — mais tiendrait-elle avec 50 millions de lignes ? WHERE filtre avant l'agrégation (donc sur les lignes brutes), HAVING filtre après (sur les groupes) : intervertir les deux par erreur peut faire scanner des dizaines de fois plus de données que nécessaire.",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Atelier — pour chaque canal de paiement, calcule le nombre de transactions et le montant moyen. Garde uniquement les canaux avec plus de 1000 transactions.",
            starterQuery: "select channel, count(*), avg(amount_local)\nfrom fact_transactions\ngroup by channel;",
          },
        ],
      },
      quiz: [
        {
          question: "Que renvoie `NOT IN` dès qu'un NULL se trouve dans sa liste de comparaison ?",
          options: ["Une erreur", "Toujours zéro ligne pour la requête entière", "Il ignore simplement le NULL"],
          correct_index: 1,
          explain: "La logique à trois valeurs de SQL rend la comparaison indéterminée pour toutes les lignes — utilise NOT EXISTS ou filtre explicitement les NULL.",
        },
        {
          question: "Quel opérateur extrait un champ d'une colonne JSONB sous forme de texte ?",
          options: ["->", "->>","::json"],
          correct_index: 1,
          explain: "-> renvoie du JSON, ->> renvoie du texte directement utilisable.",
        },
        {
          question: "HAVING filtre :",
          options: ["Les lignes, avant l'agrégation", "Les groupes, après l'agrégation", "Rien, c'est un synonyme de WHERE"],
          correct_index: 1,
          explain: "WHERE s'applique avant GROUP BY, HAVING après.",
        },
        {
          question: "ILIKE se distingue de LIKE par :",
          options: ["Il est insensible à la casse", "Il est plus rapide", "Il n'accepte pas les % "],
          correct_index: 0,
          explain: "ILIKE est l'équivalent insensible à la casse de LIKE, spécifique à PostgreSQL.",
        },
      ],
    },

    // ============================================================
    // 2.3 — JOINS, ENSEMBLES, SOUS-REQUÊTES, CTEs
    // ============================================================
    {
      number: "2.3",
      slug: "joins-ensembles-sous-requetes-ctes",
      title: "Joins, ensembles, sous-requêtes, CTEs",
      duration_minutes: 300,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Aucune donnée utile ne vit dans une seule table. Cette leçon est celle où AfriPay cesse d'être sept tables isolées pour devenir un système cohérent.",
          },
          { type: "h3", text: "JOINs" },
          {
            type: "list",
            items: [
              "INNER JOIN — seulement les lignes qui correspondent des deux côtés",
              "LEFT JOIN — toutes les lignes de gauche, correspondance ou NULL à droite",
              "RIGHT JOIN — l'inverse, rarement utilisé (on réécrit en LEFT JOIN en inversant les tables)",
              "FULL JOIN — l'union des deux, correspondance ou non",
              "CROSS JOIN — produit cartésien, chaque ligne de gauche avec chaque ligne de droite",
              "SELF JOIN — une table jointe à elle-même (utile pour dim_agent, voir Leçon 2.5)",
            ],
          },
          {
            type: "sql_code",
            text: "-- Chaque transaction avec le nom du pays (INNER — country_code est toujours renseigné)\nselect t.transaction_id, c.country_name, t.amount_local\nfrom fact_transactions t\njoin dim_country c on c.country_code = t.country_code\nlimit 20;",
          },
          { type: "h3", text: "Cardinalité — pourquoi les lignes se multiplient" },
          {
            type: "p",
            text: "Une jointure 1:N (un client, plusieurs transactions) multiplie les lignes du côté \"1\" par le nombre de correspondances. C'est voulu et attendu. Le problème survient quand une jointure censée être 1:1 devient accidentellement 1:N — parce qu'une clé qu'on pensait unique ne l'est pas.",
          },
          {
            type: "sql_code",
            text: "-- Vérifier qu'une jointure ne va pas dupliquer des lignes : compare avant/après\nselect count(*) from fact_transactions; -- ligne de référence\n\nselect count(*) from fact_transactions t\njoin dim_customer c on c.customer_id = t.customer_id; -- doit renvoyer le même nombre",
          },
          {
            type: "thinking_prompt",
            text: "Si le nombre de lignes explose après une jointure que tu pensais 1:1, qu'est-ce que ça révèle ? Presque toujours : la colonne de jointure n'est pas réellement une clé unique côté droit — une supposition sur le modèle de données vient d'être invalidée par les faits.",
          },
          { type: "h3", text: "Ensembles : UNION, INTERSECT, EXCEPT" },
          {
            type: "sql_code",
            text: "-- Pays où AfriPay a des clients OU des marchands (UNION dédoublonne, UNION ALL non)\nselect country_code from dim_customer\nunion\nselect country_code from dim_merchant;\n\n-- Pays présents dans les deux (INTERSECT)\nselect country_code from dim_customer\nintersect\nselect country_code from dim_merchant;",
          },
          { type: "h3", text: "Sous-requêtes corrélées et non-corrélées" },
          {
            type: "sql_code",
            text: "-- Non-corrélée : la sous-requête s'exécute une seule fois\nselect * from dim_merchant\nwhere country_code in (select country_code from dim_country where region = 'Afrique de l''Ouest');\n\n-- Corrélée : la sous-requête se ré-exécute pour chaque ligne externe, elle référence t\nselect m.merchant_name,\n  (select count(*) from fact_transactions t where t.merchant_id = m.merchant_id) as nb_transactions\nfrom dim_merchant m;",
          },
          { type: "h3", text: "CTEs (WITH)" },
          {
            type: "sql_code",
            text: "with volume_par_pays as (\n  select country_code, sum(amount_local) as volume\n  from fact_transactions\n  group by country_code\n)\nselect c.country_name, v.volume\nfrom volume_par_pays v\njoin dim_country c on c.country_code = v.country_code\norder by v.volume desc;",
          },
          {
            type: "callout",
            title: "Astuce avancée : LATERAL",
            text: "Un LATERAL JOIN permet à une sous-requête de référencer les colonnes de la ligne en cours de la table de gauche — utile pour \"le top 3 de chaque groupe\" ou l'as-of join que tu verras en leçon 2.4. Retiens le nom, tu le reverras vite.",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Atelier — reconstitue la vue 360° d'un client AfriPay : son nom, son pays, le nombre total de ses transactions et le montant total dépensé. Commence par le client 1.",
            starterQuery:
              "select c.full_name, co.country_name,\n  count(t.transaction_id) as nb_transactions,\n  coalesce(sum(t.amount_local), 0) as total_depense\nfrom dim_customer c\njoin dim_country co on co.country_code = c.country_code\nleft join fact_transactions t on t.customer_id = c.customer_id\nwhere c.customer_id = 1\ngroup by c.full_name, co.country_name;",
          },
        ],
      },
      quiz: [
        {
          question: "Quel type de jointure garde toutes les lignes de la table de gauche, même sans correspondance ?",
          options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN"],
          correct_index: 1,
          explain: "LEFT JOIN complète avec NULL les colonnes de droite quand il n'y a pas de correspondance.",
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
          question: "Une sous-requête corrélée se distingue d'une non-corrélée parce qu'elle :",
          options: [
            "S'exécute une seule fois pour toute la requête",
            "Référence une colonne de la requête externe et se ré-exécute par ligne",
            "Ne peut jamais être utilisée dans un SELECT",
          ],
          correct_index: 1,
          explain: "C'est cette dépendance ligne par ligne qui la rend potentiellement coûteuse à grande échelle.",
        },
      ],
    },

    // ============================================================
    // 2.4 — WINDOW FUNCTIONS & SQL ANALYTIQUE
    // ============================================================
    {
      number: "2.4",
      slug: "window-functions-sql-analytique",
      title: "Window Functions & SQL analytique",
      duration_minutes: 240,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "GROUP BY écrase les lignes en groupes. Les window functions font l'inverse : elles calculent un agrégat tout en gardant chaque ligne individuelle visible. C'est la compétence qui distingue le plus nettement un SQL de débutant d'un SQL de data engineer.",
          },
          { type: "h3", text: "OVER, PARTITION BY, ORDER BY" },
          {
            type: "sql_code",
            text: "-- Chaque transaction, avec le total de son pays affiché sur CHAQUE ligne\nselect transaction_id, country_code, amount_local,\n  sum(amount_local) over (partition by country_code) as total_pays\nfrom fact_transactions\nlimit 10;",
          },
          { type: "h3", text: "Ranking : ROW_NUMBER, RANK, DENSE_RANK, NTILE" },
          {
            type: "sql_code",
            text: "-- Le marchand n°1 par volume, dans CHAQUE pays (pas un top global)\nwith classement as (\n  select m.merchant_name, t.country_code, sum(t.amount_local) as volume,\n    rank() over (partition by t.country_code order by sum(t.amount_local) desc) as rang\n  from fact_transactions t\n  join dim_merchant m on m.merchant_id = t.merchant_id\n  group by m.merchant_name, t.country_code\n)\nselect * from classement where rang = 1;",
          },
          { type: "h3", text: "Valeurs relatives : LAG, LEAD" },
          {
            type: "sql_code",
            text: "-- Évolution du volume mensuel par pays, mois précédent inclus\nwith mensuel as (\n  select country_code, date_trunc('month', transaction_at) as mois, sum(amount_local) as volume\n  from fact_transactions\n  group by 1, 2\n)\nselect country_code, mois, volume,\n  lag(volume) over (partition by country_code order by mois) as volume_mois_precedent\nfrom mensuel\norder by country_code, mois;",
          },
          { type: "h3", text: "Running totals et cumul depuis le début de l'année (YTD)" },
          {
            type: "sql_code",
            text: "select country_code, date_trunc('month', transaction_at) as mois,\n  sum(sum(amount_local)) over (\n    partition by country_code, extract(year from transaction_at)\n    order by date_trunc('month', transaction_at)\n  ) as cumul_ytd\nfrom fact_transactions\ngroup by 1, 2, extract(year from transaction_at)\norder by 1, 2;",
          },
          {
            type: "thinking_prompt",
            text: "Comment détecter une transaction suspecte sans écrire une boucle procédurale ? Compare chaque montant à la moyenne (et l'écart-type) des transactions du même client — une window function le fait en une seule requête, là où un langage procédural écrirait une boucle par client.",
          },
          {
            type: "sql_code",
            text: "-- Transactions dont le montant dépasse 3x la moyenne du client\nwith stats_client as (\n  select transaction_id, amount_local, customer_id,\n    avg(amount_local) over (partition by customer_id) as moyenne_client\n  from fact_transactions\n)\nselect * from stats_client where amount_local > 3 * moyenne_client;",
          },
          { type: "h3", text: "As-of join : convertir chaque transaction au bon taux de change" },
          {
            type: "callout",
            title: "Le piège qui coûte cher en production",
            text: "fx_rates contient un taux différent CHAQUE JOUR. Joindre naïvement une transaction au taux \"le plus récent\" plutôt qu'au taux en vigueur À SA DATE fausse silencieusement tout l'historique — une erreur réelle et fréquente en fintech.",
          },
          {
            type: "sql_code",
            text: "-- As-of join via LATERAL : le taux en vigueur À LA DATE de la transaction, pas celui d'aujourd'hui\nselect t.transaction_id, t.transaction_at, t.amount_local, t.currency_code,\n  fx.rate_to_usd,\n  round(t.amount_local / fx.rate_to_usd, 2) as amount_usd\nfrom fact_transactions t\njoin lateral (\n  select rate_to_usd\n  from fx_rates\n  where fx_rates.currency_code = t.currency_code\n    and fx_rates.rate_date <= t.transaction_at::date\n  order by rate_date desc\n  limit 1\n) fx on true\nlimit 20;",
            caption: "Alternative équivalente : DISTINCT ON (t.transaction_id) avec un ORDER BY rate_date desc.",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Atelier — top marchands par pays (fait), détection de transactions inhabituelles (fait), puis convertis les 20 premières transactions du Kenya en USD via l'as-of join ci-dessus.",
            starterQuery:
              "select t.transaction_id, t.transaction_at, t.amount_local, t.currency_code,\n  fx.rate_to_usd, round(t.amount_local / fx.rate_to_usd, 2) as amount_usd\nfrom fact_transactions t\njoin lateral (\n  select rate_to_usd from fx_rates\n  where fx_rates.currency_code = t.currency_code and fx_rates.rate_date <= t.transaction_at::date\n  order by rate_date desc limit 1\n) fx on true\nwhere t.country_code = 'KE'\nlimit 20;",
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
          question: "Quelle fonction renvoie la valeur de la ligne PRÉCÉDENTE dans une fenêtre ordonnée ?",
          options: ["LEAD", "LAG", "RANK"],
          correct_index: 1,
          explain: "LAG regarde en arrière, LEAD regarde en avant.",
        },
      ],
    },

    // ============================================================
    // 2.5 — SQL AVANCÉ
    // ============================================================
    {
      number: "2.5",
      slug: "sql-avance-pour-data-engineers",
      title: "SQL avancé pour Data Engineers",
      duration_minutes: 300,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Cette leçon rassemble les compétences qui séparent \"je sais écrire des requêtes\" de \"je peux concevoir un système sur lequel d'autres s'appuient\".",
          },
          { type: "h3", text: "DDL/DML avancé et contraintes" },
          {
            type: "sql_code",
            text: "alter table dim_merchant add column is_active boolean not null default true;\n\n-- Contraintes : PK, FK, UNIQUE, CHECK — déjà partout dans le schéma AfriPay\n-- ex. dim_customer.segment a un CHECK, fact_transactions.customer_id une FK",
          },
          { type: "h3", text: "Transactions et ACID" },
          {
            type: "p",
            text: "BEGIN ouvre une transaction, COMMIT la valide, ROLLBACK l'annule entièrement. Sur un pipeline qui insère 5000 lignes, une transaction garantit qu'une erreur à la ligne 4999 n'en laisse pas 4998 orphelines en base — ACID (Atomicité, Cohérence, Isolation, Durabilité) est ce qui rend ça possible.",
          },
          {
            type: "sql_code",
            text: "begin;\nupdate dim_merchant set is_active = false where merchant_id = 12;\n-- si une erreur survient ici, rien n'est appliqué\ncommit;",
          },
          { type: "h3", text: "Vues et vues matérialisées" },
          {
            type: "sql_code",
            text: "create view v_volume_par_pays as\nselect country_code, sum(amount_local) as volume, count(*) as nb_transactions\nfrom fact_transactions group by country_code;\n\n-- Une vue matérialisée fige le résultat — à rafraîchir explicitement\ncreate materialized view mv_volume_par_pays as select * from v_volume_par_pays;\nrefresh materialized view mv_volume_par_pays;",
          },
          {
            type: "callout",
            title: "Vue vs vue matérialisée",
            text: "Une vue simple recalcule sa requête à chaque lecture — toujours à jour, mais potentiellement lente. Une vue matérialisée stocke le résultat — rapide à lire, mais périmée tant qu'on ne la rafraîchit pas. Le choix dépend de si la fraîcheur ou la vitesse compte le plus.",
          },
          { type: "h3", text: "CTE récursive : la hiérarchie d'agents AfriPay" },
          {
            type: "p",
            text: "dim_agent modélise le réseau d'agents mobile money : des responsables régionaux, qui supervisent des agents de terrain, qui recrutent parfois des sous-agents. C'est une hiérarchie — exactement le cas d'usage d'une CTE récursive.",
          },
          {
            type: "sql_code",
            text: "-- Tous les agents sous le responsable régional de Côte d'Ivoire, avec leur profondeur\nwith recursive hierarchie as (\n  select agent_id, agent_name, manager_id, role, 1 as profondeur\n  from dim_agent\n  where role = 'regional_manager' and country_code = 'CI'\n\n  union all\n\n  select a.agent_id, a.agent_name, a.manager_id, a.role, h.profondeur + 1\n  from dim_agent a\n  join hierarchie h on a.manager_id = h.agent_id\n)\nselect * from hierarchie order by profondeur, agent_name;",
          },
          { type: "h3", text: "CTAS et tables temporaires" },
          {
            type: "sql_code",
            text: "-- CREATE TABLE AS SELECT — matérialise un résultat en vraie table\ncreate table stg_volume_2024 as\nselect country_code, sum(amount_local) as volume\nfrom fact_transactions\nwhere extract(year from transaction_at) = 2024\ngroup by country_code;",
          },
          { type: "h3", text: "JSON/JSONB en profondeur" },
          {
            type: "sql_code",
            text: "-- Filtrer directement sur un champ JSON, sans le sortir en colonne\nselect transaction_id, channel_metadata\nfrom fact_transactions\nwhere channel_metadata->>'operator' = 'Orange Money'\n  and channel_metadata->>'device_os' = 'android';",
          },
          { type: "h3", text: "Upsert — INSERT ... ON CONFLICT" },
          {
            type: "sql_code",
            text: "-- Insère, ou met à jour si le taux du jour existe déjà (rejouable sans dupliquer)\ninsert into fx_rates (currency_code, rate_date, rate_to_usd)\nvalues ('XOF', current_date, 610.5)\non conflict (currency_code, rate_date)\ndo update set rate_to_usd = excluded.rate_to_usd;",
          },
          {
            type: "thinking_prompt",
            text: "Si je relance ce script d'insertion deux fois, est-ce que je duplique mes données ? Avec ON CONFLICT, non — la leçon 2.7 construit là-dessus pour rendre un pipeline entier idempotent.",
          },
          { type: "h3", text: "Fuseaux horaires multi-pays" },
          {
            type: "p",
            text: "fact_transactions.transaction_at est un timestamptz — un instant absolu, indépendant du fuseau. Mais \"le jour de la transaction\" dépend d'où on se trouve : 23h50 à Nairobi (UTC+3) et 23h50 à Rabat (UTC+1) ne tombent pas le même jour en UTC.",
          },
          {
            type: "sql_code",
            text: "-- L'heure locale réelle de chaque transaction, selon le fuseau de son pays\nselect t.transaction_id, t.transaction_at,\n  t.transaction_at at time zone c.timezone as heure_locale\nfrom fact_transactions t\njoin dim_country c on c.country_code = t.country_code\nlimit 10;",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Atelier — trouve les 3 sous-agents recrutés par l'agent de terrain le plus ancien du Kenya (utilise la CTE récursive ci-dessus en changeant le pays).",
            starterQuery:
              "with recursive hierarchie as (\n  select agent_id, agent_name, manager_id, role, 1 as profondeur\n  from dim_agent where role = 'regional_manager' and country_code = 'KE'\n  union all\n  select a.agent_id, a.agent_name, a.manager_id, a.role, h.profondeur + 1\n  from dim_agent a join hierarchie h on a.manager_id = h.agent_id\n)\nselect * from hierarchie order by profondeur, agent_name;",
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
          question: "Une CTE récursive est adaptée pour modéliser :",
          options: ["Une liste plate de clients", "Une hiérarchie (managers, sous-agents...)", "Un taux de change"],
          correct_index: 1,
          explain: "C'est exactement le cas de dim_agent : manager_id qui référence agent_id de la même table.",
        },
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
          question: "Que fait `transaction_at at time zone c.timezone` ?",
          options: [
            "Rien, c'est une erreur de syntaxe",
            "Convertit un instant absolu en heure locale du fuseau donné",
            "Supprime le fuseau horaire définitivement",
          ],
          correct_index: 1,
          explain: "AT TIME ZONE convertit un timestamptz en l'heure murale locale de la zone indiquée.",
        },
      ],
    },

    // ============================================================
    // 2.6 — MODÉLISATION DE DONNÉES ⭐
    // ============================================================
    {
      number: "2.6",
      slug: "modelisation-de-donnees",
      title: "⭐ Modélisation de données",
      duration_minutes: 360,
      sort_order: 6,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "C'est le cœur de ce module, et probablement la compétence la plus rentable de tout le bootcamp en entretien d'embauche. N'importe qui peut apprendre la syntaxe SQL en une semaine ; savoir concevoir le bon schéma pour le bon problème, c'est ce qui distingue un data engineer confirmé.",
          },
          { type: "h3", text: "Pourquoi modéliser : du problème métier aux tables" },
          {
            type: "p",
            text: "Modéliser, c'est traduire une question métier (« quel est le revenu d'AfriPay par pays et par mois ? ») en une structure de tables qui rend cette question facile, rapide et fiable à répondre — pas juste possible.",
          },
          { type: "h3", text: "Modèle conceptuel et logique (MCD/MLD)" },
          {
            type: "list",
            items: [
              "MCD (conceptuel) — les entités du métier et leurs relations, sans se soucier du type de base de données : Client, Marchand, Transaction, Pays",
              "MLD (logique) — le même modèle traduit en tables, colonnes, clés primaires et étrangères, indépendant du moteur SQL précis",
              "Cardinalités — 1:1 (un client, un compte), 1:N (un client, plusieurs transactions), N:N (nécessite une table de liaison)",
            ],
          },
          { type: "h3", text: "Normalisation 1NF → 3NF, et dénormalisation raisonnée" },
          {
            type: "table",
            headers: ["Forme normale", "Règle", "Exemple AfriPay"],
            rows: [
              ["1NF", "Chaque cellule contient une seule valeur atomique", "Pas de liste de canaux dans une seule colonne"],
              ["2NF", "Chaque colonne dépend de la clé primaire ENTIÈRE", "merchant_name ne doit pas être répété dans fact_transactions"],
              ["3NF", "Aucune colonne ne dépend d'une autre colonne non-clé", "country_name doit vivre dans dim_country, pas être dupliqué partout"],
            ],
          },
          {
            type: "p",
            text: "Un système transactionnel (OLTP) vise la 3NF : zéro redondance, cohérence garantie. Un entrepôt analytique dénormalise volontairement — comme tu vas le voir avec le schéma en étoile — parce que la vitesse de lecture compte plus que l'absence totale de redondance.",
          },
          { type: "h3", text: "Modélisation dimensionnelle (Kimball)" },
          {
            type: "list",
            items: [
              "Fact table — les faits mesurables (une transaction), avec des clés étrangères vers les dimensions et des mesures numériques",
              "Fact transactionnelle — une ligne par événement (fact_transactions)",
              "Fact snapshot — une photo périodique d'un état (ex. solde de compte chaque nuit)",
              "Fact accumulating — une ligne mise à jour au fil d'un processus (ex. un onboarding marchand, de la demande à l'activation)",
              "Dimension — le contexte descriptif (dim_customer, dim_merchant, dim_country, dim_date)",
              "Dimensions conformées — la même dim_date, la même dim_country, réutilisées par tous les schémas en étoile de l'entreprise",
            ],
          },
          {
            type: "star_schema",
            factTable: "fact_transactions",
            factColumns: ["transaction_id", "amount_local", "channel", "status"],
            dimensions: ["dim_customer", "dim_merchant", "dim_country", "dim_date"],
          },
          { type: "h3", text: "Star Schema vs Snowflake vs One Big Table (OBT)" },
          {
            type: "table",
            headers: ["Modèle", "Principe", "Compromis"],
            rows: [
              ["Star Schema", "Une fact table, des dimensions dénormalisées directement reliées", "Simple à interroger, quelques Mo de redondance"],
              ["Snowflake Schema", "Les dimensions sont elles-mêmes normalisées (dim_country éclatée en dim_region + dim_country)", "Moins de redondance, mais plus de jointures à chaque requête"],
              ["One Big Table (OBT)", "Fact et dimensions pré-jointes en une seule table large", "Lectures très rapides, mais duplication importante et mises à jour coûteuses"],
            ],
          },
          {
            type: "callout",
            title: "L'arbitrage moderne",
            text: "Avec le stockage colonnaire (Parquet, BigQuery, Snowflake) devenu très bon marché, l'OBT gagne du terrain pour les tableaux de bord à très forte lecture. Le star schema reste le standard par défaut : équilibre entre simplicité, gouvernance et coût de stockage.",
          },
          { type: "h3", text: "Le grain, et les clés de substitution" },
          {
            type: "p",
            text: "Le grain d'une table, c'est la réponse à « que représente une seule ligne ? ». Pour fact_transactions, le grain est « une transaction ». Se tromper de grain (par exemple agréger par accident au niveau du client) casse silencieusement toutes les analyses futures. Une clé de substitution (surrogate key, ex. transaction_id auto-incrémenté) est indépendante de toute clé métier — elle ne change jamais, même si la clé métier évolue.",
          },
          { type: "h3", text: "Slowly Changing Dimensions (SCD)" },
          {
            type: "table",
            headers: ["Type", "Comportement", "Cas AfriPay"],
            rows: [
              ["Type 0", "Jamais modifié après création", "Date de signup d'un client"],
              ["Type 1", "Écrase l'ancienne valeur, aucun historique", "Corriger une faute de frappe dans un nom"],
              ["Type 2", "Nouvelle ligne à chaque changement, avec valid_from/valid_to/is_current", "Un client déménage de pays — on garde l'historique de qui il était"],
              ["Type 3 / 6", "Une colonne \"valeur précédente\" (3), ou combinaison de 1+2+3 (6)", "Cas avancés, rarement nécessaires en pratique"],
            ],
          },
          {
            type: "sql_code",
            text: "-- dim_customer en SCD Type 2 : ajouter les colonnes de suivi de validité\nalter table dim_customer\n  add column valid_from date not null default '2024-01-01',\n  add column valid_to date,\n  add column is_current boolean not null default true;\n\n-- Un client change de pays : on clôture l'ancienne ligne, on en insère une nouvelle\nupdate dim_customer set valid_to = current_date, is_current = false where customer_id = 42 and is_current;\ninsert into dim_customer (customer_id, full_name, country_code, signup_date, segment, valid_from, is_current)\nselect customer_id, full_name, 'KE', signup_date, segment, current_date, true\nfrom dim_customer where customer_id = 42 and is_current = false order by valid_to desc limit 1;",
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
            prompt:
              "Livrable — vérifie le grain de fact_transactions : une ligne = une transaction. Compte les transaction_id en double (il ne doit y en avoir aucun).",
            starterQuery:
              "select transaction_id, count(*)\nfrom fact_transactions\ngroup by transaction_id\nhaving count(*) > 1;",
          },
          {
            type: "thinking_prompt",
            text: "Est-ce que je modélise pour la robustesse transactionnelle (3NF, zéro redondance) ou pour la vitesse analytique (star schema, redondance assumée) ? Les deux réponses ne produisent jamais les mêmes tables — et confondre les deux objectifs est l'erreur de modélisation la plus fréquente chez les débutants.",
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
          question: "Le \"grain\" d'une table de faits désigne :",
          options: ["Sa taille en Go", "Ce que représente une seule ligne", "Le nombre de dimensions qui lui sont reliées"],
          correct_index: 1,
          explain: "Se tromper de grain casse silencieusement toutes les analyses construites dessus.",
        },
        {
          question: "Un client change de pays et l'entreprise doit garder l'historique de qui il était avant. Quelle SCD ?",
          options: ["Type 0", "Type 1", "Type 2"],
          correct_index: 2,
          explain: "Type 2 ajoute une nouvelle ligne avec valid_from/valid_to — l'historique est préservé.",
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
      ],
    },

    // ============================================================
    // 2.7 — DATA WAREHOUSE, PIPELINES & QUALITÉ
    // ============================================================
    {
      number: "2.7",
      slug: "data-warehouse-pipelines-qualite",
      title: "Data Warehouse, pipelines & qualité",
      duration_minutes: 300,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Modéliser un schéma sur le papier est une chose. Construire le pipeline qui l'alimente chaque jour, sans jamais dupliquer ni perdre une donnée, en est une autre. C'est l'objet de cette leçon.",
          },
          { type: "h3", text: "Architecture Medallion : Bronze → Silver → Gold" },
          {
            type: "medallion",
            layers: [
              { name: "Bronze", description: "La donnée brute, telle qu'extraite de la source — raw_transactions_bronze : sale, mais fidèle à l'original." },
              { name: "Silver", description: "Nettoyée et conformée : types corrects, doublons retirés, clés validées — prête à être jointe en confiance." },
              { name: "Gold", description: "Modélisée pour le métier : le star schema AfriPay (fact_transactions + dimensions), prêt pour le reporting." },
            ],
          },
          { type: "h3", text: "Full load vs incremental load, watermarking" },
          {
            type: "p",
            text: "Un chargement complet (full load) retraite toutes les données à chaque exécution — simple, mais coûteux et lent à l'échelle. Un chargement incrémental ne traite que ce qui a changé depuis la dernière exécution, repéré par un watermark (typiquement la date/heure du dernier chargement réussi).",
          },
          {
            type: "sql_code",
            text: "-- Chargement incrémental : uniquement les lignes plus récentes que le dernier watermark\nselect * from raw_transactions_bronze\nwhere transaction_at_raw > (select coalesce(max(derniere_valeur), '1900-01-01') from watermarks where pipeline = 'bronze_to_silver');",
          },
          { type: "h3", text: "Idempotence — le concept qui protège tout le reste" },
          {
            type: "p",
            text: "Un traitement est idempotent si le relancer plusieurs fois produit exactement le même résultat que le lancer une seule fois. Sans idempotence, un pipeline qui échoue à mi-chemin et qu'on relance duplique silencieusement des données.",
          },
          {
            type: "thinking_prompt",
            text: "Que se passe-t-il si ce pipeline s'arrête au milieu de son exécution ? Est-ce que je peux le relancer sans tout casser ? Si la réponse n'est pas un « oui » immédiat, le pipeline n'est pas encore prêt pour la production.",
          },
          { type: "h3", text: "CDC (Change Data Capture) via MERGE / ON CONFLICT en SQL pur" },
          {
            type: "sql_code",
            text: "-- Chaque exécution ne fait qu'insérer les nouvelles lignes ou mettre à jour les existantes — jamais dupliquer\ninsert into fact_transactions (transaction_id, customer_id, merchant_id, country_code, transaction_at, amount_local, currency_code, channel, status)\nselect b.transaction_id::int, b.customer_id::int, b.merchant_id::int, b.country_code,\n       b.transaction_at_raw::timestamptz, b.amount_local::numeric, b.currency_code, b.channel, b.status\nfrom raw_transactions_bronze b\nwhere b.customer_id is not null\non conflict (transaction_id) do update\n  set status = excluded.status;",
          },
          { type: "h3", text: "Data Quality : NULL, doublons, dates invalides, intégrité référentielle" },
          {
            type: "sql_code",
            text: "-- 1. Combien de lignes ont un customer_id ou un amount_local manquant ?\nselect count(*) filter (where customer_id is null) as customer_manquant,\n       count(*) filter (where amount_local is null) as montant_manquant\nfrom raw_transactions_bronze;\n\n-- 2. Doublons exacts dans l'extraction brute\nselect transaction_id, count(*) from raw_transactions_bronze group by transaction_id having count(*) > 1;\n\n-- 3. Formats de date incohérents (certains 'YYYY-MM-DD', d'autres 'DD/MM/YYYY', d'autres ISO complet)\nselect distinct transaction_at_raw from raw_transactions_bronze\nwhere transaction_at_raw !~ '^\\d{4}-\\d{2}-\\d{2}' limit 10;\n\n-- 4. Intégrité référentielle : merchant_id de la source qui n'existe pas dans dim_merchant\nselect distinct b.merchant_id\nfrom raw_transactions_bronze b\nleft join dim_merchant m on m.merchant_id = b.merchant_id::int\nwhere m.merchant_id is null;",
          },
          {
            type: "callout",
            title: "Ces quatre problèmes existent réellement dans nos données",
            text: "raw_transactions_bronze n'est pas un exemple inventé pour l'occasion : elle contient de vrais NULL, de vrais doublons, trois formats de date différents, et quelques merchant_id orphelins — exactement ce qu'une extraction quotidienne mal maîtrisée produit dans une vraie entreprise.",
          },
          { type: "h3", text: "Date dimension complète" },
          {
            type: "p",
            text: "dim_date existe déjà, avec year/quarter/month/week/is_weekend pour chaque jour sur 2 ans — la brique qui évite de recalculer ces attributs dans chaque requête analytique.",
          },
          {
            type: "sql_sandbox",
            prompt:
              "Livrable — construis la couche Silver : nettoie raw_transactions_bronze (retire les NULL sur customer_id, corrige les montants à virgule, garde uniquement les merchant_id valides), et compare le nombre de lignes conservées à l'original.",
            starterQuery:
              "select count(*) as lignes_brutes,\n  count(*) filter (\n    where customer_id is not null\n    and amount_local is not null\n    and merchant_id::int in (select merchant_id from dim_merchant)\n  ) as lignes_propres\nfrom raw_transactions_bronze;",
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
          question: "ON CONFLICT DO UPDATE, dans un chargement CDC, sert à :",
          options: [
            "Empêcher toute mise à jour",
            "Insérer les nouvelles lignes et mettre à jour les existantes en une seule requête, sans dupliquer",
            "Supprimer les lignes en conflit",
          ],
          correct_index: 1,
          explain: "C'est le mécanisme SQL qui rend un chargement incrémental idempotent.",
        },
      ],
    },

    // ============================================================
    // 2.8 — PERFORMANCE & TUNING
    // ============================================================
    {
      number: "2.8",
      slug: "performance-et-tuning",
      title: "Performance & tuning",
      duration_minutes: 180,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une requête correcte qui met douze secondes au lieu de douze millisecondes n'est pas juste lente — à l'échelle d'un pipeline de production qui l'exécute des milliers de fois par jour, c'est une facture cloud qui explose.",
          },
          { type: "h3", text: "Index : B-tree, composite, partiel" },
          {
            type: "sql_code",
            text: "-- Index simple — accélère les recherches par country_code\ncreate index idx_transactions_country on fact_transactions(country_code);\n\n-- Index composite — utile si les requêtes filtrent country_code ET channel ensemble\ncreate index idx_transactions_country_channel on fact_transactions(country_code, channel);\n\n-- Index partiel — ne couvre que les transactions échouées, minuscule et ciblé\ncreate index idx_transactions_failed on fact_transactions(transaction_id) where status = 'failed';",
          },
          {
            type: "callout",
            title: "Quand NE PAS indexer",
            text: "Chaque index accélère les lectures mais ralentit chaque écriture (l'index doit être mis à jour) et consomme de l'espace disque. Indexer une colonne rarement filtrée, ou une table qui reçoit énormément d'écritures et peu de lectures, coûte souvent plus qu'il ne rapporte.",
          },
          { type: "h3", text: "Lire un plan d'exécution : EXPLAIN ANALYZE" },
          {
            type: "sql_code",
            text: "explain analyze\nselect * from fact_transactions where country_code = 'CI' and channel = 'mobile_money';",
          },
          {
            type: "list",
            items: [
              "Seq Scan — le moteur lit toute la table ligne par ligne (normal sur une petite table, coûteux sur des millions de lignes)",
              "Index Scan — le moteur utilise un index pour sauter directement aux lignes pertinentes",
              "Hash Join — construit une table de hachage en mémoire pour l'un des deux côtés, efficace quand un côté est petit",
              "Nested Loop — compare chaque ligne d'un côté à chaque ligne de l'autre, efficace seulement sur de petits volumes",
            ],
          },
          { type: "h3", text: "Partitionnement" },
          {
            type: "sql_code",
            text: "-- Partitionnement par plage de dates — chaque requête filtrée par date ne scanne qu'une partition\ncreate table fact_transactions_partitioned (like fact_transactions)\n  partition by range (transaction_at);\n\ncreate table fact_transactions_2024 partition of fact_transactions_partitioned\n  for values from ('2024-01-01') to ('2025-01-01');",
          },
          {
            type: "p",
            text: "Le partition pruning permet au moteur d'ignorer entièrement les partitions hors du filtre de date — une requête sur \"le mois dernier\" n'a jamais besoin de toucher les partitions des années précédentes.",
          },
          { type: "h3", text: "Anti-patterns courants" },
          {
            type: "list",
            items: [
              "SELECT * en production — récupère des colonnes inutiles, empêche certaines optimisations d'index-only scan",
              "Cast implicite dans un WHERE (ex. comparer un texte à un entier) — peut empêcher l'utilisation d'un index existant",
              "Pagination par OFFSET à grande échelle — OFFSET 100000 oblige le moteur à lire puis jeter 100 000 lignes ; la pagination par clé (keyset, \"WHERE id > dernier_id_vu\") reste rapide quelle que soit la page",
            ],
          },
          {
            type: "sql_sandbox",
            prompt:
              "Atelier — compare le plan d'exécution avant et après avoir créé un index sur country_code. Exécute d'abord EXPLAIN ANALYZE, crée l'index, puis relance la même requête.",
            starterQuery:
              "explain analyze\nselect * from fact_transactions where country_code = 'SN';",
          },
          {
            type: "thinking_prompt",
            text: "Cette requête met 12 secondes. Le goulot est-il l'absence d'index, une jointure mal ordonnée, ou simplement le volume de données ? EXPLAIN ANALYZE ne donne pas juste un chiffre — il donne la réponse, étape par étape.",
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
          question: "Pourquoi la pagination par OFFSET devient-elle problématique à grande échelle ?",
          options: [
            "Elle n'est pas supportée par PostgreSQL",
            "Le moteur doit lire puis jeter toutes les lignes avant l'offset demandé",
            "Elle ne fonctionne qu'avec ORDER BY"
          ],
          correct_index: 1,
          explain: "La pagination par clé (keyset) évite ce coût en filtrant directement à partir du dernier identifiant vu.",
        },
      ],
    },

    // ============================================================
    // 2.9 — DBT & ORCHESTRATION
    // ============================================================
    {
      number: "2.9",
      slug: "dbt-et-orchestration",
      title: "Analytics Engineering : dbt & orchestration",
      duration_minutes: 180,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Écrire du SQL qui fonctionne est une chose. Le rendre versionné, testé et documenté — pour qu'une équipe entière puisse s'y fier — en est une autre. C'est le rôle de dbt.",
          },
          { type: "h3", text: "Pourquoi dbt" },
          {
            type: "p",
            text: "dbt transforme des fichiers .sql en modèles gérés comme du code : versionnés dans Git, testables automatiquement, documentés, avec un graphe de dépendances explicite entre eux.",
          },
          { type: "h3", text: "Structure de projet et références" },
          {
            type: "code",
            text: "models/\n  staging/\n    stg_transactions.sql      -- nettoyage minimal depuis la source\n  intermediate/\n    int_transactions_usd.sql -- as-of join vers fx_rates\n  marts/\n    fct_transactions.sql     -- la fact table finale, prête pour le BI",
          },
          {
            type: "sql_code",
            text: "-- models/marts/fct_transactions.sql\nselect *\nfrom {{ ref('int_transactions_usd') }}\nwhere status = 'completed'",
            caption: "ref() résout automatiquement la dépendance et l'ordre d'exécution — jamais de nom de table en dur.",
          },
          { type: "h3", text: "Tests dbt" },
          {
            type: "code",
            text: "# models/marts/schema.yml\nmodels:\n  - name: fct_transactions\n    columns:\n      - name: transaction_id\n        tests: [unique, not_null]\n      - name: customer_id\n        tests:\n          - relationships:\n              to: ref('dim_customer')\n              field: customer_id",
            caption: "unique/not_null/relationships couvrent exactement les problèmes de qualité vus en leçon 2.7 — mais automatisés, à chaque exécution.",
          },
          { type: "h3", text: "Modèles incrémentaux dbt" },
          {
            type: "sql_code",
            text: "-- {{ config(materialized='incremental', unique_key='transaction_id') }}\nselect * from {{ source('raw', 'transactions_bronze') }}\n{% if is_incremental() %}\nwhere transaction_at_raw > (select max(transaction_at) from {{ this }})\n{% endif %}",
            caption: "is_incremental() ne retraite que les nouvelles lignes lors des exécutions suivantes — le même principe que le watermarking de la leçon 2.7, mais géré par dbt.",
          },
          { type: "h3", text: "Orchestration : le concept" },
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
            type: "thinking_prompt",
            text: "Si ce pipeline tourne chaque nuit sans surveillance humaine, qu'est-ce qui doit être automatisé — et qu'est-ce qui doit alerter quelqu'un ? Un test dbt qui échoue silencieusement est pire qu'un pipeline qui plante bruyamment : le second se voit, le premier corrompt la confiance dans les données sans que personne ne le sache.",
          },
          {
            type: "callout",
            title: "Ce que ce module ne couvre pas — et pourquoi",
            text: "Airflow, le vrai outil d'orchestration de production, est tout le Module 05. Ici, tu comprends le CONCEPT (dépendances, scheduling, retry, alerte) pour ne pas arriver au Module 05 les mains vides — pas pour construire un Airflow complet en double.",
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
          question: "Le test dbt `relationships` vérifie :",
          options: [
            "Qu'une colonne n'a jamais de valeurs dupliquées",
            "Qu'une clé étrangère correspond bien à une ligne existante dans la table référencée",
            "Que la table est vide",
          ],
          correct_index: 1,
          explain: "C'est un test d'intégrité référentielle automatisé — équivalent à la requête manuelle de la leçon 2.7.",
        },
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
      ],
    },

    // ============================================================
    // 2.10 — CAPSTONE
    // ============================================================
    {
      number: "2.10",
      slug: "capstone-afripay-data-platform",
      title: "Capstone — AfriPay Data Platform",
      duration_minutes: 180,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Ce module ne s'est jamais dispersé en exercices déconnectés : depuis la leçon 2.6, tu construis progressivement une seule et même plateforme de données. Ce dernier module est la consolidation et la restitution — pas un nouveau départ.",
          },
          { type: "h3", text: "Revue du pipeline complet" },
          {
            type: "checklist",
            title: "Avant de restituer, vérifie que tu peux répondre oui à chaque point",
            items: [
              "Mon schéma Gold (star schema) a un grain clair et documenté pour chaque table",
              "Mon chargement Bronze → Silver → Gold est idempotent : je peux le relancer sans dupliquer",
              "Mes tests de qualité (NULL, doublons, intégrité référentielle) passent sur la couche Silver",
              "Je sais expliquer pourquoi j'ai choisi un star schema plutôt qu'un OBT pour ce cas précis",
              "Au moins une requête analytique dans mon projet utilise une window function ou un as-of join",
            ],
          },
          { type: "h3", text: "Data Mart final : les métriques business" },
          {
            type: "sql_code",
            text: "-- Le tableau de bord final : revenu par pays, en USD, avec le taux du bon jour\nwith conversion as (\n  select t.*, fx.rate_to_usd,\n    round(t.amount_local / fx.rate_to_usd, 2) as amount_usd\n  from fact_transactions t\n  join lateral (\n    select rate_to_usd from fx_rates\n    where fx_rates.currency_code = t.currency_code and fx_rates.rate_date <= t.transaction_at::date\n    order by rate_date desc limit 1\n  ) fx on true\n  where t.status = 'completed'\n)\nselect co.country_name,\n  count(*) as nb_transactions,\n  round(sum(amount_usd), 2) as revenu_usd,\n  round(avg(amount_usd), 2) as panier_moyen_usd\nfrom conversion c\njoin dim_country co on co.country_code = c.country_code\ngroup by co.country_name\norder by revenu_usd desc;",
          },
          { type: "h3", text: "Documentation et structure du dépôt" },
          {
            type: "code",
            text: "afripay-data-platform/\n├── README.md\n├── sql/\n│   ├── ddl/              -- création des tables\n│   ├── modeling/         -- MCD, MLD, star schema\n│   └── optimization/     -- index, requêtes EXPLAIN avant/après\n├── warehouse/\n│   ├── bronze/\n│   ├── silver/\n│   └── gold/\n├── dbt/\n│   ├── models/\n│   └── tests/\n└── documentation/\n    └── architecture.png",
          },
          {
            type: "p",
            text: "Un recruteur qui ouvre ce dépôt doit comprendre en cinq minutes ce que fait le projet, pourquoi ces choix de modélisation, et voir que le pipeline a été pensé pour la production — pas juste pour \"marcher une fois\".",
          },
          { type: "h3", text: "Restitution" },
          {
            type: "p",
            text: "Présente ton projet comme en entretien technique : le problème métier, le modèle choisi et pourquoi, une requête qui t'a posé un vrai défi, et ce que tu ferais différemment avec plus de temps. C'est cette dernière question qui distingue un candidat qui a suivi un tutoriel d'un candidat qui a vraiment compris.",
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
          question: "Dans le data mart final, pourquoi utilise-t-on un as-of join sur fx_rates avant d'agréger le revenu ?",
          options: [
            "Ce n'est pas nécessaire",
            "Pour convertir chaque transaction au taux de change en vigueur à SA date, pas au taux du jour",
            "Pour trier les résultats"
          ],
          correct_index: 1,
          explain: "Sans as-of join, tout l'historique de revenu serait faussé par le taux de change actuel appliqué rétroactivement.",
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
