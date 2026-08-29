/**
 * Seed le Module 01 (contenu réel — 10 leçons) dans Supabase. Idempotent :
 * peut être relancé sans dupliquer les lignes (upsert sur colonnes uniques).
 *
 * Usage : npm run seed:module1   (nécessite .env.local rempli)
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
  console.log("→ Module 01…");
  const { data: mod, error: modErr } = await supabase
    .from("modules")
    .upsert(
      {
        number: 1,
        slug: "le-metier-de-data-engineer",
        title: "Le métier de Data Engineer",
        hours_min: 16,
        hours_max: 20,
        is_free: true,
        status: "published",
        sort_order: 1,
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (modErr || !mod) throw modErr ?? new Error("Module 01 introuvable après upsert");

  const lessons = [
    // ============================================================
    // 1.1 — LE CONTEXTE
    // ============================================================
    {
      number: "1.1",
      slug: "bienvenue-dans-la-data-engineering",
      title: "Bienvenue dans la Data Engineering : le contexte",
      duration_minutes: 90,
      sort_order: 1,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Deux entreprises vendent le même produit. La première regarde ses ventes une fois par mois, dans un tableau Excel reconstitué à la main par quelqu'un qui copie-colle depuis trois outils différents. La seconde sait, en temps réel, quel produit se vend mal dans quelle région, pourquoi, et déclenche automatiquement une alerte à l'équipe concernée. Dans cinq ans, une seule des deux existe encore sous sa forme actuelle. Ce n'est pas une question de chance : c'est une question de plomberie — celle qui fait circuler la donnée du terrain jusqu'à la décision.",
          },
          {
            type: "p",
            text: "C'est ce que construit un Data Engineer : la plomberie. Pas les tableaux de bord qu'on regarde, pas les modèles d'intelligence artificielle qu'on admire — le système invisible qui fait que ces tableaux de bord et ces modèles reçoivent une donnée fiable, à temps, au bon endroit. Ce module pose les fondations : le contexte, le métier, les six rôles qu'on confond en permanence, des cas concrets, les outils, les compétences, le marché, et une réponse honnête à la question que tout le monde se pose en 2026 — est-ce que ça vaut encore le coup d'apprendre ça, à l'ère de l'IA ?",
          },
          { type: "h3", text: "L'explosion, en chiffres" },
          {
            type: "p",
            text: "La quantité de données créées dans le monde ne suit pas une croissance linéaire : elle a été multipliée par plus de trois entre 2020 et 2026.",
          },
          {
            type: "chart_line",
            title: "Volume mondial de données créées, 2020–2026",
            subtitle: "En zettaoctets (1 zettaoctet = 1 000 milliards de gigaoctets)",
            points: [
              { label: "2020", value: 64 },
              { label: "2021", value: 79 },
              { label: "2022", value: 97 },
              { label: "2023", value: 120 },
              { label: "2024", value: 149 },
              { label: "2025", value: 181 },
              { label: "2026", value: 221 },
            ],
            sourceNote:
              "Estimations sectorielles (ordre de grandeur IDC/Statista) — la valeur 2026 est une projection.",
          },
          {
            type: "p",
            text: "Trois moteurs expliquent cette courbe : la démocratisation des objets connectés et de la 5G, la migration massive vers le cloud, et depuis 2023, l'appétit quasi illimité de l'IA générative pour les données d'entraînement et de récupération (RAG). Chacun de ces trois moteurs, à lui seul, justifierait l'existence du métier ; les trois combinés en font l'un des métiers techniques les plus demandés de la décennie.",
          },
          {
            type: "stat_grid",
            stats: [
              { value: "221 Zo", label: "de données créées en 2026" },
              { value: "×3,4", label: "croissance du volume depuis 2020" },
              { value: "$213 Md", label: "marché mondial de la data engineering d'ici 2031" },
              { value: "36%", label: "croissance des métiers de la donnée, 2023–2033 (USA)" },
            ],
          },
          {
            type: "callout",
            title: "Ce que ce module NE couvre pas encore",
            text: "Tu ne vas pas apprendre à écrire un pipeline ici — c'est tout l'objet des modules 2 à 12. Ce module répond à une question plus fondamentale : sais-tu vraiment ce que tu es sur le point d'apprendre, et pourquoi ça compte ?",
          },
          {
            type: "diagnostic",
            title: "Avant de continuer — pourquoi es-tu là ?",
            items: [
              "Je veux comprendre un métier avant de m'investir dedans, pas juste enchaîner des tutoriels.",
              "L'idée qu'un système tourne \"sous le capot\" sans que personne ne le voie ne me dérange pas.",
              "Je suis curieux·se de savoir comment une entreprise transforme des données brutes en décisions.",
              "Je veux une réponse honnête sur l'IA avant d'investir des mois dans ce parcours.",
            ],
          },
        ],
      },
      quiz: [
        {
          question: "En 2026, le volume de données créées dans le monde est estimé à environ :",
          options: ["20 zettaoctets", "221 zettaoctets", "2 zettaoctets"],
          correct_index: 1,
          explain: "Contre environ 64 zettaoctets en 2020 — une croissance sectorielle d'environ 40% par an.",
        },
        {
          question: "Quel trio n'est PAS un moteur majeur de l'explosion des données depuis 2020 ?",
          options: ["IoT, 5G et cloud", "IA générative", "Fax et Minitel"],
          correct_index: 2,
          explain: "IoT, 5G, cloud et IA sont les moteurs réels ; le fax et le Minitel n'y sont pour rien.",
        },
        {
          question: "Le marché mondial de la data engineering est projeté à combien d'ici 2031 ?",
          options: ["$2 milliards", "$213 milliards", "$2 000 milliards"],
          correct_index: 1,
          explain: "Depuis $105 milliards en 2026, à un taux de croissance annuel d'environ 15%.",
        },
      ],
    },

    // ============================================================
    // 1.2 — DÉFINITION & ANATOMIE
    // ============================================================
    {
      number: "1.2",
      slug: "quest-ce-que-la-data-engineering",
      title: "Qu'est-ce que la Data Engineering, vraiment ?",
      duration_minutes: 120,
      sort_order: 2,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Une définition simple, à retenir : la Data Engineering est la discipline qui consiste à concevoir, construire et maintenir les systèmes qui déplacent, stockent et transforment la donnée pour la rendre exploitable — de façon fiable, répétable et à l'échelle. Le mot clé n'est pas \"donnée\", c'est \"système\". Un Data Analyst répond à une question avec de la donnée ; un Data Engineer construit l'infrastructure qui garantit que la donnée est là, correcte et à jour quand la question se pose.",
          },
          { type: "h3", text: "L'anatomie d'un système de données moderne" },
          {
            type: "p",
            text: "Peu importe la taille de l'entreprise, une donnée utile traverse toujours les cinq mêmes étapes. Retiens ce schéma : il te servira de carte pour tout le reste du parcours DataLendo.",
          },
          { type: "pipeline" },
          {
            type: "callout",
            title: "Où se situe la suite du parcours",
            text: "Sources — APIs, bases de production, fichiers (Module 4). Ingestion — pipelines batch/streaming (Modules 4, 5, 8). Stockage — data warehouse, data lake, lakehouse (Modules 2, 7). Transformation — SQL, Spark, dbt (Modules 2, 5, 6). Consommation — tableaux de bord, mais aussi modèles IA et applications RAG (Modules 9, 11).",
          },
          { type: "h3", text: "Batch vs streaming : deux vitesses, un même objectif" },
          {
            type: "list",
            items: [
              "Batch : la donnée est traitée par lots, à intervalles (toutes les heures, chaque nuit). Simple, robuste, suffisant pour un reporting quotidien.",
              "Streaming : la donnée est traitée événement par événement, en continu, en quelques secondes ou millisecondes. Nécessaire pour la détection de fraude, le pricing dynamique, les recommandations en temps réel.",
              "La majorité des systèmes en 2026 combinent les deux : batch pour l'historique et les gros volumes, streaming pour ce qui doit réagir immédiatement.",
            ],
          },
          { type: "h3", text: "Pourquoi \"fiable et répétable\" est la vraie difficulté" },
          {
            type: "p",
            text: "Écrire un script qui déplace des données une fois est facile. Le vrai métier commence quand ce script doit tourner tous les jours, pendant des années, sans supervision — survivre à une API qui change de format sans prévenir, à un pic de trafic le Black Friday, à un fichier corrompu, à un collègue qui modifie un schéma de base de données sans en informer personne. La Data Engineering, c'est l'ingénierie de la fiabilité appliquée à la donnée.",
          },
          {
            type: "exercise_choice",
            title: "Exercice — repère l'étape cassée",
            scenario:
              "Un site e-commerce voit ses ventes compilées une fois par semaine, à la main, par un employé qui copie-colle les chiffres depuis trois outils différents dans un fichier Excel. Quelle étape du pipeline est absente ou défaillante ?",
            options: [
              { label: "Sources", correct: false },
              { label: "Ingestion", correct: true },
              { label: "Consommation", correct: false },
            ],
            feedback:
              "L'ingestion est absente : personne n'automatise le déplacement des données depuis les trois outils sources vers un même endroit. Sans ça, la transformation et la consommation restent manuelles pour toujours.",
          },
        ],
      },
      quiz: [
        {
          question: "Une donnée est copiée telle quelle depuis une API vers un data lake, sans transformation. À quelle étape est-elle ?",
          options: ["Ingestion", "Transformation", "Consommation"],
          correct_index: 0,
          explain: "L'ingestion, c'est le déplacement de la donnée vers le système — avant toute transformation.",
        },
        {
          question: "Quelle situation justifie le plus clairement un traitement en streaming plutôt qu'en batch ?",
          options: [
            "Générer un rapport de ventes mensuel",
            "Détecter une fraude par carte bancaire en quelques secondes",
            "Archiver les logs serveur de l'année dernière",
          ],
          correct_index: 1,
          explain: "La détection de fraude doit réagir avant que la transaction ne soit validée — le batch serait trop lent.",
        },
        {
          question: "Selon cette leçon, la vraie difficulté du métier de Data Engineer est de rendre un système :",
          options: ["Joli à regarder", "Fiable et répétable dans la durée", "Écrit dans le langage le plus récent"],
          correct_index: 1,
          explain: "N'importe qui peut déplacer des données une fois ; le métier commence quand ça doit tourner sans supervision, pendant des années.",
        },
      ],
    },

    // ============================================================
    // 1.3 — LES SIX MÉTIERS DE LA DONNÉE
    // ============================================================
    {
      number: "1.3",
      slug: "six-metiers-de-la-donnee",
      title: "Six métiers de la donnée, une seule confusion",
      duration_minutes: 150,
      sort_order: 3,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "« Data Engineer », « Data Analyst », « Data Scientist », « ML Engineer », « AI Engineer », « Analytics Engineer » : en francophonie, ces six intitulés se retrouvent parfois sur la même fiche de poste, comme s'ils étaient interchangeables. Ils ne le sont pas — et savoir les distinguer est la compétence la plus rentable de ce module, celle qui t'évitera de candidater au mauvais poste ou de mal négocier ton salaire.",
          },
          {
            type: "role_cards",
            roles: [
              {
                name: "Data Engineer",
                color: "accent",
                mission: "Construit et fiabilise les pipelines qui déplacent et transforment la donnée à grande échelle.",
                tools: "SQL · Python · Airflow · Spark · Kafka · Cloud",
                deliverable: "Livrable : un pipeline en production, robuste et documenté.",
                salaryHint: "France : 45–75k€/an · TJM freelance 500–750€/j",
              },
              {
                name: "Analytics Engineer",
                color: "cyan",
                mission: "Transforme la donnée brute déjà stockée en modèles propres, testés et réutilisables.",
                tools: "dbt · SQL avancé · Entrepôt de données",
                deliverable: "Livrable : des modèles de données prêts pour la BI.",
                salaryHint: "Le rôle le plus récent — formalisé par dbt Labs vers 2020.",
              },
              {
                name: "Data Analyst",
                color: "amber",
                mission: "Explore la donnée déjà modélisée pour répondre à des questions métier précises.",
                tools: "SQL · Excel · Power BI · Looker · Tableau",
                deliverable: "Livrable : un tableau de bord ou une analyse ponctuelle.",
                salaryHint: "France : ~35–45k€/an — le point d'entrée le plus commun dans la data.",
              },
              {
                name: "Data Scientist",
                color: "success",
                mission: "Construit des modèles prédictifs ou statistiques à partir de la donnée disponible.",
                tools: "Python · scikit-learn · Notebooks · Statistiques",
                deliverable: "Livrable : un modèle entraîné, évalué et documenté.",
                salaryHint: "France : ~45–65k€/an, selon spécialisation.",
              },
              {
                name: "ML Engineer",
                color: "accent",
                mission: "Prend le modèle du Data Scientist et le fait tourner en production de façon fiable : déploiement, ré-entraînement, monitoring.",
                tools: "MLOps · Docker/Kubernetes · Feature stores",
                deliverable: "Livrable : un modèle servi en production, surveillé et ré-entraîné automatiquement.",
                salaryHint: "Dérive vers l'infra — proche cousin du Data Engineer.",
              },
              {
                name: "AI Engineer",
                color: "cyan",
                mission: "Construit des applications au-dessus de modèles de fondation existants (LLM) : chatbots, agents, outils de recherche augmentée.",
                tools: "LangChain · Bases vectorielles · APIs LLM",
                deliverable: "Livrable : un produit ou une fonctionnalité IA orientée utilisateur.",
                salaryHint: "Le métier tech à la croissance la plus rapide aux USA (LinkedIn, 2026).",
              },
            ],
          },
          {
            type: "callout",
            title: "La ligne de démarcation la plus utile",
            text: "Le Data Engineer et l'Analytics Engineer construisent la fondation (le pipeline, les modèles de données). Le Data Analyst et le Data Scientist consomment cette fondation pour produire des insights ou des modèles. Le ML Engineer et l'AI Engineer mettent des modèles (classiques ou LLM) en production. Retiens surtout ceci : un ML Engineer \"dérive\" vers l'infrastructure et la donnée — proche du Data Engineer — tandis qu'un AI Engineer \"dérive\" vers le produit et l'expérience utilisateur.",
          },
          { type: "h3", text: "Une journée type de Data Engineer" },
          {
            type: "timeline",
            steps: [
              { time: "09h00", activity: "Un pipeline Airflow a échoué cette nuit sur une jointure trop lente — diagnostic et correctif avant le stand-up." },
              { time: "10h30", activity: "Revue de code sur la pull request d'un collègue : vérification des tests de qualité de données." },
              { time: "14h00", activity: "Réunion avec l'équipe Data Science, qui a besoin d'une table de features actualisée quotidiennement." },
              { time: "16h00", activity: "Écriture des tests de qualité de données avant mise en production d'un nouveau pipeline." },
            ],
          },
          {
            type: "job_match_exercise",
            title: "Exercice — lis l'offre, trouve le métier",
            items: [
              {
                text: "Offre A — « Construire et maintenir nos pipelines Airflow, optimiser nos jobs Spark et garantir la fiabilité de notre entrepôt de données sur Snowflake. »",
                options: ["Data Engineer", "Analytics Engineer", "Data Analyst", "AI Engineer"],
                correctIndex: 0,
              },
              {
                text: "Offre B — « Maîtriser dbt et le SQL avancé pour transformer nos données brutes en modèles fiables, consommés par nos tableaux de bord. »",
                options: ["Data Engineer", "Analytics Engineer", "Data Scientist", "ML Engineer"],
                correctIndex: 1,
              },
              {
                text: "Offre C — « Déployer et surveiller nos modèles de machine learning en production, gérer le ré-entraînement automatique et le monitoring de dérive. »",
                options: ["Data Analyst", "AI Engineer", "ML Engineer", "Analytics Engineer"],
                correctIndex: 2,
              },
              {
                text: "Offre D — « Construire des agents et des chatbots IA sur nos documents internes avec LangChain et une base vectorielle. »",
                options: ["Data Scientist", "AI Engineer", "Data Engineer", "Data Analyst"],
                correctIndex: 1,
              },
            ],
          },
        ],
      },
      quiz: [
        {
          question: "Qui construit et maintient typiquement un pipeline Airflow en production ?",
          options: ["Le Data Analyst", "Le Data Engineer", "Le Data Scientist"],
          correct_index: 1,
          explain: "C'est le cœur du métier de Data Engineer.",
        },
        {
          question: "L'Analytics Engineer est surtout associé à quel outil ?",
          options: ["dbt", "Kafka", "TensorFlow"],
          correct_index: 0,
          explain: "Le rôle a été formalisé par dbt Labs autour de 2020.",
        },
        {
          question: "Quelle affirmation décrit le mieux la différence entre ML Engineer et AI Engineer ?",
          options: [
            "Ce sont exactement le même métier",
            "Le ML Engineer dérive vers l'infra/données, l'AI Engineer vers le produit/application",
            "L'AI Engineer ne fait que de la data visualisation",
          ],
          correct_index: 1,
          explain: "Le ML Engineer est le cousin proche du Data Engineer ; l'AI Engineer construit des produits au-dessus des LLM.",
        },
        {
          question: "Selon LinkedIn (2026), quel est le métier tech à la croissance la plus rapide aux États-Unis ?",
          options: ["Data Analyst", "AI Engineer", "Webmaster"],
          correct_index: 1,
          explain: "Porté par l'explosion des applications construites au-dessus des LLM.",
        },
      ],
    },

    // ============================================================
    // 1.4 — CAS PRATIQUES
    // ============================================================
    {
      number: "1.4",
      slug: "cas-pratiques-et-concrets",
      title: "Cas pratiques et concrets : la Data Engineering en action",
      duration_minutes: 120,
      sort_order: 4,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "La théorie prend tout son sens face à des cas réels. Voici trois situations, de la plus connue à la plus proche de ce que tu vivras probablement en premier poste.",
          },
          {
            type: "case_study",
            company: "Netflix",
            challenge:
              "Recommander le bon contenu à plus de 300 millions d'abonnés, en exploitant des milliards d'événements de visionnage par jour (play, pause, abandon, recherche) sans ralentir l'application.",
            solution:
              "Une architecture de pipelines qui ingère les événements en streaming, les agrège par lots pour l'entraînement des modèles de recommandation, et sert les résultats via des systèmes optimisés pour répondre en millisecondes.",
            outcome:
              "Le pipeline de données, pas l'algorithme seul, est ce qui permet à Netflix de personnaliser l'expérience de chaque compte en temps quasi réel.",
          },
          {
            type: "case_study",
            company: "Uber",
            challenge:
              "Calculer un prix dynamique et un temps d'arrivée fiable, en continu, à partir de la position GPS de millions de chauffeurs et passagers simultanément.",
            solution:
              "Un pipeline de streaming (proche de Kafka) qui traite les positions en temps réel, croisées avec l'historique de trafic, pour recalculer prix et ETA en quelques secondes.",
            outcome:
              "Sans pipeline temps réel fiable, le prix dynamique serait soit trop lent pour refléter la demande, soit trop instable pour être fiable.",
          },
          {
            type: "case_study",
            company: "Cas type — fintech mobile money en Afrique francophone",
            challenge:
              "Une fintech propose des transferts d'argent mobile money. Chaque transaction doit être vérifiée pour de la fraude en quelques secondes, tout en produisant chaque nuit des rapports de conformité pour le régulateur.",
            solution:
              "Un pipeline hybride : streaming pour scorer chaque transaction en temps réel (fraude), batch nocturne pour agréger les volumes et produire les rapports réglementaires, le tout stocké dans un entrepôt de données interrogeable par l'équipe conformité.",
            outcome:
              "C'est exactement le type d'architecture — batch + streaming + conformité — que tu construiras en miniature dans le projet fil rouge des Modules 4 et 5.",
          },
          { type: "h3", text: "Le point commun des trois cas" },
          {
            type: "list",
            items: [
              "Aucun des trois ne repose sur un algorithme d'IA \"magique\" — chacun repose d'abord sur un pipeline de données fiable et rapide.",
              "Les trois combinent du batch (historique, gros volumes) et du streaming (réaction immédiate).",
              "Dans les trois cas, un Data Engineer est responsable de la partie la moins visible mais la plus critique : que la bonne donnée arrive au bon endroit, à temps.",
            ],
          },
        ],
      },
      quiz: [
        {
          question: "Dans le cas Netflix, qu'est-ce qui permet réellement la personnalisation en temps quasi réel ?",
          options: ["L'algorithme seul, sans données", "Le pipeline de données qui ingère et sert les événements", "Le hasard"],
          correct_index: 1,
          explain: "L'algorithme a besoin d'un pipeline fiable pour recevoir et servir la donnée à temps.",
        },
        {
          question: "Pourquoi Uber a-t-il besoin d'un pipeline en streaming plutôt qu'en batch pour son pricing ?",
          options: [
            "Parce que le batch est interdit chez Uber",
            "Parce que le prix doit refléter la demande en quelques secondes",
            "Parce que le streaming coûte moins cher",
          ],
          correct_index: 1,
          explain: "Un calcul par lot serait trop lent pour un prix dynamique en temps réel.",
        },
        {
          question: "Le cas type \"fintech mobile money\" combine :",
          options: ["Uniquement du batch", "Uniquement du streaming", "Du batch ET du streaming"],
          correct_index: 2,
          explain: "Streaming pour la fraude en temps réel, batch nocturne pour les rapports de conformité.",
        },
      ],
    },

    // ============================================================
    // 1.5 — LES OUTILS
    // ============================================================
    {
      number: "1.5",
      slug: "les-outils-du-data-engineer",
      title: "Les outils du Data Engineer : la carte complète",
      duration_minutes: 120,
      sort_order: 5,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Avant de plonger dans chaque outil (à partir du Module 2), prends une vue d'ensemble. Ce panorama est la carte ; les modules suivants sont le territoire. Le stack 2026 se résume ainsi : SQL + Python (fondation) → Spark/PySpark + dbt (traitement et modélisation) → Airflow/Prefect/Dagster (orchestration) → AWS/GCP/Azure (cloud) → Kafka/Flink (streaming).",
          },
          {
            type: "tools_grid",
            categories: [
              {
                category: "Langages fondamentaux",
                tools: [
                  { name: "SQL", note: "présent dans ~60% des entretiens data engineer" },
                  { name: "Python", note: "présent dans ~70% des offres d'emploi" },
                ],
              },
              {
                category: "Stockage & modélisation",
                tools: [
                  { name: "PostgreSQL", note: "base relationnelle de référence" },
                  { name: "Data Warehouse", note: "Snowflake, BigQuery, Redshift" },
                  { name: "Data Lake / Lakehouse", note: "S3 + Delta Lake, Databricks" },
                ],
              },
              {
                category: "Traitement à l'échelle",
                tools: [
                  { name: "Apache Spark", note: "moteur distribué derrière la plupart des pipelines batch" },
                  { name: "dbt", note: "transformation SQL versionnée et testée" },
                ],
              },
              {
                category: "Orchestration",
                tools: [
                  { name: "Apache Airflow", note: "le standard historique de l'industrie" },
                  { name: "Prefect / Dagster", note: "gagnent du terrain — orchestration \"code-first\"" },
                ],
              },
              {
                category: "Streaming temps réel",
                tools: [
                  { name: "Apache Kafka", note: "bus d'événements de référence" },
                  { name: "Apache Flink", note: "traitement de flux à faible latence" },
                ],
              },
              {
                category: "Cloud",
                tools: [
                  { name: "AWS", note: "S3, Glue, Redshift, EMR" },
                  { name: "GCP", note: "BigQuery, Dataflow, Composer" },
                  { name: "Azure", note: "ADLS, Data Factory, Synapse" },
                ],
              },
            ],
          },
          {
            type: "callout",
            title: "Tu n'as pas besoin de tout maîtriser aujourd'hui",
            text: "Personne ne maîtrise ce tableau en entier au premier emploi. Ce parcours te fait traverser chaque catégorie une par une, dans l'ordre : SQL et modélisation (Module 2), Python/Git/Docker (Module 3), ingestion et APIs (Module 4), orchestration (Module 5), Spark (Module 6), lakehouse (Module 7), Kafka (Module 8), cloud (Module 10).",
          },
        ],
      },
      quiz: [
        {
          question: "SQL et Python permettent de réussir environ quelle part des entretiens de data engineer ?",
          options: ["10%", "60%", "100% à eux seuls"],
          correct_index: 1,
          explain: "Ce sont les fondations — indispensables mais pas suffisantes seules.",
        },
        {
          question: "Quel outil est le standard historique de l'orchestration de pipelines ?",
          options: ["Apache Airflow", "Photoshop", "Excel"],
          correct_index: 0,
          explain: "Prefect et Dagster montent, mais Airflow reste très largement utilisé dans l'industrie.",
        },
        {
          question: "Kafka sert principalement à :",
          options: ["Faire du reporting mensuel", "Faire circuler des événements en temps réel", "Stocker des fichiers PDF"],
          correct_index: 1,
          explain: "C'est un bus d'événements — la colonne vertébrale du streaming.",
        },
      ],
    },

    // ============================================================
    // 1.6 — COMPÉTENCES
    // ============================================================
    {
      number: "1.6",
      slug: "competences-a-maitriser",
      title: "Les compétences à maîtriser pour devenir Data Engineer",
      duration_minutes: 90,
      sort_order: 6,
      body_content: {
        blocks: [
          { type: "h3", text: "Compétences techniques, par priorité" },
          {
            type: "list",
            items: [
              "SQL avancé — fenêtres analytiques, optimisation de requêtes, modélisation (Module 2)",
              "Python orienté données — structuration de projet, tests, packaging (Module 3)",
              "Modélisation de données — normalisation, schémas en étoile, Data Vault (Module 2)",
              "Pipelines ETL/ELT — conception idempotente et robuste (Module 5)",
              "Cloud — au moins une plateforme en profondeur (Module 10)",
              "Calcul distribué — comprendre pourquoi et quand Spark est nécessaire (Module 6)",
            ],
          },
          { type: "h3", text: "Compétences non-techniques, tout aussi décisives" },
          {
            type: "list",
            items: [
              "Communiquer avec des non-techniques : expliquer pourquoi un pipeline a mis 3 jours à quelqu'un qui ne code pas.",
              "Débugger méthodiquement : la majorité du travail réel est de comprendre pourquoi quelque chose qui marchait hier ne marche plus aujourd'hui.",
              "Documenter : un pipeline non documenté devient la dette technique de quelqu'un d'autre dans six mois — souvent toi-même.",
              "Prioriser la fiabilité sur la vitesse : un pipeline rapide mais qui casse silencieusement coûte plus cher qu'un pipeline lent mais fiable.",
            ],
          },
          {
            type: "checklist",
            title: "Auto-évaluation avant de continuer",
            items: [
              "Je sais qu'apprendre un langage de requête (SQL) sera ma toute première étape concrète",
              "Je comprends que la modélisation de données est aussi importante que le code",
              "Je suis prêt·e à apprendre à déboguer avant de savoir tout construire parfaitement",
              "Je comprends que la documentation fait partie du travail, pas une option",
            ],
          },
        ],
      },
      quiz: [
        {
          question: "Quelle compétence est LA première étape technique concrète de ce parcours ?",
          options: ["Kubernetes avancé", "SQL", "Deep Learning"],
          correct_index: 1,
          explain: "Le Module 2 démarre justement par le SQL et la modélisation.",
        },
        {
          question: "Pourquoi la documentation fait-elle partie du métier, et pas juste une option ?",
          options: [
            "Parce qu'un pipeline non documenté devient la dette technique de quelqu'un — souvent toi-même",
            "Parce que c'est joli à montrer en entretien",
            "Ce n'est pas vraiment utile",
          ],
          correct_index: 0,
          explain: "Un système qui tourne des années doit pouvoir être repris par quelqu'un d'autre — ou par toi, six mois plus tard.",
        },
      ],
    },

    // ============================================================
    // 1.7 — MARCHÉ DU TRAVAIL
    // ============================================================
    {
      number: "1.7",
      slug: "marche-du-travail-et-opportunites",
      title: "Le marché du travail : opportunités et salaires",
      duration_minutes: 90,
      sort_order: 7,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "La data engineering emploie aujourd'hui plus de 150 000 professionnels dans le monde, avec plus de 20 000 nouveaux postes créés l'an dernier. Le Bureau of Labor Statistics américain projette une croissance de 36% des postes liés à la donnée entre 2023 et 2033, soit environ 20 800 ouvertures de poste par an.",
          },
          {
            type: "chart_bar",
            title: "Salaire moyen d'un Data Engineer aux États-Unis",
            subtitle: "En milliers de dollars par an",
            points: [
              { label: "2024", value: 113 },
              { label: "2026 (est.)", value: 153 },
            ],
            sourceNote: "365 Data Science / Data Engineer Academy (2026).",
          },
          {
            type: "stat_grid",
            stats: [
              { value: "45–75k€", label: "salaire France (junior à confirmé)" },
              { value: "+23%", label: "croissance des embauches sur 1 an" },
              { value: "8 000+", label: "postes data ouverts en permanence au Maroc (2026)" },
              { value: "$213 Md", label: "marché mondial d'ici 2031" },
            ],
          },
          {
            type: "p",
            text: "Le marché marocain — l'un des plus structurés d'Afrique francophone — est passé de moins de 1 500 postes data ouverts en permanence en 2020 à plus de 8 000 en 2026. C'est un signal fort pour l'ensemble de la région : les entreprises internationales délocalisent une partie de leurs équipes data vers l'Afrique francophone, et les entreprises locales structurent leurs propres équipes.",
          },
          {
            type: "h3", text: "Une nuance honnête sur le marché",
          },
          {
            type: "p",
            text: "L'embauche de data engineers a progressé de 23% sur la dernière année, mais les postes juniors et intermédiaires classiques ont connu le recul le plus marqué. Les entreprises recrutent plus qu'il y a deux ans, mais des profils différents : plus autonomes, capables de concevoir un système, pas seulement d'exécuter une tâche répétitive. C'est exactement ce que ce parcours est conçu pour produire.",
          },
        ],
      },
      quiz: [
        {
          question: "Le Bureau of Labor Statistics américain projette une croissance des métiers de la donnée de :",
          options: ["3% entre 2023 et 2033", "36% entre 2023 et 2033", "360% en un an"],
          correct_index: 1,
          explain: "Soit environ 20 800 ouvertures de poste par an aux États-Unis.",
        },
        {
          question: "Au Maroc, le nombre de postes data ouverts en permanence est passé d'environ 1 500 (2020) à plus de :",
          options: ["2 000", "8 000", "50 000"],
          correct_index: 1,
          explain: "Une croissance à deux chiffres du marché data depuis cinq ans.",
        },
        {
          question: "Quelle nuance honnête faut-il retenir sur la croissance de 23% des embauches ?",
          options: [
            "Elle profite surtout aux postes juniors classiques",
            "Ce sont des profils plus autonomes qui sont recherchés, pas les mêmes qu'avant",
            "Elle ne concerne que les États-Unis",
          ],
          correct_index: 1,
          explain: "Les postes juniors/intermédiaires classiques reculent le plus ; les entreprises cherchent des profils capables de concevoir, pas seulement d'exécuter.",
        },
      ],
    },

    // ============================================================
    // 1.8 — FREELANCING
    // ============================================================
    {
      number: "1.8",
      slug: "freelancing-en-data-engineering",
      title: "Le freelancing en Data Engineering",
      duration_minutes: 90,
      sort_order: 8,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "La data engineering se prête particulièrement bien au freelance : les entreprises ont souvent besoin d'un pipeline précis construit ou réparé, pas d'un employé à temps plein pendant des années. La demande dépasse l'offre, y compris pour des profils qui débutent.",
          },
          {
            type: "table",
            headers: ["Niveau", "TJM France", "Taux horaire international"],
            rows: [
              ["Junior (0–2 ans)", "350–450 €/jour", "~$40/h"],
              ["Confirmé (3–7 ans)", "500–680 €/jour", "$93–160/h"],
              ["Expert (8+ ans)", "680–1 000 €/jour", "$120–200/h"],
            ],
          },
          {
            type: "callout",
            title: "La spécialisation qui paie le plus",
            text: "Au sein de la data, la spécialisation IA/LLM se négocie autour de 800 €/jour en France, contre 540 € pour un Data Analyst généraliste — l'écart le plus large du secteur. C'est un argument de plus pour le Module 11 (Data Engineering pour l'IA).",
          },
          { type: "h3", text: "Par où commencer" },
          {
            type: "list",
            items: [
              "Construire 2–3 projets démontrables avant de chercher des clients (les projets fil rouge de ce parcours sont conçus pour ça).",
              "S'inscrire sur des plateformes spécialisées (Malt, Comet en France ; Upwork, Toptal à l'international).",
              "Commencer par de petites missions courtes pour construire des références vérifiables.",
              "Documenter chaque mission comme un cas d'usage réutilisable dans ton portfolio (Module 12).",
            ],
          },
        ],
      },
      quiz: [
        {
          question: "En France, le TJM médian d'un Data Engineer freelance confirmé se situe autour de :",
          options: ["50–100 €/jour", "500–680 €/jour", "5 000 €/jour"],
          correct_index: 1,
          explain: "Avec une médiane globale du secteur data autour de 640 €/jour.",
        },
        {
          question: "Quelle spécialisation se négocie le plus cher au sein de la data en 2026 ?",
          options: ["IA/LLM", "Reporting Excel", "Saisie de données"],
          correct_index: 0,
          explain: "Autour de 800€/jour contre 540€ pour un profil Data Analyst généraliste.",
        },
      ],
    },

    // ============================================================
    // 1.9 — L'ÈRE DE L'IA
    // ============================================================
    {
      number: "1.9",
      slug: "data-engineering-a-lere-de-lia",
      title: "Data Engineering à l'ère de l'IA : menace ou opportunité ?",
      duration_minutes: 120,
      sort_order: 9,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "C'est la question qu'on ne te pose pas assez avant de t'inscrire à un bootcamp technique en 2026 : et si l'IA générative faisait le travail à ta place avant même que tu ne sois embauché ? Pour le Data Engineering, la réponse tient en une phrase : l'IA générative ne remplace pas la plomberie des données, elle en consomme davantage.",
          },
          { type: "h3", text: "Pourquoi un LLM a plus besoin de toi, pas moins" },
          {
            type: "p",
            text: "Un chatbot IA capable de répondre sur les documents internes d'une entreprise (une architecture appelée RAG — Retrieval-Augmented Generation) n'est pas magique : il a besoin qu'on ingère ses documents, qu'on les découpe, qu'on les transforme en embeddings, qu'on les stocke dans une base vectorielle, et qu'on maintienne tout ce pipeline à jour. Retire le pipeline, il ne reste qu'un modèle qui invente des réponses.",
          },
          {
            type: "chart_bar",
            title: "Marché des bases de données vectorielles (RAG/IA), 2025–2030",
            subtitle: "En milliards de dollars — projection à un TCAC de 27,5%",
            points: [
              { label: "2025", value: 2.65 },
              { label: "2026", value: 3.38 },
              { label: "2027", value: 4.31 },
              { label: "2028", value: 5.49 },
              { label: "2029", value: 7.0 },
              { label: "2030", value: 8.95 },
            ],
            sourceNote: "MarketsandMarkets (2026) — d'autres cabinets projettent une trajectoire encore plus haute.",
          },
          {
            type: "stat_grid",
            stats: [
              { value: "51%", label: "des implémentations IA en entreprise reposent sur du RAG" },
              { value: "+377%", label: "croissance des bases vectorielles en un an" },
              { value: "40%", label: "des apps d'entreprise auront un agent IA fin 2026" },
              { value: "#1", label: "AI Engineer, métier tech à la croissance la plus rapide (LinkedIn 2026)" },
            ],
          },
          {
            type: "p",
            text: "Le RAG représente désormais 51% des implémentations d'IA en entreprise, contre 31% un an plus tôt. La catégorie des bases vectorielles a crû de 377% en un an. Et 40% des applications d'entreprise intégreront un agent IA d'ici fin 2026, contre moins de 5% en 2025. Chacun de ces agents a, sous le capot, un pipeline de données — souvent construit et maintenu par un Data Engineer, parfois par un AI Engineer qui en a besoin fiable.",
          },
          { type: "h3", text: "La nuance honnête" },
          {
            type: "p",
            text: "Le métier ne disparaît pas, mais il change de forme. Les embauches de data engineers ont progressé de 23% sur la dernière année, mais ce sont les postes juniors et intermédiaires classiques qui reculent le plus — l'IA absorbe le code répétitif. Ce qui reste, et se renforce, c'est la conception de systèmes fiables et le jugement pour décider ce qu'il faut automatiser.",
          },
          {
            type: "diagnostic",
            title: "Diagnostic final — ce métier est-il fait pour toi ?",
            items: [
              "J'aime comprendre comment un système fonctionne « sous le capot », pas seulement m'en servir.",
              "Je préfère résoudre un bug une fois pour toutes plutôt que produire un rapport rapide.",
              "L'idée d'écrire du code presque tous les jours m'attire plus qu'elle ne m'effraie.",
              "Ça ne me dérange pas que mon travail soit invisible pour l'utilisateur final.",
              "J'aime les problèmes de fiabilité et de performance plus que les problèmes de présentation visuelle.",
              "Je suis prêt·e à apprendre SQL, Python et des outils cloud en profondeur, pas juste les bases.",
              "L'actualité de l'IA me donne envie de comprendre ce qu'il y a derrière, pas seulement de l'utiliser.",
              "Je peux m'engager sur plusieurs mois d'apprentissage avant de voir des résultats professionnels.",
            ],
          },
        ],
      },
      quiz: [
        {
          question: "Le RAG représente aujourd'hui quelle part des implémentations d'IA en entreprise ?",
          options: ["5%", "51%", "90%"],
          correct_index: 1,
          explain: "Contre 31% un an plus tôt — la croissance la plus rapide des technologies liées aux LLM.",
        },
        {
          question: "Une application de RAG a besoin, avant tout, de :",
          options: ["Un modèle plus puissant", "Un pipeline qui ingère, nettoie et vectorise les documents", "Rien de particulier"],
          correct_index: 1,
          explain: "Sans pipeline de données fiable, un RAG n'a rien à récupérer.",
        },
        {
          question: "Sur la dernière année, l'embauche de data engineers a :",
          options: ["Baissé de 50%", "Augmenté de 23%, avec un recul des postes juniors/intermédiaires", "Stagné totalement"],
          correct_index: 1,
          explain: "Le volume augmente, mais le profil recherché change.",
        },
        {
          question: "Le marché des bases de données vectorielles croît à un rythme (TCAC) d'environ :",
          options: ["2%", "27%", "300%"],
          correct_index: 1,
          explain: "27,5% de TCAC projeté jusqu'en 2030 — et la catégorie a déjà crû de 377% sur la dernière année.",
        },
      ],
    },

    // ============================================================
    // 1.10 — POURQUOI CE BOOTCAMP
    // ============================================================
    {
      number: "1.10",
      slug: "pourquoi-ce-bootcamp",
      title: "Pourquoi ce bootcamp : la feuille de route complète",
      duration_minutes: 90,
      sort_order: 10,
      body_content: {
        blocks: [
          {
            type: "p",
            text: "Tu as maintenant le contexte, les six métiers, des cas concrets, les outils, les compétences, le marché, et une réponse honnête sur l'IA. Voici comment les 11 modules restants s'articulent pour faire de toi un Data Engineer complet.",
          },
          {
            type: "module_roadmap",
            modules: [
              { number: 2, title: "SQL & Modélisation des données", note: "Le socle : requêtes avancées, modélisation analytique." },
              { number: 3, title: "Python, Git & Docker", note: "Les outils du quotidien pour coder et collaborer proprement." },
              { number: 4, title: "Ingestion de données & APIs", note: "Faire entrer la donnée dans le système, en batch ou en streaming." },
              { number: 5, title: "Pipelines, ETL/ELT & Airflow", note: "Orchestrer des pipelines fiables et testés." },
              { number: 6, title: "Big Data & PySpark", note: "Traiter des volumes que SQL seul ne peut plus gérer." },
              { number: 7, title: "Data Lake, Lakehouse & Databricks", note: "Où et comment stocker à grande échelle." },
              { number: 8, title: "Streaming avec Kafka", note: "Réagir en temps réel, pas seulement une fois par jour." },
              { number: 9, title: "Architecture avancée & DataOps", note: "CI/CD, gouvernance, sécurité des données." },
              { number: 10, title: "Cloud — AWS, Azure, GCP", note: "Déployer sur les plateformes que les entreprises utilisent." },
              { number: 11, title: "Data Engineering pour l'IA (ML & LLM)", note: "Construire les pipelines derrière le RAG et les agents IA." },
              { number: 12, title: "Projet final & préparation carrière", note: "Un projet complet, un portfolio, prêt pour l'entretien." },
            ],
          },
          {
            type: "checklist",
            title: "Avant de démarrer le Module 02, assure-toi que tu peux répondre à :",
            items: [
              "Pourquoi la donnée est devenue stratégique, en une phrase",
              "Ce qui distingue un Data Engineer d'un Data Analyst, d'un Data Scientist et d'un AI Engineer",
              "Pourquoi le RAG rend ce métier plus critique, pas obsolète",
              "Quelles sont les 6 grandes catégories d'outils du parcours",
            ],
          },
        ],
      },
      quiz: [
        {
          question: "Quel module introduit le calcul distribué avec PySpark ?",
          options: ["Module 2", "Module 6", "Module 11"],
          correct_index: 1,
          explain: "Le Module 6 est dédié au Big Data et à PySpark.",
        },
        {
          question: "Quel module construit les pipelines de données derrière les applications IA/LLM ?",
          options: ["Module 3", "Module 8", "Module 11"],
          correct_index: 2,
          explain: "Le Module 11 couvre les pipelines pour le Machine Learning et les LLM (RAG, embeddings).",
        },
      ],
    },
  ];

  // Supprime les leçons d'une ancienne version du seed qui ne font plus partie
  // du contenu actuel (slugs renommés/retirés) — garde le seed comme source
  // de vérité unique pour le Module 01.
  const currentSlugs = lessons.map((l) => l.slug);
  const { error: cleanupErr } = await supabase
    .from("lessons")
    .delete()
    .eq("module_id", mod.id)
    .not("slug", "in", `(${currentSlugs.join(",")})`);
  if (cleanupErr) throw cleanupErr;

  for (const lesson of lessons) {
    console.log(`  → Leçon ${lesson.number} — ${lesson.title}`);
    const { quiz, ...lessonRow } = lesson;
    const { data: savedLesson, error: lessonErr } = await supabase
      .from("lessons")
      .upsert(
        {
          module_id: mod.id,
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

    // Repart les questions de zéro à chaque run pour rester idempotent
    await supabase.from("quiz_questions").delete().eq("lesson_id", savedLesson.id);
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

  // Quiz final du module (20 questions couvrant les 10 leçons)
  console.log("  → Quiz final du module…");
  const finalQuiz = [
    { question: "Quelle est la première étape d'un pipeline de données ?", options: ["Transformation", "Sources", "Consommation"], correct_index: 1 },
    { question: "Le volume de données mondial est passé d'environ 64 ZB en 2020 à environ combien en 2026 ?", options: ["100 ZB", "221 ZB", "1000 ZB"], correct_index: 1 },
    { question: "Quel duo n'est PAS un moteur majeur de l'explosion des données ?", options: ["IoT et 5G", "Fax et Minitel", "Cloud et IA"], correct_index: 1 },
    { question: "La Data Engineering se définit avant tout comme l'ingénierie de :", options: ["La présentation visuelle", "La fiabilité des systèmes de données", "La prédiction statistique"], correct_index: 1 },
    { question: "Quel métier est le pont entre Data Analyst et Data Engineer ?", options: ["Analytics Engineer", "DevOps", "UX Designer"], correct_index: 0 },
    { question: "Quel outil est emblématique de l'Analytics Engineer ?", options: ["dbt", "Airflow", "Kafka"], correct_index: 0 },
    { question: "Le ML Engineer dérive plutôt vers :", options: ["L'infrastructure et la donnée", "Le design graphique", "La vente"], correct_index: 0 },
    { question: "L'AI Engineer dérive plutôt vers :", options: ["Le produit et l'application", "La maintenance réseau", "La comptabilité"], correct_index: 0 },
    { question: "Dans le cas Uber, pourquoi le streaming est-il indispensable ?", options: ["Pour le reporting mensuel", "Pour un prix dynamique en temps réel", "Ce n'est pas indispensable"], correct_index: 1 },
    { question: "SQL et Python permettent de réussir environ quelle part des entretiens data engineer ?", options: ["10%", "60%", "100%"], correct_index: 1 },
    { question: "Quel outil est le standard historique de l'orchestration ?", options: ["Airflow", "Excel", "Photoshop"], correct_index: 0 },
    { question: "Pourquoi la documentation fait-elle partie du métier ?", options: ["Ce n'est pas utile", "Un système non documenté devient une dette technique", "C'est juste joli"], correct_index: 1 },
    { question: "Le marché data marocain a connu, depuis 2020, une croissance :", options: ["Nulle", "À deux chiffres", "Négative"], correct_index: 1 },
    { question: "La croissance des embauches de data engineers sur la dernière année a été de :", options: ["-10%", "+23%", "+200%"], correct_index: 1 },
    { question: "En France, le TJM d'un Data Engineer freelance confirmé se situe autour de :", options: ["50 €/jour", "500-680 €/jour", "5000 €/jour"], correct_index: 1 },
    { question: "Quelle spécialisation freelance se négocie le plus cher dans la data ?", options: ["IA/LLM", "Saisie de données", "Reporting basique"], correct_index: 0 },
    { question: "La part des implémentations d'IA basées sur du RAG est passée de 31% à environ :", options: ["35%", "51%", "99%"], correct_index: 1 },
    { question: "Pourquoi l'IA générative renforce-t-elle le besoin de data engineering ?", options: ["Les LLM n'ont besoin d'aucune donnée", "Le RAG et les agents IA ont besoin de pipelines fiables", "L'IA remplace les bases de données"], correct_index: 1 },
    { question: "Quel module du parcours couvre les pipelines pour le Machine Learning et les LLM ?", options: ["Module 4", "Module 11", "Module 2"], correct_index: 1 },
    { question: "Quel est le seuil de réussite d'un quiz de module chez DataLendo ?", options: ["50%", "80%", "100%"], correct_index: 1 },
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

  console.log("✓ Module 01 seedé avec succès (10 leçons).");
}

main().catch((err) => {
  console.error("✗ Échec du seed :", err);
  process.exit(1);
});
