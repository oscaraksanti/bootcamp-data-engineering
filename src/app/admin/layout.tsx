import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const NAV = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/modules", label: "Modules & Leçons" },
  { href: "/admin/learners", label: "Apprenants" },
  { href: "/admin/certificates", label: "Certificats" },
  { href: "/admin/posts", label: "Annonces" },
  { href: "/admin/jobs", label: "Offres d'emploi" },
  { href: "/admin/events", label: "Lives" },
  { href: "/admin/settings", label: "Paramètres" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/app");

  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="w-60 flex-none border-r border-line bg-surface px-4 py-5 hidden md:flex md:flex-col">
        <Link href="/admin" className="font-display font-bold text-ink mb-6 px-2">
          DataLendo <span className="text-ink-faint font-normal text-sm">Admin</span>
        </Link>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-soft hover:bg-surface-2 hover:text-ink rounded-lg px-3 py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-line text-xs text-ink-faint px-2">
          {profile?.full_name ?? user.email}
        </div>
        <Link href="/app" className="text-xs text-accent-ink px-2 mt-2 hover:underline">
          ← Retour à la plateforme
        </Link>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
