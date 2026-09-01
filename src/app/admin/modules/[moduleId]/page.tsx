import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ModuleForm } from "@/components/admin/ModuleForm";
import { deleteModule } from "@/lib/actions/admin";

export default async function EditModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const supabase = await createClient();

  const { data: courseModule } = await supabase.from("modules").select("*").eq("id", moduleId).single();
  if (!courseModule) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, number, title, status, duration_minutes")
    .eq("module_id", moduleId)
    .order("sort_order");

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">{courseModule.title}</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <h2 className="font-display font-bold text-sm text-ink mb-3">Leçons</h2>
          <div className="border border-line rounded-xl bg-surface overflow-hidden mb-4">
            {(lessons ?? []).length === 0 && (
              <p className="px-4 py-4 text-sm text-ink-faint">Aucune leçon pour l&apos;instant.</p>
            )}
            {(lessons ?? []).map((l) => (
              <Link
                key={l.id}
                href={`/admin/modules/${moduleId}/lessons/${l.id}`}
                className="flex items-center justify-between px-4 py-3 border-b border-line last:border-0 hover:bg-surface-2"
              >
                <span className="text-sm text-ink">
                  <span className="font-mono text-ink-faint mr-2">{l.number}</span>
                  {l.title}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase rounded-full px-2 py-0.5 ${
                    l.status === "published" ? "bg-success-soft text-success" : "bg-surface-2 text-ink-faint border border-line"
                  }`}
                >
                  {l.status === "published" ? "Publiée" : "Brouillon"}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href={`/admin/modules/${moduleId}/lessons/new`}
            className="inline-block text-sm font-semibold text-accent-ink border border-line-strong rounded-lg px-4 py-2 hover:border-accent"
          >
            + Nouvelle leçon
          </Link>
        </div>

        <div>
          <h2 className="font-display font-bold text-sm text-ink mb-3">Réglages du module</h2>
          <ModuleForm module={courseModule} />
          <form action={deleteModule.bind(null, moduleId)} className="mt-6">
            <button type="submit" className="text-xs text-danger hover:underline">
              Supprimer ce module
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
