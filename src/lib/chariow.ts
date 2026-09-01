// Intégration Chariow — voir https://chariow.dev/fr/guides/checkout
// On ne consomme que leur API de paiement (checkout + webhooks) : le contenu
// et la livraison restent gérés entièrement par DataLendo.

import { getChariowConfig } from "@/lib/settings";

const CHARIOW_API_BASE = "https://api.chariow.com/v1";

export type ChariowProductType = "module" | "full_access";

interface StartCheckoutParams {
  productType: ChariowProductType;
  moduleId?: string;
  /** Remplace le produit Chariow global du module — voir modules.chariow_product_id */
  moduleProductIdOverride?: string | null;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  redirectUrl: string;
}

interface ChariowCheckoutResponse {
  step: "payment" | "completed" | "already_purchased";
  checkout_url?: string;
  sale?: { id: string };
}

/**
 * Initie une session de paiement Chariow pour un produit donné et renvoie la
 * réponse brute — à l'appelant de rediriger vers `checkout_url` si
 * `step === "payment"`, ou de gérer les cas `completed` / `already_purchased`.
 */
export async function startChariowCheckout(
  params: StartCheckoutParams
): Promise<ChariowCheckoutResponse> {
  const config = await getChariowConfig();
  const apiKey = config.apiKey;
  const productId =
    params.productType === "module"
      ? params.moduleProductIdOverride || config.moduleProductId
      : config.fullAccessProductId;

  if (!apiKey || !productId) {
    throw new Error(
      "Configuration Chariow manquante — renseigne-la dans Admin > Paramètres > Intégrations, ou via les variables d'environnement CHARIOW_*"
    );
  }

  const res = await fetch(`${CHARIOW_API_BASE}/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      email: params.email,
      first_name: params.firstName,
      last_name: params.lastName,
      // Chariow exige un numéro de téléphone ; à défaut d'un vrai champ dans
      // notre formulaire d'inscription, on envoie un indicatif neutre —
      // à remplacer dès qu'on collecte le vrai numéro de l'apprenant.
      phone: { number: "000000000", country_code: "CI" },
      redirect_url: params.redirectUrl,
      custom_metadata: {
        user_id: params.userId,
        product_type: params.productType,
        ...(params.moduleId ? { module_id: params.moduleId } : {}),
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Chariow checkout a échoué (${res.status}) : ${body}`);
  }

  return res.json();
}
