import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Mentions légales — DataLendo",
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updated="7 septembre 2026">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          La plateforme DataLendo (accessible à l&apos;adresse datalendo.com et ses sous-domaines) est
          éditée et exploitée par <strong>Eurêka Services</strong>, entreprise individuelle immatriculée
          au Registre du Commerce et du Crédit Mobilier (RCCM) sous le numéro{" "}
          <strong>CD/BKV/RCCM/21-A-00483</strong>.
        </p>
        <ul>
          <li>Responsable de la publication : Oscar Aksanti</li>
          <li>Siège : Kinshasa, République Démocratique du Congo</li>
          <li>
            Email : <a href="mailto:oscaraksanti@gmail.com">oscaraksanti@gmail.com</a>
          </li>
          <li>Téléphone : +243 97 16 01 855</li>
        </ul>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>Le site et l&apos;application sont hébergés par :</p>
        <ul>
          <li>
            <strong>Vercel Inc.</strong> — hébergement de l&apos;application web (
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>)
          </li>
          <li>
            <strong>Supabase Inc.</strong> — hébergement de la base de données et de
            l&apos;authentification (
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a>)
          </li>
        </ul>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus pédagogiques présents sur DataLendo — textes, exercices, schémas,
          vidéos, quiz, jeux de données et code fournis dans le cadre des ateliers — est la propriété
          exclusive d&apos;Eurêka Services, sauf mention contraire explicite. Toute reproduction,
          représentation, diffusion ou rediffusion, totale ou partielle, du contenu de ce site sur
          quelque support que ce soit, sans l&apos;autorisation expresse d&apos;Eurêka Services, est
          interdite et constituerait une contrefaçon.
        </p>
        <p>
          La marque « DataLendo » ainsi que les logos associés sont la propriété d&apos;Eurêka Services.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Pour toute question relative à ces mentions légales, écris à{" "}
          <a href="mailto:oscaraksanti@gmail.com">oscaraksanti@gmail.com</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
