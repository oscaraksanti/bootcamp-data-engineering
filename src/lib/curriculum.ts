// Vue d'ensemble statique du programme, utilisée par la vitrine.
// Le contenu réel des leçons (Module 01) vit en base — voir supabase/seed.
export const CURRICULUM = [
  { number: 1, title: "Le métier de Data Engineer", hours: "16–20 h" },
  { number: 2, title: "SQL & Modélisation des données", hours: "35–45 h" },
  { number: 3, title: "Python, Git & Docker", hours: "30–40 h" },
  { number: 4, title: "Ingestion de données & APIs", hours: "25–30 h" },
  { number: 5, title: "Pipelines, ETL/ELT & Airflow", hours: "35–40 h" },
  { number: 6, title: "Big Data & PySpark", hours: "35–40 h" },
  { number: 7, title: "Data Lake, Lakehouse & Databricks", hours: "25–30 h" },
  { number: 8, title: "Streaming avec Kafka", hours: "25–30 h" },
  { number: 9, title: "Architecture avancée & DataOps", hours: "25–30 h" },
  { number: 10, title: "Cloud — AWS, Azure, GCP", hours: "35–45 h" },
  { number: 11, title: "Data Engineering pour l'IA (ML & LLM)", hours: "25–30 h" },
  { number: 12, title: "Projet final & préparation carrière", hours: "40–50 h" },
] as const;
