import Link from "next/link";
import { CURRICULUM } from "@/lib/curriculum";

export default function MarketingPage() {
  return (
    <>
      <nav className="flex items-center gap-9 px-12 py-4.5 border-b border-line">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-ink">
          <LogoMark />
          DataLendo
        </Link>
        <div className="hidden sm:flex items-center gap-6 text-sm text-ink-soft">
          <a href="#programme" className="hover:text-ink">Programme</a>
          <a href="#tarif" className="hover:text-ink">Tarif</a>
        </div>
        <div className="ml-auto flex gap-2.5">
          <Link
            href="/connexion"
            className="text-sm font-semibold text-ink border border-line-strong rounded-lg px-4 py-2 hover:border-accent"
          >
            Se connecter
          </Link>
          <Link
            href="/inscription"
            className="text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-4 py-2"
          >
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      <section className="max-w-[1180px] mx-auto grid md:grid-cols-2 gap-14 px-6 md:px-12 py-16 md:py-24 items-center">
        <div>
          <span className="inline-flex font-mono text-xs uppercase tracking-wide text-accent-ink bg-accent-soft rounded-full px-3 py-1.5 mb-5">
            Parcours francophone · 100% en ligne
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight text-balance text-ink">
            Deviens Data Engineer, du premier{" "}
            <span className="font-mono text-2xl md:text-3xl bg-surface-2 border border-line rounded-md px-1.5 text-ink-soft">
              SELECT
            </span>{" "}
            au poste dans le cloud.
          </h1>
          <p className="text-ink-soft text-lg mt-5 max-w-md">
            12 modules, plus de 375 heures de contenu exclusif, des projets réels
            et une communauté active — pensé pour l&apos;Afrique francophone.
          </p>
          <div className="flex flex-wrap gap-3.5 mt-7">
            <Link
              href="/inscription"
              className="text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-5 py-2.5"
            >
              Rejoindre le bootcamp
            </Link>
            <a
              href="#programme"
              className="text-sm font-semibold text-ink border border-line-strong rounded-lg px-5 py-2.5 hover:border-accent"
            >
              Voir le programme complet
            </a>
          </div>
          <div className="flex flex-wrap gap-6 mt-10">
            <Stat n="12" l="modules" />
            <Stat n="390h+" l="de contenu" />
            <Stat n="13" l="certificats à décrocher" />
            <Stat n="USD" l="mobile money accepté" />
          </div>
        </div>

        <div className="bg-surface border border-line rounded-2xl p-5 shadow-[0_30px_60px_-34px_rgba(20,21,43,0.28)]">
          <p className="font-display font-semibold text-ink mb-3">Module 01 — gratuit</p>
          <p className="text-sm text-ink-soft">
            Le métier de Data Engineer en profondeur : contexte, les six métiers
            de la donnée, cas concrets, outils, compétences, marché, freelance,
            et la question de l&apos;IA — sans payer un centime.
          </p>
          <Link
            href="/inscription"
            className="mt-5 inline-flex text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-4 py-2.5"
          >
            Commencer le Module 01 →
          </Link>
        </div>
      </section>

      <section id="programme" className="max-w-[1180px] mx-auto px-6 md:px-12 py-16">
        <div className="max-w-xl mb-9">
          <div className="font-mono text-xs uppercase tracking-wide text-amber mb-2.5">
            Le programme
          </div>
          <h2 className="font-display font-bold text-3xl text-ink">
            Douze modules, un seul fil conducteur
          </h2>
          <p className="text-ink-soft mt-3">
            Du métier jusqu&apos;au cloud, chaque module se termine par un
            livrable concret et un certificat.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {CURRICULUM.map((m) => (
            <div
              key={m.number}
              className="border border-line bg-surface rounded-xl px-5 py-4.5 shadow-[0_1px_2px_rgba(20,21,43,.05),0_10px_28px_-14px_rgba(20,21,43,.18)]"
            >
              <div className="font-mono text-[11px] text-ink-faint">
                MODULE {String(m.number).padStart(2, "0")}
              </div>
              <h4 className="font-semibold text-sm text-ink mt-1.5 mb-2">{m.title}</h4>
              <div className="font-mono text-xs text-accent-ink">{m.hours}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="tarif" className="bg-surface-2 py-16">
        <div className="max-w-[1180px] mx-auto px-6 md:px-12">
          <div className="max-w-xl mb-9">
            <div className="font-mono text-xs uppercase tracking-wide text-amber mb-2.5">
              Tarif
            </div>
            <h2 className="font-display font-bold text-3xl text-ink">
              Un seul accès, tout le parcours
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="bg-surface border border-line rounded-2xl w-full max-w-md p-8 shadow-[0_1px_2px_rgba(20,21,43,.05),0_10px_28px_-14px_rgba(20,21,43,.18)]">
              <div className="font-mono text-xs uppercase tracking-wide text-accent-ink">
                Accès complet
              </div>
              <div className="font-display font-bold text-4xl text-ink mt-2">
                $297 <span className="text-base font-medium text-ink-faint">/ an</span>
              </div>
              <ul className="flex flex-col gap-2.5 my-6 text-sm text-ink-soft">
                <li>✓ 12 modules, 390h+ de contenu à vie</li>
                <li>✓ Exercices corrigés, quiz et projets fil rouge</li>
                <li>✓ Communauté, classement et sessions live</li>
                <li>✓ Un certificat par module + le certificat final Data Engineer</li>
              </ul>
              <Link
                href="/inscription"
                className="flex justify-center text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg py-2.5"
              >
                Commencer par le Module 01 gratuit
              </Link>
              <div className="flex flex-wrap gap-2 mt-4.5">
                {["Orange Money", "MTN MoMo", "Wave", "Carte bancaire"].map((p) => (
                  <span
                    key={p}
                    className="font-mono text-[11px] border border-line-strong rounded-md px-2.5 py-1 text-ink-soft"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-[1180px] mx-auto px-6 md:px-12 py-7 flex justify-between text-xs text-ink-faint border-t border-line">
        <span>© 2026 DataLendo</span>
        <span>Prix affichés en dollars américains (USD)</span>
      </footer>
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <b className="block font-mono text-2xl text-ink">{n}</b>
      <span className="text-xs text-ink-faint">{l}</span>
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
