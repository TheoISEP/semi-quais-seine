import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmailForm from "@/components/EmailForm";
import { getPublicEditionState } from "@/lib/edition";
import { formatEuros } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "Inscrivez-vous au Semi des Quais de Seine 2027 : semi-marathon 21,1 km ou 10 km le long de la Seine, le dimanche 28 février 2027.",
  alternates: { canonical: "/inscription" },
};

export default async function InscriptionPage() {
  const edition = await getPublicEditionState().catch(() => null);
  const open = edition?.registrationOpen ?? false;

  return (
    <>
      <Header registrationOpen={open} />
      <main className="min-h-screen bg-white">
        <section className="bg-navy-dark pb-12 pt-32 text-white md:pb-16 md:pt-40">
          <div className="container mx-auto px-4">
            <p className="mb-3 text-sm uppercase tracking-widest text-gold">Dimanche 28 février 2027</p>
            <h1 className="text-4xl md:text-5xl">{open ? "Inscription" : "Inscriptions bientôt ouvertes"}</h1>
            <p className="mt-4 max-w-2xl text-gray-300">
              {open
                ? "Choisissez votre distance : semi-marathon (21,1 km) ou 10 km, 100 % le long de la Seine, de Houilles à Cormeilles-en-Parisis."
                : "Laissez votre email : vous recevrez votre code -10 % dès l'ouverture des inscriptions."}
            </p>
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
          {open && edition ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {edition.races.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-2xl md:text-3xl">{r.name}</h2>
                    <p className="mt-1 text-gray-600">
                      {r.distanceKm.toLocaleString("fr-FR")} km
                      {r.startTime && ` · départ ${r.startTime}`}
                    </p>
                    <p className="mt-4 text-3xl font-bold text-navy-dark" style={{ fontFamily: "var(--font-bebas)" }}>
                      {r.soldOut || r.priceCents == null ? "Complet" : formatEuros(r.priceCents)}
                    </p>
                    {!r.soldOut && r.tierLabel && (
                      <p className="text-sm text-gold">
                        {r.tierLabel}
                        {r.remainingAtPrice != null && ` — plus que ${r.remainingAtPrice} à ce tarif`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-gray-50 p-6 text-center text-gray-700">
                <p className="font-semibold">Le formulaire d&rsquo;inscription en ligne est en cours de mise en place.</p>
                <p className="mt-1 text-sm">Revenez dans quelques instants, ou laissez votre email pour être prévenu.</p>
                <div className="mx-auto mt-4 max-w-md">
                  <EmailForm variant="inline" />
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-xl space-y-6 text-center">
              <div className="rounded-2xl border border-gray-200 p-6 shadow-sm md:p-8">
                <p className="mb-2 inline-block rounded-full bg-gold px-4 py-1 text-sm font-bold uppercase text-navy-dark">
                  Offre 1ère édition : -10 %
                </p>
                <p className="mb-6 text-gray-700">
                  Inscrivez-vous à la newsletter et recevez un code promo de -10 % sur votre dossard dès l&rsquo;ouverture des
                  inscriptions.
                </p>
                <EmailForm variant="inline" />
              </div>
              <p className="text-sm text-gray-500">
                <Link href="/" className="text-seine-dark underline">
                  Retour à l&rsquo;accueil
                </Link>
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
