import { saveModule } from "@/lib/actions/admin";
import type { Database } from "@/lib/supabase/types";

type ModuleRow = Database["public"]["Tables"]["modules"]["Row"];

export function ModuleForm({ module: m }: { module?: ModuleRow }) {
  return (
    <form action={saveModule.bind(null, m?.id ?? null)} className="flex flex-col gap-4 max-w-xl">
      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">Titre</label>
        <input
          name="title"
          defaultValue={m?.title}
          required
          className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Numéro</label>
          <input
            type="number"
            name="number"
            defaultValue={m?.number}
            required
            className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Slug (optionnel)</label>
          <input
            name="slug"
            defaultValue={m?.slug}
            placeholder="généré depuis le titre si vide"
            className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Durée min (h)</label>
          <input
            type="number"
            name="hours_min"
            defaultValue={m?.hours_min}
            required
            className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Durée max (h)</label>
          <input
            type="number"
            name="hours_max"
            defaultValue={m?.hours_max}
            required
            className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">
          ID produit Chariow (module à 30$)
        </label>
        <input
          name="chariow_product_id"
          defaultValue={m?.chariow_product_id ?? ""}
          placeholder="prd_abc123 ou slug du produit"
          className="w-full border border-line-strong rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent font-mono"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" name="is_free" defaultChecked={m?.is_free} />
          Module gratuit
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" name="status" value="published" defaultChecked={m?.status === "published"} />
          Actif (visible des apprenants)
        </label>
      </div>

      <button
        type="submit"
        className="self-start text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-5 py-2.5 mt-2"
      >
        Enregistrer
      </button>
    </form>
  );
}
