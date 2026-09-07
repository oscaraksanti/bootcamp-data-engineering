import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialité — DataLendo",
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="7 septembre 2026">
      <section>
        <p>
          Cette politique explique quelles données DataLendo (exploité par Eurêka Services, RCCM
          CD/BKV/RCCM/21-A-00483) collecte, pourquoi, et comment tu peux en garder le contrôle.
        </p>
      </section>

      <section>
        <h2>1. Données collectées</h2>
        <ul>
          <li>
            <strong>À l&apos;inscription :</strong> nom, adresse email, mot de passe (stocké de façon
            chiffrée, jamais en clair).
          </li>
          <li>
            <strong>Pendant l&apos;utilisation :</strong> progression dans les modules et leçons,
            réponses et résultats aux quiz, requêtes SQL exécutées dans le bac à sable, notes
            personnelles que tu rédiges sur les leçons.
          </li>
          <li>
            <strong>À l&apos;achat :</strong> l&apos;historique de tes commandes (module ou offre
            achetée, montant, statut, date). Les données de paiement elles-mêmes (numéro de carte,
            identifiants mobile money) ne transitent jamais par nos serveurs — elles sont traitées
            directement par notre prestataire de paiement, Chariow.
          </li>
          <li>
            <strong>Certificats :</strong> si tu réussis un module, un certificat portant ton nom est
            généré avec un identifiant public, consultable par toute personne disposant du lien —
            c&apos;est le principe même d&apos;un certificat vérifiable et partageable (par exemple sur
            LinkedIn).
          </li>
        </ul>
        <p>
          DataLendo n&apos;utilise aucun outil de suivi publicitaire ou d&apos;analyse tierce. Les seuls
          cookies utilisés sont ceux, strictement nécessaires, de la session d&apos;authentification —
          ils te permettent de rester connecté et ne servent à aucun autre usage.
        </p>
      </section>

      <section>
        <h2>2. Pourquoi nous collectons ces données</h2>
        <ul>
          <li>Créer et sécuriser ton compte, et te permettre de t&apos;y connecter.</li>
          <li>Suivre ta progression et débloquer les certificats que tu as mérités.</li>
          <li>Débloquer l&apos;accès aux modules que tu as achetés.</li>
          <li>Te répondre si tu nous contactes pour une question ou un problème technique.</li>
          <li>Améliorer la plateforme (contenu, bac à sable, parcours pédagogique).</li>
        </ul>
        <p>Nous ne vendons ni ne louons tes données personnelles à qui que ce soit.</p>
      </section>

      <section>
        <h2>3. Avec qui tes données sont partagées</h2>
        <ul>
          <li>
            <strong>Supabase Inc.</strong> — hébergement de la base de données et de
            l&apos;authentification.
          </li>
          <li>
            <strong>Vercel Inc.</strong> — hébergement de l&apos;application.
          </li>
          <li>
            <strong>Chariow</strong> — traitement des paiements (nous recevons uniquement la
            confirmation d&apos;achat, jamais les données bancaires elles-mêmes).
          </li>
        </ul>
        <p>Aucune autre entité tierce n&apos;a accès à tes données.</p>
      </section>

      <section>
        <h2>4. Durée de conservation</h2>
        <p>
          Tes données sont conservées tant que ton compte reste actif. Si tu demandes la suppression de
          ton compte, tes données personnelles sont supprimées dans un délai raisonnable, à
          l&apos;exception des informations que nous devons légalement conserver (notamment l&apos;historique
          de facturation) et des certificats déjà émis, dont la vérifiabilité publique est la fonction
          même.
        </p>
      </section>

      <section>
        <h2>5. Tes droits</h2>
        <p>Tu peux à tout moment nous demander de :</p>
        <ul>
          <li>consulter les données personnelles que nous détenons sur toi ;</li>
          <li>corriger une information inexacte (par exemple ton nom) ;</li>
          <li>supprimer ton compte et les données associées ;</li>
          <li>recevoir une copie de tes données dans un format exploitable.</li>
        </ul>
        <p>
          Pour exercer l&apos;un de ces droits, écris à{" "}
          <a href="mailto:oscaraksanti@gmail.com">oscaraksanti@gmail.com</a>. Nous te répondrons dans un
          délai raisonnable.
        </p>
      </section>

      <section>
        <h2>6. Sécurité</h2>
        <p>
          L&apos;accès à la base de données est protégé par des règles de sécurité au niveau des lignes
          (chaque apprenant ne peut lire ou modifier que ses propres données), les mots de passe sont
          chiffrés, et les échanges avec la plateforme sont protégés par HTTPS.
        </p>
      </section>

      <section>
        <h2>7. Modifications de cette politique</h2>
        <p>
          Cette politique peut évoluer ; la date de dernière mise à jour est indiquée en haut de cette
          page. En cas de changement important, nous te préviendrons par email.
        </p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>
          Pour toute question relative à tes données personnelles, écris à{" "}
          <a href="mailto:oscaraksanti@gmail.com">oscaraksanti@gmail.com</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
