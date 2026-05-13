import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyParticipate from "@/components/WhyParticipate";
import Parcours from "@/components/Parcours";
import Countdown from "@/components/Countdown";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://semi-des-quais-de-seine.fr");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "Semi des Quais de Seine",
    description:
      "Premiere edition du Semi des Quais de Seine en mars 2027. Course semi-marathon 21,1 km et 10 km.",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    startDate: "2027-03-01T09:00:00+01:00",
    image: [`${siteUrl}/images/logo.png`],
    url: siteUrl,
    location: {
      "@type": "Place",
      name: "Quais de Seine",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Ile-de-France",
        addressCountry: "FR",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Semi des Quais de Seine",
      url: siteUrl,
    },
    keywords: "semi des quais de seine, semi marathon des quais de seine, 10 km, running ile de france",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD helps search engines understand the event entity.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen">
        <Hero />
        <WhyParticipate />
        <Parcours />
        <Countdown />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
