import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment le Semi des Quais de Seine collecte et protège vos données personnelles : pré-inscription, inscription à la course, emails et paiements.",
  alternates: { canonical: "/confidentialite" },
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = "contact@semiquaisdeseine.fr";
const LAST_UPDATE = "16 octobre 2026";

export default function ConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="bg-navy-dark pb-12 pt-32 text-white md:pb-16 md:pt-40">
          <div className="container mx-auto px-4">
            <p className="mb-3 text-sm uppercase tracking-widest text-gold">Vos données</p>
            <h1 className="text-4xl md:text-5xl">Politique de confidentialité</h1>
            <p className="mt-4 max-w-2xl text-gray-300">
              Dernière mise à jour : {LAST_UPDATE}. Cette page explique quelles données nous collectons,
              pourquoi, combien de temps nous les conservons et quels sont vos droits.
            </p>
          </div>
        </section>

        <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
          <div className="prose-legal space-y-10 text-gray-800">
            <section>
              <h2>1. Responsable du traitement</h2>
              <p>
                Les données collectées sur le site <strong>semiquaisdeseine.fr</strong>, sur les formulaires Meta
                (Facebook et Instagram) et lors de l&rsquo;inscription à la course sont traitées par
                l&rsquo;organisateur du Semi des Quais de Seine. Pour toute question relative à vos données :{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-seine-dark underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            <section>
              <h2>2. Données collectées et finalités</h2>
              <ul>
                <li>
                  <strong>Pré-inscription (-10 %)</strong> : adresse email, et le cas échéant prénom, nom et
                  distance envisagée (formulaires Meta). Finalité : vous envoyer votre code de réduction et les
                  informations d&rsquo;ouverture des inscriptions. Base légale : votre consentement.
                </li>
                <li>
                  <strong>Inscription à la course</strong> : identité (prénom, nom, date de naissance, sexe),
                  coordonnées (email, téléphone, ville), club, nationalité, contact d&rsquo;urgence, taille de
                  t-shirt si commandé, justificatif (Parcours Prévention Santé, licence ou certificat
                  médical). Finalité : gestion de votre participation, attribution du dossard, classement,
                  sécurité sur le parcours. Base légale : exécution du contrat d&rsquo;inscription et
                  obligations légales de l&rsquo;organisateur d&rsquo;une manifestation sportive.
                </li>
                <li>
                  <strong>Paiement</strong> : traité par Stripe ; nous ne stockons aucun numéro de carte.
                  Nous conservons le montant, la date et l&rsquo;identifiant de transaction. Base légale :
                  exécution du contrat et obligations comptables.
                </li>
                <li>
                  <strong>Emails</strong> : confirmation d&rsquo;inscription, guide du coureur, informations
                  pratiques avant la course, résultats et photos. Vous pouvez vous désinscrire des
                  communications non indispensables à tout moment via le lien présent dans chaque email.
                </li>
                <li>
                  <strong>Mesure d&rsquo;audience et publicité</strong> : nous diffusons des publicités sur
                  Facebook et Instagram. Les données saisies dans un formulaire Meta sont transmises à
                  l&rsquo;organisateur et traitées conformément à la présente politique ; Meta les traite
                  également selon sa propre politique de confidentialité.
                </li>
              </ul>
            </section>

            <section>
              <h2>3. Destinataires et sous-traitants</h2>
              <p>
                Vos données sont accessibles à l&rsquo;équipe d&rsquo;organisation et, pour les seuls besoins
                décrits ci-dessus, à nos prestataires : hébergement du site (Vercel) et de la base de données
                (Neon), paiement (Stripe), envoi d&rsquo;emails et stockage de fichiers (Amazon Web Services,
                région Union européenne), chronométrage et publication des résultats, et prestataire photo
                officiel de l&rsquo;épreuve. Elles ne sont jamais vendues à des tiers.
              </p>
            </section>

            <section>
              <h2>4. Durée de conservation</h2>
              <ul>
                <li>Pré-inscription : jusqu&rsquo;à 3 ans après votre dernier contact, ou jusqu&rsquo;à votre désinscription.</li>
                <li>Inscription et classement : 3 ans après l&rsquo;édition concernée, puis archivage limité aux obligations légales.</li>
                <li>Données de facturation : 10 ans (obligation comptable).</li>
              </ul>
            </section>

            <section>
              <h2>5. Vos droits</h2>
              <p>
                Conformément au Règlement général sur la protection des données (RGPD) et à la loi
                Informatique et Libertés, vous disposez d&rsquo;un droit d&rsquo;accès, de rectification,
                d&rsquo;effacement, de limitation, d&rsquo;opposition et de portabilité de vos données, ainsi
                que du droit de retirer votre consentement à tout moment. Pour les exercer, écrivez à{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-seine-dark underline">
                  {CONTACT_EMAIL}
                </a>
                . Vous pouvez également introduire une réclamation auprès de la CNIL (
                <a href="https://www.cnil.fr" className="text-seine-dark underline" rel="noopener noreferrer" target="_blank">
                  cnil.fr
                </a>
                ).
              </p>
            </section>

            <section>
              <h2>6. Cookies</h2>
              <p>
                Le site n&rsquo;utilise que les cookies strictement nécessaires à son fonctionnement (session
                de l&rsquo;espace d&rsquo;administration, paiement Stripe). Aucun cookie publicitaire
                n&rsquo;est déposé sans votre consentement.
              </p>
            </section>

            <section>
              <h2>7. Sécurité</h2>
              <p>
                Les échanges avec le site sont chiffrés (HTTPS), les accès à la base de données sont
                restreints et les paiements sont confiés à Stripe, certifié PCI-DSS.
              </p>
            </section>

            <p className="pt-4 text-sm text-gray-500">
              <Link href="/" className="text-seine-dark underline">
                Retour à l&rsquo;accueil
              </Link>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
