import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function csvEscape(value: unknown): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data: learners } = await supabase
    .from("profiles")
    .select("id, full_name, role, points, subscription_status, created_at")
    .order("created_at", { ascending: false });

  const { data: progress } = await supabase.from("progress").select("user_id");

  const header = ["Nom", "Rôle", "Points", "Statut", "Inscrit le", "Leçons terminées"];
  const rows = (learners ?? []).map((l) => [
    l.full_name ?? "",
    l.role,
    l.points,
    l.subscription_status,
    new Date(l.created_at).toISOString().slice(0, 10),
    (progress ?? []).filter((p) => p.user_id === l.id).length,
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="apprenants-datalendo-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
