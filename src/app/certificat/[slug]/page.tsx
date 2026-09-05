import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CertificateCard } from "@/components/certificate/CertificateCard";
import { ShareBar } from "@/components/certificate/ShareBar";
import { buildLinkedInAddUrl, buildShareUrls, generateQrSvg } from "@/lib/certificate";

const DEFAULT_BLURB =
  "L'apprenant a démontré, quiz à l'appui, sa maîtrise des compétences couvertes par ce module du parcours Data Engineer de DataLendo.";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: cert } = await supabase
    .from("certificates")
    .select("issued_at, module_id, user_id, public_slug")
    .eq("public_slug", slug)
    .single();
  if (!cert) notFound();

  const [{ data: profile }, moduleResult, { data: settings }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", cert.user_id).single(),
    cert.module_id
      ? supabase
          .from("modules")
          .select("title, number, certificate_blurb")
          .eq("id", cert.module_id)
          .single()
      : Promise.resolve({ data: null }),
    supabase.from("platform_settings").select("certificate_location").eq("id", true).maybeSingle(),
  ]);
  const courseModule = moduleResult.data;

  const issuedAt = new Date(cert.issued_at);
  const issuedDate = issuedAt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const learnerName = profile?.full_name || "Apprenant·e DataLendo";
  const certificationName = courseModule
    ? `Data Engineering — ${courseModule.title}`
    : "Certificat Data Engineer — DataLendo";

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const certUrl = `${origin}/certificat/${slug}`;

  const [qrSvg] = await Promise.all([generateQrSvg(certUrl)]);

  const linkedInUrl = buildLinkedInAddUrl({
    certificationName,
    organizationName: "DataLendo",
    issuedAt,
    certUrl,
    certId: slug,
  });
  const shareUrls = buildShareUrls(certUrl, `${learnerName} a obtenu : ${certificationName}`);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-surface-2">
      <div className="w-full max-w-3xl">
        <CertificateCard
          id="certificate-card"
          learnerName={learnerName}
          moduleNumber={courseModule?.number ?? null}
          moduleTitle={courseModule?.title ?? null}
          blurb={courseModule?.certificate_blurb || DEFAULT_BLURB}
          issuedDate={issuedDate}
          location={settings?.certificate_location ?? null}
          certId={slug}
          qrSvg={qrSvg}
        />
      </div>

      <ShareBar
        targetId="certificate-card"
        certUrl={certUrl}
        linkedInUrl={linkedInUrl}
        shareUrls={shareUrls}
        fileName={`certificat-datalendo-${slug}.png`}
      />
    </div>
  );
}
