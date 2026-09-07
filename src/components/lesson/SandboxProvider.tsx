"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { PGlite } from "@electric-sql/pglite";

export type SandboxStatus = "loading" | "ready" | "error";

export interface QueryResult {
  columns: string[];
  rows: unknown[][];
  rowCount: number;
}

interface SandboxContextValue {
  status: SandboxStatus;
  error: string | null;
  runQuery: (sql: string) => Promise<QueryResult | { error: string }>;
  reset: () => Promise<void>;
  retry: () => void;
}

const SandboxContext = createContext<SandboxContextValue | null>(null);

export function useSandbox() {
  const ctx = useContext(SandboxContext);
  if (!ctx) throw new Error("useSandbox doit être appelé à l'intérieur d'un <SandboxProvider>");
  return ctx;
}

/** Comme useSandbox(), mais renvoie null au lieu de lever une erreur — pour
 * les composants (ex. Quiz) qui ne savent pas à l'avance si un
 * <SandboxProvider> les entoure. */
export function useOptionalSandbox() {
  return useContext(SandboxContext);
}

let seedSqlCache: string | null = null;
async function loadSeedSql(): Promise<string> {
  if (seedSqlCache) return seedSqlCache;
  const res = await fetch("/sandbox/afripay-seed.sql");
  if (!res.ok) throw new Error("Impossible de charger le jeu de données AfriPay");
  seedSqlCache = await res.text();
  return seedSqlCache;
}

/** La version attendue est celle déclarée dans le fichier lui-même — jamais dupliquée en dur ici. */
function parseSchemaVersion(seedSql: string): number {
  const match = seedSql.match(/insert into _sandbox_version \(version\) values \((\d+)\)/);
  return match ? Number(match[1]) : 0;
}

export function SandboxProvider({ children }: { children: React.ReactNode }) {
  const dbRef = useRef<PGlite | null>(null);
  const [status, setStatus] = useState<SandboxStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const [bootAttempt, setBootAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function boot() {
      try {
        const { PGlite } = await import("@electric-sql/pglite");
        const db = dbRef.current ?? new PGlite("idb://datalendo-afripay-sandbox");
        dbRef.current = db;

        const seedSql = await loadSeedSql();
        const expectedVersion = parseSchemaVersion(seedSql);

        const check = await db.query<{ t: string | null }>(
          "select to_regclass('public._sandbox_version') as t;"
        );
        let currentVersion = 0;
        if (check.rows[0]?.t != null) {
          const versionRes = await db.query<{ version: number }>("select version from _sandbox_version;");
          currentVersion = versionRes.rows[0]?.version ?? 0;
        }

        // Schéma absent ou périmé (version antérieure à celle du fichier
        // courant) → on re-seed. Le script généré fait toujours un `drop
        // table ... cascade` en tête, donc rejouer est sans risque.
        if (currentVersion < expectedVersion) {
          await db.exec(seedSql);
        }
        if (!ignore) setStatus("ready");
      } catch (e) {
        if (!ignore) {
          setError(e instanceof Error ? e.message : "Erreur d'initialisation du bac à sable");
          setStatus("error");
        }
      }
    }

    boot();
    return () => {
      ignore = true;
    };
  }, [bootAttempt]);

  const runQuery = useCallback(async (sql: string): Promise<QueryResult | { error: string }> => {
    const db = dbRef.current;
    if (!db) return { error: "Le bac à sable n'est pas encore prêt." };
    try {
      const res = await db.query(sql);
      const columns = res.fields.map((f) => f.name);
      const rows = (res.rows as Record<string, unknown>[]).map((row) => columns.map((c) => row[c]));
      return { columns, rows, rowCount: res.rows.length };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Erreur SQL" };
    }
  }, []);

  const reset = useCallback(async () => {
    const db = dbRef.current;
    if (!db) return;
    setStatus("loading");
    try {
      const seedSql = await loadSeedSql();
      await db.exec(seedSql); // le script recrée les tables (drop ... cascade en tête)
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la réinitialisation");
      setStatus("error");
    }
  }, []);

  const retry = useCallback(() => {
    setStatus("loading");
    setError(null);
    setBootAttempt((n) => n + 1);
  }, []);

  return (
    <SandboxContext.Provider value={{ status, error, runQuery, reset, retry }}>
      {children}
    </SandboxContext.Provider>
  );
}
