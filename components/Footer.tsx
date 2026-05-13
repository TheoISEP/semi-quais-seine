"use client";

import EmailForm from "./EmailForm";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Logo and Description */}
          <div>
            <Image
              src="/images/logo-gray.png"
              alt="Le Semi des Quais de Seine"
              width={180}
              height={180}
              className="mb-4 opacity-80"
            />
            <p className="text-gray-300 mb-4">
              La première édition du Semi des Quais de Seine aura lieu en mars 2027.
              Une course exceptionnelle le long de la Seine.
            </p>
            <div className="flex items-center gap-2 text-gold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Mars 2027</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gold">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#parcours"
                  className="text-gray-300 hover:text-gold transition-colors inline-block"
                >
                  Le Parcours
                </a>
              </li>
              <li>
                <a
                  href="#pourquoi"
                  className="text-gray-300 hover:text-gold transition-colors inline-block"
                >
                  Pourquoi Participer
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-300 hover:text-gold transition-colors inline-block"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold text-gold">Restez informé</h3>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">-10%</span>
            </div>
            <p className="text-gray-300 mb-4">
              Inscrivez-vous maintenant et <strong className="text-gold">bénéficiez d&apos;une réduction de 10%</strong> valable sur votre inscription !
            </p>
            <EmailForm variant="footer" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Race Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gold mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Lieu</span>
            </div>
            <p className="text-gray-300">
              Bezons - La Frette-sur-Seine
              <br />
              Quais de Seine, Île-de-France
            </p>
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gold mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Date</span>
            </div>
            <p className="text-gray-300">
              Mars 2027
              <br />
              Date précise à venir
            </p>
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gold mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Distances</span>
            </div>
            <p className="text-gray-300">
              Semi-marathon (21,1 km)
              <br />
              10 kilomètres
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Le Semi des Quais de Seine. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Première édition • Mars 2027
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
