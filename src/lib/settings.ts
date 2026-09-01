import { createServiceRoleClient } from "@/lib/supabase/server";

export interface ResolvedChariowConfig {
  apiKey: string | null;
  webhookSecret: string | null;
  moduleProductId: string | null;
  fullAccessProductId: string | null;
}

/**
 * Les réglages Chariow peuvent vivre dans `platform_settings` (modifiable
 * depuis l'admin, sans redéploiement) ou, à défaut, dans les variables
 * d'environnement (utile avant que l'admin ne les ait renseignés).
 */
export async function getChariowConfig(): Promise<ResolvedChariowConfig> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("platform_settings")
    .select(
      "chariow_api_key, chariow_webhook_secret, chariow_module_product_id, chariow_full_access_product_id"
    )
    .eq("id", true)
    .maybeSingle();

  return {
    apiKey: data?.chariow_api_key || process.env.CHARIOW_API_KEY || null,
    webhookSecret: data?.chariow_webhook_secret || process.env.CHARIOW_WEBHOOK_SECRET || null,
    moduleProductId:
      data?.chariow_module_product_id || process.env.CHARIOW_MODULE_PRODUCT_ID || null,
    fullAccessProductId:
      data?.chariow_full_access_product_id || process.env.CHARIOW_FULL_ACCESS_PRODUCT_ID || null,
  };
}

export async function getBranding() {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("platform_settings")
    .select("brand_name, brand_accent_color")
    .eq("id", true)
    .maybeSingle();

  return {
    brandName: data?.brand_name || "DataLendo",
    accentColor: data?.brand_accent_color || null,
  };
}
