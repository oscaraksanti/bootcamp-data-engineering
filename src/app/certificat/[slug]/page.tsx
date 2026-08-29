import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: cert } = await supabase
    .from("certificates")
    .select("issued_at, module_id, user_id")
    .eq("public_slug", slug)
    .single();
  if (!cert) notFound();

  const [{ data: profile }, moduleResult] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", cert.user_id).single(),
    cert.module_id
      ? supabase.from("modules").select("title, number").eq("id", cert.module_id).single()
      : Promise.resolve({ data: null }),
  ]);
  const courseModule = moduleResult.data;

  const issuedDate = new Date(cert.issued_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16 bg-surface-2">
      <div className="w-full max-w-2xl bg-surface border border-line rounded-2xl px-10 py-12 text-center shadow-[0_30px_60px_-30px_rgba(20,21,43,0.3)]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <LogoMark />
          <span className="font-display font-bold text-ink">DataLendo</span>
        </div>

        <div className="font-mono text-xs uppercase tracking-wide text-accent-ink mb-3">
          Certificat de réussite
        </div>
        <h1 className="font-display font-bold text-3xl text-ink mb-2">
          {profile?.full_name || "Apprenant·e DataLendo"}
        </h1>
        <p className="text-ink-soft mb-8">
          a validé{" "}
          {courseModule ? (
            <>
              le Module {String(courseModule.number).padStart(2, "0")} —{" "}
              <strong className="text-ink">{courseModule.title}</strong>
            </>
          ) : (
            <strong className="text-ink">le programme complet DataLendo — Data Engineer</strong>
          )}
        </p>

        <div className="font-mono text-xs text-ink-faint">Délivré le {issuedDate}</div>
        <div className="font-mono text-[11px] text-ink-faint mt-1">
          Vérifiable à cette adresse — code {slug}
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="10" r="5" fill="#6C5CE7" />
      <circle cx="9" cy="14" r="3.4" fill="#6C5CE7" opacity=".75" />
      <circle cx="23" cy="14" r="3.4" fill="#6C5CE7" opacity=".75" />
      <rect x="14.5" y="14" width="3" height="13" rx="1.5" fill="#6C5CE7" />
    </svg>
  );
}
