import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export interface AccessSummary {
  hasFullAccess: boolean;
  unlockedModuleIds: Set<string>;
}

/**
 * Résume les droits d'accès d'un utilisateur : accès complet (297$/an) et/ou
 * modules achetés individuellement (30$, à vie). Un entitlement `scope_module_id`
 * null = accès complet ; non expiré si `expires_at` est null ou dans le futur.
 */
export async function getAccessSummary(
  supabase: SupabaseClient<Database>,
  userId: string | undefined
): Promise<AccessSummary> {
  if (!userId) return { hasFullAccess: false, unlockedModuleIds: new Set() };

  const { data } = await supabase
    .from("entitlements")
    .select("scope_module_id, expires_at")
    .eq("user_id", userId);

  const now = Date.now();
  const active = (data ?? []).filter(
    (e) => !e.expires_at || new Date(e.expires_at).getTime() > now
  );

  return {
    hasFullAccess: active.some((e) => e.scope_module_id === null),
    unlockedModuleIds: new Set(
      active.filter((e) => e.scope_module_id !== null).map((e) => e.scope_module_id as string)
    ),
  };
}

/** Un module est accessible s'il est gratuit, ou couvert par un entitlement. */
export function moduleIsUnlocked(
  module: { id: string; is_free: boolean },
  access: AccessSummary
): boolean {
  return module.is_free || access.hasFullAccess || access.unlockedModuleIds.has(module.id);
}
