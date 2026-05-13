import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyParticipate from "@/components/WhyParticipate";
import Parcours from "@/components/Parcours";
import Countdown from "@/components/Countdown";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
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
