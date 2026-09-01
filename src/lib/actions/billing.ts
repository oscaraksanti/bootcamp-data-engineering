"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { startChariowCheckout, type ChariowProductType } from "@/lib/chariow";

export async function startCheckout(productType: ChariowProductType, moduleId: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const [firstName, ...rest] = (profile?.full_name ?? "Apprenant DataLendo").split(" ");

  let moduleProductIdOverride: string | null = null;
  if (moduleId) {
    const { data: mod } = await supabase
      .from("modules")
      .select("chariow_product_id")
      .eq("id", moduleId)
      .single();
    moduleProductIdOverride = mod?.chariow_product_id ?? null;
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const response = await startChariowCheckout({
    productType,
    moduleId: moduleId ?? undefined,
    moduleProductIdOverride,
    userId: user.id,
    email: user.email!,
    firstName: firstName || "Apprenant",
    lastName: rest.join(" ") || "DataLendo",
    redirectUrl: `${origin}/app?paiement=succes`,
  });

  if (response.step === "payment" && response.checkout_url) {
    redirect(response.checkout_url);
  }

  // "completed" (produit gratuit) ou "already_purchased" : rien à payer, on
  // renvoie simplement l'apprenant vers son tableau de bord.
  redirect("/app?paiement=deja_actif");
}
