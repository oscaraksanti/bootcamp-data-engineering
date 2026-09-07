import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Conditions générales de vente — DataLendo",
};

export default function CGVPage() {
  return (
    <LegalLayout title="Conditions générales de vente" updated="7 septembre 2026">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions générales de vente (CGV) régissent la vente, par{" "}
          <strong>Eurêka Services</strong> (RCCM CD/BKV/RCCM/21-A-00483, ci-après « DataLendo » ou
          « nous »), de l&apos;accès aux modules de formation en ligne proposés sur la plateforme
          DataLendo, à toute personne physique agissant à titre non professionnel ou professionnel
          (ci-après « l&apos;apprenant » ou « tu »). Toute commande passée sur DataLendo implique
          l&apos;acceptation pleine et entière des présentes CGV.
        </p>
      </section>

      <section>
        <h2>2. Offres et tarifs</h2>
        <ul>
          <li>
            <strong>Module 01 — gratuit :</strong> accès permanent et sans frais au premier module du
            parcours.
          </li>
          <li>
            <strong>Module à la carte — 30 $ :</strong> accès à vie au module acheté, sans limite de
            durée ni renouvellement.
          </li>
          <li>
            <strong>Accès complet — 297 $/an :</strong> accès à l&apos;ensemble des modules publiés,
            y compris ceux publiés après la souscription, pour une durée de douze mois à compter du
            paiement. L&apos;accès n&apos;est pas renouvelé automatiquement ; il redevient limité à
            l&apos;expiration de la période, sauf nouvel achat.
          </li>
        </ul>
        <p>
          Tous les prix sont indiqués et facturés en <strong>dollars américains (USD)</strong>, toutes
          taxes comprises le cas échéant. DataLendo se réserve le droit de modifier ses tarifs à tout
          moment ; le prix applicable à une commande est celui affiché au moment du paiement.
        </p>
      </section>

      <section>
        <h2>3. Commande et paiement</h2>
        <p>
          Le paiement s&apos;effectue en ligne, au moment de la commande, via notre prestataire de
          paiement <strong>Chariow</strong>, qui accepte notamment le mobile money (Orange Money, MTN
          MoMo, Wave) et la carte bancaire. DataLendo ne collecte ni ne stocke aucune donnée de
          paiement (numéro de carte, identifiants mobile money) — ces informations sont traitées
          exclusivement par Chariow et les établissements financiers concernés.
        </p>
        <p>
          L&apos;accès au module ou à l&apos;offre acheté est débloqué automatiquement dès confirmation
          du paiement par Chariow. En cas de difficulté d&apos;accès après un paiement confirmé,
          contacte-nous à l&apos;adresse indiquée à l&apos;article 9.
        </p>
      </section>

      <section>
        <h2>4. Absence de droit de rétractation — vente ferme</h2>
        <p>
          Le contenu vendu sur DataLendo est un contenu numérique dont l&apos;accès est mis à
          disposition immédiatement après le paiement. En achetant un module ou l&apos;accès complet,
          <strong> l&apos;apprenant reconnaît et accepte expressément qu&apos;aucun remboursement ne
          sera accordé</strong>, quel qu&apos;en soit le motif — y compris en cas de changement d&apos;avis,
          de manque de temps pour suivre la formation, ou d&apos;insatisfaction quant au contenu. Toute
          vente est donc ferme et définitive dès sa confirmation.
        </p>
      </section>

      <section>
        <h2>5. Accès aux contenus</h2>
        <p>
          L&apos;accès aux modules est strictement personnel et nominatif. Le partage d&apos;identifiants
          de connexion, la revente ou la redistribution des contenus à des tiers sont interdits et
          peuvent entraîner la suspension immédiate du compte, sans remboursement.
        </p>
        <p>
          DataLendo s&apos;efforce d&apos;assurer un accès continu à la plateforme mais ne garantit pas
          une disponibilité ininterrompue (maintenance, incident technique, cas de force majeure).
        </p>
      </section>

      <section>
        <h2>6. Certificats</h2>
        <p>
          À l&apos;issue de chaque module, un quiz de validation permet d&apos;obtenir un{" "}
          <strong>certificat de réussite délivré par DataLendo</strong>. Ce certificat atteste que
          l&apos;apprenant a suivi le module et réussi l&apos;évaluation associée avec un score d&apos;au
          moins 80 %. Il s&apos;agit d&apos;une attestation interne à DataLendo : elle ne constitue ni
          un diplôme, ni un titre accrédité par un État ou un organisme de certification officiel, et
          n&apos;engage DataLendo à aucun résultat en matière d&apos;embauche ou d&apos;évolution
          professionnelle.
        </p>
      </section>

      <section>
        <h2>7. Compte utilisateur</h2>
        <p>
          La création d&apos;un compte nécessite une adresse email valide. L&apos;apprenant est
          responsable de la confidentialité de ses identifiants. DataLendo se réserve le droit de
          suspendre ou clôturer tout compte en cas de non-respect des présentes CGV, sans que cela
          n&apos;ouvre droit à un quelconque remboursement des sommes déjà versées.
        </p>
      </section>

      <section>
        <h2>8. Responsabilité</h2>
        <p>
          DataLendo met tout en œuvre pour fournir un contenu pédagogique de qualité et à jour, sans
          toutefois garantir un résultat précis (réussite professionnelle, obtention d&apos;un emploi,
          niveau de compétence atteint), qui dépend notamment de l&apos;investissement personnel de
          l&apos;apprenant. La responsabilité de DataLendo ne saurait être engagée au-delà des sommes
          effectivement versées par l&apos;apprenant.
        </p>
      </section>

      <section>
        <h2>9. Modification des CGV</h2>
        <p>
          DataLendo peut modifier les présentes CGV à tout moment. La version applicable est celle en
          vigueur à la date de la commande. Les modifications substantielles seront signalées sur cette
          page, avec mise à jour de la date en haut de ce document.
        </p>
      </section>

      <section>
        <h2>10. Droit applicable et litiges</h2>
        <p>
          Les présentes CGV sont soumises au droit de la République Démocratique du Congo. Tout litige
          relatif à leur interprétation ou leur exécution relève de la compétence exclusive des
          tribunaux de Kinshasa, RD Congo, à défaut de résolution amiable préalable.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Pour toute question relative à une commande, écris à{" "}
          <a href="mailto:oscaraksanti@gmail.com">oscaraksanti@gmail.com</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
