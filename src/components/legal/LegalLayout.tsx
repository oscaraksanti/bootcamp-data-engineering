import Link from "next/link";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="flex items-center gap-9 px-6 md:px-12 py-4.5 border-b border-line">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-ink">
          <LogoMark />
          DataLendo
        </Link>
        <Link href="/" className="ml-auto text-sm text-ink-soft hover:text-ink">
          ← Retour au site
        </Link>
      </nav>

      <main className="max-w-[720px] mx-auto px-6 md:px-12 py-14 md:py-16">
        <h1 className="font-display font-bold text-3xl text-ink mb-1.5">{title}</h1>
        <p className="font-mono text-xs text-ink-faint mb-10">Dernière mise à jour : {updated}</p>
        <div className="flex flex-col gap-6 text-[15px] leading-relaxed text-ink-soft [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-lg [&_h2]:text-ink [&_h2]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_strong]:text-ink [&_strong]:font-semibold [&_a]:text-accent-ink [&_a]:underline">
          {children}
        </div>
      </main>

      <footer className="max-w-[1180px] mx-auto px-6 md:px-12 py-7 flex flex-wrap gap-x-6 gap-y-2 justify-between text-xs text-ink-faint border-t border-line">
        <span>© 2026 Eurêka Services — DataLendo</span>
        <div className="flex gap-5">
          <Link href="/mentions-legales" className="hover:text-ink">Mentions légales</Link>
          <Link href="/cgv" className="hover:text-ink">CGV</Link>
          <Link href="/confidentialite" className="hover:text-ink">Confidentialité</Link>
        </div>
      </footer>
    </>
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
