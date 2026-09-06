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

let seedSqlCache: string | null = null;
async function loadSeedSql(): Promise<string> {
  if (seedSqlCache) return seedSqlCache;
  const res = await fetch("/sandbox/afripay-seed.sql");
  if (!res.ok) throw new Error("Impossible de charger le jeu de données AfriPay");
  seedSqlCache = await res.text();
  return seedSqlCache;
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

        const check = await db.query<{ t: string | null }>(
          "select to_regclass('public.fact_transactions') as t;"
        );
        const alreadySeeded = check.rows[0]?.t != null;
        if (!alreadySeeded) {
          const seedSql = await loadSeedSql();
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
