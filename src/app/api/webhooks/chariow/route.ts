import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getChariowConfig } from "@/lib/settings";
import type { PaymentProductType } from "@/lib/supabase/types";

// Contrat de signature complet : https://chariow.dev/fr/guides/pulse-security
function isValidSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const received = Buffer.from(header);
  const expectedBuf = Buffer.from(expected);
  if (received.length !== expectedBuf.length) return false;
  return timingSafeEqual(received, expectedBuf);
}

interface ChariowSalePayload {
  event: "successful.sale" | "abandoned.sale" | "failed.sale" | string;
  sale: {
    id: string;
    amount: { value: number; currency: string };
    status: string;
    custom_metadata?: {
      user_id?: string;
      product_type?: PaymentProductType;
      module_id?: string;
    } | null;
  };
  product: { id: string; name: string };
}

export async function POST(request: NextRequest) {
  const { webhookSecret: secret } = await getChariowConfig();
  if (!secret) {
    console.error("Secret de webhook Chariow manquant (Admin > Paramètres, ou CHARIOW_WEBHOOK_SECRET)");
    return NextResponse.json({ error: "misconfigured" }, { status: 500 });
  }

  // Le corps brut doit être capturé AVANT tout parsing JSON — la signature
  // est calculée sur les octets exacts reçus, jamais sur une resérialisation.
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("x-chariow-signature");

  if (!isValidSignature(rawBody, signatureHeader, secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as ChariowSalePayload;
  const meta = payload.sale.custom_metadata;

  if (payload.event !== "successful.sale") {
    // Vente abandonnée/échouée : rien à débloquer, on accuse simplement réception.
    return NextResponse.json({ ok: true });
  }

  if (!meta?.user_id || !meta.product_type) {
    console.error("successful.sale reçu sans custom_metadata attendu", payload.sale.id);
    return NextResponse.json({ ok: true });
  }

  const supabase = createServiceRoleClient();

  // Idempotence : chariow_order_id est unique. Si la ligne existe déjà (retry
  // du même webhook), on ne recrée pas l'entitlement une deuxième fois.
  const { error: insertError } = await supabase.from("payments").insert({
    user_id: meta.user_id,
    chariow_order_id: payload.sale.id,
    amount: payload.sale.amount?.value ?? null,
    status: "paid",
    product_type: meta.product_type,
    module_id: meta.module_id ?? null,
    raw_payload: payload as unknown as Record<string, unknown>,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      // Déjà traité lors d'une livraison précédente du même Pulse.
      return NextResponse.json({ ok: true });
    }
    console.error("Échec d'écriture du paiement Chariow", insertError);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }

  const newExpiresAt =
    meta.product_type === "full_access"
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : null;

  if (meta.product_type === "module") {
    // scope_module_id est un UUID réel ici : la contrainte unique(user_id,
    // scope_module_id) fonctionne normalement avec onConflict.
    await supabase.from("entitlements").upsert(
      {
        user_id: meta.user_id,
        scope_module_id: meta.module_id,
        source: "module_purchase",
        expires_at: null, // à vie
      },
      { onConflict: "user_id,scope_module_id" }
    );
  } else {
    // scope_module_id est NULL pour l'accès complet — Postgres ne traite
    // jamais deux NULL comme égaux, donc onConflict ne dédupliquerait pas un
    // renouvellement. On cherche la ligne existante nous-mêmes.
    const { data: existing } = await supabase
      .from("entitlements")
      .select("id")
      .eq("user_id", meta.user_id)
      .is("scope_module_id", null)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("entitlements")
        .update({ source: "subscription", granted_at: new Date().toISOString(), expires_at: newExpiresAt })
        .eq("id", existing.id);
    } else {
      await supabase.from("entitlements").insert({
        user_id: meta.user_id,
        scope_module_id: null,
        source: "subscription",
        expires_at: newExpiresAt,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
