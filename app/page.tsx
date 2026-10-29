import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Parcours from "@/components/Parcours";
import WhyParticipate from "@/components/WhyParticipate";
import Countdown from "@/components/Countdown";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { getPublicEditionState } from "@/lib/edition";

export default async function Home() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://semi-des-quais-de-seine.fr");

  const edition = await getPublicEditionState().catch(() => null);
  const registrationOpen = edition?.registrationOpen ?? false;
  const heroRaces = (edition?.races ?? []).map((r) => ({
    name: r.name,
    priceCents: r.priceCents,
    tierLabel: r.tierLabel,
    soldOut: r.soldOut,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "Semi des Quais de Seine",
    description:
      "Première édition du Semi des Quais de Seine le dimanche 29 août 2027 : semi-marathon 21,1 km et 10 km le long de la Seine, de Houilles à Cormeilles-en-Parisis.",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    startDate: "2027-08-29T09:00:00+02:00",
    image: [`${siteUrl}/images/logo.png`],
    url: siteUrl,
    location: {
      "@type": "Place",
      name: "Gare de Houilles – Carrières-sur-Seine",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Houilles",
        postalCode: "78800",
        addressRegion: "Île-de-France",
        addressCountry: "FR",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Semi des Quais de Seine",
      url: siteUrl,
    },
    ...(registrationOpen && edition
      ? {
          offers: edition.races
            .filter((r) => r.priceCents != null)
            .map((r) => ({
              "@type": "Offer",
              name: `Dossard ${r.name}`,
              price: (r.priceCents! / 100).toFixed(2),
              priceCurrency: "EUR",
              availability: r.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
              url: `${siteUrl}/inscription`,
            })),
        }
      : {}),
    keywords: "semi des quais de seine, semi marathon des quais de seine, 10 km, running ile de france, houilles, cormeilles-en-parisis",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD helps search engines understand the event entity.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header registrationOpen={registrationOpen} />
      <main className="min-h-screen">
        <Hero registrationOpen={registrationOpen} races={heroRaces} />
        <Parcours />
        <WhyParticipate />
        <Countdown />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
