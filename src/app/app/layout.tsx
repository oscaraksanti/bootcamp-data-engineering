import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name, streak_count")
        .eq("id", user.id)
        .single()
    : { data: null };

  const initials = (profile?.full_name || user?.email || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <div className="flex items-center gap-7 px-6 h-[60px] border-b border-line bg-surface">
        <Link href="/app" className="flex items-center gap-2 font-display font-bold text-ink text-[15.5px]">
          <LogoMark />
          DataLendo
        </Link>
        <Link href="/app/sandbox" className="text-[13.5px] text-ink-soft hover:text-ink">
          Bac à sable SQL
        </Link>
        <Link href="/app#certificats" className="text-[13.5px] text-ink-soft hover:text-ink">
          Mes certificats
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-mono text-xs text-ink-soft">
            <FlameIcon />
            {profile?.streak_count ?? 0} jours
          </span>
          <div className="w-[30px] h-[30px] rounded-full bg-accent flex items-center justify-center text-white text-xs font-semibold font-display">
            {initials}
          </div>
          <form action={signOut}>
            <button className="text-xs text-ink-faint hover:text-ink" type="submit">
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="10" r="5" fill="#6C5CE7" />
      <circle cx="9" cy="14" r="3.4" fill="#6C5CE7" opacity=".75" />
      <circle cx="23" cy="14" r="3.4" fill="#6C5CE7" opacity=".75" />
      <rect x="14.5" y="14" width="3" height="13" rx="1.5" fill="#6C5CE7" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1c1 2.2-2.5 3.4-2.5 6a2.5 2.5 0 005 0c.6.7 1 1.6 1 2.5a3.5 3.5 0 01-7 0C4.5 6.8 6.8 5 8 1z"
        fill="var(--amber)"
      />
    </svg>
  );
}
