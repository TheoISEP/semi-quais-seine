import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://semi-des-quais-de-seine.fr");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Semi des Quais de Seine 2027 | Semi-marathon et 10 km",
    template: "%s | Semi des Quais de Seine",
  },
  description:
    "Le Semi des Quais de Seine arrive en mars 2027 : semi-marathon 21,1 km et 10 km le long de la Seine. Inscrivez-vous pour etre informe et profiter de -10%.",
  keywords: [
    "semi des quais de seine",
    "semi marathon des quais de seine",
    "semi-marathon quais de seine",
    "course a pied seine",
    "semi marathon ile de france",
    "10 km quais de seine",
    "running bezons",
    "la frette course",
  ],
  alternates: {
    canonical: "/",
  },
  applicationName: "Semi des Quais de Seine",
  category: "sports",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/logo.png", sizes: "any" },
    ],
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Semi des Quais de Seine 2027",
    description:
      "Semi-marathon 21,1 km et course 10 km le long des quais de la Seine en mars 2027. Inscriptions et offre de lancement -10%.",
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Semi des Quais de Seine",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: "Logo Semi des Quais de Seine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Semi des Quais de Seine 2027",
    description:
      "Semi-marathon et 10 km sur les quais de la Seine. Recevez les infos d'inscription en priorite.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${bebasNeue.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
