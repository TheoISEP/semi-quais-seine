"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import EmailForm from "./EmailForm";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Le Semi des Quais de Seine"
                width={60}
                height={60}
                className="transition-all duration-300 md:w-[80px] md:h-[80px]"
                priority
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#parcours"
                className="font-medium transition-colors hover:text-gold text-navy-dark"
              >
                Parcours
              </a>
              <a
                href="#pourquoi"
                className="font-medium transition-colors hover:text-gold text-navy-dark"
              >
                Pourquoi participer
              </a>
              <a
                href="#faq"
                className="font-medium transition-colors hover:text-gold text-navy-dark"
              >
                FAQ
              </a>
            </nav>

            {/* CTA Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <span>Pré-inscription</span>
              <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">-10%</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="md:hidden flex items-center gap-1.5 bg-gold hover:bg-gold-light text-navy-dark font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
              aria-label="Pré-inscription"
            >
              <span className="text-sm">Pré-inscription</span>
              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse font-bold">-10%</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Modal for Pre-registration */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="text-center mb-4 md:mb-6">
                <div className="inline-block bg-gold/10 rounded-full p-2 md:p-3 mb-3 md:mb-4">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                    <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy-dark mb-2">
                  Pré-inscription
                </h2>
                <div className="inline-flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-3 md:mb-4">
                  <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-xs md:text-base whitespace-nowrap">1ère édition : -10%</span>
                </div>
                <p className="text-gray-700 text-base md:text-lg px-2">
                  Inscrivez-vous maintenant à notre newsletter et <strong className="text-gold">bénéficiez d&apos;une réduction de 10%</strong> sur votre inscription au Semi des Quais de Seine !
                </p>
              </div>

              {/* Email Form */}
              <EmailForm variant="hero" />

              <p className="mt-4 text-xs text-gray-500 text-center">
                En vous inscrivant, vous acceptez de recevoir nos communications. Vous pourrez vous désinscrire à tout moment.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
