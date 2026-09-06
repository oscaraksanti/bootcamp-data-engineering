import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ModuleForm } from "@/components/admin/ModuleForm";
import { deleteModule } from "@/lib/actions/admin";
import { buildLessonTree, type LessonNode } from "@/lib/lesson-tree";

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
    .select("id, slug, number, title, status, duration_minutes, sort_order, parent_lesson_id")
    .eq("module_id", moduleId)
    .order("sort_order");

  const tree = buildLessonTree(lessons ?? []);

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">{courseModule.title}</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <h2 className="font-display font-bold text-sm text-ink mb-3">Chapitres & leçons</h2>
          <div className="border border-line rounded-xl bg-surface overflow-hidden mb-4">
            {tree.length === 0 && (
              <p className="px-4 py-4 text-sm text-ink-faint">Aucun chapitre pour l&apos;instant.</p>
            )}
            {tree.map((node) => (
              <AdminLessonNode key={node.id} node={node} moduleId={moduleId} />
            ))}
          </div>
          <Link
            href={`/admin/modules/${moduleId}/lessons/new`}
            className="inline-block text-sm font-semibold text-accent-ink border border-line-strong rounded-lg px-4 py-2 hover:border-accent"
          >
            + Nouveau chapitre
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

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`text-[10px] font-mono uppercase rounded-full px-2 py-0.5 flex-none ${
        status === "published" ? "bg-success-soft text-success" : "bg-surface-2 text-ink-faint border border-line"
      }`}
    >
      {status === "published" ? "Publiée" : "Brouillon"}
    </span>
  );
}

function AdminLessonNode({ node, moduleId }: { node: LessonNode; moduleId: string }) {
  // Feuille : lien direct vers l'éditeur, comme avant.
  if (node.children.length === 0) {
    return (
      <Link
        href={`/admin/modules/${moduleId}/lessons/${node.id}`}
        className="flex items-center justify-between px-4 py-3 border-b border-line last:border-0 hover:bg-surface-2"
      >
        <span className="text-sm text-ink">
          <span className="font-mono text-ink-faint mr-2">{node.number}</span>
          {node.title}
        </span>
        <StatusPill status={node.status} />
      </Link>
    );
  }

  // Chapitre : en-tête + ses leçons indentées + bouton d'ajout scopé.
  return (
    <div className="border-b border-line last:border-0">
      <Link
        href={`/admin/modules/${moduleId}/lessons/${node.id}`}
        className="flex items-center justify-between px-4 py-3 hover:bg-surface-2 bg-surface-2/40"
      >
        <span className="text-sm font-semibold text-ink">
          <span className="font-mono text-ink-faint mr-2">{node.number}</span>
          {node.title}
          <span className="font-mono text-[10.5px] text-ink-faint font-normal ml-2">
            {node.children.length} leçon{node.children.length > 1 ? "s" : ""}
          </span>
        </span>
        <StatusPill status={node.status} />
      </Link>
      <div className="pl-5 pb-2">
        {node.children.map((child) => (
          <Link
            key={child.id}
            href={`/admin/modules/${moduleId}/lessons/${child.id}`}
            className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-surface-2"
          >
            <span className="text-[13px] text-ink-soft">
              <span className="font-mono text-ink-faint mr-2">{child.number}</span>
              {child.title}
            </span>
            <StatusPill status={child.status} />
          </Link>
        ))}
        <Link
          href={`/admin/modules/${moduleId}/lessons/new?parent=${node.id}`}
          className="inline-block mt-1 ml-4 text-xs font-semibold text-accent-ink hover:underline"
        >
          + Nouvelle leçon dans ce chapitre
        </Link>
      </div>
    </div>
  );
}
