import { createClient } from "@/lib/supabase/server";
import { saveSettings } from "@/lib/actions/admin";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("platform_settings").select("*").eq("id", true).single();

  const configured = (v: unknown) => Boolean(v);

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Paramètres</h1>

      <form action={saveSettings} className="flex flex-col gap-6">
        <section>
          <h2 className="font-display font-bold text-sm text-ink mb-3">Apparence</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1.5">Nom de la marque</label>
              <input
                name="brand_name"
                defaultValue={settings?.brand_name ?? "DataLendo"}
                className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1.5">Couleur d&apos;accent</label>
              <input
                type="color"
                name="brand_accent_color"
                defaultValue={settings?.brand_accent_color ?? "#6c5ce7"}
                className="h-10 w-20 border border-line-strong rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1.5">
                Lieu affiché sur les certificats (« Fait à … »)
              </label>
              <input
                name="certificate_location"
                defaultValue={settings?.certificate_location ?? ""}
                placeholder="Ex. Kinshasa — laisser vide pour ne pas l'afficher"
                className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-sm text-ink mb-1">Intégration Chariow</h2>
          <p className="text-xs text-ink-faint mb-3">
            Les champs déjà configurés restent inchangés si tu les laisses vides — pour des raisons de
            sécurité, les valeurs enregistrées ne sont jamais réaffichées en clair.
          </p>
          <div className="flex flex-col gap-3">
            <SettingField
              label="Clé API"
              name="chariow_api_key"
              configured={configured(settings?.chariow_api_key)}
            />
            <SettingField
              label="Secret de webhook (Pulse)"
              name="chariow_webhook_secret"
              configured={configured(settings?.chariow_webhook_secret)}
            />
            <SettingField
              label="ID produit — module à 30$ (par défaut)"
              name="chariow_module_product_id"
              configured={configured(settings?.chariow_module_product_id)}
              mono
            />
            <SettingField
              label="ID produit — accès complet 297$/an"
              name="chariow_full_access_product_id"
              configured={configured(settings?.chariow_full_access_product_id)}
              mono
            />
          </div>
        </section>

        <button
          type="submit"
          className="self-start text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-5 py-2.5"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}

function SettingField({
  label,
  name,
  configured,
  mono,
}: {
  label: string;
  name: string;
  configured: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-ink-soft mb-1.5">
        {label}
        <span
          className={`text-[10px] font-mono uppercase rounded-full px-2 py-0.5 ${
            configured ? "bg-success-soft text-success" : "bg-surface-2 text-ink-faint border border-line"
          }`}
        >
          {configured ? "Configuré" : "Non configuré"}
        </span>
      </label>
      <input
        name={name}
        placeholder={configured ? "•••••••••••• (laisser vide pour ne pas changer)" : "Coller la valeur ici"}
        className={`w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}
