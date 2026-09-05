import { Playfair_Display, Petit_Formal_Script } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
  style: ["italic"],
  variable: "--font-certificate-title",
});

const signatureFont = Petit_Formal_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature",
});

export function CertificateCard({
  id,
  learnerName,
  moduleNumber,
  moduleTitle,
  blurb,
  issuedDate,
  location,
  certId,
  qrSvg,
}: {
  id: string;
  learnerName: string;
  moduleNumber: number | null;
  moduleTitle: string | null;
  blurb: string;
  issuedDate: string;
  location: string | null;
  certId: string;
  qrSvg: string;
}) {
  return (
    <div
      id={id}
      className={`${playfair.variable} ${signatureFont.variable} relative w-full aspect-[14/10] bg-surface text-ink overflow-hidden rounded-lg`}
      style={{ boxShadow: "0 40px 80px -40px rgba(20,21,43,.35)" }}
    >
      {/* Cadre double */}
      <div className="absolute inset-3 border-2 border-accent rounded-md pointer-events-none" />
      <div className="absolute inset-[18px] border border-accent/40 rounded-md pointer-events-none" />

      {/* Filigrane */}
      <svg
        className="absolute -right-16 -bottom-20 opacity-[0.05] pointer-events-none"
        width="420"
        height="420"
        viewBox="0 0 32 32"
        fill="none"
      >
        <circle cx="16" cy="10" r="5" fill="#6C5CE7" />
        <circle cx="9" cy="14" r="3.4" fill="#6C5CE7" />
        <circle cx="23" cy="14" r="3.4" fill="#6C5CE7" />
        <rect x="14.5" y="14" width="3" height="13" rx="1.5" fill="#6C5CE7" />
      </svg>

      <div className="relative h-full flex flex-col items-center text-center px-10 sm:px-16 py-8 sm:py-10">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="10" r="5" fill="#6C5CE7" />
            <circle cx="9" cy="14" r="3.4" fill="#6C5CE7" opacity=".75" />
            <circle cx="23" cy="14" r="3.4" fill="#6C5CE7" opacity=".75" />
            <rect x="14.5" y="14" width="3" height="13" rx="1.5" fill="#6C5CE7" />
          </svg>
          <span className="font-display font-bold text-ink text-sm sm:text-base">DataLendo</span>
        </div>

        <div
          className="text-3xl sm:text-5xl text-accent-ink mb-1 sm:mb-2"
          style={{ fontFamily: "var(--font-certificate-title)", fontStyle: "italic", fontWeight: 600 }}
        >
          Certificat
        </div>
        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-wide text-ink-faint mb-4 sm:mb-6">
          décerné à
        </p>

        <h1 className="font-display font-bold text-xl sm:text-3xl text-ink mb-4 sm:mb-6">{learnerName}</h1>

        <p className="text-ink-soft text-[11px] sm:text-sm max-w-lg leading-relaxed mb-auto">
          Pour avoir suivi avec succès{" "}
          {moduleTitle ? (
            <>
              le Module {String(moduleNumber).padStart(2, "0")} —{" "}
              <strong className="text-ink">{moduleTitle}</strong>
            </>
          ) : (
            <strong className="text-ink">le programme complet Data Engineer</strong>
          )}
          .
          <br />
          {blurb}
        </p>

        <div className="w-full flex items-end justify-between mt-6 sm:mt-8">
          <div className="text-left">
            <p className="font-mono text-[10px] sm:text-xs text-ink-faint">
              {location ? `Fait à ${location}, le ` : ""}
              {issuedDate}
            </p>
          </div>

          <div
            className="w-14 h-14 sm:w-16 sm:h-16 [&_svg]:w-full [&_svg]:h-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />

          <div className="text-right">
            <p
              className="text-lg sm:text-2xl text-accent-ink leading-none"
              style={{ fontFamily: "var(--font-signature)" }}
            >
              Oscar Aksanti
            </p>
            <div className="w-32 sm:w-40 border-t border-line-strong mt-1 pt-1 ml-auto">
              <p className="font-mono text-[9px] sm:text-[10px] text-ink-faint">
                Oscar Aksanti
                <br />
                Lead Instructor, Data and AI Instructor
              </p>
            </div>
          </div>
        </div>

        <p className="font-mono text-[9px] sm:text-[10px] text-ink-faint mt-4 sm:mt-5">
          ID. CERTIFICAT — {certId}
        </p>
      </div>
    </div>
  );
}
