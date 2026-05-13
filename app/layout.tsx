import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Le Semi des Quais de Seine - Mars 2027",
  description: "Première édition du Semi des Quais de Seine en mars 2027. Parcours exceptionnel le long des quais de la Seine. Inscrivez-vous pour être informé et bénéficiez de 10% de réduction !",
  keywords: ["semi-marathon", "course à pied", "Seine", "Bezons", "La Frette", "running", "10km", "Île-de-France"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/logo.png", sizes: "any" },
    ],
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Le Semi des Quais de Seine - Mars 2027",
    description: "Première édition du Semi des Quais de Seine. Parcours exceptionnel le long des quais de la Seine. -10% sur votre inscription !",
    type: "website",
    locale: "fr_FR",
    images: ["/images/logo.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
