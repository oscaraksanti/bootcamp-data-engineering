// Construit l'arborescence Chapitre → Leçon à partir d'une liste plate de
// leçons. Rétro-compatible : une leçon de premier niveau sans enfants est une
// feuille comme avant (Modules 01/02 actuels) ; avec des enfants, elle
// devient un en-tête de chapitre non cliquable.

export interface LessonRow {
  id: string;
  slug: string;
  title: string;
  number: string;
  status: string;
  sort_order: number;
  parent_lesson_id: string | null;
}

export interface LessonNode extends LessonRow {
  children: LessonNode[];
}

export function buildLessonTree(rows: LessonRow[]): LessonNode[] {
  const byParent = new Map<string | null, LessonRow[]>();
  for (const row of rows) {
    const key = row.parent_lesson_id;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(row);
  }

  function build(parentId: string | null): LessonNode[] {
    const children = (byParent.get(parentId) ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
    return children.map((row) => ({ ...row, children: build(row.id) }));
  }

  return build(null);
}

/** Parcours en profondeur : ne renvoie que les feuilles (les vraies pages de contenu), dans l'ordre d'affichage. */
export function flattenLeaves(nodes: LessonNode[]): LessonNode[] {
  const out: LessonNode[] = [];
  for (const node of nodes) {
    if (node.children.length === 0) out.push(node);
    else out.push(...flattenLeaves(node.children));
  }
  return out;
}
