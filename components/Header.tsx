"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import EmailForm from "./EmailForm";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container-modern">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={scrolled ? "/images/logo.png" : "/images/logo-gray.png"}
                alt="Le Semi des Quais de Seine"
                width={60}
                height={60}
                className="transition-all duration-300 md:w-[75px] md:h-[75px]"
                priority
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a
                href="#parcours"
                className={`font-medium transition-colors ${
                  scrolled ? "text-navy-dark hover:text-gold" : "text-white hover:text-gold"
                }`}
              >
                Parcours
              </a>
              <a
                href="#pourquoi"
                className={`font-medium transition-colors ${
                  scrolled ? "text-navy-dark hover:text-gold" : "text-white hover:text-gold"
                }`}
              >
                Pourquoi participer
              </a>
              <a
                href="#faq"
                className={`font-medium transition-colors ${
                  scrolled ? "text-navy-dark hover:text-gold" : "text-white hover:text-gold"
                }`}
              >
                FAQ
              </a>
            </nav>

            {/* CTA Button Desktop */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-navy-dark bg-gold hover:bg-gold-light shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="whitespace-nowrap">Pré-inscription</span>
              <span className="px-3 py-1.5 bg-navy-dark text-white rounded-full text-sm font-bold whitespace-nowrap">-10%</span>
            </motion.button>

            {/* CTA Button Mobile */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileTap={{ scale: 0.95 }}
              className="md:hidden flex items-center gap-1.5 px-5 py-3 rounded-full font-semibold text-navy-dark bg-gold hover:bg-gold-light shadow-lg transition-all duration-300"
              aria-label="Pré-inscription"
            >
              <span className="text-sm whitespace-nowrap">Pré-inscription</span>
              <span className="px-2.5 py-1 bg-navy-dark text-white rounded-full text-xs font-bold whitespace-nowrap">-10%</span>
            </motion.button>
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
              className="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header avec dégradé */}
              <div className="relative bg-gradient-to-br from-navy-dark to-navy-medium p-8 text-center">
                {/* Close button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold rounded-full mb-4">
                  <svg className="w-8 h-8 text-navy-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                    <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-black text-white mb-2 uppercase" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                  Pré-inscription
                </h2>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-gold px-5 py-2 rounded-full">
                  <svg className="w-5 h-5 text-navy-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-navy-dark text-sm uppercase">Offre 1ère édition : -10%</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-gray-700 text-center mb-6 leading-relaxed">
                  Inscrivez-vous à notre newsletter et recevez <strong className="text-gold">un code promo de -10%</strong> dès l&apos;ouverture des inscriptions !
                </p>

                {/* Email Form */}
                <EmailForm variant="inline" />

                <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
                  En vous inscrivant, vous acceptez de recevoir nos communications. Vous pourrez vous désinscrire à tout moment.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
